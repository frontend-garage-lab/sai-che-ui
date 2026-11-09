#!/usr/bin/env python3
"""Inventario e controlli statici dei template Code Connect (.figma.ts / .figma.js).

Senza Figma (controlli offline):
  - node-id duplicati, fileKey diverso dal DS configurato, `source=` inesistente
  - tag emessi che non esistono nel Custom Elements Manifest
  - getEnum sulla stessa proprietà con insiemi di valori diversi nello stesso file

Con --figma <json> (proprietà reali lette dal file DS, vedi references/flusso-1-code-connect.md):
  - nodo inesistente (URL obsoleto), proprietà inesistente
  - tipo sbagliato: getBoolean su VARIANT true/false, getEnum su BOOLEAN, getSlot su non-SLOT...
  - getEnum non esaustivo (valori Figma non mappati) o con valori inesistenti
  - valori di variante che corrispondono a una @property riflessa del componente ma non sono emessi

Uso:
  cc_inventario.py [--dir figma] [--figma figma-props.json] [--json out.json] [--solo-riepilogo]
"""
import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import file_key, get, load  # noqa: E402

CALL = re.compile(r"\.(getEnum|getBoolean|getString|getInstanceSwap|getSlot|findText|findInstance|findConnectedInstance|findLayers)\(\s*['\"]([^'\"]+)['\"]")
URL = re.compile(r'//\s*url=(\S+)')
SOURCE = re.compile(r'//\s*source=(\S+)')
NODE = re.compile(r'node-id=([0-9]+[-:][0-9]+)')
TIPI_ATTESI = {
    'getBoolean': {'BOOLEAN'},
    'getEnum': {'VARIANT'},
    'getString': {'TEXT'},
    'getInstanceSwap': {'INSTANCE_SWAP'},
    'getSlot': {'SLOT'},
}
STATI_CSS = {'hover', 'focus', 'active', 'pressed', 'default'}


def oggetto_dopo(testo, start):
    """Restituisce le chiavi dell'oggetto letterale {...} che inizia dopo `start` (getEnum)."""
    i = testo.find('{', start)
    if i < 0 or testo[start:i].count(')'):
        return None
    depth, j = 0, i
    while j < len(testo):
        if testo[j] == '{':
            depth += 1
        elif testo[j] == '}':
            depth -= 1
            if depth == 0:
                break
        j += 1
    corpo = testo[i + 1:j]
    return re.findall(r"(?:^|[,{\n])\s*(?:'([^']+)'|\"([^\"]+)\"|([A-Za-z_$][\w$-]*))\s*:", corpo)


def analizza(path, prefisso):
    t = path.read_text(encoding='utf-8')
    url = (URL.search(t) or [None, None])[1] if URL.search(t) else None
    node = NODE.search(url).group(1).replace('-', ':') if url and NODE.search(url) else None
    calls = []
    for m in CALL.finditer(t):
        c = {'metodo': m.group(1), 'prop': m.group(2), 'riga': t.count('\n', 0, m.start()) + 1}
        if c['metodo'] == 'getEnum':
            keys = oggetto_dopo(t, m.end())
            if keys is not None:
                c['valori'] = sorted({a or b or c_ for a, b, c_ in keys})
        calls.append(c)
    tags = sorted(set(re.findall(r'<(' + re.escape(prefisso) + r'[a-z0-9-]+)', t))) if prefisso else []
    src = SOURCE.search(t)
    return {'file': str(path), 'url': url, 'file_key': file_key(url) if url else None, 'node_id': node,
            'source': src.group(1) if src else None, 'chiamate': calls, 'tag': tags, 'testo': t}


def tag_manifest(manifest):
    p = Path(manifest or '')
    if not p.exists():
        return None
    d = json.loads(p.read_text(encoding='utf-8'))
    return {decl['tagName'] for mod in d.get('modules', []) for decl in mod.get('declarations', []) if decl.get('tagName')}


