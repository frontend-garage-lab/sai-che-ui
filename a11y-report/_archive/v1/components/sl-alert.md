## Alert (`<sl-alert>` – src/components/alert/alert.component.ts)
**Pattern APG di riferimento:** APG Alert pattern; WAI-ARIA 1.2 `role="alert"` / `role="status"` (live region); per i toast WCAG 2.2.1 Timing Adjustable e 4.1.3 Status Messages.
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 2 · Media 3 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="alert"` fisso su `.alert` per ogni variant (r. 246), con `aria-live="polite"` annidato in contraddizione (r. 255). `role="timer"` nascosto e inutile (r. 273). |
| 2 | Nome, descrizione, stato | ⚠️ | Close button con nome localizzato `localize.term('close')` (r. 267) ✅; icona slot: `sl-icon` senza `label` è `aria-hidden` ✅. La variante (successo/errore) è comunicata solo dal colore se il consumer non aggiunge icona/testo. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID cross-root. Il contenuto slottato resta nel live region (lo slot è dentro `.alert__message`). `:host { display: contents }` (styles r. 5): host senza box, nessun ruolo sull'host. |
| 4 | Tastiera e focus | ⚠️ | Close = `sl-icon-button` nativo con `:focus-visible` outline (6.21:1) ✅. Alla chiusura `blurActiveElement` (r. 160) manda il focus su `<body>`; nessun Esc per chiudere (non richiesto da APG Alert). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Live region esiste nel DOM anche da chiuso (`hidden`), quindi il passaggio `hidden → visibile` è annunciabile; però urgenza non configurabile, toast con auto-hide pausabile solo col mouse (r. 248-249), countdown non esposto agli AT. |
| 7 | Aspetti visivi | ⚠️ | Testo neutral-800 su tint: 11.82 (primary-50, light) / 7.47 (dark) ✅; icone -600/-700 su -50 ≥4.26 ✅. Bordo d'accento accent-500 (2.42) e warning-500 (2.46) su tint in light < 3:1 (decorativo, ma è l'unico indicatore di variante senza icona). Close button 14px + padding 0.5rem×2 ≈ 30px ✅ 2.5.8. Nessuna media query `forced-colors` (il bordo resta, la variante si perde). Animazioni show/hide via `animateTo` rispettano reduced motion ✅; countdown (`element.animate`, r. 131) no. |
| 8 | API pubblica a11y | ⚠️ | Mancano property per scegliere `role`/urgenza (alert vs status), `close-label` (SHARED-06), etichetta testuale della variante. |
| 9 | Documentazione e test | ⚠️ | 1 test axe su stato aperto statico (test r. 75-78); nessun test su focus dopo chiusura, pausa su focus, ruolo per variant. Docs senza sezione Accessibility, nessuna guida su durata minima dei toast. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-ALERT-01 | Alta | Live region | `role="alert"` (assertivo, interrompe lo SR) applicato a tutte le varianti, anche informative/success, senza possibilità di scegliere `status`; dentro c'è `aria-live="polite"` che contraddice l'`assertive` implicito dell'antenato e su alcuni SR genera doppio annuncio. | src/components/alert/alert.component.ts:246 `role="alert"`; :255 `<div part="message" class="alert__message" aria-live="polite">` | WCAG 4.1.3; WAI-ARIA 1.2 alert/status | Property `live` (`'assertive' \| 'polite' \| 'off'`), default `assertive` per `danger`/`warning`, `polite` (`role="status"`) per le altre; rimuovere l'`aria-live` annidato. |
| SL-ALERT-02 | Alta | Live region / Tastiera | Auto-hide (`duration`) si sospende solo con `mouseenter`/`mouseleave`; nessuna pausa su `focusin`/`focusout` né con tastiera: un utente da tastiera o SR che raggiunge il toast lo vede chiudersi mentre lo legge/interagisce; nessun modo di estendere il tempo. | src/components/alert/alert.component.ts:248-249 `@mouseenter=${this.pauseAutoHide} @mouseleave=${this.resumeAutoHide}`; :97-124 | WCAG 2.2.1 Timing Adjustable; 2.1.1 | Aggiungere `@focusin=pauseAutoHide` / `@focusout` (se il focus esce) `resumeAutoHide`; pausa anche su `keydown` Esc? (no: Esc chiude). Documentare durata minima (≥ 5 s + 1 s ogni 120 parole) e sconsigliare `duration` per alert con azioni. |
| SL-ALERT-03 | Media | Tastiera e focus | Alla chiusura il focus interno all'alert viene semplicemente tolto con `blur()`: finisce su `<body>`; per i toast l'elemento è poi rimosso dal DOM. L'utente da tastiera perde la posizione. | src/components/alert/alert.component.ts:160 `blurActiveElement(this);`; src/internal/closeActiveElement.ts:7-11; :224 `removeChild(this)` | WCAG 2.4.3 Focus Order | Memorizzare l'elemento attivo prima che il focus entri nell'alert (`focusin` → `relatedTarget`) e ripristinarlo in `hide()`; in alternativa evento cancellabile `sl-request-focus-return` o property `return-focus` documentata. |
| SL-ALERT-04 | Media | Aspetti visivi / Nome | La variante (successo, avviso, errore) è veicolata solo da colore di bordo/tint; l'icona è uno slot facoltativo e non esiste testo alternativo della variante (es. "Errore:") per SR e per forced-colors (consumer + componente). | src/components/alert/alert.styles.ts:58-98 (solo `--alert-*` colori); alert.component.ts:251-253 slot `icon` facoltativo | WCAG 1.4.1 Use of Color; 1.3.1 | Prefisso visivamente nascosto localizzato per variante (property `variant-label`, default da LocalizeController: "Informazione", "Successo", "Avviso", "Errore") e documentare l'icona come obbligatoria. |
| SL-ALERT-05 | Media | Tastiera / Live region | Toast stack: `<div class="sl-toast-stack">` generico appeso in fondo a `<body>`, senza ruolo/nome: chi usa tastiera deve attraversare tutta la pagina per raggiungere le azioni di un toast (che può sparire nel frattempo), e gli SR non hanno un punto di navigazione. | src/components/alert/alert.component.ts:53-60, 208-212; src/themes/_utility.css:25-33 | WCAG 2.4.1 / 2.1.1 (buona pratica APG) | Creare lo stack come `<section role="region" aria-label="${localize.term('notifications')}">` (nuova chiave i18n); suggerire scorciatoia (F6) o spostamento del focus solo su toast con azioni; sconsigliare azioni nei toast auto-hide. |
| SL-ALERT-06 | Bassa | Semantica | `role="timer"` con `display:none` aggiornato ogni 100 ms: nascosto agli AT, quindi inutile, e provoca un re-render 10 volte al secondo; il countdown visivo (barra) non ha alternativa testuale. | src/components/alert/alert.component.ts:273 `<div role="timer" class="alert__timer">${this.remainingTime}</div>`; :104-106; alert.styles.ts:137-139 | WCAG 1.3.1 / 4.1.2 (ruolo inutile) | Rimuovere il `role="timer"`; se serve, testo sr-only statico all'apertura ("Si chiude tra N secondi") con chiave localizzata. |
| SL-ALERT-07 | Bassa | Aspetti visivi | Animazione countdown creata con `element.animate` diretta, non con `animateTo`: ignora `prefers-reduced-motion`; contenuto in movimento > 5 s pausabile solo con hover. | src/components/alert/alert.component.ts:131-134 | WCAG 2.2.2 Pause, Stop, Hide; 2.3.3 (AAA) | Con `prefersReducedMotion()` non animare (o aggiornare a scatti), e pausa anche su focus (vedi SL-ALERT-02). |
| SL-ALERT-08 | Bassa | Aspetti visivi | Nessuna media query `forced-colors`: tint e bordo d'accento (unici indicatori di variante) diventano colori di sistema; la barra di countdown (`background-color`) può sparire. | src/components/alert/alert.styles.ts (assenza di `@media (forced-colors: active)`); :117-135 | WCAG 1.4.11; forced colors | `@media (forced-colors: active) { .alert { border-inline-start-color: CanvasText; } .alert__countdown-elapsed { background: Highlight; } }` + SL-ALERT-04. |
| SL-ALERT-09 | Suggerimento | API / Test | Etichetta del close button non sovrascrivibile (solo traduzione globale, SHARED-06); test axe solo sullo stato aperto statico, nessun test su focus/pausa/ruolo; docs senza sezione Accessibility. | src/components/alert/alert.component.ts:267 `label=${this.localize.term('close')}`; alert.test.ts:75-78 | SHARED-06; WCAG 2.5.3 | Property `close-label`; test: `focusin` sospende il timer, ruolo `status` per variant neutre, focus ripristinato dopo `hide()`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `role` / urgenza (`live`) | No | — | Fisso `role="alert"` (r. 246): aggiungere `live` o `urgency` |
| `close-label` | No | — | Default `localize.term('close')` ✅ ma non personalizzabile (SHARED-06) |
| `variant-label` (prefisso testuale) | No | — | Vedi SL-ALERT-04 |
| `aria-label` / `aria-labelledby` sull'host | No | No | `:host { display: contents }`: un `aria-label` sull'host è ignorato; non necessario per alert |
| `duration` / pausa | Sì | Parziale | Pausa solo mouse |
| `aria-hidden` da chiuso | Sì (interno) | Sì | Ridondante con `hidden` (r. 94, 169) ma innocuo |

### Fix proposti
```ts
/** Urgenza dell'annuncio. Default: assertive per danger/warning, polite altrimenti. */
@property({ reflect: true }) live?: 'assertive' | 'polite' | 'off';
@property({ attribute: 'close-label' }) closeLabel?: string;

