## File Upload Item (`sl-file-upload-item` – src/components/file-upload-item/file-upload-item.component.ts)
**Pattern APG di riferimento:** `progressbar` · APG Button (retry, remove)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 2 · Bassa 0
**Metodo:** codice + runtime Chromium (harness), revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Testi nome/meta, `button "Remove a.pdf"`; in uploading `progressbar "Progress" value="40"`; icone di stato decorative |
| 2 | Nome/descrizione/stato | ✅ | Lo stato è testuale nel `meta` (sempre valorizzato negli esempi della docs). Con il nome passato via slot: `button "Remove "` (workaround: `remove-label`) |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID |
| 4 | Tastiera e focus | ❌ | Retry → handler della docs (`state='uploading'`) → `focus: body` (SL-FILE-UPLOAD-ITEM-04) |
| 5 | Form e validazione | N/A | |
| 6 | Live region | ⚠️ | Nessuna live region interna: il testo di stato è del consumer, che deve annunciarlo |
| 7 | Aspetti visivi | ❌ | Meta e Retry sotto 4.5:1 negli stati uploaded e failed (SL-FILE-UPLOAD-ITEM-03). Nome file ≥5.69, icone ≥3.46 |
| 8 | API pubblica a11y | ✅ | `filename`, `meta`, `retry-label`, `remove-label` (localizzazione documentata) |
| 9 | Docs e test | ⚠️ | Axe solo sullo stato iniziale; la lista nella docs è un `<div>` |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-FILE-UPLOAD-ITEM-03 | Media | Aspetti visivi | Testo `meta` (12px) negli stati uploaded/failed e testo del Retry (danger outline sullo sfondo danger-50) sotto 4.5:1 | file-upload-item.styles.ts:20-28, 64-76 | Light uploaded: `#1f8466` su `#f5faf8` = **4.38:1**. Light failed (meta e Retry): `#db3624` su `#fbf5f4` = **4.26:1**. Dark failed: `#e05343` su `#5c170f` = **3.46:1** | WCAG 1.4.3 | Testo più scuro in light (−700), più chiaro in dark |
| SL-FILE-UPLOAD-ITEM-04 | Media | Tastiera e focus | Quando lo stato esce da `failed` il componente smonta il Retry che ha il focus | file-upload-item.component.ts:112-125 | `focus:#f >>> sl-button`, Enter → `focus: body` | WCAG 2.4.3 | Spostare il focus sul remove-button |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-FILE-UPLOAD-ITEM-M01 | miglioramento | Live region interna opzionale con lo stato localizzato | component.ts:77-136 |
| SL-FILE-UPLOAD-ITEM-05 | miglioramento | Default "Retry" e "Remove" via LocalizeController | r. 63-67 |
| SL-FILE-UPLOAD-ITEM-06 | miglioramento | Due progressbar ("Loading" e "Progress"); spinner `aria-hidden`, nome del file sulla barra | r. 81-82, 103-107 |
| SL-FILE-UPLOAD-ITEM-07 | miglioramento | Con il nome via slot, ricavarlo dal testo slottato; Retry con il nome del file | r. 96, 122, 131 |
| SL-FILE-UPLOAD-ITEM-08 | miglioramento | Icone di stato e cestino dalla libreria `system` | r. 84-90, 127-131 |

### Responsabilità del consumer
- Annunciare i cambi di stato (contenitore della lista con `role="status"`/`aria-live="polite"`, oppure una live region propria) e valorizzare sempre `meta`.
- Dopo `sl-remove` (nella docs `event.target.remove()`) spostare il focus sull'item successivo o sulla `sl-file-drop`.
- Mettere gli item in `<ul>/<li>`.

### Da verificare con AT reali
- Annuncio delle modifiche al `meta` (shadow DOM) dentro una live region del light DOM, con NVDA/JAWS/VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-FILE-UPLOAD-ITEM-01 | Alta | riclassificato | Lo stato è un testo pilotato dal consumer: consumer + miglioramento |
| SL-FILE-UPLOAD-ITEM-02 | Media | riclassificato | Con `meta` lo stato è testuale |
| SL-FILE-UPLOAD-ITEM-03 | Media | confermato | 4.38 / 4.26 / 3.46; esteso al testo del Retry |
| SL-FILE-UPLOAD-ITEM-04 | Media | confermato | Confermato per il Retry; la parte sul Remove è del consumer |
| SL-FILE-UPLOAD-ITEM-05 | Media | riclassificato | Localizzazione documentata |
| SL-FILE-UPLOAD-ITEM-06 | Bassa | riclassificato | Ridondanza |
| SL-FILE-UPLOAD-ITEM-07 | Bassa | riclassificato | Workaround `remove-label` |
| SL-FILE-UPLOAD-ITEM-08 | Bassa | riclassificato | Robustezza ipotetica |
| SL-FILE-UPLOAD-ITEM-09 | Suggerimento | riclassificato | Consumer |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `filename` | Sì | Sì: `"Remove a.pdf"` | Sì |
| `meta` | Sì | Sì (testo) | Sì |
| `progress` | Sì | `value="40"` | Sì |
| `retry-label`/`remove-label` | Sì | Sì | Sì (i18n) |

### Fix proposti
```ts
// file-upload-item.component.ts
updated(changed: PropertyValues<this>) {
  if (changed.get('state') === 'failed' && this.state !== 'failed' && this.retryHadFocus) {
    this.shadowRoot!.querySelector<HTMLElement>('.file-upload-item__remove')?.focus();
  }
}
// in handleRetryClick: this.retryHadFocus = true; (azzerato su focusout)
```
```css
/* file-upload-item.styles.ts (light; in dark usare un tono più chiaro della scala) */
.file-upload-item--uploaded .file-upload-item__meta { color: var(--sl-color-success-700); }
.file-upload-item--failed .file-upload-item__meta,
.file-upload-item--failed .file-upload-item__retry::part(base) { color: var(--sl-color-danger-700); }
```
