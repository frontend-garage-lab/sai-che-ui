## Radio (`sl-radio` – src/components/radio/radio.component.ts)
**Pattern APG di riferimento:** APG Radio Group pattern (elemento `radio`, roving tabindex gestito da `sl-radio-group`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 4 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `role="radio"` sull'host (r. 77), `aria-checked` sempre presente (watch senza `waitUntilFirstUpdate`, r. 82-86), `aria-disabled` (r. 79, 90). Usato dentro `sl-radio-group` (`role="radiogroup"`). Nessun input nativo: ARIA custom necessario e corretto. |
| 2 | Nome, descrizione, stato | ✅ | Nome dal contenuto (slot default, il ruolo `radio` supporta name-from-content); `sl-icon` di spunta senza `label` → `aria-hidden="true"`. Poiché il ruolo è sull'host, `aria-label`/`aria-labelledby`/`aria-describedby` scritti dal consumer sull'host funzionano ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo sull'host: riferimenti ID dal light DOM risolvibili. Nessun ruolo duplicato nel shadow root. `tabindex` impostato con `setAttribute` sull'host (r. 78, 85) sovrascrive quello del consumer (atteso per roving tabindex). |
| 4 | Tastiera e focus | ⚠️ | Frecce/Space gestite dal gruppo; `:host(:focus-visible) .radio__control { outline: var(--sl-focus-ring) }` (styles r. 97-100) ✅ 6.21:1, visibile in forced-colors. Fuori da un `sl-radio-group` il radio non è mai raggiungibile da Tab (tabindex -1) e Space non funziona (SL-RADIO-04). Disabilitato: `aria-disabled` ma ancora focusabile se `checked` (tabindex 0). |
| 5 | Form e validazione | N/A | Validità e `required` gestiti da `sl-radio-group` (vedi `sl-radio-group.md`). |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Bordo neutral-400 3.21:1 light / neutral-500 3.48:1 dark ✅; fill checked primary-600 ✅. Target alto 14/16/20px e radio impilati senza spazio (SL-RADIO-01). Nessun `forced-colors` e regola WHCM inefficace (SL-RADIO-03). Transizioni: SHARED-05. |
| 8 | API pubblica a11y | ⚠️ | `aria-*` sull'host funzionano grazie al ruolo sull'host; manca solo un warning dev per radio senza nome (SL-RADIO-02). |
| 9 | Documentazione e test | ❌ | `radio.test.ts` ha un solo test (disabled), nessun test axe né di tastiera/`aria-checked` (SL-RADIO-05). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-RADIO-01 | Media | 7 | Target size: il control è 14/16/20px e `.radio__label { line-height: var(--toggle-size) }`, quindi l'host (`display:block`, cliccabile su tutta la riga) è alto 14/16/20px. Nel gruppo i radio sono impilati senza margine (nessuna regola di spacing in radio/radio-group/form-control styles): i cerchi da 24px delle righe adiacenti si sovrappongono → l'eccezione "spacing" non si applica. | src/components/radio/radio.styles.ts:23-36, 50-51, 116 | WCAG 2.5.8 | `.radio { min-block-size: 24px; align-items: center }` oppure `:host { padding-block: 4px }`. |
| SL-RADIO-02 | Bassa | 2/8 | Nessun warning in dev mode se il radio non ha testo nello slot né `aria-label` (radio icon-only o vuoti, come nei test `<sl-radio value="1"></sl-radio>`). | src/components/radio/radio.component.ts:76-80, 107 | WCAG 4.1.2 | Warning dev in `firstUpdated` se `textContent.trim()` vuoto e nessun `aria-label(ledby)`. |
| SL-RADIO-03 | Bassa | 7 | Nessuna media query `forced-colors`. La regola `.radio:not(.radio--checked) svg circle { opacity: 0 }` non può raggiungere l'SVG dentro lo shadow root di `sl-icon` (codice morto); lo stato checked in HCM resta affidato al solo glifo dell'icona (il fill `primary-600` viene annullato). | src/components/radio/radio.styles.ts:84-88, 108-111 | WCAG 1.4.11 (forced colors) | `@media (forced-colors: active) { .radio--checked .radio__control { background-color: Highlight; border-color: Highlight; color: HighlightText } .radio--disabled { color: GrayText } }`; rimuovere la regola morta. |
| SL-RADIO-04 | Bassa | 4 | Usato fuori da `sl-radio-group` il radio ha `tabindex="-1"` finché non è checked e nessuna gestione di Space/Enter propria: non operabile da tastiera. La documentazione lo presenta sempre dentro un gruppo, ma il componente non avvisa. (consumer) | src/components/radio/radio.component.ts:76-86 (nessun `keydown`) | WCAG 2.1.1 | Warning dev se `closest('sl-radio-group')` è null; oppure documentare esplicitamente l'obbligo del gruppo. |
| SL-RADIO-05 | Bassa | 9 | Test minimi: nessun `to.be.accessible()`, nessuna verifica di `role`, `aria-checked`, `aria-disabled`, `tabindex` (il test di sync in radio-group ha le asserzioni `aria-checked` commentate). | src/components/radio/radio.test.ts:6-23; src/components/radio-group/radio-group.test.ts:502, 510 | Qualità | Aggiungere test axe con gruppo etichettato e asserzioni sugli attributi ARIA. |
| SL-RADIO-06 | Suggerimento | 4 | Radio disabilitato ma `checked` riceve `tabindex="0"` (r. 85) e resta tab stop pur con `aria-disabled="true"`; regole `.radio__input` e "pressed feedback" (styles r. 64-75) sono codice morto (nessun input nel template), quindi niente feedback di pressione. | src/components/radio/radio.component.ts:85; src/components/radio/radio.styles.ts:64-75 | APG Radio Group | `tabindex = checked && !disabled ? '0' : '-1'` (il gruppo assegnerà il tab stop al primo abilitato); rimuovere CSS morto. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `role="radio"` (host) | Sì (setAttribute) | Sì | Sovrascrive eventuale `role` del consumer |
| `aria-checked` | Sì (interno) | Sì | Pilotato da `checked` (state, non pubblico) |
| `aria-disabled` / `disabled` | Sì | Sì | Vedi SL-RADIO-06 |
| `aria-label` / `aria-labelledby` / `aria-describedby` (host) | Implicito | Sì (ruolo sull'host) | Da documentare |
| slot default (label) | Sì | Sì | — |
| warning nome mancante | No | — | Da aggiungere |

### Fix proposti
```ts
// radio.component.ts
@watch(['checked', 'disabled'])
handleCheckedChange() {
  this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
  this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  this.setAttribute('tabindex', this.checked && !this.disabled ? '0' : '-1');
}
firstUpdated() {
  if (!this.closest('sl-radio-group')) console.warn('<sl-radio> deve essere figlio di <sl-radio-group>.');
  if (!this.textContent?.trim() && !this.hasAttribute('aria-label') && !this.hasAttribute('aria-labelledby')) {
    console.warn('<sl-radio>: manca un nome accessibile.');
  }
}
```
```css
/* radio.styles.ts */
.radio { min-block-size: 24px; align-items: center; }
@media (forced-colors: active) {
  .radio--checked .radio__control { background-color: Highlight; border-color: Highlight; color: HighlightText; }
  .radio--disabled { color: GrayText; opacity: 1; }
}
```

### Non verificabile
- Annuncio "radio button, n di m, selezionato" e del nome dal testo slottato in NVDA/JAWS/VoiceOver.
- Resa dello stato checked in Windows High Contrast (glifo dell'icona `radio`).
