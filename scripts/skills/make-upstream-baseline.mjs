//
// Builds scripts/skills/upstream-baseline.json: a compact snapshot of the public API of the original Shoelace release
// this DS was forked from. The skill generator compares the fork against it, to list what differs from what AI
// models already "know" about Shoelace.
//
// The snapshot only needs to be rebuilt if the fork is rebased on a newer upstream release:
//
//   BASE=25bd8ec7   # last upstream commit before the fork
//   git archive $BASE src package.json custom-elements-manifest.config.js tsconfig.json | tar -x -C /tmp/upstream
//   (cd /tmp/upstream && ln -s "$OLDPWD/node_modules" node_modules && npx cem analyze --litelement --outdir out)
//   node scripts/skills/make-upstream-baseline.mjs /tmp/upstream/out/custom-elements.json $BASE
//
import fs from 'fs';
import path from 'path';
import { baselineElement, elementsOf } from './lib/manifest.mjs';

const [manifestPath, commit = 'unknown'] = process.argv.slice(2);
if (!manifestPath) {
  console.error('Usage: node scripts/skills/make-upstream-baseline.mjs <upstream custom-elements.json> [commit]');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const elements = elementsOf(manifest);
const baseline = {
  description: 'Public API of the upstream Shoelace release this DS was forked from. Generated, do not edit.',
  upstream: { package: '@shoelace-style/shoelace', version: manifest.package?.version || '2.20.1', commit },
  elements: Object.fromEntries(
    Object.keys(elements)
      .sort()
      .map(tag => [tag, baselineElement(elements[tag])])
  )
};

const outFile = path.join(path.dirname(new URL(import.meta.url).pathname), 'upstream-baseline.json');
fs.writeFileSync(outFile, JSON.stringify(baseline, null, 1) + '\n');
console.log(`Wrote ${Object.keys(baseline.elements).length} elements to ${outFile}`);
