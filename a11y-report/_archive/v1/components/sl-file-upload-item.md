## File Upload Item (`sl-file-upload-item` – src/components/file-upload-item/file-upload-item.component.ts)
**Pattern APG di riferimento:** WAI-ARIA `progressbar` · `status` live region per i cambi di stato · APG Button (azioni retry/remove) · lista (`list`/`listitem`) per gli elementi in sequenza
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 4 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Host senza ruolo: il wrapper `<div part="base">` (r. 79) è generico; più item impilati non formano una lista (la docs li mette in un `<div>`, file-upload-item.md:110-140). Icona di stato decorativa (nessun `label`, r. 84-90) → `aria-hidden`. |
| 2 | Nome, descrizione, stato | ❌ | Lo stato (`waiting/uploading/uploaded/failed`) è espresso solo da icona e colore (r. 81-91, styles r. 20-44); in testo solo se il consumer lo scrive in `meta`. Bottone rimozione con nome contestuale `"${removeLabel} ${filename}"` (r. 131) ✅ ma vuoto se il nome è passato via slot; retry senza contesto ("Retry", r. 122). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID; contenuto del consumer via slot default/`meta`. |
| 4 | Tastiera e focus | ⚠️ | Bottoni nativi via `sl-button`/`sl-icon-button` ✅. Il retry sparisce al cambio di stato e il remove porta il consumer a distruggere l'elemento: il focus si perde (SL-FILE-UPLOAD-ITEM-04). |
| 5 | Form e validazione | N/A | Componente di stato, non un campo. |
| 6 | Live region | ❌ | Nessuna live region: avanzamento, completamento e fallimento non vengono annunciati. In `uploading` coesistono `sl-spinner` (`role="progressbar" aria-label="Loading"`, spinner.component.ts:28) e `sl-progress-bar` (`aria-label` di default "Progress", progress-bar.component.ts:50): due progressbar senza riferimento al file. |
| 7 | Aspetti visivi | ❌ | Testo `meta` a 12px: success-600 su success-50 **4.37** (light), danger-600 su danger-50 **4.26** (light) / **3.49** (dark) < 4.5. Icone di stato ≥3:1 ✅ e con forme diverse ✅. Icone `check2-circle`, `exclamation-octagon`, `hourglass-split`, `trash` dalla libreria `default` (non `system`). |
| 8 | API pubblica a11y | ⚠️ | `retry-label`/`remove-label` presenti ma con default **hardcoded in inglese** (r. 64, 67), nessun LocalizeController; nessuna property per il testo di stato o per il nome della progressbar. |
| 9 | Documentazione e test | ⚠️ | Test axe solo sullo stato iniziale (test r. 7-12); nessun axe su `uploading`/`failed`. Docs: esempi con `meta` testuale ✅ ma lista in `<div>` e nessun annuncio. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-FILE-UPLOAD-ITEM-01 | Alta | 6 Live region | Le transizioni di stato (in attesa → in caricamento → caricato / fallito) e l'esito non vengono annunciate: nessun `role="status"`/`aria-live` nel componente; un utente di screen reader non sa che il caricamento è terminato o fallito. | src/components/file-upload-item/file-upload-item.component.ts:77-136 (nessuna live region) | WCAG 4.1.3 | Live region visivamente nascosta, già presente al primo render, aggiornata solo su cambio `state` con testo localizzato ("{file}: caricato" / "{file}: caricamento non riuscito"); per i fallimenti valutare `role="alert"`. |
| SL-FILE-UPLOAD-ITEM-02 | Media | 1/2 Stato non testuale | Lo stato è comunicato da icona (decorativa) + colore; il testo di stato esiste solo se il consumer lo inserisce in `meta` (consumer). Con `meta` vuoto, "caricato" e "fallito" sono indistinguibili per gli AT. | file-upload-item.component.ts:81-91 `<sl-icon name=…>` senza `label`; styles r. 20-44 | WCAG 1.3.1, 1.4.1 | Dare all'icona un `label` localizzato per stato (`role="img"`), oppure testo di stato `sr-only` sempre presente. |
| SL-FILE-UPLOAD-ITEM-03 | Media | 7 Contrasto | Testo `meta` (12px) negli stati colorati sotto 4.5:1: success-600 su success-50 4.37 (light); danger-600 su danger-50 4.26 (light) e 3.49 (dark). | src/components/file-upload-item/file-upload-item.styles.ts:64-76 (+ background r. 20-28) | WCAG 1.4.3 | Usare `success-700`/`danger-700` per il testo meta (≥5.7:1 su -50, cfr. tabella SHARED §4). |
| SL-FILE-UPLOAD-ITEM-04 | Media | 4 Focus | Al click su Retry lo stato cambia e il bottone viene rimosso (render condizionato r. 112-125); al click su Remove il consumer rimuove l'elemento: in entrambi i casi il focus finisce su `<body>`. Nessuna indicazione in docs per gestire il focus. | file-upload-item.component.ts:69-75, 112-133 | WCAG 2.4.3 | Dopo `sl-retry` spostare il focus sul bottone remove (o sul contenitore con `tabindex="-1"`); documentare il pattern di focus dopo `sl-remove` (item successivo / zona di drop). |
| SL-FILE-UPLOAD-ITEM-05 | Media | 8 i18n | `retryLabel = 'Retry'`, `removeLabel = 'Remove'` hardcoded in inglese; la chiave `remove` esiste già nel LocalizeController. | file-upload-item.component.ts:63-67 | WCAG 3.1.2; SHARED-06 | Default da `this.localize.term('remove')` e nuova chiave `retry`; gli attributi restano override. |
| SL-FILE-UPLOAD-ITEM-06 | Bassa | 6/2 Progressbar | In `uploading` ci sono due `progressbar`: lo spinner ("Loading", indeterminato) e la barra ("Progress" generico, senza nome del file): annunci ridondanti e non contestuali in una lista di file. | file-upload-item.component.ts:81-82, 103-107; src/components/progress-bar/progress-bar.component.ts:50 | WCAG 1.3.1, 2.4.6 | Spinner `aria-hidden="true"`; passare `label="${filename}"` (o `progressLabel` localizzato) alla `sl-progress-bar`. |
| SL-FILE-UPLOAD-ITEM-07 | Bassa | 2 Nome | Se il nome file è fornito via slot default (`filename` vuoto) il bottone si chiama solo "Remove"; anche "Retry" non contiene il nome del file: più item → più bottoni con nome identico. | file-upload-item.component.ts:96, 122, 131 | WCAG 2.4.6, 2.4.9 (AAA) | Ricavare il nome dal testo assegnato allo slot quando `filename` è vuoto; `sl-button` retry con testo visibile + `sl-visually-hidden` con il nome file. |
| SL-FILE-UPLOAD-ITEM-08 | Bassa | 7 Icone | Le icone di stato e il cestino usano la libreria `default` (asset esterni) e non la `system`: se il base path non è configurato il bottone remove resta senza icona visibile e lo stato senza segnale visivo (in contrasto con la regola in library.system.ts:6-8). | file-upload-item.component.ts:84-90, 127-131 | WCAG 1.1.1, 1.4.1 | Aggiungere `check2-circle`, `exclamation-octagon`, `hourglass-split`, `trash` alla libreria `system` e usare `library="system"`. |
| SL-FILE-UPLOAD-ITEM-09 | Suggerimento | 1/9 Lista | Più item mostrati in sequenza non hanno semantica di lista; la docs li mette in un `<div>`. | docs/pages/components/file-upload-item.md:110-140 | WCAG 1.3.1 | Documentare `<ul role="list">` con `<li>` che contengono l'item, o `role="listitem"` sull'host dentro un contenitore `role="list"`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `filename` / slot default | Sì | Parziale | Usato nel nome del remove solo se passato come attributo. |
| `meta` / slot `meta` | Sì | Sì | Unico testo di stato (consumer). |
| `retry-label` | Sì | Sì | Default inglese. |
| `remove-label` | Sì | Sì | Default inglese; concatenato al nome file ✅. |
| `progress` | Sì | Sì | → `aria-valuenow` della `sl-progress-bar`. |
| testo/label di stato | No | — | Da aggiungere (`state-label` o default localizzati). |
| `progress-label` | No | — | Da aggiungere (nome della progressbar). |
| live region | No | — | Da aggiungere. |

