## Breadcrumb Item (`sl-breadcrumb-item` – src/components/breadcrumb-item/breadcrumb-item.component.ts)
**Pattern APG di riferimento:** Breadcrumb (link con `aria-current="page"`)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 2 · Bassa 2
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Con `href` → `<a>` nativo (`link "Homepage"`); senza `href` → `<button type="button">` (`button "Catalog"`), comportamento documentato per le SPA ("you'll need to add event listeners"). |
| 2 | Nome/descrizione/stato | ❌ | Nome dal testo ✅; separatore `aria-hidden` ✅. L'ultimo item non espone lo stato corrente: `aria-current` solo sull'host, `<a>` interno senza (SL-BREADCRUMB-ITEM-01). |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | `aria-current` sull'host (scritto da `sl-breadcrumb`) non è inoltrato all'`<a>`/`<button>`; l'host generico non compare nell'albero. |
| 4 | Tastiera e focus | ✅ | Controlli nativi; focus ring 6.18:1 (light) / 10.31:1 (dark); forced colors `outlineStyle = solid`. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Link 6.18:1 / 8.02:1, corrente 6.64:1 / 5.72:1, separatore 6.64:1 / 5.72:1; **hover light 3.07:1** (SL-BREADCRUMB-ITEM-03); dark hover 6.63:1. Troncamento a 320 px (SL-BREADCRUMB-ITEM-04). Target alti 21 px che si sovrappongono quando gli item vanno a capo (SL-BREADCRUMB-ITEM-V01). |
| 8 | API pubblica a11y | ⚠️ | Nessuna property `current`; nessun modo di rendere l'item corrente come testo statico. |
| 9 | Docs e test | ⚠️ | Nessun test su `aria-current` interno. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-BREADCRUMB-ITEM-01 | Media | Stato / Shadow DOM | L'item corrente (ultimo) è distinto visivamente (colore neutro, non link) ma lo stato non è esposto: `aria-current="page"` è scritto sull'host e non arriva al link/bottone interno; il consumer non può impostarlo sull'elemento interno. Impatto attenuato dalla posizione (sempre ultimo). | breadcrumb.component.ts:79-83 (`item.setAttribute('aria-current', 'page')`); breadcrumb-item.component.ts:94-109 (nessun `aria-current` su `<a>`/`<button>`) | runtime: `eval` → `{"host":"page","inner":null}` (attributo sull'host, assente sull'`<a>`); `ax:sl-breadcrumb-item:last-of-type` → host compattato come generic senza nome, nodo esposto `link "Web Design"`. (CDP non serializza `aria-current`: la prova è DOM + struttura; stesso meccanismo verificato dal coordinatore per gli `aria-*` sull'host) | WCAG 1.3.1 (A), 4.1.2 (A); APG Breadcrumb | Property `current` (reflect) e `aria-current=${this.current ? 'page' : nothing}` sull'`<a>`/`<button>`; `sl-breadcrumb` imposta `item.current`. |
| SL-BREADCRUMB-ITEM-03 | Media | Contrasto | Hover dei link in tema light: `primary-500` su bianco 3.07:1 per testo 14 px semibold. | breadcrumb-item.styles.ts:45-47 | runtime: `hover ;; contrast:sl-breadcrumb-item >>> a: fg #16a0c2 su bg #ffffff = 3.07:1` (dark: 6.63:1) | WCAG 1.4.3 (AA) | Hover `primary-700` (o mantenere `primary-600`) + `text-decoration: underline`. |
| SL-BREADCRUMB-ITEM-04 | Bassa | Reflow | `white-space: nowrap` + ellipsis: a 320 px una label lunga (titolo pagina) viene tagliata senza alternativa. | breadcrumb-item.styles.ts:18, 21-25 | runtime `--viewport 320x640`: ultimo link `scrollWidth/clientWidth = 368/288` | WCAG 1.4.10 (AA) | `white-space: normal; overflow-wrap: anywhere` sulla label (o CSS var), documentare `::part(label)`. |
| SL-BREADCRUMB-ITEM-V01 | Bassa | Target size | I link sono alti 21 px; quando gli item vanno a capo (320 px) le righe distano 21 px e il cerchio di 24 px di un link interseca il link della riga sotto → nessuna eccezione 2.5.8 applicabile. | breadcrumb-item.styles.ts:17 (`line-height: var(--sl-line-height-normal)`), 21-36 (`padding: 0`) | runtime `--viewport 320x640`: rect `Homepage 16,16,88,37` e `Impostazioni utente 16,37,146,58` (centro y 26.5, raggio 12 → 38.5 > 37) | WCAG 2.5.8 (AA) | `min-height: 1.5rem` / `padding-block: 2px` sulla label, oppure `row-gap: var(--sl-spacing-2x-small)` su `.breadcrumb`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-BREADCRUMB-ITEM-V02 | miglioramento | Permettere di rendere l'item corrente senza `href` come testo statico (`<span aria-current="page">`) invece di un `<button>` senza azione. | breadcrumb-item.component.ts:66, 105-111 |
| SL-BREADCRUMB-ITEM-V03 | miglioramento | In forced colors link e item corrente hanno lo stesso colore (`rgb(0,0,159)`): aggiungere un segnale non cromatico (peso/sottolineatura) per il corrente. | breadcrumb-item.styles.ts:41-43 |
| SL-BREADCRUMB-ITEM-V04 | miglioramento | Test su `aria-current` dell'elemento interno e sull'ultimo item senza `href`. | breadcrumb-item.test.ts |

