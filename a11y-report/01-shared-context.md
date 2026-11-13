# 01 — Contesto condiviso (base class, mixin, stili, token, i18n)

> **Revisione v2 (2026-11-12) — solo errori dimostrati.** Questo documento descrive il contesto tecnico del DS. I punti `SHARED-NN` sono stati riverificati con l'harness runtime (Chromium reale, bundle `cdn/`), con questo esito:
>
> | ID | v1 | v2 | Prova |
> |---|---|---|---|
> | SHARED-01 focus ring form control al 40% | Media | **Miglioramento** (non errore AA) | `sl-input` con focus: bordo `rgb(30,159,191)` su bianco = **3.10:1** → l'indicatore AA (1.4.11/2.4.7) è soddisfatto dal bordo; l'anello a ~1.5:1 è rilevante solo per 2.4.13 (AAA). |
> | SHARED-02 focus/stati solo con box-shadow in forced colors | Media | **Errore confermato, per componente** | `sl-input` con `forced-colors: active`: bordo `rgb(0,0,0)` con e senza focus, `box-shadow: none`, `outline-style: none` → focus non visibile (WCAG 2.4.7). Ogni componente coinvolto è dimostrato nel proprio report. |
> | SHARED-03 `neutral-500` come testo | Media | **Nota sui token** (non errore in sé) | È un errore solo dove il componente usa davvero quel colore per testo informativo su quella superficie: misurato nei singoli report con `contrast:`. |
> | SHARED-04 bordo disabled | Bassa | **Non errore** | I controlli disabilitati sono esenti da 1.4.3/1.4.11. |
> | SHARED-05 transizioni e reduced motion | Bassa | **Miglioramento** | 2.3.3 è AAA; le transizioni brevi non rientrano in 2.2.2. |
> | SHARED-06 stringhe non sovrascrivibili | Media | **Miglioramento** | Dove la stringa passa da `LocalizeController` non c'è errore. Le stringhe **hardcoded** (non localizzabili) sono trattate nei singoli report. |
> | SHARED-07 `lang`/`dir` non riflessi | Media | **Errore confermato** (Bassa, WCAG 3.1.2 — impatto dimostrato in `SL-FORMAT-BYTES-01`) | Runtime: `e = document.createElement('sl-button'); e.lang = 'de'` → `e.getAttribute('lang') === null`. |
>
> Verificato anche a runtime: un `aria-label`/`aria-pressed` scritto sull'host di `sl-button` produce `generic "Nome host"` → `button "Testo"` senza stato pressed (l'ARIA resta sull'host). Ma il **nome** di `sl-button` arriva già dal testo nello slot (`button "Salva"`) e dall'icona con `label` (`button "Impostazioni"`): l'assenza di passthrough è un errore solo dove un caso d'uso documentato non è realizzabile.

Analisi eseguita una volta sola. I report per componente rimandano a questo documento con gli ID `SHARED-NN`.

## 1. Base class e controller

| Elemento | File | Rilevanza a11y |
|---|---|---|
| `ShoelaceElement` | [src/internal/shoelace-element.ts](../src/internal/shoelace-element.ts) | Estende `LitElement`. Dichiara solo `dir` e `lang` come property reattive (r. 67-68). **Nessuna** gestione centralizzata di `aria-*`, `role`, `tabindex`, `delegatesFocus`, `ElementInternals`. `emit()` crea eventi `bubbles+composed` (r. 83-89). |
| `FormControlController` | [src/internal/form.ts](../src/internal/form.ts) | Associa i controlli al `<form>` *senza* `ElementInternals`: aggancia `formdata`/`submit` e sovrascrive `form.reportValidity` (r. 155-158, 304-306 commento: "Since we're not yet using ElementInternals"). Gli stati di validità sono esposti solo come attributi `data-invalid`, `data-user-invalid`, `data-user-valid` sull'host (r. 404-407): **non** producono `aria-invalid`, che va impostato da ogni componente. |
| `HasSlotController` | [src/internal/slot.ts](../src/internal/slot.ts) | Rileva la presenza di slot (es. `label`, `help-text`) per mostrare/nascondere wrapper. Ignora `sl-visually-hidden` nel default slot (r. 23-26). |
| `LocalizeController` | [src/utilities/localize.ts](../src/utilities/localize.ts) | Wrapper di `@shoelace-style/localize`; registra `en` come fallback. Chiavi disponibili: `carousel, clearEntry, close, copied, copy, currentValue, error, goToSlide, hidePassword, loading, nextSlide, numOptionsSelected, previousSlide, progress, remove, resize, scrollToEnd, scrollToStart, selectAColorFromTheScreen, showPassword, slideNum, toggleColorFormat`. Esistono 29 traduzioni in [src/translations/](../src/translations/) (inclusa `it.ts`, chiavi allineate a `en.ts`). |
| `Modal` | [src/internal/modal.ts](../src/internal/modal.ts) | Focus trap usato da dialog/drawer: listener `focusin`/`keydown` su `document`, ciclo Tab/Shift+Tab sui tabbable (r. 81-130), stack di modali (`activeModals`). |
| `getTabbableElements` | [src/internal/tabbable.ts](../src/internal/tabbable.ts) | Attraversa anche gli shadow root; considera tabbable le aree in overflow scrollabili. |
| `animateTo` / `prefersReducedMotion` | [src/internal/animate.ts](../src/internal/animate.ts) | r. 35-37: `matchMedia('(prefers-reduced-motion: reduce)')`. Le animazioni registrate (dialog, drawer, tooltip, dropdown, alert, details…) usano questo helper. |

