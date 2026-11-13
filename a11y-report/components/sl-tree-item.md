## Tree Item (`sl-tree-item` – src/components/tree-item/tree-item.component.ts)
**Pattern APG di riferimento:** Tree View (treeitem, multi-select)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ⚠️ | `role="treeitem"` + `tabindex=-1` sull'host (r. 101-102), figli in `role="group"` (r. 292): `treeitem "Deciduous" [level=1 expanded]` → `group` → `treeitem "Birch" [level=2]`. In `selection="multiple"` un `checkbox` senza nome è annidato nel treeitem (SL-TREE-ITEM-01). |
| 2 | Nome/descrizione/stato | ⚠️ | `selected`, `disabled`, `expanded` (solo non foglie), `busy` esposti; il nome del genitore non include i figli (`treeitem "Deciduous"`). Lo stato parziale esiste solo sul checkbox annidato: il treeitem è `selected=false` (SL-TREE-ITEM-01). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Stati sull'host light DOM. |
| 4 | Tastiera e focus | ✅ | Gestita da `sl-tree`. Focus ring 2px `outline` 6.18:1 (light) / 10.31:1 (dark), su selezionato 5.86:1 / 6.40:1; forced colors `outlineStyle = solid`, `rgb(0,0,0)`. Expand button 24×24 px e operazione equivalente da tastiera. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ✅ | Lazy: durante il caricamento `treeitem "Loading Lazy" [expanded busy=1]` (il testo dello spinner entra nel nome). |
| 7 | Aspetti visivi | ⚠️ | Testo 9.07:1 / 8.75:1, hover 8.60:1 / 8.15:1, selezionato 12.18:1 / 9.31:1, bordo selezione 5.86:1 / 4.98:1, chevron 6.64:1 / 5.72:1. Forced colors: selezionato con outline `dashed` SelectedItem. Label troncata a 320 px (SL-TREE-ITEM-03). |
| 8 | API pubblica a11y | ✅ | `aria-label` sull'host funziona (host = treeitem). |
| 9 | Docs e test | ⚠️ | Nessun test axe, né su `selectable`/`indeterminate`/`lazy`. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-TREE-ITEM-01 | Media | Nome/stato | `selection="multiple"` (esempio docs): ogni item contiene un `sl-checkbox` esposto come `checkbox` **senza nome**; lo stato parzialmente selezionato del genitore è solo sul checkbox, mentre il treeitem focalizzato espone `selected=false`. | tree-item.component.ts:266-287 (`<sl-checkbox … ?indeterminate=… tabindex="-1">` senza label); 181-184 (`aria-selected`) | runtime: `treeitem "Deciduous" [level=1 expanded selected=false]` › `checkbox [checked="mixed" labelledby=[33]]` (nessun nome); `treeitem "Other"` › `checkbox [checked="false"]` (nessun nome) | WCAG 4.1.2 (A), 1.3.1 (A); APG Tree View multi-select (aria-checked mixed) | `aria-hidden="true"` sul `sl-checkbox` (decorativo, l'item è il controllo) e, quando `selectable`, `aria-checked="true\|false\|mixed"` sul treeitem al posto di `aria-selected`. |
| SL-TREE-ITEM-03 | Bassa | Reflow | La label è su una riga con ellipsis: a 320 px una label lunga viene tagliata senza modo di leggerla (nessun wrapping/tooltip). Workaround solo via `::part(label)` (non documentato). | tree-item.styles.ts:132-139 (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`) | runtime `--viewport 320x640`: `.tree-item__label` `[scrollWidth 458, clientWidth 241, "ellipsis"]` | WCAG 1.4.10 (AA) | Default `white-space: normal; overflow-wrap: anywhere` (o CSS var `--label-wrap`) e documentare `::part(label)`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-TREE-ITEM-V01 | miglioramento | Test axe per foglia, nodo espanso, disabled, selectable con indeterminate, lazy/loading. | tree-item.test.ts |
| SL-TREE-ITEM-V02 | miglioramento | Per alberi lazy parzialmente caricati, permettere `aria-setsize`/`aria-posinset` dal consumer e documentarlo (Chromium calcola già `level`). | tree-item.component.ts:98-107 |
| SL-TREE-ITEM-V03 | miglioramento | Durante il caricamento il nome diventa "Loading Lazy" (testo dello spinner nel nome): preferire uno stato separato (`aria-busy` + testo in live region) per non alterare il nome. | tree-item.component.ts:249-257 |

### Responsabilità del consumer
- Item con contenuto complesso (icone + testo + meta): fornire `aria-label` sull'host se il nome calcolato non è adeguato.

### Da verificare con AT reali
- Annuncio di "loading"/`aria-busy` durante il lazy load con NVDA/JAWS/VoiceOver.
- Colore `SelectedItem` dell'outline del selezionato in temi a contrasto elevato reali di Windows (l'emulazione Chromium usa `rgb(179,215,255)`).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-TREE-ITEM-01 | Media | confermato | Checkbox annidati senza nome e `mixed` non esposto sul treeitem (prova runtime). |
| SL-TREE-ITEM-02 | Bassa | scartato | Il caricamento è esposto: `treeitem "Loading Lazy" [busy=1]` (lo spinner entra nel nome). Resta un miglioramento sul modo (V03). |
| SL-TREE-ITEM-03 | Bassa | confermato | Troncamento misurato a 320 px (458 vs 241 px). |
| SL-TREE-ITEM-04 | Bassa | riclassificato | Test mancanti → V01. |
| SL-TREE-ITEM-05 | Suggerimento | scartato | Chromium calcola i livelli (`level=1/2/3`) attraverso slot e `role="group"`; il caso lazy resta miglioramento V02. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `expanded` → `aria-expanded` | Sì | Sì (`expanded`/`expanded=false`, assente sulle foglie) | Sì |
| `selected` → `aria-selected` | Sì | Sì in single; in multiple il parziale non è esposto | Sì (aria-checked in multiple) |
| `disabled` → `aria-disabled` | Sì | Sì (`[disabled]`) | Sì |
| `loading` → `aria-busy` | Sì | Sì (`busy=1`) | Sì |
| `aria-label` sull'host | Consumer | Sì | Per contenuti complessi |

### Fix proposti
```ts
// tree-item.component.ts
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
<sl-checkbox part="checkbox" class="tree-item__checkbox" aria-hidden="true" tabindex="-1" …></sl-checkbox>
```
```css
/* tree-item.styles.ts */
.tree-item__label {
  display: flex;
  align-items: center;
  min-width: 0;
  white-space: var(--label-white-space, normal);
  overflow-wrap: anywhere;
}
```
