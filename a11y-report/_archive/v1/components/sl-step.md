## Step (`sl-step` – src/components/step/step.component.ts)
**Pattern APG di riferimento:** Nessun pattern widget; listitem con `aria-current="step"`, button nativo per i passi navigabili
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `role="listitem"` sull'host (r. 64); `<button type="button">` nativo solo se navigabile, altrimenti `<div>` (r. 110-112) ✅. |
| 2 | Nome, descrizione, stato | ⚠️ | `aria-current="step"` sul passo corrente (r. 67-74) ✅; stato completato/errore con testo visivamente nascosto (r. 94-98, styles r. 142-152) ✅; indicatori (`sl-icon`, numero) `aria-hidden` ✅. `disabled` non esposto (01). La `description` entra nel nome del button (04). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo e `aria-current` sull'host light DOM. |
| 4 | Tastiera e focus | ⚠️ | Button nativo con `:focus-visible` `outline: var(--sl-focus-ring)` (styles r. 42-45), resistente in forced-colors ✅. Perdita del focus all'attivazione: vedi SL-STEPPER-01. |
| 5 | Form e validazione | ✅ | `error` comunicato con icona + colore + testo nascosto localizzabile. |
| 6 | Live region | N/A | Gli stati non cambiano senza un'azione del consumer (vedi `sl-stepper`). |
| 7 | Aspetti visivi | ⚠️ | Label upcoming `neutral-600` 6.63:1 / 4.83:1 ✅; corrente/completo `neutral-900` ✅; errore `danger-700` 6.50:1 / 6.18:1 ✅; numero 12px `neutral-600` ✅; check bianco su `primary-600` 6.21:1 ✅; icona errore `danger-600` su `danger-50` 4.26:1 / 3.49:1 (icona, ≥3:1) ✅. Corrente vs upcoming distinti soprattutto dal colore (02). Indicatore 24px ✅. Forced-colors gestito (r. 195-204) ✅. Transizioni → SHARED-05. |
| 8 | API pubblica a11y | ✅ | `description`, `error`, `disabled`; label di stato ricevute dallo stepper. |
| 9 | Documentazione e test | ⚠️ | step.test.ts contiene solo un test di render (r. 5): nessun axe, nessuna verifica di `aria-current`/testo nascosto (03). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-STEP-01 | Bassa | Stato | Un passo `disabled` è reso solo con `opacity: .5` e come `<div>`: lo stato "non disponibile" non è esposto (nessun `aria-disabled` né testo). | step.component.ts:39, 105-112; step.styles.ts:187-193 | WCAG 1.3.1, 4.1.2 | Testo visivamente nascosto localizzabile (es. `disabled-label`, "(non disponibile)") nello `step__announcement` quando `disabled`; `aria-disabled` solo se il control è un `<button>` (su un `<div>` generico non è supportato in ARIA 1.2). |
| SL-STEP-02 | Bassa | Uso del colore | Passo corrente e passi futuri mostrano entrambi il numero: la differenza è data da colore (bordo/sfondo `primary`), spessore 2px vs 1.5px e alone `primary-100` a basso contrasto. | step.styles.ts:51-80 | WCAG 1.4.1 | Indicatore non cromatico più marcato per il corrente (es. label in grassetto/sottolineata, ring più spesso o puntino interno). |
| SL-STEP-03 | Bassa | Test | Nessun test axe e nessuna asserzione su `aria-current="step"`, testo "(Completed)/(Error)", `disabled`. | step.test.ts:5 | Qualità (WCAG 4.1.2) | Aggiungere `await expect(el).to.be.accessible()` per i diversi stati e asserzioni ARIA. |
| SL-STEP-04 | Suggerimento | Nome | La `description` è dentro il `<button>`: il nome accessibile diventa "Label Description (Completed)", lungo e poco scansionabile. | step.component.ts:89-99, 111 | WCAG 2.4.6 (qualità) | Mettere la description fuori dal control o collegarla con `aria-describedby` (ID nello stesso shadow root). |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `aria-current="step"` | Sì (da `state`) | Sì, sull'host | — |
| `error` + `errorLabel` | Sì | Sì (testo nascosto) | — |
| `completeLabel` | Sì (dallo stepper) | Sì | — |
| `disabled` | Sì | No (solo visivo) | Aggiungere testo di stato (`disabled-label`). |
| `description` | Sì | Inclusa nel nome | Spostare in `aria-describedby`. |

### Fix proposti
```ts
/** Focuses the step's control (used by sl-stepper after navigation). */
focusControl() {
  this.shadowRoot?.querySelector<HTMLElement>('.step__control')?.focus();
}

render() {
  const text = html`
    <span part="indicator" class="step__indicator">${this.renderIndicator()}</span>
    <span class="step__text">
      <span part="label" class="step__label"><slot></slot></span>
      ${this.error
        ? html`<span class="step__announcement">(${this.errorLabel})</span>`
        : this.state === 'complete' ? html`<span class="step__announcement">(${this.completeLabel})</span>` : ''}
      ${this.disabled ? html`<span class="step__announcement">(${this.disabledLabel})</span>` : ''}
    </span>`;
  const description = this.description
    ? html`<span id="description" part="description" class="step__description">${this.description}</span>`
    : '';
  return html`
    <div part="base" class="…">
      ${this.interactive
        ? html`<button part="control" type="button" class="step__control"
                 aria-describedby=${ifDefined(this.description ? 'description' : undefined)}>${text}</button>`
        : html`<div part="control" class="step__control" tabindex="-1">${text}</div>`}
      ${description}
      ${this.last ? '' : html`<span part="connector" class="step__connector"></span>`}
    </div>`;
}
```
```css
.step--current .step__label { text-decoration: underline; text-underline-offset: 0.25em; }
```

### Non verificabile
- Annuncio di `aria-current="step"` sui `listitem` (non tutti gli screen reader lo leggono su elementi non focusabili).
