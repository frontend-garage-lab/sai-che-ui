## Radio Group (`sl-radio-group` – src/components/radio-group/radio-group.component.ts)
**Pattern APG di riferimento:** APG Radio Group (un solo tab stop, le frecce spostano e selezionano, Space seleziona il radio con il focus)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `radiogroup "Select an option" desc="Scegli"` con i figli `radio`. Con radio-button `sl-button-group` è `presentation` e non compare nell'albero. |
| 2 | Nome/descrizione/stato | ⚠️ | Nome da `label` (`aria-labelledby`), help-text in `desc`. Con `required` il nome è "Select an option *"; il gruppo espone `required=false` e resta `invalid="false"` anche dopo `reportValidity()` (miglioramento: l'obbligo è nel testo "*", l'errore arriva dalla live region). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-labelledby="label"` e `aria-describedby="help-text"` risolti nello stesso shadow root. `aria-errormessage` è ignorato senza `aria-invalid`. |
| 4 | Tastiera e focus | ⚠️ | Con `value` impostato: Tab entra una volta sul checked (`sl-radio#r1`), le frecce spostano e selezionano saltando i disabilitati, Tab esce (`button#b`). Bug APG non bloccanti (miglioramenti V02/01): dopo un click ci sono 2 tab stop; Space seleziona il radio *checked* invece di quello con il focus; il primo radio disabilitato riceve il tab stop. |
| 5 | Form e validazione | ❌ | `reportValidity()`/submit sposta il focus su un `<input type="text">` nascosto e senza nome (SL-RADIO-GROUP-V01). Messaggio custom svuotato in `reportValidity()` (SL-RADIO-GROUP-03, da verificare con AT). |
| 6 | Live region | ⚠️ | `#error-message` `aria-live="assertive"`: si popola con "Please fill out this field." su `reportValidity()`; con `setCustomValidity()` si popola subito e si svuota al report (SL-RADIO-GROUP-03). |
| 7 | Aspetti visivi | ✅ | Label 12.50:1 light / 12.07:1 dark, help-text 6.64 / 5.72, asterisco 4.6 / 4.77. |
| 8 | API pubblica a11y | ✅ | `label`/slot `label` (anche `<sl-visually-hidden slot="label">` → `radiogroup "Colore"`), `help-text`, `required`. |
| 9 | Docs e test | ⚠️ | Nessun test axe; asserzioni `aria-checked` commentate (miglioramento). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-RADIO-GROUP-V01 | Media | Form e validazione / Focus | Nell'esempio docs "Validation" (`required`, submit senza scelta) `reportValidity()` rende focusabile e mette a fuoco un `<input type="text">` dentro `.visually-hidden`. Il focus è invisibile, l'elemento è un `textbox` senza nome, le frecce non funzionano (il keydown è solo sullo slot), il testo digitato finisce nell'input e dopo 10 s l'input torna `hidden` e il focus cade su `body`. Il radiogroup resta `invalid="false"`. | src/components/radio-group/radio-group.component.ts:302-309, 368-379, 343 | runtime: submit con Enter → `focus: sl-radio-group > input`; `textbox [focused required labelledby=[21]]` (nessun nome); `key:ArrowDown` → focus invariato; `type:abc` → `input.value "abc"`; `wait:10500` → `focus: body` | 2.4.7 (AA), 2.4.3 (A), 4.1.2 (A) | Non usare il bubble nativo dell'input nascosto: in `reportValidity()` impostare `errorMessage`, mostrarlo in un elemento visibile collegato al fieldset (`aria-describedby`/`aria-errormessage` + `aria-invalid="true"`) e portare il focus con `this.focus()` sul radio checked o sul primo abilitato. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-RADIO-GROUP-01 | miglioramento | Roving tabindex incoerente, dimostrato ma non bloccante. Senza `value` e dopo il click su r2: `r1:0 r2:0*` → Tab r1, r2, esterno (2 tab stop). Con il primo radio disabilitato il tab stop va a r1 (disabilitato) e ArrowDown salta a r3. Fix: azzerare `tabindex` di tutti e mettere `0` sul checked o sul primo abilitato a ogni cambio. | radio-group.component.ts:141, 219-229; radio.component.ts:82-86 |
| SL-RADIO-GROUP-V02 | miglioramento | Space agisce sul radio *checked*, non su quello con il focus (`incr = 0` su `checkedRadio`). Dopo il click su r2, Tab su r1 (`radio "Option 1" [focused checked="false"]`) + Space → focus e selezione restano su r2. Con radio-button (ogni opzione è un tab stop) Space su "Option 3" riseleziona "Option 1" e sposta il focus. Funzione operabile con frecce/Enter: non è un errore A/AA, ma è un bug APG da correggere con priorità. | radio-group.component.ts:157-160, 178-186 |
| SL-RADIO-GROUP-02 | miglioramento | Esporre `aria-required` e `aria-invalid` sul fieldset (oggi `required=false`, `invalid="false"`). | radio-group.component.ts:347-356 |
| SL-RADIO-GROUP-03 | miglioramento | Precedenza errata `this.customValidityMessage \|\| isValid ? '' : msg`: con errore custom `#error-message` passa da "Errore custom" (scritto subito da `setCustomValidity`, fuori contesto) a `""` al `reportValidity()`. Fix: `isValid ? '' : (custom \|\| validationMessage)` e niente scrittura in `setCustomValidity`. | radio-group.component.ts:300, 316-319 |
| SL-RADIO-GROUP-04 | miglioramento | Messaggio d'errore visibile e persistente al posto del bubble nativo temporaneo (10 s). | radio-group.component.ts:302-310, 368-369 |
| SL-RADIO-GROUP-05 | miglioramento | Asterisco nel nome ("Select an option *") e CSS morto `.radio-group--required`. | form-control.styles.ts:32-36; radio-group.styles.ts:19-22 |
| SL-RADIO-GROUP-07 | miglioramento | `aria-label` sull'host non arriva al fieldset (verificato dal coordinatore); `label` e slot `label` coprono il caso. | radio-group.component.ts:347-356 |
| SL-RADIO-GROUP-08 | miglioramento | Test axe e test sul singolo tab stop / Space. | radio-group.test.ts |
| SL-RADIO-GROUP-09 | miglioramento | `<legend>` al posto di `<label>` + `aria-labelledby`. | radio-group.component.ts:357-365 |

