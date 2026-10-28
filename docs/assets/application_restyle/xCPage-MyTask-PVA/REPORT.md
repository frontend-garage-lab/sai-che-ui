# xCPage-MyTask-PVA — restyle report

Sorgente: `application_screenshot/xCPage-MyTask-PVA/` · Output: `docs/assets/application_restyle/xCPage-MyTask-PVA/` · Data: 2026-10-15

## 1. Il flusso in breve

Il performer PVA apre **Project Data › Tasks**, sceglie un task dallo stage PVA e verifica il documento collegato
(proprietà, revisioni, anteprima PDF). Dopo averlo **accettato** può **riassegnarlo** (ai possible performers o a un
utente specifico) oppure **completarlo** in avanti o all'indietro. 8 schermate su 2 pagine: Documents (1) e Tasks
(2–8, stessa pagina in stati diversi).

| #   | Screenshot                          | Pagina                                                                     | Stato rappresentato                                                 |
| --- | ----------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | `1-MainPage-MenuTask.png`           | [1-MainPage-MenuTask.html](./1-MainPage-MenuTask.html)                     | Documents con risultati (dati di esempio), menu Project Data aperto |
| 2   | `2-ListaTaskPVA.png`                | [2-ListaTaskPVA.html](./2-ListaTaskPVA.html)                               | Lista task PVA, nessuna selezione, azioni disabilitate              |
| 3   | `3-DettaglioDocumento.png`          | [3-DettaglioDocumento.html](./3-DettaglioDocumento.html)                   | Task rwar-1 selezionato, tab Properties, Accept attivo              |
| 4   | `4-DettaglioRevisioniDocumento.png` | [4-DettaglioRevisioniDocumento.html](./4-DettaglioRevisioniDocumento.html) | Tab Revisions                                                       |
| 5   | `5-DettaglioPdfPreview.png`         | [5-DettaglioPdfPreview.html](./5-DettaglioPdfPreview.html)                 | Task accettato, tab PDF preview, Reassign/Complete attivi           |
| 6   | `6-ReassignTask.png`                | [6-ReassignTask.html](./6-ReassignTask.html)                               | Dialog Reassign task, "A specific user" scelto, utente non ancora   |
| 7   | `7-ReassignTaskSelezioneUtente.png` | [7-ReassignTaskSelezioneUtente.html](./7-ReassignTaskSelezioneUtente.html) | Stesso dialog, step "Choose user" (44 utenti, nessuno selezionato)  |
| 8   | `8-CompleteTask.png`                | [8-CompleteTask.html](./8-CompleteTask.html)                               | Dialog Complete task, Forward selezionato, primaria attiva          |

## 2. Layout (griglia 12 colonne)

Entrambe le pagine usano `.rs-workspace`: lista e `sl-detail-panel` stanno nelle 12 colonne e dentro i margini
di pagina, e il pannello è alto quanto la lista (scorre al suo interno).

| Regione                           | ≥1280     | 1024–1279 | <1024 | Motivazione                                                            |
| --------------------------------- | --------- | --------- | ----- | ---------------------------------------------------------------------- |
| Header, titolo, tab               | 12        | 12        | 12    | contesto stabile                                                       |
| Filtri Documents (dentro la card) | 4 + 2×4   | 4 + 2×4   | 6 / 6 | ricerca più larga (testo libero), select brevi a pari peso             |
| Lista task / dettaglio            | **7 / 5** | 6 / 6     | stack | il dettaglio contiene tabelle e anteprima PDF (design-rules §2)        |
| Lista documenti / dettaglio       | **8 / 4** | 7 / 5     | stack | a pagina vuota il dettaglio ha solo empty state; la lista ha 6 colonne |
| Document viewer: miniature/pagina | 3 / 9     | 3 / 9     | 3 / 9 | griglia annidata nella card                                            |

## 3. Mappatura legacy → DS

