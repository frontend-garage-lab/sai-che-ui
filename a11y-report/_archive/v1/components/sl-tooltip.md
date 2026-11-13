## Tooltip (`sl-tooltip` – src/components/tooltip/tooltip.component.ts)
**Pattern APG di riferimento:** Tooltip — https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ ; WCAG 1.4.13 Content on Hover or Focus
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 0 · Alta 2 · Media 1 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="tooltip"` sul body (r. 286) ✅; nessuna relazione col trigger (vedi #3). |
| 2 | Nome, descrizione, stato | ❌ | Il contenuto non è la descrizione accessibile del trigger: viene "annunciato" con `aria-live` commutato `off→polite` all'apertura (r. 286), tecnica che lo stesso commento definisce in violazione (r. 258-262) (SL-TOOLTIP-01). |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | `aria-describedby="tooltip"` è sul `<slot>` (r. 283), non sul trigger; il trigger è nel light DOM (o nello shadow di `sl-button`) e non può referenziare `id="tooltip"` nello shadow root del tooltip: riferimento cross-root impossibile (SL-TOOLTIP-01). |
| 4 | Tastiera e focus | ⚠️ | Default `trigger="hover focus"` ✅; apertura al focus/chiusura al blur ✅; Esc chiude (CloseWatcher/keydown) ✅ ma nel fallback chiude anche il dialog genitore (SL-TOOLTIP-03). Nessun controllo su target non focusabile / `trigger="hover"` (SL-TOOLTIP-04). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | `aria-live` usato come surrogato di `aria-describedby`: la regione diventa live nello stesso istante in cui viene mostrata (annuncio non affidabile) e annuncia anche su hover del mouse (SL-TOOLTIP-01). |
| 7 | Aspetti visivi | ❌ | Contrasto `neutral-0` su `neutral-900` 15.46:1 ✅ (font 12px). **Non hoverable**: `pointer-events: none` sul body + `--hide-delay: 0ms` (SL-TOOLTIP-02). Persistente fino a blur/mouseout/Esc ✅. Nessuna regola `forced-colors` (SL-TOOLTIP-05). Animazioni via `animateTo` (reduced motion ✅). |
| 8 | API pubblica a11y | ⚠️ | `content`/slot `content` ✅; nessuna opzione per scegliere se il tooltip è nome (`label`) o descrizione; nessun warning per target non focusabile. |
| 9 | Documentazione e test | ⚠️ | Nessun test axe, Esc, hover persistente, associazione ARIA; docs senza sezione a11y, esempio manual trigger su `sl-avatar` non focusabile (SL-TOOLTIP-06, SL-TOOLTIP-04). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-TOOLTIP-01 | Alta | 2/3/6 | Il testo del tooltip non è associato programmaticamente al trigger. `aria-describedby="tooltip"` è messo sul `<slot>` (nessun effetto: non è l'elemento focusato), e un riferimento dal trigger (light DOM o shadow di `sl-button`) all'id nello shadow del tooltip è impossibile. Il fallback è `aria-live` commutato `off→polite` insieme alla comparsa: annuncio non garantito (la live region non preesiste attiva), assente in navigazione virtuale/rilettura del focus, e attivato anche dal semplice hover del mouse. | src/components/tooltip/tooltip.component.ts:283 `<slot slot="anchor" aria-describedby="tooltip">`; :286 `role="tooltip" aria-live=${this.open ? 'polite' : 'off'}`; commento :258-262 | WCAG 1.3.1, 4.1.2; APG Tooltip (`aria-describedby` sul trigger) | Risolvere il "trigger accessibile" come in sl-dropdown (`sl-button.button`, ecc.) e impostare su di esso `aria-description` con il testo del tooltip (stesso elemento, nessun riferimento cross-root); se il contenuto è slot `content` nel light DOM e il trigger è nativo nello stesso root, usare `aria-describedby` verso l'id dello slot content. Rimuovere `aria-live`. |
| SL-TOOLTIP-02 | Alta | 7 | Il tooltip non è "hoverable": il body ha `pointer-events: none`, quindi spostando il puntatore sul tooltip parte `mouseout` dall'host e, con `--hide-delay: 0ms`, il tooltip si chiude subito. L'`hover-bridge` copre solo lo spazio tra anchor e popup. Utenti con ingranditore non possono leggere il contenuto spostandovi il puntatore. | tooltip.styles.ts:51 `pointer-events: none;`, :6 `--hide-delay: 0ms;`; tooltip.component.ts:167-173 | WCAG 1.4.13 (Hoverable) | Rimuovere `pointer-events: none` dal body (gli eventi mouse sul body restano interni all'host e mantengono aperto il tooltip) e portare `--hide-delay` ad almeno ~100-300ms. |
| SL-TOOLTIP-03 | Media | 4 | Senza `CloseWatcher` (Safari, Firefox) Esc è gestito da un listener `keydown` su `document` con solo `stopPropagation()`: un `sl-dialog`/`sl-drawer` già aperto con listener sullo stesso nodo chiude anch'esso. L'utente che vuole solo nascondere il tooltip perde il dialog. | tooltip.component.ts:151-157, 196 | WCAG 1.4.13 (Dismissible senza spostare focus/perdere contesto), 3.2.2 | Listener in capture + `stopPropagation()`; nei modali ignorare `event.defaultPrevented` (vedi SL-DROPDOWN-03). |
| SL-TOOLTIP-04 | Bassa | 4/9 | (consumer) Nessuna protezione se il target non è focusabile (es. `sl-avatar`, `<span>`, bottone `disabled`) o se `trigger="hover"`: il tooltip è irraggiungibile da tastiera. Nessun warning dev; l'esempio docs "Manual Trigger" usa `sl-avatar` come target; docs non dicono che il tooltip non sostituisce il `label` di un `sl-icon-button`. | tooltip.component.ts:94, 145-149; docs/pages/components/tooltip.md:390-395 | WCAG 2.1.1, 1.4.13 | Warning in dev se il primo elemento assegnato non ha tabbable (`getTabbableBoundary`) o se `trigger` non include `focus`; sezione "Accessibilità" nelle docs. |
| SL-TOOLTIP-05 | Bassa | 7 | Nessuna regola `forced-colors`: in High Contrast lo sfondo viene forzato a `Canvas` e il riquadro, privo di bordo, non si distingue dal contenuto sottostante (la freccia sparisce). | tooltip.styles.ts:37-54 (nessuna media query) | WCAG 1.4.11 (forced colors, buona pratica) | `border: 1px solid transparent` sul body (diventa visibile in forced colors) o `@media (forced-colors: active) { .tooltip__body { border: 1px solid CanvasText; } }`. |
| SL-TOOLTIP-06 | Bassa | 9 | Test senza axe, senza Esc, senza hover persistente sul tooltip, senza verifica dell'associazione ARIA. | src/components/tooltip/tooltip.test.ts:7-162 | Qualità | Aggiungere test (axe aperto/chiuso, Esc, mouse sul body che non chiude). |
| SL-TOOLTIP-07 | Suggerimento | 7 | `user-select: none` impedisce di selezionare/copiare il testo del tooltip (utile per traduzione/lettura assistita), ed è fissato da un test. | tooltip.styles.ts:52-53; tooltip.test.ts:151 | Buona pratica (cognitiva) | Rimuovere `user-select: none` o renderlo opzionale. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `content` / slot `content` | Sì | No (non associato al trigger) | SL-TOOLTIP-01 |
| Descrizione sul trigger (`aria-describedby`/`aria-description`) | No | — | Da impostare automaticamente sul trigger accessibile |
| `trigger` | Sì (`hover focus` default) | — | Warning se manca `focus` |
| `disabled`, `open` | Sì | — | — |
| `--hide-delay` | Sì (0ms) | — | Default ≥ 100ms per 1.4.13 |

### Fix proposti
```ts
private updateAccessibleTrigger() {
  const slot = this.shadowRoot!.querySelector<HTMLSlotElement>('slot:not([name])')!;
  const el = slot.assignedElements({ flatten: true })[0] as HTMLElement | undefined;
  if (!el) return;
  const target = 'button' in el && (el as any).button instanceof HTMLElement ? (el as any).button : el;
  const text = (this.querySelector('[slot="content"]')?.textContent ?? this.content).trim();
  if (text) target.setAttribute('aria-description', text);
  else target.removeAttribute('aria-description');
  if (import.meta.env?.DEV !== false && !getTabbableBoundary(el).start) {
    console.warn('<sl-tooltip>: il target non è focusabile; il tooltip non sarà raggiungibile da tastiera.');
  }
}
// chiamarlo in firstUpdated, su slotchange e in @watch('content')

