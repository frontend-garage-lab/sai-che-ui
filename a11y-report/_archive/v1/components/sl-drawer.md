## Drawer (`sl-drawer` – src/components/drawer/drawer.component.ts)
**Pattern APG di riferimento:** Dialog (Modal) — https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ ; per `contained`: dialog non modale / region
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 0 · Alta 2 · Media 4 · Bassa 5 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ❌ | `role="dialog" aria-modal="true"` sempre, anche con `contained` dove il drawer **non è modale** (SL-DRAWER-01). Pagina non inerte in modalità modale (SL-DRAWER-04, come SL-DIALOG-01). `<header>`/`<footer>` interni (SL-DRAWER-09). |
| 2 | Nome, descrizione, stato | ⚠️ | `aria-labelledby="title"` / `aria-label` con `no-header` ✅; nome vuoto non segnalato (SL-DRAWER-06); nessun `aria-describedby`. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `id="title"` e `aria-labelledby` nello stesso shadow root. Host `display: contents`: `aria-*` del consumer sull'host inefficaci. |
| 4 | Tastiera e focus | ❌ | Trap + Esc + ritorno focus ✅ in modalità modale; `disconnectedCallback` non disattiva il Modal → trap fantasma che blocca Tab su tutta la pagina (SL-DRAWER-02); pannello `tabindex="0"` con `outline: none` = tab stop senza indicatore (SL-DRAWER-03); body scrollabile non focusabile (SL-DRAWER-05). `contained`: nessun Esc (documentato). |
| 5 | Form e validazione | N/A | Contenitore. |
| 6 | Live region | N/A | Annuncio tramite focus. |
| 7 | Aspetti visivi | ⚠️ | Titolo `neutral-900` ✅; close button 32px ✅; `forced-colors` bordo pannello ✅; animazioni via `animateTo` (reduced motion ✅). Pannello focusabile senza focus visibile (SL-DRAWER-03); titolo in ellipsis (SL-DRAWER-10). |
| 8 | API pubblica a11y | ⚠️ | `label`/slot ✅; close label non sovrascrivibile (SL-DRAWER-08); manca `aria-describedby`, `modal` esplicito. |
| 9 | Documentazione e test | ⚠️ | Nessun test axe né test di tastiera (Esc, trap, ritorno focus) (SL-DRAWER-07); docs con icon-button senza nome e input con solo placeholder (SL-DRAWER-11). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-DRAWER-01 | Alta | 1 | Con `contained` il drawer non intrappola il focus, non ha overlay né Esc (docs r. 286), ma espone comunque `aria-modal="true"`: gli screen reader che rispettano `aria-modal` (VoiceOver, NVDA) nascondono il resto della pagina, che invece resta interattivo. | src/components/drawer/drawer.component.ts:337-338 `role="dialog" aria-modal="true"`; :124-127, :194-197 (modal attivato solo se `!contained`) | WCAG 4.1.2, 1.3.1; APG Dialog | `aria-modal=${this.contained ? 'false' : 'true'}` (o ometterlo); valutare `role="region"`/`complementary` con nome per i contained. |
| SL-DRAWER-02 | Alta | 4 | `disconnectedCallback` non chiama `this.modal.deactivate()` (a differenza di sl-dialog): se il drawer viene rimosso dal DOM mentre è aperto (cambio route SPA, `@if` Angular, nav mobile) resta in `activeModals` come modal attivo; `handleKeyDown` trova 0 tabbable nell'elemento staccato e chiama `event.preventDefault()` su ogni Tab → **Tab bloccato su tutta la pagina**. | drawer.component.ts:131-135 (manca `deactivate`); src/internal/modal.ts:83, 101-136 (`event.preventDefault()` con lista vuota); confronto dialog.component.ts:129-131 | WCAG 2.1.2, 2.1.1 | In `disconnectedCallback` chiamare `this.modal.deactivate()`; in `Modal.handleKeyDown` uscire se `!this.element.isConnected` o `tabbableElements.length === 0`. |
| SL-DRAWER-03 | Media | 4/7 | Il pannello ha `tabindex="0"`: è un tab stop nel ciclo del trap, ma `:focus { outline: none }` lo rende privo di indicatore visibile. | drawer.component.ts:342 `tabindex="0"`; drawer.styles.ts:45-47 | WCAG 2.4.7, 2.4.11 | `tabindex="-1"` come in sl-dialog (focus programmatico iniziale resta possibile). |
| SL-DRAWER-04 | Media | 1/4 | In modalità modale il resto della pagina non è inerte (niente `inert`/`showModal()`): isolamento affidato ad `aria-modal` e al trap Tab/focusin. | drawer.component.ts:334-343; src/internal/modal.ts:21-26 | WCAG 1.3.2, 2.4.3; APG Dialog (Modal) | Come SL-DIALOG-01: `inert` sui fratelli o `<dialog>.showModal()` (non `contained`). |
| SL-DRAWER-05 | Media | 4 | Il contenitore scrollabile del corpo è lo `<slot class="drawer__body">` (`overflow: auto`), non focusabile: con contenuto non interattivo lungo, il focus sul pannello non consente lo scroll del body da tastiera (dipende dal supporto browser "keyboard-focusable scrollers" sugli slot). | drawer.component.ts:367 `<slot part="body" class="drawer__body">`; drawer.styles.ts:122-128 | WCAG 2.1.1 | Wrapper `<div part="body" class="drawer__body" tabindex="0" role="region" aria-labelledby="title">` quando in overflow, slot al suo interno. |
| SL-DRAWER-06 | Media | 2/8 | Nome vuoto non segnalato: h2 con solo U+FEFF se label vuota; con `no-header` senza label viene renderizzato `aria-label=""`. Nessun warning in dev. | drawer.component.ts:340 `ifDefined(this.noHeader ? this.label : undefined)`; :349 | WCAG 4.1.2 | Come SL-DIALOG-03. |
| SL-DRAWER-07 | Bassa | 9 | Test: nessun `to.be.accessible()`, nessun test di Esc, trap, ritorno del focus, `contained`. | src/components/drawer/drawer.test.ts:9-149 | Qualità | Aggiungere test axe (modale e contained) e test di tastiera; test di rimozione dal DOM a drawer aperto. |
| SL-DRAWER-08 | Bassa | 8 | Etichetta close button localizzata ma non sovrascrivibile. | drawer.component.ts:358 | WCAG 2.4.6; SHARED-06 | Property `close-label`. |
| SL-DRAWER-09 | Bassa | 1 | `<header>`/`<footer>` nel shadow root potenzialmente esposti come landmark `banner`/`contentinfo`. | drawer.component.ts:346, 369 | WCAG 1.3.1 | Sostituire con `<div>`. |
| SL-DRAWER-10 | Bassa | 7 | Titolo troncato su una riga (nowrap + ellipsis). | drawer.styles.ts:100-102 | WCAG 1.4.10, 1.4.4 | `white-space: normal; overflow-wrap: anywhere`. |
| SL-DRAWER-11 | Bassa | 9 | Docs: `sl-icon-button` icon-only senza `label` in `header-actions`; esempio initial focus con `sl-input` con solo placeholder; nessuna sezione Accessibilità. | docs/pages/components/drawer.md:557, 613, 736, 765, 789 | WCAG 4.1.2, 3.3.2 (esempi) | Aggiungere `label` agli esempi e sezione "Accessibilità". |
| SL-DRAWER-12 | Suggerimento | 1 | `aria-hidden="false"/"true"` ridondante con `hidden`. | drawer.component.ts:339 | ARIA 1.2 | Rimuovere. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` / slot `label` | Sì | Sì | Evitare `aria-label=""` |
| `aria-label` sull'host | No | No (host `display: contents`) | Usare `label` |
| `aria-describedby` | No | — | Da aggiungere |
| `aria-modal` | Fisso `true` | No con `contained` | Derivarlo da `contained` (SL-DRAWER-01) |
| `close-label` | No | Default localizzato ✅ | Da aggiungere |
| Focus iniziale (`autofocus`, `sl-initial-focus`) | Sì | Sì | — |

### Fix proposti
```ts
disconnectedCallback() {
  super.disconnectedCallback();
  this.modal.deactivate();          // evita il trap fantasma
  unlockBodyScrolling(this);
  this.removeOpenListeners();
}

