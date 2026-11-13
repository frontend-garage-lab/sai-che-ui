## Stepper (`sl-stepper` – src/components/stepper/stepper.component.ts)
**Pattern APG di riferimento:** Nessun pattern widget APG; lista di passi con `aria-current="step"` (WAI Tutorials "Multi-page forms")
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 2 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `role="list"` nel shadow root (r. 117) con `sl-step` `role="listitem"` sugli host slottati ✅. L'ordine è dato dalla posizione nella lista ("1 di 4"); il numero visivo è `aria-hidden` (step.component.ts:85). |
| 2 | Nome, descrizione, stato | ✅ | `label` → `aria-label` con `ifDefined` (r. 118) ✅. Stato per passo: `aria-current="step"` + testo nascosto "(Completed)"/"(Error)" (gestiti da `sl-step`). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID cross-root; stati sugli host light DOM. |
| 4 | Tastiera e focus | ❌ | Passi completati attivabili via `<button>` nativo ✅, ma attivandone uno il button viene sostituito da un `<div>` (il passo diventa corrente) e il focus va perso (01). |
| 5 | Form e validazione | ⚠️ | Errore per passo esposto con testo nascosto; il cambio di passo e gli errori non sono annunciati quando cambiano (vedi Non verificabile). |
| 6 | Live region | ⚠️ | Nessun annuncio al cambio di `current` (`next()`/`previous()`): il consumer deve spostare il focus/annunciare il nuovo contenuto (consumer). |
| 7 | Aspetti visivi | ✅ | Layout flex con `min-width: 0`; colori in `sl-step`. |
| 8 | API pubblica a11y | ⚠️ | `label`, `complete-label`, `error-label` presenti; default inglesi non localizzati (02). |
| 9 | Documentazione e test | ⚠️ | Docs spiegano `label`, annunci e localizzazione (stepper.md:172, 236-240) ✅. Test: un axe statico (test r. 17-21); nessun test di focus, errore o tastiera (03). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-STEPPER-01 | Media | Focus | Attivando (Enter/Space/click) un passo completato, questo diventa `current` → `interactive=false` → il `<button>` viene rimpiazzato da un `<div>`: l'elemento focalizzato sparisce e il focus torna su `<body>`. | stepper.component.ts:99-106 `this.goTo(step.index)`; 92-93 `step.state = … 'current' …; step.interactive = … index < this.current`; step.component.ts:110-112 | WCAG 2.4.3, 2.1.1 | Dopo `goTo()` attendere `updateComplete` e spostare il focus sul control del nuovo passo corrente (reso `tabindex="-1"`) o sul contenuto del passo (documentare l'evento `sl-step-change` per il focus management). |
| SL-STEPPER-02 | Bassa | i18n | `complete-label`/`error-label` hanno default inglesi hardcoded e non usano `LocalizeController` (la chiave `error` esiste già). | stepper.component.ts:44 `completeLabel = 'Completed'`; 47 `errorLabel = 'Error'` | WCAG 3.1.2; SHARED-06 | Default vuoti con fallback `this.localize.term('error')` e nuova chiave `completed`. |
| SL-STEPPER-03 | Bassa | Test | Nessun test su: focus dopo il click su un passo completato, axe con `error`/`disabled`/`vertical`, presenza del testo "(Completed)". | stepper.test.ts:17-21, 34-46 | Qualità (WCAG 2.4.3, 4.1.2) | Aggiungere test con `sendKeys` e verifica di `document.activeElement`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | Sì | Sì, `aria-label` del `role=list` (con `ifDefined`) | — |
| `complete-label` / `error-label` | Sì | Sì, propagati agli step (r. 94-95) | Default non localizzati. |
| `aria-current="step"` | Automatico | Sì, sull'host `sl-step` | — |
| `linear` | Sì | Sì | — |

### Fix proposti
```ts
private readonly localize = new LocalizeController(this);
@property({ attribute: 'complete-label' }) completeLabel = '';
@property({ attribute: 'error-label' }) errorLabel = '';

private syncSteps() {
  // …
  step.completeLabel = this.completeLabel || this.localize.term('completed');
  step.errorLabel = this.errorLabel || this.localize.term('error');
}

private handleClick = async (event: MouseEvent) => {
  const step = (event.target as Element).closest('sl-step');
  if (!step || step.parentElement !== this || !step.interactive) return;
  const hadFocus = step.matches(':focus-within');
  this.goTo(step.index);
  await step.updateComplete;
  if (hadFocus) step.focusControl(); // nuovo metodo di sl-step: focus sul control (tabindex=-1 quando non interattivo)
};
```

### Non verificabile
- Annuncio del passo corrente dopo `next()`/`previous()` in un wizard: dipende dal focus management del consumer.
- Lettura di `aria-current="step"` sugli `listitem` con NVDA/JAWS/VoiceOver (il supporto varia).
