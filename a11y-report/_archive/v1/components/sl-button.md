## Button (`sl-button` – src/components/button/button.component.ts)
**Pattern APG di riferimento:** APG Button pattern (button, toggle button, menu button) · APG Link pattern (con `href`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 3 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<button>` / `<a href>` nativi ✅. `role="button"` ridondante su `<button>` (r. 282). Con `href` + `disabled` l'`<a>` perde `href` e quindi il ruolo link (r. 278) → SL-BUTTON-03. |
| 2 | Nome, descrizione, stato | ⚠️ | Nome dal testo nello slot ✅ (anche per `circle` con `<sl-icon label>` slottato). In `loading` la label va in `visibility:hidden` e il nome cambia (SL-BUTTON-02). Nessuno stato pressed/expanded/current esprimibile da fuori (SL-BUTTON-01). |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | `aria-*` scritti sull'host restano sull'host (SHARED §2). L'unico che inietta ARIA sul `<button>` interno è `sl-dropdown` (dropdown.component.ts:319-327). |
| 4 | Tastiera e focus | ✅ | Enter/Space nativi; `:focus-visible` con `outline: var(--sl-focus-ring)` (styles r. 48-51, 6.21:1 / 10.27:1) che resta visibile in forced-colors. Disabled fuori dal tab order (nativo). Con `loading` il bottone resta attivabile (SL-BUTTON-02). |
| 5 | Form e validazione | ✅ | `type`, `name`, `value`, `form*` passabili; submit/reset tramite FormControlController. Niente ElementInternals (SHARED §2) ma per un bottone l'impatto è minimo. |
| 6 | Live region | ⚠️ | Lo stato loading non è annunciato: niente `aria-busy`, niente testo in live region; lo spinner interno è `role="progressbar" aria-label="Loading"` (spinner.component.ts:28) dentro un `<button>` (figli presentazionali). |
| 7 | Aspetti visivi | ⚠️ | Contrasti testo ok: primary 6.21, accent (primary-950 su accent-500) 5.58 light / 7.07 dark, success/warning/danger 4.60/4.59/4.61 (al limite), outline accent-700 4.70, text variant primary-600 su neutral-100 (hover) 5.63. Target small 28px ✅. Bordo `default` neutral-300 1.56:1 (non richiesto, il bottone è identificato dal testo). `scale`/transition senza reduced-motion (SL-BUTTON-06). |
| 8 | API pubblica a11y | ❌ | Nessuna property `aria-*`; solo `title` passa all'interno (r. 58, 275). Nessun warning se `circle` è senza nome. |
| 9 | Documentazione e test | ⚠️ | 9 test axe (varianti, default, disabled) ✅; nessun test su loading, href+disabled, caret, tastiera. La docs suggerisce `<span tabindex="0">` attorno al bottone disabilitato (button.md:46-52) → SL-BUTTON-04. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-BUTTON-01 | Alta | 3/8 Passthrough ARIA | Il consumer non può impostare sul `<button>`/`<a>` interno `aria-label`, `aria-pressed` (toggle), `aria-expanded`/`aria-controls`/`aria-haspopup` (disclosure, popover, sidebar: `caret` è solo visivo), `aria-current` (bottone-link di navigazione), `aria-describedby`. Gli attributi scritti sull'host restano su un elemento senza ruolo (SHARED §2). Solo `sl-dropdown` li inietta dall'interno. | src/components/button/button.component.ts:270-289 (nessun binding `aria-*` oltre `aria-disabled`); r. 294 `caret` = solo `<sl-icon>` | WCAG 4.1.2; APG Button (toggle / menu button) | Aggiungere property `accessibleLabel` (`attribute: 'aria-label'`), `pressed` (`aria-pressed`), `expanded` (`aria-expanded`), `controls`, `haspopup`, `current` riflesse sul tag interno con `ifDefined`; rimuovere l'`aria-label` dall'host dopo averlo copiato. |
| SL-BUTTON-02 | Media | 2/6 Stato loading | Con `loading` prefix/label/suffix/caret vanno in `visibility:hidden` (escono dall'albero di accessibilità): il nome del bottone diventa quello dello spinner ("Loading") o vuoto a seconda del browser; nessun `aria-busy`; il click resta attivo (`handleClick` non controlla `loading`) → doppio invio possibile, cambio di stato non annunciato. | src/components/button/button.styles.ts:506-511 `visibility: hidden`; button.component.ts:186-194, 296 `<sl-spinner part="spinner">` | WCAG 4.1.2, 4.1.3; 3.3.4 (prevenzione errori) | Nascondere la label solo visivamente (`opacity:0`), `aria-busy="true"` + `aria-disabled="true"` e blocco del click durante il loading; spinner `aria-hidden="true"`; documentare l'uso di una live region del consumer per l'esito. |
| SL-BUTTON-03 | Media | 1/4 Link disabilitato | Con `href` + `disabled` l'`<a>` viene renderizzato senza `href` (ruolo generico, non più link), con `tabindex="-1"` e `aria-disabled="true"` su un elemento generico (attributo non supportato sul ruolo `generic`): lo screen reader legge testo semplice, lo stato disabilitato non è esposto. | src/components/button/button.component.ts:278 `href=${ifDefined(isLink && !this.disabled ? this.href : undefined)}`, 282-284 | WCAG 4.1.2; ARIA 1.2 (aria-disabled non ammesso su generic) | Se `isLink && disabled`: `role="link"` + `aria-disabled="true"`, mantenere `tabindex="0"` opzionale e prevenire l'attivazione in `handleClick`. |
| SL-BUTTON-04 | Media | 9/4 Docs disabled | La documentazione consiglia di rendere focusabile il bottone disabilitato avvolgendolo in `<span tabindex="0">`: crea un tab stop generico senza ruolo né nome (lo screen reader annuncia solo il testo, senza "pulsante, non disponibile"). Il componente non offre un disabled focusabile. | docs/pages/components/button.md:46-52 `<span tabindex="0"><sl-button disabled>Complete</sl-button></span>` | WCAG 4.1.2, 2.4.3 | Aggiungere una modalità "soft disabled" (`aria-disabled="true"` senza `disabled` nativo, focus mantenuto, click bloccato) e aggiornare l'esempio con il tooltip sul bottone stesso. |
| SL-BUTTON-05 | Bassa | 1 Semantica | ARIA ridondante: `role="button"` su `<button>`, `tabindex="0"` su `<button>`, `aria-disabled="false"` sempre emesso e `aria-disabled="true"` duplicato del `disabled` nativo. Non dannoso ma viola la "first rule of ARIA" e confonde il debug. | src/components/button/button.component.ts:282-284 | ARIA in HTML (no redundant roles) | Rimuovere `role`; emettere `tabindex` solo per `<a>` disabilitato; `aria-disabled` solo per `<a>` (o modalità soft-disabled). |
| SL-BUTTON-06 | Bassa | 7 Motion | Il feedback `:active { scale: 0.97 }` e le transition non sono disattivati con `prefers-reduced-motion` (rimando SHARED-05). | src/components/button/button.styles.ts:26-38 | WCAG 2.3.3 (AAA) / SHARED-05 | `@media (prefers-reduced-motion: reduce) { .button { transition: none; } .button:active { scale: none; } }` |
| SL-BUTTON-07 | Bassa | 9 Test | Nessun test su: nome accessibile in loading, `href`+`disabled`, `circle` senza nome, attivazione da tastiera, axe con `href`/`caret`/`loading`. | src/components/button/button.test.ts:137-149 (solo presenza dello spinner/caret) | — (qualità) | Aggiungere `to.be.accessible()` per loading/href/caret e asserzioni sugli attributi ARIA interni. |
| SL-BUTTON-08 | Suggerimento | 2 Link `_blank` | Con `target="_blank"` non c'è alcuna indicazione (testo nascosto/icona) dell'apertura in una nuova finestra e il consumer non può aggiungerla al nome se non nello slot. | src/components/button/button.component.ts:279 | WCAG 3.2.5 (AAA), tecnica G201 | Aggiungere testo `sl-visually-hidden` localizzato ("si apre in una nuova scheda") quando `target="_blank"`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| slot di default (nome) | Sì | Sì | Unica fonte del nome; per `circle` usare `<sl-icon label>` o `sl-visually-hidden`. |
| `title` | Sì | Sì (r. 275) | Resta anche sull'host (tooltip duplicato, nessun impatto AT rilevante). |
| `disabled` | Sì | Parziale | `<button disabled>` ✅; su `<a>` vedi SL-BUTTON-03. |
| `loading` | Sì | No | Nessun `aria-busy`/`aria-disabled` (SL-BUTTON-02). |
| `caret` | Sì | No | Solo visivo; servono `aria-haspopup`/`aria-expanded` fuori da `sl-dropdown`. |
| `aria-label` / `aria-labelledby` / `aria-describedby` | No | — | Da aggiungere (SL-BUTTON-01). |
| `aria-pressed` | No | — | Da aggiungere per toggle (usato anche in button-group/toolbar). |
| `aria-expanded` / `aria-controls` / `aria-haspopup` | No | Solo via `sl-dropdown` | Da aggiungere. |
| `aria-current` | No | — | Da aggiungere per uso con `href` in navigazione. |
| warning dev mode nome mancante | No | — | Da aggiungere per `circle` senza testo accessibile. |

### Fix proposti
```ts
// button.component.ts
@property({ attribute: 'aria-label' }) accessibleLabel?: string;
@property({ attribute: 'aria-pressed' }) pressed?: 'true' | 'false' | 'mixed';
@property({ attribute: 'aria-expanded' }) expanded?: 'true' | 'false';
@property({ attribute: 'aria-controls' }) controls?: string; // ID nello stesso scope del button interno
@property({ attribute: 'aria-haspopup' }) haspopup?: string;
@property({ attribute: 'aria-current' }) current?: string;

updated(changed: PropertyValues<this>) {
  // evita il nome duplicato su un host senza ruolo
  if (changed.has('accessibleLabel') && this.hasAttribute('aria-label')) this.removeAttribute('aria-label');
  if (import.meta.env?.DEV !== false && this.circle && !this.button?.textContent?.trim() && !this.accessibleLabel
      && !this.querySelector('sl-icon[label], sl-visually-hidden')) {
    console.warn('<sl-button circle>: manca un nome accessibile (aria-label o <sl-icon label>).');
  }
}

private handleClick(event: MouseEvent) {
  if (this.loading || (this.isLink() && this.disabled)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  // ...submit/reset come prima
}

// render(): sostituisce le righe 278 e 282-284
href=${ifDefined(isLink && !this.disabled ? this.href : undefined)}
role=${ifDefined(isLink && this.disabled ? 'link' : undefined)}
aria-disabled=${ifDefined((isLink && this.disabled) || this.loading ? 'true' : undefined)}
aria-busy=${ifDefined(this.loading ? 'true' : undefined)}
aria-label=${ifDefined(this.accessibleLabel || undefined)}
aria-pressed=${ifDefined(this.pressed)}
aria-expanded=${ifDefined(this.expanded)}
aria-haspopup=${ifDefined(this.haspopup)}
aria-current=${ifDefined(isLink ? this.current : undefined)}
tabindex=${ifDefined(isLink && this.disabled ? '-1' : undefined)}
// ...
${this.loading ? html`<sl-spinner part="spinner" aria-hidden="true"></sl-spinner>` : ''}
```
```css
/* button.styles.ts: la label resta nell'albero di accessibilità durante il loading */
.button--loading .button__prefix,
.button--loading .button__label,
.button--loading .button__suffix,
.button--loading .button__caret { visibility: visible; opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .button { transition: none; }
  .button:active:not(.button--disabled) { scale: none; }
}
```

### Non verificabile
- Nome calcolato in stato `loading` (quale testo annuncia NVDA/JAWS/VoiceOver con la label in `visibility:hidden` e lo spinner `role="progressbar"` annidato): richiede test con screen reader.
- Contrasto della variante `text` e `outline` su superfici del consumer diverse da `neutral-0`/`neutral-100`.
- Resa in Windows High Contrast della variante `text` (bordo `transparent`) e dello stato disabled (solo `opacity: 0.5`).