## 2. Gestione di `aria-*`, `role`, `tabindex`, focus — stato a livello di DS

- **`delegatesFocus`: mai usato** (0 occorrenze in `src/components`). I controlli nativi sono nel shadow root; `focus()`/`blur()` sono reimplementati manualmente per componente.
- **`ElementInternals` / `static formAssociated`: mai usati** (0 occorrenze; `attachInternals` compare solo in un commento di `form.ts`). Conseguenze:
  - una `<label for="id">` esterna **non si associa** al controllo interno; il nome va passato con la property `label` / slot `label`;
  - `internals.role` / `internals.aria*` non sono disponibili, quindi i ruoli sull'host sono impostati con `this.setAttribute('role', …)` in `connectedCallback` (vedi tabella sotto): un consumer che scrive `role` sull'host lo vede sovrascritto, e lo sprouting di attributi sull'host è visibile nel light DOM;
  - `aria-invalid`, `aria-required` ecc. non vengono dal controller ma da ogni componente.
- **Nessuna property `@property({ attribute: 'aria-…' })` dichiarata in nessun componente** (0 occorrenze). Un `aria-label`/`aria-describedby` scritto dal consumer sull'host **resta sull'host**: se l'host non ha ruolo (es. `sl-button`, `sl-input`, `sl-icon-button` dove il controllo nativo è nel shadow root) l'attributo viene ignorato o crea un nome su un elemento generico non focusabile. Il nome si può passare solo con le property dedicate (`label`, slot, ecc.) dove esistono.
- **Ruoli impostati sull'host** (`setAttribute('role', …)`): `sl-tree` (tree), `sl-tree-item` (treeitem), `sl-radio` (radio), `sl-radio-button` (presentation), `sl-step` (listitem), `sl-option` (option), `sl-tab` (tab), `sl-tab-panel` (tabpanel), `sl-carousel` (region + slide group/tabpanel), `sl-divider` (separator), `sl-table` (grid), `sl-menu` (menu), `sl-menu-item` (menuitem / menuitemcheckbox), `sl-icon` (img). Questi componenti funzionano bene con riferimenti ID dal light DOM (gli ID sono sull'host), mentre gli altri hanno la semantica dentro lo shadow root.
- **Riferimenti ID tra shadow root**: ogni `aria-labelledby`/`aria-describedby`/`aria-controls` interno al shadow root può puntare solo a ID dello stesso shadow root. Un consumer non può collegare un messaggio d'errore esterno (light DOM) all'`<input>` interno: serve una property di testo (`help-text`, `error-message`) oppure `ariaDescribedByElements` (ARIA reflection, supporto non uniforme tra browser) via ElementInternals.
- **`tabindex` > 0**: nessuna occorrenza rilevata (`grep 'tabindex="[1-9]'` = 0).
- **Target size**: nessun `min-width/min-height: 24px` esplicito nel DS; i target dipendono da `--sl-input-height-*` (small 28px, medium 36px, large 44px) e da padding/font-size delle icone. `--sl-toggle-size-small` = 14px (checkbox/radio/switch small): sotto i 24×24 se l'area cliccabile non include la label (WCAG 2.5.8 accetta l'eccezione "spacing" ma va verificato).

