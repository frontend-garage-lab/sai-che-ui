## File Drop (`sl-file-drop` – src/components/file-drop/file-drop.component.ts)
**Pattern APG di riferimento:** APG Button (la zona è un `<button>` che apre `<input type="file">`) · lista `<ul>/<li>`
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness), revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `button "Attachments Click to browse or drag files here"`; la lista è `list` > `listitem`; l'`<input>` è fuori dall'albero ax. Il trascinamento ha un'alternativa (2.5.7) |
| 2 | Nome/descrizione/stato | ✅ | `desc="PDF or DOCX, up to 1 MB Max 3 files"` (hint + help-text); i bottoni di rimozione si chiamano `"Remove a.pdf"` |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `labelledby=[label, instructions]` e `describedby=[hint, help-text]`, tutti nello stesso shadow root |
| 4 | Tastiera e focus | ❌ | Tab sulla zona; Enter e Space generano `click <- button` e `click <- input` (il picker si apre; l'evento `filechooser` non è simulabile). **Dopo una rimozione il focus va su `body`** (SL-FILE-DROP-03). In forced-colors il focus è `outline solid 2px` |
| 5 | Form e validazione | ⚠️ | `virus.exe` viene scartato in silenzio: emette solo `sl-file-reject`. La docs chiede al consumer di mostrare il motivo (consumer) |
| 6 | Live region | ⚠️ | Aggiunte e rifiuti non vengono annunciati dal componente (consumer + miglioramento) |
| 7 | Aspetti visivi | ✅ | Light: istruzioni 9.07, "Click to browse" 6.18, hint 6.64, label 12.50. Dark: 7.44 / 6.81 / 4.86 / 12.07. Il bordo in dark è 2.96:1 ma non serve a identificare la zona (testo + icona) |
| 8 | API pubblica a11y | ✅ | `label`, `help-text`, `hint`, slot `instructions`, `remove-label` (localizzazione documentata) |
| 9 | Docs e test | ⚠️ | Docs su Enter e localizzazione; mancano test su tastiera e focus |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-FILE-DROP-03 | Media | Tastiera e focus | Il bottone di rimozione focalizzato viene distrutto insieme al suo `<li>`: il focus torna a `body` | file-drop.component.ts:198-201, 278-286 | Tab su `"Remove b.docx"`, Enter → `focus: body`; nella lista resta solo `a.pdf` | WCAG 2.4.3 | Dopo la rimozione spostare il focus sul remove adiacente o sulla zona |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-FILE-DROP-M01 | miglioramento | Live region interna con riepilogo localizzato di aggiunte e rifiuti; property `error-message` opzionale | file-drop.component.ts:130-157 |
| SL-FILE-DROP-02 | miglioramento | Testi di default hardcoded in inglese, non via LocalizeController (la chiave `remove` esiste già) | r. 93, 247 |
| SL-FILE-DROP-05 | miglioramento | Bordo dark `#636e74` su `#1f2528` = 2.96:1 | file-drop.styles.ts:21-23 |
| SL-FILE-DROP-06 | miglioramento | In forced-colors l'hover cambia solo il background; motion senza reduced-motion (AAA) | file-drop.styles.ts:44-53, 80-83, 161-165 |
| SL-FILE-DROP-07 | miglioramento | Test su tastiera, focus dopo rimozione, disabled | file-drop.test.ts |

### Responsabilità del consumer
- Comunicare i rifiuti ascoltando `sl-file-reject`, come nell'esempio della docs con `sl-alert`.
- Obbligatorietà ed errori: indicarli nella `label` e nell'`help-text` (esposto come descrizione).
- Localizzare con lo slot `instructions` e con `remove-label`.

### Da verificare con AT reali
- Apertura effettiva del file chooser da Enter e Space (`input.click()` dentro un handler di click), su desktop e su mobile (TalkBack, VoiceOver iOS).
- Lettura del nome composto (label + istruzioni) e della descrizione con NVDA/JAWS/VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-FILE-DROP-01 | Alta | riclassificato | La docs delega esplicitamente al consumer la comunicazione dei rifiuti: consumer + miglioramento |
| SL-FILE-DROP-02 | Media | riclassificato | Localizzazione documentata via slot e attributo |
| SL-FILE-DROP-03 | Media | confermato | Focus su `body` dopo la rimozione |
| SL-FILE-DROP-04 | Media | riclassificato | Workaround: label e help-text |
| SL-FILE-DROP-05 | Bassa | riclassificato | Bordo non necessario per identificare il controllo |
| SL-FILE-DROP-06 | Bassa | riclassificato | Focus visibile in forced-colors; motion AAA |
| SL-FILE-DROP-07 | Bassa | riclassificato | Test |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `label` / slot | Sì | Sì: entra nel nome | Sì |
| `hint`, `help-text` | Sì | Sì: entrano nella descrizione | Sì |
| slot `instructions`, `remove-label` | Sì | Sì: `"Remove a.pdf"` | Sì (i18n) |
| `disabled` | Sì | `<button disabled>` | Sì |
| `error-message` | No | — | Utile, non indispensabile |

### Fix proposti
```ts
// file-drop.component.ts
private async handleRemove(file: File) {
  const index = this.files.indexOf(file);
  this.files = this.files.filter(item => item !== file);
  this.emit('sl-change');
  await this.updateComplete;
  const buttons = [...this.shadowRoot!.querySelectorAll<HTMLElement>('.file-drop__remove')];
  const next = buttons[Math.min(index, buttons.length - 1)] ?? this.shadowRoot!.querySelector<HTMLElement>('.file-drop');
  next?.focus();
}
```
