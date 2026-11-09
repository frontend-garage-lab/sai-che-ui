// Server statico minimo per l'anteprima delle pagine HTML generate (nessuna dipendenza, solo Node.js).
// Creato dalla skill ds-figma-assistente quando il progetto non ha già un server di anteprima.
//
//   node scripts/serve-preview.mjs              → http://localhost:4100/
//   node scripts/serve-preview.mjs --port 4200 --root .
//
// Serve i file della cartella root così come sono: le pagine devono importare i componenti DS da un bundle già
// compilato (es. dist/) o da CDN. Se i componenti richiedono una compilazione al volo, usa il server del progetto.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : def;
};
const port = Number(arg('port', 4100));
const root = resolve(arg('root', '.'));
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.map': 'application/json'
};

createServer(async (req, res) => {
  try {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    let file = join(root, path);
    if (!file.startsWith(root)) throw Object.assign(new Error('forbidden'), { code: 'EACCES' });
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(await readFile(file));
  } catch (e) {
    res.writeHead(e.code === 'EACCES' ? 403 : 404, { 'Content-Type': 'text/plain' });
    res.end(e.code === 'EACCES' ? 'Forbidden' : 'Not found');
  }
}).listen(port, () => console.log(`Anteprima: http://localhost:${port}/  (root: ${root})`));
