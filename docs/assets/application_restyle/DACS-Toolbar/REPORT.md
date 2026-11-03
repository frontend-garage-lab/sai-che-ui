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

## Schermate 2–16 (dal 2026-11-02)

- Proposta scelta come base: **P2-SelettoriContesto**. Ogni pagina con dialog o modale si costruisce sopra P2
  (stessa toolbar, card dei selettori, dettaglio), cambiando solo lo stato richiesto dallo screenshot.
- Toolbar aggiornata il 2026-11-02: More rimosso; Modify selected doc, IVA promote / demote, Add WBS & plan shop
  dwgs in testa al menu di riga; Bulk export, Bulk upload docs, Transmit docs, New placeholder in toolbar; Restore
  my last search e Advanced search rimossi; PDF preview rimossa dal dettaglio.

| Pagina                             | Screenshot                                      | Stato                                                                                                                                                                                                  |
| ---------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| S2-SelectedDocs                    | 2-SelectedDocs.png                              | tab Selected Docs attiva, 2 documenti, test2.pdf evidenziato                                                                                                                                           |
| S3-ModifySelectedDocs              | 3-ModifySelectedDocs.png                        | dialog Modify selected doc su test2.pdf: categorie in lista verticale, Document status per prima, ogni checkbox mostra i campi sotto di sé; visibili Status (Issued) e True/False (Confidential = Yes) |
| S3b-ModifySelectedDocs-Attributes  | screen utente (dialog scrollata)                | Free-text (Greenlight Notes = "Testing this doc"), Date vuota, True/False; Status e Picklist non spuntate                                                                                              |
| S5-SelectedDocs-RowMenu            | 5-SelectedDocs-RowMenu.png                      | menu di riga aperto su test2.pdf (voci: Download · Remove from selection, Copy link, Add to favorites, Turn off confidential · Send mail · Admin actions, Actions · Properties, come in Figma)         |
| S6-IVAPromoteDemote                | 6-IVAPromoteDemote.png                          | dialog IVA, una sl-card per documento: 000001-LT… Demote + commento "test", test2.pdf Promote                                                                                                          |
| S7-AddWBS-PlanShopDwgs             | 7-AddWBS-PlanShopDwgs.png                       | come S3 senza Document status; Free-text con la select Attribute aperta (4 attributi), Date e True/False spuntate                                                                                      |
| S8-ImportNewDocs-SelectFiles       | 8-import-new-docs-1.png                         | wizard con `sl-stepper` (5 passi, Workflow disabilitato), passo 1: TestDoc.pdf caricato, formato Acrobat PDF                                                                                           |
| S9-ImportNewDocs-Properties        | 9- e 10-import-new-docs-2/3.png                 | passo 3 Edit properties, tab Info 1 con tutto il form in sezioni (Identification, Revision, Status, Classification) e avviso Current revision                                                          |
| S13-NewPlaceholder-Properties      | 13-new-placeholder-3.png                        | passo 2 Edit properties, stesso form di S9 con i valori dello screenshot; Document status in sola lettura                                                                                              |
| S11-NewPlaceholder-CreationProfile | 11- e 12-new-placeholder (identici)             | wizard New placeholder (5 passi), passo 1: profilo Document Management - Job Document Creation, classe Design Document                                                                                 |
| S14-Properties                     | 14- e 15-property-row (stessa dialog scrollata) | menu di riga › Properties di test2.pdf, tab Info 1 con il form in sezioni (Identification, Revision, Status, Classification, Shop drawings, Planning, Binders)                                         |
| S16-TransmitDocs                   | 16-transmit-docs.png                            | wizard Transmit docs (5 passi, Choose template e Workflow disabilitati), passo 2: Draft, Saipem → TST                                                                                                  |

## Shell di Selected docs (2026-11-02, richiesta dell'utente)

Le schermate dell'OLD con Selected Docs attivo (2, 3 e 3b, 5, 6, 7, 14/15; per 7 e 14 la tab non si vede e la scelta è dell'utente) hanno come base la shell di `DMS-MyWork/2-SelectedDocs.html` (S16 Transmit docs compresa, su richiesta dell'utente: Transmit docs è un'azione della sua toolbar), perché le azioni della toolbar si collegano a quella pagina:
header, sidebar (gruppo My work, voce Selected docs corrente, count 2), breadcrumb Home › My work › Selected docs, titolo e `sl-table` con selezione multipla, toolbar Modify selected doc · IVA promote / demote · Add WBS & plan shop dwgs · Transmit docs + Config e colonna ⋮ come unica azione di riga.
Dati dell'OLD nelle colonne della shell: Document (nome, DIN, titolo) · Document type (Shop Drawing) · Ver. · Status (stati DACS) · Project 000001, 2 righe nell'ordine dello screenshot (000001-LT-4B-P-ITR-Rev00, test2.pdf).
Sparisce rispetto a P2: card dei selettori (Site / Project / Area / Folder), tab Doc List / My Tasks / …, pannello di dettaglio (Revisions) e View. Le pagine 8–16 (OLD con "Displaying 1 - 7 of 7", cioè Doc List) restano sulla base P2 e non sono toccate.
Stato selezione: test2.pdf spuntata in tutte, entrambe le righe in S6. Il menu ⋮ (S5) è `selectedDocMenu` di `DMS-MyWork/data.js`.

Portate in Figma il 2026-11-02: S2, S3, S3b, S5, S6, S7, S14, S16 (NEW). S8, S9, S11 e S13 (Import new docs, New placeholder) usano lo sfondo della P2 aggiornata; tabella senza ordinamento, test2.pdf per prima, come in Figma.

## Proposte rimosse e P2 aggiornata (2026-11-02, richiesta dell'utente)

- **P1-BreadcrumbNavigabile** e **P3-AlberoInDrawer** sono state rimosse (HTML eliminato; in Figma i wrapper `1238:80248` e `1242:81361` non esistono più). Resta **P2-SelettoriContesto** come unica proposta.
- P2 HTML riallineata alla versione modificata a mano in Figma (wrapper `1242:81168`): select di progetto dell'header "000001 - Yard Training" (era NEA YARD UAT); breadcrumb Home › Document Center › Shop Drawings; titolo "Shop Drawings" senza il dropdown View; card con Site / Area / Folder (Project passa nell'header); niente tab di vista (Doc List, My Tasks, …); toolbar Import new docs (`primary`) · New placeholder · Config. Add to binder, Bulk export, Bulk upload docs e Transmit docs non sono più nella toolbar di P2 (Transmit docs è nella toolbar di Selected docs).
