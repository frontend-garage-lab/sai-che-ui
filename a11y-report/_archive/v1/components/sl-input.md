## Input (`sl-input` – src/components/input/input.component.ts)
**Pattern APG di riferimento:** nessun pattern APG specifico (controllo nativo `<input>`); WAI Forms Tutorial (Labels, Instructions, Validation); HTML-AAM per `<input>`/`<label>`.
**Esito sintetico:** ⚠️ Parzialmente conforme — `<input>` nativo con `<label for>` e help text collegati correttamente nello stesso shadow root; mancano `aria-invalid`, un canale per i messaggi d'errore, il passthrough del nome dall'host, e il toggle password non è raggiungibile da tastiera.
**Conteggio finding:** Blocker 0 · Alta 3 · Media 3 · Bassa 6 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<input>` nativo (r. 450-482), `<label for="input">` (r. 428-435), `<button type="button">` per clear/toggle (r. 486-523). Nessun role custom. |
| 2 | Nome, descrizione, stato | ⚠️ | Nome solo da `label`/slot `label`; senza label il nome è solo il `placeholder` (SL-INPUT-01). Help text via `aria-describedby="help-text"` ✅. `required`/`disabled`/`readonly` nativi ✅. `aria-invalid` assente (SL-INPUT-02). Icone `sl-icon` senza `label` → `aria-hidden="true"` ✅. Asterisco required incluso nel nome (SL-INPUT-12). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `for="input"` e `aria-describedby="help-text"` restano nello stesso shadow root ✅. `<label for>` esterna non associabile e `aria-*` sull'host non propagati (SHARED §2, formAssociated assente) → SL-INPUT-01/03. |
| 4 | Tastiera e focus | ⚠️ | Input nativo operabile; Enter invia il form (r. 289-301) ✅. Toggle password e clear con `tabindex="-1"` (SL-INPUT-04, SL-INPUT-05). Focus reso con box-shadow 40% + `outline: none` (SHARED-01/02), nessun `forced-colors` (SL-INPUT-07). |
| 5 | Form e validazione | ⚠️ | `type`, `name`, `autocomplete`, `inputmode`, `enterkeyhint`, `pattern`, `min/max/step` passati ✅. Errori: solo `status="danger"` + `help-text` (solo visivo/testuale, nessun `aria-invalid`, nessun `error-message`) → SL-INPUT-02/03. Validazione mostrata solo con il tooltip nativo del browser. |
| 6 | Live region | ⚠️ | Nessun annuncio quando l'help text diventa messaggio d'errore (SL-INPUT-03) né dopo il clear (SL-INPUT-05). |
| 7 | Aspetti visivi (statici) | ⚠️ | Testo input neutral-700 9.12:1 ✅, label 12.51:1 ✅, help 6.63:1 ✅, help con status success/warning/danger-700 su neutral-0 6.10/6.02/6.50 (light) ✅. Testo autofill primary-500 3.08:1 ❌ (SL-INPUT-08); placeholder `filled` light 4.27:1 ❌ (SL-INPUT-09); icone clear/toggle in dark `filled` 2.95:1 ❌ (SL-INPUT-10). Target clear/toggle ≥26×30px ✅ 2.5.8. Transizioni non ridotte (SHARED-05). Disabled con `opacity: 0.5` (esente). |
| 8 | API pubblica a11y | ⚠️ | `label`, `help-text`, `placeholder`, `title` ✅. Mancano `aria-label`/`aria-labelledby`/`aria-describedby` passthrough, `invalid`/`aria-invalid`, `error-message`, label override per clear/toggle (SHARED-06). Default `clearEntry`/`showPassword`/`hidePassword` localizzati ✅. Nessun warning dev se manca il nome. |
| 9 | Documentazione e test | ⚠️ | Docs: solo una frase su "accessible label" (input.md:38); la maggior parte degli esempi usa solo `placeholder` (SL-INPUT-11). Test: un solo axe su `label="Name"` (input.test.ts:10-13); nessun axe su clearable/password-toggle/status/help-text, nessun test di tastiera sui bottoni interni. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-INPUT-01 | Alta | Nome / Shadow DOM | Il nome è passabile solo con `label`/slot `label`. `aria-label`, `aria-labelledby` scritti dal consumer sull'host restano sull'host (generico, non focusabile) e non arrivano all'`<input>` interno; `<label for>` esterna non si associa (SHARED §2). Senza `label` il nome calcolato è il solo `placeholder` (che sparisce digitando) o vuoto. Nessun warning in dev mode. (componente; uso senza label = consumer) | src/components/input/input.component.ts:107-108 `@property() label = ''`; r. 428-435 `<label … for="input" aria-hidden=${hasLabel ? 'false' : 'true'}>`; r. 450-482 nessun `aria-label` sull'`<input>` | WCAG 4.1.2, 1.3.1, 3.3.2 | Aggiungere `accessibleLabel` (attr `aria-label`) applicato con `ifDefined` all'`<input>` e rimosso dall'host; warning dev se manca ogni nome (pattern shared §10). A medio termine `formAssociated` + `delegatesFocus`. |
| SL-INPUT-02 | Alta | Stato | `aria-invalid` non viene mai impostato: né con `status="danger"`, né quando il controller marca l'host `data-user-invalid`, né dopo `setCustomValidity()`. Lo stato d'errore è solo visivo (bordo rosso) e, senza help text, è comunicato solo col colore. L'esposizione dello stato `:invalid` nativo da parte dei browser non è uniforme. | input.component.ts:102 `status: 'success' \| 'warning' \| 'danger' \| ''`; r. 450-482 (`<input>` senza `aria-invalid`); src/styles/form-control.styles.ts:55-61 (solo colori) | WCAG 4.1.2, 3.3.1, 1.4.1 | Calcolare `invalid = status === 'danger' \|\| userInvalid` e renderizzare `aria-invalid=${invalid ? 'true' : 'false'}`; aggiornare `userInvalid` in `handleInvalid`/`updateValidity`. |
| SL-INPUT-03 | Media | Form / Live region | Nessuna property `error-message`: l'errore va scritto in `help-text` (stesso contenitore, stesso id). Non si può usare `aria-errormessage`, l'errore non viene annunciato quando compare e un messaggio d'errore esterno (light DOM) non è collegabile all'input (ID cross-shadow). `aria-describedby="help-text"` è sempre presente, anche senza help text. | input.component.ts:111 `helpText`; r. 475 `aria-describedby="help-text"`; r. 531-538 `<div … id="help-text" … aria-hidden=…>` | WCAG 3.3.1, 3.3.3, 4.1.3 | Aggiungere `error-message` (prop + slot) renderizzato in un contenitore `id="error-message"` con live region già presente nel DOM; `aria-describedby` = help text + errore solo se presenti; `aria-errormessage="error-message"` quando invalid. |
| SL-INPUT-04 | Alta | Tastiera | Il bottone mostra/nascondi password ha `tabindex="-1"`: chi usa la tastiera non può raggiungerlo e non ha un'alternativa per vedere la password. | input.component.ts:502-509 `<button part="password-toggle-button" … tabindex="-1">` | WCAG 2.1.1, 3.3.8 (accessible authentication: supporto alla verifica dell'input) | Rimuovere `tabindex="-1"` (o renderlo opzionale), aggiungere `aria-pressed` e `aria-controls="input"`. |
| SL-INPUT-05 | Bassa | Tastiera / Live region | Il bottone clear ha `tabindex="-1"`: non raggiungibile da tastiera (alternativa disponibile: selezionare tutto + Canc, quindi non bloccante). Dopo il click il focus torna all'input ✅ ma nessun feedback "campo svuotato". | input.component.ts:486-498 `<button part="clear-button" … aria-label=${this.localize.term('clearEntry')} … tabindex="-1">`; r. 265 `this.input.focus()` | WCAG 2.1.1 (equivalente da tastiera presente), 4.1.3 | Gestire `Escape` sull'input per svuotare quando `clearable` (come `type=search`), oppure rendere il bottone focusabile con opzione; annuncio opzionale via live region. |
| SL-INPUT-06 | Suggerimento | Nome / API | Il toggle password cambia l'`aria-label` (Show/Hide) invece di avere label fissa + `aria-pressed`; le stringhe `clearEntry`/`showPassword`/`hidePassword` non sono sovrascrivibili puntualmente. | input.component.ts:490, 506 `aria-label=${this.localize.term(this.passwordVisible ? 'hidePassword' : 'showPassword')}` | WCAG 4.1.2; SHARED-06 | Label fissa (`showPassword`) + `aria-pressed=${this.passwordVisible}`; property `clear-label`, `password-toggle-label` con fallback localizzato. |
| SL-INPUT-07 | Media | Focus / Forced colors | Variante standard: focus = cambio colore bordo (primary-500, 3.08:1) + box-shadow al 40% (1.55:1); `outline: none` sull'input. Nessuna media query `forced-colors`: in High Contrast box-shadow rimosso e colori del bordo forzati → focus non visibile. | src/components/input/input.styles.ts:39-43 `box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color)`; r. 137-139 `.input__control:focus { outline: none; }`; nessun `@media (forced-colors` nel file | WCAG 2.4.7, 1.4.11; SHARED-01, SHARED-02 | Token focus ring pieno (SHARED-01) + `@media (forced-colors: active) { .input--focused { outline: 2px solid Highlight; } }`. |
| SL-INPUT-08 | Media | Contrasto | Testo autocompilato colorato con `-webkit-text-fill-color: var(--sl-color-primary-500)`: 3.08:1 su neutral-0 (light), sotto 4.5:1. | input.styles.ts:111-117 `-webkit-text-fill-color: var(--sl-color-primary-500);` | WCAG 1.4.3 | Usare `var(--sl-input-color)` o `primary-600` (6.21:1). |
| SL-INPUT-09 | Bassa | Contrasto | Placeholder nella variante `filled` (light): neutral-500 su neutral-100 = 4.27:1. (Variante standard 4.71:1 ✅; dark standard 5.70 ✅, dark filled neutral-600 su neutral-100 4.83 ✅.) | input.styles.ts:65-67 `background-color: var(--sl-input-filled-background-color)`, r. 127-128 `color: var(--sl-input-placeholder-color)`; src/themes/light.css:489, 498 | WCAG 1.4.3 | Placeholder `filled` = neutral-600 (6.01:1) tramite token `--sl-input-filled-placeholder-color`. |
| SL-INPUT-10 | Bassa | Contrasto UI | Icone clear/toggle (`--sl-input-icon-color` = neutral-500) nella variante `filled` dark: 2.95:1 su neutral-100 (< 3:1). Light 4.27 ✅, dark standard 3.48 ✅. | input.styles.ts:256 `color: var(--sl-input-icon-color)`; src/themes/dark.css:485, 497 | WCAG 1.4.11 | Icone su `filled` = neutral-600 in dark (4.83:1). |
| SL-INPUT-11 | Bassa | Documentazione | Gli esempi docs usano quasi sempre solo `placeholder` senza label (Placeholders, Clearable, Toggle Password, Filled, Disabled, Sizes, Pill, Input Types, Prefix/Suffix): promuovono un anti-pattern; nessuna sezione "Accessibility" (uso di label, errori, limiti di `aria-*` sull'host). (consumer seguirà gli esempi) | docs/pages/components/input.md:95, 121, 147, 173, 243, 269-273, 313-317, 357-361, 401-411 | WCAG 3.3.2, 2.4.6 | Aggiungere `label` agli esempi e una sezione "Accessibility". |
| SL-INPUT-12 | Bassa | Nome | L'asterisco required è generato con `::after { content: '*' }` sulla `<label>`: il contenuto CSS generato entra nel nome accessibile ("Nome asterisco/star"). Lo stato required è già esposto dal `required` nativo. | src/styles/form-control.styles.ts:32-36 `content: var(--sl-input-required-content);` | WCAG 2.5.3 (nome coerente), 1.3.1 | `content: var(--sl-input-required-content) / '';` (testo alternativo vuoto per il contenuto generato). |
| SL-INPUT-13 | Bassa | Test | Un solo test axe sullo stato iniziale con label; nessun test axe per `clearable` con valore, `password-toggle`, `status="danger"`, `help-text`, `disabled`; nessun test che verifichi `aria-describedby`/nome dei bottoni. | src/components/input/input.test.ts:10-13 | Qualità (supporto a WCAG 4.1.2) | Aggiungere test axe per gli stati e asserzioni su `aria-invalid`, `aria-describedby`, nome/raggiungibilità del toggle. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` / slot `label` | ✅ | ✅ `<label for="input">` | — |
| `help-text` / slot `help-text` | ✅ | ✅ `aria-describedby="help-text"` | Riferimento presente anche senza help text: renderlo condizionale. |
| `placeholder` | ✅ | ✅ | Non deve essere l'unica label (docs). |
| `title` | ✅ | ✅ | — |
| `aria-label` | ❌ | ❌ resta sull'host | Da aggiungere (SL-INPUT-01). |
| `aria-labelledby` | ❌ | ❌ | ID cross-shadow non risolvibili: preferire `label`; eventualmente `ariaLabelledByElements`. |
| `aria-describedby` | ❌ | ❌ | Fisso a `help-text`; non estendibile dal consumer. |
| `aria-invalid` / `invalid` | ❌ | ❌ | Da aggiungere (SL-INPUT-02). |
| `aria-errormessage` / `error-message` | ❌ | ❌ | Da aggiungere (SL-INPUT-03). |
| `aria-required` | — (nativo `required`) | ✅ | — |
| `autocomplete`, `type`, `inputmode`, `name`, `enterkeyhint` | ✅ | ✅ `ifDefined` | — |
| Label clear button | ⚠️ solo localizzata (`clearEntry`) | ✅ | Aggiungere `clear-label` (SHARED-06). |
| Label password toggle | ⚠️ solo localizzata (`showPassword`/`hidePassword`) | ✅ | Aggiungere `password-toggle-label`, `aria-pressed`. |
| `tabindex` | ❌ | — | Un `tabindex` sull'host crea un doppio tab stop (host + input). |

### Fix proposti
```ts
// input.component.ts
@property({ attribute: 'aria-label' }) accessibleLabel?: string;           // vedi shared §10 (rimuovere dall'host)
@property({ attribute: 'error-message' }) errorMessage = '';
@property({ attribute: 'clear-label' }) clearLabel = '';
@property({ attribute: 'password-toggle-label' }) passwordToggleLabel = '';
@state() private userInvalid = false;

private handleInvalid(event: Event) {
  this.userInvalid = true;
  this.formControlController.setValidity(false);
  this.formControlController.emitInvalidEvent(event);
}

render() {
  const hasError = !!this.errorMessage || this.hasSlotController.test('error-message');
  const invalid = this.status === 'danger' || this.userInvalid || hasError;
  const describedBy = [hasHelpText ? 'help-text' : '', hasError ? 'error-message' : ''].filter(Boolean).join(' ');
  return html`
    …
    <input
      …
      aria-label=${ifDefined(this.accessibleLabel || undefined)}
      aria-invalid=${invalid ? 'true' : 'false'}
      aria-describedby=${ifDefined(describedBy || undefined)}
      aria-errormessage=${ifDefined(hasError ? 'error-message' : undefined)}
    />
    …
    ${this.passwordToggle && !this.disabled
      ? html`<button
          part="password-toggle-button"
          class="input__password-toggle"
          type="button"
          aria-label=${this.passwordToggleLabel || this.localize.term('showPassword')}
          aria-pressed=${this.passwordVisible ? 'true' : 'false'}
          aria-controls="input"
          @click=${this.handlePasswordToggle}
        >…</button>`
      : ''}
    …
    <div part="form-control-error" id="error-message" class="form-control__error" aria-live="polite">
      <slot name="error-message">${this.errorMessage}</slot>
    </div>
  `;
}
```
```css
/* input.styles.ts */
.input__control:-webkit-autofill { -webkit-text-fill-color: var(--sl-input-color); }
.input--filled .input__control::placeholder { color: var(--sl-color-neutral-600); }
.input__password-toggle:focus-visible { outline: var(--sl-focus-ring); outline-offset: -2px; }
@media (forced-colors: active) {
  .input--focused { outline: 2px solid Highlight; outline-offset: 1px; }
}
/* form-control.styles.ts */
:host([required]) .form-control--has-label .form-control__label::after {
  content: var(--sl-input-required-content) / '';
}
```

### Non verificabile
- Resa reale con screen reader (NVDA/JAWS/VoiceOver) del nome calcolato da `<label>` con `<slot name="label">` e della descrizione da `<slot name="help-text">` (flattening degli slot nel calcolo nome/descrizione: supporto da verificare su Safari/VoiceOver).
- Esposizione dello stato invalid nativo (`:invalid`) come `aria-invalid` implicito nei diversi browser.
- Contrasto di icone/elementi passati negli slot `prefix`/`suffix`/`clear-icon` e di temi personalizzati dal consumer.
- Visibilità del focus in Windows High Contrast (richiede test manuale).
