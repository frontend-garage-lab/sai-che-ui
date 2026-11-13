## Option (`sl-option` – src/components/option/option.component.ts)
**Pattern APG di riferimento:** APG Listbox (option) all'interno di APG Select-Only Combobox (`sl-select`).
**Esito sintetico:** ⚠️ Parzialmente conforme — `role="option"` con `aria-selected`/`aria-disabled` sempre valorizzati sull'host (riferibile dal light DOM); l'indicatore dell'opzione corrente ha contrasto insufficiente e manca in forced-colors.
**Conteggio finding:** Blocker 0 · Alta 0 · Media 2 · Bassa 3 · Suggerimento 2

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `role="option"` sull'host (r. 57), figlio nel flat tree del `role="listbox"` di `sl-select`. Ruolo impostato con `setAttribute` (SHARED §2): uso fuori da `sl-select` crea un `option` senza listbox (consumer, SL-OPTION-05). |
| 2 | Nome, descrizione, stato | ✅ | Nome dal contenuto (slot default + prefix/suffix, SL-OPTION-04). `aria-selected` inizializzato a `false` (r. 58) e aggiornato (r. 88-91); `aria-disabled` sempre presente (watch senza `waitUntilFirstUpdate`, r. 83-86). Check icon `aria-hidden="true"` (r. 141). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo e stati sull'host nel light DOM: referenziabile da `aria-activedescendant`/element reflection; nessun ID interno referenziato. |
| 4 | Tastiera e focus | ⚠️ | Focus gestito da `sl-select` (roving `tabIndex` + `focus()`); disabled resta navigabile ma non selezionabile (ammesso da APG). `:host(:focus) { outline: none }`: indicatore = solo sfondo primary-100 (SL-OPTION-01); nessun indicatore in forced-colors (SL-OPTION-02). |
| 5 | Form e validazione | N/A | Gestito da `sl-select`. |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi (statici) | ⚠️ | Testo neutral-800 su panel 12.51 (light) / 10.19 (dark) ✅; corrente primary-900 su primary-100 11.28 / 5.09 ✅; check selezionato primary-600 6.21 / 6.81 ✅ ma su opzione corrente dark 2.73 ❌ (SL-OPTION-03). Selezione indicata anche dall'icona (non solo colore) ✅. Altezza ≈ 28px (14px × 1.4 + 8px padding) ✅ 2.5.8. Disabled `opacity: 0.5` (esente). |
| 8 | API pubblica a11y | ⚠️ | Nessuna property a11y necessaria oltre al contenuto; ruolo non sovrascrivibile; nessun `label` esplicito per opzioni con contenuto ricco. |
| 9 | Documentazione e test | ⚠️ | Test: un axe dentro `sl-select` chiuso e verifica `aria-disabled` (option.test.ts:6-31); nessun test su `aria-selected`. Docs senza note su icone significative in prefix/suffix. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-OPTION-01 | Media | Focus / Contrasto | L'opzione corrente (che riceve il focus da tastiera) si distingue solo per lo sfondo primary-100 e il colore del testo; l'outline è rimosso. Contrasto sfondo corrente vs panel: light 1.14:1, dark 2.49:1 (< 3:1). | src/components/option/option.styles.ts:10-12 `:host(:focus) { outline: none; }`; r. 37-42 `background-color: var(--sl-color-primary-100);` | WCAG 1.4.11, 2.4.7 | Aggiungere un indicatore ≥3:1: es. `:host(:focus-visible) .option { outline: 2px solid var(--sl-color-primary-600); outline-offset: -2px; }` o barra laterale primary-600. |
| SL-OPTION-02 | Media | Forced colors | La media query `forced-colors` copre solo `:hover`; in High Contrast lo sfondo dell'opzione corrente viene forzato e non resta alcun indicatore di focus da tastiera. | option.styles.ts:89-94 `:host(:hover:not([aria-disabled='true'])) .option { outline: dashed 1px SelectedItem; }` | WCAG 2.4.7, 1.4.11 | `@media (forced-colors: active) { .option--current { outline: 2px solid Highlight; outline-offset: -2px; } .option--selected .option__check { color: Highlight; } }` |
| SL-OPTION-03 | Bassa | Contrasto UI | Icona di spunta (selezionato) primary-600 sull'opzione corrente in dark: 2.73:1 su primary-100. | option.styles.ts:69-72 `color: var(--sl-color-primary-600);` + r. 37-42 | WCAG 1.4.11 | In `.option--current.option--selected .option__check` usare `currentColor` (primary-900, 5.09:1). |
| SL-OPTION-04 | Bassa | Nome | Il nome accessibile include il testo di `prefix`/`suffix`, mentre `getTextLabel()` (usato per il valore mostrato nel combobox e il type-ahead) li esclude: nome dell'opzione e valore annunciato possono divergere. Icone significative negli slot (es. "patch-check" nella doc) senza `label` sono nascoste agli AT. (consumer per le icone) | src/components/option/option.component.ts:108-125 (esclude nodi con `slot`); r. 142-144 slot prefix/label/suffix; docs/pages/components/option.md:65-79 | WCAG 2.5.3, 1.1.1 | Documentare che prefix/suffix devono essere decorativi o con `label`; opzionale property `label` sull'option usata sia come `aria-label` sia da `getTextLabel()`. |
| SL-OPTION-05 | Suggerimento | Semantica / API | `role` e `aria-selected` impostati con `setAttribute` sull'host: sovrascrivono valori del consumer e "sporcano" il light DOM; un `sl-option` usato fuori da `sl-select` è un `option` orfano (consumer). | option.component.ts:55-59 `this.setAttribute('role', 'option'); this.setAttribute('aria-selected', 'false');` | ARIA 1.2 (option richiede contesto listbox/group); SHARED §2 | Usare `ElementInternals` (`internals.role = 'option'`, `internals.ariaSelected`) — pattern shared §10; warning dev se `closest('sl-select')` è null. |
| SL-OPTION-06 | Bassa | Test | Un solo axe (dentro select chiuso, quindi listbox `hidden`): non verifica le option visibili né `aria-selected`/`current`. | src/components/option/option.test.ts:6-16 | Qualità (WCAG 4.1.2) | Axe con select aperto e asserzioni su `aria-selected` dopo selezione. |
| SL-OPTION-07 | Suggerimento | Documentazione | La pagina docs non spiega come rendere accessibili icone in prefix/suffix né il comportamento delle opzioni disabilitate. | docs/pages/components/option.md:58-79 | WCAG 1.1.1 (supporto) | Aggiungere nota "Accessibility". |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `role="option"` | ✅ (setAttribute host) | ✅ | Preferire ElementInternals. |
| `aria-selected` | ✅ | ✅ sempre valorizzato | — |
| `aria-disabled` / `disabled` | ✅ | ✅ | — |
| `label` (nome esplicito) | ❌ | — | Opzionale per contenuti ricchi (SL-OPTION-04). |
| `id` | ✅ (attributo host nativo) | ✅ | Riferibile dal light DOM. |

### Fix proposti
```css
/* option.styles.ts */
:host(:focus-visible) .option,
.option--current {
  box-shadow: inset 3px 0 0 var(--sl-color-primary-600); /* indicatore ≥3:1 oltre allo sfondo */
}
.option--current.option--selected .option__check { color: currentColor; }
@media (forced-colors: active) {
  .option--current { outline: 2px solid Highlight; outline-offset: -2px; }
}
```
```ts
// option.component.ts (pattern shared §10)
private internals = this.attachInternals();
connectedCallback() {
  super.connectedCallback();
  this.internals.role = 'option';
  this.internals.ariaSelected = 'false';
}
@watch('selected') handleSelectedChange() { this.internals.ariaSelected = String(this.selected); }
```

### Non verificabile
- Annuncio "n di m" e stato selezionato con screen reader reali, dato che il focus DOM è sull'option (vedi SL-SELECT-06).
- Significato delle icone passate dal consumer in prefix/suffix.
- Resa in Windows High Contrast (test manuale).
