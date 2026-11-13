## Spinner (`<sl-spinner>` – src/components/spinner/spinner.component.ts)
**Pattern APG di riferimento:** WAI-ARIA 1.2 `role="progressbar"` indeterminato (senza `aria-valuenow`).
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `progressbar "Loading" [valuemin=0 valuemax=100]` senza `value`: indeterminato, corretto. |
| 2 | Nome/descrizione/stato | ✅ | Nome localizzato (`localize.term('loading')`, r. 28). In `<sl-button loading>Save</sl-button>` → `button "Save Loading"`: lo stato di caricamento entra nel nome del bottone. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID. |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Non è una live region (corretto). L'annuncio dell'inizio/fine caricamento spetta al consumer. |
| 7 | Aspetti visivi | ✅ | Indicatore su bianco: light 6.18:1, dark 8.02:1. In `forcedcolors` lo `stroke` resta `rgb(14,106,129)` (visibile). Il track al 25% è decorativo. |
| 8 | API pubblica a11y | ✅ | Il nome non è sovrascrivibile ma è localizzato. |
| 9 | Docs e test | ⚠️ | 1 test axe; le docs non spiegano come annunciare il caricamento. |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-SPINNER-01 | miglioramento | Property `label` per contestualizzare il nome ("Caricamento risultati") quando ci sono più spinner; il default localizzato è già corretto. | spinner.component.ts:28 |
| SL-SPINNER-03 | miglioramento | La rotazione infinita ignora `prefers-reduced-motion` (2.3.3 AAA); un indicatore di caricamento rientra nell'eccezione di 2.2.2. | spinner.styles.ts:46 |
| SL-SPINNER-04 | miglioramento | Regola `forced-colors` esplicita (es. `stroke: CanvasText`): oggi lo stroke resta il colore autore (#0e6a81), con contrasto variabile sul Canvas di sistema. | spinner.styles.ts:37-47 |

### Responsabilità del consumer
- SL-SPINNER-02: annunciare inizio e fine del caricamento (`aria-busy` sull'area aggiornata e/o un messaggio `role="status"`). Lo spinner da solo non è una live region, e non deve esserlo.

### Da verificare con AT reali
- Nessuna verifica rilevante (ruolo e nome esposti in modo standard).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-SPINNER-01 | Media | riclassificato | Il nome esiste ed è localizzato; il contesto è una qualità. Dentro `sl-button` il nome "Save Loading" è utile, non ridondante. |
| SL-SPINNER-02 | Media | riclassificato | L'annuncio del caricamento spetta al consumer (4.1.3 riguarda il messaggio di stato della pagina). |
| SL-SPINNER-03 | Bassa | riclassificato | AAA / eccezione per i caricamenti. |
| SL-SPINNER-04 | Bassa | riclassificato | In `forcedcolors` l'indicatore resta visibile (stroke non forzato). |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| nome (`aria-label` localizzato) | Sì (fisso) | Sì: `progressbar "Loading"` | Sì |
| `label` personalizzabile | No | — | Utile, non necessario |

### Fix proposti
Nessuno (nessun errore verificato).