| Elemento legacy                                        | Componente DS                                                              | Variante / attributi                                                                | Code Connect | Motivazione                                                     |
| ------------------------------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------- |
| Barra superiore + menu Project Data                    | `sl-header`, `sl-header-item` + `sl-menu`                                  | `current` su Project Data; menu aperto via `show()` (schermata 1)                   | CC           | —                                                               |
| Select progetto                                        | `sl-select`                                                                | `size="small"`                                                                      | CC           | —                                                               |
| Icone utente + logout                                  | `sl-dropdown` + `sl-icon-button` `person-fill` + `sl-menu-item`            | `placement="bottom-end"`                                                            | CC           | logout nel menu: niente uscite accidentali                      |
| Tab "Job / Other Documents"                            | `sl-tab-group` solo nav                                                    | `active`                                                                            | CC           | liste diverse → tab                                             |
| Pannello Filters (13 campi)                            | `sl-card` + `sl-input type="search"` + 4 `sl-select` + `sl-drawer`         | label sopra, `clearable`, placeholder "Any"                                         | CC           | 4 filtri principali visibili, 8 secondari in "More filters (8)" |
| Checkbox Multiple search / All versions / Case sens.   | `sl-checkbox`                                                              | `size="small"`; info → `sl-tooltip` su `info-circle`                                | CC           | —                                                               |
| Search / Export / Reset (blu, verde, rosso)            | `sl-button`                                                                | Search `primary`, Reset `text`, Export `default` nella toolbar tabella              | CC           | un solo primary; Export agisce sui risultati                    |
| Create Virtual Binder / Progress / Cancel PVA          | `sl-button` nello slot `toolbar` di `sl-table`                             | Create `primary`, Progress e Cancel PVA `disabled` senza selezione                  | CC           | batch action                                                    |
| Tab Documents / Virtual Binders / Clipboard            | `sl-tab-group` solo nav con icona                                          | `file-earmark`, `folder`, `clipboard`                                               | CC           | —                                                               |
| Griglia documenti vuota "No data to display"           | `sl-table` + slot `empty` → `sl-empty-state`                               | `paginate`, `selection="multiple"`, `sticky-header`                                 | CC           | empty state con indicazione su cosa fare                        |
| Revisions / Transmittal / Distribution Process         | `sl-detail-panel` + `sl-tab-group`                                         | empty state per tab                                                                 | CC           | coerenza con il dettaglio della pagina Tasks                    |
| Stage "PVA \| 22 · Consolidation \| 22 · Review \| 11" | `sl-tab-group.rs-stages` + `sl-tab card` + `sl-badge pill`                 | badge `primary` sullo stage attivo                                                  | CC           | pattern "Card Tabs with Counters" di tab-group.md               |
| Search + `<` `>` + Case sensitive (lista task)         | `sl-input type="search" size="small"` + 2 `sl-icon-button` + `sl-checkbox` | `chevron-left/right` con tooltip "Previous/Next match"                              | CC           | parità: la ricerca "trova successivo" resta                     |
| Accept / Reassign / Complete                           | `sl-button size="small"` nella toolbar della tabella                       | il primary segue il passo del job: Accept → poi Complete                            | CC           | un solo primary, sempre l'azione successiva                     |
| Lettera colorata P / V / A                             | `sl-badge`                                                                 | `warning` / `primary` / `success` + `title`                                         | CC           | lettera + colore mantenuti, tooltip per il significato          |
| Cella task su 3 righe                                  | cella `documentCell()` (`.rs-subheading` + 2 righe `.rs-meta`)             | troncamento + `title`                                                               | CC (tabella) | documento in prima riga (identificativo umano)                  |
| PVA Status "Active"                                    | `sl-status`                                                                | `variant="primary" size="small"`                                                    | CC           | stato con pallino + testo                                       |
| Riga selezionata grigia                                | `sl-table selection="single"` + `setSelection()`                           | —                                                                                   | CC           | —                                                               |
| Pannello Details                                       | `sl-detail-panel`                                                          | `label` = documento con icona pdf, `meta` = task · revisione                        | CC           | —                                                               |
| Details › Document Properties › Info … (3 livelli tab) | 1 livello di tab + `sl-details`                                            | tab Properties / Revisions / Progress / PDF preview; sezioni in `sl-details`        | CC           | massimo due livelli di navigazione                              |
| Coppie "Name: rwar-1" ecc.                             | `sl-description-list` + `sl-description-list-item`                         | `cols="2"`; stati come `sl-status`                                                  | CC           | read-only → description list                                    |
| Linea divisoria nelle proprietà                        | `.rs-subheading` + `sl-divider`                                            | "Identification" / "Status and ownership"                                           | CC           | il divisore diventa un gruppo con nome                          |
| Griglia Revisions + "Count: 1"                         | `sl-table` + `.rs-meta` "1 revision"                                       | colonna stato `sl-status`, versione + `sl-tag` "Current"                            | CC           | —                                                               |
| Viewer PDF                                             | composizione in `sl-card` → **nuovo elemento**                             | vedi §4                                                                             | CC (parti)   | —                                                               |
| Dialog Reassign Task                                   | `sl-dialog`                                                                | `--width: 48rem`; `sl-radio-group` + `sl-radio`, `sl-input readonly`, `sl-textarea` | CC           | riepilogo del task in testa (step autosufficiente)              |
| Icona verde "seleziona utente"                         | `sl-button` "Choose user" con prefix `person-fill`                         | accanto al campo, `.rs-cluster--bottom`                                             | CC           | azione esplicita invece di un'icona da indovinare               |
| Dialog Choose User (sopra Reassign)                    | step 2 dello **stesso** `sl-dialog`                                        | `sl-table selection="single"`, footer Back / Select user                            | CC           | mai dialog sopra dialog (design-rules §5.4)                     |
| Dialog Complete Tasks                                  | `sl-dialog`                                                                | `--width: 40rem`; `sl-radio-group` Forward/Backward + `sl-textarea`                 | CC           | —                                                               |
| Finish / Cancel                                        | `sl-button`                                                                | Cancel `default`, primaria col verbo: "Reassign task", "Complete task"              | CC           | label specifiche (NN/g)                                         |

