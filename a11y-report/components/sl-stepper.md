## Stepper (`sl-stepper` – src/components/stepper/stepper.component.ts)
**Pattern APG di riferimento:** Nessun pattern widget APG; lista di passi con `aria-current="step"` (WAI Tutorials "Multi-page forms")
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `list "Create outgoing correspondence"` › 4 × `listitem`; passi completati `button`, gli altri testo. |
| 2 | Nome/descrizione/stato | ✅ | `label` → nome della lista. Stato completato/errore nel nome: `button "General information Protocol, subject, organizations (Completed)"`, `button "Attachments … (Error)"`. `aria-current="step"` sul passo corrente (DOM `[null,null,"step",null]`; CDP non serializza `current`). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruoli e stato sugli host light DOM. |
| 4 | Tastiera e focus | ❌ | Tab raggiunge solo i passi completati (button) e poi esce (`→ button#b`). Attivando un passo completato con Enter il focus va su `body` (SL-STEPPER-01). |
| 5 | Form e validazione | ✅ | `error` → testo "(Error)" nel nome + icona + colore. |
| 6 | Live region | N/A | Il cambio di passo è gestito dal consumer (evento `sl-step-change`). |
| 7 | Aspetti visivi | ✅ | Vedi sl-step (tutti i testi ≥4.5:1, focus ring 6.18:1 / 10.31:1). |
| 8 | API pubblica a11y | ✅ | `label`, `complete-label`, `error-label` sovrascrivibili e documentati per la localizzazione (stepper.md:240). |
| 9 | Docs e test | ⚠️ | Nessun test di focus dopo l'attivazione di un passo. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-STEPPER-01 | Media | Focus | Attivando da tastiera un passo completato (tornare indietro, funzione documentata), il passo diventa `current`, `interactive=false` e il `<button>` focalizzato viene sostituito da un `<div>`: il focus viene perso su `<body>` e l'utente riparte dall'inizio della pagina. | stepper.component.ts:92-93 (`step.interactive = … index < this.current`), 99-106 (`this.goTo(step.index)`); step.component.ts:110-112 (`button` → `div`) | runtime: `shift+tab ;; focus → sl-step > button[part=control]` `;; key:Enter ;; focus → body` `;; events → sl-step-change <- sl-stepper` | WCAG 2.4.3 (A) | Dopo `goTo()` attendere `step.updateComplete` e, se il passo aveva il focus, spostarlo sul control del passo (div con `tabindex="-1"`) o documentare/fornire un hook per spostarlo sul contenuto del passo. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-STEPPER-V01 | miglioramento | Default di `complete-label`/`error-label` da `LocalizeController` (la chiave `error` esiste); oggi `'Completed'`/`'Error'` inglesi ma sovrascrivibili e documentati. | stepper.component.ts:44, 47 |
| SL-STEPPER-V02 | miglioramento | Test: focus dopo l'attivazione di un passo, axe con `error`/`disabled`/`vertical`. | stepper.test.ts |

### Responsabilità del consumer
- Impostare `label`, `complete-label`, `error-label` nella lingua della pagina (esempio docs in italiano a stepper.md:240).
- Su `sl-step-change` mostrare il pannello del passo e gestire il focus/annuncio del nuovo contenuto.

### Da verificare con AT reali
- Annuncio di `aria-current="step"` su `listitem` non focusabili con NVDA/JAWS/VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-STEPPER-01 | Media | confermato | Enter su passo completato → `focus: body`. |
| SL-STEPPER-02 | Bassa | riclassificato | Label sovrascrivibili e documentate per la localizzazione → consumer + V01. |
| SL-STEPPER-03 | Bassa | riclassificato | Test → V02. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` | Sì | Sì (`list "Create outgoing correspondence"`) | Sì |
| `complete-label`/`error-label` | Sì | Sì (`… (Completed)`, `… (Error)`) | Sì |
| `linear` | Sì | Sì (passi non interattivi) | Sì |

### Fix proposti
```ts
// stepper.component.ts
private handleClick = async (event: MouseEvent) => {
  const step = (event.target as Element).closest('sl-step');
  if (!step || step.parentElement !== this || !step.interactive) return;
  const hadFocus = step.matches(':focus-within');
  this.goTo(step.index);
  await step.updateComplete;
  if (hadFocus) step.focusControl();
};
```
```ts
// step.component.ts
/** Focuses the step's control (used by sl-stepper after navigation). */
focusControl() {
  this.shadowRoot?.querySelector<HTMLElement>('.step__control')?.focus();
}
// render(): il control non interattivo deve essere focusabile da script
html`<div part="control" class="step__control" tabindex="-1">${content}</div>`
```
