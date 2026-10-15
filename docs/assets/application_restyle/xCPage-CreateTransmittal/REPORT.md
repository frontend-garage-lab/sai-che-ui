# xCPage-CreateTransmittal — restyle report

Sorgente: `application_screenshot/xCPage-CreateTransmittal/` · Output: `docs/assets/application_restyle/xCPage-CreateTransmittal/` · Data: 2026-10-15

## 1. Il flusso in breve

L'utente apre **Project Data › Transmittals › Outgoing** e crea una nuova transmittal con una procedura guidata a
quattro passi: **proprietà**, **documenti** (con ricerca e relazione dei documenti), **destinatari** (con scelta di
motivo e metodo di consegna), **membership**. Alla fine compare la conferma e la nuova riga. 9 schermate: la pagina
Transmittals (1, 9) e il dialog (2–8).

| #   | Screenshot                                    | Pagina                                                                                         | Stato rappresentato                                                     |
| --- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | `1-Pagina Transmttal.png`                     | [1-Pagina Transmttal.html](<./1-Pagina Transmttal.html>)                                       | Transmittals, area Outgoing, nessuna selezione                          |
| 2   | `2-CreazioneTransmittal-Property.png`         | [2-CreazioneTransmittal-Property.html](./2-CreazioneTransmittal-Property.html)                 | Passo 1, proprietà vuote                                                |
| 3   | `3-CreazioneTransmitta-PropertyCompilate.png` | [3-CreazioneTransmitta-PropertyCompilate.html](./3-CreazioneTransmitta-PropertyCompilate.html) | Passo 1 compilato in parte (PO, disciplina, motivo, azienda, sender)    |
| 4   | `4-CreazioneTransmittal-Documenti.png`        | [4-CreazioneTransmittal-Documenti.html](./4-CreazioneTransmittal-Documenti.html)               | Passo 2, nessun documento allegato                                      |
| 5   | `5-CreazioneTransmittal-SceltaDocumenti.png`  | [5-CreazioneTransmittal-SceltaDocumenti.html](./5-CreazioneTransmittal-SceltaDocumenti.html)   | Passo 2, "Add documents": ricerca "Test", nessuna selezione             |
| 6   | `6-CreazioneTransmittal-Recipients.png`       | [6-CreazioneTransmittal-Recipients.html](./6-CreazioneTransmittal-Recipients.html)             | Passo 3, nessun destinatario                                            |
| 7   | `7-CreazioneTransmittal-SceltaRecipients.png` | [7-CreazioneTransmittal-SceltaRecipients.html](./7-CreazioneTransmittal-SceltaRecipients.html) | Passo 3, "Add recipients": user_test1 scelto, metodi di consegna aperti |
| 8   | `8-CreazioneTransmittal-Membership.png`       | [8-CreazioneTransmittal-Membership.html](./8-CreazioneTransmittal-Membership.html)             | Passo 4, ruoli e membri                                                 |
| 9   | `9-NotificaOperazioneCompletata.png`          | [9-NotificaOperazioneCompletata.html](./9-NotificaOperazioneCompletata.html)                   | Transmittal creata: toast e nuova riga in lista                         |

## 2. Layout (griglia 12 colonne)

| Regione                       | ≥1280                                          | 1024–1279 | <1024 | Motivazione                             |
| ----------------------------- | ---------------------------------------------- | --------- | ----- | --------------------------------------- |
| Filtri (card)                 | ricerca 4 + 4×2                                | 12        | 6/6   | stesso schema delle altre pagine lista  |
| Lista transmittal / dettaglio | **8 / 4**                                      | 7 / 5     | stack | dettaglio solo di riepilogo             |
| Dialog, passo 1               | scelta origine 3 + form 9                      | idem      | stack | la scelta "Create from" è corta e fissa |
| Form del passo 1              | campi 6/6, numeri e codici 3–4, data 4 + ora 2 | idem      | stack | larghezza proporzionale al contenuto    |
| Dialog, passi 2–4             | 12, selezione documenti con filtri 4+2×4       | idem      | stack | tabelle a tutta larghezza               |

## 3. Mappatura legacy → DS

