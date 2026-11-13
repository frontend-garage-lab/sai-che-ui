## Comment (`<sl-comment>` – src/components/comment/comment.component.ts)
**Pattern APG di riferimento:** nessuno (blocco di contenuto statico: avatar, autore, data, testo).
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Ordine lineare leggibile: `text "Aiello Ciro"`, `text "· "`, `text "02-Oct-2026"`, `text "Submitted for Lead reviewer"`. Nessun ruolo imposto. |
| 2 | Nome/descrizione/stato | ✅ | Nell'esempio docs l'avatar senza `label` è esposto come `image` senza nome: è un problema dell'esempio (consumer), vedi sotto. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID. |
| 4 | Tastiera e focus | N/A | Nessun focusabile interno; quelli slottati (attachment) restano nell'ordine naturale. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Autore 12.50:1 / 10.26:1; data e testo (12 px) 6.64:1 / 4.86:1 (light/dark). Le iniziali dell'avatar slottato (36 px, 18 px) sono 3.21:1 / 2.18:1: è l'errore SL-AVATAR-01, non del comment. |
| 8 | API pubblica a11y | ✅ | Nessuna API necessaria. |
| 9 | Docs e test | ⚠️ | L'esempio docs e il test usano `<sl-avatar>` senza `label` né `aria-hidden`. |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-COMMENT-01 | miglioramento | Struttura più ricca: `<article>` per commento nei thread e `<time datetime>`. Oggi l'ordine di lettura lineare è comprensibile, quindi non c'è una violazione di 1.3.1 dimostrata. | comment.component.ts:56-71 |
| SL-COMMENT-03 | miglioramento | Il separatore `· ` generato con `::before` viene esposto come `text "· "`. È innocuo, ma `content: '· ' / ''` lo toglierebbe dall'albero. | comment.styles.ts:48-50 |
| SL-COMMENT-04 | miglioramento | Testo del commento a 12 px in colore secondario: conforme (4.86:1 in dark), migliorabile per la leggibilità. | comment.styles.ts:52-55 |
| SL-COMMENT-05 | miglioramento | Property `datetime` (ISO) e sezione Accessibilità nelle docs. | comment.component.ts:48-49 |

### Responsabilità del consumer
- SL-COMMENT-02: l'avatar slottato affianca il nome dell'autore. Va reso decorativo con `aria-hidden="true"` sull'`sl-avatar`, altrimenti resta un `image` senza nome. Va corretto anche l'esempio nelle docs (docs/pages/components/comment.md:11).

### Da verificare con AT reali
- Nessuna verifica rilevante.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-COMMENT-01 | Media | riclassificato | L'ordine lineare è comprensibile; `article`/`time` sono qualità. |
| SL-COMMENT-02 | Bassa | riclassificato | L'avatar è slottato dal consumer; la soluzione (`aria-hidden`) esiste già. |
| SL-COMMENT-03 | Bassa | riclassificato | Esposto come `text "· "`, innocuo. |
| SL-COMMENT-04 | Bassa | scartato | Misurato 4.86:1 in dark (≥ 4.5). |
| SL-COMMENT-05 | Suggerimento | riclassificato | API/docs. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| `author` / `date` | Sì | Sì: esposti come testo | Sì |
| `datetime` | No | — | Utile |

### Fix proposti
Nessuno (nessun errore verificato).
