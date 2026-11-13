## Badge (`<sl-badge>` – src/components/badge/badge.component.ts)
**Pattern APG di riferimento:** nessun pattern APG specifico. WAI-ARIA 1.2 `role="status"` solo per contatori dinamici.
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Ogni badge è `status [live="polite" atomic]` (r. 35), anche se statico. Dentro un bottone, Chromium esclude il testo del `status` dal nome (SL-BADGE-V01). |
| 2 | Nome/descrizione/stato | ❌ | `<sl-button>Messages <sl-badge pill>8</sl-badge></sl-button>` → `button "Messages"`: l'"8" visibile non fa parte del nome. Con `<span>` invece del badge → `button "Slot 7"`. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID; il testo slottato è esposto nel `status`. |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ✅ | Live region presente dal primo render: gli aggiornamenti del conteggio sono annunciabili. |
| 7 | Aspetti visivi | ⚠️ | Testo/fill light: 4.59–6.64:1; dark: 4.77–11.29:1 (tutti ≥ 4.5:1, font 12px). Con `pulse` l'animazione è `infinite` e resta `running` anche con `reducedmotion` (SL-BADGE-02). |
| 8 | API pubblica a11y | ⚠️ | Nessun modo di togliere `role=status` (causa di V01). |
| 9 | Docs e test | ⚠️ | I test axe ignorano `color-contrast` (badge.test.ts:5-7) con un commento superato: i contrasti misurati passano. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-BADGE-V01 | Media | Nome / Semantica | Il `role="status"` fisso fa sì che Chromium escluda il testo del badge dal nome del controllo che lo contiene. Nell'uso documentato "With Buttons" (`<sl-button>Requests <sl-badge pill>30</sl-badge></sl-button>`) il bottone si chiama solo "Requests": il conteggio visibile non arriva con il focus. | src/components/badge/badge.component.ts:35 `role="status"` | runtime: `button "Messages"` › `status [live="polite" atomic]` › `text "8"`; controprova `<sl-button>Slot <span>7</span></sl-button>` → `button "Slot 7"`; nativo `<button>Native2 <sl-badge>6</sl-badge></button>` → `button "Native2 "` | WCAG 1.3.1 Info and Relationships (A); 4.1.2 | Non applicare `role="status"` di default: property opt-in `live` (`role=${this.live ? 'status' : nothing}`) per i contatori dinamici. |
| SL-BADGE-02 | Bassa | Aspetti visivi / Movimento | `pulse` anima all'infinito (`1.5s infinite`), parte da solo insieme al resto della pagina e non ha meccanismo di pausa né rispetto di `prefers-reduced-motion`. | src/components/badge/badge.styles.ts:66-68 `animation: pulse 1.5s infinite;` | runtime con `reducedmotion`: `animationIterationCount = infinite`, `getAnimations()` → `["running"]` | WCAG 2.2.2 Pause, Stop, Hide (A): movimento > 5 s, avviato automaticamente, in parallelo ad altro contenuto | Limitare a 3 iterazioni (4.5 s < 5 s, rientra nell'eccezione) e `@media (prefers-reduced-motion: reduce) { .badge--pulse { animation: none; } }`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-BADGE-01 | miglioramento | Molte live region su badge statici: non è una violazione (non cambiano, quindi nessun annuncio). Il problema concreto dello stesso `role` è V01. | badge.component.ts:35 |
| SL-BADGE-04 | miglioramento | Rimuovere `ignoredRules = ['color-contrast']` dai test: il commento non è più vero. | badge.test.ts:5-7 |
| SL-BADGE-05 | miglioramento | success/warning/danger in light sono al limite (4.59–4.61:1): monitorare i token con un test di contrasto. | badge.styles.ts |

### Responsabilità del consumer
- SL-BADGE-03: il testo del badge deve avere senso senza il colore. Per contatori ambigui ("8") aggiungere il contesto (es. testo nascosto "8 avvisi non letti").

### Da verificare con AT reali
- Firefox/Safari + NVDA/VoiceOver: calcolo del nome di un bottone che contiene un `role=status`. In Chromium il testo è escluso (V01); in altri motori potrebbe essere incluso.
- Annuncio degli aggiornamenti del contatore (live polite atomic) con NVDA/JAWS/VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-BADGE-01 | Media | riclassificato | Live region statiche non violano 4.1.3. L'effetto reale del `role` è il nome del bottone (nuovo SL-BADGE-V01). |
| SL-BADGE-02 | Media | ridimensionato | Confermato a runtime (infinite, running con reduced motion), ma il movimento è un piccolo alone e il consumer può togliere `pulse` → Bassa. |
| SL-BADGE-03 | Media | riclassificato | Il contenuto testuale dipende dal consumer. |
| SL-BADGE-04 | Bassa | riclassificato | Copertura dei test, non una violazione. |
| SL-BADGE-05 | Suggerimento | scartato | Misurati ≥ 4.59:1 in tutte le varianti e in entrambi i temi: nessun problema. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| `live` (opt-in role=status) | No | — | Sì (fix di V01) |
| `pulse` | Sì | Animazione infinita | Va limitata (02) |
| `label` sr-only | No | — | No (il consumer può scrivere il testo) |

### Fix proposti
```ts
// badge.component.ts
@property({ type: Boolean, reflect: true }) live = false;
// render()
<span part="base" class="badge …" role=${this.live ? 'status' : nothing}><slot></slot></span>
```
```css
/* badge.styles.ts */
.badge--pulse { animation: pulse 1.5s 3; }
@media (prefers-reduced-motion: reduce) { .badge--pulse { animation: none; } }
```
