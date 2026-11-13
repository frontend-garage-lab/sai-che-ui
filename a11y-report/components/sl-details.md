## Details (`sl-details` – src/components/details/details.component.ts)
**Pattern APG di riferimento:** Disclosure — https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ (Accordion per l'uso "Grouping Details")
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | `group` > `button "Toggle Me" [expanded=false]`; aperto: `region "Toggle Me"` con il contenuto. |
| 2 | Nome/descrizione/stato | ✅ | Nome da `summary`; `expanded` aggiornato (Enter/Space); disabled → `button "Disabilitato" [disabled expanded=false]`. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-labelledby="header"` della region risolto (`region "Toggle Me"`); `aria-controls="content"` punta allo `<slot>`: Chromium non espone la relazione `controls` (miglioramento, `aria-controls` opzionale in APG). |
| 4 | Tastiera e focus | ✅ | Tab sul summary; Enter apre; Space apre/chiude; contenuto interno raggiungibile con Tab (`a`); disabled fuori dal ciclo Tab. Frecce aprono/chiudono con `preventDefault` (miglioramento). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Summary 15.50:1 / 12.71:1; icona 12.71:1 dark; focus ring 6.18:1 / 8.76:1; forced-colors outline `solid`. |
| 8 | API pubblica a11y | ✅ | `summary`/slot `summary`, `open`, `disabled`, icone sostituibili. |
| 9 | Docs e test | ⚠️ | Nessun test di tastiera/ARIA (miglioramento). |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-DETAILS-01 | miglioramento | `aria-controls` verso lo `<slot>` non risolto (runtime: nessun `controls` sul button): spostare `id="content"` sul `div.details__body`. | src/components/details/details.component.ts:207, 225-226 |
| SL-DETAILS-02 | miglioramento | Ogni details crea una `region` con nome: con molti pannelli (FAQ) affolla i landmark; opzione per disattivarla. | details.component.ts:225 |
| SL-DETAILS-03 | miglioramento | Frecce aprono/chiudono con `preventDefault()` (non previste dal pattern Disclosure; impediscono lo scroll con le frecce quando il focus è sul summary; non invertite in RTL). | details.component.ts:121-129 |
| SL-DETAILS-05 | miglioramento | Test con `sendKeys` e asserzioni ARIA. | src/components/details/details.test.ts |
| SL-DETAILS-06 | miglioramento | Heading attorno al summary per l'uso accordion. | details.component.ts:201-212 |

### Responsabilità del consumer
- SL-DETAILS-04: valorizzare `summary` o lo slot `summary` (senza, il button non ha nome).
- Icone personalizzate negli slot `expand-icon`/`collapse-icon`: decorative (il summary porta già `expanded`).

### Da verificare con AT reali
- Nessuna verifica rilevante (button nativo-like con `aria-expanded` esposto correttamente).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-DETAILS-01 | Bassa | riclassificato | Relazione non risolta (runtime) ma `aria-controls` opzionale; nessun criterio violato |
| SL-DETAILS-02 | Bassa | riclassificato | Buona pratica |
| SL-DETAILS-03 | Bassa | riclassificato | Tasti aggiuntivi, nessuna perdita di operabilità |
| SL-DETAILS-04 | Bassa | riclassificato | Uso scorretto → consumer |
| SL-DETAILS-05 | Bassa | riclassificato | Test mancanti |
| SL-DETAILS-06 | Suggerimento | riclassificato | Buona pratica |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `summary` / slot `summary` | Sì | Sì: `button "Toggle Me"` | Sì |
| `open` | Sì | Sì: `[expanded]` / `[expanded=false]` | Sì |
| `disabled` | Sì | Sì: `[disabled]`, tabindex -1 | Sì |

### Fix proposti
Nessuno (nessun errore verificato).
