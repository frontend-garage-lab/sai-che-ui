## Switch (`sl-switch` – src/components/switch/switch.component.ts)
**Pattern APG di riferimento:** APG Switch (`role="switch"` su `<input type="checkbox">` nativo)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `switch "Switch" [checked="false"]`, `switch "On" [checked="true"]`. |
| 2 | Nome/descrizione/stato | ✅ | Nome dallo slot, help-text in `desc="Aiuto"`, `[disabled]`. L'`aria-checked` esplicito coincide con lo stato nativo. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-describedby="help-text"` risolto nello shadow root. |
| 4 | Tastiera e focus | ✅ | Tab → `sl-switch > input`; Space → `checked="true"`; ArrowLeft → off, ArrowRight → on; Enter nessun effetto (opzionale in APG). Focus ring sul thumb 6.18:1 light, 10.31:1 dark; forced-colors `solid` `rgb(0,0,0)`. |
| 5 | Form e validazione | ✅ | `required` → `switch "Req *" [invalid="true"]` dal nativo. |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Light: track off 3.21:1, thumb 3.21:1 sul track, checked 6.18:1. Dark off: track 2.18:1 sulla pagina e thumb 2.18:1 sul track (SL-SWITCH-01). Target alto 16px (thumb 20px) e impilato (SL-SWITCH-05). Forced-colors: thumb off `Canvas` con bordo `CanvasText`, on `ButtonText`, quindi gli stati sono distinguibili. |
| 8 | API pubblica a11y | ✅ | Slot, `help-text`, `required`, `disabled`. |
| 9 | Docs e test | ⚠️ | Test axe solo base (miglioramento). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-SWITCH-01 | Media | Aspetti visivi | Tema dark, stato off: il track `neutral-400` (#464f53) ha 2.18:1 sulla pagina e il thumb `neutral-0` (#0f161a, uguale allo sfondo) ha 2.18:1 sul track, con bordo del thumb identico al track. Né il controllo né la posizione del thumb (lo stato) raggiungono 3:1. | src/components/switch/switch.styles.ts:52-53, 63-65 | runtime (`theme:dark`, senza focus): `.switch__control backgroundColor #464f53 su #0f161a = 2.18:1`; `.switch__thumb #0f161a su #464f53 = 2.18:1`; bordo thumb `1.00:1` | 1.4.11 (AA) | Track off con token ≥3:1 in dark (es. `--sl-input-border-color`/neutral-500) e thumb chiaro fisso, oppure bordo del thumb ad alto contrasto. |
| SL-SWITCH-05 | Bassa | Aspetti visivi | Il target (`<label>`) è alto 16px (medium; thumb 20px in overflow). Nell'esempio docs "Sizes" (impilati con `<br>`) le righe distano ~3px: l'eccezione di spaziatura non si applica. | src/components/switch/switch.styles.ts:16-19, 154-157 | runtime: `size:#a2 >>> label: 90.8x16.0 px`; label 20.6-34.6 / 37.9-53.9 / 54.7-74.7, thumb 18.6-36.6 / 35.9-55.9 | 2.5.8 (AA) | `.switch { min-block-size: 24px; }`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-SWITCH-02 | miglioramento | Property `label` per switch senza testo visibile; oggi si può già fare con `<sl-visually-hidden>` nello slot (da documentare). | switch.component.ts:201-227 |
| SL-SWITCH-03 | miglioramento | Non form-associated: `<label for>` esterna non si associa. | switch.component.ts:41 |
| SL-SWITCH-04 | miglioramento | Messaggio d'errore persistente collegato. `invalid` è già esposto dal nativo. | switch.component.ts:110-113 |
| SL-SWITCH-06 | miglioramento | Asterisco nel nome ("Req *"): `content: … / ''`. | switch.styles.ts:162-166 |
| SL-SWITCH-07 | miglioramento | Rimuovere `aria-checked` esplicito (ridondante, vietato da ARIA in HTML); in Chromium nessun effetto. | switch.component.ts:211 |
| SL-SWITCH-08 | miglioramento | Test axe per gli stati; sezione Accessibility nelle docs. | switch.test.ts:9-12 |

### Responsabilità del consumer
- Testo nello slot come nome; in tabella testo visivamente nascosto.
- Distanziare gli switch impilati di almeno 8px finché SL-SWITCH-05 non è corretto.

### Da verificare con AT reali
- VoiceOver/Safari e NVDA/Firefox: `role="switch"` su `input type=checkbox` con `aria-checked` esplicito, cioè annuncio "interruttore attivo/disattivo" e non "casella".

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-SWITCH-01 | Media | confermato | Misurato in dark: 2.18:1 per track e thumb. |
| SL-SWITCH-02 | Media | riclassificato | Nome ottenibile dallo slot (anche nascosto): miglioramento. |
| SL-SWITCH-03 | Media | riclassificato | Non necessario per l'uso documentato: miglioramento. |
| SL-SWITCH-04 | Media | scartato | `invalid="true"` esposto dal nativo. |
| SL-SWITCH-05 | Bassa | confermato | 16px di altezza, impilati a ~3px (docs "Sizes"). |
| SL-SWITCH-06 | Bassa | riclassificato | L'asterisco nel nome non viola criteri A/AA. |
| SL-SWITCH-07 | Bassa | riclassificato | Chromium espone lo stato corretto: pulizia (miglioramento). |
| SL-SWITCH-08 | Suggerimento | riclassificato | Test/docs: miglioramento. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| slot default (nome) | Sì | Sì: `switch "Switch"` | Sì |
| `help-text` | Sì | Sì: `desc="Aiuto"` | Sì |
| `required` | Sì | Sì: `invalid="true"` | Sì |
| `disabled` | Sì | Sì: `[disabled]` | Sì |
| `label` | No | — | No (slot) |

### Fix proposti
```css
/* switch.styles.ts */
.switch { min-block-size: 24px; }
.switch__control { background-color: var(--sl-switch-track-off, var(--sl-input-border-color)); border-color: var(--sl-switch-track-off, var(--sl-input-border-color)); }
.switch__control .switch__thumb { border-color: var(--sl-switch-track-off, var(--sl-input-border-color)); }
/* Stesso token anche nelle regole hover/focus (styles r. 89-103). In dark --sl-input-border-color = neutral-500 (#636e74):
   3.48:1 sulla pagina e 3.48:1 col thumb #0f161a (misurato come bordo checkbox dark). In light resta neutral-400 (3.21:1). */
```
