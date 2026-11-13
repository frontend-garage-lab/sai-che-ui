## Table (`<sl-table>` – src/components/table/table.component.ts)
**Pattern APG di riferimento:** APG Grid (Data Grid) per tabelle con selezione/navigazione; APG Table + Sortable Table per tabelle statiche ordinabili
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 1 · Alta 3 · Media 9 · Bassa 4 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ❌ | `role="grid"` sull'host (r. 238) ma toolbar, footer/paginazione e stato vuoto sono discendenti del grid fuori da `row`/`gridcell`; celle checkbox/select-all/actions-header senza ruolo; `role="grid"` imposto anche a tabelle statiche (SL-TABLE-04, -16). |
| 2 | Nome, descrizione, stato | ❌ | La property `label` non è mai applicata (SL-TABLE-02); `sl-select` page size senza nome (SL-TABLE-03); checkbox di riga senza nome (SL-TABLE-05); `aria-sort` presente ✅; `aria-selected="false"` anche con `selection="none"` (SL-TABLE-09). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il ruolo è sull'host, quindi `aria-label`/`aria-labelledby` del consumer sull'host funzionano (workaround a SL-TABLE-02). `<label>` wrapper attorno a `sl-select` non associa nulla (SHARED: nessun formAssociated). `aria-rowcount` errato (SL-TABLE-08). |
| 4 | Tastiera e focus | ❌ | Ordinamento non operabile da tastiera (SL-TABLE-01, Blocker); navigazione solo per righe, nessuna freccia sinistra/destra, trigger azioni di ogni riga nel Tab order (SL-TABLE-06); Ctrl/Cmd+A intercettato anche nei campi della toolbar (SL-TABLE-07). Focus ring righe/header `outline: var(--sl-focus-ring)` ✅ (styles r. 145-148, 259-263). |
| 5 | Form e validazione | ⚠️ | Solo controlli interni: select page size senza nome (SL-TABLE-03); select-all con nome solo da `title` (SL-TABLE-17). |
| 6 | Live region | ❌ | Nessun annuncio per cambio ordinamento, pagina, conteggio selezione, stato vuoto; nessuna API loading/`aria-busy` (SL-TABLE-10). |
| 7 | Aspetti visivi | ⚠️ | Header neutral-600 su surface-sunken 6.01:1 (light) / 5.29:1 (dark) ✅; testo vuoto neutral-500 3.48:1 in dark (SL-TABLE-15); selezione e marker solo `background`/`box-shadow`, persi in forced-colors (SL-TABLE-12); marker variant solo colore (SL-TABLE-13). |
| 8 | API pubblica a11y | ⚠️ | Label dedicate per pulsanti/checkbox ✅ ma default hardcoded in inglese (SL-TABLE-11); `label` inefficace; label azioni identica per tutte le righe (SL-TABLE-14); nessun `loading`/`busy`. |
| 9 | Documentazione e test | ⚠️ | 1 test axe su DOM statico (test r. 71-74); nessun test di tastiera, sort da tastiera, stato vuoto/paginazione axe; docs senza sezione a11y, esempi senza `label`, esempio "Quick info" con `header: ''` (SL-TABLE-18). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-TABLE-01 | Blocker | 4 | Le intestazioni ordinabili sono focusabili (`tabindex="0"`) ma il sort avviene solo con il click: `handleKeyDown` esce perché sull'header non c'è `data-row-id`. Inoltre l'header non ha semantica di pulsante. | table.component.ts:621 `tabindex=${canSort ? '0' : '-1'}`; :453-455 sort solo in `handleClick`; :511-513 `if (!rowId) return;` | WCAG 2.1.1, 4.1.2; APG Sortable Table | Rendere il contenuto dell'header un `<button>` nativo dentro il `columnheader` (Enter/Space nativi), rimuovere `tabindex` dal `div`. |
| SL-TABLE-02 | Alta | 2 | La property documentata `label` ("announced by screen readers") non è mai usata: il grid resta senza nome. Workaround: `aria-label` scritto dal consumer sull'host (che ha il ruolo). | table.component.ts:122-123 `@property() label = '';` (nessun altro riferimento nel file) | WCAG 4.1.2, 1.3.1; APG Grid ("grid has a label") | In `willUpdate`, `this.label ? setAttribute('aria-label', label) : removeAttribute(...)` (senza sovrascrivere un `aria-labelledby` del consumer). |
| SL-TABLE-03 | Alta | 2/5 | Il selettore "righe per pagina" non ha nome: il `<label>` wrapper non associa un custom element non form-associated e `sl-select` non riceve `label`. | table.component.ts:815-825 `<label class="table__page-size">${this.pageSizeLabel}<sl-select size="small" …>` | WCAG 4.1.2, 1.3.1, 3.3.2; SHARED (no ElementInternals) | Passare `label=${this.pageSizeLabel}` a `sl-select` (eventualmente con label visuale inline), sostituire `<label>` con `<div>`. |
| SL-TABLE-04 | Alta | 1 | Struttura grid non valida: toolbar slot, footer/paginazione e stato vuoto sono discendenti del `role="grid"` (sull'host) fuori da `row`/`gridcell`; select-all, checkbox di riga e header azioni sono in `row` ma senza `columnheader`/`gridcell` → numero di celle header ≠ righe, controlli della toolbar/paginazione dentro la "tabella". | :238 `setAttribute('role','grid')`; :594 `<div class="table__select-all">`; :642 `<div part="actions-header">`; :718 `<div class="table__row-selection">`; :756-758 toolbar; :766 empty; :771-831 footer | WCAG 1.3.1, 4.1.2; ARIA 1.2 grid "required owned elements" | Spostare `role="grid"` su `.table__scroller` (shadow), lasciare host senza ruolo; dare `role="columnheader"`/`gridcell` alle celle select-all/checkbox/actions; stato vuoto in `row > gridcell[aria-colspan]`. |
| SL-TABLE-05 | Media | 2 | Checkbox di riga senza nome accessibile; è puramente visuale (`pointer-events:none`, `tabindex=-1`) ma resta esposta nell'albero → in browse mode lettore legge "casella di controllo non selezionata" senza nome, duplicando `aria-selected`. | :719-725 `<sl-checkbox part="checkbox" … tabindex="-1">` senza label; styles:265-267 | WCAG 4.1.2, 1.3.1 | `aria-hidden="true"` sul wrapper (lo stato è già su `aria-selected` della riga) oppure label "Seleziona riga N". |
| SL-TABLE-06 | Media | 4 | Modello tastiera incompleto rispetto a APG Grid: solo ↑/↓/Home/End tra righe; niente ←/→ tra celle, PageUp/PageDown, Ctrl+Home/End; il focus va sulla riga (modello treegrid). I contenuti interattivi delle celle e il trigger azioni di ogni riga restano nel Tab order → N tab stop invece di uno. | :526-531 mappa tasti; :709 roving solo su riga; :671-679 `sl-icon-button` senza `tabindex="-1"` | APG Grid (Keyboard interaction), WCAG 2.1.1, 2.4.3 | Roving tabindex a livello di cella (o righe + ←/→ per entrare nelle celle), `tabindex="-1"` sui controlli interni non attivi; aggiungere PageUp/PageDown e Ctrl+Home/End. |
| SL-TABLE-07 | Media | 4 | Ctrl/Cmd+A è intercettato sull'host prima del controllo "interattivo": in un campo di ricerca nella toolbar (light DOM figlio dell'host) o in un input in cella seleziona tutte le righe e blocca la selezione del testo. | :505-509 `if (event.key === 'a' && (ctrlKey||metaKey) …) { event.preventDefault(); …}` | WCAG 2.1.1; 3.2.2 (comportamento inatteso) | Spostare il controllo dopo `isInteractiveTarget(path)` e limitarlo a quando il focus è su una riga. |
| SL-TABLE-08 | Media | 1 | `aria-rowcount` = numero record, esclude la riga header; le righe non hanno `aria-rowindex`, quindi con paginazione/server AT annuncia posizioni errate (riga 1 di 10 su ogni pagina). | :268 `aria-rowcount`, :704-715 nessun `aria-rowindex` | ARIA 1.2 `aria-rowcount`/`aria-rowindex`; WCAG 1.3.1 | `aria-rowcount = itemCount + 1`; header `aria-rowindex="1"`, righe `aria-rowindex = (page-1)*pageSize + i + 2`. |
| SL-TABLE-09 | Bassa | 2 | `aria-selected="false"` su ogni riga e `aria-multiselectable="false"` anche con `selection="none"`: AT annuncia "non selezionato" su una tabella non selezionabile. | :269; :713 `aria-selected=${… ? 'true' : 'false'}` | WCAG 4.1.2; APG Grid | Con `selection === 'none'` usare `nothing` per `aria-selected` e rimuovere `aria-multiselectable`. |
| SL-TABLE-10 | Media | 6 | Nessun feedback programmatico: cambio ordinamento, pagina ("Page x of y"), riepilogo, numero di righe selezionate e stato vuoto non sono in una live region; non esiste API `loading`/`aria-busy` per caricamenti server. | :775-777 summary `<span>`; :795 page-status; :766 empty slot | WCAG 4.1.3 | Live region `role="status"` sempre presente nel shadow (testo sort/pagina/selezione); property `loading` che imposta `aria-busy="true"` sul grid e annuncia. |
| SL-TABLE-11 | Media | 8 | Default testuali hardcoded in inglese (`Actions`, `Select all rows`, `Rows per page`, pagine, `Showing x – y of z`, `No records to display`, `No results found.`); `LocalizeController` usato solo per `dir()`. | :173, :200-215, :218-226, :766 | WCAG 3.1.2 (parti in lingua diversa), SHARED-06 | Chiavi di traduzione (`tableActions`, `selectAllRows`, …) come default, property come override. |
| SL-TABLE-12 | Media | 7 | In `forced-colors` la selezione (solo `background-color` + `box-shadow` inset) e i marker variant scompaiono: in `selection="single"` nessun indicatore di riga selezionata. Nessuna media query forced-colors nel file. | table.styles.ts:245-248, :220-242 | WCAG 1.4.11, 1.4.1; SHARED-02 | `@media (forced-colors: active) { .table__row[selected] { outline: 2px solid Highlight; outline-offset:-2px; forced-color-adjust:none; background: Highlight; color: HighlightText } }` |
| SL-TABLE-13 | Media | 7/8 | `rowVariant` comunica uno stato solo con un bordo colorato di 3px, senza testo alternativo né API per fornirlo. (consumer: deve ripetere lo stato in una cella testuale) | :116-120 `rowVariant`; styles:220-242 | WCAG 1.4.1, 1.3.1 | Aggiungere `rowVariantLabel(row)` reso come testo visually-hidden nella prima cella; documentare l'obbligo. |
| SL-TABLE-14 | Bassa | 2 | Trigger del menu azioni con lo stesso nome "Actions" su ogni riga: nella lista dei pulsanti non sono distinguibili. | :677 `label=${this.actionMenuLabel}` | WCAG 2.4.6, 2.4.9 (AAA) | Accettare `actionMenuLabel` anche come funzione `(row) => string` (es. "Azioni per L-SAI-EXT-7"). |
| SL-TABLE-15 | Bassa | 7 | Testo dello stato vuoto `neutral-500`: 4.71:1 light ✅, 3.48:1 dark ❌. | table.styles.ts:190-194 `color: var(--sl-color-neutral-500)` | WCAG 1.4.3; SHARED-03 | Usare `--sl-color-neutral-600`. |
| SL-TABLE-16 | Media | 1 | `role="grid"` è imposto sempre (anche senza selezione, sorting o celle interattive) e sovrascrive un `role` del consumer: le tabelle di sola lettura passano in modalità applicazione/focus nei lettori, perdendo la lettura tabella standard. | :236-239 | First rule of ARIA; APG Grid ("use table for static") | Con `selection="none"` e senza colonne interattive usare `role="table"`/`cell`/`rowheader`, o una property `interactive`. |
| SL-TABLE-17 | Suggerimento | 2 | Il nome della checkbox select-all deriva solo da `title` (inoltrato all'input, checkbox.component.ts:208): funziona ma genera tooltip e dipende dal passthrough. | :597 `title=${this.selectAllLabel}` | WCAG 4.1.2 (best practice) | Testo nello slot in `<sl-visually-hidden>` o `aria-label` sull'input interno. |
| SL-TABLE-18 | Bassa | 9 | Test axe solo statico; nessun test di tastiera/sort da tastiera/stato vuoto/paginazione. Docs senza sezione a11y, esempi senza `label`, esempio "Quick info" con `header: ''` (columnheader vuoto) e stato solo in `title` di `sl-status`. | table.test.ts:71-74; docs/pages/components/table.md:491-525 | WCAG 1.3.1 (doc), qualità | Aggiungere test `sendKeys` (Enter su header, frecce), axe con paginazione/selezione/vuoto; sezione "Accessibilità" nei docs. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | Sì | ❌ | Mai applicata (SL-TABLE-02). |
| `aria-label` / `aria-labelledby` sull'host | Non dichiarate | ✅ (host ha `role="grid"`) | Funziona come workaround; si rompe se si sposta il ruolo nello shadow (fix SL-TABLE-04: inoltrare `label`). |
| `aria-describedby` (caption/descrizione) | No | — | Aggiungere slot/property `caption` o `description`. |
| `role` | No (forzato `grid`) | — | Rendere selezionabile `table`/`grid` (SL-TABLE-16). |
| `select-all-label`, `action-menu-label`, `page-size-label`, `first/previous/next/last-page-label` | Sì | ✅ (tranne `page-size-label`, SL-TABLE-03) | Default non localizzati (SL-TABLE-11). |
| `summaryFormatter`, `pageFormatter` | Sì | ✅ testo visivo | Non in live region (SL-TABLE-10). |
| `loading` / `aria-busy` | No | — | Da aggiungere. |
| `aria-sort` | Interno | ✅ | `ascending`/`descending`/`none` corretti (r. 622). |
| `aria-selected`, `aria-disabled` righe | Interno | ⚠️ | `aria-selected` anche se non selezionabile (SL-TABLE-09). |
| `aria-rowcount`/`aria-rowindex` | Parziale | ❌ | SL-TABLE-08. |

### Fix proposti
```ts
// SL-TABLE-01 – header ordinabile con <button> nativo
return html`
  <div part="column" class="table__column …" role="columnheader" data-column-id=${header.column.id}
       aria-sort=${canSort ? (sortDirection ? `${sortDirection}ending` : 'none') : nothing}>
    ${canSort
      ? html`<button type="button" class="table__sort-button" tabindex="-1">
               <span part="column-label">${FlexRender({ header })}</span>
               <sl-icon part="sort-icon" library="system" name="chevron-down"></sl-icon>
             </button>`
      : html`<span part="column-label">${FlexRender({ header })}</span>`}
  </div>`;
// (con roving tabindex a celle, il button prende tabindex 0 quando è la cella attiva)

// SL-TABLE-02 / -08 / -09
willUpdate(changed: PropertyValues<this>) {
  …
  const grid = this; // oppure lo scroller se si applica SL-TABLE-04
  if (this.label) grid.setAttribute('aria-label', this.label);
  else if (changed.has('label')) grid.removeAttribute('aria-label');
  grid.setAttribute('aria-rowcount', String(this.itemCount + 1));
  if (this.selection === 'none') grid.removeAttribute('aria-multiselectable');
  else grid.setAttribute('aria-multiselectable', String(this.selection === 'multiple'));
}
// riga: aria-rowindex=${(this.page - 1) * this.pageSize + index + 2}
//       aria-selected=${this.selection === 'none' ? nothing : String(row.getIsSelected())}

// SL-TABLE-03
html`<div class="table__page-size">
  <span aria-hidden="true">${this.pageSizeLabel}</span>
  <sl-select size="small" label=${this.pageSizeLabel} class="table__page-size-select" …></sl-select>
</div>`;
// (se la label visiva interna di sl-select non è desiderata, nasconderla con ::part(form-control-label) visually-hidden)

// SL-TABLE-05
html`<div class="table__row-selection" role="gridcell"><sl-checkbox aria-hidden="true" tabindex="-1" …></sl-checkbox></div>`;

// SL-TABLE-07
if (event.key === 'a' && (event.ctrlKey || event.metaKey) && this.selection === 'multiple'
    && this.findRowId(path) && !this.isInteractiveTarget(path)) { … }

// SL-TABLE-10 – live region sempre presente
html`<div class="sl-visually-hidden" role="status" aria-live="polite">${this.announcement}</div>`;
// handleSortingChange: this.announcement = `${columnLabel}, ${direction === 'asc' ? 'crescente' : 'decrescente'}`;
// handlePaginationChange: this.announcement = this.pageFormatter(this.page, this.pageCount);
@property({ type: Boolean, reflect: true }) loading = false; // → aria-busy sul grid
```
```css
/* SL-TABLE-12 */
@media (forced-colors: active) {
  .table__row[selected] { outline: 2px solid Highlight; outline-offset: -2px; }
  .table__row[variant] { border-inline-start: 3px solid CanvasText; }
}
/* SL-TABLE-15 */
.table__empty { color: var(--sl-color-neutral-600); }
```

### Non verificabile
- Resa reale con NVDA/JAWS/VoiceOver di `role="grid"` sull'host con righe nello shadow root (attraversamento del confine shadow nell'albero di accessibilità) e lettura della riga focusata.
- Target size (WCAG 2.5.8) dei `sl-icon-button` azioni/paginazione: dipende dal padding di `sl-icon-button` con `font-size: var(--sl-font-size-medium)`; misurare nel browser.
- Contrasto del contenuto delle celle e dei testi `header`/`cell` forniti dal consumer.
- Annuncio dello stato di ordinamento al cambio (`aria-sort` aggiornato) nei vari screen reader.