## 4. ⚠️ Nuovi elementi (non coperti dal DS)

| Elemento                  | Pagine | Perché il DS non basta                   | Come è composto ora                                                                                                                                                                                | Proposta                                                                                             |
| ------------------------- | ------ | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Document viewer** (PDF) | 5–8    | nessun componente di anteprima documento | `sl-card`: header = toolbar (`sl-icon-button` + `sl-tooltip`, `sl-input type="number"` pagina, `sl-divider vertical`, `sl-dropdown` "More tools"), body = griglia 3/9 miniature + pagina (`<img>`) | componente DS `sl-document-viewer` (toolbar standard + slot pagine) oppure pattern Figma documentato |
| Pagine del PDF            | 5–8    | contenuto, non UI                        | ritagli dallo screenshot legacy in `assets/page-{1,2,3}.png`                                                                                                                                       | sostituire con un render reale del PDF in Figma                                                      |

Nessun override `::part` visivo, nessuna superficie custom (il lint non riporta righe `NEW`). Tutte le icone usate
sono tra quelle mappate in Figma.

**Modifiche al DS usate dalle pagine** (nessun elemento nuovo): `sl-detail-panel[contained]`, `sl-table[fill]` e `sl-empty-state[title-text]`, aggiunte/corrette nel codice il 2026-10-15 (vedi DECISIONS.md › Note sul DS).

## 5. Componenti senza Code Connect usati

Nessuno. `sl-menu` e `sl-tab-panel` sono contenitori senza componente Figma, coperti dagli snippet di Dropdown, Header Item e Tab Group.

## 6. Scostamenti dal legacy

