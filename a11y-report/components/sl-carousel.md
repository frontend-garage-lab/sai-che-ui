## Carousel (`<sl-carousel>` – src/components/carousel/carousel.component.ts)
**Pattern APG di riferimento:** APG Carousel (Auto-Rotating Image Carousel; Tabs for Slide Control)
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 1 · Media 3 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `region "Carousel"`; slide `group "Slide 1"` senza paginazione, `tabpanel` con paginazione; `tablist > tab [selected]`. Manca `aria-roledescription` (miglioramento). |
| 2 | Nome/descrizione/stato | ⚠️ | `button "Previous slide" [disabled]` / `"Next slide"`, `tab "Slide 1" [selected]`, `tab "Go to slide 2 of 3"` ✅. Con paginazione i `tabpanel` sono senza nome (SL-CAROUSEL-02). `aria-label` del consumer sovrascritto con "Carousel" (`aria-labelledby` funziona). |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | `aria-labelledby="tab-N"` sulle slide (light DOM) → ID nello shadow: non risolto; `aria-controls="slide-N"` dei tab non risolto (nessun `controls=` nei tab); axe `aria-valid-attr-value (critical)`. `aria-controls="scroll-container"` di prev/next risolto (`controls=[scroll-container]`). |
| 4 | Tastiera e focus | ❌ | Ordine Tab: scroll container → prev → next → tab attivo (roving) ✅; ←/→ sui tab spostano focus e slide ✅. Le frecce in un `<input>` dentro una slide cambiano slide, il cursore non si muove e il focus finisce su `body` (SL-CAROUSEL-06). Focus visibile anche in `forcedcolors` (`outlineStyle = solid`). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Nessun `aria-live` sul contenitore: miglioramento APG (il focus resta sul controllo, il cui nome/stato cambia). |
| 7 | Aspetti visivi | ❌ | Autoplay senza controllo di pausa/stop (SL-CAROUSEL-01). Dot inattivi 1.56:1 light / 1.65:1 dark e invisibili in forced colors (SL-CAROUSEL-08). Prev/next 6.64:1 / 5.72:1, 40×40 px ✅; dot 12 px con centri a 24 px (eccezione spacing 2.5.8 ✅). |
| 8 | API pubblica a11y | ⚠️ | Nessuna property `label`; stringhe da `LocalizeController` ✅; nessun controllo play/pause. |
| 9 | Docs e test | ⚠️ | Il test axe ignora `aria-valid-attr-value` (che a runtime fallisce); docs autoplay senza indicazioni 2.2.2. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-CAROUSEL-01 | Alta | Visivo/Tastiera | Con `autoplay` non c'è un controllo per fermare la rotazione: la pausa dura solo finché mouse/focus sono sul componente e la rotazione riprende all'uscita; `prefers-reduced-motion` non la ferma. Il consumer deve costruire da sé un pulsante che commuti `autoplay` (non documentato). | autoplay-controller.ts:23-30 (pause/resume su mouseenter/focusin/focusout), :60-72; carousel.component.ts:451-457 | runtime (interval 1000): `activeSlide 0 → 2` in 2,1 s; nessun pulsante play/pause nell'albero (`region > tabpanel, tablist`); focus dentro → `2 → 2`; focus fuori → `2 → 1`; con `reducedmotion` stesso comportamento (`0 → 2`) | 2.2.2 (A); APG Carousel "rotation control" | Pulsante play/pause nello shadow (primo nel tab order, nome localizzato), stop permanente al focus da tastiera, niente autoplay con reduced motion |
| SL-CAROUSEL-02 | Media | Shadow DOM/ARIA | Con `pagination` le slide diventano `tabpanel` con `aria-labelledby="tab-N"` (ID nello shadow root) e senza `aria-label`: i pannelli non hanno nome; `aria-controls="slide-N"` dei tab (verso il light DOM) non viene risolto. | carousel.component.ts:373-377, :633-634 | runtime: `tabpanel` (×3) senza nome; `tab "Slide 1" [selected]` senza `controls=`; slide `slide-1|tabpanel|tab-1|` (nessun aria-label); axe `aria-valid-attr-value (critical): sl-carousel,#tab-1` | 1.3.1, 4.1.2 | Non rimuovere `aria-label` dalla slide (o `ariaLabelledByElements`), rimuovere `aria-controls` cross-root (o `ariaControlsElements`) |
| SL-CAROUSEL-06 | Media | Tastiera | `handleKeyDown` sul contenitore riceve i keydown dei controlli nelle slide e fa sempre `preventDefault()` + cambio slide: in un campo di testo le frecce non muovono il cursore, la slide corrente diventa `inert` e il focus viene perso. | carousel.component.ts:169-179 (`event.preventDefault()` senza controllo del target), :572 | runtime: `<input>` nella slide 1, cursore a 3, `key ArrowLeft/ArrowRight/ArrowRight` → `[selectionStart 3, activeSlide 2]`; con una sola freccia → `focus: body`, slide 1 `inert=true` | 2.1.1, 2.4.3 | Ignorare l'evento se il target non è lo scroll container o un pagination item |
| SL-CAROUSEL-08 | Media | Visivo | I dot inattivi (pulsanti `tab`) non sono percepibili: `neutral-300` sullo sfondo sotto 3:1; in forced colors spariscono tutti (solo `background-color`, nessun bordo). | carousel.styles.ts:130-149 | runtime: light `#cbd0d2 su #ffffff = 1.56:1`, dark `#353d41 su #0f161a = 1.65:1`; attivo 9.07:1 / 8.75:1; `forcedcolors`: `backgroundColor = rgb(255,255,255)` per attivo e inattivo, `borderTopStyle = none` | 1.4.11 | Bordo `neutral-500`/`600` sui dot; `@media (forced-colors: active)` con `border: 1px solid ButtonText` e attivo `background: Highlight` |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-CAROUSEL-03 | miglioramento | Aggiungere `aria-roledescription="carousel"`/`"slide"` (raccomandazione APG). | carousel.component.ts:102, :370 |
| SL-CAROUSEL-04 | miglioramento | `aria-label` del consumer sovrascritto da "Carousel" in `connectedCallback` (`aria-label="Offerte"` → `"Carousel"`). `aria-labelledby` funziona (`region "Prodotti in evidenza"`). Aggiungere `label` o non sovrascrivere. | carousel.component.ts:100-104 |
| SL-CAROUSEL-05 | miglioramento | `aria-live="polite"` sul contenitore quando non ruota (APG). | carousel.component.ts:569-570 |
| SL-CAROUSEL-07 | miglioramento | Con `slides-per-page="2"`: 4 `tabpanel` e 2 `tab` ("Go to slide 2 of 2" porta alle slide 3-4). Oggi senza effetto osservabile perché `aria-controls` non è risolto; da correggere insieme a SL-CAROUSEL-02. | carousel.component.ts:373-377, :623-640 |
| SL-CAROUSEL-10 | miglioramento | `tablist` senza nome (consigliato da APG, non richiesto). | carousel.component.ts:622 |
| SL-CAROUSEL-11 | miglioramento | `aria-label` di host/slide calcolati una sola volta: non seguono un cambio di lingua a runtime. | carousel.component.ts:103, :371 |
| SL-CAROUSEL-12 | miglioramento | Rimuovere `ignoredRules: ['aria-valid-attr-value']` dal test axe dopo il fix; test tastiera; docs 2.2.2. | carousel.test.ts:789 |
| SL-CAROUSEL-13 | miglioramento | Transizioni dei dot con reduced motion (2.3.3 è AAA). | carousel.styles.ts:141-143 |

