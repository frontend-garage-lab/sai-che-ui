## File Drop (`sl-file-drop` – src/components/file-drop/file-drop.component.ts)
**Pattern APG di riferimento:** APG Button pattern (zona di drop = `<button>` che apre `<input type="file">`) · WAI-ARIA `status`/`alert` per esito · HTML `<ul>/<li>` per la lista file
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 3 · Bassa 3 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Zona = `<button type="button">` nativo (r. 230-250) che chiama `input.click()` (r. 99-103); `<input type="file" hidden aria-hidden tabindex="-1">` (r. 252-261) fuori dall'albero AT ✅; lista file `<ul>/<li>` nello stesso shadow root (r. 265-290) ✅; badge estensione `aria-hidden` (r. 269) ✅. Alternativa al trascinamento presente (WCAG 2.5.7 ✅). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome = `aria-labelledby="label instructions"` (r. 235), descrizione `aria-describedby="hint help-text"` (r. 236) ✅ con ID nello stesso shadow root. Bottoni rimozione con nome contestuale `"${removeLabel} ${file.name}"` (r. 283) ✅. Nessuno stato `aria-invalid`/errore, nessun `required`. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Tutti gli ID referenziati (`label`, `instructions`, `hint`, `help-text`) sono interni; slot `label`/`help-text` per contenuto del consumer. Non è un form control (niente `name`/valore nel form): il consumer legge `files` (SHARED §2, impatto basso). |
| 4 | Tastiera e focus | ⚠️ | Tab sulla zona, Enter/Space aprono il picker (nativo `<button>`) ✅; `:focus-visible` con `--sl-focus-ring` (styles r. 39-42) ✅. Dopo la rimozione di un file il bottone focalizzato viene distrutto e il focus si perde (SL-FILE-DROP-03). |
| 5 | Form e validazione | ❌ | I file scartati (tipo, dimensione, numero) sono rifiutati in silenzio: nessun messaggio, nessun `aria-invalid`, solo l'evento `sl-file-reject` (r. 154-156). La docs delega al consumer (file-drop.md:29-64). |
| 6 | Live region | ❌ | Nessun annuncio quando i file vengono aggiunti o rimossi né quando vengono rifiutati; la lista compare dopo il bottone senza notifica. |
| 7 | Aspetti visivi | ⚠️ | Testo neutral-700 9.12 / 7.40 (dark su `--sl-surface-panel` = neutral-100), hint e dimensione neutral-600 6.63 / 4.83, "Click to browse" primary-600 6.21 / 6.81 ✅. Bordo tratteggiato dark neutral-500 su neutral-100 **2.95:1** (il commento r. 8-10 dichiara 3:1). Badge estensione a 10px (`--sl-font-size-2x-small`, decorativo). Forced-colors solo per lo stato dragging (r. 161-165). `scale: 1.08` senza reduced-motion (SHARED-05). |
| 8 | API pubblica a11y | ⚠️ | `label`, `help-text`, `hint`, slot `instructions`, `remove-label` ✅; default **hardcoded in inglese** ("Click to browse or drag files here", "Remove") senza LocalizeController (SL-FILE-DROP-02). Mancano `error-message`/`required`. |
| 9 | Documentazione e test | ⚠️ | Test axe (test r. 17-22) ✅ solo stato iniziale; nessun test di tastiera, di focus dopo rimozione, di annuncio. Docs spiegano Enter e localizzazione ✅. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-FILE-DROP-01 | Alta | 5/6 Errori e annunci | Il componente rileva l'errore (tipo/dimensione/numero) ma lo comunica solo con l'evento `sl-file-reject`: nessun messaggio visibile o annunciato, nessun `aria-invalid`. Analogamente l'aggiunta/rimozione di file non viene annunciata. Un utente di screen reader che seleziona un file non ammesso non riceve alcun riscontro. | src/components/file-drop/file-drop.component.ts:130-157 (`this.emit('sl-file-reject', …)`), 263-292 | WCAG 3.3.1, 4.1.3 | Live region `role="status"` interna con riepilogo localizzato ("2 file aggiunti", "1 file rifiutato: tipo non ammesso"); property/slot `error-message` collegata via `aria-describedby` + `aria-invalid` sul `<button>`. |
| SL-FILE-DROP-02 | Media | 8 i18n | Testo di default della zona e `remove-label` hardcoded in inglese, nessun `LocalizeController` (la chiave `remove` esiste già); su pagina italiana il nome del bottone diventa "Allegati Click to browse or drag files here" in lingua errata. | file-drop.component.ts:93 `removeLabel = 'Remove'`; 247 `Click to browse … or drag files here` | WCAG 3.1.2; SHARED-06 | Usare `this.localize.term('remove')` e nuove chiavi (`browseFiles`, `dropFilesHere`) come default; `remove-label` e slot `instructions` come override. |
| SL-FILE-DROP-03 | Media | 4 Focus | Rimuovendo un file il suo `<sl-icon-button>` viene rimosso dal DOM mentre ha il focus: il focus torna a `<body>` e l'utente da tastiera perde la posizione. | file-drop.component.ts:198-201, 278-286 | WCAG 2.4.3 | Dopo `handleRemove`, `await this.updateComplete` e spostare il focus sul bottone di rimozione successivo/precedente o, se la lista è vuota, sulla zona (`.file-drop`). |
| SL-FILE-DROP-04 | Media | 5 Form | Nessun supporto `required`/stato di validità né collegamento a un messaggio d'errore esterno (riferimenti ID cross-shadow non possibili, SHARED §2): in un form il consumer non può marcare il campo come obbligatorio/invalid per gli AT. | file-drop.component.ts:62-96 (nessuna property `required`/`error-message`), 230-236 | WCAG 3.3.2, 4.1.2 | Property `required` → `aria-required` è ammesso solo su ruoli di input: preferire testo "(obbligatorio)" nella label + `error-message` con `aria-describedby`/`aria-invalid`. |
| SL-FILE-DROP-05 | Bassa | 7 Contrasto | In tema dark il bordo tratteggiato (neutral-500) su `--sl-surface-panel` (neutral-100) è 2.95:1, sotto la soglia dichiarata nel commento; la zona resta identificata dal testo ma il confine della drop area si legge male. | src/components/file-drop/file-drop.styles.ts:21-23; src/themes/dark.css:461, 536 | WCAG 1.4.11 | Usare `--sl-color-neutral-600` per il bordo in dark o un token dedicato `--sl-file-drop-border-color`. |
| SL-FILE-DROP-06 | Bassa | 7 Forced colors / motion | In forced-colors solo lo stato `dragging` è gestito; il wash di hover è solo `background-color` (sparisce). `scale: 1.08` dell'icona in dragging e transition non disattivati con reduced motion (SHARED-05). | file-drop.styles.ts:44-53, 80-83, 161-165 | WCAG 1.4.11, 2.3.3 (AAA) | Aggiungere `border-color: Highlight` anche per `:hover`; `@media (prefers-reduced-motion: reduce) { .file-drop__icon { transition: none; scale: none; } }`. |
| SL-FILE-DROP-07 | Bassa | 9 Test | Nessun test su tastiera (Enter/Space → picker), focus dopo rimozione, `aria-labelledby`/`describedby`, stato disabled con axe. | src/components/file-drop/file-drop.test.ts:17-90 | — (qualità) | Aggiungere i casi. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` / slot `label` | Sì | Sì | Via `aria-labelledby="label instructions"`. |
| `help-text` / slot `help-text` | Sì | Sì | Via `aria-describedby`. |
| `hint` | Sì | Sì | Via `aria-describedby` (ID presente solo se valorizzato). |
| slot `instructions` | Sì | Sì | Unico modo per localizzare il testo della zona. |
| `remove-label` | Sì | Sì | Nome contestuale con nome file ✅; default inglese. |
| `disabled` | Sì | Sì | `<button disabled>` + bottoni rimozione disabilitati. |
| `error-message` / `aria-invalid` | No | — | Da aggiungere (SL-FILE-DROP-01/04). |
| `required` | No | — | Da aggiungere (indicazione testuale). |
| live region esito | No | — | Da aggiungere. |
| default localizzati | No | — | Usare LocalizeController. |

### Fix proposti
```ts
// file-drop.component.ts
import { LocalizeController } from '../../utilities/localize.js';

