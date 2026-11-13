## Step (`sl-step` – src/components/step/step.component.ts)
**Pattern APG di riferimento:** Nessun pattern widget; `listitem` con `aria-current="step"`, `<button>` nativo per i passi navigabili
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

> La perdita del focus quando si attiva un passo completato (button sostituito da div, step.component.ts:110-112) è registrata in `sl-stepper` come **SL-STEPPER-01**.

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `role="listitem"` sull'host (r. 64); `button` solo se navigabile, altrimenti testo. |
| 2 | Nome/descrizione/stato | ✅ | `button "General information Protocol, subject, organizations (Completed)"`, `button "Attachments … (Error)"`; indicatori `aria-hidden`; `aria-current="step"` sull'host corrente (DOM). Un passo `disabled` non espone lo stato (non è comunque un controllo). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo e `aria-current` sull'host light DOM. |
| 4 | Tastiera e focus | ⚠️ | Button nativo 162×41 px, focus ring 6.18:1 (light) / 10.31:1 (dark), forced colors `outlineStyle = solid`. Perdita del focus all'attivazione: SL-STEPPER-01. |
| 5 | Form e validazione | ✅ | Errore: testo "(Error)" + icona + colore. |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Light/dark: completato 15.50 / 14.96, errore 6.48 / 7.31, corrente 15.50 / 14.96, futuro 6.64 / 5.72, descrizione 6.64 / 5.72; numero corrente 8.27 / 6.40, futuro 6.64 / 4.86; check 6.18 / 8.02; icona errore 4.26 / 3.46 (non testo, ≥3:1). Corrente vs futuro: bordo 2px `primary` 5.86:1 vs 1px grigio, sfondo tinta, label 15.50 vs 6.64 (non solo tinta). Forced colors: bordo 2px vs 1px. |
| 8 | API pubblica a11y | ✅ | `description`, `error`, `disabled`; label di stato dallo stepper. |
| 9 | Docs e test | ⚠️ | step.test.ts: un solo test di render, nessun axe. |

### Errori verificati
— nessun errore verificato — (vedi SL-STEPPER-01)

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-STEP-V01 | miglioramento | Passo `disabled`: testo nascosto localizzabile ("non disponibile") oltre a `opacity: .5`. | step.component.ts:39, 105-112 |
| SL-STEP-V02 | miglioramento | Segnale non cromatico più marcato per il passo corrente (oggi bordo 2px vs 1px e luminanza della label). | step.styles.ts:51-80 |
| SL-STEP-V03 | miglioramento | `description` fuori dal nome del button (collegarla con `aria-describedby`): oggi il nome è "General information Protocol, subject, organizations (Completed)". | step.component.ts:89-99, 111 |
| SL-STEP-V04 | miglioramento | Test axe e asserzioni su `aria-current="step"`, "(Completed)/(Error)", `disabled`. | step.test.ts:5 |

### Responsabilità del consumer
- Localizzare `complete-label`/`error-label` tramite `sl-stepper`.

### Da verificare con AT reali
- Annuncio di `aria-current="step"` sui `listitem` con NVDA/JAWS/VoiceOver (CDP non lo serializza).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-STEP-01 | Bassa | riclassificato | Il passo disabilitato non è un controllo (testo semplice) e nessuna funzione è persa → V01. |
| SL-STEP-02 | Bassa | riclassificato | Corrente distinto anche da spessore del bordo e luminanza (15.50 vs 6.64), non solo dal colore → V02. |
| SL-STEP-03 | Bassa | riclassificato | Test → V04. |
| SL-STEP-04 | Suggerimento | riclassificato | Nome lungo ma corretto → V03. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `state` → `aria-current="step"` | Sì | Sì, sull'host (DOM) | Sì |
| `error` + `errorLabel` | Sì | Sì (`… (Error)`) | Sì |
| `completeLabel` | Sì | Sì (`… (Completed)`) | Sì |
| `disabled` | Sì | Solo visivo | Utile (V01) |
| `description` | Sì | Inclusa nel nome | Meglio come descrizione (V03) |

### Fix proposti
Nessun errore verificato in questo componente (per SL-STEPPER-01 vedi `focusControl()` e `tabindex="-1"` nel report di sl-stepper).
