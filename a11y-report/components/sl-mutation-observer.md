## Mutation Observer (`<sl-mutation-observer>` – src/components/mutation-observer/mutation-observer.component.ts)
**Pattern APG di riferimento:** N/A (utility non visiva)
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Host `display: contents` (verificato `"contents"`), solo `<slot>` (r. 113). Runtime: `button "Click to mutate"` esposto senza wrapper; anche dentro `<ul>` → `list > listitem "uno", listitem "due"`. |
| 2 | Nome/descrizione/stato | N/A | — |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Contenuto in light DOM. |
| 4 | Tastiera e focus | ✅ | Tab raggiunge direttamente il contenuto: `focus: sl-button > button[part=base]`. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Emette solo `sl-mutation` (verificato), nessun annuncio. |
| 7 | Aspetti visivi | N/A | — |
| 8 | API pubblica a11y | N/A | — |
| 9 | Docs e test | ⚠️ | Nessun test axe (test r. 5-9). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| — nessun errore verificato — | | | | | | | |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-MUTATION-OBSERVER-M01 | miglioramento | Aggiungere un test axe con un figlio slottato. Nota non a11y: i `@watch` usano nomi di attributo (`'attr-old-value'`, `'char-data'`, `'char-data-old-value'`) invece delle property. | mutation-observer.test.ts:5-9; mutation-observer.component.ts:103-105 |

### Responsabilità del consumer
- Se nel callback di `sl-mutation` si modificano contenuti informativi, valutare l'annuncio con una live region propria.

### Da verificare con AT reali
- Nessuna.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-MUTATION-OBSERVER-01 | Suggerimento | riclassificato | Test mancante → SL-MUTATION-OBSERVER-M01. Impatto a11y nullo verificato a runtime. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| — | — | — | Nessuna necessaria |

### Fix proposti
Nessun errore verificato: nessun fix obbligatorio.
