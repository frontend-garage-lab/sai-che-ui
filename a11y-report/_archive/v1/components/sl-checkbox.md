## Checkbox (`sl-checkbox` – src/components/checkbox/checkbox.component.ts)
**Pattern APG di riferimento:** APG Checkbox pattern (dual-state e mixed/tri-state) — controllo nativo `<input type="checkbox">`
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 4 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<input type="checkbox">` nativo dentro `<label>` ✅, ma `aria-checked` forzato a `true/false` sull'input nativo (ridondante, vietato da ARIA in HTML) e in conflitto con lo stato indeterminate (SL-CHECKBOX-01). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome dal testo slottato dentro `<label>` ✅; help-text collegato con `aria-describedby="help-text"` ✅; icone `sl-icon` senza `label` → `aria-hidden="true"` ✅. Nessun modo di dare un nome senza testo visibile (SL-CHECKBOX-02); `aria-checked` non diventa mai `mixed`. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | ID `help-text` nello stesso shadow root ✅. `aria-label`/`aria-describedby` sull'host restano sull'host (nessun ruolo) e `<label for>` esterna non si associa: SHARED (§2) → SL-CHECKBOX-03. Nessun tabindex sull'host, un solo tab stop ✅. |
| 4 | Tastiera e focus | ✅ | Space nativo (testato in `checkbox.test.ts:73`); `:focus-visible` con `outline: var(--sl-focus-ring)` sul control (styles r. 81-84, 101-105) → 6.21:1 light / 10.27:1 dark, resta visibile in forced-colors (outline). `disabled` nativo. |
| 5 | Form e validazione | ⚠️ | `required` nativo ✅, `name/value/form` ✅. Nessun `aria-invalid` derivato da `data-user-invalid` e nessun messaggio d'errore programmatico (SL-CHECKBOX-04). Asterisco di required via `::after` entra nel nome accessibile (SL-CHECKBOX-07). |
| 6 | Live region | N/A | Nessun feedback dinamico. |
| 7 | Aspetti visivi | ⚠️ | Bordo `--sl-input-border-color` light neutral-400 3.21:1 / dark neutral-500 3.48:1 ✅; fill checked primary-600 6.21:1 ✅. Target alto 14/16/20px anche con label (SL-CHECKBOX-05); nessuna media query `forced-colors` (SL-CHECKBOX-06); transizioni/scale non ridotte (SHARED-05). |
| 8 | API pubblica a11y | ❌ | Mancano `label`/`aria-label`, `aria-describedby`, `aria-invalid`/`error-message` passthrough; nessun warning in dev mode. |
| 9 | Documentazione e test | ⚠️ | 1 solo test axe sullo stato di default (`checkbox.test.ts:10-13`); test Space ✅; nessun test su `mixed`, disabled+axe, required+axe. Docs senza sezione Accessibility (SL-CHECKBOX-08). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-CHECKBOX-01 | Alta | 1/5 | `aria-checked` esplicito su input nativo: con `indeterminate` vale `"false"` invece di `"mixed"`, contraddicendo `input.indeterminate=true`. Ridondante e vietato (ARIA in HTML: authors MUST NOT use aria-checked on input type=checkbox); a seconda del browser lo stato misto può essere annunciato come "non selezionato". | src/components/checkbox/checkbox.component.ts:215 `aria-checked=${this.checked ? 'true' : 'false'}` + r. 211 `.indeterminate=${live(this.indeterminate)}` | WCAG 4.1.2; APG Checkbox (mixed); ARIA in HTML | Rimuovere `aria-checked`: lo stato (incluso mixed) è esposto nativamente da `.checked`/`.indeterminate`. |
| SL-CHECKBOX-02 | Media | 2/8 | Nessuna property per un nome accessibile senza testo visibile (es. checkbox "seleziona riga" in tabella). `aria-label` sull'host resta su un elemento senza ruolo; unica via è `<sl-visually-hidden>` nello slot (non documentata). Nessun warning dev se manca il nome. | src/components/checkbox/checkbox.component.ts:205-222 (input senza `aria-label`), 247-249 (slot unico nome) | WCAG 4.1.2, 2.5.3 | Aggiungere `@property() label` → `aria-label=${ifDefined(this.label \|\| undefined)}` sull'input; warning dev se slot vuoto e `label` assente. |
| SL-CHECKBOX-03 | Media | 3 | Componente non form-associated: `<label for>` esterna e `aria-describedby`/`aria-labelledby` del consumer (light DOM) non raggiungono l'input interno (rimando SHARED §2). | src/components/checkbox/checkbox.component.ts:43 (nessun `formAssociated`/`attachInternals`) | WCAG 1.3.1, 4.1.2 | Pattern FACE + `delegatesFocus` (shared context §10) o property `aria-describedby` riflessa sull'input. |
| SL-CHECKBOX-04 | Media | 5 | Stato di errore non esposto: `data-user-invalid` non produce `aria-invalid` sull'input; nessuna property/slot `error-message` associata via `aria-describedby`/`aria-errormessage`; l'errore è solo il tooltip nativo di `reportValidity()`. (consumer: può solo aggiungere testo nel `help-text`.) | src/components/checkbox/checkbox.component.ts:205-222, 126-129 (`handleInvalid` non tocca ARIA) | WCAG 3.3.1, 4.1.2 | `aria-invalid=${this.hasAttribute('data-user-invalid') ? 'true' : 'false'}` (reattivo) + property `error-message` in un elemento con id referenziato da `aria-describedby`. |
| SL-CHECKBOX-05 | Media | 7 | Target size: control 14/16/20px (`--sl-toggle-size-*`) e `.checkbox__label { line-height: var(--toggle-size) }` → l'intero `<label>` cliccabile è alto solo 14/16/20px anche con testo (larghezza ok). Conforme solo con l'eccezione "spacing" (checkbox isolati o con gap ≥ 8px); in elenchi verticali compatti e senza testo il target è < 24×24. | src/components/checkbox/checkbox.styles.ts:19-31, 40-41 `width: var(--toggle-size)`, 116 `line-height: var(--toggle-size)` | WCAG 2.5.8 | `.checkbox { min-block-size: 24px; align-items: center }` oppure area di hit estesa con pseudo-elemento `::before { inset: -5px }` sul control. |
| SL-CHECKBOX-06 | Bassa | 7 | Nessuna media query `forced-colors`: il fill checked (`background-color: primary-600`) viene annullato; resta solo l'icona (currentColor) — leggibile ma il contrasto checked/unchecked si riduce, e il control disabled (opacity) non usa `GrayText`. | src/components/checkbox/checkbox.styles.ts:87-91, 108-111 | WCAG 1.4.11 (forced colors) | `@media (forced-colors: active) { .checkbox--checked .checkbox__control, .checkbox--indeterminate .checkbox__control { background-color: Highlight; border-color: Highlight; color: HighlightText } .checkbox--disabled { color: GrayText } }` |
| SL-CHECKBOX-07 | Bassa | 2/7 | L'asterisco di required è generato con `::after { content: '*' }` dentro il `<label>`: entra nel nome accessibile ("Accetto *") e lo stato required è già esposto da `required` nativo. | src/components/checkbox/checkbox.styles.ts:122-126; src/themes/light.css:467 | WCAG 1.3.1 (qualità nome) | `content: var(--sl-input-required-content) / ''` (alt text vuoto per generated content) dove supportato, o elemento `aria-hidden` nel template. |
| SL-CHECKBOX-08 | Bassa | 9 | Test axe solo sullo stato base; nessun test per indeterminate (stato mixed esposto), disabled, required, help-text. Docs senza sezione Accessibility né esempio di nome senza testo visibile. | src/components/checkbox/checkbox.test.ts:10-13, 352-368; docs/pages/components/checkbox.md | Qualità / WCAG 4.1.2 | Aggiungere `to.be.accessible()` per indeterminate/disabled/required/help-text e asserzione `input.indeterminate === true` + assenza di `aria-checked`. |
| SL-CHECKBOX-09 | Suggerimento | 1 | Con `checked` e `indeterminate` entrambi `true` la UI mostra la spunta (r. 230-235) ma l'input nativo resta `indeterminate` (esposto come mixed): stato visivo e programmatico divergono. | src/components/checkbox/checkbox.component.ts:211-212, 230-245 | WCAG 4.1.2 | In `handleStateChange` azzerare `indeterminate` quando `checked` passa a true, o mostrare l'icona mixed se `indeterminate`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| slot default (label) | Sì | Sì (dentro `<label>`) | Unica fonte del nome |
| `label` / `aria-label` | No | — | Da aggiungere, riflessa sull'input |
| `aria-labelledby` / `aria-describedby` | No | — | Da host resta sull'host |
| `help-text` / slot `help-text` | Sì | Sì (`aria-describedby="help-text"`) | OK |
| `aria-invalid` / `error-message` | No | — | Da aggiungere |
| `required` | Sì | Sì (nativo) | Asterisco nel nome (SL-CHECKBOX-07) |
| `indeterminate` | Sì | Parziale | `aria-checked` errato lo sovrascrive (SL-CHECKBOX-01) |
| `disabled` | Sì | Sì (nativo) | — |
| `title` | Sì | Sì | — |
| `name` / `value` / `form` | Sì | Sì | — |

### Fix proposti
```ts
// checkbox.component.ts
/** Nome accessibile quando il checkbox non ha testo visibile. */
@property() label = '';
/** Messaggio d'errore annunciato quando il controllo è invalido. */
@property({ attribute: 'error-message' }) errorMessage = '';

