## Popup (`sl-popup` – src/components/popup/popup.component.ts)
**Pattern APG di riferimento:** Nessuno (utility di posizionamento; semantica a carico di dropdown/tooltip/select/menu-item)
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | Nessun ruolo aggiunto; freccia `role="presentation"` non esposta. |
| 2 | Nome/descrizione/stato | N/A | Stato a carico del componente che lo usa. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `anchor` usato solo per il posizionamento. |
| 4 | Tastiera e focus | ✅ | Ordine DOM preservato: `focus:sl-popup button` → Tab → `a` (contenuto popup) → Tab → `button#b`. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Inattivo: contenuto assente dall'albero AX (runtime: solo `button "Ancora"`, `button "dopo"`); attivo: `text "Contenuto popup "`, `link "link"`. Nessun colore proprio. |
| 8 | API pubblica a11y | N/A | Nessuna stringa né ARIA necessaria. |
| 9 | Docs e test | ⚠️ | Test senza axe (miglioramento). |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-POPUP-01 | miglioramento | Test axe e verifica dell'esclusione del contenuto inattivo. | src/components/popup/popup.test.ts |
| SL-POPUP-03 | miglioramento | `aria-hidden="true"` al posto di `role="presentation"` sulla freccia (nessun effetto runtime). | popup.component.ts:571 |
| SL-POPUP-M01 | miglioramento | Valutare Popover API (top layer) per evitare ritagli in contenitori `overflow: hidden`. | popup.component.ts:561-569 |

### Responsabilità del consumer
- SL-POPUP-02: in contenitori con `overflow: hidden/auto` usare `hoist`/`strategy="fixed"` (con `strategy="absolute"` il popup può essere ritagliato dal contenitore).
- Semantica, nome e focus del contenuto del popup.

### Da verificare con AT reali
- Nessuna verifica rilevante: il componente non espone semantica propria.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-POPUP-01 | Bassa | riclassificato | Test mancanti |
| SL-POPUP-02 | Suggerimento | riclassificato | Dipende dal layout del consumer; `hoist` disponibile |
| SL-POPUP-03 | Suggerimento | riclassificato | Nessun effetto runtime |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `active` | Sì | Inattivo → contenuto fuori dall'albero AX (runtime) | Sì |
| `anchor` | Sì | Solo posizionamento | — |
| `aria-*` | No | — | No |

### Fix proposti
Nessuno (nessun errore verificato).
