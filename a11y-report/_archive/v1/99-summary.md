# 99 — Riepilogo audit accessibilità (WCAG 2.2 AA · WAI-ARIA 1.2 · APG)

Design System: fork di Shoelace 2.20.1 (Lit 3.2.1, prefisso `sl-`). Data: 2026-11-12. Fonte: [findings.csv](findings.csv) (470 righe) e [components/](components/) (77 report). Contesto trasversale: [01-shared-context.md](01-shared-context.md). Inventario: [00-inventory.md](00-inventory.md).

**Metodo:** analisi statica del codice (componente, stili, test, docs). Nessun test eseguito con screen reader o browser. I contrasti sono calcolati dai token reali di `src/themes/light.css` e `dark.css`. Ciò che dipende dal runtime o dal consumer è marcato "NON VERIFICABILE" nei singoli report.

## In sintesi

- **77/77 componenti analizzati.** Esiti: **13 ❌ non conformi**, **62 ⚠️ parzialmente conformi**, **2 ✅ conformi** (`sl-mutation-observer` e `sl-resize-observer`, utility senza semantica). Quattro componenti senza difetti nel codice (`sl-popup`, `sl-status`, `sl-tab-panel`, `sl-visually-hidden`) restano ⚠️ perché hanno verifiche manuali aperte.
- **470 finding:** 4 Blocker · 38 Alta · 146 Media · 208 Bassa · 74 Suggerimento.
- **I 4 Blocker sono stati riverificati sul codice dal coordinatore:**
  - `sl-table`: header ordinabili attivabili solo col click.
  - `sl-tag`: il bottone di rimozione non si raggiunge con Tab.
  - `sl-copy-button`: il bottone non ha nome accessibile.
  - `sl-selectable-item`: la checkbox non ha nome.
- **Causa radice dominante:** il DS non usa `ElementInternals`, `formAssociated` e `delegatesFocus`, e nessun componente espone property `aria-*` di passthrough. Gli `aria-*` che il consumer scrive sull'host non arrivano al controllo nativo nello shadow root. Di conseguenza le label esterne non si associano, `aria-invalid` non viene mai impostato e manca un modo per il consumer di completare la semantica.

## 1. Tabella riepilogativa

