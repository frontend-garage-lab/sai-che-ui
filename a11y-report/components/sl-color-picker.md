## Color Picker (`sl-color-picker` – src/components/color-picker/color-picker.component.ts)
**Pattern APG di riferimento:** APG Slider (hue, alpha; griglia 2D) · APG Button (swatch, preview, formato) · trigger in `sl-dropdown`
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 2 · Bassa 3
**Metodo:** codice + runtime Chromium (harness), revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Hue e alpha: `slider` con min/max/now. La griglia è `application "HSV"` **senza valore** (SL-COLOR-PICKER-01). Swatch: `div role="button"` |
| 2 | Nome/descrizione/stato | ⚠️ | Il trigger è `button "Select a color" [expanded=false]` e il colore non è esposto (SL-COLOR-PICKER-05). Swatch nominati con la stringa CSS (`button " #f5a623"`). Con `disabled` (inline) slider, textbox e swatch risultano `[disabled]`, ma il bottone `"hex"` no |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-label="Toggle color format"` sull'host `sl-button` diventa un `generic` (il bottone si chiama `"hex"`, cioè il testo visibile). In dropdown, `aria-labelledby="label"` dà al pannello generic un nome spurio |
| 4 | Tastiera e focus | ❌ | Inline: Tab → `div[part=base]` (tab stop inerte) → griglia → hue → alpha… Sulla griglia ArrowRight/ArrowUp cambiano il valore. Swatch: **Enter cambia il colore senza emettere `sl-change`/`sl-input`, Space non fa nulla** (SL-COLOR-PICKER-04). Dropdown: Enter apre (`expanded`), Esc chiude e riporta il focus sul trigger. In forced-colors il focus è `outline solid` `rgb(14,106,129)` (`forced-color-adjust:none`) |
| 5 | Form e validazione | ✅ | `name`/`required` sul `sl-input` interno (`textbox`, `describedby=[help-text]`) |
| 6 | Live region | ⚠️ | `aria-live="polite"` sul contenitore di input e bottoni: l'effetto dipende dall'AT |
| 7 | Aspetti visivi | ⚠️ | Contrasto degli handle sui gradienti <3:1 su zone chiare o sature (SL-COLOR-PICKER-10, prova da codice). Slider 206x15 px, handle 17 px: vale l'eccezione "equivalent" di 2.5.8 (campo testo). Swatch 25x25, preview 36x36 |
| 8 | API pubblica a11y | ⚠️ | `label` sì. "hue", "alpha" e "HSV" sono hardcoded e non sovrascrivibili (SL-COLOR-PICKER-02) |
| 9 | Docs e test | ⚠️ | Nessun test axe |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-COLOR-PICKER-01 | Media | Nome/stato | L'handle della griglia saturazione/luminosità non espone alcun valore. Esiste un'alternativa equivalente: il campo testo | color-picker.component.ts:849-864 `role="application" aria-label="HSV"` | `application "HSV" [focused]` prima e dopo ArrowRight/ArrowUp (value `#4a90e2ff` → `#4990e5ff`), senza valuenow/valuetext | WCAG 4.1.2 | `role="slider"` con `aria-valuetext` localizzato |
| SL-COLOR-PICKER-04 | Media | Tastiera | Swatch da tastiera: Enter chiama `setColor` senza eventi, Space è inattivo. Un'app che reagisce a `sl-change` non riceve la selezione fatta da tastiera | color-picker.component.ts:1023-1031 | Space: valore invariato, nessun evento. Enter: `#4a90e2` → `#d0021b`, `eventi: (nessuno)`. Click: `sl-change`, `sl-input` | WCAG 2.1.1; APG Button | `<button type="button">` con `@click=selectSwatch` |
| SL-COLOR-PICKER-02 | Bassa | API a11y | Nomi hardcoded in inglese, non sovrascrivibili (le altre stringhe passano da LocalizeController, r. 934, 954, 968) | color-picker.component.ts:861, 882, 917 | Con `lang=it`: `slider "hue"`, `slider "alpha"`, `application "HSV"` | WCAG 3.1.2 | Chiavi di traduzione `hue`, `opacity`, `saturationBrightness` |
| SL-COLOR-PICKER-05 | Bassa | Nome/stato | In modalità dropdown (default) il trigger mostra il colore selezionato solo visivamente; il valore si legge solo aprendo il pannello | color-picker.component.ts:1061-1082 | `button "Select a color" [expanded=false]` con value `#4a90e2` | WCAG 1.1.1 | Testo nascosto con il valore nel trigger |
| SL-COLOR-PICKER-10 | Bassa | Aspetti visivi | Gli indicatori di posizione (bordo bianco + anello `rgba(0,0,0,.25)`) non raggiungono 3:1 su zone chiare o sature | color-picker.styles.ts:47-57, 90-98 | Prova: codice (gradienti non misurabili con `contrast:`). Anello su `#fff` = `#bfbfbf` → 1.84:1; bordo bianco su bianco 1:1; handle della hue (fill bianco) su `#ffff00` 1.07:1, anello 1.83:1 | WCAG 1.4.11 | Doppio anello bianco + nero |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-COLOR-PICKER-M04 | miglioramento | `aria-valuetext` su hue e alpha | r. 881-887, 916-922 |
| SL-COLOR-PICKER-03 | miglioramento | Up/Down e PageUp/PageDown su hue e alpha (oggi funzionano Left/Right/Home/End) | r. 337-403 |
| SL-COLOR-PICKER-M02 | miglioramento | Nomi umani per gli swatch, stato selezionato, contenitore con nome | r. 1012-1037 |
| SL-COLOR-PICKER-08 | miglioramento | La preview "Copy" non dice cosa copia; l'esito è solo un'animazione; `execCommand` deprecato | r. 212-222, 930-939 |
| SL-COLOR-PICKER-09 | miglioramento | `base` generic con `tabindex=0` (inline) e `aria-labelledby` rotto in dropdown | r. 822-833 |
| SL-COLOR-PICKER-11 | miglioramento | Area di hit di 24px per gli slider | styles r. 5-9 |
| SL-COLOR-PICKER-12 | miglioramento | Reduced motion per pulse e scale (AAA) | styles r. 56-61, 171-184 |
| SL-COLOR-PICKER-13 | miglioramento | Test axe e test di tastiera | color-picker.test.ts |
| SL-COLOR-PICKER-M01 | miglioramento | Il bottone formato resta abilitato con `disabled`; `aria-label` sull'host inutile | r. 966-981 |

