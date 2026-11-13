## Empty State (`<sl-empty-state>` – src/components/empty-state/empty-state.component.ts)
**Pattern APG di riferimento:** nessuno (blocco statico: icona decorativa, heading, descrizione, azione).
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `heading "No comments yet" [level=3]` + `paragraph` + `button`. Senza `title-text` l'`<h3>` vuoto non è esposto (assente dall'albero). |
| 2 | Nome/descrizione/stato | ✅ | Il nome dell'azione viene dallo slot (`button "+ Add comment"`). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID. |
| 4 | Tastiera e focus | ✅ | L'azione slottata resta nell'ordine naturale di Tab. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Se compare dopo un'azione (filtro senza risultati), l'annuncio spetta al consumer. |
| 7 | Aspetti visivi | ✅ | Titolo 15.50 / 14.96:1; descrizione 6.64 / 5.72:1 (light/dark). Icona 4.26:1 light, 2.96:1 dark: è decorativa (il titolo veicola l'informazione), quindi esente. |
| 8 | API pubblica a11y | ⚠️ | Livello di heading fisso `h3` (miglioramento). |
| 9 | Docs e test | ⚠️ | 2 test axe; le docs non hanno una sezione a11y. |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-EMPTY-STATE-01 | miglioramento | Property `heading-level` (default 3). L'`h3` fisso può saltare livelli (`h1` → `h3` nella prova), ma un salto di livello non è una violazione A/AA: il titolo è comunque marcato come heading. | empty-state.component.ts:42 |
| SL-EMPTY-STATE-03 | miglioramento | Il riquadro icona (48×48 px) resta visibile anche senza icona: `:empty` non corrisponde per via dello `<slot>`. Usare `HasSlotController` anche per `icon`. Solo visivo, non esposto. | empty-state.component.ts:27, 38-40 |
| SL-EMPTY-STATE-04 | miglioramento | Esempio docs "+ Add comment": preferire un'icona `prefix` e il solo testo; aggiungere una sezione Accessibilità. | docs/pages/components/empty-state.md |

### Responsabilità del consumer
- SL-EMPTY-STATE-02: quando l'empty state appare in seguito a un'azione (ricerca/filtro), annunciarlo con una live region già presente nel DOM (es. contenitore `role="status"`).

### Da verificare con AT reali
- Nessuna verifica rilevante.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-EMPTY-STATE-01 | Media | riclassificato | Un salto di livello del heading non viola 1.3.1/2.4.6; property utile. |
| SL-EMPTY-STATE-02 | Media | riclassificato | L'annuncio dipende dal contesto applicativo (consumer). |
| SL-EMPTY-STATE-03 | Bassa | riclassificato | Riquadro decorativo non esposto agli AT. |
| SL-EMPTY-STATE-04 | Suggerimento | riclassificato | Docs. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| `title-text` → `<h3>` | Sì | Sì: `heading "No comments yet" [level=3]` | Sì |
| `heading-level` | No | — | Utile |
| `live` | No | — | No (consumer) |

### Fix proposti
Nessuno (nessun errore verificato).