| Elemento legacy                                                                          | Componente DS                                                                                                                                         | Variante / attributi                                                                            | Code Connect            | Motivazione                     |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------- |
| Header, filtri, lista, dettaglio                                                         | come da DECISIONS.md                                                                                                                                  | `sl-table fill`, `sl-detail-panel contained`                                                    | CC                      | coerenza con le altre pagine    |
| Aree "Preparation Area / Incoming / Outgoing / Distribution Process"                     | `sl-tab-group.rs-stages` con `sl-tab card`                                                                                                            | Outgoing attiva, senza contatori (il legacy non li mostra)                                      | CC                      | pattern delle aree di lavoro    |
| 12 filtri                                                                                | ricerca + 4 filtri visibili + drawer "More filters (6)"                                                                                               | Managed by e Assignation status disabilitati con help text                                      | CC                      | progressive disclosure          |
| 7 pulsanti sopra la lista                                                                | Create outgoing (primary), Create from existing, Assign to me, Complete assignment + "Actions ▾" (Edit, Create DP from transmittal)                   | disabilitati senza selezione                                                                    | CC                      | ≤ 5 azioni visibili             |
| Dialog con colonna di 5 grandi tile (New, From Existing, …)                              | `sl-radio-group` "Create from" con 5 `sl-radio`                                                                                                       | a sinistra, span 3                                                                              | CC                      | scelta esclusiva                |
| Pulsanti "< Back / Next > / Finish / Cancel"                                             | `sl-stepper` con 4 `sl-step` + footer Cancel / Back / "Next: <passo>"                                                                                 | l'ultimo passo ha "Create transmittal"                                                          | CC (`sl-stepper` no-CC) | design-rules §5.5               |
| Form del passo 1 con etichette a sinistra                                                | sezioni Type, Info, Classification, Routing, Dates and response con `.rs-subheading` + `.rs-grid--fields`                                             | `required` su Type, Template, Name, PO number, Issuing reason, From company, Sender, To company | CC                      | label sopra, gruppi con nome    |
| Valori non modificabili (Project Code, Transmittal Type, Transmittal Status)             | `sl-description-list`                                                                                                                                 | stato `Working` con `sl-status neutral`                                                         | CC                      | read-only                       |
| Data + ora (due campi con icone)                                                         | `sl-input type="date"` + `sl-input type="time"`                                                                                                       | 4 + 2 colonne                                                                                   | CC                      | —                               |
| Passo 2: checkbox SharePoint / email                                                     | due gruppi di `sl-checkbox size="small"` con `.rs-subheading`                                                                                         | 6 / 6                                                                                           | CC                      | —                               |
| Passo 2: 6 pulsanti sopra la tabella                                                     | toolbar: Add documents (primary), "Add from ▾" (Clipboard, Virtual binder, Transmittal or DP), Edit relation properties, Import consolidated comments | gli ultimi due disabilitati                                                                     | CC                      | —                               |
| Tabella documenti allegati vuota                                                         | `sl-table` + `sl-empty-state` con azione implicita                                                                                                    | "0 documents"                                                                                   | CC                      | —                               |
| Dialog "Relate Transmittal to Doc" sopra il dialog                                       | **sotto-vista** "Add documents" dello stesso dialog (stepper fermo al passo 2)                                                                        | footer "Back to documents" + "Add documents (0)"                                                | CC                      | mai dialog sopra dialog         |
| Doppia lista con `>` `<` `<`                                                             | `sl-table selection="multiple"` con i risultati + riga "Selected (n)"                                                                                 | design-rules §5.7                                                                               | CC                      | niente trasferimento tra liste  |
| "More than 1000 results returned"                                                        | `sl-alert variant="primary"` sopra la tabella                                                                                                         | —                                                                                               | CC                      | invita a restringere la ricerca |
| Passo 3: pulsanti Add Internal / Add External / Import / Edit / Remove / Apply Dist List | toolbar: Add internal (primary), Add external, "Add from ▾" (Transmittal or DP, Distribution list), Edit recipients, Remove                           | Edit e Remove disabilitati                                                                      | CC                      | —                               |
| Apply Distribution Matrix + matrice + Assigned Group                                     | `sl-checkbox`, `sl-select disabled` con help text, `sl-select required`                                                                               | griglia 6/6                                                                                     | CC                      | —                               |
| Dialog "Select Transmittal Recipient" sopra il dialog                                    | **sotto-vista** "Add recipients": Reason e Delivery method (`sl-select required`, elenco aperto) + `sl-table selection="multiple"` degli utenti       | "Selected (1)" con `sl-tag removable`                                                           | CC                      | mai dialog sopra dialog         |
| Passo 4: Roles / Members con pulsante di modifica                                        | `sl-description-list cols="1"` con nome e `sl-icon-button pencil`                                                                                     | label "Edit admins" / "Edit consumers"                                                          | CC                      | —                               |
| Toast "Object created successfully."                                                     | `.sl-toast-stack` > `sl-alert variant="success"` che nomina la transmittal                                                                            | —                                                                                               | CC                      | non "Success." generico         |

