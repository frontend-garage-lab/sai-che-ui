## Carousel (`<sl-carousel>` – src/components/carousel/carousel.component.ts)
**Pattern APG di riferimento:** APG Carousel (Auto-Rotating Image Carousel with Buttons / Tabs for Slide Control)
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 0 · Alta 2 · Media 6 · Bassa 4 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Host `role="region"` + slide `group`/`tabpanel` (r. 102, 370-377) ✅ ma mancano `aria-roledescription="carousel"`/`"slide"` (SL-CAROUSEL-03); modello tab per pagina ≠ tabpanel per slide (SL-CAROUSEL-07). |
| 2 | Nome, descrizione, stato | ⚠️ | Pulsanti prev/next con nome localizzato e `aria-disabled` ✅ (r. 591-593, 608-610); dot con nome e `aria-selected` ✅; nome della region generico e sovrascritto (SL-CAROUSEL-04); tablist e scroll container senza nome (SL-CAROUSEL-09, -10). |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | `aria-labelledby="tab-N"` sulle slide (light DOM) → ID nello shadow; `aria-controls="slide-N"` dei tab → ID nel light DOM: riferimenti rotti, test axe li maschera (SL-CAROUSEL-02). |
| 4 | Tastiera e focus | ⚠️ | Frecce/Home/End su scroll container e dot, roving tabindex dot ✅ (r. 639); focus-visible con `--sl-focus-ring` ✅ (styles r. 152-157); frecce intercettate anche dentro i controlli delle slide (SL-CAROUSEL-06); slide fuori vista `inert` ✅ (r. 295). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ❌ | Nessun `aria-live` sul contenitore slide (solo `aria-atomic`/`aria-busy`, r. 569-570) (SL-CAROUSEL-05). |
| 7 | Aspetti visivi | ❌ | Autoplay senza controllo di pausa (SL-CAROUSEL-01); dot inattivi 1.56:1 e invisibili in forced-colors (SL-CAROUSEL-08); scroll rispetta `prefers-reduced-motion` ✅ (r. 266, 513; styles r. 51-55). |
| 8 | API pubblica a11y | ⚠️ | Stringhe localizzate ✅; nessuna property `label`/`slide-label`/`play-label`; aria-label non aggiornato al cambio lingua (SL-CAROUSEL-11). |
| 9 | Documentazione e test | ⚠️ | Test di attributi ARIA presenti (test r. 765-789) ma axe con `ignoredRules: ['aria-valid-attr-value']`; nessun test tastiera; docs autoplay senza indicazioni 2.2.2 (SL-CAROUSEL-12). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-CAROUSEL-01 | Alta | 7/4 | Con `autoplay` non esiste un controllo per mettere in pausa/fermare la rotazione: la pausa avviene solo con hover/focus/touch e riprende all'uscita; `prefers-reduced-motion` non disattiva l'autoplay (agisce solo sul tipo di scroll). | autoplay-controller.ts:23-30 (pause/resume su mouseenter/focusin), carousel.component.ts:451-457 `handleAutoplayChange` | WCAG 2.2.2 (A); APG Carousel "Rotation control" | Pulsante play/pause (primo elemento nel tab order, nome localizzato, stato via label o `aria-pressed`), stop permanente al focus via tastiera, autoplay disattivato con reduced motion. |
| SL-CAROUSEL-02 | Alta | 3 | Riferimenti ID attraverso lo shadow boundary: le slide (light DOM) hanno `aria-labelledby="tab-N"` con ID nello shadow root (e `aria-label` rimosso) → tabpanel senza nome; i tab hanno `aria-controls="slide-N"` verso il light DOM. Inoltre `id="slide-N"` è globale: collide con più carousel e con i cloni (`cloneNode`) in `loop`. | carousel.component.ts:373-377, 406-414, 633-634; carousel.test.ts:789 `ignoredRules: ['aria-valid-attr-value']` | WCAG 4.1.2, 1.3.1 | Mantenere `aria-label` localizzato sulla slide (o `ariaLabelledByElements`); rimuovere `aria-controls` cross-root o usare `ariaControlsElements`; ID univoci prefissati per istanza; rimuovere `id` dai cloni. |
| SL-CAROUSEL-03 | Media | 1 | Mancano `aria-roledescription="carousel"` sull'host e `aria-roledescription="slide"` sulle slide in modalità group. | carousel.component.ts:102, 370-371 | APG Carousel (WAI-ARIA roles) | `setAttribute('aria-roledescription', localize.term('carousel'))`; slide: `aria-roledescription` = termine "slide" localizzato. |
| SL-CAROUSEL-04 | Media | 2/8 | L'`aria-label` dell'host viene impostato a "Carousel" in `connectedCallback`, sovrascrivendo quello del consumer a ogni (ri)connessione; nessuna property `label`. Con più carousel in pagina le region hanno lo stesso nome. | carousel.component.ts:100-104 | WCAG 4.1.2, 2.4.6; APG Carousel | Property `label`; impostare il default solo se l'host non ha già `aria-label`/`aria-labelledby`. |
| SL-CAROUSEL-05 | Media | 6 | Il contenitore delle slide ha `aria-atomic="true"` e `aria-busy` ma nessun `aria-live`: il cambio slide tramite prev/next o dot non viene annunciato. | carousel.component.ts:569-570 | WCAG 4.1.3; APG Carousel (`aria-live="off"` in rotazione, `"polite"` altrimenti) | `aria-live=${this.autoplay && !this.autoplayController.paused ? 'off' : 'polite'}`. |
| SL-CAROUSEL-06 | Media | 4 | `handleKeyDown` sul contenitore riceve i keydown dei contenuti slottati e chiama sempre `preventDefault()` per frecce/Home/End: input, range o testo editabile dentro una slide perdono il movimento del cursore. | carousel.component.ts:169-179, 572 | WCAG 2.1.1 | Ignorare l'evento se `event.target !== event.currentTarget` e non è un pagination item. |
| SL-CAROUSEL-07 | Media | 1 | I tab sono uno per pagina (`getPageCount()`), i tabpanel uno per slide: con `slides-per-page`/`slides-per-move` > 1 ci sono tabpanel senza tab e `aria-controls="slide-{index+1}"` punta alla slide sbagliata. | carousel.component.ts:373-377 vs 623-640 | WCAG 1.3.1; APG Tabs/Carousel | Con più slide per pagina usare `role="group"` per slide e pulsanti "Vai a pagina N" senza semantica tab, o tabpanel per pagina. |
| SL-CAROUSEL-08 | Media | 7 | Dot inattivi `neutral-300` su `neutral-0` = 1.56:1 (light) / 1.64:1 (dark); stato attivo solo colore + `scale(1.2)`; dot resi solo con `background-color` → invisibili in `forced-colors`; dimensione 12px (2.5.8 regge solo per l'eccezione di spaziatura con gap 12px). | carousel.styles.ts:130-149 | WCAG 1.4.11, 1.4.1, 2.5.8; SHARED-02 | Bordo `neutral-500`/`600`, attivo pieno + bordo; `@media (forced-colors: active)` con `border: 1px solid ButtonText` e attivo `background: Highlight`; area cliccabile 24px con padding. |
| SL-CAROUSEL-09 | Bassa | 2 | Lo scroll container è focusabile (`tabindex="0"`) senza ruolo né nome: tab stop generico. | carousel.component.ts:559-571 | WCAG 4.1.2 | `role="group"` + `aria-label` (es. termine "slides") o rimuovere il focus se esistono altri controlli. |
| SL-CAROUSEL-10 | Bassa | 2 | `role="tablist"` della paginazione senza nome accessibile. | carousel.component.ts:622 | APG Tabs ("tablist has a label") | `aria-label` localizzato (es. "Scegli la slide"). |
| SL-CAROUSEL-11 | Bassa | 8 | `aria-label` dell'host e delle slide calcolati una sola volta (`connectedCallback`/`initializeSlides`): al cambio di `lang` restano nella lingua precedente. | carousel.component.ts:103, 371 | WCAG 3.1.2 | Ricalcolarli in `updated()` quando cambia la lingua (LocalizeController aggiorna l'host). |
| SL-CAROUSEL-12 | Bassa | 9 | Axe eseguito ignorando `aria-valid-attr-value` (nasconde SL-CAROUSEL-02); nessun test tastiera; docs autoplay ("pause while the user interacts") senza indicazioni su 2.2.2, nessuna sezione a11y. | carousel.test.ts:789; docs/pages/components/carousel.md:324-326 | Qualità / WCAG 2.2.2 (doc) | Rimuovere l'ignore dopo il fix, test `sendKeys`, sezione Accessibilità. |
| SL-CAROUSEL-13 | Suggerimento | 7 | Transizioni dei dot/pulsanti non disattivate con reduced motion. | carousel.styles.ts:107, 141-143 | WCAG 2.3.3 (AAA); SHARED-05 | Fix trasversale SHARED-05. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `aria-label` sull'host | Default interno | ❌ | Sovrascritto in `connectedCallback` (SL-CAROUSEL-04). Aggiungere `label`. |
| `aria-roledescription` | No | — | SL-CAROUSEL-03. |
| Label prev/next/dot | Solo traduzioni | ✅ | Nessun override puntuale (SHARED-06). |
| Play/pause label | No | — | Da aggiungere con il controllo (SL-CAROUSEL-01). |
| `aria-live` contenitore | No | — | SL-CAROUSEL-05. |
| Label slide | No | ❌ | `aria-label` della slide sovrascritto (vedi sl-carousel-item). |

