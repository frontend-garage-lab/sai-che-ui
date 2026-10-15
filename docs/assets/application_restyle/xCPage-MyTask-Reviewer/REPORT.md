# xCPage-MyTask-Reviewer — restyle report

Sorgente: `application_screenshot/xCPage-MyTask-Reviewer/` · Output: `docs/assets/application_restyle/xCPage-MyTask-Reviewer/` · Data: 2026-10-15

## 1. Il flusso in breve

Il **reviewer** (Aiello Ciro) apre lo stage **Review** (11 task, tutti scaduti), **accetta** il task "test Foxit_no
signature", **importa** il proprio PDF commentato, controlla nella Dashboard lo stato degli altri reviewer e
**completa** la review. 7 schermate, tutte la stessa pagina Tasks in stati diversi.

| #   | Screenshot               | Pagina                                               | Stato rappresentato                                                             |
| --- | ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | `1-ReviewerMainPage.png` | [1-ReviewerMainPage.html](./1-ReviewerMainPage.html) | Primo task selezionato, non ancora accettato; Accept primario                   |
| 2   | `2-AcceptTask.png`       | [2-AcceptTask.html](./2-AcceptTask.html)             | Tooltip su Accept                                                               |
| 3   | `3-AcceptedTask.png`     | [3-AcceptedTask.html](./3-AcceptedTask.html)         | Task accettato: toast, "Accepted" disabilitato, Import comment primario         |
| 4   | `4-ImportComment.png`    | [4-ImportComment.html](./4-ImportComment.html)       | Dialog Import comment: PDF caricato, formato Acrobat PDF                        |
| 5   | `5-ImportedComment.png`  | [5-ImportedComment.html](./5-ImportedComment.html)   | Toast di upload, commento nel pannello, icona PDF sulla riga, Complete primario |
| 6   | `6-DashboardStatus.png`  | [6-DashboardStatus.html](./6-DashboardStatus.html)   | Tab Dashboard: 3 reviewer, solo Aiello Ciro ha acquisito il task                |
| 7   | `7-CompleteTask.png`     | [7-CompleteTask.html](./7-CompleteTask.html)         | Dialog Complete review task                                                     |

## 2. Layout (griglia 12 colonne)

Identico al flusso LeadReviewer (DECISIONS.md): filtri 7 + KPI 5 (2×2), lista 7 + dettaglio 5 (6/6 tra 1024 e
1279, stack sotto 1024).

## 3. Mappatura legacy → DS

| Elemento legacy                                                                                     | Componente DS                                                                                                 | Variante / attributi                                                      | Code Connect | Motivazione                                                          |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| Header, stage, filtri, KPI, workspace                                                               | come da DECISIONS.md                                                                                          | stage Review attivo, KPI 0 / 0 / 11 / 0                                   | CC           | coerenza tra i flussi Tasks                                          |
| 6 icone sopra la lista (download, upload, undo rosso, freccia blu, spunta arancione, spunta grigia) | toolbar `sl-table`: Accept, Import comment, Download, More ▾ (Forward, Release task), Complete                | primary = prossimo passo: Accept → Import comment → Complete              | CC           | ≤ 5 azioni visibili; il primary guida il reviewer nell'ordine giusto |
| Checkbox nera / arancione nella quick info                                                          | `sl-icon` `clipboard` "Not acquired yet" / `clipboard-check` "Acquired"                                       | `title`                                                                   | CC           | forma diversa, non solo colore                                       |
| Icona PDF sulla riga dopo l'upload                                                                  | `sl-icon` `file-earmark-pdf` "Review comment uploaded"                                                        | —                                                                         | CC           | —                                                                    |
| Icone +, matita, X sopra le tab                                                                     | riga azioni nella tab Review comments: Add comment, Edit, Delete                                              | abilitate secondo lo stato (Add dopo Accept, Edit/Delete con un commento) | CC           | azioni vicine ai commenti a cui si riferiscono                       |
| "No results found." nei commenti                                                                    | `sl-empty-state` "No review comments yet" con il passo successivo nella descrizione                           | icona `chat`                                                              | CC           | l'empty state dice cosa fare                                         |
| Commento "Aiello Ciro - 02-Oct-2026 · Submitted for Lead reviewer"                                  | `sl-comment` + `sl-avatar` + allegato `sl-icon-button` PDF                                                    | —                                                                         | CC           | —                                                                    |
| Dashboard: Names / Task status / Last operation date                                                | `sl-table` + `sl-avatar` + `sl-status` (Acquired `warning` / Not acquired `neutral`)                          | date `02-Oct-2026 13:16`                                                  | CC           | stessa tabella reviewer del flusso LeadReviewer                      |
| Icona persone rossa                                                                                 | `sl-button` "Manage reviewers"                                                                                | —                                                                         | CC           | come nel flusso LeadReviewer                                         |
| Dialog Import Comment (Files + Content type + Format)                                               | `sl-dialog` 48rem: `sl-file-drop hide-file-list` + `sl-file-upload-item state="uploaded"` + 2 `sl-select` 6/6 | Content type `disabled`, Format `required`                                | CC           | regola upload di DECISIONS.md                                        |
| Toast "Success." / "The review comment has been successfully uploaded"                              | `.sl-toast-stack` > `sl-alert variant="success"`                                                              | testo con il nome del documento e il passo successivo                     | CC           | "Success." non dice cosa è successo                                  |
| Dialog Complete Review Task                                                                         | `sl-dialog` 48rem + `sl-alert success` + `sl-table` (stato commento, documento, data)                         | primaria "Complete task"                                                  | CC           | stesso schema del dialog di chiusura del lead reviewer               |