### Responsabilità del consumer
- La `label` è sempre visivamente nascosta: affiancare un testo visibile coerente con `label` (3.3.2).

### Da verificare con AT reali
- `aria-live="polite"` sul contenitore di input e bottoni (r. 942): possibili annunci a raffica durante drag e frecce (NVDA/JAWS/VoiceOver).
- Resa di `role="application"` nei vari screen reader (modalità virtuale).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-COLOR-PICKER-01 | Alta | ridimensionato → Media | Valore assente confermato; esiste l'alternativa equivalente del campo testo |
| SL-COLOR-PICKER-02 | Media | ridimensionato → Bassa | Resta solo la lingua dei nomi hardcoded; valuetext → miglioramento |
| SL-COLOR-PICKER-03 | Media | riclassificato | Operabile con Left/Right/Home/End |
| SL-COLOR-PICKER-04 | Media | confermato | Enter senza eventi, Space inattivo |
| SL-COLOR-PICKER-05 | Media | ridimensionato → Bassa | Resta il valore non esposto sul trigger; la label nascosta è del consumer |
| SL-COLOR-PICKER-06 | Media | scartato | `aria-label` resta sull'host: il bottone si chiama `"hex"` (testo visibile) |
| SL-COLOR-PICKER-07 | Media | riclassificato | Dipende dall'AT |
| SL-COLOR-PICKER-08 | Media | riclassificato | Nome comprensibile nel contesto; l'animazione non è un messaggio di stato testuale |
| SL-COLOR-PICKER-09 | Bassa | riclassificato | Nome su generic ignorato; tab stop inerte |
| SL-COLOR-PICKER-10 | Bassa | confermato | Prova da codice |
| SL-COLOR-PICKER-11 | Bassa | riclassificato | Eccezione "equivalent" di 2.5.8 |
| SL-COLOR-PICKER-12 | Bassa | riclassificato | Criterio AAA |
| SL-COLOR-PICKER-13 | Bassa | riclassificato | Test |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `label` / slot | Sì | Sì: `button "Select a color"`, inline `generic "Colore"` | Sì |
| `disabled` | Sì | Quasi tutto `[disabled]`, tranne il bottone formato | Sì |
| `name`/`required` | Sì | Sull'`sl-input` interno | Sì |
| nomi di slider e griglia | No (hardcoded) | `"hue"`, `"alpha"`, `"HSV"` | Sì, localizzati |
| nomi degli swatch | No | Stringa CSS | Utile |

### Fix proposti
```ts
// color-picker.component.ts — griglia (r. 849-864)
role="slider"
aria-label=${this.localize.term('saturationBrightness')}
aria-valuemin="0" aria-valuemax="100"
aria-valuenow=${Math.round(this.saturation)}
aria-valuetext=${`${this.localize.term('saturation')} ${Math.round(this.saturation)}%, ${this.localize.term('brightness')} ${Math.round(this.brightness)}%`}

// hue/alpha (r. 882, 917)
aria-label=${this.localize.term('hue')}
aria-label=${this.localize.term('opacity')}

// swatch (r. 1023-1031)
<button type="button" part="swatch" class="color-picker__swatch color-picker__transparent-bg"
  aria-label=${swatch} ?disabled=${this.disabled} @click=${() => this.selectSwatch(swatch)}>…</button>

// trigger (r. 1079-1081)
<sl-visually-hidden><slot name="label">${this.label}</slot> ${this.isEmpty ? '' : this.inputValue}</sl-visually-hidden>
```
```css
/* color-picker.styles.ts — r. 47-57, 90-98 */
.color-picker__grid-handle,
.color-picker__slider-handle { box-shadow: 0 0 0 1px #000, inset 0 0 0 1px #000; }
```
