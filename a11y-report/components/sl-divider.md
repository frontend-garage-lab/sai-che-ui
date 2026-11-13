## Divider (`<sl-divider>` – src/components/divider/divider.component.ts)
**Pattern APG di riferimento:** WAI-ARIA 1.2 role `separator` statico (non focusabile); HTML `<hr>`
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `role="separator"` sull'host (r. 26). Runtime: `separator [orientation="horizontal"]`; con `vertical` → `separator [orientation="vertical"]`; dentro `sl-menu` → `menu > menuitem "A", separator, menuitem "B"`. |
| 2 | Nome/descrizione/stato | ✅ | Un separatore statico non richiede nome. `aria-orientation` segue `vertical` anche a runtime (`d.vertical=true` → `"vertical"`). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun `render()`: semantica sull'host, figlio diretto del contenitore (menu). |
| 4 | Tastiera e focus | N/A | Non interattivo, nessun `tabindex` (Tab lo salta). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Colore di default 1.25:1 (light) / 1.36:1 (dark) misurato con `contrast:`, ma il divider non è un componente UI né, negli usi documentati, l'unico veicolo di informazione → 1.4.11 non applicabile (vedi M02). `forcedcolors`: `borderTopColor = rgb(0,0,0)`, `1px solid` → visibile. |
| 8 | API pubblica a11y | ⚠️ | Solo `vertical`. Un `role` del consumer viene sovrascritto (`role="presentation"` → `separator`): non c'è modo di renderlo decorativo (miglioramento, non errore). |
| 9 | Docs e test | ⚠️ | Test axe solo orizzontale (test r. 7-10). Docs senza sezione a11y. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| — nessun errore verificato — | | | | | | | |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-DIVIDER-M01 | miglioramento | Ruolo `separator` imposto sempre, sovrascrive il `role` del consumer: nei divider puramente decorativi (es. "First / Middle / Last") le AT ricevono separatori in più. Non viola A/AA (un separatore in più non nasconde né altera informazioni). Aggiungere `decorative` → `role="none"` o rispettare un `role` già presente. | divider.component.ts:26; runtime `<sl-divider role="presentation">` → `separator [orientation="horizontal"]` |
| SL-DIVIDER-M02 | consumer | Colore default neutral-200 (1.25:1 light, 1.36:1 dark). Se il divider è l'unico indicatore di un raggruppamento informativo, il consumer deve usare `--color` più scuro (es. neutral-400). | divider.styles.ts:5 |
| SL-DIVIDER-M03 | miglioramento | Docs senza nota su semantica separator/decorativo; test axe mancante per `vertical`. | docs/pages/components/divider.md:138-150; divider.test.ts:7-10 |

### Responsabilità del consumer
- Usare `--color` con contrasto ≥3:1 quando il separatore è l'unico elemento che rende comprensibile un raggruppamento.

### Da verificare con AT reali
- Nessuna verifica rilevante aperta (il separatore nel menu è esposto correttamente in Chromium; l'eventuale annuncio dipende dall'AT).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-DIVIDER-01 | Bassa | riclassificato | Confermato a runtime che il `role` del consumer è sovrascritto, ma un separatore esposto in più non viola 1.3.1 → SL-DIVIDER-M01. |
| SL-DIVIDER-02 | Bassa | riclassificato | Contrasto misurato 1.25/1.36:1, ma il divider non è UI component né informazione necessaria nell'uso documentato → consumer SL-DIVIDER-M02. |
| SL-DIVIDER-03 | Suggerimento | riclassificato | Docs/test → SL-DIVIDER-M03. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `role` (fisso `separator`) | Sì | Sì, sull'host (`separator`) | Sì per l'uso semantico |
| `aria-orientation` (da `vertical`) | Sì | Sì (`orientation="vertical"` dopo `vertical=true`) | Sì |
| `decorative` | No | — | Utile, non indispensabile |

### Fix proposti
Nessun errore verificato: nessun fix obbligatorio.
