## Tab Group (`sl-tab-group` – src/components/tab-group/tab-group.component.ts)
**Pattern APG di riferimento:** Tabs (automatic / manual activation)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 3 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="tablist"` sul `div` shadow (r. 508); i `sl-tab` (role=tab sull'host) sono slottati tramite `sl-resize-observer` (`display: contents`) → intermedio generico, axe statico passa. Manca `aria-orientation="vertical"` con `placement` start/end (01-02). |
| 2 | Nome, descrizione, stato | ⚠️ | Tablist senza nome accessibile e senza API per fornirlo. Stati `aria-selected`/`aria-disabled` gestiti da `sl-tab`. Scroll button `aria-hidden` + `tabindex=-1` (r. 499-500, 526-527): coerente perché decorativi (lo scroll segue il focus con le frecce). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-controls`/`aria-labelledby` scritti sugli host nel light DOM (r. 324-333): ID nello stesso albero, riferimenti validi. ID generati se assenti (`sl-tab-N`, `sl-tab-panel-N`). Collegamento ritardato fino all'intersezione (vedi 04). |
| 4 | Tastiera e focus | ⚠️ | Frecce con wrap, Home/End, RTL, attivazione auto/manual (r. 203-268) ✅. Roving tabindex: inizializzazione differita (04) e rottura alla riattivazione di un tab (vedi SL-TAB-03). Nessun tasto Delete per i tab chiudibili e nessuna gestione del focus dopo la chiusura (03). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Cambio di pannello comunicato da `aria-selected` sul tab focalizzato. |
| 7 | Aspetti visivi | ⚠️ | Indicatore attivo 2px `primary-600` (6.21:1 light). In forced-colors indicatore e track diventano entrambi `CanvasText`, ma `sl-tab` aggiunge un outline all'attivo (tab.styles.ts:85-90) ✅. Scroll button larghi 20px (05). Transizione dell'indicatore senza reduced motion (SHARED-05). |
| 8 | API pubblica a11y | ❌ | Nessuna property `label`/`aria-label` per il tablist; un `aria-label` sull'host resta su un elemento senza ruolo (SHARED §2). |
| 9 | Documentazione e test | ⚠️ | 1 test axe statico con un solo tab (test r. 100-109); test tastiera solo ArrowRight/Enter (r. 437-490). Nessun test Home/End, RTL, verticale, `aria-controls`. Docs: solo Left/Right citati (tab-group.md:1059), esempio closable senza gestione del focus. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-TAB-GROUP-01 | Media | Nome / API | Il `tablist` non ha nome accessibile e non c'è modo di fornirlo da fuori: l'`aria-label` scritto sull'host resta su un elemento generico. | tab-group.component.ts:508 `<div part="tabs" class="tab-group__tabs" role="tablist">` | WCAG 4.1.2; APG Tabs ("tablist has a label") | Aggiungere `@property() label` (e `label-id`/slot non funzionano tra shadow root) → `aria-label=${ifDefined(this.label \|\| undefined)}` sul tablist. |
| SL-TAB-GROUP-02 | Media | Semantica / Tastiera | Con `placement="start"`/`"end"` la navigazione usa ArrowUp/ArrowDown ma il tablist non dichiara `aria-orientation="vertical"`: gli screen reader annunciano/si aspettano frecce orizzontali. | tab-group.component.ts:508; 233-243 (`['start','end'].includes(this.placement) && event.key === 'ArrowUp'`) | WCAG 4.1.2; APG Tabs (aria-orientation) | `aria-orientation=${['start','end'].includes(this.placement) ? 'vertical' : 'horizontal'}` sul tablist. |
| SL-TAB-GROUP-03 | Media | Tastiera / focus | Tab chiudibili: il gruppo non gestisce Delete né sposta il focus quando un tab viene rimosso; l'esempio ufficiale rimuove il tab focalizzato senza spostare il focus → focus perso su `<body>`. | tab-group.component.ts:203-268 (nessun ramo `Delete`); docs/pages/components/tab-group.md:315-327 (`tab.remove(); panel.remove();`) | WCAG 2.1.1, 2.4.3; APG Tabs (Delete opzionale) | In `handleKeyDown`: `if (event.key === 'Delete' && tab.closable) tab.emit('sl-close')`; in `syncTabsAndPanels`, se il tab attivo/focalizzato è sparito, attivare e focalizzare il tab adiacente. Aggiornare l'esempio docs con `nextTab.focus()`. |
| SL-TAB-GROUP-04 | Bassa | Semantica / Tastiera | Stato iniziale differito a quando il gruppo interseca il viewport: fino ad allora nessun tab ha `aria-selected="true"`, tutti i tab hanno `tabindex=0` (più tab stop), `aria-controls`/`aria-labelledby` assenti e tutti i pannelli nascosti. | tab-group.component.ts:151-161 (`IntersectionObserver ... if (entries[0].intersectionRatio > 0) { this.setAriaLabels(); this.setActiveTab(...) }`); tab.component.ts:59 `tabIndex = 0` | WCAG 4.1.2, 2.4.3; APG Tabs (roving tabindex) | Eseguire `setAriaLabels()` + `setActiveTab()` subito dopo `whenAllDefined`; usare l'IntersectionObserver solo per `repositionIndicator()`. |
| SL-TAB-GROUP-05 | Bassa | Target size | Scroll button larghi `--sl-spacing-x-large` (1.25rem = 20px) < 24px (solo puntatore). | tab-group.styles.ts:51 `width: var(--sl-spacing-x-large);` | WCAG 2.5.8 | `min-width: 24px` / `width: max(1.5rem, var(--sl-spacing-x-large))` e padding del nav-container coerente. |
| SL-TAB-GROUP-06 | Bassa | Test / docs | Test a11y solo statico; nessun test per Home/End, wrap, RTL, `placement` verticale, `aria-controls`/`aria-labelledby`, axe con più tab e tab disabilitati. Docs: tastiera descritta solo per Left/Right. | tab-group.test.ts:100-109, 437-490; tab-group.md:1059 | Qualità (WCAG 4.1.2 regressioni) | Aggiungere test con `sendKeys` Home/End/ArrowUp/Down e asserzioni ARIA; sezione "Accessibility" nei docs con tasti e `label`. |
| SL-TAB-GROUP-07 | Suggerimento | Motion | Transizione `translate`/`width` dell'indicatore non disattivata con `prefers-reduced-motion`. | tab-group.styles.ts:24-26 | WCAG 2.3.3 (AAA) – vedi SHARED-05 | Fix trasversale SHARED-05 o `@media (prefers-reduced-motion: reduce) { .tab-group__indicator { transition: none; } }`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` (nome tablist) | No | — | Da aggiungere → `aria-label` sul `[role=tablist]`. |
| `aria-orientation` | No (derivabile da `placement`) | — | Calcolare da `placement`. |
| `activation` (auto/manual) | Sì | Sì | Conforme APG. |
| `aria-controls` / `aria-labelledby` tab↔panel | Sì (automatici) | Sì, sugli host light DOM | Applicati solo dopo l'intersezione (04). |
| Label scroll button | Sì (`scrollToStart`/`scrollToEnd` localizzati) | Nascosti con `aria-hidden` | Coerente: decorativi. |