| Componente | Esito | Blocker | Alta | Media | Bassa | Sugg. | Totale |
|---|---|---|---|---|---|---|---|
| [`sl-alert`](components/sl-alert.md) | ⚠️ | 0 | 2 | 3 | 3 | 1 | 9 |
| [`sl-animated-image`](components/sl-animated-image.md) | ❌ | 0 | 2 | 2 | 3 | 0 | 7 |
| [`sl-animation`](components/sl-animation.md) | ⚠️ | 0 | 0 | 2 | 1 | 0 | 3 |
| [`sl-avatar`](components/sl-avatar.md) | ⚠️ | 0 | 0 | 3 | 1 | 1 | 5 |
| [`sl-badge`](components/sl-badge.md) | ⚠️ | 0 | 0 | 3 | 1 | 1 | 5 |
| [`sl-breadcrumb-item`](components/sl-breadcrumb-item.md) | ⚠️ | 0 | 0 | 3 | 2 | 1 | 6 |
| [`sl-breadcrumb`](components/sl-breadcrumb.md) | ⚠️ | 0 | 0 | 1 | 2 | 0 | 3 |
| [`sl-button-group`](components/sl-button-group.md) | ⚠️ | 0 | 0 | 2 | 2 | 1 | 5 |
| [`sl-button`](components/sl-button.md) | ⚠️ | 0 | 1 | 3 | 3 | 1 | 8 |
| [`sl-card`](components/sl-card.md) | ⚠️ | 0 | 0 | 2 | 1 | 1 | 4 |
| [`sl-carousel-item`](components/sl-carousel-item.md) | ⚠️ | 0 | 0 | 1 | 2 | 0 | 3 |
| [`sl-carousel`](components/sl-carousel.md) | ❌ | 0 | 2 | 6 | 4 | 1 | 13 |
| [`sl-checkbox`](components/sl-checkbox.md) | ⚠️ | 0 | 1 | 4 | 3 | 1 | 9 |
| [`sl-color-picker`](components/sl-color-picker.md) | ❌ | 0 | 1 | 7 | 5 | 0 | 13 |
| [`sl-comment`](components/sl-comment.md) | ⚠️ | 0 | 0 | 1 | 3 | 1 | 5 |
| [`sl-copy-button`](components/sl-copy-button.md) | ❌ | 1 | 1 | 1 | 3 | 0 | 6 |
| [`sl-description-list-item`](components/sl-description-list-item.md) | ⚠️ | 0 | 0 | 1 | 2 | 0 | 3 |
| [`sl-description-list`](components/sl-description-list.md) | ⚠️ | 0 | 0 | 1 | 2 | 1 | 4 |
| [`sl-detail-panel`](components/sl-detail-panel.md) | ⚠️ | 0 | 1 | 3 | 2 | 1 | 7 |
| [`sl-details`](components/sl-details.md) | ⚠️ | 0 | 0 | 0 | 5 | 1 | 6 |
| [`sl-dialog`](components/sl-dialog.md) | ⚠️ | 0 | 0 | 4 | 6 | 2 | 12 |
| [`sl-divider`](components/sl-divider.md) | ⚠️ | 0 | 0 | 0 | 2 | 1 | 3 |
| [`sl-drawer`](components/sl-drawer.md) | ❌ | 0 | 2 | 4 | 5 | 1 | 12 |
| [`sl-dropdown`](components/sl-dropdown.md) | ⚠️ | 0 | 0 | 3 | 5 | 1 | 9 |
| [`sl-empty-state`](components/sl-empty-state.md) | ⚠️ | 0 | 0 | 2 | 1 | 1 | 4 |
| [`sl-file-drop`](components/sl-file-drop.md) | ⚠️ | 0 | 1 | 3 | 3 | 0 | 7 |
| [`sl-file-upload-item`](components/sl-file-upload-item.md) | ⚠️ | 0 | 1 | 4 | 3 | 1 | 9 |
| [`sl-format-bytes`](components/sl-format-bytes.md) | ⚠️ | 0 | 0 | 0 | 1 | 2 | 3 |
| [`sl-format-date`](components/sl-format-date.md) | ⚠️ | 0 | 0 | 0 | 0 | 1 | 1 |
| [`sl-format-number`](components/sl-format-number.md) | ⚠️ | 0 | 0 | 0 | 0 | 1 | 1 |
| [`sl-header-item`](components/sl-header-item.md) | ⚠️ | 0 | 1 | 0 | 3 | 1 | 5 |
| [`sl-header`](components/sl-header.md) | ⚠️ | 0 | 0 | 1 | 5 | 0 | 6 |
| [`sl-icon-button`](components/sl-icon-button.md) | ⚠️ | 0 | 1 | 4 | 2 | 1 | 8 |
| [`sl-icon`](components/sl-icon.md) | ⚠️ | 0 | 0 | 1 | 2 | 2 | 5 |
| [`sl-image-comparer`](components/sl-image-comparer.md) | ❌ | 0 | 1 | 2 | 3 | 1 | 7 |
| [`sl-include`](components/sl-include.md) | ⚠️ | 0 | 0 | 0 | 2 | 2 | 4 |
| [`sl-input`](components/sl-input.md) | ⚠️ | 0 | 3 | 3 | 6 | 1 | 13 |
| [`sl-menu-item`](components/sl-menu-item.md) | ❌ | 0 | 2 | 1 | 5 | 1 | 9 |
| [`sl-menu-label`](components/sl-menu-label.md) | ❌ | 0 | 0 | 2 | 1 | 0 | 3 |
| [`sl-menu`](components/sl-menu.md) | ⚠️ | 0 | 0 | 1 | 3 | 1 | 5 |
| [`sl-mutation-observer`](components/sl-mutation-observer.md) | ✅ | 0 | 0 | 0 | 0 | 1 | 1 |
| [`sl-option`](components/sl-option.md) | ⚠️ | 0 | 0 | 2 | 3 | 2 | 7 |
| [`sl-popup`](components/sl-popup.md) | ⚠️ | 0 | 0 | 0 | 1 | 2 | 3 |
| [`sl-progress-bar`](components/sl-progress-bar.md) | ⚠️ | 0 | 0 | 2 | 4 | 1 | 7 |
| [`sl-progress-ring`](components/sl-progress-ring.md) | ⚠️ | 0 | 0 | 1 | 4 | 1 | 6 |
| [`sl-qr-code`](components/sl-qr-code.md) | ⚠️ | 0 | 0 | 1 | 2 | 1 | 4 |
| [`sl-radio-button`](components/sl-radio-button.md) | ⚠️ | 0 | 0 | 1 | 3 | 1 | 5 |
| [`sl-radio-group`](components/sl-radio-group.md) | ⚠️ | 0 | 0 | 4 | 4 | 1 | 9 |
| [`sl-radio`](components/sl-radio.md) | ⚠️ | 0 | 0 | 1 | 4 | 1 | 6 |
| [`sl-range`](components/sl-range.md) | ⚠️ | 0 | 0 | 2 | 5 | 1 | 8 |
| [`sl-rating`](components/sl-rating.md) | ⚠️ | 0 | 1 | 2 | 4 | 2 | 9 |
| [`sl-relative-time`](components/sl-relative-time.md) | ⚠️ | 0 | 0 | 0 | 0 | 2 | 2 |
| [`sl-resize-observer`](components/sl-resize-observer.md) | ✅ | 0 | 0 | 0 | 0 | 1 | 1 |
| [`sl-select`](components/sl-select.md) | ❌ | 0 | 4 | 6 | 6 | 2 | 18 |
| [`sl-selectable-item`](components/sl-selectable-item.md) | ❌ | 1 | 0 | 2 | 1 | 1 | 5 |
| [`sl-sidebar-group`](components/sl-sidebar-group.md) | ⚠️ | 0 | 0 | 1 | 3 | 1 | 5 |
| [`sl-sidebar-item`](components/sl-sidebar-item.md) | ⚠️ | 0 | 1 | 2 | 3 | 0 | 6 |
| [`sl-sidebar`](components/sl-sidebar.md) | ⚠️ | 0 | 0 | 1 | 3 | 0 | 4 |
| [`sl-skeleton`](components/sl-skeleton.md) | ⚠️ | 0 | 0 | 1 | 2 | 1 | 4 |
| [`sl-spinner`](components/sl-spinner.md) | ⚠️ | 0 | 0 | 2 | 2 | 0 | 4 |
| [`sl-split-panel`](components/sl-split-panel.md) | ⚠️ | 0 | 0 | 4 | 4 | 1 | 9 |
| [`sl-stat-group`](components/sl-stat-group.md) | ⚠️ | 0 | 0 | 0 | 2 | 2 | 4 |
| [`sl-stat`](components/sl-stat.md) | ⚠️ | 0 | 1 | 1 | 3 | 1 | 6 |
| [`sl-status`](components/sl-status.md) | ⚠️ | 0 | 0 | 0 | 2 | 2 | 4 |
| [`sl-step`](components/sl-step.md) | ⚠️ | 0 | 0 | 0 | 3 | 1 | 4 |
| [`sl-stepper`](components/sl-stepper.md) | ⚠️ | 0 | 0 | 1 | 2 | 0 | 3 |
| [`sl-switch`](components/sl-switch.md) | ⚠️ | 0 | 0 | 4 | 3 | 1 | 8 |
| [`sl-tab-group`](components/sl-tab-group.md) | ⚠️ | 0 | 0 | 3 | 3 | 1 | 7 |
| [`sl-tab-panel`](components/sl-tab-panel.md) | ⚠️ | 0 | 0 | 0 | 0 | 2 | 2 |
| [`sl-tab`](components/sl-tab.md) | ⚠️ | 0 | 1 | 2 | 2 | 0 | 5 |
| [`sl-table`](components/sl-table.md) | ❌ | 1 | 3 | 9 | 4 | 1 | 18 |
| [`sl-tag`](components/sl-tag.md) | ❌ | 1 | 0 | 2 | 1 | 1 | 5 |
| [`sl-textarea`](components/sl-textarea.md) | ⚠️ | 0 | 2 | 2 | 5 | 1 | 10 |
| [`sl-tooltip`](components/sl-tooltip.md) | ❌ | 0 | 2 | 1 | 3 | 1 | 7 |
| [`sl-tree-item`](components/sl-tree-item.md) | ⚠️ | 0 | 0 | 1 | 3 | 1 | 5 |
| [`sl-tree`](components/sl-tree.md) | ⚠️ | 0 | 0 | 1 | 5 | 1 | 7 |
| [`sl-visually-hidden`](components/sl-visually-hidden.md) | ⚠️ | 0 | 0 | 0 | 1 | 1 | 2 |
| **Totale** | | **4** | **38** | **146** | **208** | **74** | **470** |

