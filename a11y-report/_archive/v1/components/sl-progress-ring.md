## Progress Ring (`<sl-progress-ring>` – src/components/progress-ring/progress-ring.component.ts)
**Pattern APG di riferimento:** WAI-ARIA 1.2 `role="progressbar"` (solo determinato: il componente non ha stato indeterminate).
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 4 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="progressbar"` con `aria-valuemin/max/now` (r. 64-69) ✅; `value` non vincolato a 0-100. SVG decorativo dentro un ruolo con figli presentazionali (ok). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome = `label` o default localizzato `progress` (r. 65) ✅. Nessun `aria-valuetext`; `aria-describedby="label"` (r. 66) punta allo `<slot id="label">`: il testo della label (di solito "50%") viene letto due volte o per nulla a seconda del browser. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Riferimento ID allo slot nello stesso shadow root (ok in teoria), ma la descrizione dipende dalla risoluzione del contenuto slottato → NON VERIFICABILE. `aria-labelledby` esterno impossibile (SHARED). |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Come progress-bar: annuncio di esito a carico del consumer (non documentato). |
| 7 | Aspetti visivi | ⚠️ | Indicatore primary-600 su track neutral-200 4.96/5.93 ✅ 1.4.11 (track 4px). Transizione `stroke-dashoffset` 0.35s non disattivata con reduced motion (SHARED-05). Nessuna regola `forced-colors`: track e indicatore SVG possono risultare indistinguibili in alto contrasto → NON VERIFICABILE. Colori/size del consumer → NON VERIFICABILE. |
| 8 | API pubblica a11y | ⚠️ | `label` ✅; mancano `value-text`. |
| 9 | Documentazione e test | ⚠️ | Test axe presenti; test "ariaLabel" (test r. 41-48) usa un attributo ignorato (falsa copertura). Docs sezione "Labels" ✅. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-PROGRESS-RING-01 | Media | Nome / API | Nessuna property `aria-valuetext`; la label visiva viene collegata come `aria-describedby` a uno `<slot>`: con la label tipica "50%" la percentuale è annunciata due volte (valore + descrizione); testi come "3 di 10" non diventano il valore. | src/components/progress-ring/progress-ring.component.ts:66 `aria-describedby="label"`; :77 `<slot id="label" …>` | WCAG 1.3.1; 4.1.2; WAI-ARIA aria-valuetext | Property `value-text` → `aria-valuetext`; rimuovere `aria-describedby` verso lo slot (o renderlo opzionale). |
| SL-PROGRESS-RING-02 | Bassa | Semantica | `value` non vincolato: `aria-valuenow` può superare `aria-valuemax` e il calcolo del dashoffset diventa negativo. | src/components/progress-ring/progress-ring.component.ts:37, 53, 69-70 | WAI-ARIA 1.2 | `clamp(this.value, 0, 100)`. |
| SL-PROGRESS-RING-03 | Bassa | Aspetti visivi | Nessuna media query `forced-colors`: in alto contrasto `stroke` di track e indicatore possono essere forzati allo stesso colore e l'avanzamento non si distingue. | src/components/progress-ring/progress-ring.styles.ts:40-53 (assenza di `@media (forced-colors: active)`) | WCAG 1.4.11; forced colors | `@media (forced-colors: active) { .progress-ring__track { stroke: GrayText; } .progress-ring__indicator { stroke: Highlight; } }` |
| SL-PROGRESS-RING-04 | Bassa | Aspetti visivi | Transizione dell'indicatore non disattivata con `prefers-reduced-motion`. | src/components/progress-ring/progress-ring.styles.ts:49-50 | WCAG 2.3.3 (AAA); SHARED-05 | `@media (prefers-reduced-motion: reduce) { .progress-ring__indicator { transition: none; } }` |
| SL-PROGRESS-RING-05 | Bassa | Test | Test "when provided a ariaLabel" imposta `ariaLabel` sull'host, ignorato dal componente: verifica solo il default. | src/components/progress-ring/progress-ring.test.ts:41-48 | Copertura test | Usare `label` e asserire `aria-label`; test per `value-text`. |
| SL-PROGRESS-RING-06 | Suggerimento | Semantica | Manca uno stato indeterminate (uso frequente come loader circolare): i consumer ripiegano su `sl-spinner` o forzano `value`. | src/components/progress-ring/progress-ring.component.ts:36-40 | WAI-ARIA progressbar | Documentare l'uso di `sl-spinner` per l'indeterminato o aggiungere `indeterminate` (senza `aria-valuenow`). |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` → `aria-label` | Sì | Sì | Default localizzato ✅ |
| `aria-valuenow/min/max` | Sì | Parziale | Nessun clamp |
| `value-text` | No | — | Da aggiungere |
| `aria-describedby` | Interno fisso | Discutibile | Punta allo slot (r. 66) |

### Fix proposti
```ts
@property({ attribute: 'value-text' }) valueText = '';

render() {
  const value = clamp(this.value, 0, 100);
  return html`
    <div part="base" class="progress-ring" role="progressbar"
      aria-label=${this.label || this.localize.term('progress')}
      aria-valuemin="0" aria-valuemax="100" aria-valuenow=${value}
      aria-valuetext=${this.valueText || nothing}
      style="--percentage: ${value / 100}">
      <svg class="progress-ring__image" aria-hidden="true">…</svg>
      <slot part="label" class="progress-ring__label"></slot>
    </div>`;
}
```
```css
@media (forced-colors: active) {
  .progress-ring__track { stroke: GrayText; }
  .progress-ring__indicator { stroke: Highlight; }
}
@media (prefers-reduced-motion: reduce) {
  .progress-ring__indicator { transition: none; }
}
```

### Non verificabile
- Risoluzione di `aria-describedby` verso uno `<slot>` (contenuto slottato) nei diversi browser/SR.
- Resa SVG in Windows High Contrast.
- Contrasto con `--indicator-color`/`--track-color` personalizzati.
