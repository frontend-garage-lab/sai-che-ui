## Split Panel (`<sl-split-panel>` – src/components/split-panel/split-panel.component.ts)
**Pattern APG di riferimento:** APG Window Splitter (`role="separator"` focusabile)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 4 · Bassa 4 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="separator"` focusabile con `aria-valuenow/min/max` ✅ (r. 350-353); manca `aria-orientation` (implicito `horizontal` anche quando il divisore è verticale) e `aria-controls` verso il pannello primario (SL-SPLIT-PANEL-01, -06). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome localizzato "Resize"/"Ridimensiona" ✅ (r. 354) ma generico e non personalizzabile (SL-SPLIT-PANEL-03); `aria-valuenow` decimale senza `aria-valuetext` (SL-SPLIT-PANEL-07); disabled senza `aria-disabled` (SL-SPLIT-PANEL-08). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | I pannelli sono `<slot>` (r. 344, 362): `aria-controls` verso uno slot non è utile; servirebbe `ariaControlsElements` verso l'elemento slottato (SL-SPLIT-PANEL-06). |
| 4 | Tastiera e focus | ⚠️ | Frecce (Shift ×10), Home/End, Enter collapse/expand ✅ APG (r. 223-270); frecce non invertite in RTL (SL-SPLIT-PANEL-05); `outline: none` con focus reso dal fill `primary-600` ✅ ma perso in forced-colors (SL-SPLIT-PANEL-04). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Valore esposto da `aria-valuenow` sul separator focusato. |
| 7 | Aspetti visivi | ⚠️ | Divisore `--sl-border-subtle` 1.25:1 / 1.35:1 (SL-SPLIT-PANEL-02); hit area 12px e solo drag col puntatore (SL-SPLIT-PANEL-02); forced-colors parziale (styles r. 76-80). |
| 8 | API pubblica a11y | ⚠️ | Nessuna property `label`/`aria-valuetext` (SL-SPLIT-PANEL-03). |
| 9 | Documentazione e test | ⚠️ | Test axe statico ✅ (test r. 45-53), test mouse/disabled/snap ✅; nessun test tastiera (Enter, frecce, Home/End); docs avvisano sul focus del divider custom ✅ (docs r. 1097) ma non descrivono la tastiera (SL-SPLIT-PANEL-09). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-SPLIT-PANEL-01 | Media | 1 | Manca `aria-orientation`: per `separator` il default è `horizontal`, ma nel layout di default (pannelli affiancati) il divisore è verticale e si muove con ←/→ → orientamento annunciato errato. | split-panel.component.ts:346-358 | WCAG 1.3.1, 4.1.2; APG Window Splitter | `aria-orientation=${this.vertical ? 'horizontal' : 'vertical'}`. |
| SL-SPLIT-PANEL-02 | Media | 7 | Il ridimensionamento col puntatore richiede il trascinamento (nessuna alternativa a singolo click, es. pulsante collapse/expand) e la hit area è 12px (< 24px); il divisore visibile `--sl-border-subtle` (neutral-200) ha contrasto 1.25:1 light / 1.35:1 dark. | :356-357 `@mousedown/@touchstart=${this.handleDrag}`; styles:6 `--divider-hit-area: 12px`, :24 `background-color: var(--sl-border-subtle)` | WCAG 2.5.7, 2.5.8, 1.4.11 | Default hit area 24px; click/doppio click sul divider per collapse/expand (come Enter); colore divisore ≥3:1 (es. `neutral-400` light) o handle visibile. |
| SL-SPLIT-PANEL-03 | Media | 2/8 | Il nome è sempre "Resize" e non personalizzabile; APG chiede che il nome del separator corrisponda al pannello primario (es. "Navigazione"). Con più split panel i nomi sono identici. `aria-label` sull'host resta sull'host. | :354 `aria-label=${this.localize.term('resize')}` | WCAG 2.4.6, 4.1.2; APG Window Splitter | Property `label` (fallback al termine localizzato). |
| SL-SPLIT-PANEL-04 | Media | 4/7 | Il focus è reso solo cambiando `background-color` del divisore (`outline: none`); in `forced-colors` il colore viene forzato e l'outline 1px trasparente è sempre presente → nessuna differenza tra focus e non-focus. | split-panel.styles.ts:32-39, 76-80 | WCAG 2.4.7, 1.4.11; SHARED-02 | `@media (forced-colors: active) { .divider:focus-visible { outline: 2px solid Highlight; outline-offset: 1px; } }`. |
| SL-SPLIT-PANEL-05 | Bassa | 4 | In RTL orizzontale ←/→ non sono invertite (il drag invece passa `isRtl` allo snap): ← riduce `position` anche se il pannello start è a destra, quindi il divisore si muove nella direzione opposta alla freccia. | :230-240 (nessun controllo `dir`) | WCAG 2.1.1 (prevedibilità), 3.2.4 | Invertire `incr` quando `localize.dir() === 'rtl' && !this.vertical`. |
| SL-SPLIT-PANEL-06 | Bassa | 1/3 | Manca `aria-controls` verso il pannello primario richiesto dal pattern; i pannelli sono slot e non hanno ruolo/nome. | :344, :362 | APG Window Splitter | `divider.ariaControlsElements = [primo elemento assegnato allo slot primario]` (ARIA reflection, verificare supporto). |
| SL-SPLIT-PANEL-07 | Bassa | 2 | `aria-valuenow` riceve valori decimali non arrotondati (es. 37.8125 dopo drag/resize) senza `aria-valuetext`. | :217, :351 | WCAG 4.1.2; APG Window Splitter | `aria-valuenow=${Math.round(position)}` + `aria-valuetext` "38%". |
| SL-SPLIT-PANEL-08 | Bassa | 2 | Con `disabled` viene tolto solo `tabindex`: il separator resta esposto con valori ma senza `aria-disabled`. | :349 `tabindex=${ifDefined(this.disabled ? undefined : '0')}` | WCAG 4.1.2 | `aria-disabled=${this.disabled ? 'true' : nothing}`. |
| SL-SPLIT-PANEL-09 | Suggerimento | 9 | Nessun test di tastiera (frecce, Home/End, Enter collapse); docs senza descrizione dei tasti. Transizioni non disattivate con reduced motion (SHARED-05). | split-panel.test.ts:39-293; styles:27-29 | Qualità; SHARED-05 | Test `sendKeys`; sezione tastiera nei docs. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | No | — | Default localizzato `resize` ✅; aggiungere override. |
| `aria-orientation` | No | — | SL-SPLIT-PANEL-01. |
| `aria-valuetext` | No | — | SL-SPLIT-PANEL-07. |
| `aria-controls` | No | — | SL-SPLIT-PANEL-06. |
| `disabled` | Sì | ⚠️ | Manca `aria-disabled`. |

### Fix proposti
```ts
@property() label = '';

