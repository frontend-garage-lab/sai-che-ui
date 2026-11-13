## Menu Item (`sl-menu-item` – src/components/menu-item/menu-item.component.ts)
**Pattern APG di riferimento:** Menu (menuitem, menuitemcheckbox, sottomenu) — https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 1 · Media 2 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | `menuitem "Undo"`, `menuitemcheckbox "Copy" [checked="true"]`, `menuitem "Paste" [disabled]`. |
| 2 | Nome/descrizione/stato | ⚠️ | Checkbox: Space → `checked="false"` ✅. Item con sottomenu: `menuitem "Find"` senza `expanded`/haspopup, anche a sottomenu aperto (SL-MENU-ITEM-01). Nome non inquinato dal sottomenu (`menuitem "Find"`). `loading` → nome `"Carica Loading"` (spinner incluso). |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | `aria-haspopup=""`/`aria-expanded` resi sul `<div part="base">` interno generico, non sull'host con il ruolo. |
| 4 | Tastiera e focus | ⚠️ | ArrowRight/Enter aprono il sottomenu e portano il focus sul primo item, ArrowLeft torna al genitore ✅. Esc in un sottomenu di un menu standalone → focus perso su `body` (SL-MENU-ITEM-03). In dropdown Esc chiude tutto e torna al trigger ✅. RTL: tasti non invertiti (miglioramento). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Focus da tastiera: solo sfondo, 1.14:1 light / 2.51:1 dark, `outline: none` (SL-MENU-ITEM-02). Forced-colors: `outline dashed` ✅. Check checkbox 6.18:1 / 6.81:1 ✅. Testo 12.50:1 / 10.26:1 ✅. A 320px il menu supera il viewport (SL-MENU-ITEM-08). |
| 8 | API pubblica a11y | ✅ | `type`, `checked`, `disabled`, `value`, `loading`. |
| 9 | Docs e test | ⚠️ | Nessun test di focus visibile/sottomenu ARIA (miglioramento). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-MENU-ITEM-02 | Alta | Visivo/Focus | L'unico indicatore del focus da tastiera è lo sfondo `primary-100` (outline rimosso): contrasto con lo sfondo adiacente sotto 3:1 in entrambi i temi; vale per ogni menu (dropdown, sottomenu, standalone). | src/components/menu-item/menu-item.styles.ts:104-106 `:host(:focus-visible) { outline: none; }`; :115-120 `background-color: var(--sl-color-primary-100)` | runtime light: item focusato `backgroundColor #e4f3f7 su #ffffff = 1.14:1`, `outlineStyle = none` (host e `.menu-item`); dark: `#0e6a81 su #1f2528 = 2.51:1` | WCAG 1.4.11 (indicatore di stato del focus), 2.4.7 | `outline: var(--sl-focus-ring); outline-offset: calc(-1 * var(--sl-focus-ring-width))` su `:host(:focus-visible) .menu-item` |
| SL-MENU-ITEM-01 | Media | Stato | `aria-haspopup`/`aria-expanded` del sottomenu sono sul `<div>` interno (valore vuoto) e non sull'host `role="menuitem"`: l'item non comunica di aprire un sottomenu né se è espanso. | menu-item.component.ts:169-170 `?aria-haspopup="${this.isSubmenu()}" ?aria-expanded="${…}"` | runtime: chiuso `menuitem "Find" [focused]`; dopo ArrowRight `menuitem "Find"` (nessun `expanded`) con figlio `menu`; shadow: `<div id="anchor" part="base" … aria-haspopup="">` | WCAG 4.1.2; APG Menu | Sull'host: `aria-haspopup="menu"` e `aria-expanded="true/false"` quando `isSubmenu()`; rimuovere i binding dal `<div>` |
| SL-MENU-ITEM-03 | Media | Tastiera/Focus | Esc con focus in un sottomenu: il controller chiude il popup ma non riporta il focus al menuitem genitore → in un `sl-menu` standalone (esempio docs "Submenus") il focus finisce su `body`. | src/components/menu-item/submenu-controller.ts:145-148 `case 'Escape': case 'Tab': this.disableSubmenu();` | runtime (menu standalone): ArrowRight → `SL-MENU-ITEM:Find…`; Escape → `activeElement BODY`, `popup.active false`, `focus: body` | WCAG 2.4.3; APG Menu (Escape chiude il sottomenu e torna al genitore) | Per Escape con `event.target !== this.host`: `preventDefault()`, `stopPropagation()`, `this.host.focus()`, `disableSubmenu()` |
| SL-MENU-ITEM-08 | Bassa | Visivo | `white-space: nowrap` sull'item: con un'etichetta lunga il menu si allarga oltre il viewport a 320px, richiedendo scorrimento orizzontale. | menu-item.styles.ts:31 | runtime (320x640, item "Esporta tutti i documenti selezionati in formato PDF" in dropdown): menu `[left 0, right 391.6]`, `innerWidth 320`, `documentElement.scrollWidth 392` | WCAG 1.4.10 | `white-space: normal` (o variante multiline) + `max-width: var(--auto-size-available-width)` sul menu |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-MENU-ITEM-04 | miglioramento | Bug funzionale: listener `click` del consumer registrati prima della connessione vengono eseguiti su item `disabled` (runtime: `hits = ["pre-connect"]` con Enter). Stato `disabled` esposto correttamente. Listener in capture nel `constructor`. | menu-item.component.ts:73-76, 101-107 |
| SL-MENU-ITEM-05 | miglioramento | `loading` non blocca l'attivazione (runtime `hits` contiene `"loading"`); lo stato è comunque nel nome (`menuitem "Carica Loading"`). Valutare `aria-disabled`. | menu-item.component.ts:64-65, 101-107, 187 |
| SL-MENU-ITEM-06 | miglioramento | RTL: ArrowRight apre un sottomenu posizionato a sinistra (`left-start`), ArrowLeft chiude; operabile ma controintuitivo. | submenu-controller.ts:149-162, 272 |
| SL-MENU-ITEM-09 | miglioramento | `type="radio"` / `menuitemradio`. | menu-item.component.ts:56, 136-145 |
| SL-MENU-ITEM-M01 | miglioramento | Il mouseover sposta il focus sull'item (`handleMouseOver`): coerente con APG, ma documentarlo. | menu-item.component.ts:109-112 |

