## Split Panel (`<sl-split-panel>` – src/components/split-panel/split-panel.component.ts)
**Pattern APG di riferimento:** APG Window Splitter (`role="separator"` focusabile)
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 1 · Media 3 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ⚠️ | `separator "Resize" value="50" [orientation="horizontal" valuemin=0 valuemax=100]` ✅ come ruolo; ma l'orientamento è `horizontal` sia con pannelli affiancati (divisore verticale, si muove con ←/→) sia con `vertical` (SL-SPLIT-PANEL-01). |
| 2 | Nome/descrizione/stato | ✅ | Nome localizzato "Resize" (`localize.term('resize')`); valore aggiornato (`value="37.8125"` dopo un set). `disabled`: Chromium espone un `separator` statico senza valore e non focusabile (accettabile). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun idref. `aria-label` sull'host resta sull'host (`generic "Pannelli"`), il separator ha già un nome. |
| 4 | Tastiera e focus | ⚠️ | Tab → `div[part=divider]`; → +1, Shift+→ +10 (50 → 61), Enter collassa (→ 0) e ripristina (→ 61), Home 0, End 100 ✅. RTL: ← sposta visivamente il divisore a sinistra (x 638 → 501) ✅. In forced colors il focus rende il divisore invisibile (SL-SPLIT-PANEL-04). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Valore sul separator focusato. |
| 7 | Aspetti visivi | ❌ | Divisore non focusato 1.25:1 light / 1.36:1 dark (SL-SPLIT-PANEL-V01); focusato 6.18:1 / 8.02:1 ✅. Col puntatore solo trascinamento: click sul divisore non fa nulla (SL-SPLIT-PANEL-02). Target 4 px + hit area 12 px: nessun altro target adiacente nel componente, eccezione spacing 2.5.8 applicabile. |
| 8 | API pubblica a11y | ⚠️ | Nessuna `label` per un nome specifico del pannello (miglioramento). |
| 9 | Docs e test | ⚠️ | Nessun test di tastiera; docs senza descrizione dei tasti. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-SPLIT-PANEL-02 | Alta | Puntatore | Il ridimensionamento col puntatore è possibile solo trascinando: nessuna alternativa a puntatore singolo (click/tap). Workaround solo con controlli costruiti dal consumer su `position`, non documentato. | split-panel.component.ts:356-357 `@mousedown/@touchstart=${this.handleDrag}` (nessun `click`) | runtime: `click` sul divisore → `position` resta `50` | 2.5.7 (AA) | Click/doppio click sul divisore = collapse/expand (come Enter) o pulsanti di ridimensionamento nello slot `divider` |
| SL-SPLIT-PANEL-01 | Media | Semantica | `aria-orientation` assente: il `separator` è esposto `horizontal` anche nel layout di default, dove il divisore è verticale e risponde solo a ←/→ (↑/↓ non fanno nulla). | split-panel.component.ts:346-354 (nessun `aria-orientation`); :234-240 | runtime: pannelli affiancati → `separator "Resize" value="50" [orientation="horizontal" …]`; con `vertical` → stesso `orientation="horizontal"` | 4.1.2, 1.3.1; APG Window Splitter | `aria-orientation=${this.vertical ? 'horizontal' : 'vertical'}` |
| SL-SPLIT-PANEL-V01 | Media | Visivo | Il divisore, unico indicatore visivo del controllo, ha contrasto sotto 3:1 con lo sfondo in entrambi i temi. Personalizzabile via `::part(divider)` (documentato). | split-panel.styles.ts:24 `background-color: var(--sl-border-subtle)` | runtime: light `#e3e6e8 su #ffffff = 1.25:1`; dark `#283033 su #0f161a = 1.36:1` | 1.4.11 | Colore ≥ 3:1 (es. `--sl-color-neutral-400` light / equivalente dark) o handle visibile |
| SL-SPLIT-PANEL-04 | Media | Focus | In forced colors il focus fa sparire il divisore: senza focus ha un outline 1 px `CanvasText`, con focus `.divider:focus { outline: none }` lo annulla e il fondo è forzato a `Canvas`. | split-panel.styles.ts:32-39, :76-80 | runtime `forcedcolors`: non focusato `outlineStyle = solid`, `outlineColor = rgb(0,0,0)`, `backgroundColor = rgb(255,255,255)`; dopo Tab `outlineStyle = none`, `backgroundColor = rgb(255,255,255)` | 2.4.7 | `@media (forced-colors: active) { :host(:not([disabled])) .divider:focus-visible { outline: 2px solid Highlight; outline-offset: 1px } }` |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-SPLIT-PANEL-03 | miglioramento | Property `label` per un nome legato al pannello primario (APG), utile con più split panel. Oggi il nome "Resize" esiste ed è localizzato. | split-panel.component.ts:354 |
| SL-SPLIT-PANEL-06 | miglioramento | `aria-controls` verso il pannello primario (APG) con `ariaControlsElements`. | split-panel.component.ts:344, :362 |
| SL-SPLIT-PANEL-07 | miglioramento | Arrotondare `aria-valuenow` e aggiungere `aria-valuetext` ("38%"): oggi `value="37.8125"`. | split-panel.component.ts:351 |
| SL-SPLIT-PANEL-08 | miglioramento | `aria-disabled` con `disabled`: oggi Chromium espone un separator statico non focusabile, coerente con lo stato. | split-panel.component.ts:349 |
| SL-SPLIT-PANEL-09 | miglioramento | Test di tastiera (frecce, Home/End, Enter); descrizione dei tasti nei docs; transizioni con reduced motion (AAA). | split-panel.test.ts |

