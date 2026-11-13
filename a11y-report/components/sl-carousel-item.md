## Carousel Item (`<sl-carousel-item>` – src/components/carousel-item/carousel-item.component.ts)
**Pattern APG di riferimento:** APG Carousel (slide: `role="group"` o `tabpanel`)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

L'item rende solo `<slot>` (carousel-item.component.ts:25-27): ruolo, nome, `id`, `inert` e `aria-hidden` sono scritti dal padre `sl-carousel`. L'errore sui riferimenti dei tabpanel è tracciato in SL-CAROUSEL-02. Esito "parzialmente conforme" per la verifica AT aperta e per la dipendenza da SL-CAROUSEL-02.

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Fuori dal carousel: contenitore generico (`text "Contenuto libero"`). Dentro: `group "Slide 1"` (o `tabpanel` con `pagination`). |
| 2 | Nome/descrizione/stato | ⚠️ | Nome sempre "Slide N": `aria-label="Cascata"` del consumer → `"Slide 1"` (miglioramento). Con `pagination` nessun nome (SL-CAROUSEL-02). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-labelledby="tab-N"` non risolto: errore del padre (SL-CAROUSEL-02). |
| 4 | Tastiera e focus | ✅ | Nessun controllo proprio; le slide fuori vista sono `inert` (solo `group "Slide 1"` esposto). Frecce nei controlli della slide: vedi SL-CAROUSEL-06. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Gestita dal padre. |
| 7 | Aspetti visivi | ✅ | Nessun testo proprio; `::slotted(img)` 100%×100% con `object-fit: cover` (consumer). |
| 8 | API pubblica a11y | ⚠️ | Nessuna `label` per la slide (miglioramento). |
| 9 | Docs e test | ⚠️ | Test axe solo su item vuoto fuori dal carousel. |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-CAROUSEL-ITEM-01 | miglioramento | Il nome della slide è sempre "Slide N" e sovrascrive l'`aria-label` del consumer (`"Cascata"` → `"Slide 1"`): aggiungere `label` sull'item usata dal padre. Il nome esiste e descrive la posizione: nessun criterio violato. | carousel.component.ts:370-371 |
| SL-CAROUSEL-ITEM-03 | miglioramento | Test axe dentro un `sl-carousel` con `pagination`; nota nei docs su `alt` e nome della slide. | carousel-item.test.ts:11-17 |

### Responsabilità del consumer
- `alt` significativi sulle immagini; non affidare informazioni a testo nell'immagine (SL-CAROUSEL-ITEM-02: `object-fit: cover` può ritagliare i bordi dell'immagine; le dimensioni `100% !important` sono fisse, `object-fit` è sovrascrivibile dal consumer con `sl-carousel-item img { object-fit: contain }`).

### Da verificare con AT reali
- Annuncio del nome di gruppo "Slide N" entrando nel contenuto con NVDA/JAWS (browse mode) e VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-CAROUSEL-ITEM-01 | Media | riclassificato (miglioramento) | La slide ha sempre un nome ("Slide N"); un nome personalizzato è ergonomia, non requisito A/AA. |
| SL-CAROUSEL-ITEM-02 | Bassa | riclassificato (consumer) | Ritaglio dipende dalle immagini scelte; 1.4.10 non dimostrato; `object-fit` è sovrascrivibile. |
| SL-CAROUSEL-ITEM-03 | Bassa | riclassificato (miglioramento) | Test/docs. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` | No | — | Utile, non indispensabile |
| `aria-label` sull'host | Scritto dal padre | ❌ sovrascritto (`"Cascata"` → `"Slide 1"`) | — |
| `role` | Scritto dal padre | ✅ `group` / `tabpanel` | Sì |

### Fix proposti
Nessun errore verificato. Per SL-CAROUSEL-02 vedi `sl-carousel.md`.
