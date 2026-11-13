## Stat (`<sl-stat>` – src/components/stat/stat.component.ts)
**Pattern APG di riferimento:** Nessuno da solo (contenuto statico); dentro `sl-stat-group` APG Button (toggle con `aria-pressed`)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Fuori dal gruppo: testo (`text "1284"`, `text "Distributed"`); nel gruppo `button` nativo. |
| 2 | Nome/descrizione/stato | ✅ | `button "8 Working" [pressed="true"]`, `button "1234 Signed" [pressed="false"]`, `button "0 Staging" [disabled]`. **Trend**: il componente non ha API di trend/delta; `variant` colora solo il badge dell'icona e il significato è sempre nel testo della label → nessuna informazione affidata solo al colore. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nome dal testo slottato; nessun idref. |
| 4 | Tastiera e focus | ✅ | Tab sugli stat abilitati, Enter seleziona, Space deseleziona (`value` → `""`); il disabilitato è saltato (`focus: body` dopo l'ultimo). Focus visibile anche in forced colors (`outlineStyle = solid`). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Aggiornamenti di `count` in tempo reale: consumer. |
| 7 | Aspetti visivi | ❌ | Stato selezionato in dark: label 1.60–4.21:1 (SL-STAT-01). Light 4.94–6.29:1 ✅. Count (20 px bold, testo grande) ≥ 4.19:1 ✅. Forced colors: selezionato `outline` solid `Highlight`, non selezionato `none` ✅. Stat 176×92 px ✅. |
| 8 | API pubblica a11y | ✅ | Testo dello slot sufficiente come nome. |
| 9 | Docs e test | ⚠️ | Test axe solo sullo stato non interattivo; JSDoc di `variant` cita un "coloured dot" non renderizzato. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-STAT-01 | Media | Visivo | Nel tema dark la label (`neutral-600`, 14 px normale) di uno stat selezionato sul fondo `--stat-tint` è sotto 4.5:1 per tutti i variant; riguarda l'esempio docs "KPI summary row" (`value="expiring"`, warning). | stat.styles.ts:77 `color: var(--sl-color-neutral-600)`; :131-135 `background-color: var(--stat-tint, var(--sl-color-primary-50))`; :80-108 | runtime `theme:dark`, stat selezionato: neutral `#869298 su #283033 = 4.21:1`, primary `su #0e6a81 = 1.94:1`, success `su #1b7459 = 1.78:1`, warning `su #8a6905 = 1.60:1`, danger `su #7b1e14 = 3.23:1`, accent `su #863f09 = 2.41:1`, nessun variant `su #024050 = 3.55:1`. Light: 4.94–6.29:1 ✅ | 1.4.3 | Label selezionata `--sl-color-neutral-1000` (dark `#ffffff`: 5.12:1 su warning, 5.69:1 su success; `neutral-900` non basta: 4.19:1 su warning) |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-STAT-02 | miglioramento | La label non viene troncata nei layout dei docs (l'host `inline-block` si allarga: `clientWidth = scrollWidth = 262`), ma `nowrap` impedisce il wrap: con label lunghe (~40 caratteri) a 320 px la pagina scorre in orizzontale (`scrollWidth 360`). Consentire il wrap. | stat.styles.ts:67-78 |
| SL-STAT-03 | miglioramento | `selected` fuori da un gruppo dà solo lo stile su un `div` (`<sl-stat selected>` → `text "1284"`, `text "Distributed"`): documentare che è effettivo solo nel gruppo. | stat.component.ts:42-46, :77 |
| SL-STAT-05 | miglioramento | Test axe sugli stati selected/disabled nel gruppo; correggere il JSDoc di `variant`. | stat.test.ts:6-10; stat.component.ts:36-40 |
| SL-STAT-06 | miglioramento | Stat `disabled` fuori dal Tab order (comportamento nativo, coerente): valutare `aria-disabled` per renderlo scopribile. | stat.component.ts:72 |

### Responsabilità del consumer
- Se si aggiungono indicatori di trend (frecce, colori) nello slot, includere testo ("+12% rispetto a ieri").
- SL-STAT-04: le icone del badge sono decorative (senza `label`, `aria-hidden`); se il consumer le rende informative deve dar loro un nome e garantire 3:1 (in dark primary/danger ~2.7:1 secondo il report precedente).
- Annunciare con una live region gli aggiornamenti di `count` in tempo reale.

### Da verificare con AT reali
- Annuncio del nome "8 Working" + stato premuto con NVDA/JAWS/VoiceOver (ordine count/label).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-STAT-01 | Alta | ridimensionato → Media | Valori misurati (1.60–4.21:1), ma solo nello stato selezionato del tema dark. |
| SL-STAT-02 | Media | riclassificato (miglioramento) | Nessun troncamento nei layout reali; overflow solo con label lunghe. |
| SL-STAT-03 | Bassa | riclassificato (miglioramento) | Uso non documentato fuori dal gruppo. |
| SL-STAT-04 | Bassa | riclassificato (consumer) | Icone decorative (esenti da 1.4.11); il significato è nella label. |
| SL-STAT-05 | Bassa | riclassificato (miglioramento) | Test/docs. |
| SL-STAT-06 | Suggerimento | riclassificato (miglioramento) | Comportamento nativo di `disabled`. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| Slot default (label) | Sì | ✅ `button "8 Working"` | Sì |
| `selected` → `aria-pressed` | Sì (nel gruppo) | ✅ `pressed="true"` | Sì |
| `disabled` | Sì | ✅ `button [disabled]` | Sì |
| Trend/delta | No | — | Non previsto; eventuale aggiunta con testo |

### Fix proposti
```css
/* SL-STAT-01 – stato selezionato: in dark neutral-1000 = #ffffff (5.12:1 sul tint warning) */
.stat--selected .stat__label { color: var(--sl-color-neutral-1000); }
/* in light neutral-1000 è più scuro di neutral-600: contrasto invariato o migliore */
```
