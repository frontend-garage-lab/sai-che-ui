## Avatar (`<sl-avatar>` – src/components/avatar/avatar.component.ts)
**Pattern APG di riferimento:** nessun pattern APG; WAI-ARIA 1.2 `role="img"` (nome obbligatorio) o immagine decorativa (`aria-hidden`/`role="presentation"`), WCAG 1.1.1.
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 3 · Bassa 1 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Wrapper `role="img"` con `aria-label=${this.label}` (r. 106) e `<img alt="">` interno (r. 80-87) ✅ come pattern; ma `role="img"` resta anche senza label e non esiste una modalità decorativa. |
| 2 | Nome, descrizione, stato | ⚠️ | Con `label` vuota: `role="img"` + `aria-label=""` → immagine senza nome; le iniziali (r. 92) sono figli presentazionali di `role="img"` e non fanno da fallback del nome. Icona di default `aria-hidden` (r. 96) ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID. `aria-label` sull'host resta sull'host senza ruolo (ignorato): il nome va passato con `label`. |
| 4 | Tastiera e focus | N/A | Non interattivo (gli usi cliccabili sono responsabilità del contenitore, es. header item). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Iniziali: `neutral-0` su `neutral-400` = 3.21 (light) / 2.17 (dark). Font = `size * 0.5` → 12px (small), 18px (medium), 24px (large): solo `large` in light passa come testo grande (≥3:1); dark fallisce sempre. Varianti tinted in dark: primary 3.50, accent 3.99 (light 3.69), success 3.68, warning 3.60, danger 4.12 < 4.5 per small/medium. Icona di default in dark 2.17 < 3:1 (1.4.11). Nessuna `forced-colors` (il cerchio pieno diventa invisibile, resta solo il glifo). |
| 8 | API pubblica a11y | ⚠️ | `label` ✅ riflessa su `aria-label` interno; manca un modo di dichiarare l'avatar decorativo; nessun warning in dev se manca `label`. |
| 9 | Documentazione e test | ⚠️ | Docs: "You should always provide a `label`" (r. 8) ✅, nessuna indicazione sul caso decorativo (avatar accanto al nome). Test axe con `ignoredRules = ['color-contrast']` motivato da "avatars aren't used to display text" (test r. 5-7) — falso per le iniziali. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-AVATAR-01 | Media | Aspetti visivi | Contrasto delle iniziali insufficiente: `neutral-0` su `neutral-400` 3.21:1 light / 2.17:1 dark, con testo 12-18 px (small/medium); varianti tinted in dark 3.50-4.12:1. | src/components/avatar/avatar.styles.ts:30-34 `background-color: var(--sl-color-neutral-400); … color: var(--sl-color-neutral-0);`; :81-109 | WCAG 1.4.3 Contrast (Minimum) | Default `background: neutral-600` (6.63/5.70 con testo `neutral-0`) o `neutral-700`; per i tinted usare `-800` su `-100` in dark. |
| SL-AVATAR-02 | Media | Nome / Semantica | Senza `label` il wrapper resta `role="img"` con `aria-label=""`: immagine senza nome accessibile (axe `role-img-alt`); le iniziali non fungono da fallback perché i figli di `img` sono presentazionali. Nessuna modalità decorativa per avatar affiancati al nome visibile (doppia lettura). | src/components/avatar/avatar.component.ts:106 `role="img" aria-label=${this.label}`; :92 | WCAG 1.1.1; 4.1.2 | Se `label` presente → `role="img"` + `aria-label`; altrimenti, se `initials` → `aria-label=initials`; se nessuno dei due o `decorative` → `aria-hidden="true"` senza ruolo. Warning in dev se manca `label` e non è `decorative`. |
| SL-AVATAR-03 | Media | Aspetti visivi | Icona di default (e glifo custom) `neutral-0` su `neutral-400` in dark = 2.17:1 < 3:1 per un oggetto grafico che identifica persona/oggetto. | src/components/avatar/avatar.styles.ts:30, 34; avatar.component.ts:95-100 | WCAG 1.4.11 Non-text Contrast | Stesso fix di SL-AVATAR-01 (fondo `neutral-600`). |
| SL-AVATAR-04 | Bassa | Test | `color-contrast` ignorato in tutti i test axe con motivazione errata ("avatars aren't used to display text"): nasconde SL-AVATAR-01. | src/components/avatar/avatar.test.ts:5-7 | WCAG 1.4.3 (copertura test) | Rimuovere `ignoredRules` almeno nei test con `initials`; aggiungere test senza `label` (atteso `aria-hidden`). |
| SL-AVATAR-05 | Suggerimento | Aspetti visivi | Nessuna media query `forced-colors`: il fondo del cerchio scompare in alto contrasto e resta il solo glifo/iniziali senza confine. | src/components/avatar/avatar.styles.ts:23-38 | Forced colors (buona pratica 1.4.11) | `@media (forced-colors: active) { .avatar { border: 1px solid CanvasText; } }` |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` → `aria-label` | Sì | Parziale | Applicata anche vuota (`aria-label=""`) |
| `decorative` | No | — | Da aggiungere |
| `alt` dell'`<img>` | Sì (`""`) | Sì | Corretto perché il nome è sul wrapper |
| Warning dev senza label | No | — | Da aggiungere |

### Fix proposti
```ts
import { nothing } from 'lit';
/** L'avatar è decorativo (es. affiancato al nome visibile): viene nascosto agli AT. */
@property({ type: Boolean, reflect: true }) decorative = false;

render() {
  const name = this.label || this.initials;
  const hidden = this.decorative || !name;
  return html`
    <div part="base" class="avatar avatar--${this.shape}"
      role=${hidden ? nothing : 'img'}
      aria-label=${hidden ? nothing : name}
      aria-hidden=${hidden ? 'true' : nothing}>
      ${this.renderContent()}
    </div>`;
}
```
```css
.avatar { background-color: var(--sl-color-neutral-600); color: var(--sl-color-neutral-0); }
@media (forced-colors: active) { .avatar { border: 1px solid CanvasText; } }
```

### Non verificabile
- Qualità del testo di `label` (es. "Avatar di Mario Rossi" vs nome utente tecnico come `user_cosy_admin` nei docs, r. 42): contenuto del consumer.
- Contrasto di icone/immagini custom fornite dal consumer.
