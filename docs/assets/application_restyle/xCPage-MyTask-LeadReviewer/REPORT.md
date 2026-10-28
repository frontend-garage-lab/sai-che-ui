# xCPage-MyTask-LeadReviewer — restyle report

Sorgente: `application_screenshot/xCPage-MyTask-LeadReviewer/` · Output: `docs/assets/application_restyle/xCPage-MyTask-LeadReviewer/` · Data: 2026-10-15

## 1. Il flusso in breve

Il **lead reviewer** apre **Project Data › Tasks**, passa allo stage **Consolidation** e filtra per Originator.
Seleziona un task e controlla i commenti dei reviewer, il loro stato (Dashboard), le revisioni e le proprietà del
documento. Carica il **commento consolidato** (singolo da "Update comment", o massivo da "Import comments"),
**notifica** il task e prova a **chiudere la review**: il sistema blocca la chiusura perché il commento consolidato
manca. 13 schermate su 2 pagine: Documents (1, identica al flusso PVA) e Tasks (2–13, stessa pagina in stati diversi).

| #   | Screenshot                           | Pagina                                                                       | Stato rappresentato                                                      |
| --- | ------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | `1-MainPage-MenuTask.png`            | [1-MainPage-MenuTask.html](./1-MainPage-MenuTask.html)                       | Documents con risultati (dati di esempio), menu Project Data aperto      |
| 2   | `2-SelezioneLeadReviewerArea.png`    | [2-SelezioneLeadReviewerArea.html](./2-SelezioneLeadReviewerArea.html)       | Stage Consolidation appena aperto: KPI in caricamento, azioni off        |
| 3   | `3-SelezioneFiltri.png`              | [3-SelezioneFiltri.html](./3-SelezioneFiltri.html)                           | Select Originator aperta (14 originator)                                 |
| 4   | `4-SelezioneTask.png`                | [4-SelezioneTask.html](./4-SelezioneTask.html)                               | test_doc_3_1905-A3 selezionato, tab Review comments                      |
| 5   | `5-UploadFileCommentato.png`         | [5-UploadFileCommentato.html](./5-UploadFileCommentato.html)                 | Dialog Update consolidated comment, nessun file                          |
| 6   | `6-RefreshListaCommenti.png`         | [6-RefreshListaCommenti.html](./6-RefreshListaCommenti.html)                 | Tooltip "Refresh comments list" visibile                                 |
| 7   | `7-DettaglioAzioniCommenti.png`      | [7-DettaglioAzioniCommenti.html](./7-DettaglioAzioniCommenti.html)           | Tab Dashboard: reviewer e stato dei loro task                            |
| 8   | `8-DettaglioRevisioniDocumento.png`  | [8-DettaglioRevisioniDocumento.html](./8-DettaglioRevisioniDocumento.html)   | Tab Revisions (A3 corrente, A1, A2)                                      |
| 9   | `9-DettaglioDocumento.png`           | [9-DettaglioDocumento.html](./9-DettaglioDocumento.html)                     | Tab Properties: Document info, Task info, Review status                  |
| 10  | `10-ImportMassivoFileCommentati.png` | [10-ImportMassivoFileCommentati.html](./10-ImportMassivoFileCommentati.html) | Dialog Import consolidated comments, nessun file                         |
| 11  | `11-TastoNotificaTask.png`           | [11-TastoNotificaTask.html](./11-TastoNotificaTask.html)                     | Tooltip sul pulsante Notify                                              |
| 12  | `12-TaskNotificato.png`              | [12-TaskNotificato.html](./12-TaskNotificato.html)                           | Toast di conferma, icona "Notified" sulla riga, commenti in reload       |
| 13  | `13-ChiusuraReview.png`              | [13-ChiusuraReview.html](./13-ChiusuraReview.html)                           | Dialog Complete lead review task bloccato: commento consolidato mancante |

Selezione: la schermata 4 mostra test_doc_3_1905-A3, dalla 5 in poi test_doc_1_1905-A3 (come nel legacy).

## 2. Layout (griglia 12 colonne)

Stesso pattern **workspace con sidebar** del flusso PVA (DECISIONS.md). In più c'è la fascia filtri + KPI.

