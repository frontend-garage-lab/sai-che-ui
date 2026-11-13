## Drawer (`sl-drawer` – src/components/drawer/drawer.component.ts)
**Pattern APG di riferimento:** Dialog (Modal) — https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ ; con `contained`: pannello non modale
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 1 · Media 3 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ⚠️ | Modale: `dialog "Drawer" [focused modal]` ✅. `contained`: espone ancora `modal` pur non essendo modale (SL-DRAWER-01). `banner`/`contentinfo` interni (miglioramento). |
| 2 | Nome/descrizione/stato | ✅ | Nome da `label` (`labelledby=[Drawer]`). Senza label: consumer. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-labelledby="title"` nello stesso shadow root. |
| 4 | Tastiera e focus | ❌ | Focus iniziale sul pannello, Tab ciclico, Esc, ritorno al trigger ✅. Rimosso dal DOM da aperto → Tab bloccato su tutta la pagina (SL-DRAWER-02). Pannello `tabindex="0"` tab stop senza indicatore (SL-DRAWER-03). Corpo lungo non scorribile (SL-DRAWER-05). |
| 5 | Form e validazione | N/A | Contenitore. |
| 6 | Live region | N/A | Annuncio tramite focus. |
| 7 | Aspetti visivi | ⚠️ | Titolo 15.50:1 / 12.71:1; close 4.86:1 dark; forced-colors: close con outline `solid`, pannello focusato `outline: none`. Titolo troncato a 320px (SL-DRAWER-10). |
| 8 | API pubblica a11y | ✅ | `label`/slot, `autofocus`, `sl-initial-focus`; close label localizzata. |
| 9 | Docs e test | ⚠️ | Esempi con icon-button senza nome / input solo placeholder; nessun test di tastiera/axe (miglioramenti). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-DRAWER-02 | Alta | Tastiera | Se il drawer viene rimosso dal DOM mentre è aperto (cambio route SPA, `@if`/`*ngIf`), `disconnectedCallback` non disattiva il Modal: il listener `keydown` resta su `document`, trova 0 tabbable e fa `preventDefault()` su ogni Tab → navigazione Tab bloccata su tutta la pagina. `sl-dialog` nello stesso scenario funziona. | src/components/drawer/drawer.component.ts:131-135 (manca `this.modal.deactivate()`); src/internal/modal.ts:24, 101-136 (`event.preventDefault()` r. 134); confronto dialog.component.ts:129-131 | runtime: `drawer.show(); drawer.remove(); focus #a` → `Tab` → `focus: button#a` → `Tab` → `focus: button#a`. Stesso scenario con `sl-dialog`: `Tab` → `button#b` → `button#c` | WCAG 2.1.2, 2.1.1 | `this.modal.deactivate()` in `disconnectedCallback`; in `Modal.handleKeyDown` uscire se `!this.element.isConnected` |
| SL-DRAWER-01 | Media | Semantica | Con `contained` il drawer non intrappola il focus e la pagina resta operabile, ma espone `aria-modal="true"`: stato modale falso comunicato agli AT. | drawer.component.ts:337-338 `role="dialog" aria-modal="true"`; :124-127, :194-197 (modal solo se `!contained`) | runtime: `dialog "Contained" [focused modal]`; Tab → close → footer → `focus: button#after` (fuori dal drawer) | WCAG 4.1.2, 1.3.1 | `aria-modal=${this.contained ? 'false' : 'true'}` |
| SL-DRAWER-03 | Media | Focus | Il pannello ha `tabindex="0"` ed è uno stop del ciclo Tab, ma `:focus { outline: none }` e nessun altro indicatore (box-shadow solo di elevazione), anche in forced-colors. | drawer.component.ts:342 `tabindex="0"`; drawer.styles.ts:45-47 | runtime: ciclo `close → sl-button → sl-drawer > div[part=panel]`; `outlineStyle = none`, `boxShadow = rgba(10,35,41,0.12) 0 20px 24px -4px…`; forcedcolors `outlineStyle = none` | WCAG 2.4.7 | `tabindex="-1"` come `sl-dialog` (il focus programmatico iniziale resta possibile) |
| SL-DRAWER-05 | Media | Tastiera | Il contenitore scrollabile è lo `<slot class="drawer__body">` (`overflow: auto`), non focusabile: con contenuto lungo non interattivo (esempio docs "Scrolling") non si scorre da tastiera. | drawer.component.ts:367 `<slot part="body" class="drawer__body">`; drawer.styles.ts:122-128 | runtime: body `[scrollHeight 2776, clientHeight 657]`; focus su pannello, close, footer + `PageDown`/`ArrowDown` → `scrollTop 0` | WCAG 2.1.1 | Wrapper `<div part="body" class="drawer__body" tabindex="0" role="region" aria-labelledby="title">` quando in overflow |
| SL-DRAWER-10 | Bassa | Visivo | Titolo su una riga con ellipsis: troncato a 320px. | src/components/drawer/drawer.styles.ts:100-102 | runtime (320x640, "Impostazioni avanzate di notifica utente"): `[scrollWidth 365, clientWidth 248, "ellipsis"]` | WCAG 1.4.10 | `white-space: normal; overflow-wrap: anywhere` |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-DRAWER-04 | da-verificare-AT | Pagina non `inert` in modalità modale; in Chromium Tab intrappolato e `modal` esposto. | drawer.component.ts:334-343; modal.ts:21-26 |
| SL-DRAWER-07 | miglioramento | Test axe/tastiera/rimozione da aperto mancanti. | src/components/drawer/drawer.test.ts |
| SL-DRAWER-08 | miglioramento | `close-label` per istanza (già localizzata). | drawer.component.ts:358 |
| SL-DRAWER-09 | miglioramento | `<header>`/`<footer>` esposti come `banner`/`contentinfo` (runtime). | drawer.component.ts:346, 369 |
| SL-DRAWER-11 | miglioramento | Esempi docs con `sl-icon-button` senza `label`, `sl-input` solo placeholder; sezione Accessibilità assente. | docs/pages/components/drawer.md:557, 613, 736, 765, 789 |
| SL-DRAWER-12 | miglioramento | `aria-hidden` ridondante con `hidden`. | drawer.component.ts:339 |
| SL-DRAWER-M01 | miglioramento | `contained` senza Esc (documentato): valutare Esc opzionale. | drawer.component.ts:174-177 |

