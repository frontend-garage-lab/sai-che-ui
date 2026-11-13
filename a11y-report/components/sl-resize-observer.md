## Resize Observer (`<sl-resize-observer>` – src/components/resize-observer/resize-observer.component.ts)
**Pattern APG di riferimento:** N/A (utility non visiva)
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Host `display: contents` (styles r. 4-6), solo `<slot>` (r. 82). Runtime: `text "Resize me "`, `button "in"` esposti senza wrapper. |
| 2 | Nome/descrizione/stato | N/A | — |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Contenuto in light DOM. |
| 4 | Tastiera e focus | ✅ | Tab: `focus: button` (il bottone slottato), nessun tab stop aggiuntivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | N/A | — |
| 8 | API pubblica a11y | N/A | — |
| 9 | Docs e test | ⚠️ | Nessun file di test. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| — nessun errore verificato — | | | | | | | |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-RESIZE-OBSERVER-M01 | miglioramento | Creare `resize-observer.test.ts` (render, axe, `sl-resize`). | src/components/resize-observer/ (manca il test) |

### Responsabilità del consumer
- Se il layout reagisce a `sl-resize` nascondendo contenuti, garantire che restino raggiungibili (1.4.10 a carico del consumer).

### Da verificare con AT reali
- Nessuna.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-RESIZE-OBSERVER-01 | Suggerimento | riclassificato | Test mancante → SL-RESIZE-OBSERVER-M01. Impatto a11y nullo verificato a runtime. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| — | — | — | Nessuna necessaria |

### Fix proposti
Nessun errore verificato: nessun fix obbligatorio.
