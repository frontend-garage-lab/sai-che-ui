# 99 — Riepilogo audit accessibilità v2 (solo errori dimostrati)

Design System: fork di Shoelace 2.20.1 (Lit 3.2.1, prefisso `sl-`). Revisione v2 del 2026-11-12, che sostituisce la v1 archiviata in [_archive/v1/](_archive/v1/).

**Fonti:**
- [findings.csv](findings.csv): solo errori verificati;
- [improvements.csv](improvements.csv): miglioramenti, responsabilità del consumer e verifiche da fare con AT;
- [triage-v1.csv](triage-v1.csv): esito di ognuno dei 470 finding v1;
- [components/](components/): 77 report riscritti.

## Metodo e definizione di errore

Un problema compare tra gli **errori** solo se valgono tutte e tre le condizioni:
1. c'è una **riga di codice** che lo causa;
2. lo **scenario è riprodotto** in un browser reale. L'harness carica il bundle `cdn/` in Chromium e legge l'albero di accessibilità calcolato dal browser (ruolo, nome, descrizione e stati che riceve uno screen reader), il focus reale attraverso gli shadow root, gli eventi e i contrasti misurati sui colori renderizzati (light, dark, `forced-colors`, `prefers-reduced-motion`, viewport a 320px). L'output dell'harness è riportato in ogni report e nella colonna `proof` del CSV;
3. viola un **criterio WCAG 2.2 di livello A/AA**, oppure manca un comportamento da tastiera APG senza il quale la funzione non è operabile.

Prove: **115 errori su 117 dimostrati a runtime**. 2 sono dimostrati da codice più misura dei token, perché lo stato non è riproducibile in modo automatico: autofill di `sl-input` (SL-INPUT-08) e handle su gradiente di `sl-color-picker` (SL-COLOR-PICKER-10).

Non sono errori, e quindi sono in `improvements.csv`:
- best practice e criteri AAA;
- test e docs mancanti;
- warning in dev mode;
- ARIA "che servirebbe" quando il risultato si ottiene già con l'API esistente;
- uso scorretto da parte del consumer;
- comportamenti che dipendono da uno specifico screen reader o browser (sezione "Da verificare con AT reali").

**Limiti dichiarati:**
- è Chromium: Firefox, Safari, NVDA, JAWS e VoiceOver non sono stati provati;
- CDP non espone `aria-current`, quindi per quell'attributo la prova è il DOM più la struttura dell'albero;
- il file chooser e il drag nativo non sono simulabili.

## In sintesi

- **77/77 componenti riverificati.** Esiti: **14 ❌** (almeno un Blocker o Alta), **42 ⚠️** (solo Media/Bassa, oppure verifiche AT aperte), **21 ✅**.
- **117 errori reali:** 2 Blocker · 17 Alta · 65 Media · 33 Bassa. La v1 riportava 470 finding (4 Blocker · 38 Alta · 146 Media · 208 Bassa · 74 Suggerimento).
- **Esito dei 470 finding v1:**

  | Esito | Quanti | Significato |
  |---|---|---|
  | confermati | 71 | stesso problema, stessa severità |
  | ridimensionati | 38 | errore reale, severità cambiata |
  | riclassificati | 339 | non sono errori: miglioramenti, consumer o da verificare con AT |
  | scartati | 22 | falsi |

  A questi si aggiungono **11 errori nuovi**, non trovati dalla v1 e scoperti con lo smoke test runtime.
- **I 2 Blocker:**
  - **`sl-table`:** l'ordinamento non funziona da tastiera. Enter e Space sull'header non cambiano `aria-sort`, il click sì.
  - **`sl-tag`:** un tag removable non si può rimuovere da tastiera. Il Tab salta il bottone "Remove" e Delete/Backspace non fanno nulla.

  Gli altri due Blocker v1 sono scesi ad Alta:
  - `sl-copy-button`: esiste un workaround tramite slot, verificato, che dà `button "Copia link"`;
  - `sl-selectable-item`: resta il più grave del componente, ma non blocca tutto il componente.

### Correzioni a quanto affermato in precedenza

La v1 e alcune mie conferme "da codice" contenevano errori che la v2 ha smentito a runtime:

| Affermazione precedente | Realtà verificata |
|---|---|
| `sl-button` "non può ricevere `aria-label`" (SL-BUTTON-01, Alta) | Il nome arriva dal testo nello slot (`button "Salva"`) e dall'icona con `label` (`button "Impostazioni"`). Nessun uso documentato richiede `aria-pressed`/`aria-expanded` fuori da `sl-dropdown`. **Riclassificato.** |
| `sl-checkbox` indeterminate esposto come `false` (SL-CHECKBOX-01, Alta) | Chromium ignora `aria-checked="false"` sull'input nativo ed espone `checked="mixed"`. **Scartato**; resta da verificare su Firefox/Safari. |
| `sl-tooltip` non hoverable per `pointer-events: none` (SL-TOOLTIP-02, Alta) | Con il puntatore sul corpo del tooltip, `open` resta `true` e si chiude solo allontanandosi. **Scartato** (1.4.13 rispettato). |
| Mancanza di `aria-invalid` nei form control (Alta) | checkbox, switch e range espongono `invalid="true"` dall'input nativo. Con `required` vuoto Chromium espone `invalid="false"` anche per un `<input>` nativo, quindi il comportamento è identico al nativo. **Riclassificato** come miglioramento. |
| Focus ring dei form control a 1.55:1 (SHARED-01) | Il bordo con focus ha 3.10:1, sufficiente per 1.4.11/2.4.7. **Miglioramento** (2.4.13 è AAA). |

