## Description List (`<sl-description-list>` – src/components/description-list/description-list.component.ts)
**Pattern APG di riferimento:** Nessun pattern APG interattivo; semantica HTML `<dl>/<dt>/<dd>` (ARIA 1.2: `list`/`listitem` + `term`/`definition`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 2 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ❌ | Il contenitore è un `<div>` con `<slot>` (r. 26-30) e gli item sono `<span>` (sl-description-list-item.ts:29-32): la relazione etichetta/valore e il numero di voci non sono esposti (SL-DESCRIPTION-LIST-01). Un `<dl>` nativo non è utilizzabile perché `<dt>/<dd>` sarebbero in shadow root diversi. |
| 2 | Nome, descrizione, stato | ⚠️ | Nessuna property per dare un nome al gruppo (es. "Proprietà documento") (SL-DESCRIPTION-LIST-03). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Semantica di lista spezzata dallo slot: il ruolo va messo sugli host (container `list`, item `listitem`) per essere valido attraverso il confine shadow. |
| 4 | Tastiera e focus | N/A | Componente statico, nessun elemento focusabile proprio. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Colori via item (neutral-600/800, vedi sl-description-list-item ✅); griglia a `cols` fisse senza adattamento → reflow a 320px con label `nowrap` (SL-DESCRIPTION-LIST-02). |
| 8 | API pubblica a11y | ⚠️ | Solo `cols`; nessun `label`/`role` (SL-DESCRIPTION-LIST-03). |
| 9 | Documentazione e test | ⚠️ | Test axe ✅ (test r. 6-15) ma axe non rileva semantica mancante; docs senza nota a11y, esempi con "—" come valore vuoto (SL-DESCRIPTION-LIST-04). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-DESCRIPTION-LIST-01 | Media | 1 | Semantica di description list assente: `div` + `slot` nel contenitore, `span` per etichetta/valore negli item; lo screen reader legge una sequenza piatta "Revision Code A1 Discipline —" senza struttura, numero di voci né associazione termine/valore. | description-list.component.ts:26-30; description-list-item.component.ts:29-32 | WCAG 1.3.1 | Host `role="list"` (container) e `role="listitem"` (item) tramite ElementInternals/`setAttribute`; nello shadow dell'item `role="term"` sull'etichetta e `role="definition"` sul valore (o testo visually-hidden ": " tra i due). |
| SL-DESCRIPTION-LIST-02 | Bassa | 7 | Numero di colonne fisso (`repeat(var(--cols, 2), …)`) senza breakpoint: a 320px CSS con 2-3 colonne le label `white-space: nowrap` (item styles r. 19) debordano/si sovrappongono. | description-list.styles.ts:10; description-list-item.styles.ts:16-20 | WCAG 1.4.10 | `grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min-col, 12rem)), 1fr))` con `cols` come massimo; label con `overflow-wrap: anywhere`. |
| SL-DESCRIPTION-LIST-03 | Bassa | 8 | Nessuna API per un nome del gruppo: `aria-label`/`aria-labelledby` sull'host sono ignorati finché l'host non ha un ruolo. | description-list.component.ts:22-23 (unica property `cols`) | WCAG 1.3.1, 2.4.6 | Con `role="list"` sull'host, `aria-label`/`aria-labelledby` del consumer funzionano; aggiungere `label` opzionale. |
| SL-DESCRIPTION-LIST-04 | Suggerimento | 9 | Docs senza indicazioni a11y; gli esempi usano "—" come valore vuoto (letto "trattino" o ignorato dagli SR) (consumer). Test axe non copre la struttura. | docs/pages/components/description-list.md:12-14 | WCAG 1.3.1 (doc) | Nota nei docs: usare testo esplicito ("Non specificato") o `<span aria-label="Nessun valore">—</span>`; test che verifichi i ruoli. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `role` | No | — | Impostare `list` sull'host (SL-DESCRIPTION-LIST-01). |
| `label` / `aria-label` | No | — | Efficace solo dopo l'aggiunta del ruolo. |
| `cols` | Sì | ✅ | Solo presentazionale. |

### Fix proposti
```ts
// description-list.component.ts
connectedCallback() {
  super.connectedCallback();
  if (!this.hasAttribute('role')) this.setAttribute('role', 'list');
}
@property() label = '';
updated() { this.label ? this.setAttribute('aria-label', this.label) : this.removeAttribute('aria-label'); }
```
```css
/* description-list.styles.ts */
.description-list {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min-column-width, 12rem)), 1fr));
}
```
(La parte item è in `sl-description-list-item.md`.)

### Non verificabile
- Resa effettiva di `role="term"`/`definition` dentro `listitem` attraverso lo shadow DOM nei vari screen reader (supporto non uniforme di `term`/`definition`).
- Contenuto dei valori ricchi (es. `sl-tag`) fornito dal consumer.