render() {
  return html`
    <sl-popup …>
      <slot slot="anchor" @slotchange=${this.updateAccessibleTrigger}></slot>
      <div part="body" id="tooltip" class="tooltip__body" role="tooltip">
        <slot name="content" @slotchange=${this.updateAccessibleTrigger}>${this.content}</slot>
      </div>
    </sl-popup>`;
}
```
```css
:host { --hide-delay: 150ms; }
.tooltip__body {
  /* pointer-events: none;  rimosso: il tooltip deve essere hoverable (1.4.13) */
  border: 1px solid transparent; /* visibile in forced-colors */
}
```
```ts
// Esc: capture per non far chiudere anche il dialog genitore
document.addEventListener('keydown', this.handleDocumentKeyDown, { capture: true });
```

### Non verificabile
- Annuncio effettivo con NVDA/JAWS/VoiceOver della tecnica `aria-live` attuale (atteso: inconsistente, spesso doppio o assente).
- Supporto `aria-description` nei browser/SR target del consumer (Chrome/Edge/Firefox ok; Safari/VoiceOver da verificare): eventuale fallback con testo visivamente nascosto nel light DOM.
- Comportamento di Esc con `CloseWatcher` in Chrome quando il tooltip è aperto via hover (senza user activation i CloseWatcher vengono raggruppati: Esc potrebbe chiudere insieme tooltip e dialog).
- Accesso su touch (nessun trigger touch dedicato): dipende dal target scelto dal consumer.
