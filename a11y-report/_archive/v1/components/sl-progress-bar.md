## Progress Bar (`<sl-progress-bar>` – src/components/progress-bar/progress-bar.component.ts)
**Pattern APG di riferimento:** WAI-ARIA 1.2 `role="progressbar"` (range widget non interattivo; per indeterminate `aria-valuenow` omesso); APG Meter/Range (attributi value*).
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 2 · Bassa 4 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="progressbar"` con `aria-valuemin="0"`/`aria-valuemax="100"` (r. 48-52) ✅; in indeterminate `aria-valuenow=0` (r. 53) ❌; `value` non vincolato a 0-100. |
| 2 | Nome, descrizione, stato | ⚠️ | Nome: `label` o default localizzato `localize.term('progress')` (r. 50) ✅. Manca `aria-valuetext`: il contenuto dello slot (es. "3 di 10 file") non è esposto perché `progressbar` ha figli presentazionali. Stato busy non esposto. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il ruolo è sul `div` interno: impossibile `aria-labelledby` verso un titolo esterno (SHARED); `title` dell'host copiato sull'interno (r. 49) → doppio tooltip host + interno. |
| 4 | Tastiera e focus | N/A | Non interattivo, non focusabile (corretto). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Il progressbar non è live region (corretto per APG); il completamento/esito deve essere annunciato dal consumer, docs non lo indicano. |
| 7 | Aspetti visivi | ⚠️ | Indicatore primary-600 su track neutral-200 4.96/5.93, su bianco 6.21/8.03 ✅ 1.4.11. Label `primary-contrast` su primary-600 6.21 ✅, ma `font-size: 12px` fisso (styles r. 25) e `overflow:hidden` + `line-height: var(--height)`: con text spacing/zoom testo la label si taglia. Indeterminate `animation … infinite` senza `prefers-reduced-motion` (r. 43); `transition: 400ms width` (SHARED-05). `forced-colors` gestito (r. 50-60) ✅. Colori `--indicator-color/--track-color` del consumer → NON VERIFICABILE. |
| 8 | API pubblica a11y | ⚠️ | `label` ✅ (riflessa su `aria-label` interno). Mancano `value-text` (aria-valuetext), `min`/`max`, `aria-labelledby` utilizzabile. |
| 9 | Documentazione e test | ⚠️ | 5 test axe (anche indeterminate) ✅, ma i test "ariaLabel"/"ariaLabelledBy" (test r. 62-84) usano attributi che il componente ignora: falsa copertura. Docs: sezione "Labels" ✅, nulla su indeterminate/valuetext. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-PROGRESS-BAR-01 | Media | Semantica / Stato | In stato `indeterminate` viene esposto `aria-valuenow="0"`: gli SR annunciano "0%" invece di un avanzamento indeterminato. | src/components/progress-bar/progress-bar.component.ts:53 `aria-valuenow=${this.indeterminate ? 0 : this.value}` | WCAG 4.1.2; WAI-ARIA 1.2 progressbar ("authors SHOULD omit aria-valuenow" se indeterminato) | `aria-valuenow=${this.indeterminate ? nothing : clamped}` (e omettere anche `aria-valuetext`). |
| SL-PROGRESS-BAR-02 | Media | Nome / API | Nessuna property per `aria-valuetext`: il testo dello slot (es. "Caricamento 3 di 10 file", "2 min rimanenti") non viene letto perché i figli di `progressbar` sono presentazionali; l'AT annuncia solo la percentuale. | src/components/progress-bar/progress-bar.component.ts:43-57 (nessun `aria-valuetext`; slot r. 56) | WCAG 1.3.1; 4.1.2; WAI-ARIA aria-valuetext | Property `value-text` → `aria-valuetext=${ifDefined(this.valueText || undefined)}`. |
| SL-PROGRESS-BAR-03 | Bassa | Semantica | `value` non è vincolato a 0-100: valori fuori range producono `aria-valuenow` oltre `aria-valuemax` e larghezze > 100%. | src/components/progress-bar/progress-bar.component.ts:33, 53, 55 | WAI-ARIA 1.2 (valuenow tra min e max) | `const v = clamp(this.value, 0, 100)` usato sia per aria sia per width. |
| SL-PROGRESS-BAR-04 | Bassa | Aspetti visivi | Animazione indeterminate infinita senza `prefers-reduced-motion`. | src/components/progress-bar/progress-bar.styles.ts:41-44 `animation: indeterminate 2.5s infinite …` | WCAG 2.3.3 (AAA); 2.2.2 (eccezione caricamento, buona pratica) | `@media (prefers-reduced-motion: reduce) { .progress-bar--indeterminate .progress-bar__indicator { animation-duration: 10s; } }` o barra statica a strisce. |
| SL-PROGRESS-BAR-05 | Bassa | Aspetti visivi | Label interna con `font-size: 12px` fisso, `white-space: nowrap`, `overflow: hidden` e altezza = `--height` (1rem): non scala con la dimensione del testo e si taglia con spaziatura testo aumentata o valori bassi. | src/components/progress-bar/progress-bar.styles.ts:22-32 | WCAG 1.4.4; 1.4.12 | `font-size: var(--sl-font-size-x-small)` (rem) e `min-height` invece di `height` fissa quando c'è label; documentare la label esterna. |
| SL-PROGRESS-BAR-06 | Bassa | Test | I test "when provided a ariaLabel/ariaLabelledBy" impostano attributi `ariaLabel`/`ariaLabelledBy` sull'host che il componente non legge: il nome resta "Progress", i test passano senza verificare nulla. | src/components/progress-bar/progress-bar.test.ts:62-84 `<sl-progress-bar ariaLabel="Labelled Progress Ring" …>` | Copertura test (4.1.2) | Sostituire con `label="…"` e asserire `aria-label` sul base; aggiungere test indeterminate senza `aria-valuenow`. |
| SL-PROGRESS-BAR-07 | Suggerimento | Live region / Docs | Docs non indicano di annunciare l'esito (completato/errore) con una live region del consumer, né di usare `aria-busy` sull'area in caricamento; `title` host duplicato sull'interno. | docs/pages/components/progress-bar.md:32-55; progress-bar.component.ts:49 | WCAG 4.1.3 | Sezione "Accessibilità" con esempio `aria-busy` + `role="status"`; valutare la rimozione del passthrough `title`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` → `aria-label` | Sì | Sì | Default localizzato `progress` ✅ (r. 50) |
| `aria-valuenow/min/max` | Sì (interni) | Parziale | `valuenow=0` in indeterminate; nessun clamp |
| `value-text` (`aria-valuetext`) | No | — | Da aggiungere |
| `aria-labelledby` | No | No | ID cross-root non risolvibili (SHARED); usare `label` |
| `title` | Sì | Sì | Copiato dall'host all'interno: doppio tooltip |

