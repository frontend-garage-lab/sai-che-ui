# Icone di pulsanti e tab — 2026-10-28

Richiesta dell'utente: aggiungere icone Bootstrap ai pulsanti e alle tab dell'applicativo, poi portarle in Figma.
Mappa e regole in `docs/assets/application_restyle/DECISIONS.md` § "Icone di pulsanti e tab".

## HTML

- 229 inserimenti in 47 file del restyle (25 etichette di pulsanti, 3 "Next: …" con `chevron-right` suffix, 11 tab).
- Restano senza icona: Cancel, Reset, Clear, Clear all, Close group ")", menu con caret (Actions ▾, More ▾).
- Lint `lint_html.py`: 0 ERR in tutti i flussi.

## DS (Saipem DS, pagina Icons `173:2`)

19 component set nuovi `Icon/<nome>` (5 varianti, fill legati alle variabili come le icone esistenti, path da
`bootstrap-icons` 1.11.3), tile nella griglia "Card: Library" `1103:3599` in ordine alfabetico; header "113 icons".

| Icona | Set | Icona | Set |
| --- | --- | --- | --- |
| envelope-plus | `1397:43` | bar-chart-steps | `1398:340` |
| box-arrow-in-down | `1398:43` | floppy | `1398:363` |
| person-plus | `1398:81` | send | `1398:401` |
| person-check | `1398:119` | diagram-3 | `1398:424` |
| arrow-left-right | `1398:157` | bookmark | `1398:447` |
| x-circle | `1398:180` | globe | `1398:470` |
| check2-all | `1398:218` | table | `1398:493` |
| files | `1398:256` | arrow-up | `1398:516` |
| file-earmark-plus | `1398:279` | arrow-down | `1398:539` |
| list-ul | `1398:317` | | |

Code Connect: 19 template `figma/icon-<nome>.figma.ts` (copia di `icon-x-lg`), `tsc` e `figma connect parse` OK,
175 template totali. Libreria e Code Connect pubblicati dall'utente il 2026-10-28.

## File di progetto (Saipem-XcMM, pagina Restyle `242:1823`)

- 107 istanze aggiornate (Button: `Show Prefix` + swap `Prefix`, Next: `Show Suffix` + `Suffix`; Tab: `Icon` +
  `Icon Type`), per sezione: CreateTransmittal 44, PVA 25, Reviewer 2, Lead Reviewer 4, advanced-search 26,
  DistributionMatrices 7. Verifica finale: nessun pulsante della mappa senza icona, nessun Label ≠ testo.
- Toolbar che non entravano più, corrette in HTML e Figma su scelta dell'utente:
  - PVA: campo di ricerca flessibile (`flex: 1 1 20rem; min-width: 10rem`; in Figma Input `FILL`, `minWidth` 160,
    placeholder troncato), spacer a 0.
  - Reviewer: Download e Delegate nel menu More ▾ tra due divider (con la sidebar aperta la tabella è 715px).

## Non verificato

- Rendering HTML nel browser: Playwright era occupato da un'altra sessione. Verificato che le SVG nuove sono servite
  dall'anteprima (HTTP 200).
