## Resize Observer (`<sl-resize-observer>` – src/components/resize-observer/resize-observer.component.ts)
**Pattern APG di riferimento:** N/A (utility non visuale, wrapper di `ResizeObserver`)
**Esito sintetico:** ✅ Conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 0 · Suggerimento 1

Componente puramente tecnico. Host con `display: contents` (styles r. 4-6), solo `<slot>` (r. 81-83), emette `sl-resize` (r. 30-32). Non ha semantica, non è focusabile e non ha resa visiva, quindi non ha impatto diretto sull'a11y. Il componente non ha alcun test (shared §9).

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Nessun ruolo. `display: contents` è innocuo su un host privo di semantica. |
| 2 | Nome, descrizione, stato | N/A | — |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Contenuto in light DOM, riferimenti ID preservati. Un `role`/`aria-*` messo dal consumer sull'host è un uso scorretto (consumer). |
| 4 | Tastiera e focus | N/A | — |
| 5 | Form e validazione | N/A | `disabled` (r. 26) controlla solo l'observer. |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | N/A | Nessuna resa visiva. Il componente è utile per layout responsivi (reflow 1.4.10), ma la logica resta del consumer. |
| 8 | API pubblica a11y | N/A | Nessuna API ARIA necessaria. |
| 9 | Documentazione e test | ❌ | Nessun file `resize-observer.test.ts` (SL-RESIZE-OBSERVER-01). Le docs non richiedono note a11y. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-RESIZE-OBSERVER-01 | Suggerimento | 9 | Il componente non ha nessun test: non c'è neppure uno smoke test axe sul wrapper `display: contents`. | src/components/resize-observer/ (presenti solo component, styles, index; manca `resize-observer.test.ts`) | Buona pratica | Creare un test con render, `to.be.accessible()` ed emissione di `sl-resize`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| — | — | — | Utility non visuale: nessuna API ARIA necessaria. |

### Fix proposti
```ts
// src/components/resize-observer/resize-observer.test.ts
import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-resize-observer>', () => {
  it('passes accessibility test', async () => {
    const el = await fixture(html`<sl-resize-observer><div>Box</div></sl-resize-observer>`);
    await expect(el).to.be.accessible();
  });
});
```

### Non verificabile
- Nessun aspetto rilevante.
