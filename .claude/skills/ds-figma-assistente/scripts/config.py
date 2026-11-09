#!/usr/bin/env python3
"""Legge, valida e salva la configurazione di progetto della skill ds-figma-assistente.

Non contatta Figma né localhost e non accetta credenziali.

Uso:
  config.py show [--flusso code-connect|html|figma|audit|annotazioni|doc|release]
  config.py init                      # crea config.local.json dal modello (solo se non esiste)
  config.py set chiave.annidata=valore [...] [--replace]
  config.py get chiave.annidata
"""
import argparse
import json
import re
import sys
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
PATH = SKILL / 'config.local.json'
ESEMPIO = SKILL / 'assets' / 'config.esempio.json'

# Campi necessari per ogni flusso (percorsi con il punto)
RICHIESTI = {
    'code-connect': ['code_connect.dir', 'codice.componenti_dir', 'figma.ds_url'],
    'html': ['percorsi.screenshot_dir', 'percorsi.html_dir', 'codice.prefisso_tag', 'codice.componenti_dir'],
    'figma': ['percorsi.html_dir', 'percorsi.screenshot_dir', 'anteprima.base_url', 'figma.ds_url',
              'figma.progetto_url', 'code_connect.dir', 'percorsi.registro_pagine'],
    'audit': ['codice.componenti_dir', 'figma.ds_url', 'anteprima.docs_url'],
    'annotazioni': ['figma.progetto_url'],
    'doc': ['figma.ds_url', 'codice.doc_componenti', 'code_connect.dir'],
    'release': ['figma.ds_url', 'figma.progetto_url'],
    'componente': ['figma.ds_url', 'codice.componenti_dir', 'codice.doc_componenti', 'code_connect.dir',
                   'figma.pagina_doc_riferimento'],
}
# Campi che non si sovrascrivono senza --replace (cambiare file Figma per sbaglio è grave)
PROTETTI = {'figma.ds_url', 'figma.progetto_url'}
SEGRETI = re.compile(r'(token|password|secret|cookie|figd_)', re.I)
FIGMA_URL = re.compile(r'^https://(www\.)?figma\.com/(design|file|board|make)/([A-Za-z0-9]+)(/branch/([A-Za-z0-9]+))?')


def load():
    if not PATH.exists():
        return None
    d = json.loads(PATH.read_text(encoding='utf-8'))
    if d.get('schema_version') != 1:
        sys.exit('config.local.json ha uno schema_version non supportato: non lo sovrascrivo.')
    return d


def get(d, key):
    for part in key.split('.'):
        if not isinstance(d, dict) or part not in d:
            return None
        d = d[part]
    return d


def put(d, key, value):
    parts = key.split('.')
    for part in parts[:-1]:
        d = d.setdefault(part, {})
    d[parts[-1]] = value


def file_key(url):
    m = FIGMA_URL.match(url or '')
    if not m:
        return None
    return m.group(5) or m.group(3)  # con branch vale la key del branch


def problemi(d, flusso=None):
    mancanti, invalidi = [], []
    chiavi = RICHIESTI.get(flusso) if flusso else sorted({k for v in RICHIESTI.values() for k in v})
    for k in chiavi:
        v = get(d, k)
        if v in (None, '', []) or (isinstance(v, str) and ('FILE_KEY' in v or v == '0:1')):
            mancanti.append(k)
    for k in ('figma.ds_url', 'figma.progetto_url'):
        v = get(d, k)
        if v and 'FILE_KEY' not in v and not file_key(v):
            invalidi.append(f'{k}: URL Figma non riconosciuto')
    a, b = file_key(get(d, 'figma.ds_url')), file_key(get(d, 'figma.progetto_url'))
    if a and b and a == b:
        invalidi.append('figma.ds_url e figma.progetto_url puntano allo stesso file: DS e progetto devono essere distinti')
    for k in ('anteprima.base_url', 'anteprima.docs_url'):
        v = get(d, k)
        if v and not re.match(r'^https?://', v):
            invalidi.append(f'{k}: deve iniziare con http:// o https://')
    for rif in d.get('riferimenti_progetto') or []:
        if not Path(rif).exists():
            invalidi.append(f'riferimenti_progetto: file non trovato {rif}')
    return mancanti, invalidi


def parse_value(raw):
    try:
        return json.loads(raw)
    except ValueError:
        return raw


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('show')
    s.add_argument('--flusso', choices=sorted(RICHIESTI))
    sub.add_parser('init')
    g = sub.add_parser('get')
    g.add_argument('chiave')
    st = sub.add_parser('set')
    st.add_argument('coppie', nargs='+', help='chiave.annidata=valore (valore JSON o testo)')
    st.add_argument('--replace', action='store_true', help='consente di cambiare gli URL Figma già salvati')
    a = p.parse_args()

    if a.cmd == 'init':
        if PATH.exists():
            sys.exit(f'{PATH} esiste già: non lo sovrascrivo. Usa "set" per cambiare dei campi.')
        PATH.write_text(ESEMPIO.read_text(encoding='utf-8'), encoding='utf-8')
        print(f'Creato {PATH} dal modello. Ora compila i campi con "set".')
        return

    d = load()
    if a.cmd == 'show':
        if d is None:
            print(json.dumps({'config': None, 'stato': 'MANCANTE',
                              'azione': 'segui references/configurazione.md, poi config.py init + set'}, indent=2, ensure_ascii=False))
            return
        mancanti, invalidi = problemi(d, a.flusso)
        print(json.dumps({'percorso': str(PATH), 'flusso': a.flusso, 'config': d,
                          'file_key': {'ds': file_key(get(d, 'figma.ds_url')), 'progetto': file_key(get(d, 'figma.progetto_url'))},
                          'mancanti': mancanti, 'invalidi': invalidi,
                          'stato': 'OK' if not mancanti and not invalidi else 'INCOMPLETA'}, indent=2, ensure_ascii=False))
        return

    if d is None:
        sys.exit('Nessuna configurazione: esegui prima "config.py init".')
    if a.cmd == 'get':
        print(json.dumps(get(d, a.chiave), ensure_ascii=False))
        return

    for coppia in a.coppie:
        if '=' not in coppia:
            sys.exit(f'Formato non valido: {coppia} (atteso chiave=valore)')
        k, raw = coppia.split('=', 1)
        if SEGRETI.search(k) or SEGRETI.search(raw):
            sys.exit(f'Rifiutato {k}: sembra una credenziale, non va salvata nella configurazione.')
        old = get(d, k)
        if k in PROTETTI and old and 'FILE_KEY' not in str(old) and old != raw and not a.replace:
            sys.exit(f'{k} è già impostato ({old}). Per cambiarlo serve la conferma dell\'utente e --replace.')
        put(d, k, parse_value(raw))
    tmp = PATH.with_suffix('.json.tmp')
    tmp.write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    tmp.replace(PATH)
    mancanti, invalidi = problemi(d)
    print(json.dumps({'salvato': str(PATH), 'mancanti': mancanti, 'invalidi': invalidi}, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