## 2. Problemi trasversali al DS

Gli elenchi dei componenti sono ricavati da `findings.csv`; il dettaglio è nei singoli report.

| # | Problema | Riferimento | Componenti coinvolti |
|---|---|---|---|
| T1 | **Nessun passthrough ARIA dall'host al controllo interno.** `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-pressed`, `aria-expanded` e `aria-current` scritti sull'host restano su un elemento senza ruolo. Nessuna `@property({ attribute: 'aria-…' })` nel DS. | 01-shared §2, §10 | button, icon-button, copy-button, icon, input, textarea, select, checkbox, switch, range, radio-group, radio-button, progress-bar, image-comparer, tab-group, breadcrumb-item (`aria-current`) |
| T2 | **Componenti form senza `ElementInternals`/`formAssociated`.** `<label for>` esterne non associabili (anche il `<label>` wrapper in `sl-table`), niente `internals.labels`, validità solo tramite `data-*`. | 01-shared §2 | input, textarea, select, checkbox, switch, radio-group, range, color-picker, rating, file-drop; table (page-size select) |
| T3 | **`aria-invalid` mai impostato** (0 occorrenze nel codice) e nessuna property `error-message` associata con `aria-describedby`/`aria-errormessage`: l'errore è solo visivo. | WCAG 3.3.1, 4.1.2 | input, textarea, select, checkbox, switch, range, radio-group, file-drop |
| T4 | **Controlli secondari con `tabindex="-1"` senza alternativa da tastiera** (clear, toggle password, remove, close). | WCAG 2.1.1 | tag (Blocker), input (password toggle), select (clear e tag rimovibili), tab (close), file-drop, file-upload-item |
| T5 | **Riferimenti ID che attraversano lo shadow root**, rotti o mascherati nei test. | 01-shared §2 | carousel (`aria-labelledby`/`aria-controls`), tooltip (`aria-describedby` sullo slot), details (`aria-controls` su slot), menu-item (`aria-expanded` sul nodo interno), selectable-item, copy-button |
| T6 | **Feedback asincrono non annunciato.** Live region assente, oppure creata o attivata solo al momento dell'aggiornamento. | WCAG 4.1.3 | copy-button, file-drop, file-upload-item, color-picker, table (sort/pagina/selezione), empty-state, spinner, skeleton, alert (`role=alert` fisso), badge (`role=status` fisso) |
| T7 | **Focus ring dei form control a 1.55:1** (box-shadow al 40%) e indicatori di focus/stato basati su `box-shadow`/`background` che spariscono in `forced-colors`. | SHARED-01, SHARED-02 | input, textarea, select, option, menu-item (1.14:1), checkbox, radio, table, carousel, image-comparer, split-panel, sidebar-item, header-item, header, tooltip, alert, badge, avatar, rating |
| T8 | **Contrasti sotto soglia** (testo `neutral-500` su superfici non bianche e in dark, contatori `neutral-400`, stelle del rating, tint di selezione). | SHARED-03, WCAG 1.4.3/1.4.11 | rating, stat, avatar, menu-label, sidebar-group, switch (dark), option, menu-item, detail-panel, selectable-item, range, breadcrumb-item, input/select (variante `filled`) |
| T9 | **Stringhe a11y hardcoded in inglese o non sovrascrivibili** (es. "Remove", "Retry", "Sidebar", "Main", "HSV", "Slide N", "Completed"). | SHARED-06, WCAG 3.1.2 | file-drop, file-upload-item, color-picker, sidebar, header, stepper, step, table, carousel, carousel-item, qr-code, animated-image, tab, dialog, drawer, alert, spinner |
| T10 | **Animazioni infinite o autoplay senza `prefers-reduced-motion` né controllo di pausa.** | SHARED-05, WCAG 2.2.2 | carousel (autoplay), animated-image, animation, badge (pulse), spinner, skeleton, progress-bar (indeterminate), alert (countdown), status |
| T11 | **Focus perso alla chiusura o rimozione** (`hidden`/removal senza ritorno al trigger). | WCAG 2.4.3 | detail-panel, alert, tag, file-drop, file-upload-item, stepper, tab-group, include, drawer (trap non disattivato in `disconnectedCallback`) |
| T12 | **`<a>` senza `href` usato come item di navigazione**: non focusabile e non attivabile. | WCAG 2.1.1 | sidebar-item, header-item, breadcrumb-item (diventa un `<button>` senza azione) |
| T13 | **Asterisco `required` generato con `::after { content: '*' }`** dentro l'elemento che dà il nome: finisce nel nome accessibile e non sostituisce `aria-required`. | [form-control.styles.ts:32-36](../src/styles/form-control.styles.ts#L32-L36) | input, textarea, select, checkbox, switch, radio-group |
| T14 | **Target sotto 24×24 px** (toggle 14–20px, icone e bottoni piccoli). | WCAG 2.5.8 | checkbox, radio, switch, range (thumb), rating, tag, icon-button, copy-button, select, tab (close), carousel (indicatori), split-panel |
| T15 | **Nessun warning in dev mode** quando manca il nome accessibile. | 01-shared §10 | icon-button, button-group, input, textarea, select, checkbox, radio-group, range, rating, dialog, drawer, details, tree, qr-code, stat-group, … (30 componenti) |
| T16 | **`lang`/`dir` non riflessi come attributo** se impostati via property. | SHARED-07 (aggiunto in consolidamento) | tutti; impatto maggiore su format-bytes, format-date, format-number, relative-time |

