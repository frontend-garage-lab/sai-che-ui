## Header Item (`sl-header-item` – src/components/header-item/header-item.component.ts)
**Pattern APG di riferimento:** Link di navigazione / Menu Button (slot `menu`)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 2
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ⚠️ | Con `href` → `link "Dashboard"`; con `menu` → `button "Project Data"` trigger di `sl-dropdown`; senza `href` né `menu` → solo `text "Reports plain"` (SL-HEADER-ITEM-01). |
| 2 | Nome/descrizione/stato | ⚠️ | Nome dal testo. `aria-current="page"` sull'elemento interno (DOM). Il trigger del menu non ha `aria-haspopup`/`aria-expanded` finché non viene aperto la prima volta (SL-HEADER-ITEM-V01). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Button e slot `trigger` nello stesso shadow root: dopo l'apertura `aria-haspopup=true`, `aria-expanded=true` sul `<button>`. |
| 4 | Tastiera e focus | ⚠️ | Enter apre il menu (`open: true`), ArrowDown → `sl-menu-item "Documents"`, Escape riporta il focus al trigger. Item senza `href` saltati dal Tab (dopo "Dashboard" → `sl-select`). Focus ring 11.34:1, forced colors `outlineStyle = solid`. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Testo 8.15:1, corrente 7.13:1, hover 8.48:1; target 124×32 / 96×32 px. Stato corrente reso solo da un wash 1.59:1 (SL-HEADER-ITEM-03). |
| 8 | API pubblica a11y | ⚠️ | Nessun fallback a `<button>` senza `href`. |
| 9 | Docs e test | ⚠️ | Docs: "Mark the current page with the `current` attribute, or set `href` for a plain link" (suggerisce item senza `href`); nessun test tastiera. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-HEADER-ITEM-01 | Media | Tastiera / ruolo | Senza `href` e senza `menu` viene reso un `<a>` senza `href` con stile interattivo: nessun ruolo, non focusabile né attivabile con Enter (routing SPA via click inaccessibile). Le docs lasciano intendere che `href` serva solo per "a plain link". | header-item.component.ts:40 (`href?: string`), 70-76 (`<a … href=${ifDefined(this.href)}>`) | runtime: `navigation "Main"` › `text "Reports plain"` (nessun `link`/`button`); Tab da `link "Dashboard"` → `sl-select > input` (item saltato) | WCAG 2.1.1 (A), 4.1.2 (A) | Senza `href` renderizzare `<button type="button">`; docs: chiarire. |
| SL-HEADER-ITEM-03 | Bassa | Contrasto stato | La voce corrente (`current`) è distinta solo da un wash bianco al 16% (1.59:1 rispetto al brand) e dal testo al 100% invece dell'82%; nessun indicatore non cromatico. In forced colors il wash resta `rgba(255,255,255,0.16)` su Canvas bianco e nessun outline → stato corrente invisibile. Vale anche per gli `<a>` slottati in `sl-header`. | header-item.styles.ts:41-44; header.styles.ts:91-94 | runtime: `contrast:sl-header-item[current] >>> a|backgroundColor|sl-header >>> .header: fg #2b5f6c su bg #024050 = 1.59:1` (light e dark); forced colors `backgroundColor = rgba(255,255,255,0.16)`, `outlineStyle = none` | WCAG 1.4.11 (AA) | Indicatore non cromatico ≥3:1 (barra inferiore 3px `var(--color)` o sottolineatura) + `@media (forced-colors: active) { .header-item[aria-current] { outline: 2px solid Highlight; } }`. |
| SL-HEADER-ITEM-V01 | Bassa | Stato | Il trigger del menu non espone `aria-haspopup`/`aria-expanded` prima della prima apertura: è annunciato come pulsante semplice. Causa in `sl-dropdown.updateAccessibleTrigger()` (al `slotchange` non trova ancora un tabbable); riprodotto anche con `<sl-dropdown><sl-button slot="trigger">`. | dropdown.component.ts:309-327 (chiamato da 296 e 392); header-item.component.ts:53-65 | runtime: dopo `wait:2000` attributi del button `["type=button","slot=trigger","part=base","class=…"]`, AX `button "Project Data" [invalid="false"]`; dopo `key:Enter` → `aria-haspopup=true`, `aria-expanded=true` | WCAG 4.1.2 (A) | In `sl-header-item` impostare direttamente `aria-haspopup="menu"` e `aria-expanded=${open}` sul button (ascoltando `sl-show`/`sl-hide`); fix trasversale: richiamare `updateAccessibleTrigger()` in `firstUpdated`/dopo `updateComplete` del trigger. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-HEADER-ITEM-V02 | miglioramento | Per link di sito valutare il pattern Disclosure Navigation Menu invece di `role=menu`, o documentare `sl-menu-item` con `href`. Il menu attuale è operabile (Enter/frecce/Escape). | header-item.component.ts:23-24, 52-65 |
| SL-HEADER-ITEM-V03 | miglioramento | Property `label` per item senza testo (oggi gli esempi hanno sempre testo, anche accanto all'avatar). | header-item.component.ts:39-46 |
| SL-HEADER-ITEM-V04 | miglioramento | Sul trigger della sezione corrente usare `aria-current="true"` invece di `"page"`. | header-item.component.ts:59 |
| SL-HEADER-ITEM-V05 | miglioramento | Test tastiera del dropdown nel contesto header. | header-item.test.ts |

### Responsabilità del consumer
- Fornire `href` agli item di navigazione (fino al fix 01).

### Da verificare con AT reali
- Esperienza del sottomenu `role=menu` dentro il landmark `navigation` con NVDA/JAWS (cambio di modalità) e VoiceOver.
- Annuncio di "pagina corrente" (`aria-current`, non serializzato da CDP).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-HEADER-ITEM-01 | Alta | ridimensionato | Dimostrato (`text "Reports plain"`, saltato dal Tab), workaround `href` disponibile → Media. |
| SL-HEADER-ITEM-02 | Bassa | riclassificato | Scelta di pattern; il menu è operabile da tastiera → V02. |
| SL-HEADER-ITEM-03 | Bassa | confermato | Esteso: oltre al forced colors, anche in condizioni normali l'unico indicatore è un wash 1.59:1. |
| SL-HEADER-ITEM-04 | Bassa | riclassificato | Nessun uso documentato senza testo → V03. |
| SL-HEADER-ITEM-05 | Suggerimento | riclassificato | Imprecisione semantica senza effetto dimostrato → V04. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `href`/`target` | Sì | Sì (`link "Dashboard"`) | Sì; senza `href` errore 01 |
| `current` → `aria-current` | Sì | Sì, sull'elemento interno (DOM) | Sì |
| `aria-haspopup`/`aria-expanded` (da `sl-dropdown`) | Sì | Solo dopo la prima apertura (V01) | Sì |
| `label` | No | — | Solo per item senza testo |

### Fix proposti
```ts
// header-item.component.ts
@state() private menuOpen = false;

// render(), ramo menu
<sl-dropdown @sl-show=${() => (this.menuOpen = true)} @sl-hide=${() => (this.menuOpen = false)}>
  <button type="button" slot="trigger" part="base" class="header-item header-item--has-menu"
    aria-haspopup="menu"
    aria-expanded=${this.menuOpen ? 'true' : 'false'}
    aria-current=${ifDefined(this.current ? 'true' : undefined)}>…</button>
  <slot name="menu"></slot>
</sl-dropdown>

// ramo link
return this.href
  ? html`<a part="base" class="header-item" href=${this.href} target=${ifDefined(this.target)}
           aria-current=${ifDefined(this.current ? 'page' : undefined)}><slot part="label" class="header-item__label"></slot></a>`
  : html`<button type="button" part="base" class="header-item"
           aria-current=${ifDefined(this.current ? 'page' : undefined)}><slot part="label" class="header-item__label"></slot></button>`;
```
```css
/* header-item.styles.ts (analogo in header.styles.ts per ::slotted(a[aria-current='page'])) */
.header-item[aria-current] { box-shadow: inset 0 -3px 0 var(--color); }
@media (forced-colors: active) {
  .header-item[aria-current] { outline: 2px solid Highlight; outline-offset: -2px; }
}
```
