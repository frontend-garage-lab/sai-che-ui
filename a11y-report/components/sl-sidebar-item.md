## Sidebar Item (`sl-sidebar-item` – src/components/sidebar-item/sidebar-item.component.ts)
**Pattern APG di riferimento:** Link di navigazione con `aria-current="page"`
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 3 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ⚠️ | Con `href` → `link "Job Document"`. Senza `href` → solo `text "No href item"`, non focusabile (SL-SIDEBAR-ITEM-01). |
| 2 | Nome/descrizione/stato | ✅ | Nome dal testo; il contatore non entra nel nome (figlio `status "6"`). `aria-current="page"` sull'`<a>` interno (DOM: `<a … href="#" aria-current="page">`; CDP non serializza `current`). In collapsed nome da `title`: `link "Job Document" desc="Job Document"`. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Stato e nome sull'elemento interno. |
| 4 | Tastiera e focus | ⚠️ | Tab percorre i link in ordine; focus ring 2px, in forced colors `outlineStyle = solid`. Item senza `href` saltati dal Tab (SL-SIDEBAR-ITEM-01). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Testo 9.07:1 / 8.75:1, hover 14.05:1 / 12.71:1, corrente light 9.97:1, **corrente dark 4.41:1** (SL-SIDEBAR-ITEM-02); **contatore 4.71:1 light, 4.26:1 hover light, 3.49:1 dark, 2.96:1 hover dark** (SL-SIDEBAR-ITEM-03); contatore del corrente 8.73:1 / 10.31:1. Target 303×36 px. Forced colors: corrente distinto solo dal peso (500 vs 400) (miglioramento). |
| 8 | API pubblica a11y | ⚠️ | Nessun fallback a `<button>` senza `href`; nessun `count-label`. |
| 9 | Docs e test | ⚠️ | Esempi sempre con `href="#"`; un solo test axe. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-SIDEBAR-ITEM-01 | Media | Tastiera / ruolo | `href` è opzionale ma senza `href` viene reso un `<a>` senza `href` con stile interattivo (cursor pointer, hover): non ha ruolo link, non è focusabile né attivabile con Enter. Uso ragionevole in SPA (routing con listener di click, convenzione che il DS stesso documenta per `sl-breadcrumb-item`). Workaround: impostare sempre `href` (non documentato come obbligatorio). | sidebar-item.component.ts:35 (`href?: string`), 53-58 (`<a … href=${ifDefined(this.href)}>`) | runtime: `group "Procurement (SAP)"` › `text "No href item"` (nessun `link`); `focus:#a ;; tab ×3` → `"Purchase Order"` (l'item senza href viene saltato) | WCAG 2.1.1 (A), 4.1.2 (A) | Senza `href` renderizzare `<button type="button">` con gli stessi stili (come `sl-breadcrumb-item`), oppure rendere `href` obbligatorio e documentarlo. |
| SL-SIDEBAR-ITEM-02 | Media | Contrasto | Testo dell'item corrente nel tema dark sotto 4.5:1 (14 px). | sidebar-item.styles.ts:39-43 (`background-color: var(--sl-color-primary-100); color: var(--sl-color-primary-800)`) | runtime `theme:dark`: `contrast:sl-sidebar-item[current] >>> a: fg #bce0e9 su bg #0e6a81 = 4.41:1` (light 9.97:1) | WCAG 1.4.3 (AA) | Nel tema dark `color: var(--sl-color-primary-900)` (o token dedicato) per l'item corrente. |
| SL-SIDEBAR-ITEM-03 | Media | Contrasto | Contatore degli item non correnti (`neutral-500`) sotto 4.5:1 in dark e in hover light. | sidebar-item.styles.ts:81-87 (`color: var(--sl-color-neutral-500)`), 33-36 (hover `neutral-100`) | runtime: light hover `fg #6c757a su bg #f2f4f5 = 4.26:1`; dark `fg #636e74 su bg #0f161a = 3.49:1`, dark hover `2.96:1` (light a riposo 4.71:1) | WCAG 1.4.3 (AA) | `color: var(--sl-color-neutral-600)` sul `::part(base)` del contatore. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-SIDEBAR-ITEM-V01 | miglioramento | In collapsed il nome viene da `title` (funziona: `link "Job Document"`), ma è anche ripetuto come descrizione, è calcolato da `textContent` solo al render e appare solo all'hover: preferire label visivamente nascosta + tooltip al focus. | sidebar-item.component.ts:61; sidebar-item.styles.ts:105-108 |
| SL-SIDEBAR-ITEM-V02 | miglioramento | `count-label` per dare contesto al contatore (oggi `status "6"` fuori dal nome del link). | sidebar-item.component.ts:65-67 |
| SL-SIDEBAR-ITEM-V03 | miglioramento | Forced colors: sfondo e barra `::before` del corrente diventano `rgb(255,255,255)`, resta solo `font-weight` 500 vs 400: aggiungere `outline`/bordo `Highlight` per il corrente. | sidebar-item.styles.ts:39-53 |
| SL-SIDEBAR-ITEM-V04 | miglioramento | Test axe in collapsed e senza `href`; esposizione di `rel`. | sidebar-item.test.ts |

### Responsabilità del consumer
- Fornire sempre `href` (fino al fix SL-SIDEBAR-ITEM-01).
- Item in collapsed: fornire un'icona `prefix`, altrimenti l'item sparisce.

### Da verificare con AT reali
- Annuncio di "pagina corrente" (`aria-current="page"` sull'`<a>`, non verificabile via CDP) e del `title` come nome in collapsed con NVDA/JAWS/VoiceOver.
- Lettura del contatore (`sl-badge` `role="status"` dentro il link) al focus.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-SIDEBAR-ITEM-01 | Alta | ridimensionato | Dimostrato (`text "No href item"`, saltato dal Tab), ma l'uso documentato usa sempre `href` e il workaround esiste → Media. |
| SL-SIDEBAR-ITEM-02 | Media | confermato | Dark 4.41:1 misurato. |
| SL-SIDEBAR-ITEM-03 | Media | confermato | Dark 3.49:1, hover light 4.26:1 misurati. |
| SL-SIDEBAR-ITEM-04 | Bassa | riclassificato | Il nome in collapsed c'è (`link "Job Document"`); il resto è qualità → V01. |
| SL-SIDEBAR-ITEM-05 | Bassa | scartato | Il contatore non entra nel nome del link (`link "Job Document"`, `status "6"` figlio). Resta V02. |
| SL-SIDEBAR-ITEM-06 | Bassa | riclassificato | In forced colors il corrente resta distinto dal peso; forced colors non è un requisito WCAG → V03. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `current` → `aria-current="page"` | Sì | Sì, sull'`<a>` interno (DOM) | Sì |
| `href`/`target` | Sì | Sì (`link "Job Document"`) | Sì; senza `href` errore 01 |
| `collapsed` → `title` | Sì | Sì (`link "Job Document" desc="Job Document"`) | Sì |
| `label` | No | — | No (il testo slottato basta) |
| `count-label` | No | — | Utile |

### Fix proposti
```ts
// sidebar-item.component.ts, render()
const cls = `sidebar-item${hasPrefix ? ' sidebar-item--has-prefix' : ''}${this.collapsed ? ' sidebar-item--collapsed' : ''}`;
const title = ifDefined(this.collapsed ? this.textContent?.trim() : undefined);
const current = ifDefined(this.current ? 'page' : undefined);
return this.href
  ? html`<a part="base" class=${cls} href=${this.href} target=${ifDefined(this.target)} aria-current=${current} title=${title}>${content}</a>`
  : html`<button part="base" type="button" class=${cls} aria-current=${current} title=${title}>${content}</button>`;
```
```css
/* sidebar-item.styles.ts */
button.sidebar-item { width: 100%; font: inherit; background: none; border: none; text-align: start; }
.sidebar-item__count::part(base) { color: var(--sl-color-neutral-600); }
:host-context(.sl-theme-dark) .sidebar-item[aria-current='page'] { color: var(--sl-color-primary-900); }
```