### Responsabilità del consumer
- Usare `sl-select` (non `click`) per le azioni, finché SL-MENU-ITEM-04 non è corretto.

### Da verificare con AT reali
- SL-MENU-ITEM-07: sottomenu `menu` annidato dentro il `menuitem` (runtime: `menuitem "Find"` > `menu`, nome non inquinato in Chromium); verificare annuncio in NVDA/JAWS/VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-MENU-ITEM-01 | Alta | ridimensionato | Confermato (runtime nessun `expanded`); sottomenu = funzione secondaria, operabile con frecce → Media |
| SL-MENU-ITEM-02 | Alta | confermato | Runtime 1.14:1 light / 2.51:1 dark, outline none |
| SL-MENU-ITEM-03 | Media | confermato | Runtime: focus su body dopo Esc nel sottomenu (menu standalone) |
| SL-MENU-ITEM-04 | Bassa | riclassificato | Bug funzionale non a11y (stato esposto correttamente) |
| SL-MENU-ITEM-05 | Bassa | riclassificato | Stato veicolato nel nome |
| SL-MENU-ITEM-06 | Bassa | riclassificato | Operabile in RTL |
| SL-MENU-ITEM-07 | Bassa | riclassificato | Nome non inquinato in Chromium; struttura da verificare con AT |
| SL-MENU-ITEM-08 | Bassa | confermato | Runtime: overflow orizzontale a 320px (non troncamento) |
| SL-MENU-ITEM-09 | Suggerimento | riclassificato | Funzione nuova |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `type="checkbox"` / `checked` | Sì | Sì: `menuitemcheckbox [checked="true"]` → Space → `checked="false"` | Sì |
| `disabled` | Sì | Sì: `[disabled]` | Sì |
| `loading` | Sì | Nel nome ("Loading"), non blocca | Parziale |
| Stato sottomenu | Automatico | No (sul `<div>` interno) | Sì (SL-MENU-ITEM-01) |

### Fix proposti
```ts
// menu-item.component.ts
updated() {
  if (this.isSubmenu()) {
    this.setAttribute('aria-haspopup', 'menu');
    this.setAttribute('aria-expanded', this.submenuController.isExpanded() ? 'true' : 'false');
  } else {
    this.removeAttribute('aria-haspopup');
    this.removeAttribute('aria-expanded');
  }
}
// render(): rimuovere ?aria-haspopup / ?aria-expanded dal <div part="base">
```
```ts
// submenu-controller.ts
case 'Escape':
  if (event.target !== this.host) {
    event.preventDefault();
    event.stopPropagation();
    this.host.focus();
  }
  this.disableSubmenu();
  break;
case 'Tab':
  this.disableSubmenu();
  break;
```
```css
/* menu-item.styles.ts */
:host(:focus-visible) .menu-item {
  outline: var(--sl-focus-ring);
  outline-offset: calc(-1 * var(--sl-focus-ring-width));
  background-color: var(--sl-color-primary-100);
  color: var(--sl-color-primary-900);
}
.menu-item { white-space: normal; }
```
