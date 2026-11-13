## Format Number (`<sl-format-number>` – src/components/format-number/format-number.component.ts)
**Pattern APG di riferimento:** N/A (testo formattato)
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Render di sola stringa (r. 49): runtime `text "1.234,50 €"` (`type="currency" currency="EUR"`). |
| 2 | Nome/descrizione/stato | ✅ | Testo esposto; `NaN` → stringa vuota (r. 45-47). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Trasversale `lang` via property: contato una sola volta in SL-FORMAT-BYTES-01. |
| 4 | Tastiera e focus | N/A | — |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | N/A | — |
| 8 | API pubblica a11y | ✅ | — |
| 9 | Docs e test | ⚠️ | Nessun test axe. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| — nessun errore verificato — (trasversale `lang` via property: vedi SL-FORMAT-BYTES-01) | | | | | | | |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-FORMAT-NUMBER-M01 | miglioramento | Aggiungere `to.be.accessible()`. | format-number.test.ts |

### Responsabilità del consumer
- Impostare `lang` come attributo quando differisce dalla pagina (vedi SL-FORMAT-BYTES-01).

### Da verificare con AT reali
- Nessuna verifica rilevante.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-FORMAT-NUMBER-01 | Suggerimento | riclassificato | Test → SL-FORMAT-NUMBER-M01. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `lang` | Sì | Solo come attributo (SL-FORMAT-BYTES-01) | Sì |

### Fix proposti
Nessun errore specifico: vedi fix di SL-FORMAT-BYTES-01.
