# DMS-Downloads — report

Pagina nuova, senza screenshot di origine. Riferimenti dal web: Google Takeout (stato, scadenza dopo ~7 giorni, limite di download),
elenco download dei browser (una riga per file, azioni che dipendono dallo stato). Le altre fonti non erano raggiungibili.

## Pagine

| Pagina             | Stato riprodotto                                                                                                                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `1-Downloads.html` | My downloads, filtro Status con valore (Processing + Ready, solo simulazione: la tabella non è filtrata), due file Ready spuntati (Download selected e Delete attivi): 2 Processing, 1 Queued, 3 Ready, 1 Failed, 2 Expired |

## Nuovi elementi non DS

Nessuno. Modifiche al layer condiviso: `STATUS_VARIANT` (Queued, Processing, Ready, Failed) e `FILE_ICON` (xlsx, zip) in `_shared/restyle.js`.

## Componenti senza Code Connect

Nessuno (`progress-bar`, `alert`, `status`, `table` hanno il template). Icone: tutte con Code Connect.

## Stati da disegnare

Nessuna selezione (Download e Delete disabilitati) · tab In progress / Ready / Failed · tabella vuota (empty state già nel markup) ·
dialog di conferma di Delete e Cancel job · dettaglio di un job Failed (View details).

## Domande aperte

- Il job può essere annullato solo se Queued/Processing? Quanti download per file (Takeout ne consente 5)?
- Serve una notifica nell'header quando un job termina (non inclusa)?
- Expired in `danger` segue il catalogo; se pesa troppo su un elenco con molti file scaduti, va decisa una variante `neutral`.

## Figma

Wrapper `1-Downloads` `1297:88153` nella SECTION `DMS-Downloads` `1297:88152` (file Saipem-XcMM, pagina Restyle), solo NEW `1297:88156`, senza OLD. Stato registro: `to-verify`, perché non è stato fatto il confronto con lo screenshot dell'HTML (browser Playwright occupato da un'altra istanza). Progress ed Error sono colonne separate dallo Status (richiesta dell'utente, 2026-11-02).