## Azioni prioritarie — problemi critici

Sono i **19 errori critici** (2 Blocker + 17 Alta) in 14 componenti, da correggere per primi. Sono tutti riprodotti in Chromium; la prova di ciascuno è nella colonna `proof` di [findings.csv](findings.csv).

Sforzo: **S** = poche ore; **M** = 1–3 giorni, perché richiede di rivedere il funzionamento del componente.

### Blocker: la funzione non si può usare da tastiera

| # | ID | Componente | Problema | Dove | Azione | Criterio | Sforzo |
|---|---|---|---|---|---|---|---|
| 1 | SL-TABLE-01 | `sl-table` | L'ordinamento delle colonne funziona solo col mouse: Enter e Space sull'intestazione non fanno nulla | [table.component.ts:621](../src/components/table/table.component.ts#L621) | `<button>` dentro l'intestazione, oppure gestire Enter/Space in `handleKeyDown` | 2.1.1 | S |
| 2 | SL-TAG-01 | `sl-tag` | Un tag rimovibile non si rimuove da tastiera: il Tab salta "Remove" e Delete/Backspace non fanno nulla | [tag.component.ts:70](../src/components/tag/tag.component.ts#L70) | Togliere `tabindex="-1"`, lasciandolo solo per i tag dentro `sl-select` | 2.1.1 | S |

### Alta — funzioni non usabili da tastiera o col puntatore

| # | ID | Componente | Problema | Dove | Azione | Criterio | Sforzo |
|---|---|---|---|---|---|---|---|
| 3 | SL-TAB-01 | `sl-tab` | Una tab chiudibile non si chiude da tastiera: la X è fuori dal Tab e Delete non è gestito | [tab-group.component.ts:203-268](../src/components/tab-group/tab-group.component.ts#L203-L268) | Gestire Delete nel gruppo ed emettere `sl-close` | 2.1.1 | S |
| 4 | SL-ANIMATED-IMAGE-01 | `sl-animated-image` | Play/pausa solo col click: niente focus, nome o stato | [animated-image.component.ts:93](../src/components/animated-image/animated-image.component.ts#L93) | Rendere il controllo un `<button>` con nome | 2.1.1, 4.1.2 | S |
| 5 | SL-DRAWER-02 | `sl-drawer` | Se il drawer viene rimosso dal DOM mentre è aperto, il Tab resta bloccato su tutta la pagina | [drawer.component.ts:131-135](../src/components/drawer/drawer.component.ts#L131-L135) | `this.modal.deactivate()` in `disconnectedCallback` | 2.1.2 | S |
| 6 | SL-IMAGE-COMPARER-02 | `sl-image-comparer` | La posizione cambia col puntatore solo trascinando, nessun click alternativo | [image-comparer.component.ts:127-135](../src/components/image-comparer/image-comparer.component.ts#L127-L135) | Il click sull'immagine sposta la posizione | 2.5.7 | M |
| 7 | SL-SPLIT-PANEL-02 | `sl-split-panel` | Il ridimensionamento col puntatore avviene solo trascinando | [split-panel.component.ts:356-357](../src/components/split-panel/split-panel.component.ts#L356-L357) | Click o doppio click per chiudere/aprire | 2.5.7 | M |

### Alta — controlli senza nome accessibile

| # | ID | Componente | Problema | Dove | Azione | Criterio | Sforzo |
|---|---|---|---|---|---|---|---|
| 8 | SL-COPY-BUTTON-01 | `sl-copy-button` | Il bottone non ha nome: lo screen reader dice solo "pulsante" | [copy-button.component.ts:274-283](../src/components/copy-button/copy-button.component.ts#L274-L283) | `aria-label=${copyLabel}` sul `<button>`; togliere `ignoredRules: ['button-name']` dal test | 4.1.2 | S |
| 9 | SL-SELECTABLE-ITEM-01 | `sl-selectable-item` | La checkbox interna non ha nome, perché il testo sta fuori | [selectable-item.component.ts:72-83](../src/components/selectable-item/selectable-item.component.ts#L72-L83) | Mettere lo slot del testo dentro `sl-checkbox` | 4.1.2 | S |
| 10 | SL-TABLE-02 | `sl-table` | La property `label` della tabella non viene mai applicata | [table.component.ts:122-123](../src/components/table/table.component.ts#L122-L123) | Applicarla come `aria-label` sull'host | 4.1.2 | S |
| 11 | SL-TABLE-03 | `sl-table` | Il select "righe per pagina" non ha nome | [table.component.ts:815-825](../src/components/table/table.component.ts#L815-L825) | Passare `label` a `sl-select` | 4.1.2 | S |
| 12 | SL-TABLE-17 | `sl-table` | La checkbox "seleziona tutto" non ha nome | [table.component.ts:595-597](../src/components/table/table.component.ts#L595-L597) | Mettere la label nello slot di `sl-checkbox` (anche visivamente nascosta) | 4.1.2 | S |
| 13 | SL-IMAGE-COMPARER-01 | `sl-image-comparer` | La maniglia è esposta come `scrollbar` verticale e senza nome | [image-comparer.component.ts:136-145](../src/components/image-comparer/image-comparer.component.ts#L136-L145) | `role="slider"` orizzontale con property `label` | 4.1.2 | M |
| 14 | SL-TOOLTIP-01 | `sl-tooltip` | Il testo del tooltip non viene associato al trigger, quindi lo screen reader non lo legge | [tooltip.component.ts:283](../src/components/tooltip/tooltip.component.ts#L283) | Descrizione impostata sul trigger reale | 1.3.1, 4.1.2 | M |

### Alta — focus perso o non visibile

| # | ID | Componente | Problema | Dove | Azione | Criterio | Sforzo |
|---|---|---|---|---|---|---|---|
| 15 | SL-COPY-BUTTON-V01 | `sl-copy-button` | Arrivando con Tab il focus entra e finisce subito su `body` | [copy-button.component.ts:137-145](../src/components/copy-button/copy-button.component.ts#L137-L145) | Attendere il render del tooltip prima di chiamare `focus()` | 2.4.3 | S |
| 16 | SL-MENU-ITEM-02 | `sl-menu-item` | L'elemento con focus si riconosce solo da uno sfondo a 1.14:1 (light) e 2.51:1 (dark) | [menu-item.styles.ts:104-120](../src/components/menu-item/menu-item.styles.ts#L104-L120) | `outline` su `:focus-visible` | 1.4.11, 2.4.7 | S |
| 17 | SL-HEADER-03 | `sl-header` | A 320px la navigazione è larga 0px: le voci sono invisibili anche col focus | [header.styles.ts:15-28](../src/components/header/header.styles.ts#L15-L28) | Layout responsive (a capo o menu overflow) | 1.4.10, 2.4.7 | M |

### Alta — informazioni solo visive o in movimento

| # | ID | Componente | Problema | Dove | Azione | Criterio | Sforzo |
|---|---|---|---|---|---|---|---|
| 18 | SL-RATING-01 | `sl-rating` | Il valore si distingue solo dal colore: stelle attive a 2.15:1, attive e inattive a 1.38:1 tra loro | [rating.styles.ts:5-46](../src/components/rating/rating.styles.ts#L5-L46) | Colori ≥3:1 e stella inattiva disegnata come contorno | 1.4.11, 1.4.1 | S |
| 19 | SL-CAROUSEL-01 | `sl-carousel` | L'autoplay non ha un pulsante di stop e non si ferma con reduced motion | [autoplay-controller.ts:23-30](../src/components/carousel/autoplay-controller.ts#L23-L30) | Pulsante play/pausa e niente autoplay con reduced motion | 2.2.2 | M |

**Sforzo complessivo:** 13 azioni S e 6 azioni M. Un componente esce dallo stato ❌ quando tutte le sue azioni critiche sono chiuse; per `sl-table` sono 4 (#1, #10, #11, #12). Dopo queste azioni, gli interventi successivi sono in §3.

## 1. Tabella riepilogativa

Colonne: errori verificati per severità; poi miglioramenti, responsabilità del consumer e verifiche con AT reali (da `improvements.csv`).

| Componente | Esito | Blocker | Alta | Media | Bassa | Errori | Miglioramenti | Consumer | Da verificare AT |
|---|---|---|---|---|---|---|---|---|---|
| [`sl-alert`](components/sl-alert.md) | ⚠️ | 0 | 0 | 2 | 0 | **2** | 8 | 1 | 1 |
| [`sl-animated-image`](components/sl-animated-image.md) | ❌ | 0 | 1 | 1 | 0 | **2** | 4 | 2 | 1 |
| [`sl-animation`](components/sl-animation.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 3 | 1 | 0 |
| [`sl-avatar`](components/sl-avatar.md) | ⚠️ | 0 | 0 | 2 | 0 | **2** | 3 | 1 | 0 |
| [`sl-badge`](components/sl-badge.md) | ⚠️ | 0 | 0 | 1 | 1 | **2** | 3 | 1 | 1 |
| [`sl-breadcrumb-item`](components/sl-breadcrumb-item.md) | ⚠️ | 0 | 0 | 2 | 2 | **4** | 3 | 1 | 1 |
| [`sl-breadcrumb`](components/sl-breadcrumb.md) | ⚠️ | 0 | 0 | 0 | 0 | **0** | 4 | 1 | 0 |
| [`sl-button-group`](components/sl-button-group.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 5 | 1 | 0 |
| [`sl-button`](components/sl-button.md) | ⚠️ | 0 | 0 | 0 | 0 | **0** | 7 | 1 | 2 |
| [`sl-card`](components/sl-card.md) | ⚠️ | 0 | 0 | 1 | 0 | **1** | 1 | 2 | 0 |
| [`sl-carousel-item`](components/sl-carousel-item.md) | ⚠️ | 0 | 0 | 0 | 0 | **0** | 2 | 1 | 1 |
| [`sl-carousel`](components/sl-carousel.md) | ❌ | 0 | 1 | 3 | 0 | **4** | 8 | 2 | 1 |
| [`sl-checkbox`](components/sl-checkbox.md) | ⚠️ | 0 | 0 | 0 | 2 | **2** | 8 | 0 | 1 |
| [`sl-color-picker`](components/sl-color-picker.md) | ⚠️ | 0 | 0 | 2 | 3 | **5** | 9 | 1 | 1 |
| [`sl-comment`](components/sl-comment.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 4 | 1 | 0 |
| [`sl-copy-button`](components/sl-copy-button.md) | ❌ | 0 | 2 | 1 | 0 | **3** | 4 | 0 | 1 |
| [`sl-description-list-item`](components/sl-description-list-item.md) | ⚠️ | 0 | 0 | 1 | 1 | **2** | 1 | 0 | 0 |
| [`sl-description-list`](components/sl-description-list.md) | ⚠️ | 0 | 0 | 0 | 1 | **1** | 3 | 1 | 1 |
| [`sl-detail-panel`](components/sl-detail-panel.md) | ⚠️ | 0 | 0 | 1 | 1 | **2** | 6 | 1 | 1 |
| [`sl-details`](components/sl-details.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 5 | 1 | 0 |
| [`sl-dialog`](components/sl-dialog.md) | ⚠️ | 0 | 0 | 1 | 1 | **2** | 9 | 1 | 2 |
| [`sl-divider`](components/sl-divider.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 2 | 1 | 0 |
| [`sl-drawer`](components/sl-drawer.md) | ❌ | 0 | 1 | 3 | 1 | **5** | 6 | 2 | 2 |
| [`sl-dropdown`](components/sl-dropdown.md) | ⚠️ | 0 | 0 | 2 | 0 | **2** | 6 | 2 | 2 |
| [`sl-empty-state`](components/sl-empty-state.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 3 | 1 | 0 |
| [`sl-file-drop`](components/sl-file-drop.md) | ⚠️ | 0 | 0 | 1 | 0 | **1** | 5 | 2 | 1 |
| [`sl-file-upload-item`](components/sl-file-upload-item.md) | ⚠️ | 0 | 0 | 2 | 0 | **2** | 5 | 4 | 1 |
| [`sl-format-bytes`](components/sl-format-bytes.md) | ⚠️ | 0 | 0 | 0 | 1 | **1** | 1 | 0 | 1 |
| [`sl-format-date`](components/sl-format-date.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 1 | 0 | 0 |
| [`sl-format-number`](components/sl-format-number.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 1 | 0 | 0 |
| [`sl-header-item`](components/sl-header-item.md) | ⚠️ | 0 | 0 | 1 | 2 | **3** | 4 | 1 | 1 |
| [`sl-header`](components/sl-header.md) | ❌ | 0 | 1 | 0 | 0 | **1** | 4 | 1 | 1 |
| [`sl-icon-button`](components/sl-icon-button.md) | ⚠️ | 0 | 0 | 1 | 0 | **1** | 6 | 2 | 0 |
| [`sl-icon`](components/sl-icon.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 5 | 2 | 0 |
| [`sl-image-comparer`](components/sl-image-comparer.md) | ❌ | 0 | 2 | 0 | 0 | **2** | 3 | 1 | 1 |
| [`sl-include`](components/sl-include.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 2 | 2 | 0 |
| [`sl-input`](components/sl-input.md) | ⚠️ | 0 | 0 | 3 | 3 | **6** | 8 | 1 | 1 |
| [`sl-menu-item`](components/sl-menu-item.md) | ❌ | 0 | 1 | 2 | 1 | **4** | 5 | 1 | 1 |
| [`sl-menu-label`](components/sl-menu-label.md) | ⚠️ | 0 | 0 | 2 | 0 | **2** | 2 | 0 | 1 |
| [`sl-menu`](components/sl-menu.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 5 | 0 | 0 |
| [`sl-mutation-observer`](components/sl-mutation-observer.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 1 | 0 | 0 |
| [`sl-option`](components/sl-option.md) | ⚠️ | 0 | 0 | 2 | 1 | **3** | 4 | 1 | 1 |
| [`sl-popup`](components/sl-popup.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 3 | 1 | 0 |
| [`sl-progress-bar`](components/sl-progress-bar.md) | ⚠️ | 0 | 0 | 1 | 0 | **1** | 5 | 1 | 1 |
| [`sl-progress-ring`](components/sl-progress-ring.md) | ⚠️ | 0 | 0 | 0 | 0 | **0** | 6 | 0 | 1 |
| [`sl-qr-code`](components/sl-qr-code.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 2 | 2 | 0 |
| [`sl-radio-button`](components/sl-radio-button.md) | ⚠️ | 0 | 0 | 0 | 0 | **0** | 6 | 0 | 1 |
| [`sl-radio-group`](components/sl-radio-group.md) | ⚠️ | 0 | 0 | 1 | 0 | **1** | 9 | 1 | 1 |
| [`sl-radio`](components/sl-radio.md) | ⚠️ | 0 | 0 | 0 | 1 | **1** | 4 | 1 | 1 |
| [`sl-range`](components/sl-range.md) | ⚠️ | 0 | 0 | 1 | 1 | **2** | 4 | 1 | 1 |
| [`sl-rating`](components/sl-rating.md) | ❌ | 0 | 1 | 0 | 0 | **1** | 7 | 1 | 1 |
| [`sl-relative-time`](components/sl-relative-time.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 1 | 1 | 0 |
| [`sl-resize-observer`](components/sl-resize-observer.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 1 | 0 | 0 |
| [`sl-select`](components/sl-select.md) | ⚠️ | 0 | 0 | 4 | 3 | **7** | 12 | 1 | 3 |
| [`sl-selectable-item`](components/sl-selectable-item.md) | ❌ | 0 | 1 | 2 | 0 | **3** | 2 | 1 | 1 |
| [`sl-sidebar-group`](components/sl-sidebar-group.md) | ⚠️ | 0 | 0 | 1 | 0 | **1** | 4 | 1 | 1 |
| [`sl-sidebar-item`](components/sl-sidebar-item.md) | ⚠️ | 0 | 0 | 3 | 0 | **3** | 4 | 1 | 1 |
| [`sl-sidebar`](components/sl-sidebar.md) | ⚠️ | 0 | 0 | 1 | 0 | **1** | 4 | 1 | 1 |
| [`sl-skeleton`](components/sl-skeleton.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 3 | 1 | 0 |
| [`sl-spinner`](components/sl-spinner.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 3 | 1 | 0 |
| [`sl-split-panel`](components/sl-split-panel.md) | ❌ | 0 | 1 | 3 | 0 | **4** | 5 | 1 | 1 |
| [`sl-stat-group`](components/sl-stat-group.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 3 | 2 | 0 |
| [`sl-stat`](components/sl-stat.md) | ⚠️ | 0 | 0 | 1 | 0 | **1** | 4 | 2 | 1 |
| [`sl-status`](components/sl-status.md) | ⚠️ | 0 | 0 | 0 | 1 | **1** | 2 | 2 | 0 |
| [`sl-step`](components/sl-step.md) | ⚠️ | 0 | 0 | 0 | 0 | **0** | 4 | 0 | 0 |
| [`sl-stepper`](components/sl-stepper.md) | ⚠️ | 0 | 0 | 1 | 0 | **1** | 2 | 1 | 1 |
| [`sl-switch`](components/sl-switch.md) | ⚠️ | 0 | 0 | 1 | 1 | **2** | 6 | 0 | 1 |
| [`sl-tab-group`](components/sl-tab-group.md) | ⚠️ | 0 | 0 | 0 | 0 | **0** | 6 | 1 | 2 |
| [`sl-tab-panel`](components/sl-tab-panel.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 2 | 0 | 0 |
| [`sl-tab`](components/sl-tab.md) | ❌ | 0 | 1 | 0 | 1 | **2** | 4 | 1 | 2 |
| [`sl-table`](components/sl-table.md) | ❌ | 1 | 3 | 4 | 0 | **8** | 9 | 1 | 1 |
| [`sl-tag`](components/sl-tag.md) | ❌ | 1 | 0 | 1 | 0 | **2** | 3 | 1 | 0 |
| [`sl-textarea`](components/sl-textarea.md) | ⚠️ | 0 | 0 | 1 | 3 | **4** | 7 | 1 | 1 |
| [`sl-tooltip`](components/sl-tooltip.md) | ❌ | 0 | 1 | 1 | 0 | **2** | 4 | 1 | 1 |
| [`sl-tree-item`](components/sl-tree-item.md) | ⚠️ | 0 | 0 | 1 | 1 | **2** | 3 | 1 | 2 |
| [`sl-tree`](components/sl-tree.md) | ⚠️ | 0 | 0 | 0 | 0 | **0** | 7 | 1 | 1 |
| [`sl-visually-hidden`](components/sl-visually-hidden.md) | ✅ | 0 | 0 | 0 | 0 | **0** | 2 | 0 | 1 |
| **Totale** | | **2** | **17** | **65** | **33** | **117** | **332** | **77** | **58** |

## 2. Problemi trasversali dimostrati

| # | Problema dimostrato | Prova tipo (runtime) | Componenti |
|---|---|---|---|
| P1 | **Controlli secondari non raggiungibili da tastiera e senza tasto alternativo** (`tabindex="-1"`, nessun Delete/Backspace) | `focus:#a ;; tab` → il remove/close viene saltato; Delete non emette eventi | tag (Blocker), tab (close), input (toggle password), select (clear) |
| P2 | **Azioni attivabili solo con il mouse** | Enter/Space senza effetto; nessun `button` nell'albero | table (sort), animated-image (play/pausa), sidebar-item e header-item senza `href` (`<a>` senza `href`, saltato dal Tab), color-picker (swatch con Space) |
| P3 | **Controlli senza nome accessibile nell'uso di default** | Chromium espone `checkbox`/`button`/`combobox`/`textbox` senza nome | copy-button, selectable-item, table (`label`, select-all, page-size, checkbox riga), image-comparer (handle), tree-item (checkbox multiselect), input/textarea con solo placeholder (il `<label>` vuoto blocca il fallback nativo) |
| P4 | **Focus perso su `body`** quando il componente rimonta o rimuove l'elemento focalizzato | `focus` → `body` dopo l'azione | copy-button (al primo Tab), file-drop (rimozione file), file-upload-item (Retry), stepper (passo completato), radio-group (dopo `reportValidity`), menu-item (Esc nel sottomenu), dropdown/tooltip (Esc senza CloseWatcher) |
| P5 | **Esc chiude anche il `sl-dialog` genitore** (fallback senza `CloseWatcher`: listener su `document` con solo `stopPropagation`) | simulato con `delete window.CloseWatcher` | dropdown, tooltip (Firefox e Safari reali da verificare) |
| P6 | **Stato ARIA assente o sull'elemento sbagliato** | `menuitem "Find"` senza `expanded`; trigger `[null,null]` prima della prima apertura | menu-item (submenu), dropdown e header-item (`aria-expanded`/`aria-haspopup` solo dopo la prima apertura), select (`required=false` sul combobox), progress-bar (indeterminate con `value="0"`), badge (`role=status` esclude il numero dal nome del bottone: `button "Messages"`), tooltip (trigger senza descrizione) |
| P7 | **Riferimenti ID tra light DOM e shadow root non risolti** | `aria-labelledby`/`aria-controls` senza target | carousel (tabpanel senza nome), tooltip (`aria-describedby` sullo slot) |
| P8 | **Focus o stato invisibile in `forced-colors`** (indicatori basati su background o box-shadow) | bordo `rgb(0,0,0)` con e senza focus, `outline: none` | input, textarea, select, option, table (selezione), carousel (dot), split-panel (divisore), drawer (pannello focusabile), header-item |
| P9 | **Contrasto insufficiente**, quasi sempre **solo in dark** | `contrast:` sui colori renderizzati | in dark: switch (2.18:1), alert e tag (close 2.47:1), avatar, stat (selezionato fino a 1.60:1), menu-item, menu-label, option, sidebar-group/item, detail-panel, selectable-item, table (stato vuoto). In light: rating (2.15:1), range (track 1.25:1), menu-item focus (1.14:1), icon-button accent, file-upload-item, breadcrumb-item hover, input/select `filled` (placeholder 4.26:1) |
| P10 | **Reflow a 320px**: testo troncato o navigazione invisibile | `--viewport 320x640` | header (Alta: nav largo 0px), dialog/drawer (titolo), card, selectable-item, tree-item, breadcrumb-item, description-list-item, menu-item |
| P11 | **Alternativa al trascinamento assente** (2.5.7) | click sulla posizione: valore invariato | image-comparer, split-panel |
| P12 | **Movimento automatico senza stop** (2.2.2) | rotazione o animazione infinita che continua anche con reduced motion | carousel (autoplay, Alta), animated-image, badge (pulse), status (pulse) |
| P13 | **Target sotto 24px senza eccezione applicabile** (2.5.8) | `size:` 16–21px impilati senza spacing | checkbox, radio, switch, tab (close 18×18), select, breadcrumb-item (a capo a 320px) |
| P14 | **Lingua non esposta** (3.1.2): `lang`/`dir` impostati via property non diventano attributo; stringhe a11y hardcoded in inglese | `el.lang='de'` → `getAttribute('lang') === null` | format-bytes (e tutti i formatter), sidebar ("Collapse/Expand sidebar"), color-picker ("hue", "alpha") |

## 3. Interventi prioritizzati (quick win → refactor)

Sforzo: S = ore, M = 1–3 giorni, L = settimane. Ogni intervento chiude errori verificati.

Questa lista raggruppa gli interventi per tipo di correzione e include anche gli errori Media e Bassa. Le 19 azioni critiche della sezione [Azioni prioritarie](#azioni-prioritarie--problemi-critici) vengono prima e sono comprese negli interventi 1–6, 11 (rating), 13 (header) e 15.

| # | Intervento | Chiude | Sforzo |
|---|---|---|---|
| 1 | `sl-table`: Enter/Space sugli header ordinabili (o `<button>` dentro `columnheader`); applicare la property `label`; nome per select-all, checkbox di riga e page-size | SL-TABLE-01 (Blocker), -02, -03, -17 | S |
| 2 | `sl-tag`, `sl-tab` closable: remove/close raggiungibili (togliere `tabindex="-1"`) oppure Delete/Backspace sull'host | SL-TAG-01 (Blocker), SL-TAB-01 | S |
| 3 | `sl-copy-button`: `aria-label=${copyLabel}` sul `<button>`; correggere la ricreazione lazy del tooltip che fa perdere il focus | SL-COPY-BUTTON-01, -V01 | S |
| 4 | `sl-selectable-item`: testo dentro lo slot di `sl-checkbox` (fix provato: `checkbox "Statement of Work.pdf"`) | SL-SELECTABLE-ITEM-01 | S |
| 5 | `sl-drawer`: `this.modal.deactivate()` in `disconnectedCallback`; niente `aria-modal` con `contained` | SL-DRAWER-02, -01 | S |
| 6 | `sl-menu-item`: `outline` su `:focus-visible`; `aria-haspopup`/`aria-expanded` sull'host `menuitem` | SL-MENU-ITEM-02, -01 | S |
| 7 | `sl-dropdown`: impostare `aria-haspopup`/`aria-expanded="false"` al primo render del trigger; Esc in capture con `preventDefault` (anche nel tooltip) | SL-DROPDOWN-V01, -03, SL-HEADER-ITEM-V01, SL-TOOLTIP-03 | S |
| 8 | `sl-input`/`sl-textarea`: non rendere `<label for>` vuoto senza label (ripristina il nome da placeholder); toggle password raggiungibile | SL-INPUT-01, -04, SL-TEXTAREA-01 | S |
| 9 | `sl-badge`: niente `role="status"` di default (o opzionale) | SL-BADGE-V01 | S |
| 10 | `ShoelaceElement`: `reflect: true` su `lang` e `dir` | SL-FORMAT-BYTES-01 / SHARED-07 | S |
| 11 | Token dark: icona close su tint, track/thumb switch, testo secondario `neutral-500`, label stat selezionato, contatori sidebar; light: rating, track range, focus menu-item | P9 (32 errori) | S–M |
| 12 | `@media (forced-colors: active)` con `outline` sul focus e sugli stati selezionati | P8 | M |
| 13 | Reflow: niente `nowrap`+ellipsis su testo essenziale; header responsive | P10, SL-HEADER-03 | M |
| 14 | `sl-sidebar-item`/`sl-header-item` senza `href`: rendere `<button>` | P2 | M |
| 15 | Widget composti secondo APG: carousel (stop autoplay, nomi dei tabpanel), image-comparer (`slider` con nome, click per posizionare), split-panel (`aria-orientation`, click), tooltip (descrizione sul trigger), animated-image (`<button>` play/pausa) | P7, P11, P12, SL-TOOLTIP-01 | M–L |
| 16 | Refactor di piattaforma (`ElementInternals`, `delegatesFocus`, passthrough ARIA): **non è un errore in sé**. È consigliato perché elimina alla radice P3, P6 e P7 | — (miglioramento) | L |

## 4. Definition of Done a11y per i nuovi componenti

- [ ] Elemento nativo dove esiste; `role` custom solo con un pattern APG citato e con tutti gli stati richiesti, **verificati nell'albero a11y**, non solo nel DOM.
- [ ] Nome accessibile disponibile nell'uso di default; per i componenti icon-only, property `label` obbligatoria con warning in dev mode. Nessun `<label>` vuoto che blocchi il fallback nativo.
- [ ] Ogni funzione operabile da tastiera; nessun controllo con `tabindex="-1"` senza tasto alternativo; Esc gestito in capture senza chiudere gli overlay genitori.
- [ ] Il focus non si perde mai su `body` dopo un'azione (rimozione, ri-render, chiusura): viene restituito al trigger o all'elemento successivo.
- [ ] Focus visibile anche in `forced-colors` (`outline`, non solo box-shadow/background).
- [ ] Contrasti misurati sui colori renderizzati in **light e dark**: testo 4.5:1, UI e stati 3:1.
- [ ] Reflow a 320px senza perdita di contenuto; target ≥24px o spacing conforme.
- [ ] Niente movimento automatico senza un controllo di stop; alternativa a puntatore singolo per ogni trascinamento.
- [ ] Stringhe a11y tramite `LocalizeController`; `lang`/`dir` riflessi.
- [ ] Test: `expect(el).to.be.accessible()` senza `ignoredRules` non giustificati, più un test runtime dell'albero a11y e della tastiera per ogni stato. Lo stesso harness usato qui è riutilizzabile come base.

## 5. Piano di test manuale consigliato

Questi test servono per ciò che Chromium non può dimostrare; l'elenco puntuale è in `improvements.csv`, `type = da-verificare-AT` (58 voci).

**Matrice:**
- NVDA + Firefox e JAWS + Chrome (Windows);
- VoiceOver + Safari (macOS e iOS);
- Windows High Contrast reale;
- solo tastiera su Firefox e Safari (CloseWatcher assente: P5).

**Ordine:**
1. I 14 componenti ❌, partendo da table, tag, copy-button, selectable-item, drawer e tooltip.
2. I componenti con voci "da verificare con AT" sul comportamento del browser: checkbox indeterminate su Firefox/Safari; annuncio dei live region di copy-button, alert e range; `aria-current` in breadcrumb, sidebar, header e stepper (non esposto da CDP).
3. Form (input, select, textarea, radio-group): annuncio di nome, required ed errori su ogni AT.

## 6. Copertura di test e documentazione (fatti verificati, non errori)

- **Senza test axe (22):** color-picker, dialog, drawer, dropdown, format-bytes, format-date, format-number, icon-button, image-comparer, include, menu, mutation-observer, popup, radio-button, radio-group, radio, resize-observer (nessun file di test), step, tag, tooltip, tree-item, visually-hidden.
- **`ignoredRules` che nascondono errori ora verificati:**
  - `button-name` in [copy-button.test.ts:6](../src/components/copy-button/copy-button.test.ts#L6), che nasconde SL-COPY-BUTTON-01;
  - `aria-valid-attr-value` in [carousel.test.ts:789](../src/components/carousel/carousel.test.ts#L789), che nasconde i riferimenti del carousel;
  - `color-contrast` in avatar, badge e breadcrumb.
- Nessuna pagina docs ha una sezione "Accessibilità"; `sl-description-list-item` non ha una pagina.
- I test axe coprono solo il DOM iniziale: nessuno degli errori di tastiera e di focus (P1, P2, P4, P5) sarebbe stato intercettato.

## 7. Bug funzionali emersi (non a11y, da girare al team)

- `sl-table`: "Next page" emette `page:2` e subito `page:1`, e la pagina resta 1 anche con il mouse (report sl-table).
- `sl-detail-panel`: senza listener, il close imposta `hidden` ma `:host { display: flex }` lo annulla e il pannello resta visibile.
- `sl-alert`: `open` + `duration` + `countdown` insieme lanciano un TypeError.
- `src/internal/form.ts:237-251`: con più controlli invalidi il focus va al primo listener registrato, non al primo controllo invalido nel DOM.
- `@watch('iterationsStart')` in [animation.component.ts:171](../src/components/animation/animation.component.ts#L171) e nomi di attributo nei `@watch` di [mutation-observer.component.ts:103-105](../src/components/mutation-observer/mutation-observer.component.ts#L103-L105).

## 8. Verifica di completezza (Fase 4)

| Controllo | Valore |
|---|---|
| Componenti rilevati nel codice (esclusi i `*.test.ts`) | **77** |
| Righe dell'inventario | **77** (tutte ☑) |
| Report riscritti nel formato v2 | **77** |
| Finding v1 con un esito in `triage-v1.csv` | **470/470** (nessuno mancante, sconosciuto o duplicato) |
| Errori in `findings.csv` | 117 (ID univoci, severità valide, 115 prove runtime e 2 da codice) |
| Voci in `improvements.csv` | 467 (332 miglioramenti, 77 consumer, 58 da verificare con AT) |
| Coerenza tra esito ed errori di ogni report | verificata (nessun ❌ senza Blocker/Alta, nessun ✅ con errori) |
| Esclusi | 3 elementi definiti solo nei test (fixture); wrapper React generati |

## File prodotti

- [99-summary.md](99-summary.md): questo documento
- [findings.csv](findings.csv): errori verificati, con colonne `proof_type`/`proof`
- [improvements.csv](improvements.csv): non errori
- [triage-v1.csv](triage-v1.csv): destino di ogni finding v1
- [components/](components/): 77 report v2
- [00-inventory.md](00-inventory.md), [01-shared-context.md](01-shared-context.md) (con la revisione v2 dei `SHARED-*`)
- [_parts/](_parts/): CSV per gruppo, v1 e v2; [_archive/v1/](_archive/v1/): versione precedente completa

L'harness runtime è in `/private/tmp/claude-502/-Users-enzo-masciulli-Desktop-Progetti-sai-che-ui/b9e70c14-0a0a-467c-9747-15e9fea2ed29/scratchpad/harness/`; è una cartella temporanea, fuori dal repo.