def property_riflesse(source):
    p = Path(source or '')
    if not p.exists():
        return set()
    t = p.read_text(encoding='utf-8')
    return set(re.findall(r'@property\(\{[^)]*reflect:\s*true[^)]*\}\)\s*(?:declare\s+)?([A-Za-z_]\w*)', t))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dir')
    ap.add_argument('--figma', help='JSON {node_id: {name, type, props: {Nome: {type, options?}}} | null}')
    ap.add_argument('--json', help='salva il risultato completo in JSON')
    ap.add_argument('--solo-riepilogo', action='store_true')
    ap.add_argument('--mancanti', action='store_true', help='elenca i componenti del codice senza template')
    a = ap.parse_args()

    if a.mancanti:
        cfg = load() or {}
        cdir = Path(a.dir or get(cfg, 'code_connect.dir') or 'figma')
        comp = Path(get(cfg, 'codice.componenti_dir') or 'src/components')
        testi = ''.join(p.read_text(encoding='utf-8') for p in cdir.glob('**/*.figma.*'))
        coperti = set(re.findall(r'//\s*source=\S*?/([^/\s]+)/[^/\s]+$', testi, re.M))
        tutti = sorted(p.parent.name for p in comp.glob('*/*.component.ts'))
        mancanti = [c for c in tutti if c not in coperti]
        print(f'Componenti: {len(tutti)} · con template: {len(tutti) - len(mancanti)} · senza template: {len(mancanti)}')
        for c in mancanti:
            print(f'- {c}  ({comp / c / (c + ".component.ts")})')
        return

    cfg = load() or {}
    cdir = Path(a.dir or get(cfg, 'code_connect.dir') or 'figma')
    prefisso = get(cfg, 'codice.prefisso_tag') or ''
    ds_key = file_key(get(cfg, 'figma.ds_url'))
    files = sorted(list(cdir.glob('**/*.figma.ts')) + list(cdir.glob('**/*.figma.js')) + list(cdir.glob('**/*.figma.tsx')))
    if not files:
        sys.exit(f'Nessun template in {cdir}')
    tmpl = [analizza(f, prefisso) for f in files]
    manifest = tag_manifest(get(cfg, 'codice.manifest'))
    figma = json.loads(Path(a.figma).read_text(encoding='utf-8')) if a.figma else None

    problemi = []  # (gravità, file, riga, messaggio)

    def add(g, t, riga, msg):
        problemi.append({'gravita': g, 'file': t['file'], 'riga': riga, 'messaggio': msg})

    dup = Counter(t['node_id'] for t in tmpl if t['node_id'])
    for t in tmpl:
        if not t['url']:
            add('P0', t, 1, 'manca il commento // url= con il nodo Figma')
        elif not t['node_id']:
            add('P0', t, 1, 'URL senza node-id')
        if t['node_id'] and dup[t['node_id']] > 1:
            add('P1', t, 1, f"node-id {t['node_id']} usato da {dup[t['node_id']]} template")
        if ds_key and t['file_key'] and t['file_key'] != ds_key:
            add('P1', t, 1, f"fileKey {t['file_key']} diverso dal DS configurato ({ds_key})")
        if t['source'] and not Path(t['source']).exists():
            add('P1', t, 1, f"source={t['source']} non esiste")
        if manifest is not None:
            for tag in t['tag']:
                if tag not in manifest:
                    add('P1', t, 1, f'tag <{tag}> assente dal manifest')
        enums = defaultdict(set)
        for c in t['chiamate']:
            if c.get('valori') is not None:
                enums[c['prop']].add(tuple(c['valori']))
        for prop, sets in enums.items():
            if len(sets) > 1:
                add('P2', t, 1, f"getEnum('{prop}') usato con insiemi di valori diversi: possibile valore dimenticato")

        if figma is None or not t['node_id']:
            continue
        nodo = figma.get(t['node_id'], figma.get(t['node_id'].replace(':', '-'), 'ASSENTE'))
        if nodo == 'ASSENTE':
            continue  # non letto: non si conclude nulla
        if nodo is None:
            add('P0', t, 1, f"il nodo {t['node_id']} non esiste più nel file DS (URL obsoleto)")
            continue
        props = nodo.get('props', {})
        for c in t['chiamate']:
            atteso = TIPI_ATTESI.get(c['metodo'])
            if not atteso:
                continue
            p = props.get(c['prop'])
            if p is None:
                add('P0', t, c['riga'], f"{c['metodo']}('{c['prop']}'): proprietà inesistente su {nodo.get('name')}")
                continue
            tipo = p.get('type')
            if tipo not in atteso:
                extra = ' (VARIANT true/false: usa getEnum o rendila BOOLEAN)' if c['metodo'] == 'getBoolean' and tipo == 'VARIANT' else ''
                add('P1', t, c['riga'], f"{c['metodo']}('{c['prop']}') ma in Figma è {tipo}{extra}")
            if c['metodo'] == 'getEnum' and tipo == 'VARIANT' and c.get('valori') is not None:
                opzioni = set(p.get('options') or [])
                mancano = sorted(opzioni - set(c['valori']))
                inventati = sorted(set(c['valori']) - opzioni)
                if mancano:
                    add('P1', t, c['riga'], f"getEnum('{c['prop']}') non mappa {mancano}: in quei casi restituisce undefined")
                if inventati:
                    add('P2', t, c['riga'], f"getEnum('{c['prop']}') mappa valori che Figma non ha: {inventati}")
        riflesse = property_riflesse(t['source'])
        for nome, p in props.items():
            if p.get('type') != 'VARIANT':
                continue
            for opt in p.get('options') or []:
                if opt in riflesse and opt not in STATI_CSS and opt != 'disabled' and not re.search(r'[\s\'"`]' + re.escape(opt) + r'\b', t['testo'].split('export default', 1)[-1]):
                    add('P1', t, 1, f"la variante {nome}={opt} corrisponde a @property riflessa '{opt}' ma lo snippet non la emette")

    ordine = {'P0': 0, 'P1': 1, 'P2': 2}
    problemi.sort(key=lambda p: (ordine[p['gravita']], p['file'], p['riga']))
    conta = Counter(p['gravita'] for p in problemi)
    print(f"# Inventario Code Connect — {cdir}\n")
    print(f"- Template: {len(tmpl)} · con node-id: {sum(1 for t in tmpl if t['node_id'])} · chiamate get*/find*: {sum(len(t['chiamate']) for t in tmpl)}")
    print(f"- Manifest: {'letto' if manifest is not None else 'non trovato (controllo tag saltato)'} · Proprietà Figma: {'lette da ' + a.figma if figma else 'non fornite (controlli di tipo saltati)'}")
    print(f"- Problemi: P0 {conta['P0']} · P1 {conta['P1']} · P2 {conta['P2']}\n")
    if not a.solo_riepilogo:
        if problemi:
            print('| Gravità | File:riga | Problema |\n| --- | --- | --- |')
            for p in problemi:
                print(f"| {p['gravita']} | `{p['file']}:{p['riga']}` | {p['messaggio']} |")
        else:
            print('Nessun problema rilevato dai controlli eseguiti.')
        print('\nNodi da leggere in Figma (per --figma):', ' '.join(sorted({t['node_id'] for t in tmpl if t['node_id']})))
    if a.json:
        for t in tmpl:
            t.pop('testo', None)
        Path(a.json).write_text(json.dumps({'template': tmpl, 'problemi': problemi}, indent=2, ensure_ascii=False), encoding='utf-8')


if __name__ == '__main__':
    main()