### Responsabilità del consumer
- Fornire `label` anche con `no-header` (SL-DRAWER-06): senza, il dialog non ha nome.
- Fino al fix di SL-DRAWER-02: chiamare `hide()` (o `open = false`) prima di rimuovere un drawer aperto.

### Da verificare con AT reali
- VoiceOver/NVDA con drawer `contained`: il contenuto esterno viene nascosto a causa di `aria-modal="true"`? (Chromium lo lascia nell'albero AX.)
- Cursore virtuale in modalità modale (come sl-dialog).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-DRAWER-01 | Alta | ridimensionato | Confermato `modal` falso in `contained` (runtime); variante → Media |
| SL-DRAWER-02 | Alta | confermato | Runtime: Tab resta su `button#a` dopo la rimozione |
| SL-DRAWER-03 | Media | confermato | Runtime: tab stop sul pannello con `outline: none` |
| SL-DRAWER-04 | Media | riclassificato | Trap funziona; isolamento AT da verificare |
| SL-DRAWER-05 | Media | confermato | Runtime: scrollTop 0 |
| SL-DRAWER-06 | Media | riclassificato | Uso scorretto → consumer |
| SL-DRAWER-07 | Bassa | riclassificato | Test mancanti |
| SL-DRAWER-08 | Bassa | riclassificato | Già localizzata |
| SL-DRAWER-09 | Bassa | riclassificato | Landmark esposti, nessun criterio A/AA |
| SL-DRAWER-10 | Bassa | confermato | Runtime 320px: troncato |
| SL-DRAWER-11 | Bassa | riclassificato | Esempi docs |
| SL-DRAWER-12 | Suggerimento | riclassificato | Ridondanza |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `label` / slot `label` | Sì | Sì: `dialog "Drawer" labelledby=[Drawer]` | Sì |
| `aria-modal` | Fisso `true` | No con `contained` (`[modal]` ma focus esce) | Va derivato da `contained` |
| `contained` | Sì | Trap/Esc disattivati (codice r. 124-127, 174-177) | Sì |
| `autofocus` / `sl-initial-focus` | Sì | Sì | Sì |
| `close-label` | No | Default localizzato | No |

### Fix proposti
```ts
// drawer.component.ts
disconnectedCallback() {
  super.disconnectedCallback();
  this.modal.deactivate();
  unlockBodyScrolling(this);
  this.removeOpenListeners();
}
// render()
<div part="panel" class="drawer__panel" role="dialog"
  aria-modal=${this.contained ? 'false' : 'true'}
  aria-label=${ifDefined(this.noHeader ? this.label : undefined)}
  aria-labelledby=${ifDefined(!this.noHeader ? 'title' : undefined)}
  tabindex="-1">
  …
  <div part="body" class="drawer__body"
    tabindex=${this.bodyScrollable ? '0' : '-1'}
    role=${ifDefined(this.bodyScrollable ? 'region' : undefined)}
    aria-labelledby=${ifDefined(this.bodyScrollable && !this.noHeader ? 'title' : undefined)}><slot></slot></div>
```
```ts
// src/internal/modal.ts — difesa in profondità
private handleKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || this.isExternalActivated) return;
  if (!this.isActive() || !this.element.isConnected) return;
  …
};
```
```css
/* drawer.styles.ts */
.drawer__title { white-space: normal; overflow-wrap: anywhere; }
```
