## Textarea (`sl-textarea` – src/components/textarea/textarea.component.ts)
**Pattern APG di riferimento:** nessun pattern APG specifico (controllo nativo `<textarea>`); WAI Forms Tutorial (Labels, Instructions, Validation).
**Esito sintetico:** ⚠️ Parzialmente conforme — `<textarea>` nativo con `<label for>` e help text correttamente associati nello stesso shadow root; stessi limiti di `sl-input` su nome dall'host, `aria-invalid` ed errori; `autocomplete` dichiarato ma non applicato.
**Conteggio finding:** Blocker 0 · Alta 2 · Media 2 · Bassa 5 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<textarea>` nativo (r. 342-368) e `<label for="input">` (r. 320-327). L'adjuster (r. 370) è `visibility: hidden` e vuoto: non esposto. |
| 2 | Nome, descrizione, stato | ⚠️ | Nome solo da `label`/slot (SL-TEXTAREA-01). `aria-describedby="help-text"` ✅. `required`/`disabled`/`readonly` nativi ✅. `aria-invalid` assente (SL-TEXTAREA-02). Asterisco required nel nome (vedi SL-INPUT-12, stesso file condiviso). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Riferimenti `for`/`aria-describedby` interni allo stesso shadow root ✅; `aria-*` dell'host e `<label for>` esterne non propagati (SHARED §2). |
| 4 | Tastiera e focus | ⚠️ | Operabilità nativa ✅ (Enter = a capo, nessuna trappola: Tab esce). Focus via box-shadow 40% + `outline: none`, nessun `forced-colors` (SL-TEXTAREA-04). |
| 5 | Form e validazione | ⚠️ | `name`, `inputmode`, `enterkeyhint`, `minlength/maxlength` passati ✅; `autocomplete` dichiarato ma non renderizzato (SL-TEXTAREA-05). Errori solo via `status` + `help-text` (SL-TEXTAREA-02/03). |
| 6 | Live region | ⚠️ | Nessun annuncio d'errore; nessun contatore caratteri per `maxlength` (SL-TEXTAREA-08). |
| 7 | Aspetti visivi (statici) | ⚠️ | Testo 9.12:1 ✅, label 12.51:1 ✅, help 6.63:1 ✅. Placeholder `filled` light 4.27:1 ❌ (SL-TEXTAREA-06). Transizioni non ridotte (SHARED-05). Disabled `opacity: 0.5` (esente). Resize nativo (UA) con alternativa `resize="auto"`. |
| 8 | API pubblica a11y | ⚠️ | `label`, `help-text`, `placeholder`, `title` ✅; mancano `aria-label` passthrough, `invalid`, `error-message`. Nessun warning dev se manca il nome. |
| 9 | Documentazione e test | ⚠️ | Docs: esempi senza label né placeholder (SL-TEXTAREA-07). Test: un solo axe con `label` (textarea.test.ts:10-13); nessun axe per status/disabled/help-text. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-TEXTAREA-01 | Alta | Nome / Shadow DOM | Nome passabile solo con `label`/slot `label`; `aria-label`/`aria-labelledby` sull'host restano sull'host, `<label for>` esterna non si associa (SHARED §2). Senza label il nome è il `placeholder` o vuoto. Nessun warning dev. | src/components/textarea/textarea.component.ts:70 `@property() label = ''`; r. 320-327; r. 342-368 (nessun `aria-label` sulla `<textarea>`) | WCAG 4.1.2, 1.3.1, 3.3.2 | `accessibleLabel` (attr `aria-label`) applicato alla `<textarea>` con `ifDefined`; warning dev (shared §10). |
| SL-TEXTAREA-02 | Alta | Stato | `aria-invalid` mai impostato (né con `status="danger"` né con `data-user-invalid`/`setCustomValidity`); errore solo visivo/colore. | textarea.component.ts:67 `status`; r. 342-368; src/styles/form-control.styles.ts:55-61 | WCAG 4.1.2, 3.3.1, 1.4.1 | `aria-invalid=${invalid ? 'true' : 'false'}` con `invalid = status === 'danger' \|\| userInvalid`. |
| SL-TEXTAREA-03 | Media | Form / Live region | Nessuna property `error-message`; errore dentro `help-text`, non annunciato, `aria-errormessage` non usabile, errori esterni non collegabili; `aria-describedby="help-text"` sempre presente. | textarea.component.ts:73 `helpText`; r. 362 `aria-describedby="help-text"`; r. 374-381 | WCAG 3.3.1, 3.3.3, 4.1.3 | Stesso fix di SL-INPUT-03 (prop/slot `error-message` + live region + riferimenti condizionali). |
| SL-TEXTAREA-04 | Media | Focus / Forced colors | Focus variante standard = bordo primary-500 + box-shadow 40%; `outline: none` sulla textarea; nessuna media query `forced-colors`. | src/components/textarea/textarea.styles.ts:40-44 `box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color)`; r. 126-127 `outline: none` | WCAG 2.4.7, 1.4.11; SHARED-01, SHARED-02 | `@media (forced-colors: active) { .textarea--focused { outline: 2px solid Highlight; } }` + focus ring pieno. |
| SL-TEXTAREA-05 | Bassa | Form | La property `autocomplete` è dichiarata e documentata ma non viene passata alla `<textarea>`: il consumer non può indicare lo scopo del campo (es. `street-address`) né disattivare l'autofill. | textarea.component.ts:116 `@property() autocomplete: string;` — assente nel template r. 342-368 | WCAG 1.3.5 | Aggiungere `autocomplete=${ifDefined(this.autocomplete)}` alla `<textarea>`. |
| SL-TEXTAREA-06 | Bassa | Contrasto | Placeholder variante `filled` (light): neutral-500 su neutral-100 = 4.27:1. | textarea.styles.ts:80 `background-color: var(--sl-input-filled-background-color)`; r. 120-121 `color: var(--sl-input-placeholder-color)` | WCAG 1.4.3 | Placeholder `filled` = neutral-600 (6.01:1). |
| SL-TEXTAREA-07 | Bassa | Documentazione | Esempi docs senza label: alcuni senza nome del tutto (`<sl-textarea></sl-textarea>`, `rows="2"`, `resize="none"`, `resize="auto"`), altri solo `placeholder`; nessuna sezione "Accessibility". (consumer seguirà gli esempi) | docs/pages/components/textarea.md:9, 93, 119, 145, 215, 241-245, 285, 311 | WCAG 3.3.2, 4.1.2 | Aggiungere `label` a tutti gli esempi e una sezione "Accessibility". |
| SL-TEXTAREA-08 | Suggerimento | Live region / Form | Con `maxlength` il limite è applicato silenziosamente (nessun contatore né annuncio del limite raggiunto). | textarea.component.ts:104, 355 `maxlength=${ifDefined(this.maxlength)}` | WCAG 3.3.2 (best practice), 4.1.3 | Opzione `show-count` con contatore `aria-live="polite"` (debounced) collegato in `aria-describedby`. |
| SL-TEXTAREA-09 | Bassa | Test | Un solo test axe con label; nessun axe per `status`, `help-text`, `disabled`, `filled`; nessuna asserzione su `aria-describedby`. | src/components/textarea/textarea.test.ts:10-13 | Qualità (WCAG 4.1.2) | Aggiungere test axe per gli stati e asserzioni ARIA. |
| SL-TEXTAREA-10 | Bassa | Nome | Asterisco required da `::after { content }` incluso nel nome della label (stesso CSS condiviso di SL-INPUT-12). | src/styles/form-control.styles.ts:32-36 | WCAG 2.5.3, 1.3.1 | `content: var(--sl-input-required-content) / '';` |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` / slot `label` | ✅ | ✅ `<label for="input">` | — |
| `help-text` / slot | ✅ | ✅ `aria-describedby="help-text"` | Riferimento sempre presente: renderlo condizionale. |
| `placeholder`, `title` | ✅ | ✅ | — |
| `aria-label` / `aria-labelledby` | ❌ | ❌ restano sull'host | Da aggiungere (SL-TEXTAREA-01). |
| `aria-describedby` | ❌ | ❌ | Fisso. |
| `aria-invalid` / `invalid` | ❌ | ❌ | Da aggiungere. |
| `aria-errormessage` / `error-message` | ❌ | ❌ | Da aggiungere. |
| `aria-required` | — (nativo) | ✅ | — |
| `autocomplete` | ✅ dichiarata | ❌ non renderizzata | SL-TEXTAREA-05. |
| `inputmode`, `enterkeyhint`, `name`, `spellcheck` | ✅ | ✅ | — |

### Fix proposti
```ts
// textarea.component.ts — template <textarea>
<textarea
  …
  autocomplete=${ifDefined(this.autocomplete)}
  aria-label=${ifDefined(this.accessibleLabel || undefined)}
  aria-invalid=${invalid ? 'true' : 'false'}
  aria-describedby=${ifDefined(describedBy || undefined)}
  aria-errormessage=${ifDefined(hasError ? 'error-message' : undefined)}
></textarea>
// + error-message / userInvalid come in sl-input (SL-INPUT-02/03)
```
```css
/* textarea.styles.ts */
.textarea--filled .textarea__control::placeholder { color: var(--sl-color-neutral-600); }
@media (forced-colors: active) {
  .textarea--focused { outline: 2px solid Highlight; outline-offset: 1px; }
}
```

### Non verificabile
- Calcolo di nome/descrizione da `<slot name="label">`/`<slot name="help-text">` con screen reader reali (in particolare Safari/VoiceOver).
- Esposizione dello stato invalid nativo come `aria-invalid` implicito nei vari browser.
- Visibilità del focus in Windows High Contrast; contrasto con temi personalizzati dal consumer.