### Fix proposti
```ts
import { nothing } from 'lit';
import { clamp } from '../../internal/math.js';

/** Testo alternativo del valore, es. "3 di 10 file". */
@property({ attribute: 'value-text' }) valueText = '';

render() {
  const value = clamp(this.value, 0, 100);
  return html`
    <div part="base" class="progress-bar…" role="progressbar"
      aria-label=${this.label || this.localize.term('progress')}
      aria-valuemin="0" aria-valuemax="100"
      aria-valuenow=${this.indeterminate ? nothing : value}
      aria-valuetext=${!this.indeterminate && this.valueText ? this.valueText : nothing}>
      <div part="indicator" class="progress-bar__indicator" style=${styleMap({ width: `${value}%` })}>
        ${!this.indeterminate ? html`<slot part="label" class="progress-bar__label"></slot>` : ''}
      </div>
    </div>`;
}
```
```css
.progress-bar__indicator { font-size: var(--sl-font-size-x-small); }
@media (prefers-reduced-motion: reduce) {
  .progress-bar__indicator { transition: none; }
  .progress-bar--indeterminate .progress-bar__indicator { animation-duration: 10s; }
}
```

### Non verificabile
- Annuncio reale di indeterminate/valuetext con NVDA/JAWS/VoiceOver.
- Contrasto con `--indicator-color`, `--track-color`, `--label-color` personalizzati dal consumer.
