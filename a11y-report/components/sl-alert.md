## Alert (`<sl-alert>` – src/components/alert/alert.component.ts)
**Pattern APG di riferimento:** APG Alert (`role="alert"`, live region assertiva); per i toast WCAG 2.2.1 Timing Adjustable e 4.1.3 Status Messages.
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 2 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Chromium: `alert [live="assertive" atomic]` con il contenuto slottato dentro. Il `role="timer"` (r. 273) ha `display:none` e non compare nell'albero. |
| 2 | Nome/descrizione/stato | ✅ | Close: `button "Close"` (da `localize.term('close')`, r. 267). Alert chiuso: assente dall'albero (`hidden`, r. 94/169). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID tra root; il contenuto slottato è esposto dentro `alert`. |
| 4 | Tastiera e focus | ⚠️ | Close raggiungibile con Tab e attivabile con Enter. Dopo la chiusura dell'alert inline il focus va su `body`, ma il Tab successivo prosegue su `button#b` (l'elemento dopo): l'ordine resta. Con un toast con `duration`, il focus su un link interno non ferma il timer (SL-ALERT-02). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | La live region (`role=alert`) esiste ed è nascosta con `hidden` prima dell'apertura. L'annuncio effettivo e il doppio annuncio con l'`aria-live="polite"` annidato (r. 255) vanno verificati con AT reali. |
| 7 | Aspetti visivi | ❌ | Testo 11.59–11.90:1 (light) e 5.20–11.24:1 (dark). Icona close in dark: warning **2.47:1**, success **2.69:1** (SL-ALERT-V01). Area di click del close: 30×30 px. Focus in `forcedcolors`: outline `solid` 2px. |
| 8 | API pubblica a11y | ✅ | Le funzioni principali sono rese accessibili senza API aggiuntive. Mancano solo opzioni (urgenza/ruolo) di qualità. |
| 9 | Docs e test | ⚠️ | 2 test axe sullo stato statico; nessun test su focus/timer. Le docs non hanno una sezione Accessibility (miglioramento). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-ALERT-02 | Media | Tastiera / Timing | Con `duration` (toast documentati) il timer si sospende solo con il mouse (`mouseenter`/`mouseleave`). Un utente da tastiera che porta il focus dentro il toast (link/azione o close) lo vede chiudersi e sparire dal DOM. Il focus finisce su `body`. Da tastiera non c'è nessun modo di estendere il tempo. | src/components/alert/alert.component.ts:248-249, 102 | runtime: toast `duration=2000`, Tab → `focus: a` (link nel toast) → dopo 2.5 s `querySelector("#t") === null`, `focus: body`. Con `hover:#h` lo stesso toast resta (`true`). | WCAG 2.2.1 Timing Adjustable (A); 2.1.1 (pausa solo mouse) | Aggiungere `@focusin=${this.pauseAutoHide}` e `@focusout` (solo se il focus esce dall'alert) `resumeAutoHide`. |
| SL-ALERT-V01 | Media | Aspetti visivi | In tema dark l'icona `x-lg` del close button (unico indicatore visivo del controllo) ha un contrasto < 3:1 sul tint delle varianti warning e success. Il colore è il default `neutral-600` di `sl-icon-button` e non si adatta alla variante. | src/components/icon-button/icon-button.styles.ts:6 `color: var(--sl-color-neutral-600)`; src/components/alert/alert.styles.ts:107-115 (nessun `color` per `.alert__close-button`) | runtime dark: `contrast:sl-alert[variant=warning] >>> sl-icon-button >>> button` → `#869298 su #674e04 = 2.47:1`; success → `#869298 su #145643 = 2.69:1` (in hover warning scende a 2.25:1). Light: ≥ 6.23:1. | WCAG 1.4.11 Non-text Contrast (AA) | In `.alert__close-button` impostare un `color` legato alla variante (es. `color: var(--sl-color-neutral-800)`, che in dark vale #cdd3d6 = 5.20:1 sul tint warning), oppure `--alert-close-color` per variante. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-ALERT-01 | miglioramento | `role="alert"` (assertivo) è fisso per tutte le varianti. Soddisfa 4.1.3 (lo stato è determinabile), ma per le varianti informative una property `live`/`role="status"` sarebbe più adatta. | alert.component.ts:246 |
| SL-ALERT-03 | miglioramento | Dopo la chiusura il focus va su `body` (`blurActiveElement`). L'ordine di Tab però resta (inline → elemento successivo, toast → inizio del documento, che equivale alla fine dello stack). Ripristinare il focus all'elemento di provenienza sarebbe preferibile. | alert.component.ts:160 |
| SL-ALERT-05 | miglioramento | Lo stack dei toast è un `div` generico in fondo a `body`, senza landmark né nome. Non viola un criterio A/AA. | alert.component.ts:53-60 |
| SL-ALERT-06 | miglioramento | `role="timer"` con `display:none` aggiornato ogni 100 ms: non è esposto (assente dall'albero) e causa re-render inutili. Da rimuovere. | alert.component.ts:104-106, 273 |
| SL-ALERT-07 | miglioramento | L'animazione del countdown usa `element.animate` diretto e ignora `prefers-reduced-motion` (2.3.3 è AAA). Il close button soddisfa 2.2.2 come meccanismo "hide". | alert.component.ts:131-134 |
| SL-ALERT-08 | miglioramento | Nessuna regola `forced-colors`: la barra di countdown (`background-color`) non è garantita. La variante non è un'informazione richiesta dal bordo. | alert.styles.ts:117-135 |
| SL-ALERT-09 | miglioramento | Nessun test su focus/timer e nessuna sezione Accessibility nelle docs. L'etichetta del close è già localizzata. | alert.test.ts |
| SL-ALERT-V02 | miglioramento | Bug funzionale (non a11y): `<sl-alert open duration=… countdown=…>` dichiarativo lancia `TypeError: Cannot read properties of null (reading 'animate')` (handleDurationChange prima del primo render). | alert.component.ts:128-131, 175-178 |

### Responsabilità del consumer
- SL-ALERT-04: la variante (successo/errore) non deve essere comunicata solo dal colore. Bisogna includere testo esplicito o un'icona `slot="icon"` con `label` quando l'icona è informativa.
- Scegliere `duration` adeguate (o `Infinity`) per toast con azioni.

### Da verificare con AT reali
- NVDA+Chrome/Firefox, JAWS, VoiceOver iOS/macOS: annuncio del passaggio `hidden → visibile` e del toast appena appeso a `body`; eventuale doppio annuncio dovuto all'`aria-live="polite"` annidato (r. 255) dentro `role="alert"`. Chromium espone solo `alert [live="assertive" atomic]`: cosa venga pronunciato dipende dall'AT.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-ALERT-01 | Alta | riclassificato | `role=alert` soddisfa 4.1.3. L'urgenza troppo alta non è una violazione A/AA → miglioramento. Il doppio annuncio va verificato con AT. |
| SL-ALERT-02 | Alta | ridimensionato | Confermato con l'harness (il focus nel toast non ferma il timer), ma riguarda solo `duration` opzionale (default `Infinity`) → Media. |
| SL-ALERT-03 | Media | riclassificato | Il focus va su `body`, ma il Tab successivo prosegue dall'elemento seguente (inline) o dall'inizio (toast in fondo): nessuna violazione di 2.4.3. |
| SL-ALERT-04 | Media | riclassificato | Dipende dal contenuto scelto dal consumer (testo/icona). |
| SL-ALERT-05 | Media | riclassificato | L'assenza di landmark per lo stack non viola 2.4.1/2.1.1. |
| SL-ALERT-06 | Bassa | riclassificato | Nodo `display:none` non esposto: nessun effetto sugli AT, solo pulizia/prestazioni. |
| SL-ALERT-07 | Bassa | riclassificato | Reduced motion = 2.3.3 AAA; per 2.2.2 il close serve da "hide". |
| SL-ALERT-08 | Bassa | riclassificato | Il focus resta visibile in forced-colors (outline solid 2px); la variante non è un'informazione richiesta. |
| SL-ALERT-09 | Suggerimento | riclassificato | Test/docs/etichetta già localizzata → miglioramento. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| `closable` (close button con nome) | Sì | Sì: `button "Close"` | Sì |
| `duration` + pausa | Sì | Parziale: pausa solo con il mouse (SL-ALERT-02) | Sì (pausa su focus) |
| `live` / `role` configurabile | No | — | Qualità, non necessaria per la conformità |
| `close-label` | No | Etichetta localizzata via `LocalizeController` | No |

### Fix proposti
```ts
// alert.component.ts – render(), sul div[part=base]
@mouseenter=${this.pauseAutoHide}
@mouseleave=${this.resumeAutoHide}
@focusin=${this.pauseAutoHide}
@focusout=${(e: FocusEvent) => { if (!this.contains(e.relatedTarget as Node) && !this.base.contains(e.relatedTarget as Node)) this.resumeAutoHide(); }}
```
```css
/* alert.styles.ts */
.alert__close-button { color: var(--sl-color-neutral-800); }
```
