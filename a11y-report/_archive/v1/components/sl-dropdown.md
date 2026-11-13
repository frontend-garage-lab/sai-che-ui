## Dropdown (`sl-dropdown` – src/components/dropdown/dropdown.component.ts)
**Pattern APG di riferimento:** Menu Button — https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ (con `sl-menu`); Disclosure — https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ (contenuto generico)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 3 · Bassa 5 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Il dropdown non ha ruolo proprio (corretto: è un contenitore). `aria-haspopup="true"` (= `menu`) fisso anche per pannelli non-menu (SL-DROPDOWN-01). Wrapper del pannello con `aria-labelledby` su `<div>` generico (SL-DROPDOWN-04). |
| 2 | Nome, descrizione, stato | ⚠️ | `aria-expanded` sincronizzato sul trigger accessibile a ogni cambio di `open` e `slotchange` (r. 295-329) ✅. `disabled` non si riflette sul trigger (SL-DROPDOWN-07). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il componente scrive `aria-haspopup`/`aria-expanded` sul `<button>` interno di `sl-button`/`sl-icon-button` (r. 317-320) ✅; per altri custom element con controllo nello shadow root gli attributi finiscono sull'host senza ruolo (SL-DROPDOWN-05). `aria-controls` assente pur essendo trigger e `sl-menu` entrambi nel light DOM (SL-DROPDOWN-09). |
| 4 | Tastiera e focus | ⚠️ | Frecce/Home/End dal trigger aprono e focalizzano primo/ultimo item ✅; Esc chiude e riporta il focus al trigger ✅; selezione chiude e rifocalizza il trigger ✅; DOM order trigger→pannello preservato (no portal) ✅. Enter/Space non spostano il focus nel menu (SL-DROPDOWN-02); Esc nel fallback senza `CloseWatcher` chiude anche il dialog genitore (SL-DROPDOWN-03); Tab da un item torna al trigger invece di proseguire (SL-DROPDOWN-06). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Stato comunicato con `aria-expanded`. |
| 7 | Aspetti visivi | ✅ | Nessun colore proprio (pannello = contenuto slottato, es. `sl-menu`); animazione via `animateTo` (reduced motion ✅). Forced colors demandato a `sl-menu`/contenuto. |
| 8 | API pubblica a11y | ⚠️ | Nessuna property per scegliere `aria-haspopup` (`menu`/`listbox`/`dialog`/`false`) né per `aria-controls`. Nessuna stringa da localizzare. |
| 9 | Documentazione e test | ⚠️ | Buoni test di tastiera (frecce, Esc, Enter, Tab r. 151-454) ma nessun test axe e nessuna asserzione su `aria-expanded`/`aria-haspopup`; docs senza sezione tastiera/a11y (SL-DROPDOWN-08). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-DROPDOWN-01 | Media | 1/2 | `aria-haspopup="true"` (equivale a `menu`) applicato sempre, anche quando il pannello contiene contenuto generico (form, color picker, testo). Lo screen reader annuncia "menu" e l'utente si aspetta navigazione a frecce che non esiste. | src/components/dropdown/dropdown.component.ts:326 `target.setAttribute('aria-haspopup', 'true')` | WCAG 4.1.2; APG Menu Button vs Disclosure | Impostare `aria-haspopup="menu"` solo se `getMenu()` esiste; property `haspopup` (`menu`/`listbox`/`dialog`/`false`) per gli altri casi; con `false` usare solo `aria-expanded` (disclosure). |
| SL-DROPDOWN-02 | Media | 4 | Enter/Space sul trigger aprono il pannello ma lasciano il focus sul trigger (scelta voluta, commento r. 241-242): APG Menu Button prevede focus sul primo item. Gli utenti SR sentono solo "espanso" e devono sapere di premere Freccia giù; non documentato. | dropdown.component.ts:240-247 | APG Menu Button (Keyboard Interaction); WCAG 2.1.1 (buona pratica) | Con `sl-menu` presente spostare il focus sul primo item anche su Enter/Space (oppure opzione `focus-on-open`), e documentare il comportamento. |
| SL-DROPDOWN-03 | Media | 4 | Senza `CloseWatcher` (Safari, Firefox) Esc con focus sul trigger è gestito da un listener `keydown` su `document` che chiama solo `stopPropagation()`: un `sl-dialog`/`sl-drawer` aperto in precedenza ha un listener sullo stesso nodo registrato prima, quindi chiude anch'esso → Esc chiude dropdown **e** dialog. | dropdown.component.ts:159-166, 371; src/components/dialog/dialog.component.ts:157, 170-175 | WCAG 3.2.2 (cambio di contesto inatteso); APG Dialog (Esc chiude solo il livello superiore) | Registrare `handleDocumentKeyDown` in capture (`{ capture: true }`) e chiamare `stopPropagation()` per Esc quando `open`; nei modali ignorare eventi `defaultPrevented`. |
| SL-DROPDOWN-04 | Bassa | 1 | `aria-labelledby="dropdown"` su un `<div>` senza ruolo (naming proibito su `generic`) e puntato all'`sl-popup` che contiene trigger + pannello stesso: riferimento senza effetto o con nome ricorsivo. `aria-hidden` alternato ridondante con `hidden` sul pannello. | dropdown.component.ts:449 `<div aria-hidden=${…} aria-labelledby="dropdown">` | ARIA 1.2 (naming prohibited: generic); WCAG 4.1.2 | Rimuovere `aria-labelledby` e `aria-hidden`; il nome del menu va dato su `sl-menu` (vedi SL-MENU) via `aria-labelledby` verso il trigger (stesso light DOM). |
| SL-DROPDOWN-05 | Bassa | 3 | Il "trigger accessibile" è risolto solo per `sl-button`/`sl-icon-button`; per qualunque altro custom element con controllo nello shadow root (componenti consumer o altri componenti DS usati come trigger) `aria-haspopup`/`aria-expanded` vengono scritti sull'host senza ruolo e ignorati. | dropdown.component.ts:315-324 `default: target = accessibleTrigger;` | WCAG 4.1.2 | Convenzione: se l'host espone una property `focusTarget`/`button` (o `ariaExpanded` property), usarla; documentare che il trigger deve essere un elemento nativo o un componente DS supportato. |
| SL-DROPDOWN-06 | Bassa | 4 | Tab su un `sl-menu-item` esegue `preventDefault()`, chiude e rifocalizza il trigger: l'utente deve premere Tab due volte; APG prevede che Tab chiuda il menu e prosegua all'elemento successivo. | dropdown.component.ts:169-176 | APG Menu / Menubar (Tab) | Chiudere senza `preventDefault`, impostando il focus sul trigger solo per Shift+Tab, oppure lasciare proseguire il Tab naturale dopo il trigger. |
| SL-DROPDOWN-07 | Bassa | 2 | Con `disabled` il pannello non si apre ma il trigger resta abilitato e continua a esporre `aria-haspopup` (consumer deve disabilitare anche il trigger, non documentato). | dropdown.component.ts:81, 387-390 | WCAG 4.1.2 | Con `disabled` rimuovere `aria-haspopup`/`aria-expanded` o impostare `aria-disabled="true"` sul trigger accessibile; documentare. |
| SL-DROPDOWN-08 | Bassa | 9 | Nessun test axe a dropdown aperto/chiuso e nessuna verifica di `aria-expanded`/`aria-haspopup`; docs senza sezione su tastiera e requisiti del trigger. | src/components/dropdown/dropdown.test.ts:1-454 (assenza di `accessible`/`aria-`); docs/pages/components/dropdown.md | Qualità | Aggiungere test e sezione "Accessibilità/Tastiera". |
| SL-DROPDOWN-09 | Suggerimento | 3 | Non viene impostato `aria-controls` sul trigger, benché trigger e `sl-menu` slottato siano entrambi nel light DOM (riferimento ID valido). | dropdown.component.ts:326-327 | APG Menu Button (aria-controls opzionale) | Assegnare un id al menu se assente e `target.setAttribute('aria-controls', menu.id)` quando `target.getRootNode() === menu.getRootNode()`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `aria-expanded` (sul trigger) | Automatico | Sì per elementi nativi, `sl-button`, `sl-icon-button`; No per altri custom element | SL-DROPDOWN-05 |
| `aria-haspopup` (sul trigger) | Automatico, fisso `true` | Parziale | Property `haspopup` (SL-DROPDOWN-01) |
| `aria-controls` | No | — | SL-DROPDOWN-09 |
| `disabled` | Sì | Non riflesso sul trigger | SL-DROPDOWN-07 |
| `stay-open-on-select` | Sì | — | — |

