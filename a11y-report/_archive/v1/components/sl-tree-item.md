## Tree Item (`sl-tree-item` – src/components/tree-item/tree-item.component.ts)
**Pattern APG di riferimento:** Tree View (treeitem)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="treeitem"` + `tabindex=-1` sull'host (r. 101-102) ✅; figli in `role="group"` (r. 292) ✅. In multi-select un `sl-checkbox` interattivo è annidato nel treeitem (01). |
| 2 | Nome, descrizione, stato | ⚠️ | `aria-selected` (r. 183), `aria-disabled` (r. 178), `aria-expanded` solo per nodi non foglia (r. 186-193) ✅, `aria-busy` (r. 169). Stato "mixed" non esposto sul treeitem; checkbox annidato senza nome (01). Icone di espansione in contenitore `aria-hidden` (r. 252) ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Stati sull'host light DOM; `aria-label` del consumer sull'host efficace. |
| 4 | Tastiera e focus | ✅ | Gestita da `sl-tree` (roving). Focus ring `outline: var(--sl-focus-ring)` su `:host(:focus-visible) .tree-item__item` (styles r. 111-115), visibile anche in forced-colors. Expand button solo puntatore ma equivalente da tastiera (frecce). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Lazy load: spinner dentro `aria-hidden`, solo `aria-busy` (02). |
| 7 | Aspetti visivi | ⚠️ | Testo `neutral-700` 9.12:1 / su hover `neutral-50` 8.64:1; selezionato `primary-900` su `primary-50` 12.15:1 (light) / 9.30:1 (dark); bordo sinistro 3px `primary-600` 5.87:1 → selezione non solo cromatica ✅. Forced-colors: outline tratteggiato sul selezionato (r. 166-170) ✅. Expand button 24×24 ✅. Label troncata con ellipsis senza alternativa (03). Animazioni JS via `animateTo` rispettano reduced motion ✅; rotazione CSS (r. 69) → SHARED-05. |
| 8 | API pubblica a11y | ⚠️ | Nessuna property per il testo di caricamento (default localizzato `loading` disponibile ma non usato). |
| 9 | Documentazione e test | ⚠️ | tree-item.test.ts verifica `aria-expanded`/`aria-selected`/`aria-disabled` (r. 46, 113, 133) ma nessun test axe; nessun test in modalità `selectable`. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-TREE-ITEM-01 | Media | Semantica / stato | In `selection="multiple"` viene renderizzato un `sl-checkbox` (input nativo nel suo shadow) senza label dentro il treeitem: controllo interattivo annidato e senza nome; lo stato indeterminato esiste solo sul checkbox, mentre il treeitem espone `aria-selected` (che non ha valore "mixed"). | tree-item.component.ts:266-287 `<sl-checkbox ... ?indeterminate=${this.indeterminate} tabindex="-1">`; 181-184 `aria-selected` | WCAG 4.1.2, 1.3.1; APG Tree View (multi-select: aria-checked/mixed) | Quando `selectable`: `aria-hidden="true"` sul `sl-checkbox` e sul treeitem `aria-checked="true\|false\|mixed"` al posto di `aria-selected`. |
| SL-TREE-ITEM-02 | Bassa | Live region | Lazy load: lo `sl-spinner` è dentro l'expand button `aria-hidden` e lo stato è comunicato solo da `aria-busy`, raramente annunciato dagli screen reader; nessun testo "Caricamento". | tree-item.component.ts:167-170, 249-257 | WCAG 4.1.3 | Testo visivamente nascosto localizzato (`this.localize.term('loading')`) in una live region `role="status"` presente nel shadow root, valorizzata quando `loading`. |
| SL-TREE-ITEM-03 | Bassa | Reflow / visivi | La label è su una sola riga con `overflow:hidden; text-overflow:ellipsis`: a 320px o con zoom il testo viene troncato senza modo di leggerlo per intero (nessun tooltip/`title`). | tree-item.styles.ts:132-139 | WCAG 1.4.10, 1.4.4 | Consentire `white-space: normal` (es. property/CSS var `--label-wrap`) o default con wrapping; in alternativa documentare `::part(label)`. |
| SL-TREE-ITEM-04 | Bassa | Test | Nessun test axe nel file del componente; nessuna copertura degli stati `selectable`/`indeterminate`/`lazy`/`loading`. | tree-item.test.ts (assenza di `to.be.accessible()`) | Qualità (WCAG 4.1.2) | Aggiungere axe per foglia, nodo espanso, disabled, selectable con indeterminate. |
| SL-TREE-ITEM-05 | Suggerimento | Semantica | `aria-level`/`aria-posinset`/`aria-setsize` non impostati: si confida nel calcolo del browser attraverso slot e `role="group"` in shadow DOM; in caso di lazy load parziale `aria-setsize` non è noto. | tree-item.component.ts:98-107 | APG Tree View (aria-level/setsize quando il DOM non è completo) | Impostare `aria-level` (profondità) e, se il consumer lo fornisce, `aria-setsize`/`aria-posinset` per gli alberi caricati in modo lazy. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `aria-expanded` | Sì (da `expanded`, solo non-foglia) | Sì | — |
| `aria-selected` | Sì | Sì | In multi-select sostituire con `aria-checked` (mixed). |
| `aria-disabled` | Sì | Sì | — |
| `aria-busy` | Sì (lazy) | Sì | Aggiungere testo di stato. |
| `aria-label` (consumer) | Sì sull'host | Sì | Utile per item con contenuto complesso. |
| `loading-label` | No | — | Opzionale, default `localize.term('loading')`. |

### Fix proposti
```ts
@watch('selected')
@watch('indeterminate')
@watch('selectable')
handleSelectedChange() {
  if (this.selectable) {
    this.removeAttribute('aria-selected');
    this.setAttribute('aria-checked', this.indeterminate ? 'mixed' : String(this.selected));
  } else {
    this.removeAttribute('aria-checked');
    this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
  }
}

// render()
<sl-checkbox part="checkbox" class="tree-item__checkbox" aria-hidden="true" tabindex="-1" ...></sl-checkbox>
…
<div class="tree-item__children" part="children" role="group">…</div>
<span class="sr-only" role="status">${this.loading ? this.localize.term('loading') : ''}</span>
```
```css
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
```

### Non verificabile
- Nome accessibile del treeitem padre (calcolato dal contenuto): verificare che gli screen reader non concatenino il testo dei figli nidificati nel `role="group"` (Chrome/Safari/Firefox).
- Livello e posizione annunciati per item nidificati via slot.
