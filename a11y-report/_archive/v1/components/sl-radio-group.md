## Radio Group (`sl-radio-group` – src/components/radio-group/radio-group.component.ts)
**Pattern APG di riferimento:** APG Radio Group pattern (roving tabindex, frecce con wrap, Space) + `fieldset` con nome di gruppo
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 4 · Bassa 4 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<fieldset role="radiogroup">` (r. 347-352: ruolo consentito su fieldset); i figli slottati `sl-radio` (role radio sull'host) sono nel radiogroup nel flat tree. Con radio-button, `sl-button-group` ha `role="presentation"` + `disableRole` (r. 231-237, 384). Nessun `<legend>`: si usa `<label id="label">` + `aria-labelledby` (accettabile). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome da `label`/slot `label` via `aria-labelledby="label"` ✅, help-text via `aria-describedby` ✅. Senza label il gruppo resta senza nome e nessun warning (SL-RADIO-GROUP-06). Mancano `aria-required` e `aria-invalid` sul radiogroup (SL-RADIO-GROUP-02). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Tutti gli ID (`label`, `help-text`, `error-message`) nello stesso shadow root ✅. `aria-label`/`aria-labelledby` sull'host restano sull'host (nessun ruolo) e non danno nome al radiogroup interno (SHARED §2) → SL-RADIO-GROUP-07. |
| 4 | Tastiera e focus | ⚠️ | Frecce ↑↓←→ con wrap, salto dei disabilitati, Space (r. 149-194) ✅; `focus()` sul checked o primo abilitato ✅; click sulla label → focus ✅. Roving tabindex incoerente dopo click (doppio tab stop) e tab stop su radio disabilitato (SL-RADIO-GROUP-01); con `sl-radio-button` ogni bottone è tab stop (vedi SL-RADIO-BUTTON-01). |
| 5 | Form e validazione | ⚠️ | `required` solo su un input nascosto (r. 371-378); errore non esposto con `aria-invalid` → `aria-errormessage` statico inefficace (SL-RADIO-GROUP-02); bug di precedenza che azzera il messaggio custom (SL-RADIO-GROUP-03). |
| 6 | Live region | ⚠️ | `#error-message` `aria-live="assertive"` presente nel DOM dall'inizio ✅, ma viene aggiornato già in `setCustomValidity()` (annuncio prima del submit) e svuotato da `reportValidity()` per gli errori custom (SL-RADIO-GROUP-03). |
| 7 | Aspetti visivi | ⚠️ | Label neutral-800 12.51:1 ✅. Asterisco required via `::after` incluso nel nome del gruppo (SL-RADIO-GROUP-05). Nessun errore visibile persistente (solo tooltip nativo 10 s, SL-RADIO-GROUP-04). Spacing tra radio: vedi SL-RADIO-01. |
| 8 | API pubblica a11y | ⚠️ | `label`, `help-text` ✅; mancano `error-message` visibile, passthrough `aria-label`/`aria-describedby`, warning dev. |
| 9 | Documentazione e test | ⚠️ | Molti test di focus/tastiera/validazione ✅; **nessun** test axe (`to.be.accessible()`), nessuna verifica di tabindex/`aria-checked` (asserzioni commentate r. 502, 510) (SL-RADIO-GROUP-08). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-RADIO-GROUP-01 | Media | 4 | Roving tabindex incoerente. Senza valore iniziale `syncRadioElements` dà `tabindex="0"` a `radios[0]` anche se disabilitato (APG: primo radio *abilitato*). Al click su un altro radio, `handleRadioClick` assegna `checked=false` a `radios[0]` che era già `false`: il `@watch('checked')` di `sl-radio` non scatta e `radios[0]` mantiene `tabindex="0"` → due tab stop nel gruppo. | src/components/radio-group/radio-group.component.ts:219-229 (`radios[0].setAttribute('tabindex','0')`), 141; src/components/radio/radio.component.ts:82-86 | APG Radio Group (un solo tab stop); WCAG 2.4.3 | Centralizzare il tabindex nel gruppo: dopo ogni cambio, `radios.forEach(r => r.tabIndex = -1)` e `tabIndex = 0` sul checked o sul primo abilitato. |
| SL-RADIO-GROUP-02 | Media | 2/5 | Stato required/invalid non esposto sul radiogroup: nessun `aria-required`, nessun `aria-invalid` (gli stati sono solo `data-user-invalid` sull'host, SHARED §1). `aria-errormessage="error-message"` è sempre presente ma è ignorato senza `aria-invalid="true"`. | src/components/radio-group/radio-group.component.ts:347-356, 371-378 | WCAG 3.3.1, 3.3.2, 4.1.2 | `aria-required=${this.required ? 'true' : 'false'}`, `aria-invalid=${!this.validity.valid && this.hasAttribute('data-user-invalid') ? 'true' : 'false'}` e `aria-errormessage` solo quando invalid. |
| SL-RADIO-GROUP-03 | Media | 5/6 | Bug di precedenza: `this.customValidityMessage \|\| isValid ? '' : msg` equivale a `(custom \|\| isValid) ? '' : msg`, quindi con un errore custom `errorMessage` viene **svuotato** in `reportValidity()`. Inoltre `setCustomValidity()` popola subito la live region assertive (annuncio fuori contesto, prima del submit). | src/components/radio-group/radio-group.component.ts:300, 316-319, 369 | WCAG 3.3.1, 4.1.3 | `this.errorMessage = isValid ? '' : (this.customValidityMessage \|\| this.validationInput.validationMessage);` e non scrivere `errorMessage` in `setCustomValidity()`. |
| SL-RADIO-GROUP-04 | Media | 5 | L'errore è visibile solo come tooltip nativo dell'input nascosto, rimosso dopo 10 s (`setTimeout(…, 10000)`); il testo in `#error-message` è `visually-hidden`. Nessun messaggio d'errore persistente e visibile associato al gruppo. | src/components/radio-group/radio-group.component.ts:302-310, 368-369 | WCAG 3.3.1, 2.2.1 (tempo) | Property/slot `error-message` visibile sotto il gruppo, referenziato da `aria-describedby`/`aria-errormessage`. |
| SL-RADIO-GROUP-05 | Bassa | 2/7 | L'asterisco di required (`:host([required]) … .form-control__label::after { content: '*' }`) è dentro l'elemento referenziato da `aria-labelledby` → nome del gruppo "Select an option *"; il required non è esposto altrimenti (SL-RADIO-GROUP-02). Le regole `.radio-group--required .radio-group__label::after` sono morte (classi inesistenti nel template). | src/styles/form-control.styles.ts:32-36; src/components/radio-group/radio-group.styles.ts:19-22 | WCAG 1.3.1 | `content: var(--sl-input-required-content) / ''` + `aria-required`; rimuovere CSS morto. |
| SL-RADIO-GROUP-06 | Bassa | 2/8 | Senza `label` il `<label id="label">` ha `aria-hidden="true"` e il radiogroup resta senza nome; la JSDoc dice "Required for proper accessibility" ma non c'è warning dev né opzione `hide-label` (si può solo usare `<sl-visually-hidden slot="label">`, non documentato). | src/components/radio-group/radio-group.component.ts:62-66, 357-365 | WCAG 1.3.1, 4.1.2 | Warning dev se `!hasLabel`; documentare l'etichetta visivamente nascosta. |
| SL-RADIO-GROUP-07 | Bassa | 3 | `aria-label`/`aria-labelledby`/`aria-describedby` scritti sull'host non raggiungono il `fieldset role="radiogroup"` interno (host senza ruolo, SHARED §2). | src/components/radio-group/radio-group.component.ts:347-356 | WCAG 4.1.2 | Property `accessibleLabel` (`attribute: 'aria-label'`) applicata al fieldset quando `label` è vuota. |
| SL-RADIO-GROUP-08 | Bassa | 9 | Nessun test axe; il test di sync ha le asserzioni su `aria-checked` commentate; nessun test su tabindex/roving, su `aria-invalid` o sul contenuto della live region. | src/components/radio-group/radio-group.test.ts:11-514 (0 occorrenze di `accessible`), 502, 510 | Qualità | Aggiungere `to.be.accessible()` (radio e radio-button, con errore) e test sul singolo tab stop. |
| SL-RADIO-GROUP-09 | Suggerimento | 1 | Il nome di gruppo è dato da `<label>` non associato a un controllo dentro un `<fieldset>`: `<legend>` sarebbe la semantica nativa (nome automatico del fieldset) e renderebbe superfluo `aria-labelledby`. | src/components/radio-group/radio-group.component.ts:347-365 | First rule of ARIA / H71 | Usare `<legend part="form-control-label">` (stile con `float`/`padding:0`). |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` / slot `label` | Sì | Sì (`aria-labelledby`) | Asterisco nel nome |
| `help-text` / slot | Sì | Sì (`aria-describedby`) | — |
| `aria-label` (host) | No | No | Da aggiungere passthrough al fieldset |
| `required` → `aria-required` | Parziale | No | Solo input nascosto |
| `aria-invalid` / `aria-errormessage` | Parziale | No | `aria-errormessage` statico senza `aria-invalid` |
| `error-message` visibile | No | — | Da aggiungere |
| `size` / `name` / `value` / `form` | Sì | Sì | — |

### Fix proposti
```ts
// radio-group.component.ts
private syncTabStops() {
  const radios = this.getAllRadios();
  const target = radios.find(r => r.checked && !r.disabled) ?? radios.find(r => !r.disabled);
  radios.forEach(r => {
    const focusable = this.hasButtonGroup ? r.shadowRoot?.querySelector('button') : r;
    focusable?.setAttribute('tabindex', r === target ? '0' : '-1');
  });
}
// chiamare syncTabStops() in syncRadioElements(), handleRadioClick(), handleKeyDown(), updateCheckedRadio()

reportValidity(): boolean {
  const isValid = this.validity.valid;
  this.errorMessage = isValid ? '' : this.customValidityMessage || this.validationInput.validationMessage;
  ...
}
setCustomValidity(message = '') {
  this.customValidityMessage = message; // non popolare la live region qui
  this.validationInput.setCustomValidity(message);
  this.formControlController.updateValidity();
}

render() {
  const invalid = this.hasAttribute('data-user-invalid');
  return html`
    <fieldset
      role="radiogroup"
      aria-labelledby="label"
      aria-describedby="help-text"
      aria-required=${this.required ? 'true' : 'false'}
      aria-invalid=${invalid ? 'true' : 'false'}
      aria-errormessage=${ifDefined(invalid ? 'error-message' : undefined)}
    >…`;
}
```

### Non verificabile
- Annuncio del nome di gruppo e del passaggio tra radio ("n di m") con NVDA/JAWS/VoiceOver attraverso shadow root e slot.
- Comportamento del tooltip nativo `reportValidity()` su input `visually-hidden` nei vari browser.