@watch('checked', { waitUntilFirstUpdate: true })
handleCheckedChange() {
  if (this.checked) this.indeterminate = false; // allinea visivo e programmatico (SL-CHECKBOX-09)
}

render() {
  const invalid = this.hasAttribute('data-user-invalid');
  return html`
    <input
      class="checkbox__input"
      type="checkbox"
      .indeterminate=${live(this.indeterminate)}
      .checked=${live(this.checked)}
      aria-label=${ifDefined(this.label || undefined)}
      aria-invalid=${invalid ? 'true' : 'false'}
      aria-describedby="help-text ${this.errorMessage ? 'error-message' : ''}"
      ...
    />
    <!-- NIENTE aria-checked -->
    ...
    <div id="error-message" class="form-control__error" ?hidden=${!this.errorMessage}>${this.errorMessage}</div>
  `;
}
```
```css
/* checkbox.styles.ts */
.checkbox { min-block-size: 24px; align-items: center; }
:host([required]) .checkbox__label::after { content: var(--sl-input-required-content) / ''; }
@media (forced-colors: active) {
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control { background-color: Highlight; border-color: Highlight; color: HighlightText; }
  .checkbox--disabled { color: GrayText; opacity: 1; }
}
```

### Non verificabile
- Annuncio reale dello stato indeterminate con `aria-checked="false"` + `input.indeterminate=true` (NVDA/JAWS/VoiceOver su Chrome, Safari, Firefox): serve test con screen reader.
- Nome accessibile composto dal testo slottato attraverso il `<label>` shadow in Safari/VoiceOver: verifica manuale.
- Contrasto con colori custom passati dal consumer via CSS parts (`control`, `checked-icon`).
