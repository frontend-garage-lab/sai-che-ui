## Description List Item (`<sl-description-list-item>` – src/components/description-list-item/description-list-item.component.ts)
**Pattern APG di riferimento:** Nessun pattern APG; semantica `<dt>/<dd>` (ARIA 1.2 `listitem` + `term`/`definition`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 2 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ❌ | Etichetta e valore sono `<span>` generici (r. 30-31): nessuna relazione termine/definizione (SL-DESCRIPTION-LIST-ITEM-01, cfr. SL-DESCRIPTION-LIST-01). |
| 2 | Nome, descrizione, stato | ⚠️ | `label` (attributo o slot `label`) reso come testo ✅; nessun separatore percepibile dagli SR tra label e valore. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il valore è slottato (light DOM) e l'etichetta può esserlo: un `aria-labelledby` interno tra i due funzionerebbe solo con entrambi nello stesso albero → preferire ruoli `term`/`definition`. |
| 4 | Tastiera e focus | N/A | Statico. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Label `--sl-input-help-text-color` (neutral-600) 6.63:1 light / 5.70:1 dark ✅; valore neutral-800 12.51/12.01 ✅; label 12px `nowrap` senza gestione overflow (SL-DESCRIPTION-LIST-ITEM-02). |
| 8 | API pubblica a11y | ✅ | `label` + slot `label` sufficienti per il contenuto; non servono aria-* aggiuntive. |
| 9 | Documentazione e test | ⚠️ | Test axe ✅ (test r. 6-12); **nessuna pagina docs** (`docs/pages/components/description-list-item.md` assente; JSDoc r. 10 punta a una URL inesistente) (SL-DESCRIPTION-LIST-ITEM-03). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-DESCRIPTION-LIST-ITEM-01 | Media | 1 | Etichetta e valore resi come `span` senza ruolo né separatore: lo SR legge "Revision CodeA1" senza distinguere termine e valore; l'host non è `listitem`. | description-list-item.component.ts:29-32 | WCAG 1.3.1 | Host `role="listitem"`; `role="term"` su `part="label"` e `role="definition"` su `part="value"`; in alternativa testo visually-hidden ": " dopo la label. |
| SL-DESCRIPTION-LIST-ITEM-02 | Bassa | 7 | Label con `white-space: nowrap` e nessun `overflow`/`text-overflow`: le label lunghe debordano nella colonna adiacente a zoom 400%/320px. | description-list-item.styles.ts:16-20 | WCAG 1.4.10, 1.4.4 | Rimuovere `nowrap` o aggiungere `overflow-wrap: anywhere`. |
| SL-DESCRIPTION-LIST-ITEM-03 | Bassa | 9 | Nessuna pagina di documentazione per l'item; `@documentation` punta a `/components/description-list-item` inesistente. | description-list-item.component.ts:10; assenza di docs/pages/components/description-list-item.md | Qualità | Creare la pagina o puntare a description-list con sezione a11y. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` / slot `label` | Sì | ✅ (testo) | Aggiungere ruolo `term` sul contenitore. |
| `role` host | No | — | `listitem` (in coppia con `list` sul padre). |

### Fix proposti
```ts
connectedCallback() {
  super.connectedCallback();
  if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem');
}

render() {
  return html`
    <div part="base" class="description-list-item">
      <span part="label" class="description-list-item__label" role="term"><slot name="label">${this.label}</slot></span>
      <span part="value" class="description-list-item__value" role="definition"><slot></slot></span>
    </div>`;
}
```
```css
.description-list-item__label { white-space: normal; overflow-wrap: anywhere; }
```

### Non verificabile
- Lettura di `term`/`definition` con NVDA/JAWS/VoiceOver (supporto variabile; verificare che almeno il raggruppamento in `listitem` sia annunciato).
