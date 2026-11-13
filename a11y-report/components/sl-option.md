## Option (`sl-option` – src/components/option/option.component.ts)
**Pattern APG di riferimento:** APG Listbox (option) dentro APG Select-Only Combobox (`sl-select`).
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 2 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | Host `role="option"` dentro `listbox` di `sl-select` → `option "Italia"`. Fuori da `sl-select` Chromium espone solo `text "Orfana"` (consumer). |
| 2 | Nome/descrizione/stato | ✅ | Nome dal contenuto (anche prefix/suffix: `option "[P] Telefono (consigliato)"`); `aria-selected` sempre valorizzato (`selected` / `selected=false`); disabled → `option "Germania" [disabled]`. Check icon `aria-hidden`. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo/stati sull'host nel light DOM; nessun ID interno referenziato. |
| 4 | Tastiera e focus | ⚠️ | Focus DOM gestito da `sl-select` (`option "Spagna" [focused …]`); disabled navigabile ma non selezionabile (ammesso da APG). Indicatore dell'opzione corrente a basso contrasto (SL-OPTION-01) e assente in forced colors (SL-OPTION-02). |
| 5 | Form e validazione | N/A | Gestito da `sl-select`. |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Testo 12.50 light / 10.26 dark; corrente primary-900 su primary-100 11.29 / 5.07; check selezionato 6.18 light ✅; check su opzione corrente+selezionata dark 2.71 ❌ (SL-OPTION-03). Altezza 27.6px ✅ (2.5.8). |
| 8 | API pubblica a11y | ✅ | Nessuna property a11y necessaria oltre al contenuto. |
| 9 | Docs e test | ⚠️ | Un axe con select chiuso (option.test.ts:6-16); docs senza note su icone in prefix/suffix. Miglioramento. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-OPTION-01 | Media | Focus / Contrasto | Mentre il focus è nel listbox l'unico indicatore dell'opzione focalizzata è lo sfondo primary-100 (outline rimosso; il combobox perde il proprio anello): contrasto dell'indicatore con il pannello 1.14:1 light, 2.51:1 dark. | src/components/option/option.styles.ts:10-12 (`:host(:focus) { outline: none; }`), 37-42 (`background-color: var(--sl-color-primary-100)`) | runtime: `option backgroundColor=rgb(228,243,247) su #ffffff = 1.14:1`; dark `#0e6a81 su #1f2528 = 2.51:1` | WCAG 1.4.11 (indicatore di stato/focus) | Indicatore ≥3:1, es. `.option--current { box-shadow: inset 3px 0 0 currentColor; }` |
| SL-OPTION-02 | Media | Focus (forced colors) | In forced colors l'opzione corrente è indistinguibile: sfondo forzato uguale alle altre, nessun outline (la media query copre solo `:hover`). | option.styles.ts:89-94 | runtime `forcedcolors` + ↓↓: `Spagna|current=true|rgb(255,255,255)|…|outline none` vs `Italia|false|rgba(255,255,255,0)|…|none` (Canvas bianco) | WCAG 2.4.7 | `@media (forced-colors: active) { .option--current { outline: 2px solid Highlight; outline-offset: -2px; } }` |
| SL-OPTION-03 | Bassa | Contrasto UI | Spunta (unico indicatore visivo di selezione nel listbox) primary-600 sull'opzione corrente e selezionata, tema dark: 2.71:1. È lo stato all'apertura (corrente = selezionata). | option.styles.ts:69-72 (`color: var(--sl-color-primary-600)`) + 37-42 | runtime dark: `.option__check → #50b9d3 su #0e6a81 = 2.71:1` | WCAG 1.4.11 | `.option--current.option--selected .option__check { color: currentColor; }` (5.07:1) |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-OPTION-04 | miglioramento | Nome dell'option include prefix/suffix mentre `getTextLabel()` (valore del combobox, type-ahead) li esclude (`"[P] Telefono (consigliato)"` vs `"Telefono"`): coerente con l'etichetta visibile, ma documentarlo. | option.component.ts:108-125, 142-144 |
| SL-OPTION-05 | miglioramento | `role`/`aria-selected` via `setAttribute` sull'host; `ElementInternals` eviterebbe di sporcare il light DOM. | option.component.ts:55-59 |
| SL-OPTION-06 | miglioramento | Test con listbox aperto e asserzioni `aria-selected`. | src/components/option/option.test.ts:6-16 |
| SL-OPTION-07 | miglioramento | Docs: icone in prefix/suffix (`label`), comportamento disabled. | docs/pages/components/option.md:58-79 |

### Responsabilità del consumer
- Usare `sl-option` solo dentro `sl-select` (fuori diventa `text`, non `option`).
- Icone significative in prefix/suffix: `label` su `sl-icon`.

### Da verificare con AT reali
- Annuncio "n di m" e stato selezionato con NVDA/JAWS/VoiceOver con il focus DOM sull'option.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-OPTION-01 | Media | confermato | 1.14:1 / 2.51:1 misurati. |
| SL-OPTION-02 | Media | confermato | Forced colors: opzione corrente indistinguibile (runtime). |
| SL-OPTION-03 | Bassa | confermato | 2.71:1 misurato in dark. |
| SL-OPTION-04 | Bassa | riclassificato | Nome contiene l'etichetta visibile; icone = consumer. |
| SL-OPTION-05 | Suggerimento | riclassificato | Qualità/robustezza. |
| SL-OPTION-06 | Bassa | riclassificato | Test. |
| SL-OPTION-07 | Suggerimento | riclassificato | Docs. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `role="option"` | ✅ | ✅ `option "Italia"` | Sì |
| `aria-selected` | ✅ | ✅ `selected` / `selected=false` | Sì |
| `disabled` → `aria-disabled` | ✅ | ✅ `option "Germania" [disabled]` | Sì |
| `label` esplicito | ❌ | — | No (nome dal contenuto) |

### Fix proposti
```css
/* option.styles.ts */
.option--current { box-shadow: inset 3px 0 0 currentColor; }      /* r. 37-42 */
.option--current.option--selected .option__check { color: currentColor; }         /* r. 69-72 */
@media (forced-colors: active) {                                                  /* r. 89-94 */
  .option--current { outline: 2px solid Highlight; outline-offset: -2px; }
}
```
