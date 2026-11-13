## Card (`<sl-card>` – src/components/card/card.component.ts)
**Pattern APG di riferimento:** nessuno (contenitore neutro). La semantica di heading/landmark spetta al consumer.
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Solo `div`/`slot` senza ruolo: il contenuto slottato è esposto così com'è (`text "Quarterly…"`, `button "Act"`). Nessuna semantica imposta. |
| 2 | Nome/descrizione/stato | ✅ | Nessun controllo interno. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Host senza ruolo: il consumer può usare `role`/`aria-labelledby` sull'host verso ID del light DOM. Ordine di lettura = ordine visivo. |
| 4 | Tastiera e focus | N/A | Nessun focusabile interno. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Testo: light 15.50:1, dark 12.71:1. A 320 px l'header viene troncato con ellissi (SL-CARD-02). |
| 8 | API pubblica a11y | ✅ | Non servono property: il consumer slotta un heading. |
| 9 | Docs e test | ⚠️ | Gli esempi docs usano `<div slot="header">` come titolo (modello non semantico). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-CARD-02 | Media | Aspetti visivi / Reflow | L'header è forzato su una riga con `overflow:hidden` + `text-overflow:ellipsis`. Su un viewport di 320 px un titolo più lungo della card viene tagliato e il testo nascosto non è visibile in nessun modo (né tooltip né a capo). | src/components/card/card.styles.ts:50-52 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` | runtime `--viewport 320x640`, header "Quarterly revenue report for the northern region offices": `.card__header` `[scrollWidth 430, clientWidth 286, "nowrap", "ellipsis"]` → 144 px di testo nascosti | WCAG 1.4.10 Reflow (AA) | Di default `white-space: normal; overflow-wrap: anywhere;` e troncamento solo opt-in (es. `--header-white-space` o attributo `truncate-header`). |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-CARD-04 | miglioramento | Docs: esempio di card come gruppo con nome (`role="article"` + `aria-labelledby` sull'host) e heading reale nello slot `header`. | docs/pages/components/card.md |

### Responsabilità del consumer
- SL-CARD-01: usare un heading reale (`<h3 slot="header">`) quando l'header è un titolo. Il componente non impone semantica (corretto per un contenitore), ma le docs andrebbero corrette.
- SL-CARD-03: il `variant` (bordo colorato) non deve essere l'unico modo di comunicare l'area di lavoro: ripeterla nel testo.

### Da verificare con AT reali
- Nessuna verifica rilevante.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-CARD-01 | Media | riclassificato | La semantica del contenuto slottato è del consumer; le docs vanno migliorate. |
| SL-CARD-02 | Media | confermato | Troncamento dimostrato a 320 px (scrollWidth 430 > clientWidth 286). |
| SL-CARD-03 | Bassa | riclassificato | Uso del colore deciso dal consumer. |
| SL-CARD-04 | Suggerimento | riclassificato | Docs. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| `role`/`aria-*` sull'host | (nativo) | Host senza ruolo interno: usabili direttamente | Sì, a carico del consumer |
| `heading`/`heading-level` | No | — | No (slot) |

### Fix proposti
```css
/* card.styles.ts:42-53 */
.card__header {
  /* … */
  overflow-wrap: anywhere;
  white-space: var(--header-white-space, normal);
}
```