### Fix proposti
```ts
/** Accessible name of the tab list. */
@property() label = '';

// render(): tablist
<div
  part="tabs"
  class="tab-group__tabs"
  role="tablist"
  aria-label=${ifDefined(this.label || undefined)}
  aria-orientation=${['start', 'end'].includes(this.placement) ? 'vertical' : 'horizontal'}
>

// connectedCallback(): init immediata, IO solo per l'indicatore
whenAllDefined.then(() => {
  this.syncTabsAndPanels();
  this.setAriaLabels();
  this.setActiveTab(this.getActiveTab() ?? this.focusableTabs[0], { emitEvents: false });
  const io = new IntersectionObserver((entries, observer) => {
    if (entries[0].intersectionRatio > 0) { this.repositionIndicator(); observer.unobserve(entries[0].target); }
  });
  io.observe(this.tabGroup);
});

// handleKeyDown(): chiusura da tastiera
if (event.key === 'Delete' && tab?.closable && !tab.disabled) {
  event.preventDefault();
  tab.emit('sl-close');
  return;
}

// syncTabsAndPanels(): recupero del focus/selezione se il tab attivo è stato rimosso
if (this.activeTab && !this.tabs.includes(this.activeTab)) {
  const fallback = this.focusableTabs[0];
  // se il tab rimosso aveva il focus, il browser lo riporta su <body>
  const focusLost = document.activeElement === document.body;
  this.activeTab = undefined;
  if (fallback) {
    this.setActiveTab(fallback);
    if (focusLost) fallback.focus();
  }
}
```
```css
.tab-group__scroll-button { width: max(1.5rem, var(--sl-spacing-x-large)); }
@media (prefers-reduced-motion: reduce) { .tab-group__indicator { transition: none; } }
```

### Non verificabile
- Esposizione del rapporto `tablist` → `tab` attraverso `slot` + `sl-resize-observer` (`display: contents`) negli alberi di accessibilità di Safari/VoiceOver e Firefox/NVDA (conteggio "tab 1 di N"): richiede test con screen reader.
- Comportamento della lettura in browse mode prima dell'intersezione (finding 04): verificare con NVDA/JAWS su pagine lunghe.
- Contrasto di `--indicator-color`/`--track-color` se ridefiniti dal consumer.
