# xCPage-Structures — report flusso 2 (2026-11-12, layout dei revisori: albero 30% · dettaglio 40% · Clipboard 30%)

## 1. Pagine

| Pagina                    | Screenshot legacy                                                       | Stato                                                       |
| ------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1-Structures              | Full view, Root Folder Selection, Folder Tree, Link Clipboard Documents | albero, Test_EMC, Documents vuota, Clipboard con 2 spuntati |
| 2-Structures-Properties   | Folder Properties, Create Sub Folder Button                             | Test_EMC, Properties                                        |
| 3-Structures-ContentRules | Folder Content Rules                                                    | Test_EMC, Content rules                                     |
| 4-Structures-Documents    | Folder Documents                                                        | Test_Activity_23June, 3 documenti                           |
| 5-Structures-Progress     | Folder Documents (tab WBS Activity Progress)                            | Progress non calcolato                                      |
| 6-NewElement-Properties   | Wizard – Properties step                                                | passo 1                                                     |
| 7-NewElement-ContentRules | Wizard – Content Rules step                                             | passo 2                                                     |

## 2. Mappatura

Vedi DECISIONS.md › xCPage-Structures. Nessuna modifica a DMS-MyWork.

## 3. Componenti senza Code Connect

Da verificare nel flusso 3 (`cc_inventario.py`).

## 4. ⚠️ Nuovi elementi non DS

Nessuno.

## 5. Icone

Tutte disponibili in Figma.

## 6. Scostamenti e domande aperte

- Albero `sl-tree` con Structure select sopra; azioni sul nodo nell'header della card.
- Clipboard a destra con Link documents; nella tab Documents solo Unlink.
- Menu Actions: voci sconosciute, tolto.
- Tab **WBS Activity Progress** (nome del legacy): contenuto sconosciuto → empty state senza azione; Check progress solo nel menu Actions (Boffelli 2026-11-13).
- Wizard: Element type limitato ai tipi del padre (WBS Activity / WBS Intermediate EMC), diverso dallo screenshot (WBS EMC); template "WBS Activity Element" ipotizzato.
- Opzioni Managing department / ruoli (PIPE-PIPING, Admin) solo per popolare le select.

## 7. Lint

0 ERR.

## Aggiornamento 2026-11-13

Bottone **Actions** (Rename WBS element · Check progress) a destra di New child element in tutte le 8 pagine; in Figma frame `Header actions` (gap `x-small`) nei Folder header degli 8 NEW della sezione `1861:118342`, menu chiuso.

Tab **WBS Activity Progress** aggiunta in Figma ai NEW 4 e 5 (proprietà `Tab 5` del Tab Group, icona `bar-chart-steps`; attiva nel 5); nello stato vuoto del 5 tolti azione e descrizione.
