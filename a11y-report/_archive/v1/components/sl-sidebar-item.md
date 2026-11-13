## Sidebar Item (`sl-sidebar-item` – src/components/sidebar-item/sidebar-item.component.ts)
**Pattern APG di riferimento:** Link di navigazione con `aria-current="page"`
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 2 · Bassa 3 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<a>` nativo (r. 53) ✅; senza `href` l'`<a>` non è un link né focusabile (01). |
| 2 | Nome, descrizione, stato | ⚠️ | `aria-current="page"` sull'`<a>` interno con `ifDefined` (r. 60) ✅. In `collapsed` la label è `display:none` e il nome viene solo da `title` (r. 61) (04). Contatore senza contesto (05). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-label` sull'host non arriva all'`<a>` (nessuna property `label`). |
| 4 | Tastiera e focus | ⚠️ | Focus ring `outline: var(--sl-focus-ring)` (styles r. 55-58) ✅, visibile in forced-colors. Item senza `href` non raggiungibili da tastiera (01). In collapsed i nomi non sono visibili al focus (04). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Testo `neutral-700` 9.12:1 ✅; corrente `primary-800` su `primary-100`: 9.95:1 light ✅ ma **4.42:1 dark** ❌ (02). Contatore `neutral-500`: 4.71:1 light, 3.48:1 dark ❌, 4.27:1 su hover `neutral-100` ❌ (03). Stato corrente = sfondo + barra `::before` + semibold (non solo colore) ✅; in forced-colors sfondo e barra spariscono, resta solo il peso (06). Target ≥36px ✅. |
| 8 | API pubblica a11y | ⚠️ | Manca `label` (nome per collapsed/icon-only), `count-label`, `rel`. |
| 9 | Documentazione e test | ⚠️ | 1 test axe statico con `current` (test r. 6-12); nessun test collapsed o senza `href`. Docs: esempi sempre con `href="#"`. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-SIDEBAR-ITEM-01 | Alta | Tastiera / semantica | `href` è opzionale ma senza `href` viene reso `<a>` senza `href`: non è un link, non è focusabile e non risponde a Enter. Le app SPA che usano solo `@click` per il routing producono una navigazione inutilizzabile da tastiera e senza ruolo. | sidebar-item.component.ts:35 `href?: string`; 53-58 `<a ... href=${ifDefined(this.href)}>` | WCAG 2.1.1, 4.1.2 | Se `href` manca rendere `<button type="button">` (stessi stili) oppure rendere `href` obbligatorio con warning in dev mode. |
| SL-SIDEBAR-ITEM-02 | Media | Contrasto | Testo dell'item corrente `primary-800` su `primary-100` nel tema dark: 4.42:1 (< 4.5:1) per testo 14px semibold. | sidebar-item.styles.ts:39-43 | WCAG 1.4.3 | Nel tema dark usare `primary-900` o un token dedicato (`--sl-sidebar-item-current-color`). |
| SL-SIDEBAR-ITEM-03 | Media | Contrasto | Contatore `neutral-500` su sfondo trasparente: 3.48:1 in dark (SHARED-03) e 4.27:1 in light su hover (`neutral-100`). | sidebar-item.styles.ts:81-87 `color: var(--sl-color-neutral-500);`; 33-36 hover | WCAG 1.4.3; SHARED-03 | `color: var(--sl-color-neutral-600)`. |
| SL-SIDEBAR-ITEM-04 | Bassa | Nome / visivi | In `collapsed` la label va a `display:none` e il nome del link è fornito solo da `title` (calcolato da `textContent` al render, non aggiornato se il testo cambia); per gli utenti da tastiera vedenti il nome non compare al focus (il `title` appare solo su hover). | sidebar-item.component.ts:61 `title=${ifDefined(this.collapsed ? this.textContent?.trim() : undefined)}`; sidebar-item.styles.ts:105-108 | WCAG 4.1.2, 2.4.6, 1.4.13 | Nascondere la label in modo solo visivo (classe sr-only) invece di `display:none`; mostrare un `sl-tooltip` anche su focus; property `label`. |
| SL-SIDEBAR-ITEM-05 | Bassa | Nome | Il contatore è letto come numero nudo nel nome del link ("Job Document 6") senza unità. | sidebar-item.component.ts:65-67 | WCAG 2.4.4, 1.3.1 | Property `count-label` resa visivamente nascosta; badge `aria-hidden` se presente. |
| SL-SIDEBAR-ITEM-06 | Bassa | Forced colors | Lo stato corrente è reso con `background-color` e barra `::before` (background): in `forced-colors: active` entrambi spariscono e resta solo il `font-weight`. | sidebar-item.styles.ts:39-53 (nessuna media query `forced-colors`) | WCAG 1.4.1, 1.4.11; SHARED-02 | `@media (forced-colors: active) { .sidebar-item[aria-current='page'] { outline: 2px solid Highlight; } .sidebar-item[aria-current='page']::before { background: Highlight; forced-color-adjust: none; } }` |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `current` → `aria-current="page"` | Sì | Sì, sull'`<a>` interno | Conforme. |
| `href` / `target` | Sì | Sì | Senza `href` → link non operabile (01); manca `rel`. |
| `label` (nome per rail/icon-only) | No | — | Da aggiungere → `aria-label` sull'`<a>` quando `collapsed`. |
| `count-label` | No | — | Da aggiungere. |

### Fix proposti
```ts
@property() label = '';
@property({ attribute: 'count-label' }) countLabel = '';

render() {
  const name = this.label || this.textContent?.trim() || undefined;
  const content = html`
    <slot name="prefix" part="prefix" class="sidebar-item__prefix"></slot>
    <span part="label" class="sidebar-item__label"><slot></slot></span>
    ${this.count !== undefined
      ? html`<sl-badge part="count" class="sidebar-item__count" variant="neutral" pill aria-hidden=${this.countLabel ? 'true' : nothing}>${this.count}</sl-badge>
             ${this.countLabel ? html`<span class="sr-only">${this.countLabel}</span>` : ''}`
      : ''}`;
  return this.href
    ? html`<a part="base" class=${cls} href=${this.href} target=${ifDefined(this.target)}
             aria-current=${ifDefined(this.current ? 'page' : undefined)}
             aria-label=${ifDefined(this.collapsed ? name : undefined)}>${content}</a>`
    : html`<button part="base" type="button" class=${cls}
             aria-current=${ifDefined(this.current ? 'page' : undefined)}
             aria-label=${ifDefined(this.collapsed ? name : undefined)}>${content}</button>`;
}
```
```css
.sidebar-item--collapsed .sidebar-item__label,
.sidebar-item--collapsed .sidebar-item__count { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.sidebar-item__count::part(base) { color: var(--sl-color-neutral-600); }
@media (forced-colors: active) {
  .sidebar-item[aria-current='page'] { outline: 2px solid Highlight; outline-offset: -2px; }
}
```

### Non verificabile
- Esposizione del `title` come nome accessibile del link in collapsed con VoiceOver/NVDA (dovrebbe funzionare come fallback dell'accname, ma va verificata).
- Contrasto di icone slottate nel `prefix` con colori del consumer.
