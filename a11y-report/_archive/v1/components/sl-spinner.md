## Spinner (`<sl-spinner>` – src/components/spinner/spinner.component.ts)
**Pattern APG di riferimento:** WAI-ARIA 1.2 `role="progressbar"` indeterminato (senza `aria-valuenow`); per l'annuncio del caricamento: `aria-busy` sul contenitore + live region `role="status"`.
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 2 · Bassa 2 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<svg role="progressbar">` senza `aria-valuenow` (r. 28) = progressbar indeterminato ✅. |
| 2 | Nome, descrizione, stato | ⚠️ | Nome localizzato `localize.term('loading')` (r. 28, it "Caricamento") ✅, ma non sovrascrivibile né contestualizzabile ("Caricamento documenti"). Nessun modo di renderlo decorativo quando il contesto già comunica il caricamento (es. dentro `sl-button loading`, button.component.ts:296). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID. `aria-label` sull'host resta sull'host senza ruolo (ignorato). |
| 4 | Tastiera e focus | N/A | Non interattivo; SVG non focusabile. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Lo spinner non è live region: quando compare/scompare lo SR non annuncia nulla se il consumer non usa `aria-busy`/`role="status"`; docs non lo spiegano. |
| 7 | Aspetti visivi | ⚠️ | Indicatore primary-600 su bianco 6.21/8.03 ✅ 1.4.11. `animation: spin … infinite` senza `prefers-reduced-motion` (r. 46). Nessuna regola `forced-colors` (stroke SVG: NON VERIFICABILE). |
| 8 | API pubblica a11y | ⚠️ | Nessuna property `label`/`decorative`. |
| 9 | Documentazione e test | ⚠️ | Test axe + ruolo (test r. 7-15) ✅ (titolo del test dice "status" ma verifica `progressbar`). Docs senza indicazioni a11y. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-SPINNER-01 | Media | API / Nome | Nome fisso "Loading"/"Caricamento" non sovrascrivibile né disattivabile: con più spinner nella pagina gli SR sentono N "Caricamento" senza contesto; quando lo spinner è annidato in un controllo che ha già un nome/stato (`sl-button loading`) il ruolo `progressbar` aggiunge un elemento ridondante. | src/components/spinner/spinner.component.ts:28 `role="progressbar" aria-label=${this.localize.term('loading')}` | WCAG 2.4.6; 4.1.2; SHARED-06 | Property `label` (default `term('loading')`) e `decorative` (boolean) che rende `aria-hidden="true"` senza ruolo. |
| SL-SPINNER-02 | Media | Live region | La comparsa dello spinner non viene annunciata: non è una live region e i docs non indicano di impostare `aria-busy="true"` sull'area aggiornata e/o un messaggio `role="status"` (consumer + docs). | src/components/spinner/spinner.component.ts:26-33; docs/pages/components/spinner.md:1-30 | WCAG 4.1.3 Status Messages | Documentare il pattern; opzionale property `announce` che rende il nome dentro un `role="status"` presente dal primo render. |
| SL-SPINNER-03 | Bassa | Aspetti visivi | Rotazione infinita senza `prefers-reduced-motion`. | src/components/spinner/spinner.styles.ts:46 `animation: spin var(--speed) linear infinite;` | WCAG 2.3.3 (AAA); 2.2.2 (eccezione caricamento, buona pratica) | `@media (prefers-reduced-motion: reduce) { .spinner__indicator { animation-duration: calc(var(--speed) * 4); } }` |
| SL-SPINNER-04 | Bassa | Aspetti visivi | Nessuna regola `forced-colors`: track (`color-mix` 25%) e indicatore SVG potrebbero non essere distinguibili in alto contrasto. | src/components/spinner/spinner.styles.ts:11-12, 37-47 | WCAG 1.4.11; forced colors | `@media (forced-colors: active) { .spinner__track { stroke: GrayText; } .spinner__indicator { stroke: Highlight; } }` |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | No | — | Oggi solo default localizzato `loading` |
| `decorative` / `aria-hidden` | No | — | Da aggiungere per uso dentro controlli già etichettati |
| `role` | Fisso `progressbar` | Sì | Corretto (indeterminato) |

### Fix proposti
```ts
import { nothing } from 'lit';
@property() label = '';
/** Nasconde lo spinner agli AT quando il contesto comunica già lo stato di caricamento. */
@property({ type: Boolean, reflect: true }) decorative = false;

render() {
  return html`
    <svg part="base" class="spinner"
      role=${this.decorative ? nothing : 'progressbar'}
      aria-hidden=${this.decorative ? 'true' : nothing}
      aria-label=${this.decorative ? nothing : this.label || this.localize.term('loading')}>
      <circle class="spinner__track"></circle>
      <circle class="spinner__indicator"></circle>
    </svg>`;
}
```
```css
@media (prefers-reduced-motion: reduce) {
  .spinner__indicator { animation-duration: calc(var(--speed) * 4); }
}
@media (forced-colors: active) {
  .spinner__track { stroke: GrayText; }
  .spinner__indicator { stroke: Highlight; }
}
```

### Non verificabile
- Annuncio effettivo di un `progressbar` SVG inserito dinamicamente (NVDA/JAWS/VoiceOver).
- Resa in Windows High Contrast.
- Contrasto con `--indicator-color` personalizzato.
