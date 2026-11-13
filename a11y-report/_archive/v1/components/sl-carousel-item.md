## Carousel Item (`<sl-carousel-item>` – src/components/carousel-item/carousel-item.component.ts)
**Pattern APG di riferimento:** APG Carousel (slide: `role="group"` + `aria-roledescription="slide"` o `tabpanel`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 2 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Il componente rende solo `<slot>` (r. 25-27): ruolo, nome e `id` sono scritti dal padre `sl-carousel` (carousel.component.ts:370-377). Fuori da un carousel è un contenitore generico (ok). `aria-roledescription` mancante → SL-CAROUSEL-03. |
| 2 | Nome, descrizione, stato | ⚠️ | Il nome della slide è sempre "Slide N" e sovrascrive quello del consumer (SL-CAROUSEL-ITEM-01). |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | `aria-labelledby="tab-N"` verso lo shadow del padre → SL-CAROUSEL-02. |
| 4 | Tastiera e focus | ✅ | Nessun controllo proprio; slide non visibili rese `inert` dal padre (carousel.component.ts:295). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Gestita dal padre (SL-CAROUSEL-05). |
| 7 | Aspetti visivi | ⚠️ | `::slotted(img)` con `object-fit: cover` (styles r. 18-22) ritaglia l'immagine: testo o informazioni ai bordi dell'immagine possono essere tagliati (SL-CAROUSEL-ITEM-02). |
| 8 | API pubblica a11y | ❌ | Nessuna property `label` per la slide (SL-CAROUSEL-ITEM-01). |
| 9 | Documentazione e test | ⚠️ | Solo test axe su elemento vuoto (test r. 11-17); docs con `alt` corretti negli esempi ✅ ma nessuna indicazione su nome della slide (SL-CAROUSEL-ITEM-03). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-CAROUSEL-ITEM-01 | Media | 2/8 | Il consumer non può dare un nome significativo alla slide: `sl-carousel` sovrascrive `aria-label` con "Slide N" (o lo rimuove con `pagination`), e l'item non espone una property `label`. | carousel.component.ts:370-377 `slide.setAttribute('aria-label', this.localize.term('slideNum', index + 1))`; carousel-item.component.ts:18-28 | WCAG 4.1.2, 2.4.6; APG Carousel | Property `label` su `sl-carousel-item`; il padre usa `label` se presente, altrimenti "Slide N di M". |
| SL-CAROUSEL-ITEM-02 | Bassa | 7 | `object-fit: cover` con `!important` su `img` slottate ritaglia l'immagine in base all'aspect-ratio: rischio perdita di contenuto informativo e a zoom/reflow. (consumer: non usare testo in immagine) | carousel-item.styles.ts:18-22 | WCAG 1.4.10, 1.1.1 | Custom property `--object-fit` (default `cover`) senza `!important`. |
| SL-CAROUSEL-ITEM-03 | Bassa | 9 | Test axe solo su item vuoto fuori dal carousel; docs senza nota su `alt` obbligatorio e sul nome della slide. | carousel-item.test.ts:11-17; docs/pages/components/carousel-item.md | Qualità | Test dentro `sl-carousel` con pagination; nota a11y nei docs. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | No | — | Da aggiungere (SL-CAROUSEL-ITEM-01). |
| `aria-label` sull'host | Scritto dal padre | ❌ | Sovrascritto da `sl-carousel`. |
| `role` / `aria-roledescription` | Scritto dal padre | ⚠️ | `aria-roledescription` mancante (SL-CAROUSEL-03). |

### Fix proposti
```ts
// carousel-item.component.ts
/** Nome accessibile della slide (es. titolo). Se assente il carousel usa "Slide N di M". */
@property() label = '';

// carousel.component.ts – initializeSlides()
const name = (slide as SlCarouselItem).label || this.localize.term('slideNum', index + 1);
slide.setAttribute('aria-label', name);
slide.setAttribute('aria-roledescription', this.localize.term('slide'));
```
```css
::slotted(img) { width: 100%; height: 100%; object-fit: var(--object-fit, cover); }
```

### Non verificabile
- Qualità di `alt` e del contenuto slottato (consumer).
- Annuncio di "Slide N" come nome di gruppo nei vari screen reader al passaggio di focus nel contenuto.
