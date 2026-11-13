## Progress Bar (`<sl-progress-bar>` – src/components/progress-bar/progress-bar.component.ts)
**Pattern APG di riferimento:** WAI-ARIA 1.2 `role="progressbar"` (se indeterminato `aria-valuenow` va omesso).
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `progressbar "Progress" value="40" [valuemin=0 valuemax=100]`. |
| 2 | Nome/descrizione/stato | ❌ | Nome: `label` → `progressbar "Upload progress"`, altrimenti il default localizzato "Progress". In indeterminate viene esposto `value="0"` (SL-PROGRESS-BAR-01). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `label` copre il nome; `aria-labelledby` esterno non serve per l'uso documentato. |
| 4 | Tastiera e focus | N/A | Non interattivo, non focusabile (corretto). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Non è una live region (corretto); l'esito va annunciato dal consumer. |
| 7 | Aspetti visivi | ✅ | Indicatore su track: light 4.93:1, dark 5.91:1. Label su indicatore: 6.18:1 / 8.02:1. `forcedcolors`: indicatore `SelectedItem` su bianco. |
| 8 | API pubblica a11y | ✅ | `label` propagata. `value-text` sarebbe utile (miglioramento). |
| 9 | Docs e test | ⚠️ | I test `ariaLabel`/`ariaLabelledBy` (test r. 62-84) usano attributi ignorati dal componente: falsa copertura. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-PROGRESS-BAR-01 | Media | Nome/stato | In stato `indeterminate` il componente espone `aria-valuenow="0"`: agli AT arriva un avanzamento dello 0% invece di un avanzamento indeterminato. | src/components/progress-bar/progress-bar.component.ts:53 `aria-valuenow=${this.indeterminate ? 0 : this.value}` | runtime: `<sl-progress-bar indeterminate label="Loading">` → `progressbar "Loading" value="0" [valuemin=0 valuemax=100]`; `getAttribute("aria-valuenow")` → `"0"` | WCAG 4.1.2 Name, Role, Value (A); WAI-ARIA 1.2 progressbar | `aria-valuenow=${this.indeterminate ? nothing : this.value}`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-PROGRESS-BAR-02 | miglioramento | Property `value-text` → `aria-valuetext` per testi come "3 di 10 file". Oggi il testo dello slot è esposto come figlio (`text "50%"`) e il nome si può dare con `label`. | progress-bar.component.ts:43-57 |
| SL-PROGRESS-BAR-03 | miglioramento | Fare il clamp di `value` 0–100: Chromium già limita l'esposizione (`value=150` → `value="100"`), ma la larghezza CSS no. | progress-bar.component.ts:53-55 |
| SL-PROGRESS-BAR-04 | miglioramento | L'animazione indeterminate è infinita e ignora `prefers-reduced-motion` (2.3.3 AAA). Un indicatore di caricamento rientra nell'eccezione "essenziale" di 2.2.2. | progress-bar.styles.ts:41-44 |
| SL-PROGRESS-BAR-05 | miglioramento | La label interna (12 px, `nowrap`, `overflow:hidden`, altezza 16 px) può tagliarsi su barre strette o con valori bassi. Lo zoom del browser la scala, quindi 1.4.4 non è violato. | progress-bar.styles.ts:22-32 |
| SL-PROGRESS-BAR-06 | miglioramento | Correggere i test `ariaLabel`/`ariaLabelledBy` (usare `label`) e aggiungere un test indeterminate senza `aria-valuenow`. | progress-bar.test.ts:62-84 |
| SL-PROGRESS-BAR-07 | miglioramento | Docs: annunciare l'esito con una live region del consumer e usare `aria-busy`. Il passthrough di `title` duplica il tooltip. | progress-bar.component.ts:49 |

### Responsabilità del consumer
- Annunciare completamento/errore (es. `role="status"`) e fornire `label` quando ci sono più barre in pagina.

### Da verificare con AT reali
- NVDA/JAWS/VoiceOver: se il testo slottato (figlio di un ruolo con figli presentazionali) viene letto oltre al valore percentuale.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-PROGRESS-BAR-01 | Media | confermato | Runtime: `value="0"` in indeterminate. |
| SL-PROGRESS-BAR-02 | Media | riclassificato | Il nome è assegnabile con `label` e il testo è esposto come figlio; `valuetext` è una qualità. |
| SL-PROGRESS-BAR-03 | Bassa | riclassificato | Chromium limita il valore a 100. |
| SL-PROGRESS-BAR-04 | Bassa | riclassificato | AAA / eccezione per gli indicatori di caricamento. |
| SL-PROGRESS-BAR-05 | Bassa | riclassificato | Nessuna violazione di 1.4.4 dimostrata (zoom del browser). |
| SL-PROGRESS-BAR-06 | Bassa | riclassificato | Copertura dei test. |
| SL-PROGRESS-BAR-07 | Suggerimento | riclassificato | Docs / consumer. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| `label` → `aria-label` | Sì | Sì: `progressbar "Upload progress"` | Sì |
| `indeterminate` | Sì | No: `value="0"` | Sì (fix 01) |
| `value-text` | No | — | Utile |

### Fix proposti
```ts
// progress-bar.component.ts:53
aria-valuenow=${this.indeterminate ? nothing : this.value}
```
