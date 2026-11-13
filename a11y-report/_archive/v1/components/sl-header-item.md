## Header Item (`sl-header-item` – src/components/header-item/header-item.component.ts)
**Pattern APG di riferimento:** Link di navigazione / Menu Button (con slot `menu`); alternativa raccomandata: Disclosure Navigation Menu
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 0 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<a>` nativo (r. 70) o `<button>` trigger di `sl-dropdown` (r. 54) ✅; senza `href` l'`<a>` non è un link (01). Sottomenu realizzato con `sl-menu` (`role=menu`) per link di navigazione (02). |
| 2 | Nome, descrizione, stato | ✅ | Nome dal contenuto slottato; `aria-current="page"` sull'elemento interno con `ifDefined` (r. 59, 75) ✅; `aria-haspopup`/`aria-expanded` impostati da `sl-dropdown` sul button (dropdown.component.ts:309-328) ✅; chevron `sl-icon` senza label → `aria-hidden` ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Button e `slot="trigger"` nello stesso shadow root: `aria-expanded` arriva al controllo giusto ✅. `aria-label` sull'host (`display: contents`) non arriva all'elemento interno. |
| 4 | Tastiera e focus | ⚠️ | Button/menù gestiti da `sl-dropdown` (Enter/Space/frecce/Esc, ritorno focus). Focus ring `outline: solid 2px var(--color)` (r. 46-49) 11.34:1 ✅. Item senza `href` non focusabili (01). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Colori come `sl-header` (8.15:1 / 7.15:1) ✅; target 32px di altezza ✅. Corrente solo con sfondo, perso in forced-colors (03). Rotazione chevron (r. 64-66) senza transizione. |
| 8 | API pubblica a11y | ⚠️ | Manca `label` per item senza testo (es. solo avatar). |
| 9 | Documentazione e test | ✅ | axe per link e per trigger con menu (test r. 6-28). Nessun test tastiera del dropdown nel contesto header. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-HEADER-ITEM-01 | Alta | Tastiera / semantica | `href` opzionale: senza `href` e senza `menu` viene reso `<a>` privo di `href`, quindi non focusabile, senza ruolo link e non attivabile da tastiera (routing via click inaccessibile). | header-item.component.ts:40 `href?: string`; 70-76 `<a ... href=${ifDefined(this.href)}>` | WCAG 2.1.1, 4.1.2 | Rendere `<button type="button">` in assenza di `href`, oppure warning in dev mode. |
| SL-HEADER-ITEM-02 | Bassa | Semantica (pattern) | Lo slot `menu` è pensato per `sl-menu` (`role="menu"`/`menuitem`) usato come sottomenu di navigazione: l'APG sconsiglia `role=menu` per link di sito (gli utenti si aspettano Tab, non frecce, e i menuitem non sono link); negli esempi docs le voci non hanno `href`. | header-item.component.ts:23-24 (JSDoc slot `menu`), 52-65; docs/pages/components/header.md:16-29 | APG Disclosure Navigation Menu; WCAG 1.3.1 | Offrire una variante "disclosure" (button `aria-expanded` + lista di link) o documentare l'uso di `sl-menu-item` con `href`. |
| SL-HEADER-ITEM-03 | Bassa | Forced colors | Stato corrente solo con `background-color` (wash 16%) → invisibile in `forced-colors: active`. | header-item.styles.ts:41-44 | WCAG 1.4.1, 1.4.11; SHARED-02 | `@media (forced-colors: active) { .header-item[aria-current] { outline: 2px solid Highlight; outline-offset: -2px; } }` |
| SL-HEADER-ITEM-04 | Bassa | API | Nessuna property `label`: un item con solo avatar/icona non può ricevere un nome sul `<a>`/`<button>` interno (l'`aria-label` sull'host `display: contents` resta sull'host). | header-item.component.ts:39-46 | WCAG 4.1.2 | `@property() label` → `aria-label=${ifDefined(this.label \|\| undefined)}` sull'elemento interno. |
| SL-HEADER-ITEM-05 | Suggerimento | Stato | Sul trigger del menu `aria-current="page"` è semanticamente impreciso (il button non è la pagina; indica la sezione corrente). | header-item.component.ts:59 | ARIA 1.2 (aria-current) | Usare `aria-current="true"` sul button della sezione corrente. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `current` → `aria-current` | Sì | Sì, sull'elemento interno | `"true"` per il trigger. |
| `href` / `target` | Sì | Sì | Senza `href` → non operabile (01). |
| `aria-haspopup` / `aria-expanded` | Sì (via `sl-dropdown`) | Sì | — |
| `label` | No | — | Da aggiungere. |

### Fix proposti
```ts
@property() label = '';

render() {
  const hasMenu = this.hasSlotController.test('menu');
  const name = ifDefined(this.label || undefined);
  if (hasMenu) {
    return html`<sl-dropdown>
      <button type="button" slot="trigger" part="base" class="header-item header-item--has-menu"
        aria-label=${name} aria-current=${ifDefined(this.current ? 'true' : undefined)}>…</button>
      <slot name="menu"></slot>
    </sl-dropdown>`;
  }
  return this.href
    ? html`<a part="base" class="header-item" href=${this.href} target=${ifDefined(this.target)}
             aria-label=${name} aria-current=${ifDefined(this.current ? 'page' : undefined)}>
             <slot part="label" class="header-item__label"></slot></a>`
    : html`<button type="button" part="base" class="header-item" aria-label=${name}
             aria-current=${ifDefined(this.current ? 'page' : undefined)}>
             <slot part="label" class="header-item__label"></slot></button>`;
}
```
```css
@media (forced-colors: active) {
  .header-item[aria-current] { outline: 2px solid Highlight; outline-offset: -2px; }
}
```

### Non verificabile
- Esperienza con screen reader del sottomenu `role=menu` all'interno del landmark `nav` (NVDA/JAWS passano in focus mode).