private readonly localize = new LocalizeController(this);
@property({ attribute: 'remove-label' }) removeLabel = '';
@property({ attribute: 'error-message' }) errorMessage = '';
@state() private announcement = '';

private addFiles(incoming: File[]) {
  // ...logica invariata...
  if (accepted.length > 0) {
    this.files = [...kept, ...accepted];
    this.emit('sl-change');
  }
  if (rejections.length > 0) this.emit('sl-file-reject', { detail: { rejections } });
  // riepilogo per AT (stringhe da aggiungere alle traduzioni)
  this.announcement = [
    accepted.length ? this.localize.term('filesAdded', accepted.length) : '',
    rejections.length ? this.localize.term('filesRejected', rejections.length) : ''
  ].filter(Boolean).join('. ');
}

private async handleRemove(file: File, index: number) {
  this.files = this.files.filter(item => item !== file);
  this.emit('sl-change');
  await this.updateComplete;
  const buttons = [...this.shadowRoot!.querySelectorAll<HTMLElement>('.file-drop__remove')];
  (buttons[Math.min(index, buttons.length - 1)] ?? this.shadowRoot!.querySelector<HTMLElement>('.file-drop'))?.focus();
}

// render()
<button
  ...
  aria-labelledby=${hasLabel ? 'label instructions' : 'instructions'}
  aria-describedby="hint help-text error-message"
  aria-invalid=${this.errorMessage ? 'true' : 'false'}
>
  ...
  <slot name="instructions">
    <span class="file-drop__browse">${this.localize.term('browseFiles')}</span> ${this.localize.term('dropFilesHere')}
  </slot>
</button>
<div id="error-message" class="file-drop__error" ?hidden=${!this.errorMessage}>${this.errorMessage}</div>
<span class="file-drop__status sr-only" role="status">${this.announcement}</span>
// bottone rimozione:
label="${this.removeLabel || this.localize.term('remove')} ${file.name}"
@click=${() => this.handleRemove(file, index)}
```
```css
@media (prefers-reduced-motion: reduce) {
  .file-drop, .file-drop__icon { transition: none; }
  .file-drop--dragging .file-drop__icon { scale: none; }
}
@media (forced-colors: active) {
  .file-drop:hover:not(.file-drop--disabled) { border-color: Highlight; }
}
```

### Non verificabile
- Annuncio del nome composto (`label` + istruzioni) e della descrizione con NVDA/JAWS/VoiceOver; lettura del `<ul>` nel shadow root.
- Comportamento del picker nativo su mobile/TalkBack/VoiceOver iOS (apertura via `input.click()` dal `<button>`).
- Annuncio degli errori se il consumer segue la docs con `sl-alert` (dipende da `sl-alert`, gruppo diverso).