| Regione                        | ≥1280     | 1024–1279 | <1024 | Motivazione                                                                                                                        |
| ------------------------------ | --------- | --------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Filtri (card)                  | 7         | 7         | 6     | 3 campi: ricerca 6 + Originator 3 + Discipline 3 nella griglia interna                                                             |
| KPI scadenze (`sl-stat-group`) | 5 (2×2)   | 5 (2×2)   | 6     | ogni `sl-stat` è largo almeno 11rem: in 5 colonne i 4 KPI vanno 3+1 → forzati 2×2 (`.rs-stats-2x2`), altezza pari alla card filtri |
| Lista task / dettaglio         | **7 / 5** | 6 / 6     | stack | il dettaglio contiene commenti e tabelle                                                                                           |

## 3. Mappatura legacy → DS

| Elemento legacy                                                           | Componente DS                                                                                                                      | Variante / attributi                                                                                                        | Code Connect               | Motivazione                                                               |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------- |
| Header, stage, workspace, toolbar, celle documento                        | come da DECISIONS.md                                                                                                               | stage Consolidation attivo                                                                                                  | CC                         | coerenza con il flusso PVA                                                |
| Ricerca + Originator + Discipline + Multiple search / Case sensitive      | `sl-card` "Filters" + `sl-input type="search"` + 2 `sl-select` + `sl-checkbox`                                                     | label sopra, `clearable`; Originator `open hoist` nella schermata 3                                                         | CC                         | stesso pannello filtri di Documents, senza "More filters" (2 soli filtri) |
| Search (blu) / Reset (rosso)                                              | `sl-button`                                                                                                                        | Search `primary`, Reset `text`                                                                                              | CC                         | —                                                                         |
| Cerchi 0 / 0 / 0 / 22 + legenda Safe / Expiring / Expired / Notified      | `sl-stat-group` + 4 `sl-stat`                                                                                                      | `success` / `warning` / `danger` / `accent` (KPI summary row di stat.md), icona prefix                                      | CC (`sl-stat-group` no-CC) | numero e legenda nello stesso elemento; i KPI fanno da filtro rapido      |
| Cerchi vuoti durante il caricamento                                       | 4 `sl-skeleton effect="pulse"`                                                                                                     | stessa griglia 2×2                                                                                                          | CC                         | stato di caricamento esplicito                                            |
| 7 icone colorate sopra la lista                                           | toolbar di `sl-table`: Download, Import comments, Notify, More ▾ (Forward, Accept, Release task), Complete                         | `size="small"` con icona e label; Complete `primary`                                                                        | CC                         | ≤ 5 azioni visibili (Carbon), le meno frequenti in "More"                 |
| Pallino rosso / quadrato arancione / fumetto verde-grigio / "!" rosso     | colonna quick info: `sl-status` + `sl-icon` `clipboard-check` / `check2-circle` o `clock` / `bell`                                 | `title` su ogni marcatore; forme diverse invece di colori diversi                                                           | CC                         | nessuna informazione affidata solo al colore (WCAG 1.4.1)                 |
| Colonne Tasks / Rev. Co… / Created … / Due Date / Discipline / Originator | colonne `sl-table`                                                                                                                 | intestazioni per intero; date `nowrap`, ordinabili                                                                          | CC                         | niente intestazioni troncate                                              |
| Pannello Details                                                          | `sl-detail-panel`                                                                                                                  | `label` = documento con icona pdf, `meta` = revisione · scadenza                                                            | CC                         | —                                                                         |
| Icone +, matita, download, refresh sopra le tab                           | riga azioni nella tab Review comments: "Add comment" (off), "Update comment", `sl-icon-button` Download e Refresh con `sl-tooltip` | le azioni stanno nella tab a cui si riferiscono                                                                             | CC                         | nella tab Dashboard l'azione è diversa ("Manage reviewers")               |
| Tab Review Comments / Dashboard / Revisions / Properties                  | `sl-tab-group` nel pannello                                                                                                        | —                                                                                                                           | CC                         | —                                                                         |
| Lista "Details" con icona PDF, utente, data, testo                        | `sl-comment` + `sl-avatar` + `sl-icon-button` allegato                                                                             | sezioni "Reviewer comments (2)" e "Consolidated comment (1)" separate da `sl-divider`                                       | CC                         | componente nato per questo caso (comment.md)                              |
| Testo corsivo "Please upload your consolidated comment…"                  | `sl-alert variant="primary"`                                                                                                       | icona `info-circle`                                                                                                         | CC                         | è il prossimo passo del job: va evidenziato                               |
| "Loading…" sopra i commenti                                               | `sl-skeleton effect="sheen"` al posto dei commenti, azioni disabilitate                                                            | `aria-busy`                                                                                                                 | CC                         | —                                                                         |
| Tab Dashboard: Names / Task status / Last operation date                  | `sl-table` con `sl-avatar`, `sl-status success` "Completed" + icona pdf                                                            | date in formato `16-Jun-2023 17:34`                                                                                         | CC                         | formato data coerente con il resto della pagina                           |
| Icona rossa "persone" nella Dashboard                                     | `sl-button size="small"` "Manage reviewers" con `person-fill`                                                                      | —                                                                                                                           | CC                         | funzione da confermare (§7)                                               |
| Tab Revisions                                                             | `sl-table` + "3 revisions"                                                                                                         | `sl-tag success` "Current" su A3                                                                                            | CC                         | —                                                                         |
| Box Document Info / Task Info / Review Status Info                        | 3 `sl-details open` con `sl-description-list cols="2"`                                                                             | Acquired → `sl-tag warning`, Expired → `sl-status danger`, Closed → `sl-status success`, Not notified → `sl-status neutral` | CC                         | stesso pattern Proprietà di DECISIONS.md                                  |
| Dialog Update Comment (Files + Name)                                      | `sl-dialog` 40rem + `sl-file-drop` + `sl-input`                                                                                    | riepilogo Task / Due date in testa; primaria "Update comment" disabilitata senza file                                       | CC                         | —                                                                         |
| Dialog Import Massive Comments                                            | `sl-dialog` 48rem + `sl-file-drop multiple`                                                                                        | primaria "Import comments" disabilitata                                                                                     | CC                         | —                                                                         |
| Toast verde "Selected task has been successfully notified"                | `.sl-toast-stack` > `sl-alert variant="success" open closable`                                                                     | testo con il nome del documento                                                                                             | CC                         | dice _quale_ task è stato notificato                                      |
| Dialog Complete Lead Review Task                                          | `sl-dialog` 64rem + `sl-alert warning` + `sl-table selection="multiple"`                                                           | toolbar con "Apply options" (`gear`, disabilitato) e spiegazione inline                                                     | CC                         | il box informativo diventa testo accanto al pulsante che descrive         |
| X rossa nella quick info del dialog                                       | colonna "Consolidated comment" con `sl-status danger` "Missing"                                                                    | —                                                                                                                           | CC                         | testo esplicito invece di un'icona                                        |
| Comment date "1-Jan-1970 01:00"                                           | "—"                                                                                                                                | —                                                                                                                           | —                          | è una data vuota mostrata come epoch, non un dato                         |