## 3. Focus ring

| Token | Light | Dark | Contrasto calcolato vs superficie (`--sl-color-neutral-0`) |
|---|---|---|---|
| `--sl-focus-ring` | `solid 2px var(--sl-color-primary-600)` | `solid 2px var(--sl-color-primary-700)` | light **6.21:1** ✅ / dark **10.27:1** ✅ |
| `--sl-focus-ring-offset` | `2px` | `2px` | — |
| `--sl-input-focus-ring-color` | `color-mix(in srgb, primary-500, transparent 60%)` (40% opacità) | idem | light **1.55:1** ❌ / dark **1.95:1** ❌ (calcolato con blending su neutral-0) |
| `--sl-input-border-color-focus` | `primary-500` | `primary-600` | light **3.08:1** ✅ (appena sopra soglia) / dark 8.03:1 ✅ |

- **SHARED-01 (v2: Miglioramento — vedi revisione in testa):** il focus ring dei form control (input, select, textarea, color-picker…) è un `box-shadow` al 40% di opacità con contrasto 1.55:1. L'indicatore di focus regge solo grazie al cambio di colore del bordo da `neutral-400` (3.21:1) a `primary-500` (3.08:1): il cambio è poco percepibile (stesso spessore, differenza di contrasto tra i due stati ≈1:1). Fix: usare `--sl-input-focus-ring-color: var(--sl-color-primary-600)` pieno, oppure un `outline: var(--sl-focus-ring)` su `:focus-visible`.
- **SHARED-02 (v2: errore confermato per componente — WCAG 2.4.7 in forced colors):** molti componenti usano `outline: none` (29 occorrenze in 20 file `*.styles.ts`) e il focus è reso con `box-shadow`, che in **Windows High Contrast / `forced-colors: active` viene rimosso**. Solo 17 file stili hanno una media query `forced-colors` (button, dialog, drawer, file-drop, menu-item, option, progress-bar, range, rating, skeleton, split-panel, stat, status, step, switch, tab, tree-item). Vanno verificati per ogni componente (vedi report).

## 4. Colori — contrasto dei token principali (calcolato da `src/themes/*.css`)

Superficie di riferimento = `--sl-color-neutral-0` (light: bianco `hsl(0 0% 100%)`; dark: `hsl(200 26% 8%)`). Soglie: testo 4.5:1, testo grande / UI 3:1.

| Coppia (fg su bg) | Light | Dark | Uso tipico |
|---|---|---|---|
| neutral-800 su neutral-0 | 12.51 ✅ | 12.01 ✅ | `--sl-input-label-color` |
| neutral-700 su neutral-0 | 9.12 ✅ | 8.72 ✅ | testo corrente |
| neutral-600 su neutral-0 | 6.63 ✅ | 5.70 ✅ | `--sl-input-help-text-color`, placeholder dark |
| neutral-500 su neutral-0 | 4.71 ✅ | **3.48 ❌ testo** / ✅ UI | placeholder light, testo secondario, bordo input dark |
| neutral-500 su neutral-100 | **4.27 ❌** | **2.95 ❌** | testo secondario su superfici sunken / disabled |
| neutral-500 su neutral-50 | **4.46 ❌** | **3.23 ❌** | testo secondario su `--sl-surface-app` |
| neutral-400 su neutral-0 | 3.21 ✅ UI / ❌ testo | **2.17 ❌** | `--sl-input-border-color` light, `-disabled` dark |
| neutral-400 su neutral-50 | 3.04 ✅ UI | **2.01 ❌** | |
| neutral-300 su neutral-0 | **1.56 ❌** | **1.64 ❌** | `--sl-border-strong`, `--sl-input-border-color-disabled` light |
| neutral-200 su neutral-0 | **1.25 ❌** | **1.35 ❌** | `--sl-border-subtle`, `--sl-panel-border-color` (decorativo: ok se non unico indicatore) |
| primary-600 su neutral-0 | 6.21 ✅ | 8.03 ✅ | link, focus ring, bottone primary (testo bianco su fill) |
| primary-500 su neutral-0 | **3.08** (solo UI) | 6.62 ✅ | bordo focus, accenti |
| neutral-0 su primary-500 | **3.08 ❌ testo** | 6.62 ✅ | eventuale fill primary-500 con testo |
| neutral-0 su success-600 / warning-600 / danger-600 | 4.60 / 4.59 / 4.61 ✅ (al limite) | 9.99 / 11.25 / 4.78 ✅ | bottoni/badge variant |
| neutral-0 su success-500 / warning-500 / danger-500 | **2.72 / 2.58 / 3.75 ❌** | 8.30 / 9.48 / 3.67 | se usati come fill con testo |
| success/warning/danger-700 su relativo -50 | 5.79 / 5.74 / 6.01 ✅ | 5.51 / 5.50 / 5.32 ✅ | alert/tag tenui |
| neutral-0 su neutral-900 | 15.46 ✅ | 14.92 ✅ | tooltip |

