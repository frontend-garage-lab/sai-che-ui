## Tree (`sl-tree` – src/components/tree/tree.component.ts)
**Pattern APG di riferimento:** Tree View (single / multi-select)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 5 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `role="tree"` sull'host (r. 105), `aria-multiselectable` da `selection` (r. 370). I `sl-tree-item` (role=treeitem) sono figli light DOM; i nidificati sono slottati in un `role="group"` (tree-item.component.ts:292). |
| 2 | Nome, descrizione, stato | ⚠️ | Il tree non ha property `label`; un `aria-label` del consumer sull'host funziona (host con ruolo) ma non è documentato né verificato (05). Stati gestiti in `sl-tree-item`. Stato "mixed" in multi-select non esposto sul treeitem (vedi SL-TREE-ITEM-01). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruoli e stati tutti sugli host light DOM; nessun riferimento ID cross-shadow. Slot nascosti delle icone con `hidden aria-hidden` (r. 422-423). |
| 4 | Tastiera e focus | ⚠️ | Roving tabindex (host `tabindex=0` → focus all'item, r. 334-352) ✅, Up/Down/Home/End/Enter/Space, RTL ✅. Difetti: ArrowLeft su figlio non va al genitore (01), ArrowRight su foglia sposta il focus (02), niente typeahead (03), ingresso nel tree sul primo item e non sul selezionato (04), intercettazione tasti su controlli annidati diversi da input/textarea (06). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Caricamento lazy: solo `aria-busy` sul treeitem (vedi SL-TREE-ITEM-02). |
| 7 | Aspetti visivi | ✅ | Gestiti da `sl-tree-item`. `--indent-guide-color` neutral-200 decorativo (r. 9). |
| 8 | API pubblica a11y | ⚠️ | Nessun `label`; `aria-label`/`aria-labelledby` sull'host sono comunque efficaci. |
| 9 | Documentazione e test | ⚠️ | axe solo su albero statico in modalità single (test r. 37-39); manca axe in `selection="multiple"`; nessun test ArrowLeft figlio→genitore. Docs senza indicazioni su nome del tree e tastiera. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-TREE-01 | Media | Tastiera | ArrowLeft su un nodo figlio chiuso/foglia sposta il focus all'item visibile precedente (che può essere un fratello o un suo discendente) invece che al genitore, contrariamente al commento e all'APG. | tree.component.ts:275-276 `if (!activeItem \|\| activeItem.disabled \|\| activeItem.isLeaf \|\| !activeItem.expanded) { focusItemAt(activeItemIndex - 1); }` | APG Tree View (Left Arrow); WCAG 2.1.1 | Se esiste `activeItem.parentElement?.closest('[role=treeitem]')` focalizzarlo; altrimenti non fare nulla. |
| SL-TREE-02 | Bassa | Tastiera | ArrowRight su una foglia (o item disabilitato) sposta il focus al successivo; APG: "on an end node, does nothing" (lo dice anche il commento r. 262). | tree.component.ts:264-265 `... (activeItem.isLeaf && !activeItem.lazy)) { focusItemAt(activeItemIndex + 1); }` | APG Tree View (Right Arrow) | Spostare al primo figlio solo se `activeItem.expanded && !isLeaf`; per le foglie nessuna azione. |
| SL-TREE-03 | Bassa | Tastiera | Nessun typeahead (salto all'item per carattere digitato): i tasti alfanumerici vengono ignorati. | tree.component.ts:225 (lista tasti chiusa) | APG Tree View (type-ahead "recommended") | Buffer di 500ms su `event.key.length === 1` e focus al prossimo item visibile il cui `textContent` inizia con la stringa. |
| SL-TREE-04 | Bassa | Focus | All'ingresso con Tab (senza item focalizzato in precedenza) il focus va al primo item del DOM, anche se disabilitato, e non all'item selezionato. | tree.component.ts:338-340 `this.focusItem(this.lastFocusedItem \|\| this.getAllTreeItems()[0]);` | APG Tree View ("focus on selected node"); WCAG 2.4.3 | `this.lastFocusedItem ?? this.selectedItems.find(visibile) ?? this.getFocusableItems()[0]`. |
| SL-TREE-05 | Bassa | Nome / docs | Nessuna property `label` né warning se manca il nome del tree; il consumer può usare `aria-label` sull'host (funziona) ma i docs non lo indicano. (consumer) | tree.component.ts:105; docs/pages/components/tree.md (nessuna menzione di aria-label) | WCAG 4.1.2; APG Tree View (label) | Documentare `aria-label`/`aria-labelledby` sull'host; opzionale `label` → `aria-label` e warning in dev mode. |
| SL-TREE-06 | Bassa | Tastiera | Il keydown handler ignora solo `input`/`textarea`: bottoni, select, `sl-select` o link annidati in un item perdono Enter/Space/frecce (`preventDefault` r. 240). | tree.component.ts:231-240 | WCAG 2.1.1 | Escludere ogni elemento interattivo nel `composedPath()` diverso dal treeitem (`button, a[href], select, [contenteditable], [role=combobox]…`). |
| SL-TREE-07 | Suggerimento | Tastiera / test | Funzioni APG opzionali assenti (`*` espande i fratelli, Shift+frecce / Ctrl+A in multi-select); test axe mancanti in `selection="multiple"` e `leaf`, test su ArrowLeft figlio→genitore assenti. | tree.component.ts:225; tree.test.ts:37-39, 172-221 | APG Tree View (optional keys); qualità | Aggiungere `*` e test `to.be.accessible()` per le tre modalità di selezione. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `aria-label` / `aria-labelledby` (consumer) | Sì (host = tree) | Sì | Da documentare. |
| `label` | No | — | Opzionale. |
| `aria-multiselectable` | Sì (da `selection`) | Sì | `leaf` → `false` ✅. |
| `selection` | Sì | Sì | — |

### Fix proposti
```ts
// ArrowLeft (LTR) / ArrowRight (RTL)
} else if ((isLtr && event.key === 'ArrowLeft') || (isRtl && event.key === 'ArrowRight')) {
  if (activeItem && !activeItem.disabled && !activeItem.isLeaf && activeItem.expanded) {
    toggleExpand(false);
  } else {
    const parent = activeItem?.parentElement?.closest<SlTreeItem>('[role=treeitem]');
    if (parent) this.focusItem(parent);
  }
}

// ArrowRight (LTR)
if (activeItem && !activeItem.disabled && !(activeItem.isLeaf && !activeItem.lazy)) {
  if (activeItem.expanded) focusItemAt(activeItemIndex + 1);
  else toggleExpand(true);
}

// Typeahead
private typeahead = '';
private typeaheadTimer?: number;
// in handleKeyDown, prima del filtro tasti:
if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
  clearTimeout(this.typeaheadTimer);
  this.typeahead += event.key.toLowerCase();
  this.typeaheadTimer = window.setTimeout(() => (this.typeahead = ''), 500);
  const items = this.getFocusableItems();
  const start = items.findIndex(i => i.matches(':focus')) + 1;
  const match = [...items.slice(start), ...items.slice(0, start)]
    .find(i => i.textContent?.trim().toLowerCase().startsWith(this.typeahead));
  if (match) { event.preventDefault(); this.focusItem(match); }
  return;
}

// focusin sull'host
const focusable = this.getFocusableItems();
this.focusItem(this.lastFocusedItem ?? focusable.find(i => i.selected) ?? focusable[0]);
```

### Non verificabile
- Calcolo automatico di `aria-level`/`aria-posinset`/`aria-setsize` da parte dei browser con treeitem nidificati via slot dentro il `role="group"` di uno shadow root: verificare con NVDA/JAWS/VoiceOver ("livello 2, 1 di 3").
- Annunci di espansione/compressione e di `aria-busy` durante il lazy load.
