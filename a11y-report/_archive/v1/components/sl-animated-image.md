## Animated Image (`<sl-animated-image>` – src/components/animated-image/animated-image.component.ts)
**Pattern APG di riferimento:** APG Button pattern (toggle play/pausa); WCAG 2.2.2 Pause, Stop, Hide; WCAG 1.1.1 testo alternativo
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 0 · Alta 2 · Media 2 · Bassa 3 · Suggerimento 0

La riproduzione si avvia e si mette in pausa solo con il click del mouse sugli `<img>`. Non c'è un controllo focusabile, nominato o con stato, quindi la funzione principale del componente non si usa da tastiera né con le tecnologie assistive. Con `play` impostato dal consumer, chi naviga da tastiera non può fermare l'animazione.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ❌ | Il toggle è un `@click` su `<img>` (r. 93, 105). Non esiste un `<button>`: il control-box è un `<div>` con `pointer-events: none` (styles r. 38). Le due `<img>` sono alternate con `aria-hidden` + `display:none` (r. 92, 104; styles r. 19-21), quindi le AT vedono un'unica immagine, coerente. |
| 2 | Nome, descrizione, stato | ❌ | Il nome dell'immagine c'è se il consumer passa `alt`. Il controllo play/pausa non ha né nome né stato (playing/paused). Le icone `sl-icon` senza `label` diventano `aria-hidden="true"` (icon.component.ts:144-146) ✅. Se `alt` manca, Lit rende `alt=""` e l'immagine diventa decorativa senza avviso (SL-ANIMATED-IMAGE-03). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `alt` è passato come property ✅. Un `aria-label`/`aria-describedby` scritto sull'host resta sull'host (host senza ruolo, shared §2). Nessun riferimento ID interno. |
| 4 | Tastiera e focus | ❌ | Nessun elemento focusabile, nessun gestore per Enter/Space, nessun `:focus-visible` (SL-ANIMATED-IMAGE-01). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Il cambio di stato è comunicato dal controllo stesso (dopo il fix), non da una live region. |
| 7 | Aspetti visivi | ⚠️ | Paused di default ✅ (`play` non impostato). `prefers-reduced-motion` ignorato (SL-ANIMATED-IMAGE-04). Il control-box sparisce quando l'immagine è in riproduzione e il mouse non è sopra (styles r. 46-48): da tastiera o touch non c'è affordance (SL-ANIMATED-IMAGE-05). Icone bianche su `rgb(0 0 0 / 50%)` sopra l'immagine: contrasto NON VERIFICABILE. Target 48px (`--control-box-size: 3rem`) ✅. `forced-colors`: il background viene rimosso e il bordo `currentColor` resta. |
| 8 | API pubblica a11y | ❌ | Solo `alt`. Mancano `play-label`/`pause-label` e chiavi localize (SL-ANIMATED-IMAGE-06). Nessun warning in dev se manca `alt`. |
| 9 | Documentazione e test | ⚠️ | Il test axe gira sull'elemento vuoto, senza `src` né `alt` (test r. 13-17), quindi non verifica nulla di utile. I test play/pausa usano solo il click (r. 31-55). Docs senza indicazioni a11y (SL-ANIMATED-IMAGE-07). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-ANIMATED-IMAGE-01 | Alta | 1 / 2 / 4 | Il toggle play/pausa è un click su `<img>`: non è focusabile, non risponde a Enter/Space e non ha ruolo, nome o stato. Il control-box è un `div` decorativo con `pointer-events:none`. | src/components/animated-image/animated-image.component.ts:93,105 `@click=${this.handleClick}` su `<img>`; :108-111 `<div part="control-box">`; animated-image.styles.ts:38 | WCAG 2.1.1, 4.1.2; APG Button pattern | Trasformare il control-box in `<button type="button">` con `aria-label` play/pausa localizzato (o `aria-pressed`), focusabile, con `:focus-visible { outline: var(--sl-focus-ring) }`. |
| SL-ANIMATED-IMAGE-02 | Alta | 4 / 7 | Con `play` impostato dal consumer, l'animazione parte subito (spesso GIF in loop infinito) e chi usa la tastiera non può fermarla, perché manca un meccanismo di pausa accessibile. | animated-image.component.ts:44-45 `@property(...) play`; :69-77 | WCAG 2.2.2 (A) | Risolto con il bottone di SL-ANIMATED-IMAGE-01; in più documentare che `play` iniziale richiede un controllo di pausa visibile. |
| SL-ANIMATED-IMAGE-03 | Media | 2 / 8 | `alt` è facoltativo e senza default. Con `alt` non definito Lit rende `alt=""` (immagine decorativa) su entrambe le `<img>`, senza warning: il consumer non si accorge che manca il testo alternativo. | animated-image.component.ts:42 `@property() alt: string;`; :90 e :103 `alt=${this.alt}` | WCAG 1.1.1 | Warning in dev mode se `alt` è `undefined`; usare `alt=""` solo se il consumer lo passa esplicitamente vuoto (decorativo); docs. |
| SL-ANIMATED-IMAGE-04 | Media | 7 | `prefers-reduced-motion` non viene considerato: con `play` iniziale la GIF/WEBP si avvia anche se l'utente ha chiesto meno movimento. | animated-image.component.ts:69-77 (nessun uso di `prefersReducedMotion()` da src/internal/animate.ts:36) | WCAG 2.3.3 (AAA), supporto a 2.2.2 | In `firstUpdated`, se `prefersReducedMotion()` è vero, forzare `play = false` (con un opt-out `ignore-reduced-motion`). |
| SL-ANIMATED-IMAGE-05 | Bassa | 7 | Durante la riproduzione il control-box è visibile solo al passaggio del mouse (`:host([play]:not(:hover))` → opacity 0): da tastiera o touch non si vede che si può mettere in pausa, né lo stato attuale. | animated-image.styles.ts:42-48 | WCAG 2.4.7 (dopo il fix), 1.3.3 buona pratica | Mostrare il control-box anche con `:host(:focus-within)` e, in reduced motion o su touch, renderlo sempre visibile. |
| SL-ANIMATED-IMAGE-06 | Bassa | 8 | Non ci sono etichette play/pausa né chiavi in LocalizeController (`play`/`pause` mancano tra le chiavi disponibili, shared §1); il nome del futuro bottone non è configurabile. | animated-image.component.ts:109-110 (icone senza `label`) | WCAG 4.1.2, 3.1.2; SHARED-06 | Aggiungere le property `play-label` e `pause-label` e le chiavi `playAnimation`/`pauseAnimation` nelle traduzioni. |
| SL-ANIMATED-IMAGE-07 | Bassa | 9 | Il test axe usa un elemento senza `src`/`alt` (il ramo con le immagini e il control-box non viene mai renderizzato), mancano test di tastiera e le docs non parlano di a11y. | src/components/animated-image/animated-image.test.ts:13-17; docs/pages/components/animated-image.md:26-28 | Buona pratica | Test axe dopo `sl-load` con `alt`, test Enter/Space sul bottone e sezione docs su `alt`, pausa e reduced motion. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `alt` | Sì | Sì, su entrambe le `<img>` | Warning se `undefined`; distinguere tra decorativo esplicito e mancante. |
| `play` | Sì | — | Esporre lo stato sul controllo (`aria-label` dinamico o `aria-pressed`). |
| `play-label` / `pause-label` | No | — | Da aggiungere, con default localizzati. |
| `aria-label` sull'host | No (resta sull'host) | No | Non necessario se `alt` è usato correttamente. |

