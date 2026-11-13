## Card (`<sl-card>` – src/components/card/card.component.ts)
**Pattern APG di riferimento:** nessun pattern APG specifico; struttura (WCAG 1.3.1 heading/gruppi), eventualmente `role="article"`/`role="group"` con nome sull'host.
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 2 · Bassa 1 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Solo `div` + `slot` (r. 42-54), nessun ruolo: neutro ✅ (nessuna semantica imposta). Lo slot `header` è reso solo visivamente come titolo (semibold, styles r. 43-53): la semantica di heading dipende interamente dal consumer e i docs usano `<div slot="header">`. |
| 2 | Nome, descrizione, stato | ✅ | Nessun controllo interno; i controlli slottati mantengono i propri nomi. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun ruolo sull'host: il consumer può impostare `role="article"`/`"group"` + `aria-labelledby` sull'host puntando a ID del light DOM (stesso scope) ✅. Ordine di lettura: image → header → body → footer, coerente con l'ordine visivo. |
| 4 | Tastiera e focus | N/A | Nessun elemento focusabile interno; controlli slottati restano nell'ordine naturale. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Header neutral-900 su `--sl-surface-panel` 15.46/12.65 ✅. Bordo `--sl-border-subtle` 1.25:1 (decorativo). Accent edge (variant) 3px: accent-700 4.70, warning-600 4.59 ✅ ma significato solo cromatico. Header con `white-space: nowrap; text-overflow: ellipsis` (r. 50-52): il titolo si tronca senza alternativa. Nessuna animazione. Forced colors: il bordo resta ✅, l'accent edge diventa colore di sistema. |
| 8 | API pubblica a11y | ⚠️ | Nessuna property `heading`/`heading-level`; accettabile lasciare la semantica al consumer, ma va documentato. |
| 9 | Documentazione e test | ⚠️ | Test axe con/senza header (test r. 15-16, 39-40) ✅. Docs: esempi con `<div slot="header">Header Title</div>` (docs r. 199-201) e `<strong>Mittens</strong>` come titolo nel body (r. 16): modelli non semantici. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-CARD-01 | Media | Semantica / Docs | Lo slot `header` ha aspetto di titolo ma nessuna semantica, e i docs mostrano `<div slot="header">` / `<strong>` come titoli: i consumer copiano il pattern e gli utenti SR non possono navigare le card per heading. (consumer + docs) | src/components/card/card.styles.ts:43-53; docs/pages/components/card.md:199-201 `<div slot="header">Header Title …`; :16 `<strong>Mittens</strong>` | WCAG 1.3.1 Info and Relationships; 2.4.6 | Docs: usare `<h3 slot="header">` (con reset di margini via `::slotted(h1…h6)`); opzionale property `heading` + `heading-level` che renda `<div role="heading" aria-level=…>`. |
| SL-CARD-02 | Media | Aspetti visivi | Titolo dell'header forzato su una riga con ellissi: a 320 px o con testo ingrandito il contenuto è troncato senza modo di leggerlo per intero (nessun tooltip/espansione). | src/components/card/card.styles.ts:50-52 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` | WCAG 1.4.10 Reflow; 1.4.4; 1.4.12 | Rendere il troncamento opt-in (es. `--header-white-space: normal` di default, o attributo `truncate-header`). |
| SL-CARD-03 | Bassa | Aspetti visivi | `variant` comunica l'area di lavoro solo con il colore del bordo superiore (3 px). (consumer) | src/components/card/card.styles.ts:80-107 | WCAG 1.4.1 Use of Color | Documentare che il significato va ripetuto in testo (es. etichetta/heading dell'area). |
| SL-CARD-04 | Suggerimento | Docs | Docs non indicano come esporre la card come gruppo con nome (`role="article"`/`"group"` + `aria-labelledby` sull'host) per liste di card. | docs/pages/components/card.md (nessuna occorrenza di `role`/`aria`) | WCAG 1.3.1 | Aggiungere esempio: `<sl-card role="article" aria-labelledby="c1-title"><h3 id="c1-title" slot="header">…</h3></sl-card>`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `role` / `aria-labelledby` sull'host | Sì (attributi nativi) | Sì | Funzionano perché l'host non ha ruolo imposto e gli ID sono nel light DOM |
| `heading` / `heading-level` | No | — | Opzionale (SL-CARD-01) |

### Fix proposti
```css
/* card.styles.ts */
.card__header { white-space: normal; overflow-wrap: anywhere; }
:host([truncate-header]) .card__header { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card__header::slotted(:is(h1, h2, h3, h4, h5, h6)) { margin: 0; font: inherit; }
```
```html
<!-- docs -->
<sl-card role="article" aria-labelledby="card-title">
  <h3 id="card-title" slot="header">Titolo della card</h3>
  Contenuto…
</sl-card>
```

### Non verificabile
- Gerarchia di heading e significato dei contenuti slottati: dipende dal consumer.
- Contrasto di immagini e contenuti custom nel body/footer.