### Responsabilità del consumer
- Item senza `href`: sono `<button>` per le SPA, quindi va aggiunto il listener di click (lo dicono le docs); per la pagina corrente senza azione preferire `href` alla pagina stessa.
- `target="_blank"`: indicare l'apertura in nuova finestra nel testo.

### Da verificare con AT reali
- Annuncio di "pagina corrente" con NVDA/JAWS/VoiceOver dopo il fix SL-BREADCRUMB-ITEM-01.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-BREADCRUMB-ITEM-01 | Media | confermato | `{"host":"page","inner":null}`: lo stato resta sull'host generico; nessun modo di impostarlo sul link dall'esterno. |
| SL-BREADCRUMB-ITEM-02 | Media | riclassificato | `<button>` senza `href` è il comportamento documentato per le SPA (il consumer aggiunge il listener); il corrente come bottone è qualità → consumer + V02. |
| SL-BREADCRUMB-ITEM-03 | Media | confermato | Hover light 3.07:1 misurato. |
| SL-BREADCRUMB-ITEM-04 | Bassa | confermato | 368/288 px a 320 px. |
| SL-BREADCRUMB-ITEM-05 | Bassa | riclassificato | Test mancanti → V04. |
| SL-BREADCRUMB-ITEM-06 | Suggerimento | riclassificato | 1.4.1 riguarda link nel testo; in un breadcrumb la posizione distingue il corrente → V03. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `href`/`target`/`rel` | Sì | Sì (`link "Homepage"`) | Sì |
| `aria-current` (dal breadcrumb) | Sì, sull'host | No (`{"host":"page","inner":null}`) | Sì |
| `current` | No | — | Sì (fix 01) |
| `aria-label` sull'host | — | No | Non serve: prefix è fuori dal link e il testo è sempre presente negli esempi |

### Fix proposti
```ts
// breadcrumb-item.component.ts
/** Marks the item as the current page. Set automatically by `<sl-breadcrumb>` on the last item. */
@property({ type: Boolean, reflect: true }) current = false;

// render()
<a part="label" class="breadcrumb-item__label breadcrumb-item__label--link"
   href="${this.href!}"
   aria-current=${this.current ? 'page' : nothing}
   target="${ifDefined(this.target ? this.target : undefined)}"
   rel=${ifDefined(this.target ? this.rel : undefined)}>
  <slot @slotchange=${this.handleSlotChange}></slot>
</a>
<button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button"
   aria-current=${this.current ? 'page' : nothing}>…</button>

// breadcrumb.component.ts, handleSlotChange()
item.current = index === items.length - 1; // al posto di setAttribute('aria-current', …)
```
```css
/* breadcrumb-item.styles.ts */
.breadcrumb-item { white-space: normal; }
.breadcrumb-item__label { overflow-wrap: anywhere; min-height: 1.5rem; display: inline-flex; align-items: center; }
:host(:not(:last-of-type)) .breadcrumb-item__label:hover { color: var(--sl-color-primary-700); text-decoration: underline; }
```
