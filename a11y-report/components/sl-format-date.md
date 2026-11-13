## Format Date (`<sl-format-date>` – src/components/format-date/format-date.component.ts)
**Pattern APG di riferimento:** N/A (testo formattato); HTML `<time datetime>`
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `<time datetime=…>` (r. 64-66): runtime `time > text "15 luglio 2020"`; shadow `<time datetime="2020-07-15T13:17:00.000Z">`. |
| 2 | Nome/descrizione/stato | ✅ | Testo localizzato esposto. Data non valida → nessun render (r. 60-62). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il problema trasversale di `lang` via property si applica anche qui: contato una sola volta in SL-FORMAT-BYTES-01. |
| 4 | Tastiera e focus | N/A | — |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | N/A | — |
| 8 | API pubblica a11y | ✅ | Opzioni Intl complete. |
| 9 | Docs e test | ⚠️ | Nessun test axe né su `datetime`. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| — nessun errore verificato — (trasversale `lang` via property: vedi SL-FORMAT-BYTES-01) | | | | | | | |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-FORMAT-DATE-M01 | miglioramento | Aggiungere `to.be.accessible()` e un'asserzione su `time[datetime]`. | format-date.test.ts |

### Responsabilità del consumer
- Impostare `lang` come attributo quando differisce dalla pagina (vedi SL-FORMAT-BYTES-01).

### Da verificare con AT reali
- Nessuna verifica rilevante.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-FORMAT-DATE-01 | Suggerimento | riclassificato | Test → SL-FORMAT-DATE-M01; `<time datetime>` verificato a runtime. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `date` → `datetime` | Sì | Sì (`datetime="2020-07-15T13:17:00.000Z"`) | Sì |
| `lang` | Sì | Solo come attributo (SL-FORMAT-BYTES-01) | Sì |

### Fix proposti
Nessun errore specifico: vedi fix di SL-FORMAT-BYTES-01.
