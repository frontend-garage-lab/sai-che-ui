## Menu (`sl-menu` – src/components/menu/menu.component.ts)
**Pattern APG di riferimento:** Menu / Menubar (menu verticale) — https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ ; Menu Button — https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="menu"` sull'host (r. 30) ✅ — figli `sl-menu-item` con `menuitem`/`menuitemcheckbox` sull'host, `sl-divider` = `separator` ✅. Il ruolo è imposto con `setAttribute` e sovrascrive un `role` del consumer (SHARED §2); qualsiasi contenuto slottato è accettato senza verifica (SL-MENU-03). |
| 2 | Nome, descrizione, stato | ⚠️ | Nessun nome di default; dentro `sl-dropdown` non viene collegato al trigger (SL-MENU-02). `aria-orientation` implicito `vertical` ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo sull'host e item nel light DOM: `aria-label`/`aria-labelledby` del consumer sull'host funzionano e possono puntare a ID del light DOM. Nessun riferimento interno. |
| 4 | Tastiera e focus | ⚠️ | Roving tabindex (r. 147-154) ✅; Freccia su/giù con wrap, Home/End (r. 69-98) ✅; Enter/Space attivano via `item.click()` (r. 59-66) ✅. **Manca typeahead**, che le docs dichiarano (SL-MENU-01). Submenu: vedi `sl-menu-item`. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Stato checkbox esposto con `aria-checked` sull'item. |
| 7 | Aspetti visivi | ✅ | Bordo `--sl-panel-border-color` decorativo (il contenuto è distinguibile dal testo); in forced colors i bordi restano. Indicatori di focus/hover sono nel report `sl-menu-item` (SL-MENU-ITEM-02). |
| 8 | API pubblica a11y | ⚠️ | `aria-label`/`aria-labelledby` utilizzabili sull'host ✅; nessuna property dedicata né collegamento automatico al trigger. |
| 9 | Documentazione e test | ⚠️ | Nessun test axe per `sl-menu`; test di tastiera solo Freccia/Enter (SL-MENU-04). Esempi docs senza nome del menu. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-MENU-01 | Media | 4 | Nessun typeahead: digitando un carattere il focus non va all'item successivo che inizia con quel carattere. Le docs affermano "Menus support keyboard interactions, including type-to-select an option". | src/components/menu/menu.component.ts:57-99 (gestiti solo Enter, Space, frecce, Home, End); docs/pages/components/menu.md:8 | APG Menu (Keyboard: "any printable character") | Buffer di typeahead (timeout ~500ms) che confronta `item.getTextLabel()` normalizzato; oppure correggere le docs. |
| SL-MENU-02 | Bassa | 2 | Il menu non ha nome di default e, quando usato in `sl-dropdown`, non riceve `aria-labelledby` verso il trigger (stesso light DOM, riferimento possibile). Gli esempi docs non mostrano `aria-label`. (in parte consumer) | menu.component.ts:28-31; docs/pages/components/menu.md:135-158 | APG Menu Button ("menu labelled by the button"); WCAG 4.1.2 | In `sl-dropdown.updateAccessibleTrigger()` impostare `menu.setAttribute('aria-labelledby', trigger.id)` se il menu non ha già un nome; documentare `aria-label` per menu standalone. |
| SL-MENU-03 | Bassa | 1 | Il ruolo è imposto con `setAttribute('role','menu')` (un `role` del consumer viene sovrascritto) e il menu accetta qualunque figlio: testo/elementi generici nello slot diventano figli non ammessi di `role="menu"`. | menu.component.ts:30, 158-163 | ARIA 1.2 (menu: owned elements group/menuitem*/separator); SHARED §2 | Usare `ElementInternals.role` (SHARED §10); in dev, warning per figli diversi da `sl-menu-item`/`sl-divider`/`sl-menu-label`/`[role^=menuitem]`/`[role=group]`. |
| SL-MENU-04 | Bassa | 9 | `menu.test.ts` non ha test axe e non copre Home/End, wrap, Freccia su, typeahead. | src/components/menu/menu.test.ts:12-148 | Qualità | Aggiungere `to.be.accessible()` e test di tastiera completi. |
| SL-MENU-05 | Suggerimento | 1 | `isMenuItem` riconosce `menuitemradio` ma non c'è gestione di gruppi radio (`aria-checked` esclusivo) né `type="radio"` in `sl-menu-item`. | menu.component.ts:118-123, 50-52 | APG Menu (menuitemradio) | Aggiungere `type="radio"` + gestione esclusiva per gruppo (`role="group"`). |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `role` | Fisso `menu` sull'host | Sì (sovrascrive il consumer) | ElementInternals |
| `aria-label` / `aria-labelledby` sull'host | Sì (attributi nativi sull'host con ruolo) | Sì | Collegamento automatico al trigger in dropdown |
| `aria-orientation` | Implicito `vertical` | — | — |
| Typeahead | No | — | SL-MENU-01 |

### Fix proposti
```ts
private typeaheadBuffer = '';
private typeaheadTimer = 0;

private handleKeyDown(event: KeyboardEvent) {
  // … gestione esistente …
  else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    if (event.key === ' ' ) return;
    clearTimeout(this.typeaheadTimer);
    this.typeaheadTimer = window.setTimeout(() => (this.typeaheadBuffer = ''), 500);
    this.typeaheadBuffer += event.key.toLowerCase();
    const items = this.getAllItems();
    const start = items.indexOf(this.getCurrentItem()!) + (this.typeaheadBuffer.length === 1 ? 1 : 0);
    const ordered = [...items.slice(start), ...items.slice(0, start)];
    const match = ordered.find(i => i.getTextLabel().trim().toLowerCase().startsWith(this.typeaheadBuffer));
    if (match) {
      event.preventDefault();
      this.setCurrentItem(match);
      match.focus();
    }
  }
}
```
```ts
// sl-dropdown: nome del menu dal trigger (stesso light DOM)
const menu = this.getMenu();
if (menu && !menu.hasAttribute('aria-label') && !menu.hasAttribute('aria-labelledby')) {
  const triggerEl = assigned[0];
  triggerEl.id ||= `sl-dropdown-trigger-${++uid}`;
  menu.setAttribute('aria-labelledby', triggerEl.id);
}
```

### Non verificabile
- Resa reale con screen reader della navigazione a roving tabindex con item nel light DOM e contenuto nello shadow (atteso corretto).
- Comportamento con contenuti non-menuitem slottati dal consumer.
