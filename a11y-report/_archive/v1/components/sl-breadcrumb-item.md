## Breadcrumb Item (`sl-breadcrumb-item` – src/components/breadcrumb-item/breadcrumb-item.component.ts)
**Pattern APG di riferimento:** Breadcrumb (link con `aria-current="page"`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 3 · Bassa 2 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<a href>` nativo se `href` (r. 92-104) ✅; senza `href` viene reso un `<button>` senza azione, anche per la pagina corrente (02). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome dal testo slottato ✅. `aria-current="page"` resta sull'host senza ruolo e non arriva al link (01). Separatore `aria-hidden` (r. 124) ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | `aria-*` scritti sull'host (dal breadcrumb o dal consumer) non vengono inoltrati all'`<a>`/`<button>` interno. |
| 4 | Tastiera e focus | ✅ | Controlli nativi; `:focus-visible` con `outline: var(--sl-focus-ring)` + offset (styles r. 57-60), resiste in forced-colors. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Link `primary-600` 6.21:1 ✅; hover `primary-500` 3.08:1 in light ❌ (03); corrente `neutral-600` 6.63:1 ✅. Link e corrente distinti solo dal colore (1.07:1 tra loro) (06). Altezza ≈21px (14px × 1.5), larghezza variabile; separatori con margine 8px forniscono lo spacing orizzontale (2.5.8 con eccezione spacing, da verificare in wrap). Testo troncato con ellipsis (04). |
| 8 | API pubblica a11y | ⚠️ | Nessuna property `current`; `target="_blank"` senza avviso testuale (consumer). |
| 9 | Documentazione e test | ✅ | axe per button/link/dropdown/prefix/suffix (test r. 13-168) e test su separatore `aria-hidden` (r. 17-20). Manca test su `aria-current` interno. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-BREADCRUMB-ITEM-01 | Media | Stato / Shadow DOM | `aria-current="page"` viene scritto da `sl-breadcrumb` sull'host (elemento generico senza ruolo) e non è inoltrato al link/button interno: lo stato "pagina corrente" non è annunciato quando si naviga sui link. | breadcrumb.component.ts:79-83 `item.setAttribute('aria-current', 'page')`; breadcrumb-item.component.ts:94-109 (nessun `aria-current` su `<a>`/`<button>`) | WCAG 1.3.1, 4.1.2; APG Breadcrumb | Property `current` (reflect) e `aria-current=${this.current ? 'page' : nothing}` sull'elemento interno; non scrivere `aria-current` sull'host. |
| SL-BREADCRUMB-ITEM-02 | Media | Semantica | Senza `href` l'item diventa un `<button type="button">` senza comportamento: la pagina corrente e gli item non navigabili sono tab stop annunciati come "pulsante" che non fanno nulla (esempi docs tutti senza `href`). | breadcrumb-item.component.ts:66 `this.renderType = 'button';`; 105-111 | WCAG 4.1.2, 2.4.3; APG Breadcrumb | Per l'item corrente senza `href` rendere testo statico (`<span aria-current="page">`); usare `<button>` solo se il consumer ascolta il click (es. property `type="button"` esplicita). |
| SL-BREADCRUMB-ITEM-03 | Media | Contrasto | Colore hover dei link `primary-500` su bianco 3.08:1 per testo 14px semibold (< 4.5:1) in tema light. | breadcrumb-item.styles.ts:45-47 `:host(:not(:last-of-type)) .breadcrumb-item__label:hover { color: var(--sl-color-primary-500); }` | WCAG 1.4.3 | Hover con `primary-700` e/o sottolineatura (`text-decoration: underline`). |
| SL-BREADCRUMB-ITEM-04 | Bassa | Reflow | `white-space: nowrap` + `overflow:hidden; text-overflow: ellipsis` sulla label: con zoom/320px le etichette vengono troncate senza alternativa. | breadcrumb-item.styles.ts:18, 21-25 | WCAG 1.4.10 | Consentire il wrapping o mostrare il testo completo in un tooltip/`title`; documentare `::part(label)`. |
| SL-BREADCRUMB-ITEM-05 | Bassa | Test | Nessun test che verifichi `aria-current` sull'elemento interno né il comportamento dell'ultimo item senza `href`. | breadcrumb-item.test.ts:13-168 | Qualità (WCAG 1.3.1) | Test: `shadowRoot.querySelector('a').getAttribute('aria-current') === 'page'`. |
| SL-BREADCRUMB-ITEM-06 | Suggerimento | Visivi | Link non sottolineati: si distinguono dall'item corrente solo per colore (primary-600 vs neutral-600, 1.07:1) oltre che per la posizione. | breadcrumb-item.styles.ts:30, 41-43 | WCAG 1.4.1 (contesto nav: rischio basso) | `text-decoration: underline` su hover/focus o sempre sui link; peso diverso per il corrente. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `aria-current` | Sì (impostato dal breadcrumb) | No (resta sull'host) | Aggiungere `current` → `aria-current="page"` interno. |
| `href` / `target` / `rel` | Sì | Sì | `rel` solo con `target` (r. 99) ✅. |
| `aria-label` (host) | — | No | Utile per item icon-only (es. "Home" con sola icona): aggiungere `label` → `aria-label` interno. |
| Separatore | `aria-hidden` | Sì | — |

### Fix proposti
```ts
/** Marks this item as the current page (sets aria-current="page" on the inner element). */
@property({ type: Boolean, reflect: true }) current = false;
/** Accessible name for icon-only items. */
@property() label = '';

// render()
${this.renderType === 'link'
  ? html`<a part="label" class="breadcrumb-item__label breadcrumb-item__label--link"
        href=${this.href!}
        aria-current=${this.current ? 'page' : nothing}
        aria-label=${this.label || nothing}
        target=${ifDefined(this.target || undefined)} rel=${ifDefined(this.target ? this.rel : undefined)}>
        <slot @slotchange=${this.handleSlotChange}></slot></a>`
  : ''}
${this.renderType === 'button' && this.current
  ? html`<span part="label" class="breadcrumb-item__label" aria-current="page"><slot @slotchange=${this.handleSlotChange}></slot></span>`
  : ''}
```
```css
:host(:not(:last-of-type)) .breadcrumb-item__label:hover { color: var(--sl-color-primary-700); text-decoration: underline; }
```

### Non verificabile
- Spaziatura effettiva dei target quando gli item vanno a capo (flex-wrap) per l'eccezione di WCAG 2.5.8.
- Annuncio di `aria-current` dopo il fix con NVDA/VoiceOver.