private get liveRole() {
  const live = this.live ?? (this.variant === 'danger' || this.variant === 'warning' ? 'assertive' : 'polite');
  return live === 'off' ? nothing : live === 'assertive' ? 'alert' : 'status';
}

private lastFocused: HTMLElement | null = null;
private handleFocusIn = (e: FocusEvent) => {
  if (!this.lastFocused && e.relatedTarget instanceof HTMLElement && !this.contains(e.relatedTarget)) {
    this.lastFocused = e.relatedTarget;
  }
  this.pauseAutoHide();
};
private handleFocusOut = (e: FocusEvent) => {
  if (!this.contains(e.relatedTarget as Node)) this.resumeAutoHide();
};

// in handleOpenChange (hide): al posto di blurActiveElement(this)
if (this.matches(':focus-within')) { (this.lastFocused ?? document.body).focus?.(); }
this.lastFocused = null;

render() {
  return html`
    <div part="base" class="alert …" role=${this.liveRole}
      @mouseenter=${this.pauseAutoHide} @mouseleave=${this.resumeAutoHide}
      @focusin=${this.handleFocusIn} @focusout=${this.handleFocusOut}>
      <div part="icon" class="alert__icon"><slot name="icon"></slot></div>
      <div part="message" class="alert__message">
        <span class="sr-only">${this.variantLabel}</span><slot></slot>
      </div>
      ${this.closable ? html`<sl-icon-button … label=${this.closeLabel ?? this.localize.term('close')}></sl-icon-button>` : ''}
      <!-- rimosso role="timer" -->
    </div>`;
}
```
```ts
// toast stack
this.currentToastStack = Object.assign(document.createElement('section'), { className: 'sl-toast-stack' });
this.currentToastStack.setAttribute('aria-label', /* chiave i18n 'notifications' */ 'Notifications');
```
```css
@media (forced-colors: active) {
  .alert { border-inline-start-color: CanvasText; }
  .alert__countdown-elapsed { background-color: Highlight; }
}
```

### Non verificabile
- Annuncio effettivo del passaggio `hidden → visibile` del `role="alert"` e del toast appena inserito nel DOM (NVDA/JAWS/VoiceOver/TalkBack): richiede test con screen reader, in particolare il doppio annuncio dovuto all'`aria-live` annidato.
- Contrasto di contenuti custom slottati (link, bottoni) sul tint della variante: dipende dal consumer.
- Adeguatezza dei valori di `duration` usati dalle app consumer.
