## Animated Image (`<sl-animated-image>` – src/components/animated-image/animated-image.component.ts)
**Pattern APG di riferimento:** APG Button (toggle play/pausa); WCAG 2.2.2 Pause, Stop, Hide; 1.1.1
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 1 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12 (asset `docs/assets/images/walk.gif`: 24 frame, 0.96 s per ciclo, NETSCAPE loop = 0 → infinito)

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ❌ | Il toggle è un `@click` sulle `<img>` (r. 93, 105); il control-box è un `<div>` (r. 108-111) con `pointer-events:none` (styles r. 38). Runtime: l'albero contiene solo `image "Animation of untied shoes…"`, nessun `button`; `shadowRoot.querySelectorAll("[tabindex],button").length = 0`. |
| 2 | Nome/descrizione/stato | ❌ | L'immagine ha il nome da `alt` ✅; il controllo play/pausa non esiste per le AT (né nome né stato). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `alt` passato come property alle due `<img>`, alternate con `aria-hidden` + `display:none`: le AT vedono una sola immagine. |
| 4 | Tastiera e focus | ❌ | Tab da `#a`: `focus: button#b` (il componente è saltato); Enter/Space → `play` resta `undefined`; il click del mouse invece → `play = true`. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Con `play` iniziale la GIF in loop infinito non può essere fermata da tastiera (SL-ANIMATED-IMAGE-02). Durante la riproduzione il control-box ha `opacity = 0` senza hover. Target 48x48 px ✅. Reduced motion ignorato (AAA, miglioramento). |
| 8 | API pubblica a11y | ⚠️ | `alt` ✅, `play` ✅ (workaround: il consumer può creare un proprio bottone che commuta `play`). Nessuna etichetta play/pausa né chiave di traduzione (`play`/`pause` assenti in src/translations/en.ts). |
| 9 | Docs e test | ⚠️ | Test axe su elemento senza `src`/`alt` (test r. 13-17); test solo con click; docs senza note a11y. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-ANIMATED-IMAGE-01 | Alta | Tastiera / Semantica | Play/pausa (funzione principale) solo con click del mouse sulle `<img>`: nessun elemento focusabile, nessun ruolo/nome/stato, Enter/Space senza effetto. Workaround solo costruendo un bottone esterno che imposta `play`. | animated-image.component.ts:93, 105 (`@click` su `<img>`), :108-111 (`<div part="control-box">`); animated-image.styles.ts:38 (`pointer-events: none`) | runtime: `tab` → `focus: button#b`; `key:Enter ;; key:Space` → `play = undefined`; `click` → `play = true`; ax: solo `image "…"` | 2.1.1 (A), 4.1.2 (A); APG Button | Trasformare il control-box in `<button type="button">` con `aria-label` localizzato play/pausa (o `aria-pressed`), `pointer-events:auto`, `:focus-visible`. |
| SL-ANIMATED-IMAGE-02 | Media | Aspetti visivi / Tastiera | Con `play` impostato al caricamento, la GIF (loop infinito, >5 s) parte automaticamente accanto ad altro contenuto e l'unico modo di fermarla è il click del mouse; da tastiera non esiste un meccanismo di pausa e il control-box è invisibile (`opacity 0`). | animated-image.component.ts:45 (`play`), :69-77; animated-image.styles.ts:46-48 | runtime (con `reducedmotion`): `play = true`; `tab ;; tab` → `focus: button#b`, poi `body`; `control-box opacity = 0`; walk.gif loop = 0 (infinito) | 2.2.2 (A) | Stesso bottone di SL-ANIMATED-IMAGE-01, visibile anche con `:host(:focus-within)`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-ANIMATED-IMAGE-M01 | consumer | Senza `alt` Lit rende `alt=""` e Chromium espone `image` senza nome: il consumer deve passare `alt`. Suggerito un warning in dev se `alt` è `undefined`. | animated-image.component.ts:42, 90, 103; runtime `["|true","|false"]` e `image` senza nome |
| SL-ANIMATED-IMAGE-M02 | miglioramento | `prefers-reduced-motion` ignorato: con `play` la GIF parte anche con reduce (`play = true` sotto `reducedmotion`). 2.3.3 è AAA. | animated-image.component.ts:69-77 |
| SL-ANIMATED-IMAGE-M03 | miglioramento | Control-box nascosto durante la riproduzione senza hover (`opacity 0`): dopo il fix va mostrato anche con `:focus-within` (altrimenti 2.4.7). | animated-image.styles.ts:42-48 |
| SL-ANIMATED-IMAGE-M04 | miglioramento | Mancano `play-label`/`pause-label` e chiavi localize: necessarie per il bottone del fix. | animated-image.component.ts:109-110; src/translations/en.ts |
| SL-ANIMATED-IMAGE-M05 | miglioramento | Test axe senza `src`/`alt`, nessun test da tastiera, docs senza note a11y. | animated-image.test.ts:13-17; docs/pages/components/animated-image.md:26-28 |
| SL-ANIMATED-IMAGE-M06 | consumer | Contrasto icone bianche su `rgb(0 0 0 / 50%)` sopra l'immagine e lampeggi (2.3.1): dipendono dall'asset. | animated-image.styles.ts:33-37 |
| SL-ANIMATED-IMAGE-M07 | da-verificare-AT | Dopo il fix: annuncio del cambio di nome/stato del bottone (NVDA, JAWS, VoiceOver). | — |

