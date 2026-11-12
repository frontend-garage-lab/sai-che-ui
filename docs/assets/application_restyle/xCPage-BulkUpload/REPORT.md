# xCPage-BulkUpload — report Screenshot → HTML (2026-11-12)

Fonte: `application_screenshot/xCPage - Bulk Upload/` (10 screenshot) + `README.md` (flusso funzionale), fonte primaria
di contenuti e comportamento; gli screenshot per layout e dati.

## 1. Pagine

| Pagina                      | Screenshot                                                                   | Stato                                                              |
| --------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1-BulkUploads               | Full Page View, Main Page - Available Actions, Panel Detail - Properties Tab | `test_iso_15` selezionato, pannello tab Properties                 |
| 2-BulkUploads-MatchingRules | Panel Detail - Matching Rules Tab                                            | stesso stato, tab Matching rules (3 regole)                        |
| 3-CreateBulkUpload          | Create New - Properties Step                                                 | dialog Create, tipo e template scelti, Name vuoto, Finish disabled |
| 4-EditBulkUpload            | Edit Wizard - Properties Step                                                | dialog Edit su `test_iso_15`, 3 regole                             |
| 5-ManageMatchingRules       | Edit Matching Rules Button, Manage Matching Rules                            | 2 regole del nuovo bulk upload, la seconda selezionata             |
| 6-SetMatchingRule           | Add Matching Rules                                                           | Edit della regola 2: 3 condizioni, New Isometric Action            |
| 7-CreateBulkUpload-RulesSet | After Matching Rules Set                                                     | dialog Create con "2 matching rules defined"                       |

Dati resi coerenti (il README avverte che gli screenshot vengono da record diversi): `test_iso_15` (3 regole) per
pannello ed Edit; un nuovo bulk upload (2 regole) per Create → Manage → Set → contatore.

## 2. Mappatura

| Legacy                                                    | DS                                                                                                                                            |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Menu Configuration dell'header                            | gruppo sidebar **Configuration** (`gear`), voce `Bulk uploads` corrente; breadcrumb Home › Configuration › Bulk uploads                       |
| Selettore progetto 99_PAGE_AM                             | `sl-header-item` progetto, come gli altri flussi (dati 000001 · Yard Training)                                                                |
| Filtri (5 campi) + Search / Reset / Show All              | `sl-card` Filters su una riga (4/2/2/2/2); Reset `text`, Search `primary`; **More filters** nell'header + drawer (Show all tolto, 2026-11-12) |
| Create / Edit Bulk Upload sopra la griglia                | toolbar della tabella: Create bulk upload `primary` · Edit · spazio · Config                                                                  |
| Bandierina colorata                                       | colonna **State** `sl-status` (Draft `neutral`, Validated `primary`, Scheduled `warning`, Processed `success`, aggiunti a `STATUS_VARIANT`)   |
| Icona XLS/XLSX, lucchetto                                 | `file-earmark-excel` (label XLS/XLSX) e `lock` nella cella Name                                                                               |
| Allowed Template azzurro                                  | `sl-tag size="small" primary`                                                                                                                 |
| Paginazione 10                                            | paginazione `sl-table`, 25 righe (come gli altri flussi)                                                                                      |
| Pannello Properties con tab                               | `sl-detail-panel` con `sl-tab-group`: Properties (`info-circle`) · Matching rules (`diagram-3`)                                               |
| Sezioni Info / Upload Settings / Summary                  | `rs-subheading` + `sl-description-list cols="2"`; valori vuoti "—", `false` → "No", schedulazione vuota → "Not scheduled"                     |
| Lista regole "(New X) IS EQUAL TO (Existing X)" + Perform | `sl-table`: # · condizioni (una riga per condizione, AND in `rs-meta`) · Perform `sl-tag primary`; Count → conteggio nell'intestazione        |
| Wizard Create/Edit (tipo e template in testa)             | `sl-dialog` 56rem: tipo e template `sl-select required` (solo Create); Info, Upload settings                                                  |
| Pulsante modifica regole + contatore                      | riga "Document matching rules" + conteggio `rs-meta` + `sl-button small` "Manage rules" (`pencil`)                                            |
| Blank / Ignore value select con X                         | `sl-select clearable` con `help-text` del significato                                                                                         |
| Summary a zero nel wizard                                 | `sl-details` chiuso "Summary · not run yet"                                                                                                   |
| Finish disabilitato / Cancel                              | footer: Cancel · Finish `primary` (`disabled` finché Name è vuoto)                                                                            |
| Manage BU Matching Rules: Create / Edit / Remove          | toolbar della tabella regole: Create `primary` · Edit · divider · Remove `danger outline` · Config                                            |
| Set Matching Rule: riga New/Operator/Existing + `+` `X`   | una riga per condizione (New value of · Operator · Existing value of) con `sl-icon-button` `plus-lg` / `dash`, come advanced-search           |
| Perform Action obbligatoria                               | `sl-select required` span 6                                                                                                                   |

## 3. Componenti senza Code Connect usati

Nessuno nuovo rispetto ai flussi precedenti (stessi componenti di xCPage-DistributionMatrices + `sl-details`).

## 4. Nuovi elementi non DS

Nessuno. Lint `lint_html.py`: 0 ERR, solo i WARN di larghezza già accettati (menu progetto 28rem, `--width` dei dialog,
`--max-height` delle tabelle nei dialog).

## 5. Stati da disegnare

- Validazione dei campi obbligatori (`status="danger"` + help text) su Name / Blank value / Perform action.
- Tabella regole vuota (empty state già nel markup di Manage) e tab Matching rules senza regole.
- Operatore unario scelto (Is empty / Is not empty): "Existing value of" `disabled`.
- Remove di una regola: conferma.

## 6. Scostamenti funzionali

- La tabella delle condizioni aggiunte è sostituita dalle righe modificabili con + / −.
- Summary nel wizard chiuso in `sl-details` (in Create è tutto a zero).
- Tipo e template in Edit compaiono solo in sola lettura (Bulk upload type, Allowed document type/template).

## 7. Domande aperte

- **Significato delle bandierine** (grigia, verde, azzurra, gialla): ipotizzati Draft / Processed / Validated / Scheduled.
  Servono i valori reali del filtro State.
- Posizione in navigazione: gruppo sidebar "Configuration" con la sola voce Bulk uploads (Distribution Matrices ha un
  gruppo proprio): confermare.
- Elenco completo di operatori, azioni e attributi (README §6: "potrebbe essere più ampio").

## 8. Figma (2026-11-12)

Sezione `xCPage-BulkUpload` (1839:110663) nel contenitore xCPage; 7 wrapper OLD/NEW, tutti `done` nel registro.
