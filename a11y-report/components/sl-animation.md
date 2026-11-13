## Animation (`<sl-animation>` – src/components/animation/animation.component.ts)
**Pattern APG di riferimento:** N/A (utility Web Animations API); WCAG 2.2.2 Pause, Stop, Hide; 2.3.3 (AAA)
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Host `display: contents` senza ruolo, solo `<slot>` (r. 219): runtime l'albero non contiene nodi del componente. |
| 2 | Nome/descrizione/stato | N/A | Nessun contenuto proprio. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Contenuto in light DOM. |
| 4 | Tastiera e focus | N/A | Nessun elemento interattivo (Tab passa al `button` successivo). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Default `play = false` (r. 38): nessun avvio automatico. Con `play` + `reducedmotion`: `getAnimations()` → `{"s":"running","it":Infinity,"dur":2000}` (`matchMedia(reduce).matches = true`): reduced motion ignorato, ma 2.3.3 è AAA. 2.2.2: il movimento parte solo se il consumer imposta `play`; il componente offre i mezzi per fermarlo (`play=false` → `animation.pause()` r. 193, `cancel()` r. 209) → responsabilità del consumer. |
| 8 | API pubblica a11y | ⚠️ | Nessun opt-in/opt-out per reduced motion. |
| 9 | Docs e test | ⚠️ | Esempio overview con 4 animazioni infinite senza pausa (docs r. 10-16). Bug non a11y: `@watch` su `'iterationsStart'` (r. 171) invece di `iterationStart`. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| — nessun errore verificato — | | | | | | | |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-ANIMATION-M01 | miglioramento | `element.animate()` diretto, senza `prefersReducedMotion()`: con reduce l'animazione è `running` in loop. Rispettare la preferenza di default (cancel/finish) con opt-out `ignore-reduced-motion` (2.3.3 AAA). | animation.component.ts:129-138; runtime `[{"s":"running","it":null(Infinity),"dur":2000}]` |
| SL-ANIMATION-M02 | consumer | Default `iterations = Infinity`: se il consumer imposta `play` su contenuto mostrato accanto ad altro, per 2.2.2 deve fornire un controllo di pausa (il componente lo consente con `play=false`/`cancel()`). Valutare un warning in dev. | animation.component.ts:65, 182-199, 209-211 |
| SL-ANIMATION-M03 | miglioramento | Docs: esempi con `play` in loop infinito senza controllo di pausa né nota su reduced motion; nessun test reduced motion. | docs/pages/components/animation.md:10-16 |
| SL-ANIMATION-M04 | miglioramento | Non a11y: `@watch('iterationsStart')` non corrisponde alla property `iterationStart`, i cambi a runtime non ricreano l'animazione. | animation.component.ts:171 |

### Responsabilità del consumer
- Per animazioni in loop >5 s mostrate con altro contenuto: fornire un controllo di pausa (2.2.2) che rimuove `play` o chiama `cancel()`.
- Evitare preset/durate che producano più di 3 lampeggi al secondo (2.3.1).

### Da verificare con AT reali
- Nessuna verifica AT rilevante (componente senza semantica).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-ANIMATION-01 | Media | riclassificato | Confermato a runtime (running con reduce), ma 2.3.3 è AAA → SL-ANIMATION-M01. |
| SL-ANIMATION-02 | Media | riclassificato | Default `play=false`; avvio e pausa sono decisi dal consumer con l'API esistente → consumer SL-ANIMATION-M02. |
| SL-ANIMATION-03 | Bassa | riclassificato | Esempi docs/test → SL-ANIMATION-M03. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `play` (default `false`) | Sì | Sì: senza `play` l'animazione è in pausa; `play=false` → `pause()` | Sì |
| `cancel()` / `finish()` | Sì | Sì | Sì (meccanismo di stop per il consumer) |
| `ignore-reduced-motion` | No | — | Utile (AAA) |

### Fix proposti
Nessun errore verificato: nessun fix obbligatorio.
