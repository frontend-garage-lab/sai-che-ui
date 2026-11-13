## Button (`sl-button` – src/components/button/button.component.ts)
**Pattern APG di riferimento:** APG Button · APG Link (con `href`)
**Esito:** ⚠️ Parzialmente conforme (0 errori; aperte verifiche su altri browser e AT per loading e link disabilitato)
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness), revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `button "Salva"`; con `href` `link "Link"`; con `href`+`disabled` `link "Disabled" [disabled]` |
| 2 | Nome/descrizione/stato | ✅ | Il nome arriva dallo slot; `circle` con `<sl-icon label="Impostazioni">` dà `button "Impostazioni"`; in loading il nome resta `button "Invia Loading"` |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Gli `aria-*` sull'host restano sull'host (`aria-pressed="true"` dà `button "Grassetto"` senza pressed). Non ho trovato usi documentati che ne abbiano bisogno: miglioramento |
| 4 | Tastiera e focus | ✅ | Tab: b1, b2 (loading), b3 (link), b6, b7; `disabled` e link disabilitato restano fuori dal tab order. In forced-colors il focus è `outline solid 2px` |
| 5 | Form e validazione | ✅ | Submit e reset passano da FormControlController (non rilevante per l'a11y) |
| 6 | Live region | N/A | In loading il nome cambia (include "Loading"). Nessun annuncio è richiesto da WCAG |
| 7 | Aspetti visivi | ✅ | Light: default 12.50, primary 6.18, accent 5.58, success 4.61, neutral 6.64, warning 4.59, danger 4.60, text 6.18, outline accent 4.70. Dark: tutti ≥4.77. Hover ≥5.63. `small` misura 44.5x28 px |
| 8 | API pubblica a11y | ✅ | Slot (nome), `title`, `disabled`, `href`/`target`/`download` |
| 9 | Docs e test | ⚠️ | La docs mette uno `<span tabindex="0">` attorno al bottone disabilitato (miglioramento). Mancano test su loading e href+disabled |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-BUTTON-01 | miglioramento | `pressed`/`expanded`/`current` non sono impostabili: gli `aria-*` sull'host finiscono su un generic. Nella docs non ci sono toggle né disclosure fuori da `sl-dropdown`: `caret` compare sempre dentro `sl-dropdown`, e la toolbar Bold/Italic di `sl-button-group` non ha stati, nemmeno visivi. Se servono i toggle: aggiungere property riflesse sul tag interno | button.component.ts:270-289 |
| SL-BUTTON-02 | miglioramento | Il click non è bloccato durante il loading. Consigliati `aria-disabled` + blocco del click e spinner `aria-hidden` | button.component.ts:186-194, 296 |
| SL-BUTTON-04 | miglioramento | Lo `<span tabindex="0">` della docs crea un tab stop `generic "Complete"`. Valutare un "soft disabled" | docs/pages/components/button.md:46-52 |
| SL-BUTTON-05 | miglioramento | ARIA ridondante sul `<button>` nativo (`role`, `tabindex`, `aria-disabled="false"`) | button.component.ts:282-284 |
| SL-BUTTON-06 | miglioramento | Niente reduced-motion su `scale`/transition (2.3.3, livello AAA) | button.styles.ts:26-38 |
| SL-BUTTON-07 | miglioramento | Test mancanti (loading, href+disabled, tastiera) | button.test.ts:137-149 |
| SL-BUTTON-08 | miglioramento | Nessun avviso per `target="_blank"` (3.2.5, livello AAA) | button.component.ts:279 |

### Responsabilità del consumer
- `circle` deve contenere `<sl-icon label="…">` (oppure testo in `sl-visually-hidden`), altrimenti il bottone non ha nome.
- Per i toggle (Bold/Italic) usare un componente che esponga lo stato (`sl-checkbox`, `sl-switch`, `sl-radio-button`) finché `sl-button` non avrà `pressed`.

### Da verificare con AT reali
- Nome in `loading`: la label è in `visibility:hidden` (button.styles.ts:506-511). Chromium la include ("Invia Loading"). Da verificare Firefox e Safari, con NVDA e VoiceOver.
- `href`+`disabled`: Chromium espone `link [disabled]`. Firefox e Safari possono trattare un `<a>` senza `href` come generic e ignorare `aria-disabled`.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-BUTTON-01 | Alta | riclassificato | Il nome arriva già dallo slot. Nessun uso documentato di stati pressed/expanded/current fuori da `sl-dropdown` |
| SL-BUTTON-02 | Media | riclassificato | In Chromium il nome resta (`button "Invia Loading"`). Il click attivo non viola WCAG |
| SL-BUTTON-03 | Media | scartato | Chromium espone `link "Disabled" [disabled]` fuori dal tab order (resta solo la verifica cross-browser) |
| SL-BUTTON-04 | Media | riclassificato | Pattern della docs; nessuna violazione A/AA dimostrata |
| SL-BUTTON-05 | Bassa | riclassificato | Ridondanza senza effetti sull'albero ax |
| SL-BUTTON-06 | Bassa | riclassificato | Criterio AAA |
| SL-BUTTON-07 | Bassa | riclassificato | Test |
| SL-BUTTON-08 | Suggerimento | riclassificato | Criterio AAA |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| slot default (nome) | Sì | Sì: `button "Salva"` | Sì |
| `disabled` | Sì | Sì: `button "Dis" [disabled]`, `link [disabled]` | Sì |
| `loading` | Sì | Nome mantenuto | Sì |
| `title` | Sì | Passato al tag interno (r. 275) | No |
| `aria-label` sull'host | No | Resta sull'host (verificato dal coordinatore) | No: c'è lo slot |
| `aria-pressed`/`aria-expanded` | No | `aria-pressed` sull'host non arriva al bottone | Solo se si documentano i toggle |

### Fix proposti
Nessun errore verificato.
