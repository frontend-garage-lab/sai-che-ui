# xCPage-ExecuteOperation-2 — restyle report

Sorgente: `application_screenshot/xCPage-ExecuteOperation-2/` · Output: `docs/assets/application_restyle/xCPage-ExecuteOperation-2/` · Data: 2026-10-15

## 1. Il flusso in breve

Dalla lista Documents l'utente apre il menu del documento **Test-prod-FHM-A3**, sceglie **Operations › Create new
revision**, compila codice revisione e descrizione di emissione, aggiunge il file e conferma. 6 schermate, tutte la
pagina Documents con il dialog Operations.

| #   | Screenshot                    | Pagina                                                         | Stato rappresentato                                                     |
| --- | ----------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | `1-ListaDocumenti.png`        | [1-ListaDocumenti.html](./1-ListaDocumenti.html)               | Ricerca applicata, Test-prod-FHM-A3 selezionato, revisione nel pannello |
| 2   | `2-MenuContestuale.png`       | [2-MenuContestuale.html](./2-MenuContestuale.html)             | Menu della riga aperto                                                  |
| 3   | `3-SelezioneOperation.png`    | [3-SelezioneOperation.html](./3-SelezioneOperation.html)       | Create new revision scelta, form vuoto                                  |
| 4   | `4-PopolamentoCampi.png`      | [4-PopolamentoCampi.html](./4-PopolamentoCampi.html)           | Revision code A2 e Issuing description compilati                        |
| 5   | `5-SelezioneFile.png`         | [5-SelezioneFile.html](./5-SelezioneFile.html)                 | File "CTS Development Guide" aggiunto (`sl-file-upload-item uploaded`)  |
| 6   | `6-NotificaCompletamento.png` | [6-NotificaCompletamento.html](./6-NotificaCompletamento.html) | Esito: Create new revision eseguita                                     |

## 2. Layout (griglia 12 colonne)

Identico a ExecuteOperation-1. Nel form il codice revisione occupa 4 colonne e la descrizione 8 (campo corto accanto
a uno lungo), Content type 12.

## 3. Mappatura legacy → DS

| Elemento legacy                                                | Componente DS                                                                                                                         | Variante / attributi                                                                                                                | Code Connect             | Motivazione                                                 |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------- |
| Header, tab "Job / Other Documents", filtri, tabella, pannello | come da DECISIONS.md                                                                                                                  | `sl-tab-group`, `sl-card`, `sl-table fill`, `sl-detail-panel contained`                                                             | CC                       | coerenza con le altre pagine Documents                      |
| 13 filtri con label dentro il campo                            | ricerca + 4 filtri visibili (Discipline, Document type, Document class, Document status) + drawer "More filters (8)"                  | Document class è visibile perché il flusso lo usa                                                                                   | CC                       | progressive disclosure                                      |
| Filtri applicati (assenti nel legacy)                          | `sl-tag removable` + "Clear all" (`sl-button text`) sopra la tabella                                                                  | solo nelle schermate con ricerca applicata                                                                                          | CC                       | l'utente vede cosa sta filtrando                            |
| Menu contestuale (tasto destro)                                | colonna azioni della riga: `sl-table` `meta.actions` → ⋮ → `sl-menu` con icone                                                        | Operations, Edit · Download, View location, Check out, Add to clipboard · View revisions, View tasks and DPs, View business history | CC (`sl-menu` container) | il menu è scopribile e ha un punto d'ingresso per tastiera  |
| Voce "Actions" del menu                                        | "Operations"                                                                                                                          | apre il dialog omonimo                                                                                                              | CC                       | la voce ha il nome della finestra che apre                  |
| Finestra Operations (3 aree: azioni, selezionati, dettaglio)   | `sl-dialog --width: 72rem`: griglia 5/7, a sinistra Available actions e Selected items (`sl-table`), a destra il pannello dell'azione | Execute operation (primary) e Close nel footer                                                                                      | CC                       | azioni e oggetti a sinistra, parametri e risultato a destra |
| Lista azioni con ricerca "< >" e Case sensitive                | `sl-table selection="single"` con toolbar: `sl-input type="search" size="small"` + `sl-checkbox`                                      | "n actions" sotto la tabella                                                                                                        | CC                       | scelta esclusiva di molte voci con ricerca                  |
| Selected Items "Count: 1"                                      | `sl-table` Document / Rev. code / Document class + "1 item"                                                                           | documento con `documentCell`                                                                                                        | CC                       | —                                                           |
| Pulsante Execute dentro il pannello                            | nel footer del dialog, `variant="primary"`, disabilitato finché non c'è un'azione                                                     | dopo l'esecuzione Close diventa primary                                                                                             | CC                       | un solo primary per regione                                 |

