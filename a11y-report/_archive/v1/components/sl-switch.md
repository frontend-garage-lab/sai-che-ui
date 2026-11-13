## Switch (`sl-switch` – src/components/switch/switch.component.ts)
**Pattern APG di riferimento:** APG Switch pattern (`<input type="checkbox" role="switch">`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 4 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Input nativo `type="checkbox"` con `role="switch"` (r. 203, 210): combinazione consentita da ARIA in HTML; stato on/off dal `checked` nativo. `aria-checked` esplicito ridondante (SL-SWITCH-07). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome dal testo slottato dentro `<label>` ✅; help-text via `aria-describedby="help-text"` ✅; nessun modo di nominare uno switch senza testo visibile (SL-SWITCH-02). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | ID interni nello stesso shadow root ✅; `aria-*` e `<label for>` esterni non raggiungono l'input (SHARED §2) → SL-SWITCH-03. Un solo tab stop ✅. |
| 4 | Tastiera e focus | ✅ | Space nativo, ←/→ come extra (r. 125-139) ✅ (testati). Focus: `outline: var(--sl-focus-ring)` sul thumb (styles r. 105-110, 141-146) ✅ 6.21:1 / 10.27:1, mantenuto in forced-colors. |
| 5 | Form e validazione | ⚠️ | `required` nativo ✅; nessun `aria-invalid`/messaggio d'errore (SL-SWITCH-04); asterisco `::after` nel nome (SL-SWITCH-06). |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Dark theme: track off e thumb a 2.17:1 (SL-SWITCH-01). Target alto 18/20px in small/medium (SL-SWITCH-05). Stato non solo colore (posizione del thumb) ✅. `forced-colors`: thumb checked `ButtonText` ✅. Transizioni/scale: SHARED-05. |
| 8 | API pubblica a11y | ❌ | Mancano `label`/`aria-label`, `aria-describedby` esterno, `aria-invalid`/`error-message`, warning dev. |
| 9 | Documentazione e test | ⚠️ | Un test axe sullo stato base (`switch.test.ts:9-12`); test tastiera Space/frecce ✅; nessun axe su checked/disabled/required; docs senza sezione Accessibility (SL-SWITCH-08). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-SWITCH-01 | Media | 7 | Contrasto non-testo in dark theme: track off `neutral-400` su superficie `neutral-0` = 2.17:1 e thumb `neutral-0` (scuro in dark) su track `neutral-400` = 2.17:1 → né il confine del controllo né la posizione del thumb (indicatore di stato) raggiungono 3:1. In light 3.21:1 ✅. | src/components/switch/switch.styles.ts:52-53, 63-65 | WCAG 1.4.11 | Usare `--sl-input-border-color` per il track off (dark neutral-500 3.48:1) e un thumb chiaro fisso (`--sl-color-neutral-1000`/`#fff` in dark) o token dedicati `--sl-switch-track-off`, `--sl-switch-thumb`. |
| SL-SWITCH-02 | Media | 2/8 | Nessuna property per nome senza testo visibile (es. switch in riga tabella); `aria-label` sull'host resta su elemento senza ruolo; nessun warning dev. | src/components/switch/switch.component.ts:201-219, 225-227 | WCAG 4.1.2 | `@property() label` → `aria-label=${ifDefined(this.label \|\| undefined)}` sull'input + warning dev. |
| SL-SWITCH-03 | Media | 3 | Non form-associated: `<label for>` esterna e `aria-describedby` del consumer non raggiungono l'input interno (rimando SHARED §2). | src/components/switch/switch.component.ts:41 | WCAG 1.3.1, 4.1.2 | Pattern FACE + `delegatesFocus` (shared §10). |
| SL-SWITCH-04 | Media | 5 | `data-user-invalid` non produce `aria-invalid`; nessuna property/slot `error-message` associata; errore solo tooltip nativo. | src/components/switch/switch.component.ts:110-113, 201-219 | WCAG 3.3.1, 4.1.2 | `aria-invalid` reattivo + `error-message` referenziato da `aria-describedby`. |
| SL-SWITCH-05 | Bassa | 7 | Target size: area cliccabile (`<label>`) alta quanto il thumb = toggle-size + 4px → 18px (small), 20px (medium), 24px (large); label con `line-height: var(--height)`. Conforme solo per eccezione "spacing". | src/components/switch/switch.styles.ts:8-30, 154-157 | WCAG 2.5.8 | `.switch { min-block-size: 24px }`. |
| SL-SWITCH-06 | Bassa | 2 | Asterisco required `::after { content: '*' }` dentro il `<label>` → entra nel nome accessibile. | src/components/switch/switch.styles.ts:162-166 | WCAG 1.3.1 | `content: var(--sl-input-required-content) / ''`. |
| SL-SWITCH-07 | Bassa | 1 | `aria-checked` esplicito su `<input type="checkbox">` (anche con `role="switch"`): vietato da ARIA in HTML e ridondante col `checked` nativo; rischio di desincronizzazione se in futuro lo stato cambia senza re-render. | src/components/switch/switch.component.ts:211 | ARIA in HTML; WCAG 4.1.2 | Rimuovere `aria-checked`: il `role="switch"` usa lo stato `checked` nativo. |
| SL-SWITCH-08 | Suggerimento | 9 | Test axe solo sullo stato base; nessun axe su checked/disabled/required/help-text. Docs senza indicazioni su nome accessibile/role switch. | src/components/switch/switch.test.ts:9-12; docs/pages/components/switch.md | Qualità | Aggiungere test axe per gli stati e sezione Accessibility. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `role="switch"` | Sì (interno) | Sì | — |
| slot default (label) | Sì | Sì | Asterisco nel nome |
| `label` / `aria-label` | No | — | Da aggiungere |
| `aria-describedby` / `help-text` | Solo `help-text` | Sì | Riferimenti esterni impossibili |
| `aria-invalid` / `error-message` | No | — | Da aggiungere |
| `required` / `disabled` | Sì | Sì (nativi) | — |
| `title` / `name` / `value` / `form` | Sì | Sì | — |

### Fix proposti
```ts
// switch.component.ts
@property() label = '';
render() {
  return html`<input
      class="switch__input"
      type="checkbox"
      role="switch"
      .checked=${live(this.checked)}
      aria-label=${ifDefined(this.label || undefined)}
      aria-invalid=${this.hasAttribute('data-user-invalid') ? 'true' : 'false'}
      aria-describedby="help-text"
      …
    />`; // senza aria-checked
}
```
```css
/* switch.styles.ts */
.switch { min-block-size: 24px; }
.switch__control {
  background-color: var(--sl-switch-track-off, var(--sl-input-border-color));
  border-color: var(--sl-switch-track-off, var(--sl-input-border-color));
}
.switch__control .switch__thumb { background-color: var(--sl-switch-thumb, #fff); }
:host([required]) .switch__label::after { content: var(--sl-input-required-content) / ''; }
```

### Non verificabile
- Annuncio "switch, on/off" vs "checkbox" nei diversi screen reader (VoiceOver/NVDA/JAWS) con `role="switch"` su input nativo.
- Contrasto con colori custom passati via parts `control`/`thumb`.
