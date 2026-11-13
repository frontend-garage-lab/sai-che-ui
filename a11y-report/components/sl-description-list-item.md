## Description List Item (`<sl-description-list-item>` – src/components/description-list-item/description-list-item.component.ts)
**Pattern APG di riferimento:** Nessun pattern APG; semantica `<dt>/<dd>` (ARIA `listitem` + `term`/`definition`)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ❌ | Etichetta e valore sono `span` generici: `text "Revision Code"`, `text "A1"` (SL-DESCRIPTION-LIST-ITEM-01). |
| 2 | Nome/descrizione/stato | ✅ | `label` (attributo o slot) reso come testo. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun idref; `role="listitem"` del consumer sull'host funziona dentro `list`. |
| 4 | Tastiera e focus | N/A | Statico. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Label 6.64:1 light / 5.72:1 dark, valore 12.50:1 / 12.07:1 ✅. Label `nowrap`: a 320 px il testo esce dalla colonna e si sovrappone o crea scroll orizzontale (SL-DESCRIPTION-LIST-ITEM-02). |
| 8 | API pubblica a11y | ✅ | `label` + slot `label` sufficienti. |
| 9 | Docs e test | ⚠️ | Nessuna pagina docs dedicata; `@documentation` punta a una URL inesistente. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-DESCRIPTION-LIST-ITEM-02 | Media | Visivo | La label ha `white-space: nowrap` senza gestione dell'overflow: a 320 px CSS (zoom 400%) il testo esce dalla cella, si sovrappone alla colonna adiacente (esempio docs "Columns", `cols="3"`) o produce scroll orizzontale (con `cols` di default). Workaround: `::part(label) { white-space: normal }`. | description-list-item.styles.ts:16-20 `white-space: nowrap` | runtime viewport 320×640: `cols="3"` → "Client Document Identification" cella 16–101 px, testo fino a 188 px (la label successiva inizia a 117); `cols` default → "Vendor Document Identification" cella 168–304, testo fino a 347, `scrollWidth = 347` > 320 | 1.4.10 | Rimuovere `nowrap` (o `overflow-wrap: anywhere`) |
| SL-DESCRIPTION-LIST-ITEM-01 | Bassa | Semantica | Etichetta e valore senza ruolo (`term`/`definition`) né separatore e host senza `listitem`: la relazione etichetta/valore non è esposta. Impatto limitato (ordine di lettura corretto). | description-list-item.component.ts:29-32 | runtime: `text "Revision Code"`, `text "A1"` come nodi fratelli senza contenitore | 1.3.1 | Host `role="listitem"`; `role="term"` su `part="label"`, `role="definition"` su `part="value"` |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-DESCRIPTION-LIST-ITEM-03 | miglioramento | Creare la pagina docs dell'item o correggere `@documentation`. | description-list-item.component.ts:10 |

### Responsabilità del consumer
- Valori vuoti espliciti (non solo "—"); label concise.

### Da verificare con AT reali
- Annuncio di `term`/`definition` dentro `listitem` (dopo il fix) con NVDA/JAWS/VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-DESCRIPTION-LIST-ITEM-01 | Media | ridimensionato → Bassa | Relazione non esposta (runtime), ma l'ordine di lettura la conserva. |
| SL-DESCRIPTION-LIST-ITEM-02 | Bassa | ridimensionato → Media | Sovrapposizione e scroll orizzontale misurati a 320 px con l'esempio docs e con i default. |
| SL-DESCRIPTION-LIST-ITEM-03 | Bassa | riclassificato (miglioramento) | Docs. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` / slot `label` | Sì | ✅ `text "Revision Code"` | Sì |
| `role` host | No | consumer `role="listitem"` → `listitem [level=1]` ✅ | Sì (default interno) |

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