### Fix proposti
```ts
import { LocalizeController } from '../../utilities/localize.js';
import { prefersReducedMotion } from '../../internal/animate.js';

private readonly localize = new LocalizeController(this);

/** Nome accessibile del bottone quando l'animazione è in pausa. */
@property({ attribute: 'play-label' }) playLabel?: string;
/** Nome accessibile del bottone quando l'animazione è in riproduzione. */
@property({ attribute: 'pause-label' }) pauseLabel?: string;

firstUpdated() {
  if (this.play && prefersReducedMotion()) this.play = false;
}

updated() {
  if (this.alt === undefined) console.warn('<sl-animated-image>: manca "alt" (usa alt="" se decorativa).');
}

// render(): al posto del <div part="control-box"> e dei @click sulle <img>
html`
  <button
    type="button"
    part="control-box"
    class="animated-image__control-box"
    aria-label=${this.play
      ? (this.pauseLabel ?? this.localize.term('pauseAnimation'))
      : (this.playLabel ?? this.localize.term('playAnimation'))}
    @click=${this.handleClick}
  >
    <slot name="play-icon"><sl-icon name="play-fill" library="system"></sl-icon></slot>
    <slot name="pause-icon"><sl-icon name="pause-fill" library="system"></sl-icon></slot>
  </button>
`;
```
```css
.animated-image__control-box { pointer-events: auto; cursor: pointer; padding: 0; }
.animated-image__control-box:focus-visible { outline: var(--sl-focus-ring); outline-offset: var(--sl-focus-ring-offset); }
:host([play]:focus-within) .animated-image__control-box { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .animated-image__control-box { transition: none; } }
```

### Non verificabile
- Contrasto delle icone (bianco su nero al 50%) e del bordo del control-box: dipende dall'immagine sottostante, va verificato col contenuto reale.
- Contenuto dell'animazione: se contiene lampeggi oltre 3 al secondo (WCAG 2.3.1) dipende dall'asset del consumer.
- Annuncio del cambio di stato del bottone con gli screen reader (dopo il fix).
