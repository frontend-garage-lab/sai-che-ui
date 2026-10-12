//
// Lightweight dev server for the standalone demos in docs/assets/demo (e.g. the xCPage review flow).
//
// Unlike `npm start`, this doesn't package icons, build the docs or write anything to disk: esbuild compiles src/ in
// memory, icons are read straight from node_modules/bootstrap-icons, and the page reloads when a source file changes.
//
//   node scripts/serve-demo.js            → http://localhost:4100/docs/assets/demo/xcpage/
//   node scripts/serve-demo.js --port 4200
//
import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import esbuild from 'esbuild';
import { readFileSync } from 'fs';
import { replace } from 'esbuild-plugin-replace';

const { port } = commandLineArgs([{ name: 'port', type: Number, defaultValue: 4100 }]);
const packageData = JSON.parse(readFileSync('./package.json', 'utf-8'));

// The demo bundle: every component, with the default icon library pointed at the npm package
const entry = `
  import { registerIconLibrary } from './src/components/icon/library.js';

  export * from './src/shoelace.js';

  registerIconLibrary('default', {
    resolver: name => '/node_modules/bootstrap-icons/icons/' + name + '.svg'
  });
`;

const context = await esbuild.context({
  stdin: { contents: entry, resolveDir: '.', sourcefile: 'demo-entry.ts', loader: 'ts' },
  // Kept in memory (write: false): esbuild serves it at /shoelace.js
  outdir: 'demo-build',
  entryNames: 'shoelace',
  format: 'esm',
  target: 'es2017',
  bundle: true,
  sourcemap: true,
  write: false,
  define: { 'process.env.NODE_ENV': '"development"' },
  plugins: [replace({ __SHOELACE_VERSION__: JSON.stringify(packageData.version.toString()) })],
  logLevel: 'warning'
});

await context.watch();
const { port: actualPort } = await context.serve({ servedir: '.', port });

console.log(chalk.cyan(`\n🥾 Demo server running (in memory, no icon packaging)`));
console.log(`   xCPage review flow → ${chalk.bold(`http://localhost:${actualPort}/docs/assets/demo/xcpage/`)}\n`);
