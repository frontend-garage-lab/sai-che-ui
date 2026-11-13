## Progress Ring (`<sl-progress-ring>` – src/components/progress-ring/progress-ring.component.ts)
**Pattern APG di riferimento:** WAI-ARIA 1.2 `role="progressbar"` (solo determinato).
**Esito:** ⚠️ Parzialmente conforme (0 errori; resta aperta la verifica con AT reali della descrizione duplicata)
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `progressbar "Progress" value="25" [valuemin=0 valuemax=100]`. L'SVG è esposto come `image` senza nome dentro un ruolo con figli presentazionali (innocuo). |
| 2 | Nome/descrizione/stato | ✅ | `label="Upload"` → `progressbar "Upload" value="50" desc="50%"`. La descrizione risolve lo slot (Chromium la calcola). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-describedby="label"` punta a uno `<slot>` nello stesso shadow root: risolto (`describedby=[label]`). |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Annuncio dell'esito a carico del consumer. |
| 7 | Aspetti visivi | ✅ | Indicatore su bianco: light 6.18:1, dark 8.02:1. Il track (#e3e6e8 / #283033) è distinto. Label: 15.50 / 14.96:1. In `forcedcolors` lo `stroke` resta `rgb(14,106,129)` e il track `rgb(227,230,232)`: avanzamento distinguibile. |
| 8 | API pubblica a11y | ✅ | `label` propagata. |
| 9 | Docs e test | ⚠️ | Il test `ariaLabel` (test r. 41-48) usa un attributo ignorato: falsa copertura. |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-PROGRESS-RING-01 | miglioramento | Con la label tipica "50%" il valore è esposto sia come `value` sia come `desc="50%"` (ridondante). Una property `value-text` → `aria-valuetext` coprirebbe testi come "3 di 10". | progress-ring.component.ts:66, 77 |
| SL-PROGRESS-RING-02 | miglioramento | Fare il clamp di `value` 0–100 (offset negativo con valori > 100). | progress-ring.component.ts:53, 69 |
| SL-PROGRESS-RING-04 | miglioramento | La transizione dell'indicatore ignora `prefers-reduced-motion` (2.3.3 AAA). | progress-ring.styles.ts:49-50 |
| SL-PROGRESS-RING-05 | miglioramento | Il test `ariaLabel` va sostituito con `label`. | progress-ring.test.ts:41-48 |
| SL-PROGRESS-RING-06 | miglioramento | Stato indeterminate assente: documentare `sl-spinner` per i caricamenti indeterminati. | progress-ring.component.ts:36-40 |
| SL-PROGRESS-RING-V01 | miglioramento | `aria-hidden="true"` sull'`<svg>` decorativo per togliere il nodo `image` senza nome. | progress-ring.component.ts:72 |

### Responsabilità del consumer
- Fornire `label` quando ci sono più ring in pagina e annunciare l'esito con una live region.

### Da verificare con AT reali
- NVDA/JAWS/VoiceOver: doppio annuncio della percentuale (`value` + `desc="50%"`) e lettura della descrizione proveniente da uno `<slot>` in Firefox/Safari.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-PROGRESS-RING-01 | Media | riclassificato | Nome, valore e descrizione sono esposti; la ridondanza dipende dall'AT → miglioramento + verifica AT. |
| SL-PROGRESS-RING-02 | Bassa | riclassificato | Il clamp è robustezza; nessun errore nell'uso documentato. |
| SL-PROGRESS-RING-03 | Bassa | scartato | In `forcedcolors` gli `stroke` restano distinti (misurato). |
| SL-PROGRESS-RING-04 | Bassa | riclassificato | AAA. |
| SL-PROGRESS-RING-05 | Bassa | riclassificato | Copertura dei test. |
| SL-PROGRESS-RING-06 | Suggerimento | riclassificato | Funzionalità mancante, non una violazione. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| `label` → `aria-label` | Sì | Sì: `progressbar "Upload"` | Sì |
| `value` → `aria-valuenow` | Sì | Sì: `value="50"` | Sì |
| `value-text` | No | — | Utile |

### Fix proposti
Nessuno (nessun errore verificato).