### Fix proposti
```ts
// file-upload-item.component.ts
private readonly localize = new LocalizeController(this);
@property({ attribute: 'retry-label' }) retryLabel = '';
@property({ attribute: 'remove-label' }) removeLabel = '';
@state() private announcement = '';
@query('.file-upload-item__remove') private removeButton: SlIconButton;

@watch('state', { waitUntilFirstUpdate: true })
handleStateChange() {
  const name = this.filename || this.textContent?.trim() || '';
  if (this.state === 'uploaded') this.announcement = `${name}: ${this.localize.term('uploaded')}`;
  if (this.state === 'failed') this.announcement = `${name}: ${this.localize.term('uploadFailed')}`;
}

private async handleRetryClick() {
  this.emit('sl-retry');
  await this.updateComplete;
  this.removeButton?.focus(); // il retry non esiste più
}

render() {
  const name = this.filename || this.textContent?.trim() || '';
  return html`
    <div part="base" class="file-upload-item file-upload-item--${this.state}">
      <span part="icon" class="file-upload-item__icon">
        ${this.state === 'uploading'
          ? html`<sl-spinner aria-hidden="true"></sl-spinner>`
          : html`<sl-icon library="system" name=${/* … */ ''} label=${this.localize.term(`upload_${this.state}`)}></sl-icon>`}
      </span>
      <!-- content invariato; progress bar: -->
      <sl-progress-bar part="progress" class="file-upload-item__progress" value=${this.progress} label=${name}></sl-progress-bar>
      <!-- retry -->
      <sl-button ...>${this.retryLabel || this.localize.term('retry')}<sl-visually-hidden> ${name}</sl-visually-hidden></sl-button>
      <sl-icon-button library="system" name="trash" label="${this.removeLabel || this.localize.term('remove')} ${name}" ...></sl-icon-button>
      <span class="file-upload-item__status" role="status">${this.announcement}</span>
    </div>
  `;
}
```
```css
/* file-upload-item.styles.ts */
.file-upload-item--uploaded .file-upload-item__meta { color: var(--sl-color-success-700); }
.file-upload-item--failed .file-upload-item__meta { color: var(--sl-color-danger-700); }
.file-upload-item__status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
```

### Non verificabile
- Frequenza e verbosità degli annunci della `sl-progress-bar` durante l'avanzamento (dipende dallo screen reader).
- Contrasto del testo `meta` se il consumer usa lo slot con colori propri.
- Gestione del focus dopo `sl-remove` nell'applicazione del consumer.
