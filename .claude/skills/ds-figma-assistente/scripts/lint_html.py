#!/usr/bin/env python3
"""Lint generico delle pagine HTML generate dal flusso 2, contro il Custom Elements Manifest.

Livelli:
  ERR  da correggere sempre (controllo nativo al posto di un componente DS, tag inesistente,
       attributo inesistente, colore hardcoded)
  NEW  elemento non coperto dal DS: va nel report come "nuovo elemento" o va tolto
  WARN da controllare (dimensioni fisse, stile inline)

Uso: lint_html.py <cartella-o-file.html> [...]
Esce con codice 1 se ci sono ERR.
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import get, load  # noqa: E402

NATIVI = {'button', 'input', 'select', 'textarea', 'table', 'dialog', 'hr', 'progress', 'details', 'meter'}
ATTR_GLOBALI = {'id', 'class', 'style', 'slot', 'part', 'title', 'hidden', 'tabindex', 'role', 'lang', 'dir', 'inert'}
HEX = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\(')
FISSO = re.compile(r'\b(width|height|min-width|max-width)\s*:\s*\d+(\.\d+)?(px|rem)')


def manifest(path):
    p = Path(path or '')
    if not p.exists():
        return None
    d = json.loads(p.read_text(encoding='utf-8'))
    out = {}
    for mod in d.get('modules', []):
        for decl in mod.get('declarations', []):
            if decl.get('tagName'):
                attrs = {a['name'] for a in decl.get('attributes', []) if a.get('name')}
                attrs |= {m['attribute'] for m in decl.get('members', []) if m.get('attribute')}
                out[decl['tagName']] = attrs
    return out


class Lint(HTMLParser):
    def __init__(self, prefisso, tags):
        super().__init__()
        self.prefisso, self.tags, self.out, self.in_style = prefisso, tags, [], False

    def add(self, livello, msg):
        self.out.append((livello, self.getpos()[0], msg))

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'style':
            self.in_style = True
        if tag in NATIVI:
            self.add('ERR', f'<{tag}> nativo: usa il componente DS equivalente')
        if self.prefisso and tag.startswith(self.prefisso) and self.tags is not None:
            if tag not in self.tags:
                self.add('ERR', f'<{tag}> non esiste nel manifest')
            else:
                for k in a:
                    if k not in self.tags[tag] and k not in ATTR_GLOBALI and not k.startswith(('aria-', 'data-', '@', '.', '?')):
                        self.add('ERR', f'<{tag} {k}>: attributo non presente nel manifest (variante inventata?)')
        st = a.get('style') or ''
        if st:
            if HEX.search(st):
                self.add('ERR', f'colore hardcoded in style="{st[:60]}"')
            elif FISSO.search(st):
                self.add('WARN', f'dimensione fissa in style="{st[:60]}"')
            else:
                self.add('WARN', f'stile inline: preferisci classi di layout condivise ({st[:60]})')
        if '::part' in st:
            self.add('NEW', 'override ::part → variante mancante del componente')

    def handle_endtag(self, tag):
        if tag == 'style':
            self.in_style = False

    def handle_data(self, data):
        if self.in_style:
            if HEX.search(data):
                self.add('ERR', 'colore hardcoded nel blocco <style>: usa i token del DS')
            if '::part(' in data:
                self.add('NEW', 'override ::part nel <style> → variante mancante del componente')
            for prop in ('background', 'border', 'box-shadow', 'border-radius'):
                if re.search(r'\b' + prop + r'\s*:', data):
                    self.add('NEW', f'superficie custom ({prop}) su un wrapper: usa un componente contenitore del DS')
                    break


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    cfg = load() or {}
    prefisso = get(cfg, 'codice.prefisso_tag') or ''
    tags = manifest(get(cfg, 'codice.manifest'))
    if tags is None:
        print('WARN manifest non trovato: controllo di tag e attributi saltato (esegui il build)')
    file = []
    for arg in sys.argv[1:]:
        p = Path(arg)
        file += sorted(p.glob('**/*.html')) if p.is_dir() else [p]
    err = 0
    for f in file:
        l = Lint(prefisso, tags)
        l.feed(f.read_text(encoding='utf-8'))
        for livello, riga, msg in l.out:
            print(f'{livello:4} {f}:{riga}  {msg}')
            err += livello == 'ERR'
    print(f'\n{len(file)} file · {err} ERR')
    sys.exit(1 if err else 0)


if __name__ == '__main__':
    main()
