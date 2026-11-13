## Textarea (`sl-textarea` – src/components/textarea/textarea.component.ts)
**Pattern APG di riferimento:** nessun pattern APG specifico (`<textarea>` nativo); HTML-AAM; WAI Forms Tutorial.
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 3
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | `<textarea>` nativo → `textbox` (multilinea); l'adjuster è `hidden`/vuoto, non esposto. |
| 2 | Nome/descrizione/stato | ⚠️ | `label` → `textbox "Commento *"`, slot → `textbox "Note extra"`, help text → `desc="Max 200"`, `required` esposto ✅. Solo `placeholder` → `textbox` senza nome (SL-TEXTAREA-01). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `for`/`aria-describedby` interni funzionano. `aria-label` sull'host → `generic "Host label"` + textbox senza nome: miglioramento (workaround `label` + `::part(form-control-label)`, come sl-input). |
| 4 | Tastiera e focus | ✅ | Tab entra nella textarea; Enter inserisce a capo (`"riga1\nriga2"`); Tab esce al controllo successivo (nessuna trappola). |
| 5 | Form e validazione | ⚠️ | `required`, `minlength/maxlength`, `inputmode`, `enterkeyhint` passati; `autocomplete` dichiarata ma non renderizzata (SL-TEXTAREA-05). Stato invalid: comportamento nativo (come sl-input). |
| 6 | Live region | N/A | Nessun contenuto dinamico del componente. |
| 7 | Aspetti visivi | ⚠️ | Light: placeholder 4.71, help 6.64, help danger 6.48 ✅; placeholder `filled` 4.26 ❌ (SL-TEXTAREA-06). Dark: placeholder 5.72/4.86, help 5.72, testo 8.75 ✅. Forced colors: nessun indicatore oltre al caret (SL-TEXTAREA-04). |
| 8 | API pubblica a11y | ⚠️ | `label`, `help-text`, `placeholder` ok; `autocomplete` non applicata. |
| 9 | Docs e test | ⚠️ | Esempi docs senza label (es. `<sl-textarea></sl-textarea>`, textarea.md:9) o solo placeholder; un solo axe (textarea.test.ts:10-13). Miglioramento. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-TEXTAREA-01 | Media | Nome | Senza `label` resta una `<label for="input">` vuota che blocca il fallback nativo al `placeholder`/`title`: textarea senza nome negli esempi docs con solo placeholder. | src/components/textarea/textarea.component.ts:320-327 (`for="input"` r. 323); docs/pages/components/textarea.md:93,119,145 | runtime: `<sl-textarea placeholder="Solo placeholder">` → `textbox [… labelledby=[42]]` senza nome; rimuovendo `for` → `textbox "Note"` | WCAG 4.1.2 | `for=${ifDefined(hasLabel ? 'input' : undefined)}`. |
| SL-TEXTAREA-04 | Bassa | Focus (forced colors) | Variante standard: in forced colors nessun cambio di bordo/outline al focus (resta il caret). | src/components/textarea/textarea.styles.ts:40-44, 126-127 | runtime `forcedcolors`: dopo Tab `borderTopColor = rgb(0,0,0)` (uguale a prima), `boxShadow = none`, `outlineStyle = none`; `filled` → `solid` | WCAG 2.4.7 | `@media (forced-colors: active) { .textarea--standard.textarea--focused { outline: 2px solid Highlight; } }` |
| SL-TEXTAREA-05 | Bassa | Form | `autocomplete` documentata ma non passata alla `<textarea>`: lo scopo di un campo multilinea con dati dell'utente (es. `street-address`) non è determinabile e non c'è altro modo di impostarlo. | textarea.component.ts:112-116 (prop); 342-368 (template senza `autocomplete`) | runtime: `<sl-textarea autocomplete="street-address">` → `textarea.getAttribute('autocomplete') = null` | WCAG 1.3.5 | `autocomplete=${ifDefined(this.autocomplete)}`. |
| SL-TEXTAREA-06 | Bassa | Contrasto | Placeholder variante `filled`, tema light: 4.26:1. | textarea.styles.ts:80, 120-121 | runtime: `::placeholder rgb(108,117,122) su rgb(242,244,245) = 4.26:1` | WCAG 1.4.3 | Placeholder `filled` = neutral-600. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-TEXTAREA-M01 | miglioramento | Passthrough `aria-label` (oggi `generic` + textbox senza nome); workaround `label` + `::part` da documentare. | textarea.component.ts:70, 342-368 |
| SL-TEXTAREA-02 | miglioramento | `aria-invalid` per `status="danger"`; stati nativi già esposti. | textarea.component.ts:67 |
| SL-TEXTAREA-03 | miglioramento | `error-message` dedicato e `aria-describedby` condizionale. | textarea.component.ts:362, 374-381 |
| SL-TEXTAREA-08 | miglioramento | Contatore caratteri per `maxlength` (best practice). | textarea.component.ts:355 |
| SL-TEXTAREA-10 | miglioramento | Asterisco nel nome (`"Commento *"`): coerente con l'etichetta visibile. | src/styles/form-control.styles.ts:32-36 |
| SL-TEXTAREA-07 | miglioramento | Docs: label in tutti gli esempi + sezione Accessibility. | docs/pages/components/textarea.md:9-311 |
| SL-TEXTAREA-09 | miglioramento | Test di stato/ARIA. | src/components/textarea/textarea.test.ts:10-13 |

