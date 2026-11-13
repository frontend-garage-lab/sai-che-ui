## Popup (`sl-popup` – src/components/popup/popup.component.ts)
**Pattern APG di riferimento:** Nessuno (utility di posizionamento basata su Floating UI; la semantica è dei componenti che la usano: `sl-dropdown`, `sl-tooltip`, `sl-select`, submenu di `sl-menu-item`)
**Esito sintetico:** ⚠️ Parzialmente conforme — nessun difetto rilevato nel codice (come utility a basso livello: non aggiunge semantica né focus, nasconde correttamente il contenuto inattivo; l'accessibilità del contenuto è a carico del componente/consumer che la usa, come dichiarato in docs r. 13); restano verifiche "NON VERIFICABILE" (vedi sezione dedicata), quindi non dichiarabile conforme finché non sono eseguite.
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 1 · Suggerimento 2

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Nessun ruolo aggiunto; host `display: contents`; freccia `<div role="presentation">` decorativa (r. 571). Corretto per una utility. |
| 2 | Nome, descrizione, stato | N/A | Lo stato (aperto/chiuso) è responsabilità del componente che la usa (`aria-expanded` sul trigger). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `anchor` per id risolto nello stesso root (`this.getRootNode().getElementById`, r. 252-253): solo posizionamento, nessun riferimento ARIA creato. |
| 4 | Tastiera e focus | ✅ | Nessun tabindex/focus gestito; ordine DOM preservato (contenuto resta nel light DOM accanto all'anchor, nessun portal) ✅. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Contenuto inattivo `display: none` (styles r. 29-31) ✅ escluso dall'albero AX. Con `strategy="absolute"` il popup può essere ritagliato da antenati `overflow: hidden` (mitigato da `flip`/`shift`/`auto-size`, risolto con `hoist`) (SL-POPUP-02). Freccia con `background` decorativa: scompare in forced colors senza perdita di informazione. |
| 8 | API pubblica a11y | N/A | Nessuna stringa, nessuna property ARIA necessaria. |
| 9 | Documentazione e test | ⚠️ | Docs avvisano esplicitamente che non è accessibile di per sé ✅; test minimi senza axe (SL-POPUP-01). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-POPUP-01 | Bassa | 9 | Test con sole verifiche di render/posizionamento: nessun test axe, nessuna verifica che il contenuto inattivo sia escluso dall'albero di accessibilità. | src/components/popup/popup.test.ts:8-32 | Qualità | Aggiungere `expect(el).to.be.accessible()` (attivo/inattivo) e asserzione `getComputedStyle(popup).display === 'none'` da inattivo. |
| SL-POPUP-02 | Suggerimento | 7 | Il popup non usa il top layer (Popover API): con `strategy="absolute"` può essere ritagliato da contenitori con overflow nascosto, rendendo parte del contenuto non visibile a zoom/reflow (consumer: usare `hoist`). | src/components/popup/popup.component.ts:561-569; popup.styles.ts:18-27 | WCAG 1.4.10 (rischio, consumer) | Valutare `popover="manual"` + `showPopover()` quando supportato, oppure documentare `hoist` per contenitori con overflow. |
| SL-POPUP-03 | Suggerimento | 1 | `role="presentation"` su un `<div>` vuoto è ridondante; `aria-hidden="true"` è più esplicito per un elemento puramente decorativo. | popup.component.ts:571 | ARIA 1.2 (first rule of ARIA) | `<div part="arrow" class="popup__arrow" aria-hidden="true"></div>`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `anchor` (id/Element/VirtualElement) | Sì | Solo posizionamento | Non crea relazioni ARIA (corretto) |
| `active` | Sì | Contenuto `display: none` da inattivo | ✅ |
| Nessuna property `aria-*` | — | — | Non necessarie per una utility |

### Fix proposti
```ts
${this.arrow ? html`<div part="arrow" class="popup__arrow" aria-hidden="true"></div>` : ''}
```
```ts
// popup.test.ts
it('should be accessible and hide inactive content', async () => {
  const el = await fixture<SlPopup>(html`<sl-popup><span slot="anchor">A</span><div>Content</div></sl-popup>`);
  await expect(el).to.be.accessible();
  const popup = el.shadowRoot!.querySelector('[part="popup"]')!;
  expect(getComputedStyle(popup).display).to.equal('none');
});
```

### Non verificabile
- Ritaglio del popup in layout reali del consumer (contenitori con overflow, zoom 400%): dipende dal contesto d'uso e dall'uso di `hoist`.
- Semantica, nome e gestione focus del contenuto: demandati a dropdown/tooltip/select/menu-item (vedi relativi report).