Script di calcolo: luminanza relativa WCAG 2.x su valori HSL risolti dalle `var()` (nessun alpha, tranne il focus ring input dove è stato applicato il blending).

- **SHARED-03 (v2: nota sui token, errore solo dove misurato nel componente):** `neutral-500` come colore di testo è conforme solo su bianco in light; fallisce su `neutral-50`/`neutral-100` (light) e su qualunque superficie in dark (3.48:1). Ogni componente che usa `neutral-500` per testo (meta, caption, placeholder dark se ridefinito, testo disabled) va segnalato.
- **SHARED-04 (v2: non errore — disabilitati esenti):** `--sl-input-border-color-disabled` (light neutral-300, 1.56:1; dark neutral-400, 2.17:1): accettabile per controlli disabilitati (eccezione WCAG), ma il confine del controllo si perde.

## 5. Spaziatura, tipografia, target size

- Spacing in `rem` (`--sl-spacing-3x-small` 0.125rem … `4x-large` 4.5rem), font-size in `rem` (`--sl-font-size-2x-small` 0.625rem = 10px … 4.5rem). Il testo si ridimensiona con lo zoom e con la dimensione font dell'utente ✅.
- `--sl-font-size-2x-small` = 10px: se usato per testo informativo (badge, contatori) peggiora la leggibilità (non è un criterio AA, ma segnalare).
- Altezze controlli: `--sl-input-height-small` 1.75rem (28px) ✅ 2.5.8, `medium` 2.25rem (36px), `large` 2.75rem (44px).
- `--sl-toggle-size-small/medium/large` = 14/16/20px (checkbox, radio, switch): la label inclusa nell'area cliccabile allarga il target; senza label visibile (solo `aria-label`/label nascosta) il target scende sotto 24px → **WCAG 2.5.8** a rischio.

## 6. Motion

