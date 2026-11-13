## Rating (`sl-rating` – src/components/rating/rating.component.ts)
**Pattern APG di riferimento:** APG Slider pattern (esempio "Rating Slider")
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 2 · Bassa 4 · Suggerimento 2

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<div role="slider">` (r. 271) con `aria-valuenow/min/max` (r. 275-277), `aria-disabled`, `aria-readonly` (supportato su slider in ARIA 1.2) ✅. Simboli `role="presentation"`; i figli di `slider` sono comunque presentazionali. |
| 2 | Nome, descrizione, stato | ⚠️ | Nome solo da `label` → `aria-label`; se vuota produce `aria-label=""` (SL-RATING-03). Nessun `aria-valuetext` ("3 stelle su 5") (SL-RATING-02). Icone di default `sl-icon` senza label → `aria-hidden` ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Ruolo nel shadow root: `aria-labelledby`/`aria-describedby` dal light DOM impossibili; `aria-label` sull'host non usato (ma esiste `label`). Host senza `tabindex`, un solo tab stop ✅. |
| 4 | Tastiera e focus | ⚠️ | ←/→/↑/↓ (RTL-aware), Shift+freccia, Home/End (r. 146-180) ✅; manca PageUp/PageDown (opzionale APG). `:focus-visible` con `outline: var(--sl-focus-ring)` (styles r. 24-27) ✅. In `readonly` il controllo esce dal tab order (SL-RATING-04). |
| 5 | Form e validazione | N/A | Non è un form control (nessun `name`/FormControlController). |
| 6 | Live region | N/A | Il cambio di valore è annunciato tramite `aria-valuenow` sul controllo focalizzato. |
| 7 | Aspetti visivi | ❌ | Light: stelle attive amber-500 2.15:1, inattive neutral-300 1.56:1, attive vs inattive 1.38:1, stessa forma → valore percepibile quasi solo dal colore (SL-RATING-01). Target 23.2px (SL-RATING-05). `forced-colors` solo per simboli interi (SL-RATING-06). Hover `scale` senza reduced-motion (SHARED-05). |
| 8 | API pubblica a11y | ⚠️ | `label` ✅; mancano `aria-valuetext`/formatter, default localizzato e warning dev. |
| 9 | Documentazione e test | ⚠️ | Tutti gli esempi docs hanno `label` ✅; un test axe sullo stato base; nessun axe readonly/disabled né asserzioni su `aria-value*` (SL-RATING-07). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-RATING-01 | Alta | 7 | Tema light: simboli attivi `--sl-color-amber-500` 2.15:1 su bianco, inattivi `neutral-300` 1.56:1, attivo vs inattivo 1.38:1; l'icona è la stessa (`star-fill`) per entrambi gli stati → il valore è veicolato solo dal colore con contrasto insufficiente. Dark: attivi 8.0:1 ✅ ma inattivi 1.64:1 (il massimo non è percepibile). | src/components/rating/rating.styles.ts:5-6, 34, 43-46; src/components/rating/rating.component.ts:74 | WCAG 1.4.1, 1.4.11 | Default `--symbol-color-active: var(--sl-color-amber-600/700)` (≥3:1) e `--symbol-color: var(--sl-color-neutral-400/500)`; oppure simbolo inattivo diverso (`star` outline) passando lo stato a `getSymbol(value, active)`. |
| SL-RATING-02 | Media | 2/8 | Nessun `aria-valuetext`: lo screen reader annuncia "3" (o "2.5") senza unità né massimo; con simboli value-based (emoji in docs) il significato del valore è perso. Nessuna property o chiave di localizzazione per il testo. | src/components/rating/rating.component.ts:271-277 | APG Slider (Rating Slider usa `aria-valuetext`); WCAG 1.3.1, 4.1.2 | `aria-valuetext=${this.valueText ?? this.localize.term('ratingValue', this.value, this.max)}` + property `valueTextFormatter` e nuova chiave in `src/translations/*`. |
| SL-RATING-03 | Media | 2/8 | `aria-label=${this.label}` senza `ifDefined`: con `label` vuota (default) l'attributo è `aria-label=""` → slider senza nome; nessun default localizzato né warning dev. | src/components/rating/rating.component.ts:48-49, 272 | WCAG 4.1.2 | `aria-label=${ifDefined(this.label \|\| undefined)}` + warning dev se assente; opz. `aria-labelledby` interno a un label visibile. |
| SL-RATING-04 | Bassa | 4 | `readonly` imposta `tabindex="-1"`: il valore di una valutazione in sola lettura non è raggiungibile con Tab (APG: gli elementi readonly restano focusabili). Per la sola visualizzazione `role="slider"` non è ideale. | src/components/rating/rating.component.ts:278 | APG Slider / Developing a Keyboard Interface (readonly focusable); WCAG 2.1.1 | `tabindex=${this.disabled ? '-1' : '0'}`; oppure in readonly `role="img"` + `aria-label="Valutazione 3 su 5"`. |
| SL-RATING-05 | Bassa | 7 | Target size: ogni simbolo è `--symbol-size` 1.2rem (19.2px) + padding `--sl-spacing-3x-small` 2px per lato ≈ 23.2×23.2px, adiacenti senza spazio. | src/components/rating/rating.styles.ts:7-8, 39-41 | WCAG 2.5.8 | `--symbol-size: 1.25rem` e `--symbol-spacing: var(--sl-spacing-2x-small)` (≥24px). |
| SL-RATING-06 | Bassa | 7 | `forced-colors` gestisce solo `.rating__symbol--active` (SelectedItem): la parte piena dei simboli parziali (`.rating__partial--filled`) e lo stato hover non sono coperti; transizione `scale` dell'hover non disattivata con reduced motion (SHARED-05). | src/components/rating/rating.styles.ts:58-65, 85-90 | WCAG 1.4.11 (forced colors), 2.3.3 | Aggiungere `.rating__partial--filled { color: SelectedItem }` nella media query e `@media (prefers-reduced-motion: reduce) { .rating__symbol { transition: none } }`. |
| SL-RATING-07 | Bassa | 9 | Test: un solo `to.be.accessible()` (stato base); nessun axe su readonly/disabled/precision, nessuna asserzione su `aria-valuenow`, `aria-readonly`, `tabindex`. Docs senza note su `aria-valuetext` e su `getSymbol` (contenuto ignorato dagli AT). | src/components/rating/rating.test.ts:9-12, 25-39 | Qualità | Test axe per gli stati e asserzioni ARIA; sezione Accessibility nei docs. |
| SL-RATING-08 | Suggerimento | 2 | Il rating non ha label visibile: `label` è solo `aria-label`. Va affiancato da testo visibile dal consumer (consumer). | src/components/rating/rating.component.ts:48-49 | WCAG 3.3.2, 2.5.3 | Documentare; opz. slot/property per label visibile collegata via `aria-labelledby`. |
| SL-RATING-09 | Suggerimento | 4 | Click/touch in `readonly` emettono comunque `sl-change` (`setValue` esce ma `emit` è eseguito); manca PageUp/PageDown. | src/components/rating/rating.component.ts:128-135, 209-213 | APG Slider (PageUp/PageDown opzionali) | Emettere `sl-change` solo se il valore cambia; mappare PageUp/PageDown a ±1. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` → `aria-label` | Sì | Parziale | `aria-label=""` se vuota (SL-RATING-03) |
| `aria-valuetext` / formatter | No | — | Da aggiungere + chiave i18n |
| `aria-valuenow/min/max` | Sì (interni) | Sì | min fisso 0 |
| `readonly` → `aria-readonly` | Sì | Sì | Non focusabile (SL-RATING-04) |
| `disabled` → `aria-disabled` | Sì | Sì | tabindex -1 ✅ |
| `aria-labelledby` / `aria-describedby` | No | — | Riferimenti light DOM impossibili |
| `getSymbol` | Sì | — | Contenuto presentazionale |

### Fix proposti
```ts
// rating.component.ts
import { ifDefined } from 'lit/directives/if-defined.js';

/** Testo per gli AT; di default "{value} su {max}" localizzato. */
@property({ attribute: false }) valueTextFormatter?: (value: number, max: number) => string;

