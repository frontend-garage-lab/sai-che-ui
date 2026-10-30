# DACS-Toolbar — proposte di navigazione (2026-10-30)

Origine: `application_screenshot/DACS - Toolbar/` (7 schermate). Il cliente non vuole l'albero fisso a sinistra:
per la schermata principale (`1-DocList-Toolbar.png`) ci sono 3 proposte (P4 ricerca e P5 sidebar scartate dall'utente il 2026-10-30) da far valutare ai funzionali. Le schermate
2–7 (Selected Docs, dialog Modify / Properties / IVA / Add WBS, menu di riga) si fanno dopo la scelta.

## Parti comuni a tutte le proposte

- Header: Document Center (corrente) · Binders Workspace · menu New / Import / Content; repository NEA YARD UAT
  come select; menu utente con About (ex icona info).
- Titolo = cartella corrente + conteggio (146 documenti); Restore my last search e Advanced search come azioni di
  pagina; le tab legacy del Browser (Browser / STD Columns / Design Docs / Shop…) nel dropdown "View".
- Toolbar della tabella: le 12 icone legacy diventano Import new docs (primary) · Modify selected · IVA promote /
  demote · Add to binder · More (Add WBS & plan shop dwgs, New placeholder, Bulk upload, Bulk export, Transmit docs
  (Box)) · Config.
- Tab di vista: Doc List / My Tasks / My Favorites / Selected Docs / Bulk Load Templates. PDF Preview si sposta tra
  le tab del dettaglio.
- Il pannello in basso (Revisions / Comments / Locations / Attachments) diventa `sl-detail-panel` con le tab.
- Tabella con la stessa struttura delle Documents degli altri flussi: Quick info con l'icona del file nativo
  (`revisionFileIcon`), Document con `documentCell` (nome · DIN · titolo), Status, Ver., menu ⋮; la tab Revisions
  del dettaglio come `documentRevisionColumns`.
- Il menu di riga (⋮) riprende le voci di `5-SelectedDocs-RowMenu.png`.

## Proposte

| Pagina                  | Idea                                                           | Pro                                                                      | Contro                                                              |
| ----------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| P1-BreadcrumbNavigabile | ogni livello del breadcrumb ha un chevron con le sottocartelle | nessuno spazio occupato, percorso sempre visibile                        | con alberi profondi servono più clic                                |
| P2-SelettoriContesto    | Site / Project / Area / Folder come 4 select a cascata         | familiare (sembrano dei filtri), adatto a chi lavora su un solo progetto | le cartelle oltre il 4° livello finiscono tutte nella select Folder |
| P3-AlberoInDrawer       | l'albero resta ma si apre su richiesta, in un drawer           | nessun cambio di abitudini per gli utenti                                | il drawer copre la lista mentre è aperto                            |

## Nuovi elementi non DS

Nessuno.

## Scostamenti e domande aperte

- Il menu "ALL ▾" dell'header legacy (icona imbuto) non ha voci visibili: è stato omesso, da chiarire.
- Gli stati legacy sono mappati così: Verified/Approved `success`, Issued `primary`, Draft `neutral`, Rejected
  `danger` (prima avevano bandiere verdi/rosse/grigie).
- Due righe legacy (2000279862…, AAA_test_pdf.pdf) hanno un'icona arancione diversa dal PDF: tipo di file da
  chiarire, per ora `file-earmark-pdf`.
- Righe Doc List: 11 delle 146 legacy.

## Verifica

- `lint_html.py`: 3 file, 0 ERR (un WARN per la larghezza del select repository, come nelle altre pagine).
- Screenshot Playwright a 1600×1000 delle 3 pagine: nessuno scroll orizzontale.