### Responsabilità del consumer
- Con divider personalizzati (`::part(divider)`, slot `divider`) garantire contrasto ≥ 3:1 e focus visibile (i docs lo ricordano, docs/pages/components/split-panel.md:1097).
- Nominare/strutturare i contenuti dei pannelli (es. landmark o heading).

### Da verificare con AT reali
- Annuncio di orientamento e valore del separator con NVDA/JAWS/VoiceOver (dopo il fix di SL-SPLIT-PANEL-01).
- Lettura del valore decimale (`37.8125`) da parte degli screen reader.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-SPLIT-PANEL-01 | Media | confermato | `orientation="horizontal"` anche con divisore verticale (runtime). |
| SL-SPLIT-PANEL-02 | Media | ridimensionato → Alta (+ SL-SPLIT-PANEL-V01) | 2.5.7 dimostrato (click non fa nulla) sulla funzione principale; il contrasto 1.25:1 / 1.36:1 è separato in V01 (Media); la parte 2.5.8 è scartata per l'eccezione spacing. |
| SL-SPLIT-PANEL-03 | Media | riclassificato (miglioramento) | Il nome esiste ed è localizzato; personalizzarlo è ergonomia. |
| SL-SPLIT-PANEL-04 | Media | confermato | In forced colors il divisore focusato perde l'outline e diventa invisibile (runtime). |
| SL-SPLIT-PANEL-05 | Bassa | scartato | In RTL ← sposta il divisore a sinistra (x 638 → 501): direzione coerente. |
| SL-SPLIT-PANEL-06 | Bassa | riclassificato (miglioramento) | Raccomandazione APG senza effetto su criteri A/AA. |
| SL-SPLIT-PANEL-07 | Bassa | riclassificato (miglioramento) | Valore esposto correttamente, solo non arrotondato. |
| SL-SPLIT-PANEL-08 | Bassa | riclassificato (miglioramento) | Separator disabilitato esposto come statico e non focusabile. |
| SL-SPLIT-PANEL-09 | Suggerimento | riclassificato (miglioramento) | Test/docs. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| Nome del separator | Default localizzato | ✅ `separator "Resize"` | Sì |
| `label` | No | — | Utile, non indispensabile |
| `position` | Sì | ✅ `value="50"` → `"61"` | Sì |
| `vertical` | Sì | ❌ non riflesso in `aria-orientation` | Sì |
| `disabled` | Sì | ✅ separator non focusabile | Sì |

### Fix proposti
```ts
// SL-SPLIT-PANEL-01 / -02
html`<div part="divider" class="divider"
  tabindex=${ifDefined(this.disabled ? undefined : '0')}
  role="separator"
  aria-orientation=${this.vertical ? 'horizontal' : 'vertical'}
  aria-valuenow=${this.position} aria-valuemin="0" aria-valuemax="100"
  aria-label=${this.localize.term('resize')}
  @keydown=${this.handleKeyDown}
  @mousedown=${this.handleDrag}
  @touchstart=${this.handleDrag}
  @dblclick=${this.toggleCollapse /* stessa logica di Enter */}
>`;
```
```css
/* SL-SPLIT-PANEL-V01 */
.divider { background-color: var(--sl-color-neutral-400); } /* verificare ≥ 3:1 anche in dark */
/* SL-SPLIT-PANEL-04 */
@media (forced-colors: active) {
  :host(:not([disabled])) .divider:focus-visible { outline: 2px solid Highlight; outline-offset: 1px; }
}
```