| Legacy                                                                   | Restyle                                                                    | Motivazione (regola / reference)                                                     |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 13 filtri tutti visibili                                                 | ricerca + 4 filtri visibili, 8 in drawer "More filters (8)"                | progressive disclosure (design-rules §5.2); quali 4 tenere visibili va validato (§7) |
| Export tra i pulsanti dei filtri                                         | Export nella toolbar della tabella, disabilitato senza risultati           | agisce sui risultati, non sui filtri                                                 |
| Reset rosso                                                              | Reset `variant="text"`                                                     | non distrugge dati: niente `danger`                                                  |
| Revisions / Transmittal / Distribution come accordion                    | tab nel `sl-detail-panel`                                                  | coerenza col dettaglio Tasks                                                         |
| Aggiunto titolo pagina "Documents" / "Tasks"                             | `.rs-title`                                                                | orientamento (un titolo per pagina)                                                  |
| Accept / Reassign / Complete centrati sopra la lista                     | nella toolbar della tabella, a sinistra, prima della ricerca               | azioni sul record selezionato vicino alla lista (Carbon data table)                  |
| Accept resta "Accept" disabilitato dopo l'accettazione                   | diventa "Accepted" disabilitato con icona check                            | lo stato del task si legge dal pulsante                                              |
| Cella task: nome task / documento in grassetto / DIN                     | documento in grassetto in prima riga, poi nome task e DIN                  | identificativo umano per primo (NN/g data tables)                                    |
| Tre livelli di tab (Details › Document Properties › Info…)               | un livello di tab + sezioni `sl-details` (Info aperta)                     | massimo due livelli di navigazione                                                   |
| Tab Details/Pdf Preview + PDF in un'area separata                        | "PDF preview" è il quarto tab del dettaglio                                | un solo pannello di dettaglio                                                        |
| Strumenti di annotazione PDF (testo, disegno, forme, undo/redo) in barra | nel menu "More tools"                                                      | toolbar ≤ 5–7 azioni frequenti                                                       |
| Lista task vuota a destra senza selezione                                | `sl-empty-state` "No task selected"                                        | stato vuoto esplicito                                                                |
| Placeholder "Use the right side icon to select a user"                   | pulsante "Choose user" accanto al campo                                    | azione visibile al posto di un'istruzione nel placeholder                            |
| Dialog Choose User sopra Reassign Task                                   | step 2 dello stesso dialog, con Back                                       | mai dialog sopra dialog                                                              |
| Colonna Description "Nome (email Nome)"                                  | colonna "Email / description" con solo l'email (o la descrizione se manca) | il nome è già nella prima colonna                                                    |
| Aggiunto riepilogo Task / Document nei dialog                            | `sl-description-list` in testa                                             | ogni step autosufficiente (NN/g wizard)                                              |
| "Complete Tasks" (plurale)                                               | "Complete task"                                                            | la selezione è singola negli screenshot (vedi §7)                                    |

### Stati da disegnare (non coperti da nessuna schermata)

- Lista task: caricamento (`sl-skeleton` sulle righe), errore di caricamento, nessun task nello stage.
- Ricerca senza risultati nella lista task e nella lista utenti.
- Reassign: utente scelto (campo compilato, primaria attiva); "Possible performers" scelto (campo utente disabilitato).
- Dopo Reassign / Complete: toast di conferma e lista aggiornata (il task esce dallo stage PVA).
- < 1024px: il dettaglio diventa `sl-drawer placement="end"` (oggi va semplicemente sotto la lista).
- Viewer PDF: caricamento e file non disponibile.

## 7. Domande aperte

1. **Lettere P / V / A** nella prima colonna: cosa indicano? Oggi è un `sl-badge` con un tooltip generico ("Task kind P").
2. **Forward / Backward**: verso quale stage va il task in ciascun caso? Una riga di help text sotto ogni opzione
   ridurrebbe gli errori.
3. **Selezione multipla**: "Complete Tasks" al plurale fa pensare che si possano completare più task insieme. Se è
   così, la lista passa a `selection="multiple"` con le azioni "Complete 3 tasks".
4. **Filtri visibili** in Documents: ho tenuto Discipline, Document type, Document class e Document status (Revision status è nel drawer). Vanno
   confermati sui dati d'uso.
5. **Tab Progress** e sezioni Job document / Contents / Comments / Review: il contenuto non compare negli
   screenshot. Oggi c'è un placeholder.
6. **Instructions**: è facoltativo? A chi viene mostrato?
7. Dati mock: 10 task "AO-OO-…" (uno ipotizzato, 14569), "test_aug12" e 26 utenti oltre ai 18 visibili completano
   i conteggi 22 e 44 mostrati dal legacy.

## 8. Allineamento all'analisi funzionale (SUD 3.0, 2026-10-15)

- Stato PVA con **Promoting** (coda in elaborazione): una riga (`sdsASDA-PVA-10-Jul-2021`) è disabilitata (`rowDisabled`) finché il processo non torna Active. Active / Promoting / Complete hanno colori `primary` / `warning` / `success`. La riga è un esempio di stato: nello screenshot legacy tutte le righe sono Active.
- Dialog Complete: help text che spiega che **Backward** compare solo se esiste un destinatario precedente (le due opzioni restano visibili come nello screenshot).
- Documents: menu di riga con **View Transmittals and DPs**, Add to / Remove from clipboard e Check out / Check in in base al record; tab **Structures** (solo etichetta, nessun pannello); **Export** diventa menu (Export to Excel, View last report); account con **Preferences**.
- **Colori e forma delle azioni**: come nel legacy (icone colorate, o i tre pulsanti con testo del PVA); vedi DECISIONS.md, _Colore delle azioni di task_.
