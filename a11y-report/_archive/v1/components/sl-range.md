## Range (`sl-range` – src/components/range/range.component.ts)
**Pattern APG di riferimento:** APG Slider pattern (`<input type="range">` nativo)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 2 · Bassa 5 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<input type="range">` nativo (r. 313-331): `slider` con `aria-valuenow/min/max` impliciti da `value/min/max`. Il tooltip è un `<output>` (ruolo implicito `status`, SL-RANGE-03). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome da `<label for="input">` nello stesso shadow root ✅ (r. 289-296), help-text via `aria-describedby` ✅, `disabled` nativo ✅. Il valore formattato da `tooltipFormatter` non è esposto come `aria-valuetext` (SL-RANGE-01). Senza `label` nessun nome e nessun warning (SL-RANGE-04). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | ID `input`/`help-text` interni ✅; `aria-label`/`aria-labelledby`/`aria-describedby`/`aria-valuetext` sull'host non raggiungono l'input; `<label for>` esterna non associabile (SHARED §2). |
| 4 | Tastiera e focus | ✅ | Frecce/Home/End/PageUp/PageDown nativi (frecce testate, `range.test.ts:63-94`). `outline: none` sull'input (styles r. 145-147) compensato da `outline: var(--sl-focus-ring)` sul thumb (r. 83-86, 133-136) ✅ 6.21:1 / 10.27:1. Tooltip visibile al focus. |
| 5 | Form e validazione | ⚠️ | `name/form` ✅; `setCustomValidity` non produce `aria-invalid` (SL-RANGE-07). `required` N/A per range. |
| 6 | Live region | ⚠️ | `<output>` sempre nel DOM (opacity 0 quando nascosto) con ruolo implicito `status`: annunci duplicati/rumorosi a ogni `input` (SL-RANGE-03). |
| 7 | Aspetti visivi | ❌ | Track attivo e inattivo entrambi `neutral-200` (1.25:1) → confine e porzione "valore" invisibili (SL-RANGE-02). Thumb `primary-600` 6.21:1 ✅. Thumb 20px (SL-RANGE-05). Tooltip neutral-0 su neutral-900 15.46:1 ✅. `forced-colors` presente (bordi trasparenti, r. 216-233) ✅. Transizione opacity del tooltip: SHARED-05. |
| 8 | API pubblica a11y | ⚠️ | `label`, `help-text`, `title`, `tooltipFormatter` ✅; mancano `aria-valuetext`/`valueTextFormatter`, passthrough `aria-label`. |
| 9 | Documentazione e test | ⚠️ | 1 test axe con `label` (`range.test.ts:11-14`); nessun axe disabled/tooltip; la maggior parte degli esempi in docs è **senza label** (SL-RANGE-06). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-RANGE-01 | Media | 2/8 | `tooltipFormatter` cambia solo il testo visivo (es. docs: `` `Total - ${value}%` ``) ma l'input non riceve `aria-valuetext`: lo screen reader annuncia il numero grezzo ("50") invece di "50%". Nessuna property `aria-valuetext`/`valueTextFormatter` passabile dal consumer. | src/components/range/range.component.ts:93, 313-331 (nessun `aria-valuetext`), 335; docs/pages/components/range.md:310 | APG Slider (aria-valuetext); WCAG 1.3.1, 4.1.2 | `aria-valuetext=${ifDefined(this.valueText ?? (this.tooltipFormatter !== defaultFormatter ? this.tooltipFormatter(this.value) : undefined))}` + property `valueTextFormatter`. |
| SL-RANGE-02 | Media | 7 | Track di default `--track-color-active` = `--track-color-inactive` = `neutral-200` (1.25:1 light, 1.35:1 dark su neutral-0): il track che identifica estensione del controllo è quasi invisibile e la porzione "valore" non si distingue (stesso colore). Lo stato è leggibile solo dalla posizione del thumb. | src/components/range/range.styles.ts:7-8, 30-38 | WCAG 1.4.11 | Default `--track-color-active: var(--sl-color-primary-600)` e `--track-color-inactive: var(--sl-color-neutral-400)` (3.21:1 light; in dark usare neutral-500). |
| SL-RANGE-03 | Bassa | 6/1 | Il tooltip è un `<output>` (ruolo implicito `status`, live polite) sempre renderizzato (anche con `opacity: 0`) e aggiornato a ogni `input`: il valore viene annunciato due volte (slider + status) e resta leggibile in browse mode come numero isolato fuori contesto; non ha `for="input"`. | src/components/range/range.component.ts:332-338; src/components/range/range.styles.ts:173, 188-190 | WCAG 4.1.3 (qualità), 1.3.1 | Rendere il tooltip `aria-hidden="true"` (`<div>` anziché `<output>`) e affidare l'annuncio ad `aria-valuetext` sull'input. |
| SL-RANGE-04 | Bassa | 2/8 | Senza `label` il `<label>` è `aria-hidden` e lo slider non ha nome; `aria-label` sull'host non viene propagato (SHARED §2); nessun warning dev. | src/components/range/range.component.ts:289-296, 313-325 | WCAG 4.1.2 | Passthrough `aria-label` sull'input quando `label` è vuota + warning dev. |
| SL-RANGE-05 | Bassa | 7 | Thumb `--thumb-size: 20px` (< 24px) e input alto `--track-height: 6px`; regge solo con l'eccezione "spacing". Il click sul track (alternativa al drag, WCAG 2.5.7) ha un'area di 6px. | src/components/range/range.styles.ts:5, 10, 24, 61-65 | WCAG 2.5.8, 2.5.7 | `--thumb-size: 24px` di default e `height: max(var(--track-height), var(--thumb-size))` sull'input con track disegnato dal pseudo-elemento. |
| SL-RANGE-06 | Bassa | 9 | Docs: 10 esempi su 15 mostrano `<sl-range>` senza `label` (es. preview principale, Min/Max, Disabled, Tooltip, Formatter), incoraggiando slider senza nome; nessuna menzione di `aria-valuetext`. Test axe solo con `label`, nessun test su tooltip/disabled. | docs/pages/components/range.md:9, 95, 121, 147, 173, 306; src/components/range/range.test.ts:11-14 | WCAG 4.1.2 (docs) | Aggiungere `label` a tutti gli esempi; test axe su disabled e tooltip visibile. |
| SL-RANGE-07 | Bassa | 5 | `setCustomValidity`/`data-user-invalid` non producono `aria-invalid`; nessun messaggio d'errore associato. | src/components/range/range.component.ts:223-226, 270-273 | WCAG 3.3.1 | `aria-invalid` reattivo sull'input. |
| SL-RANGE-08 | Suggerimento | 7 | Il tooltip compare solo a focus/drag e scompare al blur: unica visualizzazione del valore. Il valore corrente non è mai visibile staticamente (nessuna opzione per mostrarlo sempre) e il tooltip non è dismissibile con Esc se copre la label. | src/components/range/range.component.ts:147-166; src/components/range/range.styles.ts:173, 188-195 | WCAG 1.4.13 (verificare), usabilità | Opzione `tooltip="always"` / valore visibile accanto alla label; Esc nasconde il tooltip. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` / slot `label` | Sì | Sì (`<label for="input">`) | — |
| `help-text` / slot | Sì | Sì (`aria-describedby`) | — |
| `aria-label` (host) | No | No | Da propagare |
| `aria-valuetext` / formatter | No | — | Da aggiungere (SL-RANGE-01) |
| `min` / `max` / `step` / `value` | Sì | Sì (nativi → aria-value*) | — |
| `disabled` | Sì | Sì (nativo) | Tooltip rimosso se disabled ✅ |
| `aria-invalid` | No | — | Da aggiungere |
| `title` / `name` / `form` | Sì | Sì | — |