### Responsabilità del consumer
- Impostare sempre `label` (o slot `label`, anche visivamente nascosto): senza, `radiogroup` non ha nome (SL-RADIO-GROUP-06).

### Da verificare con AT reali
- NVDA/JAWS/VoiceOver: se il bubble nativo di validazione dell'input nascosto (con messaggio custom) viene letto. La live region è vuota in quel momento (SL-RADIO-GROUP-03).
- NVDA/VoiceOver: annuncio assertivo di `#error-message` a ogni `setCustomValidity()` (nell'esempio docs già al caricamento).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-RADIO-GROUP-01 | Media | riclassificato | Bug dimostrato (2 tab stop, disabilitato focusabile), ma le opzioni restano tutte raggiungibili e selezionabili e non c'è violazione A/AA: miglioramento prioritario. |
| SL-RADIO-GROUP-02 | Media | riclassificato | `required`/`invalid` non esposti sul gruppo (runtime), ma l'obbligo è nel testo "*" e l'errore è annunciato dalla live region: miglioramento. |
| SL-RADIO-GROUP-03 | Media | riclassificato | Bug di codice dimostrato (live region svuotata), ma il bubble nativo mostra il messaggio e la sua lettura dipende da browser/AT: miglioramento + da verificare con AT. |
| SL-RADIO-GROUP-04 | Media | riclassificato | Il bubble nativo è testo; la perdita del focus dopo 10 s confluisce in SL-RADIO-GROUP-V01. |
| SL-RADIO-GROUP-05 | Bassa | riclassificato | L'asterisco nel nome non viola criteri A/AA: miglioramento. |
| SL-RADIO-GROUP-06 | Bassa | riclassificato | `label` documentata come necessaria; slot `label` nascosto funziona: consumer. |
| SL-RADIO-GROUP-07 | Bassa | riclassificato | `label` copre il caso: miglioramento. |
| SL-RADIO-GROUP-08 | Bassa | riclassificato | Test: miglioramento. |
| SL-RADIO-GROUP-09 | Suggerimento | riclassificato | Semantica alternativa equivalente: miglioramento. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `label` / slot `label` | Sì | Sì: `radiogroup "Select an option"` | Sì |
| `help-text` / slot | Sì | Sì: `desc="Scegli"` | Sì |
| `required` | Sì | No sul gruppo (`required=false`); solo "*" nel nome | Miglioramento (`aria-required`) |
| `setCustomValidity` / `reportValidity` | Sì | Parziale: focus su input nascosto (V01), messaggio custom perso (03) | Sì |
| `aria-label` sull'host | No | Resta sull'host | No (c'è `label`) |

### Fix proposti
```ts
// radio-group.component.ts
reportValidity(): boolean {
  const isValid = this.validity.valid;
  this.errorMessage = isValid ? '' : (this.customValidityMessage || this.validationInput.validationMessage);
  this.formControlController.setValidity(isValid);
  if (!isValid) this.focus(); // radio checked o primo abilitato, mai l'input nascosto
  return isValid;
}
// render(): fieldset
//   aria-invalid=${this.errorMessage ? 'true' : 'false'}
//   aria-describedby="help-text error-message"
// e #error-message visibile (fuori da .visually-hidden) quando errorMessage non è vuoto.
```
