## Tooltip (`sl-tooltip` – src/components/tooltip/tooltip.component.ts)
**Pattern APG di riferimento:** Tooltip — https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 1 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | `tooltip "Salva il documento corrente" [live="polite"]` quando aperto; assente da chiuso. |
| 2 | Nome/descrizione/stato | ❌ | Il trigger focusato non riceve descrizione: `button "Salva" [focused]` senza `desc` (SL-TOOLTIP-01). |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | `aria-describedby="tooltip"` è sul `<slot>` (nessun effetto); un riferimento cross-root dal trigger non è possibile. |
| 4 | Tastiera e focus | ⚠️ | Si apre al focus ✅; Esc chiude senza spostare il focus ✅ (CloseWatcher). Senza CloseWatcher Esc dentro un dialog chiude anche il dialog (SL-TOOLTIP-03). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | `aria-live` commutato `off→polite` all'apertura: annuncio dipendente dall'AT (da verificare). |
| 7 | Aspetti visivi | ✅ | Testo 12px 15.50:1 light / 14.96:1 dark. 1.4.13 hoverable ✅: puntatore spostato dal trigger sul corpo del tooltip (anche fuori dall'area del trigger) → `open: true`; fuori da entrambi → `false`. Forced-colors: testo `rgb(0,0,0)` su `rgb(255,255,255)`, nessun bordo (miglioramento). |
| 8 | API pubblica a11y | ⚠️ | `content`/slot `content`; nessun modo di associare il testo al trigger. |
| 9 | Docs e test | ⚠️ | Esempio "Manual Trigger" su `sl-avatar` non focusabile; test senza axe/Esc (miglioramento). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-TOOLTIP-01 | Alta | Nome/descrizione | Il contenuto del tooltip non è associato al trigger: `aria-describedby` è sul `<slot>` e il trigger (nativo o `<button>` nello shadow di `sl-button`) non riceve descrizione. Rifocalizzando il trigger o leggendolo in navigazione virtuale il testo non è disponibile; resta solo la live region commutata all'apertura. Per `sl-button`/`sl-icon-button` non c'è workaround dall'API pubblica (`aria-*` sull'host restano sull'host, verificato dal coordinatore). | src/components/tooltip/tooltip.component.ts:283 `<slot slot="anchor" aria-describedby="tooltip">`; :286 `role="tooltip" aria-live=${this.open ? 'polite' : 'off'}` | runtime (Tab su `sl-button` nel tooltip): `button "Salva" [invalid="false" focused]` (nessun `desc`), nodo separato `tooltip "Salva il documento corrente" [live="polite"]`; trigger nativo: `button "Nativo" [focused]` senza `desc` | WCAG 1.3.1, 4.1.2; APG Tooltip (`aria-describedby` sul trigger) | Risolvere il trigger accessibile (come `sl-dropdown`) e impostarvi `aria-description` con il testo del tooltip (aggiornato a ogni cambio di `content`/slot) |
| SL-TOOLTIP-03 | Media | Tastiera | Nei browser senza `CloseWatcher` (es. Firefox, Safari) Esc è gestito su `document` con solo `stopPropagation()`: se il tooltip è in un `sl-dialog` aperto, Esc chiude tooltip **e** dialog e il focus va su `body` (1.4.13 richiede di poter chiudere il contenuto aggiuntivo senza altri effetti). | tooltip.component.ts:151-157, 196; dialog.component.ts:157, 170-175 | runtime (`delete window.CloseWatcher`, Tab sul bottone nel dialog, Esc): `[tooltip.open, dialog.open] = [false,false]`, `focus: body`. Con CloseWatcher: `[false,true]`, focus invariato | WCAG 1.4.13, 2.4.3 | Listener in capture con `stopImmediatePropagation()`; dialog/drawer ignorano `event.defaultPrevented` |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-TOOLTIP-05 | miglioramento | Forced-colors: il riquadro non ha bordo (testo leggibile, contorno non necessario). `border: 1px solid transparent`. | tooltip.styles.ts:37-54 |
| SL-TOOLTIP-06 | miglioramento | Test axe, Esc, hover persistente. | src/components/tooltip/tooltip.test.ts |
| SL-TOOLTIP-07 | miglioramento | `user-select: none` impedisce di copiare il testo. | tooltip.styles.ts:52-53 |
| SL-TOOLTIP-M01 | miglioramento | `--hide-delay: 0ms`: oggi l'hover funziona grazie al popup/hover-bridge, un piccolo ritardo renderebbe il comportamento più robusto. | tooltip.styles.ts:6 |

### Responsabilità del consumer
- SL-TOOLTIP-04: il target deve essere focusabile (non `sl-avatar`/`span`/bottone `disabled`) e `trigger` deve includere `focus`; il tooltip non sostituisce il `label` di un `sl-icon-button`. Possibile warning in dev (miglioramento).

### Da verificare con AT reali
- NVDA/JAWS/VoiceOver: il testo viene annunciato tramite la live region `polite` che diventa visibile insieme al contenuto? (Chromium espone `live="polite"`, l'annuncio dipende dall'AT.)
- Firefox/Safari reali per SL-TOOLTIP-03 (simulato in Chromium rimuovendo `CloseWatcher`).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-TOOLTIP-01 | Alta | confermato | Runtime: trigger senza `desc` (nativo e `sl-button`) |
| SL-TOOLTIP-02 | Alta | scartato | Runtime: con il puntatore sul corpo del tooltip resta `open: true` (il popup riceve gli eventi; `pointer-events: none` è solo sul body interno) |
| SL-TOOLTIP-03 | Media | confermato | Runtime senza CloseWatcher: dialog chiuso, focus su body |
| SL-TOOLTIP-04 | Bassa | riclassificato | Target non focusabile = consumer |
| SL-TOOLTIP-05 | Bassa | riclassificato | Testo leggibile in forced-colors; bordo non necessario |
| SL-TOOLTIP-06 | Bassa | riclassificato | Test mancanti |
| SL-TOOLTIP-07 | Suggerimento | riclassificato | Buona pratica |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `content` / slot `content` | Sì | Esposto come nodo `tooltip`, non associato al trigger | Sì |
| Descrizione sul trigger | No | Runtime: nessun `desc` | Sì (SL-TOOLTIP-01) |
| `trigger` | Sì (`hover focus`) | Focus apre (runtime) | Sì |
| `--hide-delay` | Sì (0ms) | Hover persistente comunque ✅ | Opzionale |

### Fix proposti
```ts
// tooltip.component.ts — descrizione sul trigger accessibile
private getAccessibleTrigger(): HTMLElement | undefined {
  const el = (this.shadowRoot!.querySelector('slot[slot="anchor"]') as HTMLSlotElement)
    .assignedElements({ flatten: true })[0] as HTMLElement | undefined;
  if (!el) return undefined;
  const tag = el.tagName.toLowerCase();
  return tag === 'sl-button' || tag === 'sl-icon-button' ? (el as any).button : el;
}
private syncDescription() {
  const target = this.getAccessibleTrigger();
  const text = (this.querySelector('[slot="content"]')?.textContent ?? this.content).trim();
  if (target) text ? target.setAttribute('aria-description', text) : target.removeAttribute('aria-description');
}
// chiamare syncDescription() in firstUpdated (dopo updateComplete del trigger), su slotchange e @watch('content')
```
```ts
// Esc senza CloseWatcher
document.addEventListener('keydown', this.handleDocumentKeyDown, { capture: true });
private handleDocumentKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); this.hide(); }
};
```
