## Detail Panel (`<sl-detail-panel>` – src/components/detail-panel/detail-panel.component.ts)
**Pattern APG di riferimento:** APG Landmark Regions (`complementary`/`region` con nome); pannello non modale (nessun focus trap, come APG "Disclosure" per apertura/chiusura dal trigger).
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 3 · Bassa 2 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Contenitore `<div part="base">` (r. 73) senza landmark/nome; `<header>` interno (r. 74) non dentro un elemento di sezionamento nel shadow root → potenziale landmark `banner` spurio; titolo `<h2>` a livello fisso (r. 76). |
| 2 | Nome, descrizione, stato | ⚠️ | Close con nome localizzato `term('close')` (r. 93) ✅ ma generico ("Chiudi") e non sovrascrivibile (SHARED-06). Con slot `label` vuoto resta un `<h2>` vuoto. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il consumer potrebbe mettere `role="complementary"` + `aria-labelledby` sull'host, ma il titolo è un `<h2>` nello shadow root con il testo slottato: l'ID va messo sull'elemento slottato dal consumer (non documentato). |
| 4 | Tastiera e focus | ❌ | Close: `this.hidden = true` (r. 68) mentre il focus è sul bottone → il focus finisce su `<body>`; nessun evento/meccanismo per riportarlo al trigger. Nessun Esc (opzionale per pannello non modale). Body `overflow: auto` (styles r. 78-82) non focusabile se il contenuto non contiene controlli. Focus ring del close: outline `--sl-focus-ring` di `sl-icon-button` ✅. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Apertura/chiusura non annunciate: accettabile se il focus viene gestito (vedi finding). |
| 7 | Aspetti visivi | ⚠️ | Titolo neutral-900 su surface-panel 15.46/12.65 ✅. Meta `neutral-500` su `--sl-surface-panel` (dark = neutral-100) 4.71 light / **2.95 dark** ❌ (SHARED-03). Close 16px + padding 0.5rem×2 ≈ 32px ✅. Bordi `--sl-border-subtle` decorativi. Nessuna animazione. |
| 8 | API pubblica a11y | ⚠️ | Mancano `close-label`, `heading-level`, etichetta del landmark. |
| 9 | Documentazione e test | ⚠️ | 1 test axe (test r. 7-16) ✅; test close/prevent ✅; nessun test sul focus dopo la chiusura; docs senza note su landmark/focus. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-DETAIL-PANEL-01 | Alta | Tastiera e focus | Chiudendo con il bottone il componente imposta `hidden` su se stesso mentre il focus è sul close: il focus viene perso (va su `<body>`) e l'utente da tastiera/SR deve ripartire dall'inizio della pagina; nessun hook documentato per riportarlo all'elemento della lista che aveva aperto il pannello. | src/components/detail-panel/detail-panel.component.ts:58-69 `this.hidden = true;`; :88-96 | WCAG 2.4.3 Focus Order; APG (ritorno del focus al trigger) | Prima di `hidden = true` emettere `sl-after-hide`/documentare che il consumer deve spostare il focus nel listener di `sl-request-close`; in alternativa property `return-focus` (selettore/elemento) o memorizzare `document.activeElement` all'apertura e ripristinarlo. |
| SL-DETAIL-PANEL-02 | Media | Semantica | Il pannello non è un landmark e non ha nome: gli utenti SR non possono raggiungerlo dalla lista dei landmark né capire dove inizia/finisce. L'`<header>` interno, non contenuto in `article/aside/section` nel shadow root, può essere esposto come `banner` aggiuntivo (dipende da come il browser valuta gli antenati nel flat tree). | src/components/detail-panel/detail-panel.component.ts:73-74 `<div part="base" class="detail-panel"><header part="header" …>` | WCAG 1.3.1; 2.4.1; APG Landmark Regions | `<aside part="base" aria-labelledby="title">` con `id="title"` sull'`<h2>` (stesso shadow root): rende l'header generico e dà un nome al landmark; property `landmark` (`'complementary' \| 'region' \| 'none'`). |
| SL-DETAIL-PANEL-03 | Media | Aspetti visivi | Testo meta in `neutral-500`: 2.95:1 sulla superficie del pannello in dark (neutral-100). | src/components/detail-panel/detail-panel.styles.ts:55-60 `color: var(--sl-color-neutral-500);` | WCAG 1.4.3; SHARED-03 | `color: var(--sl-color-neutral-600)` (o token `--sl-input-help-text-color`). |
| SL-DETAIL-PANEL-04 | Media | Semantica | Titolo `<h2>` a livello fisso: il pannello affiancato a una pagina con `h1` → `h2` di lista diventa un fratello del titolo di sezione; non adattabile. Con slot `label` vuoto l'`<h2>` resta vuoto (heading vuoto). | src/components/detail-panel/detail-panel.component.ts:76-78 | WCAG 1.3.1; 2.4.6 | Property `heading-level` (default 2) con `role="heading" aria-level`; non rendere l'heading se lo slot è vuoto (`HasSlotController('label')`). |
| SL-DETAIL-PANEL-05 | Bassa | Nome | Il nome del close è il generico "Chiudi"/"Close" e non sovrascrivibile; in pagine con più pannelli/dialog è ambiguo. | src/components/detail-panel/detail-panel.component.ts:93 `label=${this.localize.term('close')}` | WCAG 2.4.6; SHARED-06 | Property `close-label` (es. "Chiudi dettagli documento"). |
| SL-DETAIL-PANEL-06 | Bassa | Tastiera e focus | Il body è un'area scrollabile (`overflow: auto`) senza `tabindex`: se contiene solo testo, chi usa la tastiera non può scorrerla (eccetto browser che rendono focusabili gli scroller). | src/components/detail-panel/detail-panel.styles.ts:78-82 | WCAG 2.1.1 | `tabindex="0"` + `role="region"` + `aria-labelledby` sul body solo quando c'è overflow (ResizeObserver), con `:focus-visible` outline. |
| SL-DETAIL-PANEL-07 | Suggerimento | Docs | Docs non descrivono landmark, livello del titolo e gestione del focus all'apertura/chiusura; nessun test sul focus. | docs/pages/components/detail-panel.md:8-20; detail-panel.test.ts:62-91 | Qualità docs/test | Sezione Accessibilità + test "focus ritorna al trigger". |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `close-label` | No | — | Default `term('close')` |
| `heading-level` | No | — | `<h2>` fisso |
| landmark / `aria-label` del pannello | No | — | `aria-label` sull'host è ignorato (host senza ruolo) salvo che il consumer imposti anche `role` |
| `sl-request-close` (cancelable) | Sì | Sì | Utile per gestire il focus, da documentare |