### Fix proposti
```ts
// range.component.ts
/** Testo leggibile del valore per le tecnologie assistive (es. "50%", "Alto"). */
@property({ attribute: 'value-text' }) valueText?: string;
/** Formatter per aria-valuetext; se assente usa tooltipFormatter. */
@property({ attribute: false }) valueTextFormatter?: (value: number) => string;

private get ariaValueText() {
  if (this.valueText) return this.valueText;
  const fmt = this.valueTextFormatter ?? this.tooltipFormatter;
  const text = fmt(this.value);
  return text !== String(this.value) ? text : undefined;
}

render() {
  return html`
    <input type="range" id="input"
      aria-valuetext=${ifDefined(this.ariaValueText)}
      aria-invalid=${this.hasAttribute('data-user-invalid') ? 'true' : 'false'}
      aria-describedby="help-text" …/>
    ${this.tooltip !== 'none' && !this.disabled
      ? html`<div part="tooltip" class="range__tooltip" aria-hidden="true">${this.tooltipFormatter(this.value)}</div>`
      : ''}`;
}
```
```css
/* range.styles.ts */
:host {
  --thumb-size: 24px;
  --track-color-active: var(--sl-color-primary-600);
  --track-color-inactive: var(--sl-input-border-color);
}
```

### Non verificabile
- Annuncio reale (doppio) del valore via `<output>`/status in NVDA/JAWS/VoiceOver.
- Resa del focus ring su `::-webkit-slider-thumb` in Safari e in forced-colors.
- Se il tooltip copre contenuti (label/altri controlli) in layout reali (WCAG 1.4.13): dipende dal consumer.
- Contrasto con `--track-color-*` personalizzati dal consumer.