| Form Create new revision | `sl-description-list` (Document, Version + `sl-tag` Current) + `sl-input required` + `sl-select required` + `sl-select` | griglia 4/8/12 | CC | label sopra, campi obbligatori con `required` |
| Box "Files" con ＋ e − e istruzioni drag&drop | `sl-file-drop hide-file-list multiple` + `sl-file-upload-item` | file aggiunto: `state="uploaded"` (schermata 5) | CC | regola upload di DECISIONS.md |
| Box verde "Result for Test-prod-FHM-A3: Executed successfully" | `sl-alert variant="success" open` | schermata 6 | CC | — |
| Icona PDF con nome e versione "1.0, CURRENT" | icona `file-earmark-pdf` + nome, versione con `sl-tag` | — | CC | — |

## 4. ⚠️ Nuovi elementi (non coperti dal DS)

Nessuno. Il lint non riporta righe `NEW`.

## 5. Componenti senza Code Connect usati

Nessuno. `sl-menu` e `sl-tab-panel` sono contenitori coperti dai genitori (DECISIONS.md).

## 6. Scostamenti dal legacy

| Legacy                                         | Restyle                                               | Motivazione (regola / reference)                       |
| ---------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| Lista vuota prima della ricerca                | lista con documenti                                   | richiesta dell'utente di non avere tabelle vuote       |
| Menu tasto destro                              | ⋮ nella riga + menu                                   | **impatto funzionale**: cambia il gesto di apertura    |
| Execute nel pannello                           | Execute operation nel footer                          | un'azione primaria per regione                         |
| Pulsanti ＋ / − per aggiungere e togliere file | drop zone + un item per file con rimozione            | componenti DS (`sl-file-drop`, `sl-file-upload-item`)  |
| Execute attivo senza file (schermata 4)        | resta attivo                                          | nel legacy non è chiaro se il file è obbligatorio (§7) |
| Esito sostituisce il form                      | alert di successo nel pannello, Close diventa primary | —                                                      |

### Stati da disegnare (non coperti da nessuna schermata)

- Upload `uploading` / `failed` (con retry) del file; più file.
- Validazione: codice revisione già esistente o mancante, descrizione non selezionata.
- Esecuzione in corso ed errore.
- Dialog < 1024px.

## 7. Domande aperte

1. **File obbligatorio?** Nel legacy Execute è attivo prima di aggiungere il file.
2. **Content type**: elenco dei valori e se è facoltativo (nel legacy resta vuoto).
3. **Revision code**: proposto automaticamente o libero? Nel legacy "A2" è digitato.
4. **Dopo l'esecuzione**: il documento selezionato cambia revisione (A3 → A2?) e la tabella si aggiorna? Non visibile negli screenshot.
5. Il nome del file mostrato nel legacy è troncato ("CTS Development Guid…"): usato "CTS Development Guide.pdf".

## 8. Allineamento all'analisi funzionale (SUD 3.0, 2026-10-15)

- Le **Operations dipendono da entità e stato** (`operationsFor`): il documento selezionato qui è un interno non approvato, quindi la lista passa da 7 a **11 azioni** (SUD 3.0). Le ultime 4 voci sono dedotte e vanno confermate.
- Menu di riga con **View Transmittals and DPs**, Add to / Remove from clipboard, Check out / Check in, anche nella tabella revisioni; tab **Structures**; **Export** come menu; **Preferences** nel menu account.