## 4. ⚠️ Nuovi elementi (non coperti dal DS)

Nessuno. Il lint non riporta righe `NEW`: nessuna superficie custom, nessun override `::part` visivo, tutte le icone
sono tra quelle mappate in Figma. L'unica regola nuova è di layout (`.rs-stats-2x2`: `flex-basis` sugli host
`sl-stat`, in `_shared/restyle.css`).

**Modifiche al DS usate dalle pagine** (nessun elemento nuovo): `sl-detail-panel[contained]`, `sl-table[fill]` e `sl-empty-state[title-text]`, aggiunte/corrette nel codice il 2026-10-15 (vedi DECISIONS.md › Note sul DS).

## 5. Componenti senza Code Connect usati

Nessuno. `sl-menu` e `sl-tab-panel` sono contenitori senza componente Figma, coperti dagli snippet di Dropdown, Header Item e Tab Group. `sl-stat-group` ora ha il suo componente Figma (**Stat Group**) e il suo Code Connect, in attesa di publish (vedi `figma/TODO.md`).

## 6. Scostamenti dal legacy

| Legacy                                                     | Restyle                                                                                                                                   | Motivazione (regola / reference)                                                                                                        |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 7 icone senza etichetta sopra la lista                     | 4 pulsanti con etichetta + menu "More" (Forward, Accept, Release task)                                                                    | ≤ 5 azioni visibili; icone non autoesplicative (NN/g data tables) — **impatto funzionale**, le azioni in More richiedono un clic in più |
| Etichette delle azioni dedotte dalle icone                 | Download, Import comments, Notify, Forward, Accept, Release task, Complete                                                                | da confermare (§7)                                                                                                                      |
| Complete verde                                             | `primary` sul passo corrente (Import comments → Notify → Complete), ordine della toolbar da DECISIONS                                     | è il passo finale del job                                                                                                               |
| Fumetto verde / grigio (reviewer)                          | `check2-circle` "closed" / `clock` "in progress"                                                                                          | forme diverse, non solo colore                                                                                                          |
| Azioni +, matita, download, refresh sopra tutte le tab     | solo nella tab Review comments (a cui si riferiscono)                                                                                     | vicinanza azione–oggetto                                                                                                                |
| Commenti reviewer e consolidato in due box con "Count: n"  | due sezioni con titolo e conteggio, separate da un divisore                                                                               | stesso pannello, meno cornici                                                                                                           |
| Istruzione in corsivo grigio                               | `sl-alert` informativo                                                                                                                    | è l'azione che sblocca la chiusura                                                                                                      |
| Box informativo blu nel dialog di chiusura                 | testo inline accanto ad "Apply options"                                                                                                   | la spiegazione sta vicino al controllo che descrive                                                                                     |
| "1-Jan-1970 01:00"                                         | "—"                                                                                                                                       | valore vuoto, non una data                                                                                                              |
| Cerchi vuoti durante il caricamento                        | `sl-skeleton`                                                                                                                             | stato di caricamento esplicito                                                                                                          |
| Aggiunto riepilogo Task / Due date nel dialog di upload    | `sl-description-list`                                                                                                                     | step autosufficiente                                                                                                                    |
| Pannello "Files" vuoto con istruzioni nei dialog di upload | `sl-file-drop hide-file-list` + `sl-file-upload-item` (schermata 5: 1 file `uploading`; schermata 10: `uploaded`, `uploading`, `waiting`) | gli screenshot mostrano la lista vuota: **stato di caricamento aggiunto su richiesta**                                                  |     |
| Pulsante Notify dopo la notifica                           | disabilitato, icona `bell` sulla riga                                                                                                     | stato visibile e niente doppie notifiche                                                                                                |

