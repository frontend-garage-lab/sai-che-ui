## Tag (`<sl-tag>` – src/components/tag/tag.component.ts)
**Pattern APG di riferimento:** nessun pattern APG dedicato; il pulsante di rimozione segue APG Button pattern (per liste di tag rimovibili cfr. pattern "chip/token" in combobox multiselect).
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 1 · Alta 0 · Media 2 · Bassa 1 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<span>` generico con contenuto testuale; remove = `sl-icon-button` (`<button>` nativo). Variant `text` dichiarata (r. 34) ma senza stili dedicati (nessun impatto a11y). |
| 2 | Nome, descrizione, stato | ⚠️ | Remove con nome localizzato `localize.term('remove')` (r. 67, it: "Rimuovi") ✅, ma identico per tutti i tag: non indica *cosa* rimuove. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `tabindex="-1"` sull'host `sl-icon-button` (r. 70): lo shadow host con tabindex negativo esclude dalla navigazione sequenziale anche il `<button>` interno. |
| 4 | Tastiera e focus | ❌ | Il pulsante di rimozione non è raggiungibile con Tab; nessuna gestione di Backspace/Delete sul tag; nessuna gestione del focus dopo la rimozione (consumer). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Nessun annuncio di rimozione (responsabilità del consumer, suggerito in docs). |
| 7 | Aspetti visivi | ⚠️ | Testo -800 su -50: primary 10.72/8.07, accent 6.67/7.31, success 7.79/6.48, neutral 11.85/11.16, warning 7.64/6.23, danger 8.58/7.95 (light/dark) ✅. Remove con `padding: 0` (styles r. 28-31): target = dimensione icona 12/14/16 px (small/medium/large) < 24×24. Nessuna `forced-colors` (bordo `1px` resta ✅). |
| 8 | API pubblica a11y | ⚠️ | Nessuna `remove-label`; label non contestualizzata; `removable` non riflessa (r. 44, cosmetico). |
| 9 | Documentazione e test | ❌ | Nessun test axe (`to.be.accessible` assente in tag.test.ts), nessun test tastiera; docs senza indicazioni a11y. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-TAG-01 | Blocker | Tastiera e focus | Il pulsante di rimozione ha `tabindex="-1"` sull'host `sl-icon-button`: il `<button>` interno non entra nell'ordine di tabulazione, e il tag non gestisce Backspace/Delete. Un utente da tastiera non può rimuovere un tag (fuori da `sl-select`, che gestisce Backspace autonomamente). | src/components/tag/tag.component.ts:62-71 `<sl-icon-button … @click=${this.handleRemoveClick} tabindex="-1">` | WCAG 2.1.1 Keyboard; APG Button | Rimuovere `tabindex="-1"` (default focusabile); se serve escluderlo in contesti composti (`sl-select`), aggiungere una property `remove-tabindex`/`inert-remove` usata solo dal componente padre. |
| SL-TAG-02 | Media | Nome, descrizione, stato | Nome del remove sempre "Rimuovi"/"Remove": con più tag l'utente SR sente N pulsanti identici senza sapere quale tag rimuovono. | src/components/tag/tag.component.ts:67 `label=${this.localize.term('remove')}` | WCAG 2.4.6 Headings and Labels; 1.3.1; 2.4.4 (analogo) | Property `remove-label`; default `${term('remove')} ${testo del tag}` (es. "Rimuovi Milano") calcolato dal contenuto slottato in `slotchange`. |
| SL-TAG-03 | Media | Aspetti visivi | Target del remove button pari all'icona (padding forzato a 0): 12 px (small), 14 px (medium), 16 px (large). | src/components/tag/tag.styles.ts:28-31 `.tag__remove::part(base) { padding: 0; }`; :101-123 (font-size per size) | WCAG 2.5.8 Target Size (Minimum) | Garantire area ≥24×24 senza ingrandire l'icona: `.tag__remove::part(base) { padding: 0; min-width: 24px; min-height: 24px; justify-content: center; }` o pseudo-elemento di hit-area; verificare l'eccezione "spacing" in righe dense. |
| SL-TAG-04 | Bassa | Tastiera e focus | Dopo `sl-remove` il consumer rimuove il tag e il focus (una volta che il remove sarà focusabile) finisce su `<body>`; docs non indicano dove spostarlo né suggeriscono un annuncio ("Milano rimosso"). (consumer) | src/components/tag/tag.component.ts:46-48 `this.emit('sl-remove')`; docs/pages/components/tag.md:138-145 | WCAG 2.4.3; 4.1.3 | Documentare: spostare il focus sul tag successivo/precedente o sul campo di input; annunciare con una live region. |
| SL-TAG-05 | Suggerimento | Test | Nessun test axe e nessun test di tastiera per il remove. | src/components/tag/tag.test.ts:7-52 (nessun `to.be.accessible`) | Copertura test | Aggiungere `await expect(el).to.be.accessible()` per default/removable e test Tab → Enter emette `sl-remove`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `remove-label` | No | — | Default localizzato `remove` ✅ ma non contestuale (SL-TAG-02, SHARED-06) |
| tabindex del remove | No (fisso `-1`) | No | Vedi SL-TAG-01 |
| `aria-label` sull'host | No | No | Host senza ruolo: ignorato; non necessario (testo visibile) |

### Fix proposti
```ts
@property({ attribute: 'remove-label' }) removeLabel?: string;
@state() private contentText = '';

private handleSlotChange(e: Event) {
  const slot = e.target as HTMLSlotElement;
  this.contentText = slot.assignedNodes({ flatten: true }).map(n => n.textContent ?? '').join('').trim();
}

render() {
  const removeLabel = this.removeLabel ?? `${this.localize.term('remove')} ${this.contentText}`.trim();
  return html`
    <span part="base" class="tag …">
      <slot part="content" class="tag__content" @slotchange=${this.handleSlotChange}></slot>
      ${this.removable
        ? html`<sl-icon-button part="remove-button" exportparts="base:remove-button__base"
            name="x-lg" library="system" label=${removeLabel}
            class="tag__remove" @click=${this.handleRemoveClick}></sl-icon-button>`
        : ''}
    </span>`;
}
```
```css
.tag__remove::part(base) {
  color: inherit;
  padding: 0;
  min-width: 24px;
  min-height: 24px;
  justify-content: center;
}
```

### Non verificabile
- Comportamento reale di `tabindex="-1"` sullo shadow host nei diversi browser (Chromium/WebKit/Firefox escludono il contenuto dello shadow tree dalla tabulazione; da confermare con test manuale).
- Gestione del focus/annuncio dopo la rimozione: dipende dal consumer.
