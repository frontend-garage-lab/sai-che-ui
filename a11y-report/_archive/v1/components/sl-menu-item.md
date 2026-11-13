## Menu Item (`sl-menu-item` – src/components/menu-item/menu-item.component.ts)
**Pattern APG di riferimento:** Menu / Menubar (menuitem, menuitemcheckbox, submenu) — https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 0 · Alta 2 · Media 1 · Bassa 5 · Suggerimento 1

Dipendenze analizzate: `submenu-controller.ts`, `sl-popup`, `sl-icon`, `sl-spinner`.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="menuitem"`/`"menuitemcheckbox"` sull'host (r. 136-145) ✅; icone check/chevron `aria-hidden` ✅. Il sottomenu (`sl-menu slot="submenu"`) è discendente DOM del `menuitem` (SL-MENU-ITEM-07). Manca `type="radio"` (SL-MENU-ITEM-09). |
| 2 | Nome, descrizione, stato | ❌ | Nome dal contenuto dello slot ✅; `aria-checked` ✅; `aria-disabled` ✅. `aria-haspopup`/`aria-expanded` del sottomenu sono sul `<div>` interno invece che sull'host con ruolo (SL-MENU-ITEM-01). `loading` non esposto né bloccante (SL-MENU-ITEM-05). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Ruolo e stati sull'host ✅ (ID referenziabili dal light DOM). Gli attributi del sottomenu restano nello shadow su elemento generico (SL-MENU-ITEM-01). `anchor="anchor"` del popup è un riferimento di posizionamento nello stesso shadow root ✅. |
| 4 | Tastiera e focus | ⚠️ | Freccia destra/Enter/Space aprono il sottomenu e focalizzano il primo item ✅; Freccia sinistra chiude e torna al genitore ✅; Tab chiude ✅. Esc nel sottomenu chiude senza riportare il focus al genitore e chiude l'intero dropdown (SL-MENU-ITEM-03); frecce non invertite in RTL (SL-MENU-ITEM-06). Disabled focusabile (ammesso da APG) ✅. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | `loading`: lo `sl-spinner` (`role="progressbar"` con `aria-label` localizzato) entra nel nome dell'item ma non c'è `aria-busy`/`aria-disabled` (SL-MENU-ITEM-05). |
| 7 | Aspetti visivi | ❌ | Testo `neutral-800` su panel 12.51:1 ✅; icona check `primary-600` 6.21:1 ✅; target ≈ 14px×1.5 + 8px = 29px ✅ 2.5.8. **Focus**: solo tinta `primary-100` con `outline: none` → 1.14:1 (light) / 2.49:1 (dark) sul pannello (SL-MENU-ITEM-02). `forced-colors` con outline `SelectedItem` ✅. Label in `nowrap` + ellipsis (SL-MENU-ITEM-08). Disabled `opacity: .5` (esente 1.4.3). |
| 8 | API pubblica a11y | ⚠️ | Nessuna property ARIA necessaria oltre a `type`/`checked`/`disabled`; manca `type="radio"`. |
| 9 | Documentazione e test | ⚠️ | Test axe statici (anche con submenu, r. 9-36) ✅ e test frecce destra/sinistra ✅; nessun test per Esc nel sottomenu, `aria-expanded`, focus visibile. Docs senza sezione tastiera. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-MENU-ITEM-01 | Alta | 2/3 | `aria-haspopup` e `aria-expanded` del sottomenu sono resi con binding booleano `?` sul `<div part="base">` nello shadow root (elemento generico, valore vuoto `""`), non sull'host che ha `role="menuitem"`: lo screen reader non sa che l'item apre un sottomenu né se è espanso. | src/components/menu-item/menu-item.component.ts:161-171 `?aria-haspopup="${this.isSubmenu()}" ?aria-expanded="${…}"` | WCAG 4.1.2; APG Menu (`aria-haspopup="menu"`, `aria-expanded` sul menuitem) | In `updated()` impostare sull'host `aria-haspopup="menu"` e `aria-expanded="true|false"` quando `isSubmenu()`, rimuoverli altrimenti; togliere i binding dal `<div>`. |
| SL-MENU-ITEM-02 | Alta | 4/7 | L'indicatore di focus da tastiera è solo uno sfondo `primary-100` (outline rimosso): contrasto 1.14:1 su `--sl-surface-panel` light (bianco) e 2.49:1 in dark (`primary-100` su `neutral-100`); il cambio colore testo `neutral-800→primary-900` non è percepibile come indicatore. Riguarda ogni menu (dropdown, submenu). | src/components/menu-item/menu-item.styles.ts:104-106 `:host(:focus-visible) { outline: none; }`, :115-120 `background-color: var(--sl-color-primary-100)` | WCAG 2.4.7, 1.4.11 (2.4.13 AAA) | Aggiungere `outline: var(--sl-focus-ring); outline-offset: calc(-1 * var(--sl-focus-ring-width))` su `:host(:focus-visible) .menu-item` (6.21:1) mantenendo la tinta, o bordo sinistro `primary-600` di 2px. |
| SL-MENU-ITEM-03 | Media | 4 | Esc con focus in un sottomenu: il controller chiude il popup (`disableSubmenu`) ma non riporta il focus al menuitem genitore e non ferma la propagazione: il focus resta su un elemento nascosto (perso sul `body` nei menu standalone) e, in `sl-dropdown`, l'evento chiude l'intero dropdown. | src/components/menu-item/submenu-controller.ts:145-148 `case 'Escape': case 'Tab': this.disableSubmenu(); break;` | APG Menu (Escape: chiude il sottomenu e torna al genitore); WCAG 2.4.3 | Per `Escape` con `event.target !== this.host`: `preventDefault()`, `stopPropagation()`, `this.host.focus()`, `disableSubmenu()` (come ArrowLeft). |
| SL-MENU-ITEM-04 | Bassa | 2/4 | Il blocco dei click su item `disabled` è un listener sull'host aggiunto in `connectedCallback` con `stopImmediatePropagation`: i listener `click` del consumer registrati prima della connessione (template Lit/Angular che legano gli eventi prima dell'inserimento nel DOM) vengono comunque eseguiti → azione eseguita su item disabilitato. | menu-item.component.ts:73-76, 101-107 | WCAG 4.1.2 (stato esposto ≠ comportamento) | Registrare il listener nel `constructor` in fase capture (`this.addEventListener('click', …, { capture: true })`) e documentare l'uso di `sl-select`. |
| SL-MENU-ITEM-05 | Bassa | 2/6 | `loading` non è comunicato sull'host (né `aria-busy` né `aria-disabled`) e non impedisce l'attivazione (il commento r. 102 cita "disabled or loading" ma il codice controlla solo `disabled`). | menu-item.component.ts:64-65, 101-107, 187 | WCAG 4.1.2 | `aria-disabled="true"` (o `aria-busy="true"`) quando `loading` e blocco del click come per `disabled`. |
| SL-MENU-ITEM-06 | Bassa | 4 | In RTL Freccia destra apre e Freccia sinistra chiude come in LTR, mentre il popup si apre a sinistra (`left-start`) e il chevron è invertito. | submenu-controller.ts:149-162; :262, 272 (placement RTL) | APG Menu (direzione in RTL); WCAG 2.1.1 (coerenza) | Invertire i tasti quando `getComputedStyle(host).direction === 'rtl'`. |
| SL-MENU-ITEM-07 | Bassa | 1 | Il `sl-menu` del sottomenu è figlio DOM del `menuitem`: struttura annidata interattivo-in-interattivo diversa dal pattern APG (menu come fratello del menuitem in un `role="none"`); quando aperto il nome calcolato "dal contenuto" del genitore può includere il testo degli item figli; il sottomenu non è etichettato dal genitore. | menu-item.component.ts:186; submenu-controller.ts:270-282; docs/pages/components/menu.md:144-150 | ARIA 1.2 / APG Menu; WCAG 4.1.2 | Impostare sul sottomenu `aria-labelledby` verso l'id dell'host; calcolare un `aria-label` dell'host da `getTextLabel()` quando ha sottomenu per isolare il nome. |
| SL-MENU-ITEM-08 | Bassa | 7 | Label su una riga (`white-space: nowrap`) con `text-overflow: ellipsis`: testi lunghi troncati a zoom/reflow. | menu-item.styles.ts:31, 60-66 | WCAG 1.4.10, 1.4.4 | Consentire il wrap o una variante multiline; esporre il testo completo. |
| SL-MENU-ITEM-09 | Suggerimento | 1 | Supportati solo `normal` e `checkbox`: nessun `menuitemradio` per scelte esclusive. | menu-item.component.ts:56, 136-145 | APG Menu (menuitemradio) | `type="radio"` → `role="menuitemradio"` + `aria-checked`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `type` → `role` | Sì (`menuitem`/`menuitemcheckbox`) | Sì, sull'host | `radio` da aggiungere |
| `checked` → `aria-checked` | Sì | Sì, sull'host | — |
| `disabled` → `aria-disabled` | Sì | Sì (stato); blocco click non garantito (SL-MENU-ITEM-04) | — |
| `loading` | Sì | No (nessun ARIA) | SL-MENU-ITEM-05 |
| `aria-haspopup` / `aria-expanded` (submenu) | Sì | No (su `<div>` interno) | SL-MENU-ITEM-01 |
| `value` | Sì | N/A | — |

### Fix proposti
```ts
// menu-item.component.ts
constructor() {
  super();
  this.addEventListener('click', this.handleHostClick, { capture: true });
}

