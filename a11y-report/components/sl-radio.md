## Radio (`sl-radio` – src/components/radio/radio.component.ts)
**Pattern APG di riferimento:** APG Radio Group (elemento `radio`; tastiera e roving tabindex gestiti da `sl-radio-group`)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `role="radio"` sull'host: `radio "Option 1" [checked="true"]` dentro `radiogroup`. |
| 2 | Nome/descrizione/stato | ✅ | Nome dallo slot; `checked` e `[disabled]` (da `aria-disabled`) esposti. Il ruolo è sull'host, quindi anche `aria-label` sull'host funziona (radio senza testo). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento per id; ruolo e stati sull'host. |
| 4 | Tastiera e focus | ⚠️ | Tastiera delegata al gruppo (vedi sl-radio-group: bug APG non bloccanti, miglioramenti). Focus ring `primary-600` 6.18:1 light, 10.31:1 dark; in forced-colors `outlineStyle=solid` `rgb(0,0,0)`. |
| 5 | Form e validazione | N/A | Gestiti da `sl-radio-group`. |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Bordo 3.21/3.49, label 12.50/12.07, fill checked 6.18/8.02, icona 6.18/8.02 (light/dark). Righe alte 18.8px e contigue (SL-RADIO-01). Forced-colors: icona checked `rgb(0,0,0)` su `Canvas`. |
| 8 | API pubblica a11y | ✅ | `value`, `disabled`, slot. |
| 9 | Docs e test | ⚠️ | Nessun test axe né asserzioni su `aria-checked`/`tabindex` (miglioramento). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-RADIO-01 | Bassa | Aspetti visivi | Nell'uso di default dentro `sl-radio-group` ogni radio (host `display:block`, cliccabile su tutta la riga) è alto 18.8px e le righe sono contigue: l'eccezione di spaziatura non si applica. | src/components/radio/radio.styles.ts:4-6, 50-51, 116 | runtime: `size:#r1: 1248.0x18.8 px`; r1 59-77.8, r2 77.8-96.6, r3 96.6-115.3 (gap 0) | 2.5.8 (AA) | `:host { padding-block: 3px }` oppure `.radio { min-block-size: 24px; align-items: center }`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-RADIO-02 | miglioramento | Warning in dev mode se il radio non ha testo né `aria-label`. | radio.component.ts:76-80, 107 |
| SL-RADIO-03 | miglioramento | Regola `.radio:not(.radio--checked) svg circle` morta: non raggiunge lo shadow di `sl-icon`. Forced-colors già leggibile (icona `CanvasText`). | radio.styles.ts:108-111 |
| SL-RADIO-05 | miglioramento | Test axe e asserzioni su `role`/`aria-checked`/`tabindex`. | radio.test.ts:6-23 |
| SL-RADIO-06 | miglioramento | Radio `disabled` + checked riceve `tabindex="0"` (focusabile pur disabilitato). CSS morto `.radio__input` / pressed feedback. | radio.component.ts:85; radio.styles.ts:64-75 |

### Responsabilità del consumer
- Usare `sl-radio` solo dentro `sl-radio-group`: fuori dal gruppo ha `tabindex="-1"` e nessuna gestione dei tasti (SL-RADIO-04).
- Dare un testo nello slot o `aria-label` sull'host.

### Da verificare con AT reali
- NVDA/JAWS (Chrome, Firefox) e VoiceOver/Safari: annuncio di posizione "1 di 3" per radio con ruolo sull'host di custom element slottati nel `fieldset role="radiogroup"` dello shadow del gruppo (Chromium non espone `setsize`/`posinset` espliciti).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-RADIO-01 | Media | ridimensionato | Confermato con `size:` (18.8px, righe contigue), ma l'impatto è limitato (target larghi 1248px, mancano ~5px): Bassa. |
| SL-RADIO-02 | Bassa | riclassificato | Warning dev mancante: miglioramento. |
| SL-RADIO-03 | Bassa | scartato | Forced-colors: icona checked `rgb(0,0,0)`, bordi `rgb(0,0,0)`, focus `solid`: stato leggibile. Regola morta → miglioramento. |
| SL-RADIO-04 | Bassa | riclassificato | Uso fuori dal gruppo non documentato: consumer. |
| SL-RADIO-05 | Bassa | riclassificato | Test: miglioramento. |
| SL-RADIO-06 | Suggerimento | riclassificato | Nessuna violazione A/AA: miglioramento. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| slot default (nome) | Sì | Sì: `radio "Option 1"` | Sì |
| `disabled` | Sì | Sì: `radio "Option 3" [disabled]` | Sì |
| `aria-label` (host) | Sì (nativo, ruolo sull'host) | Sì, il ruolo è sull'host | Solo per radio senza testo |

### Fix proposti
```css
/* radio.styles.ts */
:host { display: block; padding-block: 3px; } /* 18.8 + 6 ≥ 24px */
```
