## Icon (`sl-icon` – src/components/icon/icon.component.ts, library*.ts)
**Pattern APG di riferimento:** ruolo `img` (icona informativa) / `aria-hidden` (decorativa), secondo il WAI Images Tutorial
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness), revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Decorativa: nessun nodo ax (`aria-hidden="true"`). Con `label`: `image "Preferito"` |
| 2 | Nome/descrizione/stato | ✅ | Svuotando `label` l'icona torna nascosta (verificato). Nessun `<title>` negli SVG di `cdn/assets/icons` (0 file) né in library.system.ts |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Un `aria-label` messo dal consumer viene rimosso e l'icona nascosta (`i3 true null null`); con `label` un `aria-hidden` del consumer viene ignorato. La soluzione supportata è `label`: responsabilità del consumer |
| 4 | Tastiera e focus | N/A | |
| 5 | Form e validazione | N/A | |
| 6 | Live region | N/A | |
| 7 | Aspetti visivi | ✅ | Varianti su sfondo bianco: neutral 4.71, accent 3.22, success 4.61, warning 4.59, danger 4.60. Dark: 3.49 / 8.23 / 10.04 / 11.29 / 4.77. In forced-colors `currentColor` diventa `rgb(0,0,0)` |
| 8 | API pubblica a11y | ✅ | `label` |
| 9 | Docs e test | ✅ | Sezione Labels; test axe |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-ICON-M01 | miglioramento | Non sovrascrivere `aria-label`/`aria-hidden` dell'autore (fallback, ElementInternals) oppure warning in dev | icon.component.ts:135-148 |
| SL-ICON-02 | miglioramento | Ruolo e ARIA via `setAttribute` sull'host (rischio con la riconciliazione dei framework) | icon.component.ts:140-146 |
| SL-ICON-03 | miglioramento | Errore di caricamento: resta `image "Mancante"` su un'area 16x16 vuota. Aggiungere un fallback visibile | icon.component.ts:200-205 |
| SL-ICON-04 | miglioramento | Esempio con un testo d'azione su un'icona non interattiva; aggiungere una guida decorativa/informativa | icon.md:196-201 |
| SL-ICON-05 | miglioramento | Test per label resa vuota e per `aria-label` del consumer | icon.test.ts:81-98 |

### Responsabilità del consumer
- Usare `label` (non `aria-label`) per le icone informative; senza `label` l'icona è decorativa.
- Librerie custom (`registerIconLibrary`): SVG senza `<title>` e un mutator che imposti `currentColor`.

### Da verificare con AT reali
- Nessuna verifica rilevante.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-ICON-01 | Media | riclassificato | `label` funziona (`image "Preferito"`). `aria-label` al posto di `label` è un uso scorretto: consumer + miglioramento |
| SL-ICON-02 | Bassa | riclassificato | Robustezza ipotetica |
| SL-ICON-03 | Bassa | riclassificato | Scenario di errore di rete |
| SL-ICON-04 | Suggerimento | riclassificato | Docs |
| SL-ICON-05 | Suggerimento | riclassificato | Test |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `label` | Sì | Sì: `role="img"` + `aria-label` sull'host, ax `image "Preferito"` | Sì |
| `aria-label` del consumer | No | Rimosso, icona nascosta | No: c'è `label` |
| `variant` | Sì | Contrasti ≥3:1 | Sì |

### Fix proposti
Nessun errore verificato.