## 4. ⚠️ Nuovi elementi (non coperti dal DS)

Nessuno. Il lint non riporta righe `NEW`.

## 5. Componenti senza Code Connect usati

Nessuno. `sl-stepper` ha ora il suo componente Figma (**Stepper**) e il suo Code Connect, in attesa di publish (vedi
`figma/TODO.md`). `sl-menu` e `sl-tab-panel` sono contenitori coperti dai genitori (DECISIONS.md).

## 6. Scostamenti dal legacy

| Legacy                                                        | Restyle                                                   | Motivazione (regola / reference)                                                                   |
| ------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Lista transmittal vuota                                       | 3 transmittal di esempio (4 dopo la creazione)            | richiesta dell'utente di non avere tabelle vuote                                                   |
| Elenco documenti allegati e destinatari vuoti (passi 2 e 3)   | lasciati vuoti con `sl-empty-state`                       | è lo stato di partenza del passo: l'utente non ha ancora aggiunto nulla (§7)                       |
| Due dialog impilati (documenti, destinatari)                  | sotto-viste dello stesso dialog con "Back to …"           | mai dialog sopra dialog — **impatto funzionale**: cambia la navigazione                            |
| Doppia lista con frecce per scegliere documenti e destinatari | tabella con selezione multipla e riepilogo "Selected (n)" | meno clic e nessun trasferimento                                                                   |
| Finish disabilitato nell'ultimo passo                         | "Create transmittal" attivo                               | nel legacy il pulsante compare sbiadito prima di creare; non è chiaro quale regola lo abilita (§7) |
| Back / Next / Finish / Cancel                                 | Cancel a sinistra, Back e "Next: <passo>" a destra        | design-rules §5.5                                                                                  |
| Tab dell'area senza conteggi                                  | senza conteggi                                            | il legacy non li mostra                                                                            |
| Elenco sorgenti "New / From Existing…" come tile              | radio                                                     | scelta esclusiva                                                                                   |
| "Count: 0" nelle liste                                        | "0 documents" / "0 recipients"                            | conteggio in `.rs-meta`                                                                            |

### Stati da disegnare (non coperti da nessuna schermata)

- Passi 2 e 3 con documenti e destinatari già aggiunti; modifica delle proprietà di relazione.
- Errori di validazione (campi obbligatori, PO number non valido); passo 1 con "Create from" diverso da "New" (form precompilato).
- Ricerca senza risultati; più di 1000 risultati; upload dei file.
- Creazione in corso (`loading` sul pulsante finale) e errore.
- Lista con una transmittal selezionata e relativo dettaglio.
- Dialog < 1024px.

## 7. Domande aperte

1. **Elenchi vuoti nei passi 2 e 3**: vanno riempiti anche questi (come le altre tabelle), o restano vuoti per mostrare lo stato iniziale?
2. **Finish**: da quali regole viene abilitato (documenti obbligatori? destinatari? gruppo assegnato)?
3. **Dettaglio della transmittal**: cosa mostra il pannello a destra una volta selezionata una riga? Oggi vuoto.
4. **Motivi (Reason)**: solo "N – For Notification" è visibile; "A – For approval" e "I – For information" sono ipotizzati.
5. **Colonne**: "Transmittal Identificat…" è troncata nel legacy; "Creator Name" è abbreviato in "Creator". Valori delle righe e nome della nuova transmittal inventati.
6. **Origine "From existing / virtual / clipboard / selected"**: quali campi precompilano?

## 8. Allineamento all'analisi funzionale (SUD 3.0, 2026-10-15)

- Stati del transmittal **Working / Ready / Issued** (era Working / Sent), con le lettere del Quick info (W, R, Is) e l'icona download.
- Menu di riga (⋮) sui transmittal e voce **Operations** nel menu Actions della toolbar. Le Operations sono per stato (`operationsFor`): Working → Generate Sheets, Mark Transmittal as Ready, Send comment package with consolidated comments; Ready → Continue Working on Transmittal, Generate Sheets, Issue Transmittal; Issued → nessuna. Il dialog usa colonne diverse da quelle dei documenti (`transmittalSelectedItemColumns`).
- **Preferences** nel menu account.