// render()
<div part="panel" class="drawer__panel"
  role="dialog"
  aria-modal=${this.contained ? 'false' : 'true'}
  aria-label=${ifDefined(this.noHeader && this.label ? this.label : undefined)}
  aria-labelledby=${ifDefined(!this.noHeader ? 'title' : undefined)}
  tabindex="-1">
  …
  <div part="body" class="drawer__body"
    tabindex=${this.bodyScrollable ? '0' : '-1'}
    role=${ifDefined(this.bodyScrollable ? 'region' : undefined)}
    aria-labelledby=${ifDefined(this.bodyScrollable && !this.noHeader ? 'title' : undefined)}><slot></slot></div>
  <div part="footer" class="drawer__footer"><slot name="footer"></slot></div>
</div>
```
```ts
// src/internal/modal.ts — difesa in profondità
private handleKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || this.isExternalActivated) return;
  if (!this.isActive() || !this.element.isConnected) return;
  const tabbableElements = getTabbableElements(this.element);
  if (tabbableElements.length === 0) return;
  …
};
```

### Non verificabile
- Comportamento reale di `aria-modal` con i drawer `contained` nei vari screen reader (atteso: contenuto esterno nascosto in VoiceOver).
- Scroll da tastiera dello `<slot>` scrollabile con "keyboard-focusable scrollers" (Chrome 130+) vs Safari/Firefox.
- Esposizione di header/footer shadow come landmark.
- Contrasto contenuti del consumer su `--sl-surface-sunken` (footer).
