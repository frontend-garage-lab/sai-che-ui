## Format Bytes (`<sl-format-bytes>` – src/components/format-bytes/format-bytes.component.ts)
**Pattern APG di riferimento:** N/A (testo formattato); WCAG 3.1.2 Language of Parts
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Render di sola stringa (r. 35-39): runtime `paragraph > text "Size: ", text "1,5 MB"`. |
| 2 | Nome/descrizione/stato | ✅ | Testo esposto; `display="long"` → `text "1,5 megabyte"`. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `lang` impostato via property formatta nella lingua richiesta ma non diventa attributo: il testo resta marcato con la lingua della pagina (SL-FORMAT-BYTES-01). |
| 4 | Tastiera e focus | N/A | — |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | N/A | Eredita gli stili del testo circostante. |
| 8 | API pubblica a11y | ⚠️ | `lang` funziona come attributo, non come property (vedi errore). |
| 9 | Docs e test | ⚠️ | Nessun test axe. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-FORMAT-BYTES-01 | Bassa | Lingua / API | Trasversale (SHARED-07, verificato dal coordinatore; citato solo qui per tutti i formatter). `lang` impostato come property (JS, Angular `[lang]`, wrapper React `@lit/react` che assegna come property ogni prop presente nel prototype, come negli esempi docs `<SlRelativeTime lang="de" />`) cambia la lingua del testo formattato ma non scrive l'attributo `lang`: il testo tedesco resta marcato con la lingua della pagina e le AT lo leggono con le regole di pronuncia sbagliate (es. "1,5" letto in inglese). | src/internal/shoelace-element.ts:68 `@property() lang: string;` (senza `reflect`); format-bytes.component.ts:35 `this.localize.number(...)` | runtime (pagina `lang="en"`): attributo `lang="de"` → `["1,5 Megabyte","de","de"]`; property `el.lang="de"` → `["1,5 Megabyte",null,"en"]` (testo tedesco, lingua più vicina `en`) | 3.1.2 (AA) | `@property({ reflect: true }) lang` (e `dir`) in `ShoelaceElement`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-FORMAT-BYTES-M01 | da-verificare-AT | Unità abbreviate (`short`, default) "kB"/"MB"/"Mb": lettura lettera per lettera e confusione bit/byte dipendono dall'AT; `display="long"` disponibile (`"1,5 megabyte"`). 3.1.4 è AAA. | format-bytes.component.ts:21, 35-39 |
| SL-FORMAT-BYTES-M02 | miglioramento | Aggiungere test axe e test `el.lang='de'` → `getAttribute('lang') === 'de'`. | format-bytes.test.ts |

### Responsabilità del consumer
- Finché il fix non c'è, impostare `lang` come attributo (`setAttribute('lang', …)` o attributo statico) quando differisce dalla pagina.
- Usare `display="long"` dove la distinzione bit/byte è importante.

### Da verificare con AT reali
- NVDA/JAWS/VoiceOver: lettura di "kB", "MB", "Mb" (dipende dai dizionari dell'AT).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-FORMAT-BYTES-01 | Bassa | confermato | Dimostrato a runtime: testo "1,5 Megabyte" con lingua effettiva `en` quando `lang` è assegnato come property; caso tipico con il wrapper React documentato. |
| SL-FORMAT-BYTES-02 | Suggerimento | riclassificato | Dipende dall'AT e da 3.1.4 (AAA) → SL-FORMAT-BYTES-M01. |
| SL-FORMAT-BYTES-03 | Suggerimento | riclassificato | Test → SL-FORMAT-BYTES-M02. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `lang` (attributo) | Sì | Sì: `["1,5 Megabyte","de","de"]` | Sì |
| `lang` (property) | Sì | No: `getAttribute('lang') = null`, lingua effettiva `en` | Sì (React/Angular) |
| `display` | Sì | Sì (`long` → "megabyte") | Sì |

### Fix proposti
```ts
// src/internal/shoelace-element.ts:67-68
@property({ reflect: true }) dir: string;
@property({ reflect: true }) lang: string;
```
