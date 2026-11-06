#!/usr/bin/env python3
"""Stato della pipeline screenshot → HTML → Figma, per flusso applicativo.

Legge percorsi.screenshot_dir (una sottocartella per flusso, immagini dentro), percorsi.html_dir
(stessa struttura, una .html per screenshot) e il registro JSON delle pagine portate in Figma.

Uso: stato_pagine.py [filtro-flusso] [--url]   (--url stampa gli URL dell'anteprima)
"""
import argparse
import json
import sys
from pathlib import Path
from urllib.parse import quote

sys.path.insert(0, str(Path(__file__).resolve().parent))
from config import get, load  # noqa: E402

IMG = {'.png', '.jpg', '.jpeg', '.webp'}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('filtro', nargs='?', default='')
    ap.add_argument('--url', action='store_true')
    a = ap.parse_args()
    cfg = load() or sys.exit('Configurazione mancante: esegui /ds-figma-assistente configura')
    shots = Path(get(cfg, 'percorsi.screenshot_dir') or '')
    html = Path(get(cfg, 'percorsi.html_dir') or '')
    reg_path = Path(get(cfg, 'percorsi.registro_pagine') or '')
    base = (get(cfg, 'anteprima.base_url') or '').rstrip('/')
    registro = json.loads(reg_path.read_text(encoding='utf-8')).get('pages', {}) if reg_path.is_file() else {}

    flussi = sorted({p.name for p in shots.iterdir() if p.is_dir()} if shots.is_dir() else set()
                    | ({p.name for p in html.iterdir() if p.is_dir() and not p.name.startswith('_')} if html.is_dir() else set()))
    totali = {'html': 0, 'figma': 0, 'schermate': 0}
    for flusso in flussi:
        if a.filtro.lower() not in flusso.lower():
            continue
        img = sorted(p.stem for p in (shots / flusso).iterdir() if p.suffix.lower() in IMG) if (shots / flusso).is_dir() else []
        pagine = {p.stem for p in (html / flusso).glob('*.html')} if (html / flusso).is_dir() else set()
        nomi = sorted(set(img) | pagine, key=lambda s: (int(s.split('-')[0]) if s.split('-')[0].isdigit() else 999, s))
        print(f'\n## {flusso}\n\n| Schermata | Screenshot | HTML | Figma | Note |\n| --- | --- | --- | --- | --- |')
        for n in nomi:
            r = registro.get(f'{flusso}/{n}')
            figma = (r or {}).get('status', '—')
            note = '; '.join((r or {}).get('open', []))[:120]
            print(f"| {n} | {'✅' if n in img else '—'} | {'✅' if n in pagine else '⬜'} | {figma} | {note} |")
            if a.url and n in pagine and base:
                print(f"|  | | {base}/{quote(str(html / flusso / (n + '.html')))} | | |")
            totali['schermate'] += 1
            totali['html'] += n in pagine
            totali['figma'] += figma == 'done'
    print(f"\nTotale: {totali['schermate']} schermate · {totali['html']} HTML · {totali['figma']} Figma completate (done)")
    if not reg_path.is_file():
        print(f'(registro {reg_path} non trovato: crealo da assets/registro-pagine.esempio.json)')


if __name__ == '__main__':
    main()
