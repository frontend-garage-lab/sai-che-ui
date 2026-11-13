## Radio Button (`sl-radio-button` – src/components/radio-button/radio-button.component.ts)
**Pattern APG di riferimento:** APG Radio Group (radio rappresentati come pulsanti segmentati, dentro `sl-radio-group`)
**Esito:** ⚠️ Parzialmente conforme (0 errori propri; restano bug APG non bloccanti e verifiche AT aperte; nel gruppo `required` vale SL-RADIO-GROUP-V01)
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `<button role="radio">` interno: `radio "Option 1" [checked="true"]` dentro `radiogroup`; host `role="presentation"` e `sl-button-group` non compaiono nell'albero. |
| 2 | Nome/descrizione/stato | ✅ | Nome dallo slot; icon-only con `sl-icon label` → `radio "Sinistra"`; disabled → `radio "Option 2" [disabled]`. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-disabled` sull'host `presentation` non genera nodi `generic` (albero pulito). |
| 4 | Tastiera e focus | ⚠️ | Ogni opzione è un tab stop, anche quella disabilitata (Tab: b1 → b2[disabled] → b3 → esterno). Frecce ed Enter funzionano; Space seleziona l'opzione *checked*, non quella con il focus (SL-RADIO-GROUP-V02). Funzione operabile: miglioramento. Focus ring 6.18:1 light, 10.31:1 dark; forced-colors `solid` `Highlight`. |
| 5 | Form e validazione | ⚠️ | Gestita dal gruppo: con `required` vale SL-RADIO-GROUP-V01. |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Testo 12.50/12.07 (unchecked), 10.75/8.09 (checked). Indicatore checked: bordo `primary-600` 6.18:1 light / 8.02:1 dark sullo sfondo, contro `neutral-300` non checked. Target 88.7×36px (medium). Forced-colors: il checked riceve un outline 2px `CanvasText`, quindi è distinguibile. Il bordo dei non checked (1.56:1) non serve a identificare il pulsante, che ha il testo. |
| 8 | API pubblica a11y | ✅ | `value`, `disabled`, slot/prefix/suffix; nome icon-only tramite `sl-icon label` (documentato). |
| 9 | Docs e test | ⚠️ | Test solo funzionali (miglioramento). |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-RADIO-BUTTON-01 | miglioramento | Roving tabindex assente: ogni `<button>` è tab stop (tabindex `null` su tutti dopo le frecce), compreso il disabilitato. Fix nel gruppo: `tabindex=-1` sui non checked, `0` sul checked o sul primo abilitato. | radio-group.component.ts:170-186, 219-225; radio-button.component.ts:105-124 |
| SL-RADIO-BUTTON-V01 | miglioramento | Space su un'opzione con il focus non la seleziona: riseleziona la checked e sposta lì il focus (runtime: focus `b3`, Space → `b1*`, focus `b1`). Causa in `sl-radio-group` (SL-RADIO-GROUP-V02). | radio-group.component.ts:157-160, 184-186 |
| SL-RADIO-BUTTON-03 | miglioramento | Warning dev se il pulsante non ha né testo né `sl-icon label`. | radio-button.component.ts:105-128 |
| SL-RADIO-BUTTON-02 | miglioramento | Rimuovere `aria-disabled` duplicato dall'host `presentation` (in Chromium non ha effetti). | radio-button.component.ts:87-90 |
| SL-RADIO-BUTTON-04 | miglioramento | Test axe nel gruppo e test sul numero di tab stop. | radio-button.test.ts:6-45 |
| SL-RADIO-BUTTON-05 | miglioramento | Codice morto `.hidden-input` e `@query('.button') input: HTMLInputElement` tipizzato male. | radio-button.component.ts:36-37; radio-button.styles.ts:15-27 |

### Responsabilità del consumer
- Per opzioni con sola icona: `sl-icon` con `label` (es. `label="Sinistra"`).
- Usare sempre dentro `sl-radio-group` con `label`.

### Da verificare con AT reali
- VoiceOver/Safari e NVDA/Firefox: `<button role="radio">` dentro un host `role="presentation"` slottato nel `radiogroup`, cioè annuncio di "pulsante di opzione, 1 di 3" e del gruppo.
- JAWS/NVDA: il modo focus con frecce su `button role=radio` (alcuni AT intercettano le frecce sui pulsanti).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-RADIO-BUTTON-01 | Media | riclassificato | Confermato a runtime (3 tab stop), ma tutte le opzioni sono raggiungibili e selezionabili con Tab+Enter/frecce, senza violazione A/AA: miglioramento prioritario. |
| SL-RADIO-BUTTON-02 | Bassa | scartato | Chromium non espone l'host (nessun `generic`): `radio "Option 2" [disabled]` corretto. |
| SL-RADIO-BUTTON-03 | Bassa | riclassificato | `sl-icon label` dà il nome (`radio "Sinistra"`): warning dev come miglioramento. |
| SL-RADIO-BUTTON-04 | Bassa | riclassificato | Test: miglioramento. |
| SL-RADIO-BUTTON-05 | Suggerimento | riclassificato | Codice morto: miglioramento. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| slot default / `sl-icon label` | Sì | Sì: `radio "Option 1"`, `radio "Sinistra"` | Sì |
| `disabled` | Sì | Sì: `[disabled]` sul button (resta tab stop) | Sì |
| `label` / `aria-label` | No | — | No: slot e `sl-icon label` coprono i casi |

### Fix proposti
Nessun errore verificato: vedi i fix di roving tabindex/Space in `sl-radio-group.md` (miglioramenti SL-RADIO-GROUP-01/V02).
