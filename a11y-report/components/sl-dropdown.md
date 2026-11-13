## Dropdown (`sl-dropdown` – src/components/dropdown/dropdown.component.ts)
**Pattern APG di riferimento:** Menu Button — https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ (con `sl-menu`); Disclosure per contenuto generico
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 2 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | Nessun ruolo proprio (contenitore); `menu` dal `sl-menu` slottato. Wrapper `generic "Azioni Taglia Copia…"` con `aria-labelledby` inutile (miglioramento). |
| 2 | Nome/descrizione/stato | ⚠️ | Prima della prima apertura il trigger non ha né `aria-expanded` né `aria-haspopup` (SL-DROPDOWN-V01); dopo: `button "Azioni" [expanded]` / `[expanded=false]`, `aria-haspopup="true"` sul `<button>` interno di `sl-button`. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Attributi scritti sul `<button>` interno di `sl-button`/`sl-icon-button` (runtime: `button.getAttribute('aria-haspopup') === "true"`). |
| 4 | Tastiera e focus | ⚠️ | Enter apre (focus resta sul trigger); ArrowDown/Up/Home/End nel menu ✅; Esc chiude e torna al trigger ✅; Tab da item → trigger → elemento successivo. Esc dentro un dialog senza `CloseWatcher` chiude anche il dialog (SL-DROPDOWN-03). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | N/A | Nessun colore proprio (vedi `sl-menu`/`sl-menu-item`). |
| 8 | API pubblica a11y | ✅ | Nessuna stringa; `disabled`, `stay-open-on-select`. |
| 9 | Docs e test | ⚠️ | Nessuna asserzione ARIA/axe nei test, nessuna sezione tastiera (miglioramento). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-DROPDOWN-V01 | Media | Stato | Allo `slotchange` iniziale il trigger non è ancora considerato tabbable (il `sl-popup` interno non ha ancora renderizzato lo slot `anchor`; per `sl-button` `.button` non esiste ancora), quindi `updateAccessibleTrigger()` non scrive nulla; viene richiamato solo al primo cambio di `open`. Fino alla prima apertura il trigger è un `button` semplice, senza stato collassato né popup. Vale anche per `<button>` nativo e per inserimento dinamico (SPA). | src/components/dropdown/dropdown.component.ts:295-297, 309-328 (`if (accessibleTrigger)`), 392 (unica altra chiamata) | runtime: al caricamento `button "Azioni" [invalid="false"]` (nessun `expanded`); dopo 1500ms `sl-button.button.getAttribute('aria-expanded') → null`, nativo → `null`; chiamando a mano `updateAccessibleTrigger()` → `button "Azioni" [expanded=false]` | WCAG 4.1.2 | Richiamare `updateAccessibleTrigger()` in `firstUpdated()` dopo `await this.popup.updateComplete` e dopo l'`updateComplete` del trigger (`sl-button`) |
| SL-DROPDOWN-03 | Media | Tastiera | Nei browser senza `CloseWatcher` (es. Firefox, Safari) Esc con focus sul trigger è gestito da un listener `keydown` su `document` con solo `stopPropagation()`: il listener di un `sl-dialog`/`sl-drawer` aperto prima, sullo stesso nodo, chiude anche il dialog e il focus finisce su `body`. | dropdown.component.ts:159-166, 371; dialog.component.ts:157, 170-175 | runtime (`delete window.CloseWatcher`, dropdown in dialog aperto, Enter sul trigger, Esc): `[dropdown.open, dialog.open] = [false,false]`, `focus: body`. Con CloseWatcher: `[false,true]`, focus sul trigger. Con focus su un item: `[false,true]` | WCAG 2.4.3; APG Dialog (Esc chiude solo il livello superiore) | Registrare `handleDocumentKeyDown` in capture e usare `stopImmediatePropagation()`; nei modali ignorare `event.defaultPrevented` |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-DROPDOWN-01 | da-verificare-AT | `aria-haspopup="true"` (= menu) anche per pannelli non-menu: semantica imprecisa, operabilità invariata. | dropdown.component.ts:326 |
| SL-DROPDOWN-02 | miglioramento | Enter/Space aprono senza spostare il focus sul primo item (APG lo prevede); ArrowDown funziona (runtime). | dropdown.component.ts:240-247 |
| SL-DROPDOWN-04 | miglioramento | `aria-labelledby="dropdown"` su `<div>` generico: runtime `generic "Azioni Taglia Copia Incolla Elimina"`; rimuovere. | dropdown.component.ts:449 |
| SL-DROPDOWN-06 | miglioramento | Tab su un item torna al trigger (runtime: item → `sl-button` → `button#post`) invece di proseguire. | dropdown.component.ts:169-176 |
| SL-DROPDOWN-08 | miglioramento | Test ARIA/axe e docs tastiera mancanti. | src/components/dropdown/dropdown.test.ts |
| SL-DROPDOWN-09 | miglioramento | `aria-controls` dal trigger al menu (stesso light DOM). | dropdown.component.ts:326-327 |
| SL-DROPDOWN-M01 | miglioramento | Il `sl-menu` non riceve nome dal trigger (`menu` senza nome); `aria-labelledby` verso il trigger dove possibile. | dropdown.component.ts:309-328 |

