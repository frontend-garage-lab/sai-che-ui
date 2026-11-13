## Icon Button (`sl-icon-button` – src/components/icon-button/icon-button.component.ts)
**Pattern APG di riferimento:** APG Button pattern (anche toggle button) · APG Link pattern (con `href`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 4 · Bassa 2 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<button type="button">` / `<a href>` nativi ✅; `role="button"`, `tabindex="0"`, `aria-disabled="false"` ridondanti (r. 127-130). |
| 2 | Nome, descrizione, stato | ❌ | Nome solo da `label`, default `''` → `aria-label=""` emesso sempre (r. 56, 129): senza `label` il bottone non ha nome e non c'è warning. Icona interna `aria-hidden="true"` ✅ (r. 140). Nessuno stato pressed/expanded. |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | `aria-label` scritto dal consumer sull'host non viene propagato (SHARED §2); `sl-dropdown` inietta `aria-haspopup/expanded` sul `.icon-button` interno (dropdown.component.ts:319-327) ✅. |
| 4 | Tastiera e focus | ⚠️ | Enter/Space nativi; `:focus-visible` con `outline: var(--sl-focus-ring)` (styles r. 48-51) ✅ anche in forced-colors. Link disabilitato: `href` mantenuto, `tabindex=-1` (SL-ICON-BUTTON-03). |
| 5 | Form e validazione | N/A | Sempre `type="button"`, non partecipa ai form. |
| 6 | Live region | N/A | Nessun feedback asincrono. |
| 7 | Aspetti visivi | ⚠️ | Icone: neutral-600 su bianco 6.63 / dark 5.70 ✅; varianti tenui light: primary 5.87, danger 4.26, warning 4.38, accent **3.02** (al limite) e in hover accent **2.49 ❌**. Target `size="small"`: 14px + 2×4px = **22px** < 24 (SL-ICON-BUTTON-04). |
| 8 | API pubblica a11y | ⚠️ | `label` presente e riflesso come `aria-label` ✅ ma senza `ifDefined`/`nothing`; mancano `aria-pressed`, `aria-expanded`, `aria-controls`, `aria-current`, warning dev mode. |
| 9 | Documentazione e test | ⚠️ | Docs: tutti gli esempi hanno `label` ✅, esempio con tooltip ✅; toolbar Bold/Italic/Underline senza stato pressed (icon-button.md:109-112). Test: **nessun** `to.be.accessible()`; test su `aria-label` interno ✅ (test r. 113-127). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-ICON-BUTTON-01 | Alta | 2/8 Nome obbligatorio | `label` è opzionale (default `''`) e viene sempre renderizzato `aria-label="${this.label}"`: senza `label` il bottone icon-only ha `aria-label=""` e icona `aria-hidden` → **nessun nome accessibile**, nessun warning in dev mode. Un `aria-label` messo dal consumer sull'host (pratica comune) resta sull'host e non nomina il bottone. | src/components/icon-button/icon-button.component.ts:56 `label = ''`; 129 `aria-label="${this.label}"`; 140 `aria-hidden="true"` | WCAG 4.1.2, 1.1.1; APG Button | Leggere `aria-label` dell'host come fallback, usare `ifDefined(this.label \|\| undefined)`, `console.warn` in dev se manca il nome; in alternativa usare il nome dell'icona come ultima risorsa solo in dev. |
| SL-ICON-BUTTON-02 | Media | 2/8 Stati | Nessuna API per `aria-pressed` (toggle), `aria-expanded`/`aria-controls` (disclosure fuori da `sl-dropdown`), `aria-current`. La docs mostra una toolbar Bold/Italic/Underline (tipici toggle) senza stato esposto. | icon-button.component.ts:118-134; docs/pages/components/icon-button.md:109-112 | WCAG 4.1.2; APG Button (toggle button) | Property `pressed`, `expanded`, `controls`, `current` riflesse sul tag interno con `ifDefined`. |
| SL-ICON-BUTTON-03 | Media | 4/7 Link disabilitato | Con `href` + `disabled`: `href` resta (r. 123), `tabindex="-1"`, la classe `--disabled` non viene applicata ai link (r. 120 `!isLink && this.disabled`) → nessun indizio visivo; il link è comunque raggiungibile col cursore virtuale e apribile da menu contestuale/click centrale. | icon-button.component.ts:120, 123, 128-130, 90-95 | WCAG 4.1.2, 1.3.1 | Rimuovere `href` quando disabilitato e impostare `role="link"` + `aria-disabled="true"`; applicare la classe disabled anche ai link. |
| SL-ICON-BUTTON-04 | Media | 7 Target size | `size="small"` (consigliato in docs per le azioni di riga in tabella): font-size 14px + padding 2×4px = 22×22px, sotto i 24×24 di WCAG 2.5.8 (l'eccezione "spacing" dipende dal layout del consumer). | src/components/icon-button/icon-button.styles.ts:155-158; src/themes/light.css:448, 451 | WCAG 2.5.8 | `min-width/min-height: 24px` su `.icon-button` (o padding 5px) mantenendo l'icona a 14px. |
| SL-ICON-BUTTON-05 | Media | 7 Contrasto | Variante `accent` tenue: icona accent-600 su accent-50 **3.02:1** a riposo e **2.49:1** in hover (wash `color-mix(currentColor 18%)`), sotto 3:1 per componenti grafici necessari a capire il controllo. | icon-button.styles.ts:79-82, 104-111 | WCAG 1.4.11 | Usare accent-700 per l'icona (light) o ridurre il wash in hover per la variante accent. |
| SL-ICON-BUTTON-06 | Bassa | 1 Semantica | ARIA ridondante: `role="button"` su `<button>`, `tabindex="0"`, `aria-disabled="false"` sempre presente e duplicato di `disabled`. | icon-button.component.ts:127-130 | ARIA in HTML | Rimuovere `role`/`tabindex` sul button; `aria-disabled` solo sui link. |
| SL-ICON-BUTTON-07 | Bassa | 9 Test | Nessun test axe; nessun test sul caso senza `label`, sul link disabilitato e sulla tastiera. | src/components/icon-button/icon-button.test.ts:8-181 (0 occorrenze di `accessible()`) | — (qualità) | Aggiungere `await expect(el).to.be.accessible()` con/ senza label (il secondo deve fallire o avvisare). |
| SL-ICON-BUTTON-08 | Suggerimento | 2 Nome visibile | Il nome è solo per AT: gli utenti vedenti (cognitivo, voice control "clicca Impostazioni") non vedono il testo; il tooltip è a carico del consumer. | docs/pages/components/icon-button.md:277-283 | WCAG 2.5.3 (buona pratica), 1.1.1 | Documentare l'abbinamento obbligatorio con `sl-tooltip content` uguale a `label`, o opzione `show-tooltip`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | Sì | Parziale | Riflesso come `aria-label` interno ✅; vuoto → `aria-label=""` (usare `ifDefined`). |
| `aria-label` sull'host | No | No | Resta sull'host; usare come fallback di `label`. |
| `disabled` | Sì | Parziale | `<button disabled>` ✅; sui link vedi SL-ICON-BUTTON-03. |
| `aria-pressed` | No | — | Da aggiungere (toolbar/toggle). |
| `aria-expanded` / `aria-controls` / `aria-haspopup` | No | Solo via `sl-dropdown` | Da aggiungere. |
| `aria-current` | No | — | Da aggiungere per link di navigazione. |
| `aria-describedby` | No | — | Opzionale; tooltip/descrizione solo via `sl-tooltip`. |
| warning dev mode | No | — | Da aggiungere. |

### Fix proposti
```ts
// icon-button.component.ts
@property() label = '';
@property({ attribute: 'aria-pressed' }) pressed?: 'true' | 'false' | 'mixed';
@property({ attribute: 'aria-expanded' }) expanded?: 'true' | 'false';
@property({ attribute: 'aria-current' }) current?: string;

private get accessibleName() {
  return this.label || this.getAttribute('aria-label') || undefined;
}

updated() {
  if (import.meta.env?.DEV !== false && !this.accessibleName) {
    console.warn(`<sl-icon-button name="${this.name ?? ''}">: manca l'attributo "label" (nome accessibile obbligatorio).`);
  }
}

// render(): sostituisce le righe 120-130
class="icon-button ... ${this.disabled ? ' icon-button--disabled' : ''} ..."
href=${ifDefined(isLink && !this.disabled ? this.href : undefined)}
role=${ifDefined(isLink && this.disabled ? 'link' : undefined)}
aria-disabled=${ifDefined(isLink && this.disabled ? 'true' : undefined)}
aria-label=${ifDefined(this.accessibleName)}
aria-pressed=${ifDefined(isLink ? undefined : this.pressed)}
aria-expanded=${ifDefined(this.expanded)}
aria-current=${ifDefined(isLink ? this.current : undefined)}
tabindex=${ifDefined(isLink && this.disabled ? '-1' : undefined)}
```
```css
/* icon-button.styles.ts */
.icon-button { min-width: 24px; min-height: 24px; justify-content: center; }
.icon-button--accent { color: var(--sl-color-accent-700); }
```

### Non verificabile
- Contrasto dell'icona (default `neutral-600`, ereditato) sulle superfici del consumer, es. header petrolio citato nel commento di styles r. 27-29.
- Rispetto dell'eccezione "spacing" di WCAG 2.5.8 per `size="small"` nelle tabelle del consumer.
- Annuncio effettivo con screen reader quando il consumer usa solo `aria-label` sull'host.