### Fix proposti
```ts
@property() haspopup: 'menu' | 'listbox' | 'dialog' | 'grid' | 'tree' | 'false' | undefined;

updateAccessibleTrigger() {
  const assigned = this.trigger.assignedElements({ flatten: true }) as HTMLElement[];
  const accessibleTrigger = assigned.find(el => getTabbableBoundary(el).start);
  if (!accessibleTrigger) return;
  const target = 'button' in accessibleTrigger && accessibleTrigger.button instanceof HTMLElement
    ? (accessibleTrigger.button as HTMLElement)
    : accessibleTrigger;
  const menu = this.getMenu();
  const popupType = this.haspopup ?? (menu ? 'menu' : 'false');

  if (popupType === 'false') target.removeAttribute('aria-haspopup');
  else target.setAttribute('aria-haspopup', popupType);
  target.setAttribute('aria-expanded', this.open ? 'true' : 'false');

  if (menu && target.getRootNode() === menu.getRootNode()) {
    menu.id ||= `sl-dropdown-menu-${++uid}`;
    target.setAttribute('aria-controls', menu.id);
  }
}

addOpenListeners() {
  …
  document.addEventListener('keydown', this.handleDocumentKeyDown, { capture: true });
}
removeOpenListeners() {
  …
  document.removeEventListener('keydown', this.handleDocumentKeyDown, { capture: true });
}

// render(): rimuovere aria-labelledby/aria-hidden dal wrapper
<div><slot part="panel" class="dropdown__panel"></slot></div>
```

### Non verificabile
- Annuncio effettivo di `aria-expanded` scritto sul `<button>` nello shadow root di `sl-button` in VoiceOver/NVDA/JAWS (atteso corretto, va confermato).
- Comportamento di Esc con `CloseWatcher` annidati (dialog + dropdown) in Chrome: atteso corretto (stack di CloseWatcher).
- Contenuto del pannello (non-menu) e relativo contrasto: responsabilità del consumer.
