## Empty State (`<sl-empty-state>` – src/components/empty-state/empty-state.component.ts)
**Pattern APG di riferimento:** nessun pattern APG; struttura heading (WCAG 1.3.1/2.4.6) e, quando compare dopo un'azione (ricerca/filtro), messaggio di stato (WCAG 4.1.3, `role="status"`).
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 2 · Bassa 1 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Titolo nativo `<h3>` (r. 42) e descrizione `<p>` (r. 44) ✅, ma livello di heading fisso a 3. Titolo vuoto nascosto con `:empty` (styles r. 45-47; i marker di Lit sono commenti, quindi `:empty` corrisponde) ✅. |
| 2 | Nome, descrizione, stato | ✅ | Testi visibili; icona dallo slot: `sl-icon` senza `label` è `aria-hidden` ✅; azione = bottone del consumer con proprio nome. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID; heading nel shadow root incluso nell'albero di accessibilità e nella navigazione per heading. |
| 4 | Tastiera e focus | ✅ | Solo l'azione slottata è focusabile, nell'ordine naturale. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Quando l'empty state compare come esito di una ricerca/filtro ("Nessun risultato") non viene annunciato; nessuna opzione `role="status"`. |
| 7 | Aspetti visivi | ⚠️ | Titolo neutral-900 ✅; descrizione neutral-600 su neutral-0 6.63/5.70, su neutral-50 6.28/5.29 ✅. Icona neutral-500 su neutral-100 4.27/2.95: decorativa, quindi non soggetta a 1.4.11. `.empty-state__icon:empty` (styles r. 33-35) non corrisponde mai perché lo `<span>` contiene sempre lo `<slot>`: senza icona resta un riquadro vuoto 3rem (solo estetico). Nessuna animazione. |
| 8 | API pubblica a11y | ⚠️ | `title-text` (evita il `title` nativo ✅), `description` ✅; mancano `heading-level` e `live`. |
| 9 | Documentazione e test | ⚠️ | 1 test axe (test r. 6-14) ✅; docs senza note su livello di heading/annuncio. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-EMPTY-STATE-01 | Media | Semantica | Livello di heading fisso `<h3>`: inserito in una pagina/pannello con gerarchia diversa (es. sotto un `h1` o dentro un `h4`) rompe la struttura dei titoli, e il consumer non può correggerlo (shadow DOM). | src/components/empty-state/empty-state.component.ts:42 `<h3 part="title" class="empty-state__title">${this.titleText}</h3>` | WCAG 1.3.1; 2.4.6 | Property `heading-level` (1-6, default 3) resa con `role="heading" aria-level` o con `unsafeStatic`/switch di tag; valore `0` = nessuna semantica di heading (`<p>`). |
| SL-EMPTY-STATE-02 | Media | Live region | L'empty state mostrato come risultato di un'azione (ricerca/filtro senza risultati, lista svuotata) non viene annunciato agli SR; il componente non offre una live region attivabile e i docs non lo segnalano. (componente + consumer) | src/components/empty-state/empty-state.component.ts:35-50 (nessun `role`/`aria-live`) | WCAG 4.1.3 Status Messages | Property `live` (boolean) → `role="status"` sul base; docs: la live region deve esistere prima del cambio (montare l'empty state nascosto o usare una live region del consumer). |
| SL-EMPTY-STATE-03 | Bassa | Aspetti visivi | Il badge dell'icona non si nasconde senza icona: `:empty` non corrisponde perché lo `<span>` contiene lo `<slot>` (lo stesso problema è già gestito per `action` con `HasSlotController`). Riquadro grigio senza significato. | src/components/empty-state/empty-state.styles.ts:33-35; empty-state.component.ts:27, 38-40 | WCAG 1.3.1 (elemento decorativo spurio) — qualità | `new HasSlotController(this, 'action', 'icon')` e classe `empty-state--has-icon` come per l'azione. |
| SL-EMPTY-STATE-04 | Suggerimento | Docs | Esempio "+ Add comment": il "+" è letto come "più"; docs senza sezione a11y (livello heading, annuncio). | docs/pages/components/empty-state.md:15 `<sl-button slot="action" variant="primary">+ Add comment</sl-button>` | WCAG 2.5.3 / qualità | Usare `<sl-icon slot="prefix" name="plus">` + "Aggiungi commento"; aggiungere sezione Accessibilità. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `title-text` | Sì | Sì | Reso in `<h3>` |
| `description` | Sì | Sì | Reso in `<p>` |
| `heading-level` | No | — | Da aggiungere |
| `live` (`role="status"`) | No | — | Da aggiungere |

### Fix proposti
```ts
@property({ attribute: 'heading-level', type: Number }) headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 3;
@property({ type: Boolean, reflect: true }) live = false;
private readonly hasSlotController = new HasSlotController(this, 'action', 'icon');

render() {
  const title = this.headingLevel
    ? html`<div part="title" class="empty-state__title" role="heading" aria-level=${this.headingLevel}>${this.titleText}</div>`
    : html`<p part="title" class="empty-state__title">${this.titleText}</p>`;
  return html`
    <div part="base" role=${this.live ? 'status' : nothing}
      class="empty-state${this.hasSlotController.test('icon') ? ' empty-state--has-icon' : ''}…">
      <span part="icon" class="empty-state__icon"><slot name="icon"></slot></span>
      ${this.titleText ? title : ''}
      …
    </div>`;
}
```
```css
.empty-state:not(.empty-state--has-icon) .empty-state__icon { display: none; }
```

### Non verificabile
- Annuncio reale quando l'empty state viene inserito/mostrato dinamicamente: richiede test con SR e dipende da come il consumer lo monta.
- Gerarchia dei titoli della pagina ospite.