html`<div part="divider" class="divider"
  tabindex=${ifDefined(this.disabled ? undefined : '0')}
  role="separator"
  aria-orientation=${this.vertical ? 'horizontal' : 'vertical'}
  aria-valuenow=${Math.round(this.position)} aria-valuemin="0" aria-valuemax="100"
  aria-valuetext=${`${Math.round(this.position)}%`}
  aria-label=${this.label || this.localize.term('resize')}
  aria-disabled=${this.disabled ? 'true' : nothing}
  @keydown=${this.handleKeyDown} @mousedown=${this.handleDrag} @touchstart=${this.handleDrag}
  @dblclick=${this.toggleCollapse}>
  <slot name="divider"></slot>
</div>`;

// handleKeyDown – RTL
const rtl = this.localize.dir() === 'rtl' && !this.vertical;
const incr = (event.shiftKey ? 10 : 1) * (this.primary === 'end' ? -1 : 1) * (rtl ? -1 : 1);
```
```css
:host { --divider-hit-area: 24px; }
.divider { background-color: var(--sl-color-neutral-400); }
@media (forced-colors: active) {
  .divider { background-color: CanvasText; }
  :host(:not([disabled])) .divider:focus-visible { outline: 2px solid Highlight; outline-offset: 1px; }
}
```

### Non verificabile
- Resa dell'orientamento e del valore del separator in NVDA/JAWS/VoiceOver.
- Contrasto di divider personalizzati tramite slot `divider` o `::part(divider)` (consumer).
- Spaziatura effettiva tra hit area e target nei pannelli (eccezione 2.5.8).