render() {
  const valueText = this.valueTextFormatter
    ? this.valueTextFormatter(this.value, this.max)
    : `${this.value} / ${this.max}`; // sostituire con this.localize.term('ratingValue', this.value, this.max)
  return html`<div
      part="base"
      role="slider"
      aria-label=${ifDefined(this.label || undefined)}
      aria-valuetext=${valueText}
      aria-valuenow=${this.value}
      aria-valuemin="0"
      aria-valuemax=${this.max}
      aria-readonly=${this.readonly ? 'true' : 'false'}
      aria-disabled=${this.disabled ? 'true' : 'false'}
      tabindex=${this.disabled ? '-1' : '0'}
      …>`;
}
```
```css
/* rating.styles.ts */
:host {
  --symbol-color: var(--sl-color-neutral-400);
  --symbol-color-active: var(--sl-color-amber-600);
  --symbol-size: 1.25rem;
  --symbol-spacing: var(--sl-spacing-2x-small);
}
@media (forced-colors: active) {
  .rating__symbol--active, .rating__partial--filled { color: SelectedItem; }
}
@media (prefers-reduced-motion: reduce) {
  .rating__symbol { transition: none; }
}
```

### Non verificabile
- Contrasto di `--sl-color-amber-600/700` (non presente nella tabella shared: calcolarlo prima di adottarlo) e dei colori custom (`--symbol-color-active: #ff4136` negli esempi docs, dipende dal consumer).
- Annuncio del valore con precisione 0.5 e dell'aria-valuetext proposto con NVDA/JAWS/VoiceOver.
