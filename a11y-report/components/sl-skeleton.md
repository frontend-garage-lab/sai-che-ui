## Skeleton (`<sl-skeleton>` – src/components/skeleton/skeleton.component.ts)
**Pattern APG di riferimento:** nessuno (placeholder visivo di caricamento; lo stato "busy" va espresso dal contenitore del consumer con `aria-busy`).
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Non esposto agli AT: `ax` mostra solo `paragraph "Prima"` e `paragraph "Dopo"`, nessun nodo per i 3 skeleton (div vuoti). |
| 2 | Nome/descrizione/stato | N/A | Decorativo. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento. |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Lo stato di caricamento spetta al consumer (`aria-busy`/`role="status"`). |
| 7 | Aspetti visivi | ⚠️ | Placeholder decorativo: niente soglie di contrasto. In `forcedcolors` l'effetto `sheen` diventa invisibile (`backgroundImage = none`, `backgroundColor = rgba(255,255,255,0)`): miglioramento. Animazioni infinite senza reduced motion: indicatore di caricamento (eccezione di 2.2.2). |
| 8 | API pubblica a11y | ✅ | Nessuna API necessaria. |
| 9 | Docs e test | ⚠️ | Le docs non citano `aria-busy`. |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-SKELETON-02 | miglioramento | `sheen` (8 s) e `pulse` (2 s) sono infiniti e ignorano `prefers-reduced-motion` (2.3.3 AAA). Come placeholder di caricamento rientrano nell'eccezione "essenziale" di 2.2.2. | skeleton.styles.ts:29, 33 |
| SL-SKELETON-03 | miglioramento | In `forced-colors` l'effetto `sheen` scompare perché il gradiente viene rimosso e non c'è un colore di fallback. Aggiungere `.skeleton--sheen .skeleton__indicator { background: GrayText; }` nel blocco forced-colors. | skeleton.styles.ts:26-28, 37-41 |
| SL-SKELETON-04 | miglioramento | `aria-hidden="true"` esplicito sull'host come difesa (oggi non serve: nessun nodo esposto). | skeleton.component.ts:27-38 |

### Responsabilità del consumer
- SL-SKELETON-01: impostare `aria-busy="true"` sul contenitore durante il caricamento e annunciare il completamento, oppure fornire un testo "Caricamento…" (sr-only).

### Da verificare con AT reali
- Nessuna verifica rilevante (componente non esposto).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-SKELETON-01 | Media | riclassificato | Lo stato di caricamento del contenitore spetta al consumer. |
| SL-SKELETON-02 | Bassa | riclassificato | AAA / eccezione di 2.2.2 per i caricamenti. |
| SL-SKELETON-03 | Bassa | riclassificato | Dimostrato (sheen invisibile in forced-colors), ma è un placeholder decorativo non richiesto da 1.4.11. |
| SL-SKELETON-04 | Suggerimento | riclassificato | Robustezza ipotetica. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| `effect` | Sì | Non esposto (corretto) | — |
| `aria-hidden` sull'host | No | Nessun nodo esposto comunque | No |

### Fix proposti
Nessuno (nessun errore verificato).