### Fix proposti
```ts
// SL-CAROUSEL-04 / -03
@property() label = '';
private applyHostSemantics() {
  this.setAttribute('role', 'region');
  this.setAttribute('aria-roledescription', this.localize.term('carousel'));
  if (this.label) this.setAttribute('aria-label', this.label);
  else if (!this.hasAttribute('aria-labelledby') && !this.hasAttribute('aria-label'))
    this.setAttribute('aria-label', this.localize.term('carousel'));
}

// SL-CAROUSEL-02 / -07 – niente IDREF cross-root, nome sempre presente
slide.setAttribute('role', this.pagination && this.slidesPerPage === 1 ? 'tabpanel' : 'group');
slide.setAttribute('aria-roledescription', this.localize.term('slide')); // nuova chiave
if (!slide.hasAttribute('data-consumer-label')) slide.setAttribute('aria-label', this.localize.term('slideNum', index + 1));
slide.removeAttribute('aria-labelledby');
// tab: rimuovere aria-controls oppure button.ariaControlsElements = [slide]

// SL-CAROUSEL-01 / -05
html`<button part="autoplay-toggle" class="carousel__autoplay-toggle"
  aria-label=${this.autoplayController.stopped ? this.localize.term('startAutoplay') : this.localize.term('stopAutoplay')}
  @click=${this.toggleAutoplay}><sl-icon library="system" name=${this.autoplayController.stopped ? 'play' : 'pause'}></sl-icon></button>`;
// scroll container:
//   aria-live=${this.autoplay && !this.autoplayController.stopped && !this.autoplayController.paused ? 'off' : 'polite'}
// @watch('autoplay'): if (prefersReducedMotion()) return; // non avviare

// SL-CAROUSEL-06
private handleKeyDown(event: KeyboardEvent) {
  const fromSlotted = event.composedPath()[0] !== event.currentTarget &&
    !(event.target as HTMLElement).closest('[part~="pagination-item"]');
  if (fromSlotted) return;
  …
}
```
```css
/* SL-CAROUSEL-08 */
.carousel__pagination-item { box-shadow: inset 0 0 0 1px var(--sl-color-neutral-500); }
@media (forced-colors: active) {
  .carousel__pagination-item { border: 1px solid ButtonText; }
  .carousel__pagination-item--active { background-color: Highlight; forced-color-adjust: none; }
}
```

### Non verificabile
- Resa con screen reader del `role="region"` sull'host con contenuto slottato e del passaggio da `inert` ad attivo delle slide durante lo scroll.
- Testo alternativo e contenuto delle slide (consumer).
- Comportamento della pausa su touch (`touchstart`/`touchend`) con VoiceOver iOS/TalkBack.