## 3. Interventi prioritizzati (quick win → refactor)

Impatto: quanti utenti/componenti beneficiano e quanto pesa la barriera. Sforzo: S = ore, M = 1–3 giorni, L = settimane.

| Priorità | Intervento | Risolve | Impatto | Sforzo |
|---|---|---|---|---|
| 1 | `sl-copy-button`: `aria-label=${copyLabel}` sul `<button>`; live region `role="status"` sempre presente per "Copiato/Errore"; rimuovere `ignoredRules: ['button-name']` dal test. | SL-COPY-BUTTON-01/02 | Alto | S |
| 2 | `sl-tag` e `sl-tab` (closable): togliere `tabindex="-1"` dal remove/close oppure gestire Delete/Backspace sull'host. | SL-TAG-01, SL-TAB-01 | Alto | S |
| 3 | `sl-table`: Enter/Space sugli header ordinabili (o un `<button>` dentro `columnheader`); applicare la property `label`; dare un nome al page-size select. | SL-TABLE-01/02/03 | Alto | S |
| 4 | `sl-selectable-item`: collegare il testo alla checkbox (testo nello slot di `sl-checkbox`, oppure `label` property). | SL-SELECTABLE-ITEM-01 | Alto | S |
| 5 | `sl-checkbox`: `aria-checked` = `"mixed"` se indeterminate, o meglio rimuoverlo e lasciare la semantica nativa. | SL-CHECKBOX-01 | Alto | S |
| 6 | `sl-drawer`: `this.modal.deactivate()` in `disconnectedCallback`; niente `aria-modal` con `contained`. | SL-DRAWER-01/02 | Alto | S |
| 7 | `sl-icon-button`: `aria-label=${ifDefined(this.label \|\| undefined)}` più warning dev se manca il nome; rimuovere `role="button"`/`tabindex`/`aria-disabled="false"` ridondanti su `<button>` (anche in `sl-button`). | SL-ICON-BUTTON-01 | Alto | S |
| 8 | `sl-input`: toggle password raggiungibile con Tab, con `aria-pressed`. | SL-INPUT-04 | Medio | S |
| 9 | `sl-tooltip`: rendere il body hoverable (niente `pointer-events: none`, hide delay > 0), Esc globale. | SL-TOOLTIP-02 | Medio | S |
| 10 | Token: `--sl-input-focus-ring-color` pieno (primary-600) e `outline` su `:focus-visible`; ritocco di `neutral-500`, del rating e dei tint di selezione in dark. | SHARED-01/03, T8 | Alto (tutti i form) | S–M |
| 11 | `ShoelaceElement`: `reflect: true` su `lang` e `dir`. | SHARED-07 | Medio (tutti) | S |
| 12 | Blocco CSS `@media (forced-colors: active)` per focus e stati selezionati nei componenti di T7; blocco `prefers-reduced-motion` globale sulle `--sl-transition-*` e sulle `@keyframes` infinite. | SHARED-02/05, T7, T10 | Medio | M |
| 13 | `aria-invalid` + nuova property `error-message` (resa nel shadow root e collegata con `aria-describedby`/`aria-errormessage`) in tutti i form control. | T3 | Alto | M |
| 14 | Property di override delle stringhe (`close-label`, `remove-label`, …) e nuove chiavi in `Translation` per tutte le stringhe hardcoded. | T9, SHARED-06 | Medio | M |
| 15 | Navigazione: `<button>` al posto di `<a>` senza `href` (sidebar-item, header-item, breadcrumb-item); `aria-current` sul link interno. | T12 | Alto | M |
| 16 | Live region stabili per file-drop, file-upload-item, table, empty-state; `role`/`aria-live` configurabili per alert e badge; pausa di alert su focus. | T6, SL-ALERT-01/02 | Medio | M |
| 17 | Rifare i widget composti secondo APG: carousel (pausa, riferimenti ID), image-comparer e split-panel (slider/separator con nome e `aria-valuetext`), color-picker (slider 2D), menu-item (submenu ARIA sull'host), menu-label (`role="group"`), radio-group/radio-button (roving tabindex), table (struttura grid o `<table>` nativa). | ❌ componenti | Alto | L |
| 18 | **Refactor di piattaforma:** mixin `FormAssociatedMixin` con `ElementInternals` (`formAssociated`, `setFormValue`, `setValidity`, `labels`) + `delegatesFocus`; mixin `AriaPassthroughMixin` per `aria-*` → elemento interno; ruoli via `internals.role` invece di `setAttribute('role')`. | T1, T2, T5 | Molto alto | L |

## 4. Definition of Done a11y per i nuovi componenti

- [ ] **Semantica:** elemento nativo dove esiste. `role` custom solo con un pattern APG di riferimento citato nel JSDoc e tutti gli attributi richiesti dal ruolo.
- [ ] **Nome accessibile:** property `label` (o slot) documentata. Per i componenti icon-only è obbligatoria, con `console.warn` in dev mode se manca. Mai `aria-label=""`: usare `ifDefined`/`nothing`.
- [ ] **Passthrough ARIA:** gli `aria-*` previsti dal pattern sono esposti come property e applicati all'elemento interno focusabile, senza duplicarli sull'host.
- [ ] **Form control:** `static formAssociated = true` + `ElementInternals` (`setFormValue`, `setValidity`), `delegatesFocus`, `aria-invalid` legato alla validità, `error-message` collegato, `required` → `aria-required` sul controllo focusabile, asterisco `aria-hidden`.
- [ ] **Riferimenti ID:** nessun riferimento che attraversa lo shadow root. Se serve, usare slot nel light DOM o element reflection (`ariaLabelledByElements`), con fallback documentato.
- [ ] **Tastiera:** mappa dei tasti APG documentata e testata; nessun controllo con `tabindex="-1"` senza alternativa; roving tabindex nei widget composti; Esc chiude e restituisce il focus al trigger.
- [ ] **Focus:** `:focus-visible` con `outline: var(--sl-focus-ring)` (≥3:1), visibile anche in `forced-colors`; nessun `outline: none` senza sostituto equivalente.
- [ ] **Stato e annunci:** stati (`aria-expanded`, `-selected`, `-pressed`, `-current`, `-busy`) aggiornati; feedback asincroni tramite live region già presente nel DOM.
- [ ] **Visivo:** contrasti verificati su light e dark (testo ≥4.5:1, UI ≥3:1); informazioni mai solo col colore; target ≥24×24 px; `prefers-reduced-motion` rispettato; reflow a 320px.
- [ ] **i18n:** tutte le stringhe a11y passano da `LocalizeController` e sono sovrascrivibili via property.
- [ ] **Test:** `expect(el).to.be.accessible()` senza `ignoredRules` non giustificati, su tutti gli stati (aperto, errore, disabled, selezionato); test di tastiera e di ritorno del focus.
- [ ] **Docs:** sezione "Accessibilità" nella pagina `docs/pages/components/<nome>.md` con props a11y, mappa tasti e responsabilità del consumer.

## 5. Piano di test manuale consigliato

**Matrice:** NVDA + Firefox, NVDA + Chrome, JAWS + Chrome (Windows); VoiceOver + Safari (macOS e iOS); TalkBack + Chrome (Android, per i componenti touch); solo tastiera su Chrome/Firefox; zoom 200%/400% e viewport a 320px; Windows High Contrast (`forced-colors`); `prefers-reduced-motion` attivo.

**Ordine (prima i componenti con Blocker/Alta e più usati):**
1. **Form:** `sl-input`, `sl-select` (+`sl-option`), `sl-textarea`, `sl-checkbox`, `sl-radio-group`/`sl-radio`/`sl-radio-button`, `sl-switch`, `sl-range`. Verificare: annuncio di nome, required, errore, indeterminate; navigazione del combobox; label esterne.
2. **Azioni:** `sl-button`, `sl-icon-button`, `sl-copy-button`, `sl-tag`. Verificare: nome, stato pressed/expanded, annuncio "Copiato", rimozione da tastiera.
3. **Overlay:** `sl-dialog`, `sl-drawer`, `sl-dropdown` + `sl-menu`/`sl-menu-item` (submenu), `sl-tooltip`. Verificare: focus trap, Esc annidato, ritorno del focus, isolamento del resto della pagina, 1.4.13.
4. **Dati:** `sl-table` (sort, selezione, paginazione, navigazione grid), `sl-selectable-item`, `sl-tree`/`sl-tree-item`, `sl-tab-group`.
5. **Navigazione:** `sl-sidebar`/`sl-sidebar-item`, `sl-header`/`sl-header-item`, `sl-breadcrumb`, `sl-stepper`.
6. **Media e feedback:** `sl-carousel`, `sl-animated-image`, `sl-image-comparer`, `sl-split-panel`, `sl-color-picker`, `sl-alert` (toast), `sl-file-drop`/`sl-file-upload-item`, `sl-progress-bar`/`sl-progress-ring`/`sl-spinner`.
7. **Restanti:** contenuto statico e utility (card, comment, empty-state, detail-panel, stat, description-list, formatter, divider, visually-hidden…).

## 6. Copertura di test e documentazione a11y

- **Senza test axe** (22): `sl-color-picker`, `sl-dialog`, `sl-drawer`, `sl-dropdown`, `sl-format-bytes`, `sl-format-date`, `sl-format-number`, `sl-icon-button`, `sl-image-comparer`, `sl-include`, `sl-menu`, `sl-mutation-observer`, `sl-popup`, `sl-radio-button`, `sl-radio-group`, `sl-radio`, `sl-resize-observer` (nessun file di test), `sl-step`, `sl-tag`, `sl-tooltip`, `sl-tree-item`, `sl-visually-hidden`.
- **Test axe che mascherano difetti** (`ignoredRules`):
  - `color-contrast` in [avatar.test.ts:7](../src/components/avatar/avatar.test.ts#L7), [badge.test.ts:7](../src/components/badge/badge.test.ts#L7) e [breadcrumb.test.ts:7](../src/components/breadcrumb/breadcrumb.test.ts#L7);
  - `button-name` in [copy-button.test.ts:6](../src/components/copy-button/copy-button.test.ts#L6);
  - `aria-valid-attr-value` in [carousel.test.ts:789](../src/components/carousel/carousel.test.ts#L789).
- **Test axe che non verificano davvero:** `sl-animated-image` (senza src/alt); `sl-selectable-item` (passa nonostante la checkbox senza nome); `sl-progress-bar` e `sl-progress-ring` (passano un `ariaLabel` ignorato dal componente). Le asserzioni su `aria-checked` in radio-group.test.ts sono commentate.
- **Nessun test di tastiera, focus o live region negli stati dinamici:** aperto, errore, collapsed, selezione multipla. I test axe coprono solo il DOM iniziale.
- **Runner:** Firefox è commentato in [web-test-runner.config.js](../web-test-runner.config.js), quindi la combinazione NVDA + Firefox non ha copertura automatica.
- **Docs:** nessuna delle 76 pagine in `docs/pages/components/` ha una sezione "Accessibilità"; `sl-description-list-item` non ha una pagina. Menzioni sparse di ARIA o screen reader compaiono solo in 15 pagine.

## 7. Verifica di completezza (Fase 4)

| Controllo | Valore |
|---|---|
| Componenti rilevati nel codice (`.define('sl-…')` / `customElements.define` in `src/components/**`, esclusi i `*.test.ts`) | **77** |
| Righe dell'inventario | **77** (tutte ☑) |
| Report in `components/` | **77** |
| Componenti con almeno un finding in `findings.csv` | 77 |
| Righe di `findings.csv` | 470 (ID univoci, severità valide, 10 colonne) |
| Esclusi | 3 elementi definiti solo nei test (`dialog.test.ts` → `a-container`; `dropdown.test.ts`; `radio-group.test.ts`, dove le definizioni sono commentate): sono fixture e non componenti del DS. I wrapper React in `src/react/*` sono generati e re-esportano gli stessi 77 componenti. |

**Note sul processo:**
- L'analisi è stata svolta da 8 agenti in parallelo, ognuno con la stessa checklist e lo stesso formato; il consolidamento è stato fatto qui leggendo i file su disco.
- L'inventario è stato aggiornato a ☑ dopo aver verificato la presenza dei report, non dopo ogni singolo componente: con l'esecuzione in parallelo, scritture concorrenti sullo stesso file avrebbero rischiato di sovrascriversi.
- In consolidamento i Blocker e 6 finding di severità Alta (input, checkbox, drawer, tooltip, table, tag) sono stati riverificati sul codice sorgente.
- È stato aggiunto SHARED-07, e gli esiti di 4 componenti sono passati da ✅ a ⚠️ perché restano verifiche manuali da eseguire.
- Due bug non legati all'accessibilità sono annotati nei report: `@watch('iterationsStart')` in [animation.component.ts:171](../src/components/animation/animation.component.ts#L171) e i nomi di attributo usati in `@watch` in [mutation-observer.component.ts:103-105](../src/components/mutation-observer/mutation-observer.component.ts#L103-L105).

## File prodotti

- [a11y-report/00-inventory.md](00-inventory.md)
- [a11y-report/01-shared-context.md](01-shared-context.md)
- [a11y-report/components/](components/): 77 file `sl-*.md`
- [a11y-report/findings.csv](findings.csv)
- [a11y-report/_parts/](_parts/): CSV per gruppo (G1–G8), sorgente del merge
- [a11y-report/99-summary.md](99-summary.md)
