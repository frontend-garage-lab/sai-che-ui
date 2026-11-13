## Table (`<sl-table>` – src/components/table/table.component.ts)
**Pattern APG di riferimento:** APG Grid (Data Grid); APG Sortable Table per le intestazioni ordinabili
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 1 · Alta 3 · Media 4 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ⚠️ | Tabella base (solo colonne/righe, anche con sort): `grid > row > columnheader` / `rowgroup > row > gridcell`, axe 0 violazioni. Con toolbar, `paginate`, stato vuoto o `selection="multiple"` Chromium espone `textbox`, `button`, `combobox`, `text` e `checkbox` come figli diretti del `grid`/`row` fuori dalle celle (SL-TABLE-04). |
| 2 | Nome/descrizione/stato | ❌ | `label="Corrispondenza"` → `grid` senza nome, `getAttribute('aria-label') === null` (SL-TABLE-02). Select-all `checkbox` senza nome (SL-TABLE-17), checkbox di riga senza nome (SL-TABLE-05), page size `combobox value="2"` senza nome (SL-TABLE-03). `aria-sort` corretto (`date:descending`), `row [selected=true]` dopo la selezione ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Il ruolo è sull'host: `aria-label` del consumer sull'host funziona (`grid "Corrispondenza"`). Nessun idref che attraversa shadow root. |
| 4 | Tastiera e focus | ❌ | Enter/Space su header ordinabile: nessun `sl-table-sort`, `aria-sort` invariato; il click ordina (SL-TABLE-01, Blocker). ↑/↓/Home/End tra righe e Space per selezionare ✅; ←/→ non fanno nulla (miglioramento). Focus ring visibile su righe e header anche in `forcedcolors` (`outlineStyle = solid`). |
| 5 | Form e validazione | ❌ | Solo controlli interni: page size senza nome (SL-TABLE-03); select-all senza nome (SL-TABLE-17). |
| 6 | Live region | ⚠️ | Nessuna live region per pagina/ordinamento/selezione: miglioramento (vedi sotto), non errore dimostrato. |
| 7 | Aspetti visivi | ⚠️ | Header 6.02:1 light / 5.32:1 dark, summary 6.64/5.72 ✅; stato vuoto 4.71:1 light, **3.49:1 dark** (SL-TABLE-15). In `forcedcolors` la riga selezionata con `selection="single"` è identica alle altre (SL-TABLE-12). Target size icon-button 32×32 / 30×30 ✅. |
| 8 | API pubblica a11y | ❌ | `label` documentata ma inefficace; `select-all-label` e `page-size-label` non producono un nome accessibile. Le altre label (`action-menu-label`, `*-page-label`) arrivano ai `button` ✅. |
| 9 | Docs e test | ⚠️ | Nessun test di tastiera sugli header; esempi docs senza `label`; esempio "Quick info" con `header: ''`. Osservazione funzionale (non a11y): nell'harness "Next page" emette `sl-table-page-change` con `page:2` e subito `page:1`, la pagina resta 1 (anche col mouse) — da segnalare al team. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-TABLE-01 | Blocker | Tastiera | L'header ordinabile riceve il focus (`tabindex="0"`) ma Enter/Space non ordinano: `handleKeyDown` esce perché l'header non ha `data-row-id`; il sort è solo in `handleClick`. Nessun workaround da API pubblica. | table.component.ts:621 `tabindex=${canSort ? '0' : '-1'}`; :453-455 (sort solo nel click); :511-513 `if (!rowId) return;` | runtime: `focus: sl-table > div[part=column]` → `key Enter`, `key Space` → `eventi: (nessuno)`, aria-sort `protocol:none,subject:none,date:descending` prima e dopo; `click` → `sl-table-sort` e `protocol:ascending` | 2.1.1; APG Sortable Table | `<button>` nativo dentro il `columnheader` (o gestione Enter/Space su `data-column-id` in `handleKeyDown`) |
| SL-TABLE-02 | Alta | Nome | La property documentata `label` non viene mai applicata: il `grid` resta senza nome. Il workaround (`aria-label` sull'host) funziona ma non è documentato. | table.component.ts:122-123 `@property() label = '';` (nessun altro uso) | runtime: `<sl-table label="Corrispondenza">` → `grid [multiselectable=false …]` senza nome, `getAttribute("aria-label") → null`; con `aria-label` sull'host → `grid "Corrispondenza"` | 4.1.2 (grid richiede un nome); APG Grid | In `willUpdate` impostare/rimuovere `aria-label` dall'host in base a `label` |
| SL-TABLE-03 | Alta | Nome/Form | Il selettore "Rows per page" non ha nome: il `<label>` wrapper non si associa a `sl-select` (custom element non form-associated) e `sl-select` non riceve `label`. | table.component.ts:815-825 `<label class="table__page-size">${this.pageSizeLabel}<sl-select size="small" …>` | runtime: `LabelText > text "Rows per page"`, `combobox value="2" [… expanded=false]` senza nome | 4.1.2, 1.3.1 | Passare `label=${this.pageSizeLabel}` a `sl-select` (label visiva eventualmente nascosta), `<label>` → `<div>` |
| SL-TABLE-17 | Alta | Nome | La checkbox "seleziona tutto" non ha nome in Chromium: `selectAllLabel` è passato solo come `title`; l'input è dentro un `<label>` (vuoto) e Chromium non usa il `title` quando c'è un `<label>` associato. | table.component.ts:595-597 `<sl-checkbox part="select-all" title=${this.selectAllLabel}>`; checkbox.component.ts:208 | runtime: `generic "Select all rows" > LabelText > checkbox [checked="false" … labelledby=[22]]` (senza nome); controllo HTML puro: `<label><input type=checkbox title="Y"></label>` → `checkbox` senza nome | 4.1.2 | Mettere la label nello slot di `sl-checkbox` dentro `<sl-visually-hidden>` (o `aria-label` sull'input interno) |
| SL-TABLE-04 | Media | Semantica | Con toolbar, paginazione, stato vuoto, `selection="multiple"` o colonna azioni, controlli e testi sono figli del `grid` o della `row` fuori da `columnheader`/`gridcell`. La tabella base è valida. | table.component.ts:238 `setAttribute('role','grid')`; :594, :642, :718 (celle senza ruolo); :756-758 toolbar; :766 empty; :771-831 footer | runtime: `grid "Corrispondenza" > textbox "Protocollo"`, `button "Search"`, `text "Showing 1 – 2 of 5"`, `button "First page"…`, `combobox`; `rowgroup > text "No results found."`; axe `aria-required-children (critical): sl-table | .table__header | div[data-row-id="0"]` (tabella base: `[]`) | 1.3.1, 4.1.2 | `role="grid"` su `.table__scroller` (o toolbar/footer fuori dal grid tramite wrapper), `role="columnheader"`/`gridcell` per select-all/checkbox/azioni, vuoto in `row > gridcell` |
| SL-TABLE-05 | Media | Nome/Stato | La checkbox di riga (solo decorativa: `pointer-events:none`, `tabindex=-1`) è esposta senza nome; se attivata da un AT (azione predefinita = click sull'input) cambia il proprio stato senza selezionare la riga, perché `handleClick` scarta i click su `sl-checkbox`. | table.component.ts:718-725; :458 `isInteractiveTarget`; :33 `sl-checkbox` in `interactiveSelector`; table.styles.ts:265-267 | runtime: `row "L-SAI-EXT-7 …" > LabelText > checkbox [checked="false" …]` senza nome; axe `label (critical)` sulle checkbox di riga; `input.click()` → `[checked=true, aria-selected="false", getSelection().length=0]` | 4.1.2, 1.3.1 | `aria-hidden="true"` + `inert` sulla cella checkbox (lo stato è già in `aria-selected` della riga) dentro un `role="gridcell"` |
| SL-TABLE-12 | Media | Visivo | In `forced-colors` la selezione è resa solo con `background-color` e `box-shadow`, entrambi annullati: con `selection="single"` (nessuna checkbox) la riga selezionata è indistinguibile. | table.styles.ts:245-248 `.table__row[selected] { background-color…; box-shadow: inset 3px… }`; nessuna media query `forced-colors` | runtime `forcedcolors`: riga 1 `aria-selected="true"`, `boxShadow = none`, `backgroundColor = rgb(255,255,255)`; riga 0 non selezionata: `rgb(255,255,255)`, `none`. In modalità normale: barra `#0e6a81` su `#e4f3f7` = 5.43:1 ✅ | 1.4.11, 1.4.1 (indicatore di stato non percepibile in forced colors) | `@media (forced-colors: active) { .table__row[selected] { outline: 2px solid Highlight; outline-offset: -2px } }` |
| SL-TABLE-15 | Media | Visivo | Testo dello stato vuoto (default e slot `empty`) `neutral-500` sotto 4.5:1 in dark. | table.styles.ts:190-194 `color: var(--sl-color-neutral-500)` | runtime: light `#6c757a su #ffffff = 4.71:1`; dark `#636e74 su #0f161a = 3.49:1` (font-size small, non testo grande) | 1.4.3 | `color: var(--sl-color-neutral-600)` |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-TABLE-06 | miglioramento | Modello tastiera APG Grid incompleto: ←/→ non spostano il focus (riga → `focus` invariato), niente PageUp/PageDown né navigazione cella per cella; header e trigger azioni sono tab stop separati. Le funzioni restano operabili (Tab sugli header, Space su riga, Tab sui trigger). | table.component.ts:526-531; runtime `key ArrowRight` → `focus: sl-table > div[part=row]` |
| SL-TABLE-07 | miglioramento | Bug funzionale: Cmd/Ctrl+A in un campo della toolbar seleziona tutte le righe e impedisce la selezione del testo (`selectionStart/End = 3,3`, `getSelection().length = 2`). Non viola un criterio A/AA (il testo è selezionabile con Shift+frecce). | table.component.ts:505-509 |
| SL-TABLE-09 | miglioramento | Con `selection="none"` le righe espongono `selected=false` e il grid `multiselectable=false`: rumore per gli AT. | table.component.ts:269, :713 |
| SL-TABLE-10 | miglioramento | Nessuna live region per cambio pagina/ordinamento/conteggio selezione e nessuna API `loading`/`aria-busy`. Il focus resta sul controllo attivato e il testo aggiornato è raggiungibile; da valutare un `role="status"`. | table.component.ts:775-777, :795 |
| SL-TABLE-11 | miglioramento | Default in inglese non passati da `LocalizeController` (`Actions`, `Select all rows`, `Rows per page`, `Showing…`, `No results found.`); sono tutti sovrascrivibili via property/formatter/slot. | table.component.ts:173, :200-226, :766 |
| SL-TABLE-14 | miglioramento | Tutti i trigger azioni si chiamano "Actions" (distinguibili dal contesto di riga; 2.4.9 è AAA): accettare una funzione `(row) => string`. | table.component.ts:677 |
| SL-TABLE-16 | miglioramento | `role="grid"` sempre imposto anche a tabelle di sola lettura: valutare `role="table"` quando non ci sono selezione/sort. | table.component.ts:236-239 |
| SL-TABLE-18 | miglioramento | Test: aggiungere Enter/Space sugli header, axe con toolbar/paginazione/selezione/vuoto. Docs: sezione accessibilità, `label` negli esempi, evitare `header: ''`. | table.test.ts; docs/pages/components/table.md:489-525 |
| SL-TABLE-V01 | miglioramento | Verificare il reset della pagina: click su "Next page" emette `page:2` e poi `page:1` (bug funzionale, non a11y). | table.component.ts:394-408 |

### Responsabilità del consumer
- Dare un nome al grid (oggi solo con `aria-label`/`aria-labelledby` sull'host, finché SL-TABLE-02 non è corretto).
- `rowVariant` (SL-TABLE-13): il marker colorato deve essere ripetuto in una cella testuale (come fa l'esempio "Marker" con la colonna Status).
- Etichettare i controlli inseriti nella toolbar e nelle celle (es. `sl-input label`).
- Sovrascrivere le label e i formatter in inglese per pagine in altra lingua.

### Da verificare con AT reali
- SL-TABLE-08: `aria-rowcount="5"` sull'host (esclude la riga header) e nessun `aria-rowindex` sulle righe (`",,"`): con paginazione la posizione annunciata ("riga x di y") dipende da come NVDA/JAWS/VoiceOver usano questi valori; verificare con NVDA+Chrome e VoiceOver+Safari.
- Lettura di `role="grid"` sull'host con righe nello shadow root e annuncio della riga focusata (NVDA/JAWS in focus mode, VoiceOver).
- Annuncio del cambio di `aria-sort` sull'header focusato dopo il click (una volta corretto SL-TABLE-01).
- Firefox: il nome della select-all da `title` potrebbe essere calcolato diversamente (in Chromium è vuoto).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-TABLE-01 | Blocker | confermato | Enter/Space sull'header focusato non ordinano, il click sì (runtime). |
| SL-TABLE-02 | Alta | confermato | `label` non applicata, grid senza nome; workaround non documentato. |
| SL-TABLE-03 | Alta | confermato | `combobox` page size senza nome (runtime). |
| SL-TABLE-04 | Alta | ridimensionato → Media | La tabella base è strutturalmente valida (axe `[]`); la violazione c'è solo con toolbar/paginazione/vuoto/selezione multipla/azioni. |
| SL-TABLE-05 | Media | confermato | Checkbox di riga senza nome; in più lo stato si desincronizza se attivata da AT. |
| SL-TABLE-06 | Media | riclassificato (miglioramento) | Le funzioni restano operabili da tastiera; manca solo la navigazione per cella APG. |
| SL-TABLE-07 | Media | riclassificato (miglioramento) | Comportamento riprodotto, ma non viola un criterio A/AA. |
| SL-TABLE-08 | Media | riclassificato (da-verificare-AT) | Valori ARIA inesatti dimostrati, l'effetto sull'annuncio dipende dall'AT. |
| SL-TABLE-09 | Bassa | riclassificato (miglioramento) | `selected=false` su tabella non selezionabile: rumore, nessun criterio violato. |
| SL-TABLE-10 | Media | riclassificato (miglioramento) | Il focus resta sul controllo e il testo aggiornato è raggiungibile; 4.1.3 non dimostrato. |
| SL-TABLE-11 | Media | riclassificato (miglioramento) | Stringhe sovrascrivibili via API; 3.1.2 non applicabile a default sostituibili. |
| SL-TABLE-12 | Media | confermato | In forced colors la riga selezionata (single) è identica alle altre (runtime). |
| SL-TABLE-13 | Media | riclassificato (consumer) | Il consumer deve ripetere lo stato in testo, come nell'esempio docs. |
| SL-TABLE-14 | Bassa | riclassificato (miglioramento) | Il contesto di riga distingue i pulsanti; 2.4.9 è AAA. |
| SL-TABLE-15 | Bassa | ridimensionato → Media | 3.49:1 in dark misurato: violazione AA in un tema. |
| SL-TABLE-16 | Media | riclassificato (miglioramento) | Scelta di ruolo, non violazione. |
| SL-TABLE-17 | Suggerimento | ridimensionato → Alta | Il report precedente dava il nome come funzionante via `title`: in Chromium la checkbox non ha nome. |
| SL-TABLE-18 | Bassa | riclassificato (miglioramento) | Test/docs. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` | Sì | ❌ `grid` senza nome | Sì (grid richiede un nome) |
| `aria-label` sull'host | Non dichiarato | ✅ `grid "Corrispondenza"` | Workaround valido |
| `select-all-label` | Sì | ❌ solo `title`, checkbox senza nome | Sì |
| `page-size-label` | Sì | ❌ testo visibile, `combobox` senza nome | Sì |
| `action-menu-label` | Sì | ✅ `button "Actions"` | Sì |
| `first/previous/next/last-page-label` | Sì | ✅ `button "First page"` … | Sì |
| `summaryFormatter` / `pageFormatter` | Sì | ✅ testo `"Showing 1 – 2 of 5"` | Sì |
| `aria-sort` (interno) | Sì | ✅ `date:descending` → `protocol:ascending` dopo il click | Sì |

### Fix proposti
```ts
// SL-TABLE-01 – handleKeyDown: attivare il sort da tastiera sull'header
const columnId = this.findColumnId(path);
if (columnId && [' ', 'Enter'].includes(event.key)) {
  event.preventDefault();
  table.getColumn(columnId)?.toggleSorting();
  return;
}
// (alternativa migliore: <button type="button"> nativo dentro il columnheader)

// SL-TABLE-02 – willUpdate
if (changedProperties.has('label')) {
  if (this.label) this.setAttribute('aria-label', this.label);
  else this.removeAttribute('aria-label');
}

// SL-TABLE-03
html`<div class="table__page-size">
  <span aria-hidden="true">${this.pageSizeLabel}</span>
  <sl-select size="small" label=${this.pageSizeLabel} class="table__page-size-select" …></sl-select>
</div>`; // label visiva interna nascosta con ::part(form-control-label) visually-hidden

// SL-TABLE-17
html`<div class="table__select-all" role="columnheader">
  <sl-checkbox part="select-all" …><sl-visually-hidden>${this.selectAllLabel}</sl-visually-hidden></sl-checkbox>
</div>`;

// SL-TABLE-05
html`<div class="table__row-selection" role="gridcell">
  <sl-checkbox part="checkbox" aria-hidden="true" inert tabindex="-1" …></sl-checkbox>
</div>`;

// SL-TABLE-04 – grid solo attorno a header e righe; actions-header e vuoto con ruolo
html`<div class="table__scroller" role="grid" aria-label=${this.label || nothing} …>…</div>`;
html`<div part="actions-header" class="table__actions-header" role="columnheader"></div>`;
html`<div role="row"><div part="empty" class="table__empty" role="gridcell" aria-colspan=${colCount}>…</div></div>`;
```
```css
/* SL-TABLE-12 */
@media (forced-colors: active) {
  .table__row[selected] { outline: 2px solid Highlight; outline-offset: -2px; }
}
/* SL-TABLE-15 */
.table__empty { color: var(--sl-color-neutral-600); }
```