### Responsabilità del consumer
- Passare sempre `alt` (o `alt=""` solo se decorativa).
- Finché manca il fix: non usare `play` iniziale oppure fornire un bottone esterno accessibile che commuta `play`.
- Verificare che l'animazione non contenga più di 3 lampeggi al secondo.

### Da verificare con AT reali
- Dopo il fix, NVDA/JAWS/VoiceOver: annuncio di "Riproduci"/"Pausa" o di `aria-pressed` al cambio di stato.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-ANIMATED-IMAGE-01 | Alta | confermato | Tab salta il componente, Enter/Space senza effetto, nessun button nell'albero; workaround solo via `play` da bottone esterno → Alta (non Blocker). |
| SL-ANIMATED-IMAGE-02 | Alta | ridimensionato | Confermato (loop infinito, nessuna pausa da tastiera), ma solo nella variante con `play` iniziale (default in pausa) → Media. |
| SL-ANIMATED-IMAGE-03 | Media | riclassificato | `alt` mancante è uso scorretto del consumer → SL-ANIMATED-IMAGE-M01. |
| SL-ANIMATED-IMAGE-04 | Media | riclassificato | Reduced motion è 2.3.3 (AAA) → SL-ANIMATED-IMAGE-M02. |
| SL-ANIMATED-IMAGE-05 | Bassa | riclassificato | Oggi non c'è nulla da mettere a fuoco; diventa requisito del fix → SL-ANIMATED-IMAGE-M03. |
| SL-ANIMATED-IMAGE-06 | Bassa | riclassificato | Etichette mancanti fanno parte del fix di 01 → SL-ANIMATED-IMAGE-M04. |
| SL-ANIMATED-IMAGE-07 | Bassa | riclassificato | Test/docs → SL-ANIMATED-IMAGE-M05. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `alt` | Sì | Sì: `image "Animation of untied shoes walking on pavement"` | Sì |
| `play` | Sì | Riflesso; stato non esposto (nessun controllo) | Sì, da esporre sul bottone |
| `play-label` / `pause-label` | No | — | Sì, per il bottone del fix (con default localizzati) |

### Fix proposti
```ts
// animated-image.component.ts — al posto del <div part="control-box"> (r. 108-111) e dei @click sulle <img> (r. 93, 105)
private readonly localize = new LocalizeController(this);
@property({ attribute: 'play-label' }) playLabel?: string;
@property({ attribute: 'pause-label' }) pauseLabel?: string;

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
/* animated-image.styles.ts */
.animated-image__control-box { pointer-events: auto; cursor: pointer; padding: 0; }
.animated-image__control-box:focus-visible { outline: var(--sl-focus-ring); outline-offset: var(--sl-focus-ring-offset); }
:host([play]:focus-within) .animated-image__control-box { opacity: 1; }
```
Aggiungere le chiavi `playAnimation` / `pauseAnimation` in `src/translations/*.ts`.