### Stati da disegnare (non coperti da nessuna schermata)

- Upload `failed` (con retry) nei dialog: oggi i dialog mostrano `uploaded`, `uploading` e `waiting`.
- Dialog di chiusura **sbloccato** (commento consolidato presente), con "Apply options" attivo dopo la selezione.
- KPI selezionato come filtro (es. solo "Expired") e lista filtrata.
- Ricerca senza risultati; errore nel caricamento dei commenti.
- < 1024px: dettaglio in `sl-drawer placement="end"`.

## 7. Domande aperte

1. **Azioni della toolbar**: le icone legacy non hanno etichetta. Ho dedotto Download, Import comments (upload),
   Notify (!), Forward (freccia), Accept (spunta grigia), Complete (spunta verde) e Release task (utente con X). Vanno
   confermate, insieme a quali tenere visibili e quali in "More".
2. **Matching dell'import massivo**: come vengono associati i file ai task (nome file = nome documento?). La risposta
   va scritta nel `hint` del file drop.
3. **"Manage reviewers"** (icona persone rossa nella Dashboard): cosa fa?
4. **KPI dopo la notifica**: nel legacy "Notified" resta 0 dopo la notifica. È un aggiornamento mancato o un'altra
   metrica? Nel restyle resta 0 come nello screenshot.
5. **Add comment** (icona +, disabilitata): quando si abilita per il lead reviewer?
6. Dati mock: 15 dei 22 task e gli originator assegnati ai task sono ipotizzati sullo schema dei 7 visibili.

## 8. Allineamento all'analisi funzionale (SUD 3.0, 2026-10-15)

- Etichette secondo il SUD: **Assign for additional commenting** (era Forward), **Abort** (era Release task), **Current assignment** (era il pulsante Manage reviewers: l'icona gruppi è di sola lettura, quindi diventa un titolo).
- Documents: menu di riga con **View Transmittals and DPs**, Add to / Remove from clipboard, Check out / Check in; tab **Structures**; **Export** come menu; **Preferences** nel menu account.
- **Colori e forma delle azioni**: come nel legacy (icone colorate, o i tre pulsanti con testo del PVA); vedi DECISIONS.md, _Colore delle azioni di task_.
- **Icone aggiunte a Figma** (Bootstrap, con Code Connect): `person-x` (Abort), `check-square` / `check-square-fill` (Accepted) e `chat-fill` (commento).