### Responsabilità del consumer
- Testo alternativo delle immagini e contenuto delle slide.
- Nominare il carousel con `aria-labelledby` (l'`aria-label` viene sovrascritto) quando in pagina ce n'è più di uno.
- Con `autoplay`, finché SL-CAROUSEL-01 non è corretto: fornire un pulsante che commuti `autoplay`.

### Da verificare con AT reali
- SL-CAROUSEL-09: lo scroll container focusabile è esposto come `generic "Slide 3" [focused]` (nome dal contenuto, nessun ruolo): verificare cosa annunciano NVDA/JAWS/VoiceOver al focus.
- Pausa su touch (`touchstart`/`touchend`) con VoiceOver iOS / TalkBack.
- Lettura delle slide `inert`/`aria-hidden` durante lo scroll con cloni (`loop`).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-CAROUSEL-01 | Alta | confermato | Nessun controllo di stop; la rotazione riprende dopo hover/focus, anche con reduced motion (runtime). |
| SL-CAROUSEL-02 | Alta | ridimensionato → Media | Riferimenti non risolti e pannelli senza nome dimostrati; il contenuto delle slide e i tab restano nominati. |
| SL-CAROUSEL-03 | Media | riclassificato (miglioramento) | `aria-roledescription` è raccomandazione APG, non requisito WCAG. |
| SL-CAROUSEL-04 | Media | riclassificato (miglioramento) | La region ha sempre un nome; `aria-labelledby` del consumer funziona. |
| SL-CAROUSEL-05 | Media | riclassificato (miglioramento) | Il focus resta sul controllo che cambia nome/stato; 4.1.3 non dimostrato. |
| SL-CAROUSEL-06 | Media | confermato | Frecce in un input cambiano slide e fanno perdere il focus (runtime). |
| SL-CAROUSEL-07 | Media | riclassificato (miglioramento) | Discrepanza reale, ma senza effetto osservabile finché `aria-controls` non è risolto. |
| SL-CAROUSEL-08 | Media | confermato | 1.56:1 / 1.65:1 e dot invisibili in forced colors (runtime). |
| SL-CAROUSEL-09 | Bassa | riclassificato (da-verificare-AT) | Chromium espone un nome dal contenuto; l'annuncio dipende dall'AT. |
| SL-CAROUSEL-10 | Bassa | riclassificato (miglioramento) | Nome del tablist non obbligatorio. |
| SL-CAROUSEL-11 | Bassa | riclassificato (miglioramento) | Non dimostrabile (traduzioni non registrate), scenario raro. |
| SL-CAROUSEL-12 | Bassa | riclassificato (miglioramento) | Test/docs. |
| SL-CAROUSEL-13 | Suggerimento | riclassificato (miglioramento) | AAA. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `aria-label` sull'host | Default interno | ❌ sovrascritto (`"Offerte"` → `"Carousel"`) | Sì, oppure `label` |
| `aria-labelledby` sull'host | — | ✅ `region "Prodotti in evidenza"` | Workaround valido |
| Label prev/next/dot | Traduzioni | ✅ `button "Next slide"`, `tab "Go to slide 2 of 3"` | Sì |
| Play/pause | No | — | Sì (SL-CAROUSEL-01) |
| `autoplay` / `autoplay-interval` | Sì | ✅ | — |

### Fix proposti
```ts
// SL-CAROUSEL-01 – controllo di rotazione + stop permanente
@state() private autoplayStoppedByUser = false;
html`<button part="autoplay-toggle" class="carousel__autoplay-toggle" type="button"
  aria-label=${this.autoplayStoppedByUser ? this.localize.term('startAutoplay') : this.localize.term('stopAutoplay')}
  @click=${this.toggleAutoplay}>
  <sl-icon library="system" name=${this.autoplayStoppedByUser ? 'play' : 'pause'}></sl-icon>
</button>`; // renderizzato solo con autoplay, prima dello scroll container
@watch('autoplay')
handleAutoplayChange() {
  this.autoplayController.stop();
  if (this.autoplay && !prefersReducedMotion() && !this.autoplayStoppedByUser) {
    this.autoplayController.start(this.autoplayInterval);
  }
}
// focus da tastiera (focusin con :focus-visible) → autoplayStoppedByUser = true, stop()

// SL-CAROUSEL-02
if (this.pagination) {
  slide.setAttribute('role', 'tabpanel');
  slide.setAttribute('aria-label', this.localize.term('slideNum', index + 1)); // non rimuovere
  slide.removeAttribute('aria-labelledby');
}
// tab: niente aria-controls="slide-N" (oppure button.ariaControlsElements = [slide] dove supportato)

// SL-CAROUSEL-06
private handleKeyDown(event: KeyboardEvent) {
  const target = event.composedPath()[0] as HTMLElement;
  const fromContainer = target === this.scrollContainer;
  const fromPagination = target.closest?.('[part~="pagination-item"]') !== null;
  if (!fromContainer && !fromPagination) return;
  …
}
```
```css
/* SL-CAROUSEL-08 */
.carousel__pagination-item { box-shadow: inset 0 0 0 1px var(--sl-color-neutral-600); }
@media (forced-colors: active) {
  .carousel__pagination-item { border: 1px solid ButtonText; }
  .carousel__pagination-item--active { background-color: Highlight; forced-color-adjust: none; }
}
```
