## Include (`<sl-include>` – src/components/include/include.component.ts)
**Pattern APG di riferimento:** N/A (utility di inclusione HTML); WCAG 2.4.3, 4.1.3
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12 (file incluso `docs/assets/examples/include.html`)

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Contenuto scritto in light DOM (`this.innerHTML`, r. 61) e mostrato da `<slot>`: runtime `paragraph > text …, link "a separate file"`. |
| 2 | Nome/descrizione/stato | ✅ | Nessun nome necessario. Nessun `aria-busy` durante il fetch (`getAttribute("aria-busy") = null`): non richiesto da A/AA. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Light DOM: ID e riferimenti dell'HTML incluso funzionano con la pagina. |
| 4 | Tastiera e focus | ⚠️ | Il link incluso è focusabile. Se il focus è dentro e il consumer cambia `src`, il nodo viene sostituito: runtime `focus: a` → dopo `src=…?p=2` → `focus: body`. La navigazione è avviata dal consumer, che può gestire il focus in `sl-load` (consumer/miglioramento). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Errore (404) solo via `sl-error`: contenuto vuoto (`innerHTML = ""`), nessun messaggio. Comunicarlo spetta al consumer. |
| 7 | Aspetti visivi | N/A | Nessuno stile visivo proprio. |
| 8 | API pubblica a11y | ✅ | `sl-load`/`sl-error` permettono al consumer di gestire focus e messaggi. |
| 9 | Docs e test | ⚠️ | Test solo load/error, nessun axe/focus (test r. 30-67); docs senza note a11y. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| — nessun errore verificato — | | | | | | | |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-INCLUDE-M01 | consumer | Cambiando `src` mentre il focus è nel contenuto incluso, il focus finisce su `body`. Il consumer che avvia la navigazione deve spostare il focus in `sl-load` (heading o host con `tabindex="-1"`); suggerito documentarlo o offrire un'opzione di ripristino. | include.component.ts:61; runtime `focus: a` → `focus: body` |
| SL-INCLUDE-M02 | consumer | Errore di caricamento comunicato solo con `sl-error`: il consumer deve mostrare/annunciare un messaggio (`role="alert"`). Suggerito esempio docs o slot di fallback. | include.component.ts:56-58, 68-70; runtime 404 → `innerHTML ""` |
| SL-INCLUDE-M03 | miglioramento | `aria-busy="true"` sull'host durante il fetch. | include.component.ts:45-71 |
| SL-INCLUDE-M04 | miglioramento | Test axe dopo `sl-load`, test focus, nota a11y nelle docs. | include.test.ts:30-67; docs/pages/components/include.md:10 |

### Responsabilità del consumer
- Accessibilità dell'HTML incluso (heading, alt, ID unici se incluso più volte).
- Gestione del focus dopo un cambio di `src` avviato da un controllo interno al contenuto.
- Messaggio visibile/annunciato in caso di `sl-error`.
- Effetti degli script con `allow-scripts`.

### Da verificare con AT reali
- Nessuna verifica rilevante: il contenuto è light DOM esposto normalmente.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-INCLUDE-01 | Bassa | riclassificato | Perdita del focus riprodotta, ma il cambio di `src` è un'azione del consumer gestibile con `sl-load` → consumer SL-INCLUDE-M01. |
| SL-INCLUDE-02 | Bassa | riclassificato | Comunicazione dell'errore spetta al consumer tramite `sl-error` → SL-INCLUDE-M02. |
| SL-INCLUDE-03 | Suggerimento | riclassificato | `aria-busy` non richiesto da A/AA → SL-INCLUDE-M03. |
| SL-INCLUDE-04 | Suggerimento | riclassificato | Test/docs → SL-INCLUDE-M04. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `sl-load` / `sl-error` | Sì | Sì (`sl-load <- sl-include`) | Sì, per gestire focus/messaggi |
| `aria-busy` interno | No | — | Utile, non obbligatorio |
| ARIA del contenuto | Consumer | Sì (light DOM) | — |

### Fix proposti
Nessun errore verificato: nessun fix obbligatorio.
