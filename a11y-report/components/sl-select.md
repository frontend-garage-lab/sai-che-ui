## Select (`sl-select` – src/components/select/select.component.ts)
**Pattern APG di riferimento:** APG Select-Only Combobox (combobox + listbox, single/multi); APG Listbox (gruppi).
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 4 · Bassa 3
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | `combobox "Paese" [expanded controls=[listbox]]` + `listbox "Paese" [multiselectable=false]` con `option` figli; `readonly` del display input **non** esposto da Chromium sul combobox (nessuna proprietà `readonly` nell'albero). |
| 2 | Nome/descrizione/stato | ⚠️ | `label` → `combobox "Paese *"`, slot → `combobox "Città"`, solo placeholder → `combobox "Solo placeholder"` ✅, help text → `desc="Scegli uno"` ✅, valore → `value="Francia"` / multi `value="3 options selected"` (term localizzato) ✅, disabled → `disabled` ✅. `required` → combobox `required=false` (SL-SELECT-02). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-labelledby`/`aria-controls`/`aria-describedby` interni funzionano. `aria-label` sull'host → `generic "Host"` + `combobox` senza nome: miglioramento (workaround `label` + `::part(form-control-label)` visually-hidden → `combobox "Ordina per"`). |
| 4 | Tastiera e focus | ⚠️ | Tab → display input; Enter/Space aprono; ↑/↓/Home/End/type-ahead muovono il focus DOM sull'option (`option "Spagna" [focused selected=false]`); Enter seleziona e chiude, focus torna al combobox (`value="Francia"`, `sl-change`); Esc chiude senza cambiare valore e riporta il focus; Tab chiude ed esce. Multi: Enter alterna la selezione senza chiudere. Clear non raggiungibile e Delete/Backspace non svuotano (SL-SELECT-04). Shift+Tab da un'option torna al combobox lasciando il listbox aperto (miglioramento). |
| 5 | Form e validazione | ⚠️ | `reportValidity()` con required vuoto → `false`, focus spostato sul combobox ✅; `invalid="false"` come per i controlli nativi con `valueMissing`. `required` non esposto sul combobox (SL-SELECT-02). |
| 6 | Live region | N/A | Selezione comunicata dal focus sull'option e dal valore del combobox. |
| 7 | Aspetti visivi | ⚠️ | Light: valore 9.07, placeholder 4.71, opzione 12.50, check 6.18, `<small>` 4.71, bordo focus 3.07 ✅; placeholder `filled` 4.26 ❌ (SL-SELECT-V01). Dark: `<small>` 2.96 ❌ (SL-SELECT-11), clear `filled` 2.96 ❌ (SL-SELECT-V02). Clear 14×14px (SL-SELECT-13). Forced colors: focus del combobox invisibile (SL-SELECT-10). Indicatori dell'opzione corrente: vedi `sl-option`. |
| 8 | API pubblica a11y | ⚠️ | `label`, `help-text`, `placeholder`, `getTag`; nessun `aria-label`/`aria-required` passthrough. |
| 9 | Docs e test | ⚠️ | Esempio Default senza label né placeholder (select.md:9) → `combobox` senza nome; gruppi con `<small>` non semantici (select.md:525 lo ammette). Test axe chiuso/aperto (select.test.ts:13-35). Miglioramento. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-SELECT-02 | Media | Stato | `required` è applicato solo all'input nascosto `aria-hidden`; il combobox focusabile non espone lo stato obbligatorio (l'unico indizio è l'asterisco CSS nel nome, che il consumer può anche rimuovere col token). Il consumer non può aggiungerlo (`aria-*` sull'host non arriva al combobox). | src/components/select/select.component.ts:855-876 (nessun `aria-required`); 880-890 (`?required` r. 884, `aria-hidden="true"` r. 887) | runtime: `<sl-select label="Paese" required>` → `combobox "Paese *" [… required=false …]` (sl-input equivalente → `textbox "Req *" [required]`) | WCAG 1.3.1, 4.1.2 | `aria-required=${this.required ? 'true' : 'false'}` sul combobox. |
| SL-SELECT-04 | Media | Tastiera | Con `clearable` (single select) il valore non può essere svuotato da tastiera: il clear ha `tabindex="-1"` e Delete/Backspace a listbox chiuso escono senza azione; il listbox non offre un'opzione vuota. | select.component.ts:894-906 (`tabindex="-1"` r. 901); 399-403 (`if (event.key === 'Backspace') return;`) | runtime: `focus:#a ;; key:Delete ;; key:Backspace` → `value "fr"`; `Tab` → `button#post` (clear saltato) | WCAG 2.1.1 | Delete/Backspace a listbox chiuso con `clearable` → `handleClearClick`; e/o clear focusabile. |
| SL-SELECT-10 | Media | Focus (forced colors) | In forced colors il combobox focalizzato non ha alcun indicatore: bordo forzato invariato, box-shadow rimosso, `outline: none`; il display input è `readonly` (nessun caret di inserimento). | select.styles.ts:76-78 (`outline: none`), 136-140 (box-shadow); nessuna `@media (forced-colors)` | runtime `forcedcolors` + Tab: `focus: sl-select#a > input[part=display-input]`, `.select__combobox borderTopColor = rgb(0,0,0)`, `outlineStyle = none`, `boxShadow = none` | WCAG 2.4.7 | `@media (forced-colors: active) { .select--focused .select__combobox { outline: 2px solid Highlight; outline-offset: 1px; } }` |
| SL-SELECT-11 | Media | Contrasto | Intestazioni di gruppo `<small>` (uso documentato "Grouping Options") in neutral-500 sul pannello dark: 2.96:1. | select.styles.ts:339-344 (`color: var(--sl-color-neutral-500)` r. 343) | runtime dark: `#a small → #636e74 su #1f2528 = 2.96:1` (light 4.71 ✅) | WCAG 1.4.3 | `color: var(--sl-color-neutral-600)`. |
| SL-SELECT-13 | Bassa | Target size | Clear button 14×14px, annidato nel combobox (il cerchio di 24px interseca il target del combobox) e senza alternativa equivalente per svuotare. | select.styles.ts:280-291 (`padding: 0` r. 288) | runtime: `size #a >>> .select__clear: 14.0x14.0 px` | WCAG 2.5.8 | `min-width: 24px; min-height: 24px;` |
| SL-SELECT-V01 | Bassa | Contrasto | Placeholder variante `filled`, tema light: 4.26:1. | select.styles.ts:68-69, 143-145 | runtime: `::placeholder rgb(108,117,122) su rgb(242,244,245) = 4.26:1` (dark 4.86 ✅) | WCAG 1.4.3 | Placeholder `filled` = neutral-600. |
| SL-SELECT-V02 | Bassa | Contrasto UI | Icona clear (`--sl-input-icon-color`) variante `filled`, tema dark: 2.96:1. | select.styles.ts:280-286 (`color: var(--sl-input-icon-color)`); src/themes/dark.css:485 | runtime dark: `#cf >>> .select__clear → #636e74 su #1f2528 = 2.96:1` (standard 3.49 ✅) | WCAG 1.4.11 | Token icona `filled` dark = neutral-600. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-SELECT-01 | miglioramento | Passthrough `aria-label` (oggi `generic "Host"` + combobox senza nome); workaround verificato: `label` + `::part(form-control-label)` visually-hidden. Placeholder già usato come nome. | select.component.ts:817-825, 869 |
| SL-SELECT-03 | miglioramento | `aria-invalid` per `status="danger"`/user-invalid (testo d'errore via help text già in descrizione). | select.component.ts:855-876 |
| SL-SELECT-07 | miglioramento | `error-message` dedicato, `aria-describedby` condizionale. | select.component.ts:871, 934-941 |
| SL-SELECT-08 | miglioramento | Tag rimovibili: tutti `button "Remove"` (it "Rimuovi") e non tabbabili; alternativa da tastiera verificata (Enter sull'option nel listbox deseleziona: `["g","b"]`). Suggerito nome contestuale "Rimuovi Rosso". | select.component.ts:202-220 |
| SL-SELECT-09 | miglioramento | Gruppi con `<small>`/`sl-divider` non semantici (`text "Europa"`, `separator` nel listbox). Workaround verificato: `<div role="group" aria-labelledby>` slottato → `group "Europa"` con option funzionanti; documentarlo o creare `sl-option-group`. | select.styles.ts:335-344; docs/pages/components/select.md:525 |
| SL-SELECT-06 | da-verificare-AT | Modello focus DOM sull'option (non `aria-activedescendant`): in Chromium l'option riceve `focused` con nome e `selected`; resa con SR da verificare. | select.component.ts:567-583 |
| SL-SELECT-05 | da-verificare-AT | `readonly` sul combobox non esposto da Chromium; verificare annuncio "sola lettura" in Firefox/Safari. | select.component.ts:865 |
| SL-SELECT-12 | miglioramento | Tag "+1" privo di contesto; il conteggio è già nel valore del combobox (`"3 options selected"`). | select.component.ts:654-657 |
| SL-SELECT-16 | miglioramento | `aria-expanded` ridondante sul listbox. | select.component.ts:920 |
| SL-SELECT-17 | miglioramento | PageUp/PageDown, Alt+↑ opzionali APG. | select.component.ts:356-388 |
| SL-SELECT-18 | miglioramento | Asterisco nel nome: coerente con l'etichetta visibile (lo stato va esposto: SL-SELECT-02). | src/styles/form-control.styles.ts:32-36 |
| SL-SELECT-14 | miglioramento | Docs: label in tutti gli esempi + sezione Accessibility (tastiera, gruppi, label nascosta). | docs/pages/components/select.md:9-742 |
| SL-SELECT-15 | miglioramento | Test: multi/tag/clear/required, Esc/Home/End, `aria-expanded`. | src/components/select/select.test.ts:13-35, 137-166 |
| SL-SELECT-M01 | miglioramento | Shift+Tab da un'option riporta il focus al combobox con listbox ancora aperto (`open: true`); chiuderlo. | select.component.ts:293-299 |

### Responsabilità del consumer
- Fornire `label` (o almeno `placeholder`); l'esempio Default senza entrambi produce un combobox senza nome.
- Usare `<div role="group" aria-labelledby>` per gruppi significativi; icone in prefix/suffix e `getTag` personalizzati accessibili.

### Da verificare con AT reali
- NVDA/JAWS/VoiceOver: annuncio del focus spostato sull'option (contesto listbox, "n di m", stato selezionato in multi).
- Annuncio del messaggio di validazione nativo ancorato all'input nascosto dopo `reportValidity()`.
- Firefox/Safari: esposizione di `readonly` sul combobox.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-SELECT-01 | Alta | riclassificato | Workaround label + `::part` verificato; placeholder nomina il combobox. |
| SL-SELECT-02 | Alta | ridimensionato | Media: `required=false` sul combobox confermato; stato di un campo, asterisco presente nel nome. |
| SL-SELECT-03 | Alta | riclassificato | `valueMissing` come nativo; errore testuale via help text. |
| SL-SELECT-04 | Alta | ridimensionato | Media: 2.1.1 confermato (Delete/Backspace/Tab), variante `clearable`. |
| SL-SELECT-05 | Media | scartato | Chromium non espone `readonly` sul combobox; resto da verificare con AT. |
| SL-SELECT-06 | Media | riclassificato | Tastiera operabile, option `focused` esposta; resa SR da verificare. |
| SL-SELECT-07 | Media | riclassificato | Ergonomia API. |
| SL-SELECT-08 | Media | riclassificato | Alternativa da tastiera dimostrata; nome generico non viola AA. |
| SL-SELECT-09 | Media | riclassificato | Workaround `role="group"` verificato. |
| SL-SELECT-10 | Media | confermato | Forced colors: nessun indicatore (runtime). |
| SL-SELECT-11 | Bassa | ridimensionato | Media: 2.96:1 su testo in dark (misurato). |
| SL-SELECT-12 | Bassa | riclassificato | Conteggio esposto nel valore del combobox. |
| SL-SELECT-13 | Bassa | confermato | 14×14px misurato, nessuna eccezione applicabile. |
| SL-SELECT-14 | Bassa | riclassificato | Docs. |
| SL-SELECT-15 | Bassa | riclassificato | Test. |
| SL-SELECT-16 | Suggerimento | riclassificato | Ridondanza senza effetto. |
| SL-SELECT-17 | Suggerimento | riclassificato | Tasti opzionali APG. |
| SL-SELECT-18 | Bassa | riclassificato | 2.5.3 soddisfatto. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` / slot | ✅ | ✅ `combobox "Paese *"`, `listbox "Paese"` | Sì |
| `help-text` / slot | ✅ | ✅ `desc="Scegli uno"` | Sì |
| `placeholder` | ✅ | ✅ `combobox "Solo placeholder"` | Sì |
| `required` | ✅ | ❌ `required=false` sul combobox | Sì (SL-SELECT-02) |
| `disabled` | ✅ | ✅ `disabled` | Sì |
| `multiple` | ✅ | ✅ `multiselectable`, valore "N options selected" | Sì |
| `aria-label` (host) | ❌ | ❌ `generic "Host"` | Utile (workaround esiste) |
| `aria-activedescendant` | ❌ | — (focus DOM sulle option) | No in Chromium |

### Fix proposti
```ts
// select.component.ts:855-876 — combobox
<input part="display-input" … role="combobox"
  aria-required=${this.required ? 'true' : 'false'} … />

// select.component.ts:399-403 — svuotamento da tastiera
if (!this.open && this.clearable && (event.key === 'Delete' || event.key === 'Backspace') && this.value.length > 0) {
  event.preventDefault();
  this.handleClearClick(event as unknown as MouseEvent);
  return;
}
if (!this.open && event.key === 'Backspace') return;
```
```css
/* select.styles.ts */
.select__clear { min-width: 24px; min-height: 24px; }                  /* r. 280-291 */
.select__listbox ::slotted(small) { color: var(--sl-color-neutral-600); } /* r. 343 */
.select--filled .select__display-input::placeholder { color: var(--sl-color-neutral-600); }
.select--filled .select__clear { color: var(--sl-input-filled-icon-color, var(--sl-input-icon-color)); }
@media (forced-colors: active) {
  .select--focused .select__combobox { outline: 2px solid Highlight; outline-offset: 1px; }
}
```
