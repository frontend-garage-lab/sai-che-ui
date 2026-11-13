## Color Picker (`sl-color-picker` – src/components/color-picker/color-picker.component.ts)
**Pattern APG di riferimento:** APG Slider pattern (hue, alpha; griglia 2D come coppia di slider o slider con `aria-valuetext`) · APG Menu Button / Disclosure (trigger + pannello in `sl-dropdown`) · APG Radio Group o Toolbar (swatches) · APG Button (preview/copia, formato, eyedropper)
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 7 · Bassa 5 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ❌ | Griglia S/V = `<span role="application" aria-label="HSV">` senza valore (r. 849-864). Hue/alpha `role="slider"` con min/max/now ✅ (r. 875-889, 910-924). Swatches = `<div role="button" tabindex="0">` (r. 1023-1037) invece di `<button>`. Contenitore `base` generico con `aria-labelledby`/`aria-disabled` e, inline, `tabindex="0"` (r. 822-833). |
| 2 | Nome, descrizione, stato | ❌ | Nomi slider hardcoded in inglese minuscolo ("hue", "alpha", "HSV"); nessun `aria-valuetext`; swatch nominati con la stringa CSS grezza (`aria-label=${swatch}`); trigger nominato solo dalla label (il colore corrente non è esposto); bottone formato con `aria-label` che non contiene il testo visibile. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | In modalità dropdown `aria-labelledby="label"` punta a un ID che non esiste (l'elemento `#label` è renderizzato solo se `inline`, r. 834-840). Label esterna non associabile (SHARED §2). |
| 4 | Tastiera e focus | ⚠️ | Frecce + Shift su griglia/slider ✅, Home/End solo su hue/alpha; mancano Up/Down su hue/alpha, PageUp/PageDown ovunque, Home/End sulla griglia. Swatch attivabili solo con Enter (no Space). Focus visibile con `--sl-focus-ring` su handle, swatch, preview, trigger (styles r. 64-65, 101-102, 157-159, 245-247, 339-341) ✅. Dropdown: focus/Esc gestiti da `sl-dropdown` (non verificati qui). |
| 5 | Form e validazione | ⚠️ | `name`, `required`, validità via `sl-input` interno ✅; l'input si chiama "Current value" (localizzato) senza la label del picker; nessun help-text/messaggio d'errore. FormControlController senza ElementInternals (SHARED §2). |
| 6 | Live region | ❌ | `aria-live="polite"` sul contenitore di input + bottoni (r. 942): annunci a raffica durante il trascinamento e region che contiene controlli interattivi. Copia del valore (preview) senza annuncio. |
| 7 | Aspetti visivi | ⚠️ | `forced-color-adjust: none` su griglia/slider/preview/swatch/trigger (styles r. 44, 83, 140, 214, 296) ✅. Handle bianco con anello `rgba(0,0,0,.25)` → ≈1.8:1 su colori chiari. Track slider alto 15px, handle 16-17px (< 24). Animazione `pulse` e `scale: 1.5` senza reduced-motion. Swatch 25px ✅. |
| 8 | API pubblica a11y | ⚠️ | `label`/slot `label` ✅; stringhe localizzate solo per `copy`, `currentValue`, `toggleColorFormat`, `selectAColorFromTheScreen` ✅; hardcoded "HSV", "hue", "alpha". Nessuna property per i nomi degli swatch, nessun warning se manca `label`. |
| 9 | Documentazione e test | ❌ | Nessun `to.be.accessible()` nei test (590 righe); tastiera testata solo con ArrowRight (test r. 190-250). Docs con `label` negli esempi ✅, nessuna nota a11y. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-COLOR-PICKER-01 | Alta | 1/2 Griglia S/V | L'handle della griglia è `role="application"` con `aria-label="HSV"` e nessun valore: saturazione e luminosità non sono esposte, l'utente di screen reader sente "HSV, applicazione" e le frecce non producono alcun riscontro (`application` disattiva anche la navigazione virtuale). Nome non localizzato. | src/components/color-picker/color-picker.component.ts:849-864 `role="application" aria-label="HSV"` | WCAG 4.1.2, 1.3.1; APG Slider | `role="slider"` con `aria-valuetext` localizzato ("Saturazione 40%, luminosità 75%") e `aria-roledescription` opzionale "selettore 2D", oppure due slider distinti (saturazione/luminosità) visivamente sovrapposti alla griglia. |
| SL-COLOR-PICKER-02 | Media | 2/8 Slider hue/alpha | `aria-label="hue"` / `"alpha"` hardcoded in inglese; nessun `aria-valuetext` (hue annunciato come numero 0-360 senza unità/nome del colore, alpha senza "%"); con `disabled` gli slider restano nell'albero AT senza `aria-disabled`. | color-picker.component.ts:881-887, 916-922 | WCAG 4.1.2, 3.1.2; APG Slider (aria-valuetext) | Nuove chiavi di traduzione (`hue`, `opacity`, `saturationBrightness`), `aria-valuetext` ("210°, blu" / "45%"), `aria-disabled=${this.disabled}`. |
| SL-COLOR-PICKER-03 | Media | 4 Tastiera | Hue/alpha non rispondono a ArrowUp/ArrowDown né a PageUp/PageDown; la griglia non supporta Home/End/PageUp/PageDown. | color-picker.component.ts:337-437 (solo ArrowLeft/Right/Home/End e frecce sulla griglia) | APG Slider (keyboard interaction); WCAG 2.1.1 | Aggiungere Up/Down (= Right/Left), PageUp/PageDown (±10), Home/End sulla griglia (saturazione 0/100). |
| SL-COLOR-PICKER-04 | Media | 1/4 Swatches | Swatch come `<div role="button" tabindex="0">`: si attivano con Enter ma **non con Space**; via Enter chiamano `setColor` senza emettere `sl-change`/`sl-input` (diverso dal click); nome = stringa CSS grezza (`#f44336`, `hsl(…)`); nessuno stato selezionato; nessun contenitore con nome; un tab stop per ogni swatch. | color-picker.component.ts:1012-1037 (`role="button"`, `@keydown … event.key === 'Enter' && this.setColor(...)`, `aria-label=${swatch}`) | WCAG 2.1.1, 4.1.2, 1.1.1; APG Radio Group / Button | `<button type="button">` nativi (o `role="radiogroup"` + `role="radio"` con roving tabindex e `aria-checked`), handler unico `selectSwatch`, property opzionale per i nomi (`swatch-labels` o oggetti `{ value, label }`), contenitore `role="group"` con nome localizzato. |
| SL-COLOR-PICKER-05 | Media | 2/5 Label e trigger | La `label` è sempre visivamente nascosta (documentato r. 134-137): nessuna etichetta visibile e nessun modo di associare una `<label>` esterna (SHARED §2). Il trigger espone solo la label, non il colore selezionato (visibile solo come colore); senza `label` il trigger non ha nome e non c'è warning. L'input interno si chiama solo "Current value". | color-picker.component.ts:134-138, 1061-1082, 954 | WCAG 3.3.2, 1.1.1, 4.1.2, 2.4.6 | Opzione per label visibile (come `sl-input`), `aria-describedby` sul trigger verso un testo nascosto con il valore corrente (`hex`), nome dell'input `"${label}: ${currentValue}"`, warning dev se manca la label. |
| SL-COLOR-PICKER-06 | Media | 2 Label in name | Il bottone formato mostra "HEX"/"RGB"… ma ha `aria-label="Toggle color format"`, che sostituisce il testo visibile: chi usa il controllo vocale ("clicca HEX") non lo attiva e lo screen reader non annuncia il formato corrente. | color-picker.component.ts:966-981 `aria-label=${this.localize.term('toggleColorFormat')}` … `${this.setLetterCase(this.format)}` | WCAG 2.5.3, 4.1.2 | Rimuovere `aria-label` e usare testo visibile + `sl-visually-hidden` ("HEX, cambia formato colore"), oppure `aria-label` che inizi con il testo visibile. |
| SL-COLOR-PICKER-07 | Media | 6 Live region | `aria-live="polite"` è posto sul contenitore che include `sl-input` e i bottoni: ogni variazione di valore (anche ad ogni `pointermove` durante il drag) può far annunciare l'intera regione, compresi i controlli; il valore non è legato agli slider. | color-picker.component.ts:942 `<div class="color-picker__user-input" aria-live="polite">` | WCAG 4.1.3; ARIA live region best practice | Rimuovere `aria-live` dal contenitore; esporre il valore con `aria-valuetext` sugli slider; se serve, live region nascosta e con debounce solo per eyedropper/swatch. |
| SL-COLOR-PICKER-08 | Media | 6/2 Copia valore | Il bottone preview si chiama solo "Copy" (non dice cosa copia) e l'esito della copia è segnalato solo dall'animazione `pulse` (nessun annuncio); usa `document.execCommand('copy')` deprecato senza gestione errori. | color-picker.component.ts:212-222, 930-939; color-picker.styles.ts:171-184 | WCAG 2.4.6, 4.1.3 | `aria-label` "Copia valore colore" (nuova chiave), live region con `copied` localizzato; `navigator.clipboard.writeText` con fallback ed errore annunciato (riusare la logica di `sl-copy-button` una volta corretta). |
| SL-COLOR-PICKER-09 | Bassa | 1/3 Contenitore | `base` è un `<div>` generico con `aria-labelledby="label"` (riferimento rotto in modalità dropdown) e `aria-disabled` (non supportato sul ruolo generic); inline ha `tabindex="0"`: tab stop su un elemento senza ruolo. Anche `aria-disabled` sull'host di `sl-dropdown` non ha effetto. | color-picker.component.ts:822-833, 1055 | WCAG 4.1.2, 1.3.1 | `role="group"` sul base con `aria-labelledby` verso un `#label` sempre renderizzato; rimuovere `tabindex="0"` (focus sul primo handle) e `aria-disabled` dal dropdown. |
| SL-COLOR-PICKER-10 | Bassa | 7 Contrasto handle | Gli handle sono bordati di bianco con anello `rgba(0,0,0,.25)` (≈1.8:1 su bianco): su colori chiari l'indicatore di posizione non raggiunge 3:1. | src/components/color-picker/color-picker.styles.ts:47-57, 90-98 | WCAG 1.4.11 | Doppio anello bianco + nero pieno (`box-shadow: 0 0 0 1px #000, inset 0 0 0 1px #000`). |
| SL-COLOR-PICKER-11 | Bassa | 7 Target size | Track degli slider alto 15px, handle 16-17px: il target in verticale è sotto 24px (eccezione "spacing" probabilmente non soddisfatta, gli slider sono impilati). | color-picker.styles.ts:5-9 (`--slider-height: 15px`, `--slider-handle-size: 17px`, `--grid-handle-size: 16px`) | WCAG 2.5.8 | `--slider-height`/`--slider-handle-size` ≥ 24px o area di hit estesa con pseudo-elemento trasparente. |
| SL-COLOR-PICKER-12 | Bassa | 7 Motion | Animazione `pulse` della preview e `scale: 1.5` dell'handle in drag non disattivate con `prefers-reduced-motion` (SHARED-05). | color-picker.styles.ts:56-61, 171-184 | WCAG 2.3.3 (AAA) | `@media (prefers-reduced-motion: reduce) { .color-picker__preview-color--copied { animation: none; } .color-picker__grid-handle { transition: none; } }` |
| SL-COLOR-PICKER-13 | Bassa | 9 Test | Nessun test axe; tastiera coperta solo con ArrowRight; nessun test su swatch da tastiera, nomi/valuetext, stato disabled, modalità inline. | src/components/color-picker/color-picker.test.ts:10-590 (0 occorrenze di `accessible()`) | — (qualità) | Aggiungere axe (dropdown aperto e inline) e test di tastiera completi. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` / slot `label` | Sì | Parziale | Nome del trigger ✅; in dropdown il pannello referenzia un `#label` inesistente; mai visibile. |
| `disabled` | Sì | Parziale | Trigger/input/bottoni ✅; slider e griglia senza `aria-disabled`. |
| `required` / `name` | Sì | Sì | Sull'`sl-input` interno. |
| `help-text` / `error-message` | No | — | Da aggiungere. |
| nomi slider (hue/opacity/saturazione-luminosità) | No | — | Hardcoded inglese; aggiungere chiavi di traduzione o property. |
| `aria-valuetext` | No | — | Da aggiungere su tutti gli slider. |
| nomi swatch | No | — | Da aggiungere (`{ value, label }`). |
| Stringhe localizzate esistenti (`copy`, `currentValue`, `toggleColorFormat`, `selectAColorFromTheScreen`) | Sì | Sì | Via LocalizeController. |
| warning dev mode | No | — | Se manca `label`. |

### Fix proposti
```ts
// color-picker.component.ts — griglia come slider con valuetext
<span
  part="grid-handle"
  class=…
  role="slider"
  aria-label=${this.localize.term('saturationBrightness')}
  aria-roledescription=${this.localize.term('twoDimensionalSlider')}
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow=${Math.round(this.saturation)}
  aria-valuetext=${`${this.localize.term('saturation')} ${Math.round(this.saturation)}%, ${this.localize.term('brightness')} ${Math.round(this.brightness)}%`}
  aria-disabled=${this.disabled ? 'true' : 'false'}
  tabindex=${ifDefined(this.disabled ? undefined : '0')}
  @keydown=${this.handleGridKeyDown}
></span>

// hue
role="slider"
aria-label=${this.localize.term('hue')}
aria-valuetext=${`${Math.round(this.hue)}°`}
aria-disabled=${this.disabled ? 'true' : 'false'}

// alpha
aria-label=${this.localize.term('opacity')}
aria-valuetext=${`${Math.round(this.alpha)}%`}

// tastiera condivisa per gli slider 1D
private sliderKey(event: KeyboardEvent, value: number, max: number) {
  const step = event.shiftKey ? 10 : 1;
  switch (event.key) {
    case 'ArrowLeft': case 'ArrowDown': return clamp(value - step, 0, max);
    case 'ArrowRight': case 'ArrowUp': return clamp(value + step, 0, max);
    case 'PageDown': return clamp(value - 10, 0, max);
    case 'PageUp': return clamp(value + 10, 0, max);
    case 'Home': return 0;
    case 'End': return max;
    default: return null;
  }
}

// swatches come pulsanti nativi
<div part="swatches" class="color-picker__swatches" role="group" aria-label=${this.localize.term('swatches')}>
  ${swatches.map(swatch => html`
    <button
      type="button"
      part="swatch"
      class="color-picker__swatch color-picker__transparent-bg"
      aria-label=${swatchLabel ?? swatch}
      aria-pressed=${parsedColor.hexa === this.getHexString(this.hue, this.saturation, this.brightness, this.alpha) ? 'true' : 'false'}
      ?disabled=${this.disabled}
      @click=${() => this.selectSwatch(swatch)}
    ><div class="color-picker__swatch-color" style=…></div></button>`)}
</div>

// formato: il nome contiene il testo visibile
<sl-button part="format-button" …>
  ${this.setLetterCase(this.format)}
  <sl-visually-hidden>, ${this.localize.term('toggleColorFormat')}</sl-visually-hidden>
</sl-button>

// contenitore input: niente aria-live
<div class="color-picker__user-input">…</div>

// trigger: espone il valore
<button part="trigger" slot="trigger" type="button" aria-describedby="trigger-value" …>
  <sl-visually-hidden><slot name="label">${this.label}</slot></sl-visually-hidden>
</button>
<sl-visually-hidden id="trigger-value">${this.isEmpty ? '' : this.inputValue}</sl-visually-hidden>
```
```css
/* color-picker.styles.ts */
.color-picker__grid-handle,
.color-picker__slider-handle { box-shadow: 0 0 0 1px #000, inset 0 0 0 1px #000; }

@media (prefers-reduced-motion: reduce) {
  .color-picker__preview-color--copied { animation: none; }
  .color-picker__grid-handle { transition: none; }
  .color-picker__grid-handle--dragging { scale: none; }
}
```
Nota: `aria-describedby="trigger-value"` funziona solo se l'elemento è nello stesso shadow root del trigger (lo è: entrambi nel render del picker, fuori dallo slot del dropdown non serve).

### Non verificabile
- Gestione di focus iniziale, Esc e ritorno del focus al trigger nel pannello (delegata a `sl-dropdown`, gruppo diverso) e comportamento del focus trap.
- Annunci reali con NVDA/JAWS/VoiceOver della live region sul contenitore e del ruolo `application`.
- Disponibilità di EyeDropper (solo Chromium desktop) e annuncio dopo la selezione del colore dallo schermo.
- Contrasto degli handle sui colori scelti dall'utente (dipende dal valore corrente).
