## Badge (`<sl-badge>` – src/components/badge/badge.component.ts)
**Pattern APG di riferimento:** nessun pattern APG specifico; WAI-ARIA 1.2 `role="status"` (live region) solo per contatori dinamici.
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 3 · Bassa 1 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<span role="status">` fisso su ogni badge (r. 35), anche statici ("Beta", "Nuovo"): ogni istanza è una live region. |
| 2 | Nome, descrizione, stato | ⚠️ | Il testo slottato è l'unico contenuto; nessun modo di aggiungere contesto per SR (es. "30" → "30 richieste non lette") se non con markup del consumer. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Nessun riferimento ID. `aria-label` sull'host resta su un elemento senza ruolo (ignorato); il ruolo `status` è nel shadow root e non è sovrascrivibile. Calcolo del nome del `sl-button` che contiene il badge (testo di un `role=status` annidato) → NON VERIFICABILE. |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Live region presente dal primo render ✅ (aggiornamenti del conteggio annunciati), ma non disattivabile per badge statici e annuncia il solo numero senza contesto. |
| 7 | Aspetti visivi | ⚠️ | Contrasti testo/fill calcolati: primary 6.21/8.03, accent 5.58/7.07, success 4.60/9.99, neutral 6.63/5.70, warning 4.59/11.25, danger 4.61/4.78 (light/dark) ✅ (success/warning/danger al limite). `font-size: max(12px, 0.75em)` ✅. `pulse` = `animation: pulse 1.5s infinite` senza `prefers-reduced-motion` ❌. Variante distinta solo dal colore (consumer). `forced-colors`: fill sostituito, il bordo `1px` resta ✅; pulse (box-shadow) sparisce (solo enfasi). |
| 8 | API pubblica a11y | ⚠️ | Nessuna property per label/contesto o per disattivare la live region. |
| 9 | Documentazione e test | ⚠️ | Test axe su tutte le varianti ma con `ignoredRules = ['color-contrast']` (test r. 5-7) giustificato da un commento non più vero; docs senza indicazioni a11y (contatore senza contesto, pulse). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-BADGE-01 | Media | Semantica / Live region | `role="status"` fisso su ogni badge: badge statici (etichette, stati in tabella) diventano decine di live region; non c'è modo di disattivarlo né di scegliere quando un badge è un contatore dinamico. | src/components/badge/badge.component.ts:32-36 `<span part="base" … role="status">` | WCAG 4.1.3; WAI-ARIA 1.2 status (uso improprio) | Property `live` (boolean, default `false` o `true` per retro-compatibilità) che rende `role=${this.live ? 'status' : nothing}`; documentare quando usarla. |
| SL-BADGE-02 | Media | Aspetti visivi | `pulse` anima all'infinito (`1.5s infinite`) senza media query `prefers-reduced-motion` né possibilità di pausa. | src/components/badge/badge.styles.ts:66-68 `animation: pulse 1.5s infinite;`; :94-104 | WCAG 2.2.2 Pause, Stop, Hide; 2.3.3 (AAA) | `@media (prefers-reduced-motion: reduce) { .badge--pulse { animation: none; } }`; limitare le iterazioni (es. `3`) o documentare l'uso temporaneo. |
| SL-BADGE-03 | Media | Nome / Aspetti visivi | Il badge espone solo il testo slottato: un contatore "8" in un bottone "Warnings" o un badge colorato senza testo significativo trasmette il significato solo con il colore/posizione; il componente non offre un testo alternativo/contesto per SR (componente + consumer). | src/components/badge/badge.component.ts:30-39 (solo `<slot>`); docs/pages/components/badge.md sezione "With Buttons" (`<sl-badge variant="warning" pill>8</sl-badge>`) | WCAG 1.4.1; 1.3.1 | Property `label` resa come testo sr-only (o `aria-label` sul `span` se ha ruolo), es. `label="8 avvisi"`; docs: richiedere testo che non dipenda dal colore. |
| SL-BADGE-04 | Bassa | Test | I test axe ignorano `color-contrast` con il commento "default badge background just misses AA contrast", ma con i token attuali tutte le varianti superano 4.5:1: la regola disattivata nasconde regressioni future. | src/components/badge/badge.test.ts:5-7 `const ignoredRules = ['color-contrast'];` | WCAG 1.4.3 (copertura test) | Rimuovere `ignoredRules`; aggiungere test per `live` off/on. |
| SL-BADGE-05 | Suggerimento | Aspetti visivi | success/warning/danger in light sono al limite (4.60/4.59/4.61): qualsiasi ritocco dei token li porta sotto soglia; `forced-colors` senza regola dedicata. | src/components/badge/badge.styles.ts:40-58 | WCAG 1.4.3 | Monitorare con test di contrasto sui token; opzionale `@media (forced-colors: active) { .badge { border-color: CanvasText; } }`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `live` (on/off live region) | No | — | Oggi `role="status"` sempre (r. 35) |
| `label` (contesto sr-only) | No | — | Vedi SL-BADGE-03 |
| `aria-label` sull'host | No | No | Resta sull'host senza ruolo: ignorato |
| `role` | No | — | Fisso `status`, non sovrascrivibile |

### Fix proposti
```ts
import { nothing } from 'lit';
/** Il badge è un contatore dinamico da annunciare (role="status"). */
@property({ type: Boolean, reflect: true }) live = false;
/** Testo per gli screen reader che sostituisce/completa il contenuto visivo (es. "8 avvisi"). */
@property() label?: string;

render() {
  return html`
    <span part="base" class="badge …" role=${this.live ? 'status' : nothing}>
      <slot aria-hidden=${this.label ? 'true' : nothing}></slot>
      ${this.label ? html`<span class="sr-only">${this.label}</span>` : nothing}
    </span>`;
}
```
```css
@media (prefers-reduced-motion: reduce) {
  .badge--pulse { animation: none; }
}
```

### Non verificabile
- Nome accessibile risultante di un `sl-button` che contiene un badge con `role="status"` (inclusione o meno del testo nel nome) e verbosità degli annunci su NVDA/JAWS/VoiceOver: test con screen reader.
- Contrasto di badge con colori personalizzati dal consumer via `::part(base)`.
