# xCPage-DistributionMatrices — report Screenshot → HTML (2026-10-28)

Fonte: `application_screenshot/xCPage - Distribution Matrices/` (21 screenshot) + `README.md` (analisi funzionale), usato
come fonte primaria di contenuti e comportamento; gli screenshot per layout e dati.

## 1. Pagine

| Pagina                 | Screenshot                                                                                                        | Stato                                                                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1-DistributionMatrices | main_dm, dm_details, box_filters, main_preparation_area(+\_with_errors), template_validation_failed(+\_more_rows) | tab Distribution matrices, `032154_Test_DM Upload` (Draft, 34 distribuzioni) selezionata; tab Preparation area (commutabile) con `test_separator_2502` e 9 errori |
| 2-CreateTemplate       | preparation_area_create_template                                                                                  | dialog Create template compilato, 1 condizione                                                                                                                    |
| 3-UploadAndValidate    | upload_and_validate_template_button, import_template_dialog                                                       | Test Matrix Template (NEW) selezionato, file caricato                                                                                                             |
| 4-PublishResult        | publish_successfully_imported_template, publish_progress_dialog                                                   | matrice appena pubblicata, dialog esito                                                                                                                           |
| 5-AddUpdateUsers       | massive_user_addition (4)                                                                                         | Insert and update, 1 utente da aggiungere                                                                                                                         |
| 6-ReplaceUser          | massive_user_replacement (2)                                                                                      | Manual input attivo, nuovo utente scelto                                                                                                                          |
| 7-RemoveUser           | remove_user (2)                                                                                                   | Manual input attivo, campi vuoti                                                                                                                                  |

Le due aree (Distribution matrices / Preparation area) sono **una sola pagina** con `sl-tab-group.rs-stages`
(decisione dell'utente). In Figma servono due frame: uno per tab.

## 2. Mappatura

| Legacy                                                          | DS                                                                                                                                            |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab Distribution Matrices / Preparation Area                    | `sl-tab card` con icona (aree di lavoro)                                                                                                      |
| Riquadri Published / Draft / Preparation Area, Working / Failed | `sl-stat-group` accanto alla card Filtri (8/4)                                                                                                |
| Filtri + Search / Reset / Show All                              | `sl-card` Filters; Reset `text`, Show all `default`, Search `primary`                                                                         |
| Flag pubblicata/bozza                                           | colonna **Status** `sl-status` (Published `success`, Draft `neutral`, aggiunti a `STATUS_VARIANT`)                                            |
| Valid Types colorati                                            | `sl-tag small`: transmittal `primary`, distribution process `accent`                                                                          |
| 8 pulsanti toolbar                                              | Edit · Cancel edit · Demote · **Users ▾** (Add/update, Replace, Remove) · spazio · Delete (`danger outline`) · Publish (`primary`) · Config   |
| Pannello Properties                                             | `sl-detail-panel`: nome, meta "34 distributions", Edit name icon-button; description list Status/Created by/Created on; tabella distribuzioni |
| Sotto-tabella Recipients per riga                               | cella multi-riga: nome (+ icona esterno) / email · reason · method                                                                            |
| Quick Info template (NEW, !)                                    | `file-earmark-excel` + `sl-badge success` NEW + `sl-badge danger` "!"                                                                         |
| Validation Detail                                               | `sl-alert danger` + `sl-table` Error / Detail                                                                                                 |
| DM Create Temp Object                                           | dialog 56rem: sezione Template + sezione Conditions (selects + "Add condition" `text` + tabella con Remove `text`)                            |
| DM Import New Version (Files + −)                               | `sl-file-drop hide-file-list` + `sl-file-upload-item uploaded`                                                                                |
| Show Operation Result                                           | dialog con `sl-alert success`, Close `primary`                                                                                                |
| Options select + alert descrittivo                              | `sl-radio-group` con `help-text` della modalità scelta                                                                                        |
| Doppia lista `>` `<` `<<`                                       | `.rs-transfer` (come CreateTransmittal 7), spostato in `_shared/restyle.css`                                                                  |
| Campi fissi (Replace User In, Remove User From)                 | `sl-description-list`                                                                                                                         |
| Prevent duplicates + alert                                      | checkbox disabilitata + tooltip info                                                                                                          |

## 3. Componenti senza Code Connect

Nessuno nuovo rispetto ai flussi precedenti (verifica con `cc_inventario.py` non rieseguita).

## 4. ⚠️ Nuovi elementi non DS

Nessuno. `.rs-transfer` era già usato in CreateTransmittal: è stato solo spostato nel CSS condiviso.

Icone mancanti in Figma (usata la più vicina): `send` → `check-lg` (Publish), `person-plus` → `plus-lg`
(Add/update users), `people`/`arrow-left-right` → `arrow-clockwise` (Replace user), `globe` → `building` (utente esterno).

## 5. Stati da disegnare

Insert only / Update only (cambia solo radio e help text); Replace/Remove senza Manual input (select abilitato);
campi Name/Email in errore; validazione superata; lista vuota; Demote con matrice pubblicata.

## 6. Scostamenti funzionali

- Replace / Remove / Add users raccolti nel menu **Users** (più di 5 azioni sulla lista).
- Remove user: primaria `danger` con il verbo; Replace: primaria "Replace user"; nei legacy entrambe "Execute".
- Footer: Cancel + primaria (legacy: Execute nel corpo + Cancel nel footer).
- Pannello Properties: le tre azioni sulle distribuzioni abbreviate in New entry / Modify / Remove.
- Show operation result eliminato: l'esito del Publish è un toast.
- Manual input: da checkbox a scelta Project users / Manual input.

## 7. Domande aperte

- Icona "chiave" sotto l'icona Excel di alcuni template (Quick Info): significato sconosciuto anche all'utente, non riportata; da chiedere al business.
- Conteggi KPI coerenti con i dati mock (legacy 26/5/12 non coerenti con la lista).
- Navigazione: aggiunto il gruppo sidebar **Configuration** (prima non esisteva).

## 8. Verifica

- `lint_html.py`: 7 file · 0 ERR (WARN: solo `--width`/`--max-height` documentati e select progetto 16rem, come negli
  altri flussi). Prettier applicato. Tutte le risorse rispondono 200.
- Controllo visivo a 1600×1000 (Chrome di sistema via Playwright) delle pagine 1 (entrambe le tab), 4, 5, 6, 7 dopo le correzioni del 2026-10-28; pagine 2 e 3 non riguardate.