### Responsabilità del consumer
- SL-DROPDOWN-05: usare come trigger elementi nativi o `sl-button`/`sl-icon-button`; per altri custom element gli attributi finiscono sull'host.
- SL-DROPDOWN-07: con `disabled` disabilitare anche il trigger.

### Da verificare con AT reali
- Annuncio di `aria-haspopup="true"` con pannelli non-menu (NVDA/JAWS/VoiceOver).
- Comportamento reale di Esc in Firefox/Safari (simulato in Chromium rimuovendo `CloseWatcher`).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-DROPDOWN-01 | Media | riclassificato | Semantica imprecisa senza perdita di operabilità; dipende dall'AT |
| SL-DROPDOWN-02 | Media | riclassificato | ArrowDown porta nel menu: funzione operabile |
| SL-DROPDOWN-03 | Media | confermato | Runtime senza CloseWatcher: dialog chiuso, focus su body |
| SL-DROPDOWN-04 | Bassa | riclassificato | Generic con nome senza effetto sugli AT |
| SL-DROPDOWN-05 | Bassa | riclassificato | Trigger non supportato → consumer |
| SL-DROPDOWN-06 | Bassa | riclassificato | Tab funziona (un passo in più) |
| SL-DROPDOWN-07 | Bassa | riclassificato | Consumer deve disabilitare il trigger |
| SL-DROPDOWN-08 | Bassa | riclassificato | Test/docs |
| SL-DROPDOWN-09 | Suggerimento | riclassificato | `aria-controls` opzionale |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `aria-expanded` sul trigger | Automatico | Solo dopo la prima apertura (V01) | Sì |
| `aria-haspopup` sul trigger | Automatico (`true`) | Solo dopo la prima apertura (V01) | Sì |
| `aria-controls` | No | — | Opzionale |
| `disabled` | Sì | Non riflesso sul trigger | Consumer |

### Fix proposti
```ts
// dropdown.component.ts
async firstUpdated() {
  this.panel.hidden = !this.open;
  if (this.open) { this.addOpenListeners(); this.popup.active = true; }
  await this.popup.updateComplete;
  const trigger = this.trigger.assignedElements({ flatten: true })[0] as (HTMLElement & { updateComplete?: Promise<unknown> }) | undefined;
  await trigger?.updateComplete;
  this.updateAccessibleTrigger();
}

addOpenListeners() {
  …
  document.addEventListener('keydown', this.handleDocumentKeyDown, { capture: true });
}
removeOpenListeners() {
  …
  document.removeEventListener('keydown', this.handleDocumentKeyDown, { capture: true });
}
private handleDocumentKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && this.open && !this.closeWatcher) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.focusOnTrigger();
    this.hide();
    return;
  }
  …
};
```
```ts
// dialog/drawer handleDocumentKeyDown: ignorare Esc già gestito
if (event.key === 'Escape' && !event.defaultPrevented && this.modal.isActive() && this.open) { … }
```
