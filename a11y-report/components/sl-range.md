## Range (`sl-range` – src/components/range/range.component.ts)
**Pattern APG di riferimento:** APG Slider (`<input type="range">` nativo)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `slider "Volume" value="0" [valuemin=0 valuemax=100 valuetext="0"]` nativo. Il tooltip è un `<output>` esposto come `status [live="polite" atomic]`. |
| 2 | Nome/descrizione/stato | ⚠️ | Nome da `label` (`<label for="input">`), help-text in `desc`. Con `tooltipFormatter` (`Total - ${v}%`) lo slider espone `valuetext="60"`, mentre il testo formattato "Total - 60%" è nello `status` adiacente (miglioramento: `aria-valuetext`). Senza `label` lo slider non ha nome (esempi docs senza label). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `for="input"` e `aria-describedby="help-text"` nello stesso shadow root. |
| 4 | Tastiera e focus | ✅ | Tab → `sl-range > input#input`; Arrow, Home/End, PageUp (+10) nativi (`value="60"`). Focus ring sul thumb (`::-webkit-slider-thumb`, `--sl-focus-ring`); in forced-colors l'outline del pseudo-elemento non si legge con `getComputedStyle` (Prova: codice, styles r. 83-86: outline non rimosso nella media query forced-colors). |
| 5 | Form e validazione | ✅ | `setCustomValidity()` → `slider [invalid="true"]` dal nativo. |
| 6 | Live region | ⚠️ | Lo `status` polite viene aggiornato a ogni input: possibile doppio annuncio (da verificare con AT). |
| 7 | Aspetti visivi | ❌ | Track di default 1.25:1 light / 1.36:1 dark (SL-RANGE-02). Il tooltip al focus copre la label e non si chiude con Esc (SL-RANGE-08). Tooltip 15.50:1 / 14.96:1, thumb `primary-600` 6.18:1. |
| 8 | API pubblica a11y | ⚠️ | `label`/slot, `help-text`, `tooltipFormatter` (solo visivo + status). Nessun `aria-valuetext` (miglioramento). |
| 9 | Docs e test | ⚠️ | 10 esempi docs senza `label` (miglioramento docs). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-RANGE-02 | Media | Aspetti visivi | Default `--track-color-active` = `--track-color-inactive` = `neutral-200`: il track, che dà estensione e posizione relativa del valore, è quasi invisibile e la porzione attiva non si distingue. A riposo lo stato si legge solo dal thumb su un binario non percepibile. Workaround documentato via custom property, ma l'esempio docs usa `primary-100` per il track inattivo. | src/components/range/range.styles.ts:7-8, 30-38 | runtime: `neutral-200` su pagina `#e3e6e8 su #ffffff = 1.25:1` (light), `#283033 su #0f161a = 1.36:1` (dark); `backgroundImage` del track tutto `rgb(227,230,232)` | 1.4.11 (AA) | Default `--track-color-active: var(--sl-color-primary-600)` e `--track-color-inactive: var(--sl-input-border-color)` (3.21:1 light / 3.48:1 dark). |
| SL-RANGE-08 | Bassa | Aspetti visivi | Il tooltip compare al focus (`tooltip="top"` di default) e, con il thumb vicino all'inizio, copre la label "Volume" (o il testo sopra, se non c'è label). Non si chiude con Esc senza spostare il focus. | src/components/range/range.component.ts:147-157 (nessun handler Escape); src/components/range/range.styles.ts:188-195 | runtime: focus sull'input, `tip [14,26,38,51]` sopra `label [16,35,65,52]`; `key:Escape` → `op "1"` invariato | 1.4.13 (AA) – dismissible | In `keydown` dell'input: `if (e.key === 'Escape' && this.hasTooltip) { this.hasTooltip = false; }`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-RANGE-01 | miglioramento | Con `tooltipFormatter` passare lo stesso testo in `aria-valuetext` sull'input (oggi `valuetext="60"`, "Total - 60%" solo nello `status`), più una property `valueTextFormatter` per i valori non numerici. | range.component.ts:93, 313-331, 335 |
| SL-RANGE-03 | da-verificare-AT | `<output>` (status polite) aggiornato a ogni input e sempre presente nell'albero: possibile doppio annuncio slider + status; meglio `aria-hidden` + `aria-valuetext`. | range.component.ts:332-338 |
| SL-RANGE-05 | miglioramento | Thumb 20px e track 6px. Il thumb è isolato, quindi conforme per l'eccezione di spaziatura; un thumb da 24px migliorerebbe l'uso touch. | range.styles.ts:5, 10 |
| SL-RANGE-06 | miglioramento | Aggiungere `label` agli esempi docs (preview principale, Min/Max, Disabled, Tooltip, Formatter…) e test axe su disabled/tooltip. | docs/pages/components/range.md:9, 95, 121, 147, 173, 306 |
| SL-RANGE-07 | miglioramento | Messaggio d'errore persistente collegato. `invalid` è già esposto dal nativo. | range.component.ts:223-226 |

### Responsabilità del consumer
- Impostare sempre `label` (o slot `label`): senza, `slider value="0"` non ha nome (SL-RANGE-04).
- Con `--track-color-*` personalizzati garantire ≥3:1 rispetto allo sfondo.

### Da verificare con AT reali
- NVDA/JAWS/VoiceOver: doppio annuncio del valore (slider + `status` polite) e lettura del testo formattato del tooltip.
- Firefox: focus ring sul `::-moz-range-thumb` in forced-colors.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-RANGE-01 | Media | riclassificato | `valuetext` numerico corretto e testo formattato esposto nello `status` adiacente: miglioramento (`aria-valuetext`). |
| SL-RANGE-02 | Media | confermato | Track 1.25:1 / 1.36:1 misurati. |
| SL-RANGE-03 | Bassa | riclassificato | Il doppio annuncio dipende dall'AT: da verificare. |
| SL-RANGE-04 | Bassa | riclassificato | `label` esiste ed è documentata: consumer (+ docs). |
| SL-RANGE-05 | Bassa | scartato | Thumb isolato, l'eccezione di spaziatura si applica; il click sul track è l'alternativa al drag (2.5.7). |
| SL-RANGE-06 | Bassa | riclassificato | Docs/test: miglioramento. |
| SL-RANGE-07 | Bassa | scartato | `setCustomValidity` → `invalid="true"` esposto dal nativo. |
| SL-RANGE-08 | Suggerimento | ridimensionato | 1.4.13 dimostrato: il tooltip copre la label e non si chiude con Esc. Bassa. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `label` / slot | Sì | Sì: `slider "Volume"` | Sì |
| `help-text` | Sì | Sì: `desc="Controls the volume…"` | Sì |
| `min`/`max`/`step` | Sì | Sì: `valuemin=0 valuemax=100` | Sì |
| `tooltipFormatter` | Sì | Solo tooltip/status, non `valuetext` | Miglioramento |
| `aria-valuetext` | No | — | Miglioramento |

### Fix proposti
```css
/* range.styles.ts */
:host {
  --track-color-active: var(--sl-color-primary-600);
  --track-color-inactive: var(--sl-input-border-color);
}
```
```ts
// range.component.ts: sull'<input> aggiungere @keydown=${this.handleKeyDown}
private handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && this.hasTooltip) {
    this.hasTooltip = false; // chiude il tooltip senza spostare il focus (1.4.13)
  }
}
```
