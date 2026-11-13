//
// Runs the eval cases of the Saipem DS skill with Claude Code in headless mode and grades the files they produce
// deterministically: every file listed in evals/checks.json must exist, pass `ds.mjs validate` with 0 errors and
// match the case's mustMatch / mustNotMatch patterns.
//
//   node scripts/skills/run-evals.mjs [--case <name>] [--runs <n>] [--baseline] [--model <id>] [--keep]
//
//   --baseline  also run every case without the skill (skills disabled) to measure what the skill adds
//   --keep      keep the temporary workspaces (paths are printed) to inspect what the agent wrote
//
// Every run is a real, billed Claude Code session on your account. Results are written to
// skills/saipem-ds/evals/results/ (git-ignored).
//
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const root = process.cwd();
const skillDir = path.join(root, 'skills/saipem-ds');
const evalDir = path.join(skillDir, 'evals');
const ds = path.join(skillDir, 'scripts/ds.mjs');
const { cases: checks } = JSON.parse(fs.readFileSync(path.join(evalDir, 'checks.json'), 'utf8'));

const args = process.argv.slice(2);
const option = name => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const onlyCase = option('--case');
const runs = Number(option('--runs') || 1);
const model = option('--model');
const withBaseline = args.includes('--baseline');
const keep = args.includes('--keep');

function readPrompt(caseDir) {
  const text = fs.readFileSync(path.join(caseDir, 'prompt.md'), 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  const settings = match ? match[1] : '';
  return {
    prompt: (match ? text.slice(match[0].length) : text).trim(),
    timeoutSeconds: Number((settings.match(/timeout_seconds:\s*(\d+)/) || [])[1] || 900),
    maxTurns: Number((settings.match(/max_turns:\s*(\d+)/) || [])[1] || 40)
  };
}

function copyDir(from, to, skip = () => false) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (skip(entry.name)) continue;
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest, skip);
    else fs.copyFileSync(src, dest);
  }
}

function grade(workspace, check) {
  const failures = [];
  let errors = 0;
  for (const rel of check.files) {
    const file = path.join(workspace, rel);
    if (!fs.existsSync(file)) {
      failures.push(`${rel} was not created`);
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    const result = spawnSync('node', [ds, 'validate', file, '--json'], { encoding: 'utf8' });
    const report = JSON.parse(result.stdout);
    errors += report.summary.errors;
    for (const r of report.results.filter(x => x.level === 'ERR')) failures.push(`${rel}:${r.line} ${r.message}`);
    for (const re of check.mustMatch || []) if (!new RegExp(re).test(content)) failures.push(`${rel} lacks /${re}/`);
    for (const re of check.mustNotMatch || [])
      if (new RegExp(re).test(content)) failures.push(`${rel} contains /${re}/`);
  }
  return { passed: failures.length === 0, validatorErrors: errors, failures };
}

function runCase(name, arm) {
  const caseDir = path.join(evalDir, name);
  const { prompt, timeoutSeconds, maxTurns } = readPrompt(caseDir);
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `saipem-ds-eval-${name}-`));
  if (fs.existsSync(path.join(caseDir, 'files'))) copyDir(path.join(caseDir, 'files'), workspace);
  if (arm === 'with-skill') {
    copyDir(skillDir, path.join(workspace, '.claude/skills/saipem-ds'), entry => entry === 'evals');
  }

  const cliArgs = [
    '-p',
    prompt,
    '--output-format',
    'json',
    '--no-session-persistence',
    '--max-turns',
    String(maxTurns),
    '--permission-mode',
    'acceptEdits',
    '--allowedTools',
    'Read',
    'Write',
    'Edit',
    'Glob',
    'Grep',
    'Skill',
    'Bash(node:*)'
  ];
  if (arm === 'baseline') cliArgs.push('--disable-slash-commands');
  if (model) cliArgs.push('--model', model);

  const started = Date.now();
  const result = spawnSync('claude', cliArgs, {
    cwd: workspace,
    encoding: 'utf8',
    timeout: timeoutSeconds * 1000,
    maxBuffer: 64 * 1024 * 1024
  });
  let output = {};
  try {
    output = JSON.parse(result.stdout);
  } catch {
    output = { result: result.stdout, error: result.stderr || result.error?.message };
  }
  const graded = grade(workspace, checks[name]);
  if (!keep) fs.rmSync(workspace, { recursive: true, force: true });
  return {
    case: name,
    arm,
    ...graded,
    seconds: Math.round((Date.now() - started) / 1000),
    costUsd: output.total_cost_usd ?? null,
    answer: typeof output.result === 'string' ? output.result.slice(0, 2000) : null,
    ...(keep ? { workspace } : {}),
    ...(result.status !== 0 ? { exitCode: result.status, stderr: (result.stderr || '').slice(0, 2000) } : {})
  };
}

const names = Object.keys(checks).filter(n => !onlyCase || n === onlyCase);
if (!names.length) {
  console.error(`No case named "${onlyCase}". Cases: ${Object.keys(checks).join(', ')}`);
  process.exit(2);
}
const arms = withBaseline ? ['with-skill', 'baseline'] : ['with-skill'];
const results = [];
for (const name of names) {
  for (const arm of arms) {
    for (let run = 1; run <= runs; run++) {
      process.stdout.write(`${name} [${arm}] run ${run}/${runs}… `);
      const r = runCase(name, arm);
      results.push(r);
      console.log(`${r.passed ? 'PASS' : 'FAIL'} (${r.validatorErrors} validator errors, ${r.seconds}s)`);
      for (const f of r.failures.slice(0, 8)) console.log(`    - ${f}`);
      if (r.workspace) console.log(`    workspace: ${r.workspace}`);
    }
  }
}

console.log('\nSummary');
for (const arm of arms) {
  const mine = results.filter(r => r.arm === arm);
  const passed = mine.filter(r => r.passed).length;
  const errors = mine.reduce((sum, r) => sum + r.validatorErrors, 0);
  const cost = mine.reduce((sum, r) => sum + (r.costUsd || 0), 0);
  console.log(`  ${arm.padEnd(10)} ${passed}/${mine.length} passed · ${errors} validator errors · $${cost.toFixed(2)}`);
}

const outDir = path.join(evalDir, 'results');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `run-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
fs.writeFileSync(
  outFile,
  JSON.stringify({ date: new Date().toISOString(), model: model || 'default', results }, null, 2)
);
console.log(`\nDetails: ${path.relative(root, outFile)}`);
process.exitCode = results.filter(r => r.arm === 'with-skill').every(r => r.passed) ? 0 : 1;