### Responsabilità del consumer
- Fornire `label` (anche visivamente nascosta via `::part`); scrivere i messaggi d'errore nell'help text quando si usa `status="danger"`.

### Da verificare con AT reali
- Lettura di nome/descrizione da slot con NVDA/JAWS/VoiceOver (Safari/Firefox).
- Fallback del nome con `<label for>` vuota in Firefox/Safari.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-TEXTAREA-01 | Alta | ridimensionato | Media: passthrough → miglioramento (workaround); dimostrato textbox senza nome con solo placeholder. |
| SL-TEXTAREA-02 | Alta | riclassificato | Stati invalid nativi; errore testuale via help text. |
| SL-TEXTAREA-03 | Media | riclassificato | Ergonomia API. |
| SL-TEXTAREA-04 | Media | ridimensionato | Bassa: solo forced colors, caret presente. |
| SL-TEXTAREA-05 | Bassa | confermato | `getAttribute('autocomplete') = null`. |
| SL-TEXTAREA-06 | Bassa | confermato | 4.26:1 misurato. |
| SL-TEXTAREA-07 | Bassa | riclassificato | Docs (effetto coperto da SL-TEXTAREA-01). |
| SL-TEXTAREA-08 | Suggerimento | riclassificato | Best practice. |
| SL-TEXTAREA-09 | Bassa | riclassificato | Test. |
| SL-TEXTAREA-10 | Bassa | riclassificato | 2.5.3 soddisfatto. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` / slot | ✅ | ✅ `textbox "Commento *"` | Sì |
| `help-text` / slot | ✅ | ✅ `desc="Max 200"` | Sì |
| `placeholder` | ✅ | ❌ come nome (SL-TEXTAREA-01) | Non come unica label |
| `autocomplete` | ✅ | ❌ `null` | Sì (1.3.5) |
| `required` | ✅ | ✅ | Sì |
| `aria-label` (host) | ❌ | ❌ `generic "Host label"` | Utile (workaround esiste) |

### Fix proposti
```ts
// textarea.component.ts:320-327
<label part="form-control-label" class="form-control__label"
  for=${ifDefined(hasLabel ? 'input' : undefined)} aria-hidden=${hasLabel ? 'false' : 'true'}>
// textarea.component.ts:342-368
<textarea … autocomplete=${ifDefined(this.autocomplete)} …></textarea>
```
```css
/* textarea.styles.ts */
.textarea--filled .textarea__control::placeholder { color: var(--sl-color-neutral-600); }
@media (forced-colors: active) {
  .textarea--standard.textarea--focused { outline: 2px solid Highlight; outline-offset: 1px; }
}
```
