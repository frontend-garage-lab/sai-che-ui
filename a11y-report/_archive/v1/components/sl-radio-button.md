## Radio Button (`sl-radio-button` – src/components/radio-button/radio-button.component.ts)
**Pattern APG di riferimento:** APG Radio Group pattern (radio resi come segmented control; `<button role="radio">` interno, host `role="presentation"`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<button role="radio" aria-checked="true/false">` (r. 105-108) dentro `<div role="presentation">`; host `role="presentation"` (r. 64) per non interrompere la catena radiogroup → radio. Struttura valida, ma `aria-disabled` scritto anche sull'host presentazionale (SL-RADIO-BUTTON-02). |
| 2 | Nome, descrizione, stato | ✅ | Nome dal contenuto del `<button>` (slot default); icon-only: docs chiedono `label` su `sl-icon` (docs/pages/components/radio-button.md:410) → `role="img"` con nome ✅. Stati `aria-checked`, `aria-disabled` sul bottone ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il ruolo è nel shadow root: `aria-label`/`aria-describedby` sull'host (presentation) sono ignorati e non propagati (SL-RADIO-BUTTON-03). |
| 4 | Tastiera e focus | ❌ | Frecce/Space gestiti dal gruppo con focus sul `<button>` interno ✅; `:focus-visible` con `outline: var(--sl-focus-ring)` da button.styles (r. 48-50) ✅. Ma **ogni** bottone resta tab stop (nessun roving tabindex), anche quelli disabilitati (SL-RADIO-BUTTON-01). |
| 5 | Form e validazione | N/A | Gestiti da `sl-radio-group`. |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Altezze da `--sl-input-height-*` (28/36/44px) ✅ 2.5.8. Checked: bordo primary-600 (6.21:1) vs unchecked neutral-300 → differenza di luminanza tra stati ≈ 4:1, non solo tinta ✅. Forced-colors: outline trasparente sul checked (button.styles r. 373-377) ✅. Transizioni: SHARED-05. |
| 8 | API pubblica a11y | ⚠️ | Nessun `label`/`aria-label` dedicato; nome solo da contenuto slottato. |
| 9 | Documentazione e test | ⚠️ | Docs spiegano i nomi delle icone ✅; test senza axe né tastiera (SL-RADIO-BUTTON-04). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-RADIO-BUTTON-01 | Media | 4 | Nessun roving tabindex: il `<button>` interno è tabbable per default e il gruppo non imposta mai `tabindex="-1"` sui non selezionati quando `hasButtonGroup` (salta l'assegnazione); unico intervento è `tabindex="0"` sul primo bottone se nessuno è checked. Ogni opzione (anche `aria-disabled`) è un tab stop separato, contrariamente al pattern. | src/components/radio-group/radio-group.component.ts:170-176, 181-186, 219-225; src/components/radio-button/radio-button.component.ts:105-124 (nessun `tabindex`) | APG Radio Group (single tab stop); WCAG 2.4.3 | Nel gruppo impostare `tabindex` sul `<button>` interno: `0` sul checked (o primo abilitato), `-1` sugli altri (vedi `syncTabStops()` in sl-radio-group.md); oppure property interna `tabIndexValue` riflessa sul bottone. |
| SL-RADIO-BUTTON-02 | Bassa | 1/3 | `aria-disabled` è scritto sull'host che ha `role="presentation"`: per la regola di conflict resolution, un attributo ARIA globale (aria-disabled lo è in ARIA 1.1 e in molti browser) può annullare il ruolo presentazionale ed esporre l'host come elemento generico; inoltre è duplicato con il bottone interno. | src/components/radio-button/radio-button.component.ts:64, 87-90, 118 | WAI-ARIA 1.2 §Presentational Roles Conflict Resolution | Rimuovere `this.setAttribute('aria-disabled', …)` dall'host; lasciare solo `aria-disabled` sul `<button>`. |
| SL-RADIO-BUTTON-03 | Bassa | 3/8 | Nessun passthrough del nome: `aria-label` sul host (presentation) è ignorato; per opzioni icon-only l'unico modo è `label` sull'icona slottata (documentato). Nessun warning dev se il bottone è senza nome. | src/components/radio-button/radio-button.component.ts:62-65, 105-128 | WCAG 4.1.2 | Property `label` → `aria-label=${ifDefined(this.label \|\| undefined)}` sul `<button>`; warning dev se slot default e `label` vuoti. |
| SL-RADIO-BUTTON-04 | Bassa | 9 | Test solo funzionali: nessun `to.be.accessible()`, nessun test su `role="radio"`/`aria-checked` del bottone interno né sul numero di tab stop. | src/components/radio-button/radio-button.test.ts:6-45 | Qualità | Test axe dentro un `sl-radio-group` etichettato; test Tab che verifichi un solo tab stop. |
| SL-RADIO-BUTTON-05 | Suggerimento | 1 | Codice morto legato a un input nascosto non più renderizzato (`@query('.hidden-input')`, styles `.hidden-input`), e `@query('.button') input: HTMLInputElement` tipizzato in modo errato: rischio di confusione nei fix a11y futuri. | src/components/radio-button/radio-button.component.ts:36-37; src/components/radio-button/radio-button.styles.ts:15-27 | Qualità | Rimuovere il codice morto e tipizzare `button: HTMLButtonElement`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `role="radio"` (button interno) | Sì | Sì | — |
| `aria-checked` | Sì | Sì (`"true"/"false"`) | — |
| `aria-disabled` / `disabled` | Sì | Parziale | Anche sull'host presentation (SL-RADIO-BUTTON-02) |
| `label` / `aria-label` | No | — | Da aggiungere sul `<button>` |
| `tabindex` (roving) | No | — | Da gestire dal gruppo |
| slot default/prefix/suffix | Sì | Sì | Icone con `label` se icon-only |

### Fix proposti
```ts
// radio-button.component.ts
@property() label = '';
/** @internal gestito da sl-radio-group per il roving tabindex */
@property({ attribute: false }) buttonTabIndex = 0;

connectedCallback() {
  super.connectedCallback();
  this.setAttribute('role', 'presentation');
}
// rimuovere handleDisabledChange che scrive aria-disabled sull'host

render() {
  return html`<div part="base" role="presentation">
    <button
      role="radio"
      aria-checked=${this.checked ? 'true' : 'false'}
      aria-disabled=${this.disabled ? 'true' : 'false'}
      aria-label=${ifDefined(this.label || undefined)}
      tabindex=${this.buttonTabIndex}
      type="button" …>…</button>
  </div>`;
}
```

### Non verificabile
- Esposizione reale dell'host `role="presentation"` con `aria-disabled` nell'albero di accessibilità (Chrome/Safari/Firefox): verificare con DevTools Accessibility / screen reader.
- Annuncio "n di m" con screen reader quando i radio sono bottoni nel shadow root di elementi presentazionali.
