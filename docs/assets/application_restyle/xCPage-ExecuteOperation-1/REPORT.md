# xCPage-ExecuteOperation-1 — restyle report

Sorgente: `application_screenshot/xCPage-ExecuteOperation-1/` · Output: `docs/assets/application_restyle/xCPage-ExecuteOperation-1/` · Data: 2026-10-15

## 1. Il flusso in breve

L'utente cerca un documento in **Project Data › Documents** filtrando per disciplina e classe, apre il menu del
documento, sceglie **Operations**, seleziona l'azione **Cancel Revision**, la esegue e legge l'esito. 7 schermate, tutte
la pagina Documents (con il dialog nelle ultime 3).

| #   | Screenshot                           | Pagina                                                                       | Stato rappresentato                                                |
| --- | ------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | `1-DocumentiHome.png`                | [1-DocumentiHome.html](./1-DocumentiHome.html)                               | Documents senza filtri, nessun documento selezionato               |
| 2   | `2-RicercaDocumenti.png`             | [2-RicercaDocumenti.html](./2-RicercaDocumenti.html)                         | Filtro Document class aperto (4 classi)                            |
| 3   | `3-RisultatoRicerca.png`             | [3-RisultatoRicerca.html](./3-RisultatoRicerca.html)                         | Filtri applicati, risultato "Test Progress2_01" selezionato        |
| 4   | `4-MenuContestuale.png`              | [4-MenuContestuale.html](./4-MenuContestuale.html)                           | Menu della riga aperto sul documento Documenz297…                  |
| 5   | `5-ModaleOperations.png`             | [5-ModaleOperations.html](./5-ModaleOperations.html)                         | Dialog Operations: 7 azioni, elemento selezionato e sua quick info |
| 6   | `6-SelezioneEsecuzioneOperation.png` | [6-SelezioneEsecuzioneOperation.html](./6-SelezioneEsecuzioneOperation.html) | Cancel Revision scelta, pronta da eseguire                         |
| 7   | `7-NotificaRisultato.png`            | [7-NotificaRisultato.html](./7-NotificaRisultato.html)                       | Cancel Revision eseguita: esito e lista ridotta a 5 azioni         |

## 2. Layout (griglia 12 colonne)

| Regione                     | ≥1280               | 1024–1279 | <1024 | Motivazione                                                 |
| --------------------------- | ------------------- | --------- | ----- | ----------------------------------------------------------- |
| Filtri (card)               | 12: ricerca 4 + 4×2 | 12        | 6/6   | la ricerca testuale è il campo più largo                    |
| Lista documenti / dettaglio | **8 / 4**           | 7 / 5     | stack | a pagina vuota il dettaglio ha solo revisioni               |
| Dialog Operations           | 5 / 7               | 5 / 7     | stack | azioni e oggetti a sinistra, parametri e risultato a destra |

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

| Box "Selected Item Quick Info View" | `sl-card` + `sl-description-list cols="2"` | Identification number, Name, Title, Revision status, Revision code, Version, State, Issuing description | CC | read-only → description list |
| Titolo azione "Cancel Revision" (colore rosso scuro) | `.rs-heading` + `sl-alert warning` con la conseguenza | schermata 6 | CC | prima di eseguire l'utente legge cosa succede |
| Box verde "Result for … Executed successfully" | `sl-alert variant="success" open` | schermata 7 | CC | esito inline nel dialog |
| Icona rotta `{icon_title}` nella riga Auto Populated | stessa quick info degli altri documenti | — | CC | è un'icona mancante nel legacy, non un dato |

## 4. ⚠️ Nuovi elementi (non coperti dal DS)

Nessuno. Il lint non riporta righe `NEW`.

## 5. Componenti senza Code Connect usati

Nessuno. `sl-menu` e `sl-tab-panel` sono contenitori coperti dai genitori (DECISIONS.md).

## 6. Scostamenti dal legacy

| Legacy                                                | Restyle                                                   | Motivazione (regola / reference)                                                          |
| ----------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Elenco vuoto "No data to display" nelle schermate 1-2 | lista con i 6 documenti                                   | richiesta dell'utente di non avere tabelle vuote; la ricerca restringe poi i risultati    |
| Menu tasto destro                                     | ⋮ nella riga + menu                                       | scopribile, accessibile da tastiera — **impatto funzionale**: cambia il gesto di apertura |
| Voce "Actions"                                        | "Operations"                                              | nome della finestra                                                                       |
| Execute nel pannello                                  | Execute operation nel footer                              | un'azione primaria per regione                                                            |
| Document class tra i filtri secondari                 | visibile; Revision status nel drawer                      | il flusso usa Document class                                                              |
| Menu contestuale: voce troncata "…s and DPs"          | "View tasks and DPs"                                      | testo ipotizzato (§7)                                                                     |
| Pallino "Test Progress2_01" con tooltip a tre righe   | nessun tooltip                                            | il nome completo è già in tabella                                                         |
| Cancel Revision senza testo                           | alert con la conseguenza e il rimando a Uncancel Revision | l'azione è reversibile (compare Uncancel Revision nella lista dopo l'esecuzione)          |

### Stati da disegnare (non coperti da nessuna schermata)

- Esecuzione in corso (`loading` su Execute) ed errore (`sl-alert danger` con motivo e Retry).
- Operazioni con parametri diversi da Create new revision (vedi flusso ExecuteOperation-2).
- Nessun risultato della ricerca; più documenti selezionati.
- Dialog < 1024px.

## 7. Domande aperte

1. **Voci del menu**: la voce troncata è "View tasks and DPs"? Ci sono altre voci sotto "View business history"?
2. **Cancel Revision**: chiede una conferma o un motivo? Oggi nel legacy non ha parametri.
3. **Elenco azioni dopo l'esecuzione**: da 7 a 5 azioni (sparisce Create new revision e altre): quali regole decidono le azioni disponibili? Vanno spiegate all'utente?
4. **Selezione multipla**: si possono eseguire le operazioni su più documenti? "Selected items" è una lista.
5. Revisione "YV" di Auto Populated e documento senza quick info: dati di test?

## 8. Allineamento all'analisi funzionale (SUD 3.0, 2026-10-15)

- Le **Operations non sono una lista fissa**: dipendono da entità e stato (`operationsFor` in `_shared/restyle.js`). Documento interno Approved: 7 azioni (screenshot legacy); documento interno non approvato: 11 (con Emergency Approval); documento esterno: 8 (con Sign as Received invece di Emergency Approval). Le ultime 4 voci delle 11 sono dedotte (nel SUD la lista è tagliata) e vanno confermate.
- Menu di riga: **View Transmittals and DPs**, Add to / Remove from clipboard, Check out / Check in; il menu è presente anche nella tabella delle revisioni (pannello di destra). Quick info mostra il lucchetto se il documento è in check-out.
- Tab **Structures**; **Export** come menu; **Preferences** nel menu account.
