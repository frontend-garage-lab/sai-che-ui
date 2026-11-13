## Input (`sl-input` – src/components/input/input.component.ts)
**Pattern APG di riferimento:** nessun pattern APG specifico (`<input>` nativo); HTML-AAM per `<input>`/`<label>`; WAI Forms Tutorial.
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 3 · Bassa 3
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | `<input>` nativo nello shadow root → `textbox`; clear/toggle → `button "Clear entry"` / `button "Show password"` (stringhe da `LocalizeController`, it: "Cancella inserimento"/"Mostra password"). |
| 2 | Nome/descrizione/stato | ⚠️ | `label="Nome"` → `textbox "Nome"`; slot label → `textbox "Cognome vero"` ✅. `help-text` → `desc="Useremo la tua email"` ✅; senza help text nessuna descrizione spuria ✅. `required` → `required` ✅ (nome `"Req *"`, coerente con l'etichetta visibile). Solo `placeholder` (esempi docs) → `textbox` **senza nome** (SL-INPUT-01). Stato invalid nativo esposto (`type=email value=abc` → `invalid="true"`; `setCustomValidity` → `invalid="true"`). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `for="input"` e `aria-describedby="help-text"` interni allo stesso shadow root funzionano. `aria-label="Cerca"` sull'host → `generic "Cerca"` + `textbox` senza nome (verificato dal coordinatore, riprodotto): miglioramento, perché `label` + `::part(form-control-label)` visually-hidden dà `textbox "Cerca"`. |
| 4 | Tastiera e focus | ⚠️ | Tab entra nell'`<input>` ed esce al controllo successivo ✅. Toggle password `tabindex="-1"`: non raggiungibile, funzione non disponibile da tastiera (SL-INPUT-04). Clear non raggiungibile ma la funzione si ottiene con Cmd/Ctrl+A + Backspace (valore `""`, prova runtime) → miglioramento. |
| 5 | Form e validazione | ✅ | `reportValidity()` con required vuoto → `false`, focus sull'input, `invalid="false"`: **identico all'`<input required>` nativo** in Chromium (stesso output) → non è un errore del componente. Errori di formato/custom esposti come `invalid="true"`. `status="danger"` non imposta `aria-invalid` ma il testo d'errore (help-text) è nella descrizione → miglioramento. |
| 6 | Live region | N/A | Nessun contenuto dinamico del componente che richieda annuncio (errori: responsabilità del consumer / validazione nativa). |
| 7 | Aspetti visivi | ⚠️ | Light: testo 9.07, label 12.50, help 6.64, help danger/warning/success 6.48/6.01/6.08, placeholder standard 4.71 ✅; placeholder `filled` 4.26 ❌ (SL-INPUT-09); autofill primary-500 3.07 ❌ (SL-INPUT-08). Dark: placeholder 5.72/4.86, help 5.72, icone clear/toggle standard 3.49 ✅, `filled` 2.96 ❌ (SL-INPUT-10). Forced colors: focus senza indicatore oltre al caret (SL-INPUT-07). Target clear/toggle 38×34px ✅. |
| 8 | API pubblica a11y | ⚠️ | `label`, slot `label`, `help-text`, `placeholder`, `autocomplete`, `inputmode`, `enterkeyhint` propagati. Nessun passthrough `aria-label`/`aria-describedby` (miglioramento: workaround documentabile). |
| 9 | Docs e test | ⚠️ | Molti esempi docs con solo `placeholder` (→ textbox senza nome, vedi SL-INPUT-01). Test: un solo `to.be.accessible()` (input.test.ts:10-12). Miglioramento. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-INPUT-01 | Media | Nome | Senza `label` il componente renderizza comunque una `<label for="input">` vuota (aria-hidden): Chromium la usa come sorgente del nome e **non** ricade su `placeholder` né `title` come farebbe un `<input>` nativo. Gli esempi docs (Placeholders, Clearable, Toggle Password, Filled, Disabled, Sizes, Pill, Input Types, Prefix/Suffix) producono un campo senza nome. | src/components/input/input.component.ts:428-435 (`for="input"` r. 431 sempre presente); docs/pages/components/input.md:95,121,147,173 | runtime: `<input placeholder="Nativo ph">` → `textbox "Nativo ph"`; `<sl-input placeholder="Solo placeholder">` → `textbox [… labelledby=[61]]` (nessun nome); con `title="Titolo"` → `generic "Titolo"` + `textbox` senza nome. Rimuovendo `for` a runtime → `textbox "Cerca"`. | WCAG 4.1.2 | `for=${ifDefined(hasLabel ? 'input' : undefined)}` (workaround attuale: usare `label`). |
| SL-INPUT-04 | Media | Tastiera | Il bottone mostra/nascondi password ha `tabindex="-1"`: da tastiera non esiste alcun modo di mostrare la password. | input.component.ts:502-509 (`tabindex="-1"` r. 508) | runtime: `button#a → Tab → sl-input#p > input#input → Tab → button#b` (toggle saltato); col click `button "Hide password" [focused]` e `type` diventa `text` | WCAG 2.1.1 | Rimuovere `tabindex="-1"` dal toggle (aggiungere `aria-pressed`). |
| SL-INPUT-08 | Media | Contrasto | Valore autocompilato colorato con `-webkit-text-fill-color: primary-500` su `--sl-input-background-color-hover` (bianco): 3.07:1 nel tema light. | src/components/input/input.styles.ts:111-118 (r. 116) | codice + colori renderizzati (lo stato `:-webkit-autofill` non è attivabile nell'harness): elemento con `color: var(--sl-color-primary-500)` su `var(--sl-input-background-color-hover)` → `#16a0c2 su #ffffff = 3.07:1` (dark 6.63 ✅) | WCAG 1.4.3 | `-webkit-text-fill-color: var(--sl-input-color)`. |
| SL-INPUT-07 | Bassa | Focus (forced colors) | In `forced-colors: active` la variante standard non cambia aspetto al focus (bordo forzato nero, box-shadow e outline `none`); resta solo il caret di testo. La variante `filled` usa `outline` ed è visibile. | input.styles.ts:39-43 (focus = box-shadow), 137-139 (`outline: none`); nessuna `@media (forced-colors)` | runtime `forcedcolors`: prima e dopo Tab `borderTopColor = rgb(0,0,0)`, `boxShadow = none`, `outlineStyle = none`; `filled` focus → `outlineStyle = solid` | WCAG 2.4.7 | `@media (forced-colors: active) { .input--standard.input--focused { outline: 2px solid Highlight; } }` |
| SL-INPUT-09 | Bassa | Contrasto | Placeholder nella variante `filled`, tema light: 4.26:1. | input.styles.ts:65-67, 127-128; src/themes/light.css:489, 498 | runtime: `::placeholder rgb(108,117,122) su rgb(242,244,245) = 4.26:1` (standard 4.71, dark filled 4.86 ✅) | WCAG 1.4.3 | Token placeholder `filled` = neutral-600. |
| SL-INPUT-10 | Bassa | Contrasto UI | Icone clear e toggle password (`--sl-input-icon-color` neutral-500) nella variante `filled`, tema dark: 2.96:1; sono l'unica identificazione visiva dei bottoni. | input.styles.ts:250-256; src/themes/dark.css:485 | runtime dark: `.input__clear → #636e74 su #1f2528 = 2.96:1`; `.input__password-toggle → 2.96:1` (light filled 4.26, dark standard 3.49 ✅) | WCAG 1.4.11 | Icone su `filled` dark = neutral-600. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-INPUT-M01 | miglioramento | Passthrough `aria-label` (oggi resta sull'host: `generic "Cerca"` + textbox senza nome). Workaround supportato e verificato: `label` + `::part(form-control-label)` visually-hidden → `textbox "Cerca"`; va documentato. | input.component.ts:107-108, 450-482 |
| SL-INPUT-02 | miglioramento | `aria-invalid` con `status="danger"` / `data-user-invalid`: oggi l'errore è comunicato da help-text (descrizione) e dagli stati nativi; `aria-invalid` renderebbe esplicito lo stato. | input.component.ts:102, 450-482 |
| SL-INPUT-03 | miglioramento | Slot/property `error-message` separata dall'help text e `aria-describedby` condizionale. | input.component.ts:475, 531-538 |
| SL-INPUT-05 | miglioramento | Clear non tabbabile: alternativa da tastiera esistente (Cmd/Ctrl+A, Backspace → valore `""`); opzionale Esc per svuotare. | input.component.ts:486-498 |
| SL-INPUT-06 | miglioramento | Toggle: label fissa + `aria-pressed` invece di label alternata (oggi "Show/Hide password", nome corretto). | input.component.ts:506 |
| SL-INPUT-12 | miglioramento | Asterisco required nel nome (`"Nome *"`): coerente con l'etichetta visibile, stato `required` già esposto; opzionale `content: … / ''`. | src/styles/form-control.styles.ts:32-36 |
| SL-INPUT-11 | miglioramento | Docs: aggiungere `label` agli esempi e una sezione Accessibility (label nascosta via `::part`). | docs/pages/components/input.md:90-411 |
| SL-INPUT-13 | miglioramento | Test: axe/asserzioni per clearable, password-toggle, status, help-text, nome senza label. | src/components/input/input.test.ts:10-12 |

### Responsabilità del consumer
- Fornire sempre `label` (anche visivamente nascosta via `::part(form-control-label)`); `aria-label` sull'host non nomina il campo.
- Con `status="danger"` scrivere il messaggio d'errore in `help-text` (altrimenti errore solo cromatico) e gestire l'annuncio/focus degli errori di form.
- Icone in `prefix`/`suffix` significative: `label` su `sl-icon`.

### Da verificare con AT reali
- NVDA/JAWS/VoiceOver: lettura del nome/descrizione da `<slot>` dentro `<label>`/help text (Chromium ok; Safari/Firefox da verificare).
- Annuncio del messaggio di validazione nativo dopo `reportValidity()` (Chromium non espone `invalid` per `valueMissing`, come per l'input nativo).
- Firefox/Safari: comportamento del nome con `<label for>` vuota (fallback al placeholder?).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-INPUT-01 | Alta | ridimensionato | Media: il passthrough `aria-label` ha workaround (label + `::part`) → miglioramento M01; dimostrato invece che senza label placeholder/title non nominano il campo. |
| SL-INPUT-02 | Alta | riclassificato | Stati invalid nativi esposti; `valueMissing` identico all'input nativo; `status` con help-text è testuale. |
| SL-INPUT-03 | Media | riclassificato | Help text in descrizione soddisfa 3.3.1; `error-message` è ergonomia API. |
| SL-INPUT-04 | Alta | ridimensionato | Media: 2.1.1 confermato (toggle saltato da Tab) ma funzione di una variante. |
| SL-INPUT-05 | Bassa | riclassificato | Svuotare il campo è possibile da tastiera (Cmd/Ctrl+A + Backspace). |
| SL-INPUT-06 | Suggerimento | riclassificato | Nome del toggle corretto e aggiornato. |
| SL-INPUT-07 | Media | ridimensionato | Bassa: in forced colors nessun cambio di bordo/outline, resta il caret; in modalità normale non è errore (verificato dal coordinatore). |
| SL-INPUT-08 | Media | confermato | 3.07:1 light (prova codice + colori renderizzati). |
| SL-INPUT-09 | Bassa | confermato | 4.26:1 misurato. |
| SL-INPUT-10 | Bassa | confermato | 2.96:1 misurato (clear e toggle). |
| SL-INPUT-11 | Bassa | riclassificato | Docs; l'effetto reale è coperto da SL-INPUT-01. |
| SL-INPUT-12 | Bassa | riclassificato | Nome contiene l'etichetta visibile (2.5.3 ok), `required` esposto. |
| SL-INPUT-13 | Bassa | riclassificato | Test mancanti non sono errori. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` / slot `label` | ✅ | ✅ `textbox "Nome"`, `textbox "Cognome vero"` | Sì |
| `help-text` / slot | ✅ | ✅ `desc="Useremo la tua email"` | Sì |
| `placeholder` | ✅ | ❌ come nome (SL-INPUT-01) | Non come unica label |
| `title` | ✅ | ❌ resta anche sull'host (`generic "Titolo"`), non nomina il textbox | No |
| `required` | ✅ | ✅ `required` | Sì |
| `aria-label` (host) | ❌ | ❌ `generic "Cerca"` + textbox senza nome | Utile, non indispensabile (workaround) |
| `aria-invalid` | ❌ | stati nativi ✅ (`invalid="true"`) | Utile per `status="danger"` |
| `autocomplete`, `inputmode`, `enterkeyhint` | ✅ | ✅ `ifDefined` | Sì |

### Fix proposti
```ts
// input.component.ts:428-435 — associare la label solo se esiste (fallback nativo al placeholder)
<label part="form-control-label" class="form-control__label"
  for=${ifDefined(hasLabel ? 'input' : undefined)}
  aria-hidden=${hasLabel ? 'false' : 'true'}>

// input.component.ts:502-509 — toggle raggiungibile
<button part="password-toggle-button" class="input__password-toggle" type="button"
  aria-label=${this.localize.term(this.passwordVisible ? 'hidePassword' : 'showPassword')}
  @click=${this.handlePasswordToggle}>   /* rimosso tabindex="-1" */
```
```css
/* input.styles.ts */
.input__control:-webkit-autofill { -webkit-text-fill-color: var(--sl-input-color); } /* r. 116 */
.input--filled .input__control::placeholder { color: var(--sl-color-neutral-600); }
.input--filled .input__clear,
.input--filled .input__password-toggle { color: var(--sl-input-filled-icon-color, var(--sl-input-icon-color)); }
/* dark.css: --sl-input-filled-icon-color: var(--sl-color-neutral-600); */
.input__password-toggle:focus-visible { outline: var(--sl-focus-ring); outline-offset: -2px; }
@media (forced-colors: active) {
  .input--standard.input--focused { outline: 2px solid Highlight; outline-offset: 1px; }
}
```