### Fix proposti
```ts
@property({ attribute: 'close-label' }) closeLabel?: string;
@property({ attribute: 'heading-level', type: Number }) headingLevel = 2;
private returnFocusTo: HTMLElement | null = null;

/** Il consumer può passare l'elemento a cui riportare il focus (es. la riga selezionata). */
show(trigger?: HTMLElement) {
  this.returnFocusTo = trigger ?? (document.activeElement as HTMLElement);
  this.hidden = false;
}

private requestClose() {
  const ev = this.emit('sl-request-close', { cancelable: true, detail: { source: 'close-button' } });
  if (ev.defaultPrevented) return;
  this.hidden = true;
  this.returnFocusTo?.focus();
}

render() {
  return html`
    <aside part="base" class="detail-panel" aria-labelledby="title">
      <header part="header" class="detail-panel__header">
        <div class="detail-panel__heading">
          <div id="title" part="title" class="detail-panel__title" role="heading" aria-level=${this.headingLevel}>
            <slot name="label"></slot>
          </div>
          …
        </div>
        …
        <sl-icon-button … label=${this.closeLabel ?? this.localize.term('close')}></sl-icon-button>
      </header>
      <div part="body" class="detail-panel__body"><slot></slot></div>
    </aside>`;
}
```
```css
.detail-panel__meta { color: var(--sl-color-neutral-600); }
```

### Non verificabile
- Esposizione dell'`<header>` interno come `banner` (dipende dal calcolo degli antenati nel flat tree in Chromium/WebKit/Gecko): test con ispettore di accessibilità.
- Gestione del focus all'apertura del pannello: dipende dal consumer.