- `prefersReducedMotion()` in [src/internal/animate.ts:35-37](../src/internal/animate.ts#L35-L37) è usato dalle animazioni JS registrate (`animateTo` + registry). Con reduced motion `animateTo` forza `duration: 0` (r. 12). Oltre ad `animate.ts`, `prefersReducedMotion` è usato solo in `carousel.component.ts`.
- Media query CSS `prefers-reduced-motion` presenti solo in: `sidebar.styles.ts`, `status.styles.ts`, `carousel.styles.ts`. Le animazioni CSS (`@keyframes`) di spinner, skeleton, progress-bar indeterminate, ecc. vanno verificate componente per componente.
- **SHARED-05 (v2: Miglioramento — AAA):** transizioni CSS (`transition: var(--sl-transition-*)`) non vengono disattivate con reduced motion a livello globale. Fix trasversale suggerito nel tema:
  ```css
  @media (prefers-reduced-motion: reduce) {
    :root, :host { --sl-transition-x-slow: 0ms; --sl-transition-slow: 0ms; --sl-transition-medium: 0ms; --sl-transition-fast: 0ms; --sl-transition-x-fast: 0ms; }
  }
  ```

## 7. Forced colors / High Contrast

- Supporto `@media (forced-colors: active)` presente in 17 file stili (vedi §3). Assente per: input, select, textarea, checkbox, radio, radio-button, card, alert, tag, badge, tooltip, dropdown/popup, details, tab-group, ecc. Ogni report verifica il caso specifico (indicatori basati solo su `background-color`/`box-shadow` spariscono).

## 8. Localizzazione / i18n

- Stringhe a11y localizzabili solo per le chiavi elencate in §1. Componenti aggiunti in questo fork (copy-button, file-drop, file-upload-item, table, stat, sidebar, header, comment, empty-state, detail-panel, stepper, rating…) vanno verificati per stringhe hardcoded in inglese/italiano in `aria-label` o testo visivamente nascosto.
- **SHARED-06 (v2: Miglioramento):** non esiste un meccanismo per override puntuale delle stringhe di default se non registrando una traduzione completa; dove serve, i componenti dovrebbero esporre property dedicate (es. `copy-label`, `close-label`) che vincono sul default localizzato.
- **SHARED-07 (v2: errore confermato a runtime, Bassa, WCAG 3.1.2 — SL-FORMAT-BYTES-01):** `@property() dir` e `@property() lang` in [src/internal/shoelace-element.ts:67-68](../src/internal/shoelace-element.ts#L67-L68) non hanno `reflect: true`. Lit 3 (`@lit/reactive-element` 2.1.2) installa il proprio accessor sul prototype perché `getOwnPropertyDescriptor(ShoelaceElement.prototype, 'lang')` è `undefined` ([node_modules/@lit/reactive-element/development/reactive-element.js:291](../node_modules/@lit/reactive-element/development/reactive-element.js#L291)), oscurando il setter nativo di `HTMLElement`. Effetto: `el.lang = 'de'` (assegnazione via property, tipica di React 19, Angular `[lang]`, Vue `:lang` con property binding) cambia la localizzazione interna ma **non** scrive l'attributo `lang`/`dir`, quindi gli AT non cambiano lingua di pronuncia e il `dir` non si applica al rendering. Impatta tutti i 77 componenti, in particolare i formatter (vedi `SL-FORMAT-BYTES-01`). Confermato a runtime (v2): `el.lang = 'de'` → `getAttribute('lang') === null`. Fix: `@property({ reflect: true }) dir: string; @property({ reflect: true }) lang: string;` (oppure `noAccessor: true` + `requestUpdate()` in `attributeChangedCallback`).

## 9. Test e documentazione a11y

- Runner: Web Test Runner + Playwright (chromium, webkit; firefox commentato) — [web-test-runner.config.js](../web-test-runner.config.js). Assertion axe: `await expect(el).to.be.accessible()` di `@open-wc/testing` (chai-a11y-axe).
- 55/77 componenti hanno almeno un test axe (vedi colonna "test" in [00-inventory.md](00-inventory.md)); 21 hanno test ma senza axe, 1 (`resize-observer`) senza test.
- I test axe verificano il DOM statico iniziale: non coprono stati aperti, navigazione da tastiera o annunci live.
- **Docs**: nessuna pagina in `docs/pages/components/` ha una sezione dedicata "Accessibility"; menzioni sparse di `aria-`/screen reader solo in 15 pagine (button-group, dialog, drawer, header, icon, input, popup, radio-button, range, select, stat-group, stepper, tab-group, textarea, visually-hidden).

## 10. Pattern di riferimento per i fix (riusati nei report)

**Propagazione di `aria-label` dall'host al controllo interno (senza duplicare il nome sull'host):**
```ts
import { ifDefined } from 'lit/directives/if-defined.js';

/** Nome accessibile passato dal consumer; viene applicato al controllo nativo interno. */
@property({ attribute: 'aria-label', reflect: false }) accessibleLabel?: string;
@property({ attribute: 'aria-describedby' }) accessibleDescribedby?: string; // utile solo se gli ID sono nello stesso shadow root

render() {
  return html`<button aria-label=${ifDefined(this.accessibleLabel || undefined)}>…</button>`;
}
// Nota: lasciando l'attributo aria-label anche sull'host si crea un nome su un elemento senza ruolo.
// Rimuoverlo dall'host in updated() o usare un nome attributo dedicato (es. `label`) per evitare la duplicazione.
```

**Ruolo/ARIA sull'host tramite ElementInternals (al posto di `setAttribute('role')`):**
```ts
private internals = this.attachInternals();
connectedCallback() {
  super.connectedCallback();
  this.internals.role = 'option';
  this.internals.ariaSelected = String(this.selected);
}
```

**Form-associated custom element (label esterne, validità nativa):**
```ts
static formAssociated = true;
private internals = this.attachInternals();
// this.internals.setFormValue(value); this.internals.setValidity(flags, message, anchorInput);
// this.internals.labels → <label for="id-host"> funziona; usare delegatesFocus per inoltrare il focus.
static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
```

**Warning in dev mode per nome accessibile mancante:**
```ts
updated() {
  if (import.meta.env?.DEV !== false && !this.label && !this.getAttribute('aria-label')) {
    console.warn(`<${this.localName}>: manca un nome accessibile. Imposta l'attributo "label".`);
  }
}
```