## 4. ⚠️ Nuovi elementi (non coperti dal DS)

Nessuno. Il lint non riporta righe `NEW`.

**Modifiche al DS usate dalle pagine** (nessun elemento nuovo): `sl-detail-panel[contained]`, `sl-table[fill]` e `sl-empty-state[title-text]`, aggiunte/corrette nel codice il 2026-10-15 (vedi DECISIONS.md › Note sul DS).

## 5. Componenti senza Code Connect usati

Nessuno. `sl-menu` e `sl-tab-panel` sono contenitori senza componente Figma, coperti dagli snippet di Dropdown, Header Item e Tab Group. `sl-stat-group` ora ha il suo componente Figma (**Stat Group**) e il suo Code Connect, in attesa di publish (vedi `figma/TODO.md`).

## 6. Scostamenti dal legacy

| Legacy                                             | Restyle                                                                       | Motivazione (regola / reference)                                                 |
| -------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 6 icone senza etichetta                            | 4 pulsanti con etichetta + "More" (Forward, Release task)                     | ≤ 5 azioni visibili — **impatto funzionale**: Forward e Release a un clic in più |
| Accept arancione, Complete verde sempre visibili   | un solo primary che segue il passo del job                                    | un primary per regione                                                           |
| Dopo l'accettazione undo / forward / accept spenti | "Accepted" disabilitato con icona; Forward e Release disabilitati nel menu    | stato del task leggibile dal pulsante                                            |
| Toast "Success."                                   | "test Foxit_no signature has been accepted. You can now import your comment." | il messaggio dice cosa è successo e cosa fare dopo                               |
| "Finish" nel dialog di import                      | "Import comment"                                                              | label col verbo                                                                  |
| "Complete Task(s)"                                 | "Complete task"                                                               | selezione singola negli screenshot                                               |
| Istruzione "Click on complete task(s)…"            | "Your review comment is uploaded. Select Complete task…"                      | conferma il prerequisito e poi l'azione                                          |
| Icone + / matita / X sopra tutte le tab            | solo nella tab Review comments                                                | vicinanza azione–oggetto                                                         |

### Stati da disegnare (non coperti da nessuna schermata)

- Upload `uploading` / `failed` nel dialog di import (oggi `uploaded`).
- Formato del commento non valido (errore sul campo Format o sul file).
- Release task e Forward: dialog di conferma / scelta destinatario.
- Tab Revisions e Properties (contenuto ricostruito dai dati visibili, mai mostrato negli screenshot).

## 7. Domande aperte

1. **Release task** (freccia undo rossa) e **Forward** (freccia blu): confermare il significato e se richiedono una
   conferma.
2. **Add comment** e **Import comment** sono la stessa azione? Oggi Add comment nel pannello è abilitato dopo
   l'accettazione, come nel legacy.
3. **Content type** è sempre "Consolidated comments" e disabilitato anche per un reviewer singolo?
4. Anni di creazione/scadenza delle prime due righe troncati nel legacy ("20-Feb-20…", "25-Jun-20…"): presi dalla
   demo esistente (2026). Righe 8–11 completate dalla stessa demo.

## 8. Allineamento all'analisi funzionale (SUD 3.0, 2026-10-15)

- Etichette secondo il SUD: **Delegate** (era Forward; freccia blu) e **Current assignment** (era il pulsante Manage reviewers).
- **Release task** resta: nel SUD il Reviewer ha solo Accept, Delegate e Complete (Abort è del Lead Reviewer), quindi la voce non ha riscontro e va confermata (§7).
- **Preferences** nel menu account.
- **Colori e forma delle azioni**: come nel legacy (icone colorate, o i tre pulsanti con testo del PVA); vedi DECISIONS.md, _Colore delle azioni di task_.
