## Status (`<sl-status>` – src/components/status/status.component.ts)
**Pattern APG di riferimento:** nessun pattern APG (contenuto statico: indicatore decorativo + testo). Non è una live region (corretto per uno stato di record).
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Chromium espone solo il testo: `text "Active"`, `text "Uploading"`. Il dot non è esposto. |
| 2 | Nome/descrizione/stato | ✅ | Il significato è nella label slottata (responsabilità del consumer). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID. |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Statico; i cambi di stato dinamici vanno annunciati dal consumer. |
| 7 | Aspetti visivi | ⚠️ | Label light 7.80–12.50:1, dark 6.52–12.07:1. `forced-colors` gestito (styles r. 159-168). Il pulse è `Infinity` / `running`. Con `reducedmotion` non ci sono animazioni, ma non esiste un meccanismo di pausa (SL-STATUS-03). |
| 8 | API pubblica a11y | ✅ | Non servono property ARIA. |
| 9 | Docs e test | ⚠️ | Test axe presente; le docs non dicono che la label è obbligatoria. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-STATUS-03 | Bassa | Aspetti visivi / Movimento | `pulse` anima il dot all'infinito, parte da solo e resta in parallelo al resto della pagina. Il componente non offre un meccanismo di pausa. `prefers-reduced-motion` è rispettato, ma è una tecnica per 2.3.3 (AAA) e non soddisfa 2.2.2. L'informazione "in corso" non è essenziale al movimento: può stare nella label. | src/components/status/status.styles.ts:139 `animation: status-pulse 1.6s ease-out infinite;` | runtime: `.status__indicator.getAnimations({subtree:true})` → `["status-pulse:running:Infinity"]`; con `reducedmotion` → `[]` | WCAG 2.2.2 Pause, Stop, Hide (A) | Limitare a 3 iterazioni (4.8 s < 5 s) oppure documentare che `pulse` va tolto o reso pausabile dal consumer. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-STATUS-04 | miglioramento | Aggiungere alle docs una sezione Accessibilità: label obbligatoria, cambio di stato da annunciare con una live region del consumer. | docs/pages/components/status.md |
| SL-STATUS-V01 | miglioramento | Warning in dev mode se lo slot è vuoto (resterebbe solo il dot colorato). | status.component.ts:48-49 |

### Responsabilità del consumer
- SL-STATUS-01: se `pulse` indica "in corso", la label deve dirlo a parole (il movimento non è esposto agli AT).
- SL-STATUS-02: fornire sempre la label testuale. Il solo dot colorato comunicherebbe lo stato solo con il colore (1.4.1).

### Da verificare con AT reali
- Nessuna verifica rilevante: il contenuto è testo statico esposto correttamente.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-STATUS-01 | Bassa | riclassificato | La label è del consumer: deve esprimere lo stato "in corso". |
| SL-STATUS-02 | Bassa | riclassificato | Uso scorretto (slot vuoto) da parte del consumer; warning in dev = miglioramento. |
| SL-STATUS-03 | Suggerimento | confermato | Animazione infinita senza pausa, dimostrata a runtime → errore Bassa (2.2.2). |
| SL-STATUS-04 | Suggerimento | riclassificato | Docs. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| Label (slot default) | Sì | Sì: `text "Uploading"` | Sì |
| `pulse` | Sì | Animazione infinita | Va limitata |
| `role`/`aria-*` | No | — | No |

### Fix proposti
```css
/* status.styles.ts:139 */
animation: status-pulse 1.6s ease-out 3;
```
