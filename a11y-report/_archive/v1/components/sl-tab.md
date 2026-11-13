## Tab (`sl-tab` – src/components/tab/tab.component.ts)
**Pattern APG di riferimento:** Tabs (elemento `tab`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 2 · Bassa 2 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="tab"` sull'host (r. 63) ✅. Il close button (`sl-icon-button`) è annidato in un `tab` (ruolo con *children presentational*): la sua semantica di pulsante si perde (02). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome dal contenuto slottato ✅. `aria-selected` (r. 73) e `aria-disabled` (r. 78) sempre valorizzati ✅. Con `closable` il nome diventa "Etichetta Close" e la label del close non è specifica né sovrascrivibile (02). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo, ID (r. 89) e `aria-*` sull'host light DOM: `aria-controls` dal gruppo funziona. `aria-label` del consumer sull'host funziona (host con ruolo). |
| 4 | Tastiera e focus | ❌ | Close button `tabindex="-1"` (r. 109) e nessun tasto alternativo → chiusura impossibile da tastiera (01). Roving tabindex alterato da `handleDisabledChange` (03). Focus ring `outline: var(--sl-focus-ring)` su `:host(:focus-visible)` (styles r. 33-37) ✅. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Inattivo `neutral-600` 6.63:1, attivo `primary-600` 6.21:1 (light) / 6.81:1 (dark su panel); card attivo `primary-600` su `primary-50` 5.87:1 / 4.99:1 ✅. Attivo distinto anche da indicatore/bordo (non solo colore) ✅. Forced-colors: outline sul tab attivo (r. 85-90) ✅. Close button ~18×18px (04). Disabled `opacity: .5` (eccezione WCAG). |
| 8 | API pubblica a11y | ⚠️ | Manca `close-label` per nome specifico/localizzabile del close (SHARED-06). |
| 9 | Documentazione e test | ⚠️ | axe statico (test r. 9-17) e verifica `aria-selected`/`aria-disabled` ✅; nessun test axe con `closable`, nessun test tastiera per la chiusura. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-TAB-01 | Alta | Tastiera | Tab `closable`: il pulsante di chiusura è fuori dal tab order (`tabindex="-1"` sull'host dell'icon-button esclude anche il `<button>` interno) e né `sl-tab` né `sl-tab-group` gestiscono Delete → un utente da tastiera non può chiudere il tab. | tab.component.ts:101-110 `<sl-icon-button ... tabindex="-1">`; tab-group.component.ts:203-268 (nessun `Delete`) | WCAG 2.1.1; APG Tabs (Delete) | Gestire `Delete` sul tab focalizzato (emette `sl-close`, vedi SL-TAB-GROUP-03) e documentarlo; esporre la scorciatoia con `aria-keyshortcuts="Delete"` quando `closable`. |
| SL-TAB-02 | Media | Semantica / nome | Il close button vive dentro un `role="tab"` (children presentational): non è esposto come pulsante e la sua `aria-label` "Close" si concatena al nome del tab ("Closable 1 Close"). La label è generica (non indica quale tab) e non sovrascrivibile dal consumer. | tab.component.ts:63 `setAttribute('role','tab')`; 106 `label=${this.localize.term('close')}` | WCAG 4.1.2, 2.5.3; ARIA 1.2 (tab: Children Presentational); SHARED-06 | Rendere il close decorativo per AT (`aria-hidden="true"` sull'icon-button) con chiusura via Delete + `aria-keyshortcuts`; aggiungere `close-label` (default localizzato) usato come `aria-description`/tooltip. |
| SL-TAB-03 | Media | Tastiera (roving) | `handleDisabledChange` assegna `tabIndex = 0` a ogni tab non disabilitato: riattivando un tab inattivo (o su un tab non ancora inizializzato dal gruppo) si creano più tab stop nel tablist. `tabIndex = 0` è anche il default di tutti i tab. | tab.component.ts:59 `tabIndex = 0`; 80-84 `if (this.disabled && !this.active) { this.tabIndex = -1; } else { this.tabIndex = 0; }` | APG Tabs (roving tabindex); WCAG 2.4.3 | In `sl-tab` impostare solo `tabIndex = -1` quando disabilitato; delegare a `sl-tab-group.syncTabsAndPanels()` il ricalcolo (`tabIndex = el === activeTab ? 0 : -1`). Default `tabIndex = -1` quando dentro un gruppo. |
| SL-TAB-04 | Bassa | Target size | Close button ≈ 18×18px: `font-size: var(--sl-font-size-small)` (14px) + `padding: var(--sl-spacing-3x-small)` (2px). | tab.styles.ts:76-83 | WCAG 2.5.8 | `.tab__close-button::part(base) { min-width: 24px; min-height: 24px; }` (o padding `--sl-spacing-2x-small` + `x-small`). |
| SL-TAB-05 | Bassa | Test | Nessun test axe con `closable`/`card`/`disabled` dentro un `sl-tab-group`, nessun test tastiera di chiusura; esempio docs con badge contatore (`PVA 22`) senza testo di contesto per AT (consumer). | tab.test.ts:9-17, 56-65; tab-group.md:930-940 | Qualità; WCAG 1.3.1 (consumer) | Test axe in contesto tablist; nei docs suggerire `<sl-visually-hidden>elementi</sl-visually-hidden>` accanto al badge. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `aria-selected` | Sì (da `active`) | Sì, sull'host | — |
| `aria-disabled` | Sì (da `disabled`) | Sì, sull'host | — |
| `aria-controls` | Sì (dal gruppo) | Sì | Solo dopo l'intersezione (SL-TAB-GROUP-04). |
| `aria-label` | Consumer sull'host | Sì (host = `tab`) | Utile per tab icon-only. |
| `close-label` | No | — | Da aggiungere (default `localize.term('close')`). |
| `aria-keyshortcuts` | No | — | Da aggiungere quando `closable`. |

### Fix proposti
```ts
/** Accessible label of the close button (defaults to the localized "Close"). */
@property({ attribute: 'close-label' }) closeLabel = '';

@watch('disabled')
handleDisabledChange() {
  this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  if (this.disabled && !this.active) this.tabIndex = -1;
  // non riportare a 0: il roving tabindex è responsabilità di sl-tab-group
}

@watch('closable')
handleClosableChange() {
  if (this.closable) this.setAttribute('aria-keyshortcuts', 'Delete');
  else this.removeAttribute('aria-keyshortcuts');
}

// render()
<sl-icon-button
  part="close-button"
  exportparts="base:close-button__base"
  name="x-lg"
  library="system"
  aria-hidden="true"
  tabindex="-1"
  label=${this.closeLabel || this.localize.term('close')}
  class="tab__close-button"
  @click=${this.handleCloseClick}
></sl-icon-button>
```
```css
.tab__close-button::part(base) { padding: var(--sl-spacing-3x-small); min-width: 1.5rem; min-height: 1.5rem; }
```

### Non verificabile
- Calcolo del nome del tab con contenuto misto (icona + testo + badge) in NVDA/JAWS/VoiceOver.
- Contrasto di eventuali colori custom passati via `::part(base)` dal consumer.