private handleHostClick = (event: MouseEvent) => {
  if (this.disabled || this.loading) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
};

updated() {
  if (this.isSubmenu()) {
    this.setAttribute('aria-haspopup', 'menu');
    this.setAttribute('aria-expanded', this.submenuController.isExpanded() ? 'true' : 'false');
  } else {
    this.removeAttribute('aria-haspopup');
    this.removeAttribute('aria-expanded');
  }
  this.toggleAttribute('aria-busy', this.loading);
}

// render(): rimuovere ?aria-haspopup / ?aria-expanded dal <div part="base">
```
```ts
// submenu-controller.ts
const isRtl = getComputedStyle(this.host).direction === 'rtl';
const openKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
const closeKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
switch (event.key) {
  case 'Escape':
    if (event.target !== this.host && this.isExpanded()) {
      event.preventDefault();
      event.stopPropagation();
      this.host.focus();
    }
    this.disableSubmenu();
    break;
  case 'Tab':
    this.disableSubmenu();
    break;
  case closeKey: /* … logica ArrowLeft attuale … */ break;
  case openKey: case 'Enter': case ' ': this.handleSubmenuEntry(event); break;
}
```
```css
:host(:focus-visible) .menu-item {
  background-color: var(--sl-color-primary-100);
  color: var(--sl-color-primary-900);
  outline: var(--sl-focus-ring);
  outline-offset: -2px;
}
```

### Non verificabile
- Nome accessibile calcolato del menuitem genitore con sottomenu aperto (inclusione o meno del testo del `sl-menu` figlio) in Chrome/Safari/Firefox.
- Annuncio di Esc con `CloseWatcher` (Chrome) quando il focus è in un sottomenu dentro un dropdown: atteso chiusura dell'intero dropdown.
- Resa dello spinner (`role="progressbar"`) nel nome dell'item con NVDA/VoiceOver.
