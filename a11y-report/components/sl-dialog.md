## Dialog (`sl-dialog` – src/components/dialog/dialog.component.ts)
**Pattern APG di riferimento:** Dialog (Modal) — https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | `dialog "Dialog" [focused modal labelledby=[Dialog]]`. `<header>`/`<footer>` interni esposti come `banner`/`contentinfo` dentro il dialog (miglioramento, non violazione WCAG). |
| 2 | Nome/descrizione/stato | ✅ | Nome da `label` (via `aria-labelledby="title"`) e con `no-header` + `label` → `dialog "Conferma"`. Senza label → `dialog` senza nome: uso scorretto documentato come tale (consumer). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-labelledby="title"` risolto nello stesso shadow root (runtime: `labelledby=[Dialog]`). |
| 4 | Tastiera e focus | ⚠️ | Focus iniziale sul pannello ✅; Tab ciclico close → input → footer → close, Shift+Tab inverso ✅; Esc chiude ✅; focus torna al trigger (`button#t`) ✅. Corpo lungo senza elementi focusabili non scorribile da tastiera (SL-DIALOG-02). |
| 5 | Form e validazione | N/A | Contenitore. |
| 6 | Live region | N/A | Annuncio tramite spostamento del focus. |
| 7 | Aspetti visivi | ⚠️ | Titolo 15.50:1 light / 12.71:1 dark; close button 6.64:1 / 4.86:1; focus ring close 6.18:1 / 8.76:1; forced-colors: outline `solid 2px` sul close, bordo pannello ✅. Titolo troncato a 320px (SL-DIALOG-08). |
| 8 | API pubblica a11y | ✅ | `label`/slot `label`, `autofocus`, `sl-initial-focus`; close label localizzata (`localize.term('close')`, it: "Chiudi"). |
| 9 | Docs e test | ⚠️ | Esempi docs con `sl-icon-button` senza `label` e `sl-input` con solo placeholder; nessun test axe/ritorno focus (miglioramenti). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-DIALOG-02 | Media | Tastiera | Il contenitore scrollabile del corpo ha `tabindex="-1"`: con contenuto lungo non interattivo (esempio docs "Scrolling") non si può scorrere da tastiera né dal pannello, né dal close button, né dal bottone del footer. | src/components/dialog/dialog.component.ts:342 `<div part="body" class="dialog__body" tabindex="-1">`; dialog.styles.ts:111-117 (`overflow: auto`) | runtime: body `[scrollHeight 2776, clientHeight 698]`; focus su `div[part=panel]`, poi su close e su `sl-button` del footer + `PageDown`/`ArrowDown`/`Space` → `scrollTop` sempre `0` | WCAG 2.1.1 | `tabindex="0"` + `role="region"` + `aria-labelledby="title"` sul body quando `scrollHeight > clientHeight` |
| SL-DIALOG-08 | Bassa | Visivo | Il titolo è su una riga con ellipsis: a 320px di viewport un titolo realistico viene troncato senza modo di leggerlo per intero (il nome accessibile resta completo). | src/components/dialog/dialog.styles.ts:89-91 | runtime (viewport 320x640, label "Conferma eliminazione del documento contrattuale"): `.dialog__title` `[scrollWidth 460, clientWidth 212, "ellipsis"]` | WCAG 1.4.10 | `white-space: normal; overflow-wrap: anywhere` |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-DIALOG-01 | da-verificare-AT | Pagina non resa `inert`: isolamento affidato ad `aria-modal` + trap Tab/focusin. In Chromium Tab è intrappolato e `modal` è esposto; il comportamento del cursore virtuale dipende dall'AT. | dialog.component.ts:303-304; src/internal/modal.ts:21-26 |
| SL-DIALOG-04 | miglioramento | Test axe e test di ritorno focus/nome mancanti. | src/components/dialog/dialog.test.ts |
| SL-DIALOG-05 | miglioramento | Opzione `alertdialog` e `aria-describedby` verso il corpo per varianti `warning`/`danger` (l'icona è `aria-hidden`; il messaggio testuale resta leggibile). | dialog.component.ts:117, 303, 313-319 |
| SL-DIALOG-06 | miglioramento | Close label sovrascrivibile per istanza (`close-label`): oggi già localizzata. | dialog.component.ts:331 |
| SL-DIALOG-07 | miglioramento | `<header>`/`<footer>` nello shadow esposti come landmark: runtime `banner` e `contentinfo` dentro `dialog`. Usare `<div>`. | dialog.component.ts:312, 344 |
| SL-DIALOG-09 | miglioramento | Esempio docs "Header Actions" con `sl-icon-button` senza `label`. | docs/pages/components/dialog.md:328, 389 |
| SL-DIALOG-10 | miglioramento | Esempio "Customizing Initial Focus" con `sl-input` solo placeholder; aggiungere sezione Accessibilità. | docs/pages/components/dialog.md:512, 541, 565 |
| SL-DIALOG-11 | miglioramento | `aria-hidden="false"/"true"` ridondante con `hidden`. | dialog.component.ts:305 |
| SL-DIALOG-12 | miglioramento | Livello heading del titolo configurabile. | dialog.component.ts:321 |
| SL-DIALOG-M01 | miglioramento | Con `open` impostato al caricamento il focus non viene spostato nel dialog (runtime: `focus: body`); va solo da `show()`/cambio di `open`. | dialog.component.ts:119-127 |

### Responsabilità del consumer
- Fornire sempre `label` (anche con `no-header`): senza, runtime `dialog` senza nome (SL-DIALOG-03; la docs della property lo richiede). Possibile warning in dev (miglioramento).
- Dare `label` agli `sl-icon-button` inseriti in `header-actions`.

### Da verificare con AT reali
- NVDA/JAWS (browse mode) e VoiceOver macOS/iOS: contenuto esterno raggiungibile col cursore virtuale nonostante `aria-modal` (Chromium lo lascia nell'albero AX).
- Annuncio di nome all'apertura con focus sul pannello `tabindex="-1"`.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-DIALOG-01 | Media | riclassificato | Tab intrappolato e `modal` esposto in Chromium; isolamento nel cursore virtuale dipende dall'AT |
| SL-DIALOG-02 | Media | confermato | Runtime: scrollTop resta 0 con PageDown/frecce/Spazio |
| SL-DIALOG-03 | Media | riclassificato | Uso scorretto (label obbligatoria per docs) → consumer; warning = miglioramento |
| SL-DIALOG-04 | Media | riclassificato | Test mancanti non sono errori |
| SL-DIALOG-05 | Bassa | riclassificato | Nessuna violazione dimostrata: il testo veicola la gravità |
| SL-DIALOG-06 | Bassa | riclassificato | Etichetta già localizzata |
| SL-DIALOG-07 | Bassa | riclassificato | Landmark esposti (runtime) ma nessun criterio A/AA violato |
| SL-DIALOG-08 | Bassa | confermato | Runtime 320px: 460px di testo in 212px con ellipsis |
| SL-DIALOG-09 | Bassa | riclassificato | Esempio docs → miglioramento |
| SL-DIALOG-10 | Bassa | riclassificato | Esempio docs → miglioramento |
| SL-DIALOG-11 | Suggerimento | riclassificato | Ridondanza senza effetto |
| SL-DIALOG-12 | Suggerimento | riclassificato | Buona pratica |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `label` / slot `label` | Sì | Sì: `dialog "Dialog" labelledby=[Dialog]`; `no-header` → `dialog "Conferma"` | Sì |
| `aria-modal` | Interno fisso | Sì: `[modal]` | Sì |
| `autofocus` / `sl-initial-focus` | Sì | Sì (codice r. 194-219) | Sì |
| `close-label` | No | Default localizzato | No (miglioramento) |
| `aria-describedby` / `role=alertdialog` | No | — | Opzionale |

### Fix proposti
```ts
// dialog.component.ts — body scorribile da tastiera solo se in overflow
@state() private bodyScrollable = false;
private bodyObserver = new ResizeObserver(() => {
  const b = this.shadowRoot!.querySelector<HTMLElement>('.dialog__body')!;
  this.bodyScrollable = b.scrollHeight > b.clientHeight;
});
// render()
<div part="body" class="dialog__body"
  tabindex=${this.bodyScrollable ? '0' : '-1'}
  role=${ifDefined(this.bodyScrollable ? 'region' : undefined)}
  aria-labelledby=${ifDefined(this.bodyScrollable && !this.noHeader ? 'title' : undefined)}><slot></slot></div>
```
```css
/* dialog.styles.ts */
.dialog__title { white-space: normal; overflow-wrap: anywhere; }
```
