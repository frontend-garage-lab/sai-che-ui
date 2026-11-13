## Animation (`<sl-animation>` – src/components/animation/animation.component.ts)
**Pattern APG di riferimento:** N/A (utility, Web Animations API); WCAG 2.2.2 Pause, Stop, Hide; 2.3.3 Animation from Interactions; C39 (`prefers-reduced-motion`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 2 · Bassa 1 · Suggerimento 0

Default corretto: `play = false` (r. 38), quindi nessuna animazione parte senza un'azione del consumer. Una volta avviata, però, l'animazione ignora `prefers-reduced-motion`. Con il default `iterations = Infinity` va in loop senza fine, e il componente non offre nessun aiuto per fermarla.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Host con `display: contents` (styles r. 4-6) e nessun ruolo: non altera l'albero di accessibilità. Il primo elemento slottato mantiene la propria semantica. |
| 2 | Nome, descrizione, stato | N/A | Non ha contenuto proprio. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Solo `<slot>` (r. 219), quindi il contenuto resta in light DOM. `display: contents` sull'host è innocuo perché l'host non ha semantica. |
| 4 | Tastiera e focus | N/A | Nessun elemento interattivo proprio. Il focus dell'elemento animato resta a carico del consumer. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | `element.animate(...)` (r. 129-138) senza controllare `prefersReducedMotion()` (disponibile in src/internal/animate.ts:36) → SL-ANIMATION-01. `iterations = Infinity` (r. 65) → SL-ANIMATION-02. Lampeggi (2.3.1): preset come `flash`/`heartBeat` dipendono da `duration`/`playbackRate` scelti dal consumer → NON VERIFICABILE. |
| 8 | API pubblica a11y | ⚠️ | Mancano un'opzione per il reduced motion (es. `ignore-reduced-motion` come opt-out) e un riferimento al pattern di pausa. |
| 9 | Documentazione e test | ⚠️ | Test axe presente (test r. 15-19) e test "non parte di default" (r. 22-29) ✅. Nessun test per reduced motion. Le docs mostrano quasi solo esempi `play` in loop infinito (SL-ANIMATION-03). Nota non a11y: `@watch` osserva `'iterationsStart'` (r. 171), ma la property si chiama `iterationStart`. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-ANIMATION-01 | Media | 7 | Le animazioni (bounce, flip, jello, rotazioni…) partono anche con `prefers-reduced-motion: reduce`. Le altre animazioni del DS passano da `animateTo`, che azzera la durata (shared §6); questo componente chiama invece `element.animate()` direttamente. | src/components/animation/animation.component.ts:129-138 `this.animation = element.animate(keyframes, {...})` | WCAG 2.3.3 (AAA), C39; supporto a 2.2.2 | Con reduced motion, di default non riprodurre (o `duration: 0` + `finish()`) ed emettere comunque `sl-finish`; aggiungere l'opt-out `ignore-reduced-motion` per animazioni essenziali. |
| SL-ANIMATION-02 | Media | 7 / 8 | Default `iterations = Infinity`: basta `play` per avere un movimento in loop oltre i 5 secondi. Il componente non offre un meccanismo di pausa e le docs non dicono che il consumer deve fornirne uno (consumer + default del componente). | animation.component.ts:64-65 `@property({ type: Number }) iterations = Infinity;` | WCAG 2.2.2 (A) | Documentare l'obbligo di un controllo pausa per loop oltre 5s e valutare `iterations = 1` come default (breaking) o un warning in dev quando `play && iterations === Infinity`. |
| SL-ANIMATION-03 | Bassa | 9 | Gli esempi delle docs avviano animazioni in loop infinito con `play` senza controllo di pausa né menzione del reduced motion, e gli adottanti li copiano. Non ci sono test sul reduced motion. | docs/pages/components/animation.md:12-15 `<sl-animation name="bounce" duration="2000" play>` | WCAG 2.2.2 (buona pratica docs) | Sezione "Accessibility" con un esempio di pausa e reduced motion; test con `matchMedia` stubbato. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `play` (default `false`) | Sì | — | Default corretto. |
| `ignore-reduced-motion` | No | — | Da aggiungere (default: rispetta la preferenza dell'utente). |
| ARIA | N/A | — | Utility senza semantica: nessuna property ARIA necessaria. |

### Fix proposti
```ts
import { prefersReducedMotion } from '../../internal/animate.js';

/** Se true, riproduce l'animazione anche quando l'utente ha richiesto movimento ridotto (solo per animazioni essenziali). */
@property({ attribute: 'ignore-reduced-motion', type: Boolean }) ignoreReducedMotion = false;

private get shouldReduceMotion() {
  return !this.ignoreReducedMotion && prefersReducedMotion();
}

// in createAnimation(), dopo element.animate(...)
if (this.play) {
  this.hasStarted = true;
  this.emit('sl-start');
  if (this.shouldReduceMotion) this.animation.finish(); // salta allo stato finale, emette sl-finish
} else {
  this.animation.pause();
}

// in handlePlayChange()
if (this.play) {
  this.shouldReduceMotion ? this.animation.finish() : this.animation.play();
}
```
Nota: con `iterations = Infinity`, `finish()` lancia `InvalidStateError`. In quel caso usare `this.animation.cancel()`, così l'elemento resta allo stato statico.

### Non verificabile
- Presenza di lampeggi oltre 3 Hz (WCAG 2.3.1): dipende dal preset, da `duration` e da `playbackRate` scelti dal consumer.
- Se l'animazione è "essenziale" (eccezione 2.2.2/2.3.3): dipende dal contesto applicativo.
