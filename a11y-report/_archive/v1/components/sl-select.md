## Select (`sl-select` – src/components/select/select.component.ts)
**Pattern APG di riferimento:** APG Select-Only Combobox (combobox + listbox, single e multi-select); APG Listbox (multi-selezione, gruppi).
**Esito sintetico:** ❌ Non conforme — struttura combobox/listbox corretta e tastiera principale funzionante, ma stato `required` e `invalid` non esposti sul combobox, nome non passabile dall'host, valore non svuotabile da tastiera, `readonly` che fa annunciare "sola lettura", gruppi non semantici.
**Conteggio finding:** Blocker 0 · Alta 4 · Media 6 · Bassa 6 · Suggerimento 2

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<input role="combobox">` (r. 855-876) con `aria-controls="listbox"`, `aria-expanded`, `aria-haspopup="listbox"`; `role="listbox"` con `aria-multiselectable` (r. 917-930); le `sl-option` (role `option` sull'host, light DOM) sono figlie nel flat tree del listbox ✅. `<small>` e `sl-divider` (separator) come figli del listbox non sono `group`/`option` (SL-SELECT-09). `readonly` nativo sul combobox espone `aria-readonly` (SL-SELECT-05). |
| 2 | Nome, descrizione, stato | ❌ | Nome via `aria-labelledby="label"` ✅ ma solo da `label`/slot (SL-SELECT-01). `aria-required` assente sul combobox (`required` solo sull'input nascosto `aria-hidden`) (SL-SELECT-02). `aria-invalid` assente (SL-SELECT-03). `aria-expanded`/`aria-disabled` ✅. Valore esposto via `.value=${this.displayLabel}` ✅ (multi: "N opzioni selezionate", localizzato). Icone expand/clear decorative ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-controls`, `aria-labelledby`, `aria-describedby` puntano a ID dello stesso shadow root ✅. **`aria-activedescendant` non è usato**: il focus DOM viene spostato sull'`sl-option` (r. 581), quindi nessun riferimento ID attraversa il confine. Se si passasse ad `aria-activedescendant` (APG), un attributo ID sull'`<input>` nello shadow root **non** potrebbe puntare alle `sl-option` nel light DOM (tree scope diverso); servirebbe `input.ariaActiveDescendantElement = option` (element reflection: consentito verso elementi di un albero antenato). `aria-*` dell'host non propagati (SHARED §2). |
| 4 | Tastiera e focus | ⚠️ | Enter/Space aprono e confermano, ↑/↓/Home/End navigano, type-ahead, Esc chiude e riporta il focus al combobox (r. 312-317, CloseWatcher r. 258-267), Tab chiude (focusin esterno r. 293-299) ✅. Multi: Enter/Space alternano senza chiudere ✅. Clear non raggiungibile e nessuna alternativa per svuotare (SL-SELECT-04). Focus DOM spostato sulle option (SL-SELECT-06). Focus ring box-shadow/`outline: none`, niente forced-colors (SL-SELECT-10). |
| 5 | Form e validazione | ❌ | `name`, `required`, `form` ✅ come attributi, ma required/errore non comunicati al combobox (SL-SELECT-02/03); nessun `error-message` (SL-SELECT-07); validazione nativa ancorata a un input `aria-hidden` (r. 880-890). |
| 6 | Live region | ⚠️ | Selezione annunciata tramite focus sull'option + `aria-selected` (da verificare con SR). Nessun annuncio per rimozione tag, clear, errori. |
| 7 | Aspetti visivi (statici) | ⚠️ | Testo display 9.12:1 ✅, label 12.51:1 ✅. Label gruppo `<small>` neutral-500 su panel dark 2.95:1 ❌ (SL-SELECT-11). Clear button ~14×14px dentro il combobox (SL-SELECT-13). Animazioni apertura via `animateTo` (reduced motion ✅); rotazione expand-icon via `transition` CSS (SHARED-05). |
| 8 | API pubblica a11y | ⚠️ | `label`, `help-text`, `placeholder` ✅; `getTag` per personalizzare i tag. Mancano `aria-label` passthrough, `invalid`, `error-message`, label clear/remove sovrascrivibili. |
| 9 | Documentazione e test | ⚠️ | Docs: nota corretta sui `<small>` non annunciati (select.md:525) ma molti esempi senza label (SL-SELECT-14). Test: axe chiuso e aperto (select.test.ts:13-35) ✅, tastiera Space/ArrowDown/Enter (r. 137-166) ✅; mancano axe multi/tag/clear, test Esc/Home/End/type-ahead completi, asserzioni `aria-expanded`/`aria-selected` (SL-SELECT-15). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-SELECT-01 | Alta | Nome / Shadow DOM | Il nome del combobox è fisso a `aria-labelledby="label"`: viene solo da `label`/slot `label`. `aria-label`/`aria-labelledby` dell'host non propagati, `<label for>` esterne non associabili (SHARED §2). Senza label il riferimento punta a un `<label>` vuoto: nome vuoto o fallback al placeholder a seconda del browser. Nessun warning dev. | src/components/select/select.component.ts:176 `label`; r. 817-825 `<label id="label" … aria-hidden=…>`; r. 869 `aria-labelledby="label"` | WCAG 4.1.2, 1.3.1, 3.3.2 | `accessibleLabel` (attr `aria-label`) applicato al combobox e al listbox quando non c'è `label`; `aria-labelledby` solo se `hasLabel`; warning dev. |
| SL-SELECT-02 | Alta | Stato / Form | `required` è applicato solo all'input nascosto `aria-hidden="true"`; il combobox focusabile non espone `aria-required`: chi usa uno screen reader non sa che il campo è obbligatorio (l'asterisco è solo visivo). | select.component.ts:855-876 (nessun `aria-required`); r. 880-890 `?required=${this.required} … aria-hidden="true"` | WCAG 1.3.1, 3.3.2, 4.1.2 | `aria-required=${this.required ? 'true' : 'false'}` sul combobox. |
| SL-SELECT-03 | Alta | Stato | `aria-invalid` mai impostato (né con `status="danger"` né con `data-user-invalid`); l'errore è solo visivo. | select.component.ts:170 `status`; r. 855-876 | WCAG 4.1.2, 3.3.1, 1.4.1 | `aria-invalid` sul combobox calcolato da `status === 'danger'` o stato user-invalid. |
| SL-SELECT-04 | Alta | Tastiera | Il clear button ha `tabindex="-1"` e non esiste scorciatoia (Delete/Backspace a listbox chiuso escono subito): in single select con `clearable` l'utente da tastiera non può tornare al valore vuoto. | select.component.ts:894-902 `<button part="clear-button" … tabindex="-1">`; r. 399-403 `if (event.key === 'Backspace') { return; }` | WCAG 2.1.1 | Gestire `Delete`/`Backspace` sul combobox chiuso quando `clearable` (chiama `handleClearClick`) e/o rendere il bottone focusabile. |
| SL-SELECT-05 | Media | Stato | Il display input ha `readonly` nativo e `role="combobox"`: viene esposto `aria-readonly="true"` e diversi screen reader annunciano "sola lettura", suggerendo che il campo non sia modificabile. | select.component.ts:865 `readonly`; r. 872 `role="combobox"` | WCAG 4.1.2 | Rimuovere `readonly` e bloccare l'input testuale via `keydown`/`beforeinput` (già gestito: `preventDefault` sui caratteri stampabili r. 408-409), oppure `aria-readonly="false"` esplicito. |
| SL-SELECT-06 | Media | Tastiera / Focus | Modello di focus diverso dall'APG Select-Only Combobox: all'apertura e durante la navigazione il focus DOM viene spostato sull'`sl-option` (`option.focus()`), il combobox perde il focus (`hasFocus=false` → anello di focus del combobox sparisce) e i tasti sono gestiti da un listener su `document`. Shift+Tab da un'option torna al combobox lasciando il listbox aperto. Non viene usato `aria-activedescendant` (vedi checklist #3 per il vincolo cross-shadow). | select.component.ts:567-583 `option.tabIndex = 0; option.focus();`; r. 710, 721-723; r. 249-250 listener su `document`; r. 288-291 | APG Select-Only Combobox (DOM focus resta sul combobox), WCAG 2.4.7 | Mantenere il focus sul combobox e usare `this.displayInput.ariaActiveDescendantElement = option` (element reflection) con fallback all'attuale comportamento dove non supportato; chiudere su Shift+Tab. |
| SL-SELECT-07 | Media | Form / Live region | Nessun `error-message`: l'errore va in `help-text`; non annunciato, `aria-errormessage` non usabile; `aria-describedby="help-text"` sempre presente; il messaggio di validazione nativo è ancorato a un input `aria-hidden`. | select.component.ts:185 `helpText`; r. 871 `aria-describedby="help-text"`; r. 880-890; r. 934-941 | WCAG 3.3.1, 3.3.3, 4.1.3 | Prop/slot `error-message` con live region e riferimenti condizionali (come SL-INPUT-03). |
| SL-SELECT-08 | Media | Nome (multiselect) | I tag rimovibili usano `sl-tag removable`, il cui bottone ha nome generico localizzato "Rimuovi" uguale per tutti i tag (senza il nome dell'opzione) e host `tabindex="-1"` (non tabbabile). Utenti SR in modalità lettura/touch trovano N bottoni "Rimuovi" indistinguibili. Alternativa da tastiera: deselezionare l'opzione nel listbox ✅. | select.component.ts:202-220 `<sl-tag … removable …>${option.getTextLabel()}</sl-tag>`; src/components/tag/tag.component.ts:62-71 `label=${this.localize.term('remove')} … tabindex="-1"` | WCAG 2.4.6, 4.1.2 | Esporre in `sl-tag` una `remove-label` e passare `${localize.term('remove')} ${option.getTextLabel()}`; documentare l'alternativa da tastiera. |
| SL-SELECT-09 | Media | Semantica (gruppi) | I gruppi sono solo visivi: `<small>` come intestazione e `sl-divider` (`role="separator"`) sono figli diretti del listbox, senza `role="group"` + `aria-labelledby`; gli SR non annunciano il gruppo (lo ammette anche la doc). `<small>`/separator non sono figli ammessi di `listbox`. | src/components/select/select.styles.ts:335-344 (`::slotted(small)`, `::slotted(sl-divider)`); docs/pages/components/select.md:525 "they won't be announced by most assistive devices" | WCAG 1.3.1; APG Listbox (grouped options) | Nuovo `sl-option-group` con `role="group"` e `aria-label`/label slot; in alternativa supportare `<div role="group" aria-label>` slottato. |
| SL-SELECT-10 | Media | Focus / Forced colors | Focus del combobox reso con box-shadow 40% + cambio bordo; `outline: none` sul display input e sul clear; nessuna media query `forced-colors`. | select.styles.ts:76-78 `.select__display-input:focus { outline: none; }`; r. 136-140 box-shadow; r. 297-299 | WCAG 2.4.7, 1.4.11; SHARED-01, SHARED-02 | Focus ring pieno + `@media (forced-colors: active) { .select--focused .select__combobox { outline: 2px solid Highlight; } }`. |
| SL-SELECT-11 | Bassa | Contrasto | Intestazione gruppo `<small>` in neutral-500: dark su `--sl-panel-background-color` (neutral-100) = 2.95:1 (light su neutral-0 4.71 ✅). | select.styles.ts:339-344 `color: var(--sl-color-neutral-500);` | WCAG 1.4.3 | Usare neutral-600 (dark 4.83:1, light 6.63:1). |
| SL-SELECT-12 | Bassa | Nome (multiselect) | Il tag di overflow mostra solo "+n" senza contesto testuale (es. "+2 altre opzioni"). | select.component.ts:654-657 `<sl-tag size=${this.size}>+${this.selectedOptions.length - index}</sl-tag>` | WCAG 1.3.1, 2.4.6 | Aggiungere testo visualmente nascosto/term localizzato (es. `numOptionsSelected`) al tag di overflow. |
| SL-SELECT-13 | Bassa | Target size | Il clear button non ha larghezza/altezza minima (padding 0, dimensione = icona ~1em ≈ 13-16px) ed è annidato nel target del combobox. | select.styles.ts:280-291 `.select__clear { … padding: 0; … }`; r. 174, 203, 232 (solo `margin-inline-start`) | WCAG 2.5.8 | `min-width: 24px; min-height: 24px;` (o larghezza `calc(1em + spacing*2)` come in `sl-input`). |
| SL-SELECT-14 | Bassa | Documentazione | Molti esempi senza label (Default, Clearable, Filled, Pill, Grouping, Placement) o con solo placeholder (Placeholders, Disabled, Sizes, Prefix/Suffix); nessuna sezione "Accessibility" (tastiera, multiselect, limiti dei gruppi). (consumer seguirà gli esempi) | docs/pages/components/select.md:9, 156, 200, 244, 288, 378, 481, 528, 588-604, 682, 726-742 | WCAG 3.3.2, 4.1.2 | Aggiungere `label` a tutti gli esempi + sezione "Accessibility". |
| SL-SELECT-15 | Bassa | Test | Axe solo per single select chiuso/aperto; nessun axe per `multiple` con tag, `clearable`, `status`, `disabled`, gruppi; nessun test per Esc, Home/End, ritorno del focus, `aria-expanded`/`aria-selected`/`aria-required`. | src/components/select/select.test.ts:13-35, 137-166 | Qualità (APG Combobox) | Aggiungere test di stato e tastiera. |
| SL-SELECT-16 | Suggerimento | Semantica | ARIA ridondante: `aria-expanded` sul listbox (lo stato appartiene al combobox), `aria-haspopup="listbox"` (implicito per combobox), `aria-disabled` insieme a `.disabled` nativo. | select.component.ts:868, 870, 920 `aria-expanded=${this.open ? 'true' : 'false'}` (listbox) | ARIA 1.2 / first rule of ARIA | Rimuovere `aria-expanded` dal listbox; lasciare l'`aria-haspopup` solo se serve per AT legacy. |
| SL-SELECT-17 | Suggerimento | Tastiera | Non gestiti PageUp/PageDown (salto di più opzioni) né Backspace/Delete per rimuovere l'ultimo tag in multiselect; Alt+↑ per chiudere confermando non gestito. | select.component.ts:356-388 (solo ArrowUp/ArrowDown/Home/End) | APG Select-Only Combobox (tasti opzionali) | Aggiungere PageUp/PageDown (±10) e Alt+↑. |
| SL-SELECT-18 | Bassa | Nome | L'asterisco required (`::after { content }`) della `<label id="label">` entra nel nome calcolato via `aria-labelledby`. | src/styles/form-control.styles.ts:32-36 | WCAG 2.5.3, 1.3.1 | `content: var(--sl-input-required-content) / '';` |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` / slot `label` | ✅ | ✅ `aria-labelledby="label"` su combobox e listbox | Riferimento presente anche senza label. |
| `help-text` / slot | ✅ | ✅ `aria-describedby="help-text"` | Renderlo condizionale. |
| `placeholder` | ✅ | ✅ | — |
| `aria-label` / `aria-labelledby` | ❌ | ❌ restano sull'host | SL-SELECT-01. |
| `aria-required` | ❌ (solo `required` su input nascosto) | ❌ | SL-SELECT-02. |
| `aria-invalid` / `invalid` | ❌ | ❌ | SL-SELECT-03. |
| `aria-errormessage` / `error-message` | ❌ | ❌ | SL-SELECT-07. |
| `aria-expanded` / `aria-controls` / `aria-haspopup` | ✅ interni | ✅ | Gestiti dal componente. |
| `aria-activedescendant` | ❌ | — | Non usato (focus DOM sulle option); se introdotto richiede element reflection. |
| `aria-multiselectable` | ✅ | ✅ | — |
| Label clear button | ⚠️ solo localizzata (`clearEntry`) | ✅ | `clear-label` (SHARED-06). |
| Label rimozione tag | ⚠️ "Remove" generico | ❌ senza nome opzione | `remove-label` in `sl-tag` + `getTag`. |
| `tabindex` | ❌ | — | — |

### Fix proposti
```ts
// select.component.ts — combobox
<input
  part="display-input"
  class="select__display-input"
  type="text"
  placeholder=${this.placeholder}
  .disabled=${this.disabled}
  .value=${this.displayLabel}
  autocomplete="off"
  spellcheck="false"
  autocapitalize="off"
  role="combobox"
  aria-controls="listbox"
  aria-expanded=${this.open ? 'true' : 'false'}
  aria-labelledby=${ifDefined(hasLabel ? 'label' : undefined)}
  aria-label=${ifDefined(!hasLabel ? this.accessibleLabel || undefined : undefined)}
  aria-required=${this.required ? 'true' : 'false'}
  aria-invalid=${invalid ? 'true' : 'false'}
  aria-describedby=${ifDefined(describedBy || undefined)}
  @beforeinput=${(e: InputEvent) => e.preventDefault()}
  @focus=${this.handleFocus}
  @blur=${this.handleBlur}
/>

// Tastiera: svuotamento con Delete/Backspace a listbox chiuso
if ((event.key === 'Delete' || event.key === 'Backspace') && !this.open && this.clearable && this.value.length > 0) {
  event.preventDefault();
  this.handleClearClick(event as unknown as MouseEvent);
  return;
}

// Focus sul combobox + element reflection (APG), fallback all'attuale option.focus()
private setCurrentOption(option: SlOption | null) {
  this.getAllOptions().forEach(el => { el.current = false; el.tabIndex = -1; });
  if (!option) return;
  this.currentOption = option;
  option.current = true;
  if ('ariaActiveDescendantElement' in Element.prototype) {
    (this.displayInput as any).ariaActiveDescendantElement = option; // ok: option è in un albero antenato
    scrollIntoView(option, this.listbox, 'vertical', 'auto');
  } else {
    option.tabIndex = 0;
    option.focus();
  }
}

// Tag con nome contestuale
getTag = (option: SlOption) => html`<sl-tag … removable
  remove-label=${`${this.localize.term('remove')} ${option.getTextLabel()}`}>${option.getTextLabel()}</sl-tag>`;
```
```css
/* select.styles.ts */
.select__clear { min-width: 24px; min-height: 24px; }
.select__listbox ::slotted(small) { color: var(--sl-color-neutral-600); }
@media (forced-colors: active) {
  .select--focused .select__combobox { outline: 2px solid Highlight; outline-offset: 1px; }
}
```

### Non verificabile
- Annuncio effettivo con NVDA/JAWS/VoiceOver del modello "focus sulle option" (contesto listbox, posizione "n di m", stato selezionato in multiselect) e di `readonly` sul combobox.
- Fallback del nome quando `aria-labelledby` punta a una `<label>` vuota (placeholder usato o meno a seconda del browser).
- Supporto di `ariaActiveDescendantElement` nei browser target del consumer (necessario per l'eventuale fix APG).
- Resa del messaggio di validazione nativo ancorato all'input `aria-hidden` (tooltip e annuncio).
- Contrasto di contenuti custom in `prefix`/`suffix`/`getTag` forniti dal consumer.
