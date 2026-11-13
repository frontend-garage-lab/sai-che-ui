## Checkbox (`sl-checkbox` – src/components/checkbox/checkbox.component.ts)
**Pattern APG di riferimento:** APG Checkbox (dual-state e mixed) — controllo nativo `<input type="checkbox">` dentro `<label>`
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 2
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `checkbox "Normale" [checked="false"]`; nativo dentro `LabelText`. |
| 2 | Nome/descrizione/stato | ⚠️ | Nome dallo slot, help-text in `desc="Aiuto"`. `indeterminate` → `checked="mixed"` ✅ (l'`aria-checked` esplicito non vince sul nativo in Chromium). Con `checked` + `indeterminate` insieme l'icona mostra la spunta ma lo stato esposto è `mixed` (SL-CHECKBOX-09). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-describedby="help-text"` nello stesso shadow root, risolto (`describedby=[help-text]`). `aria-*` sull'host non arrivano all'input (verificato dal coordinatore): non serve, il nome arriva dallo slot. |
| 4 | Tastiera e focus | ✅ | Tab → `sl-checkbox > input`; Space → `checked="true"`; disabled saltato. Focus ring `primary-600` 6.18:1 (light), 10.31:1 (dark); in forced-colors `outlineStyle=solid`, `outlineColor=rgb(0,0,0)`. |
| 5 | Form e validazione | ✅ | `required` non spuntato → `invalid="true"` già esposto dal nativo; dopo `reportValidity()` `invalid="true" focused`, messaggio nativo "Please check this box…". `setCustomValidity()` → `invalid="true"`. |
| 6 | Live region | N/A | Nessun contenuto dinamico. |
| 7 | Aspetti visivi | ⚠️ | Bordo 3.21:1 light / 3.49:1 dark, label 12.50/12.07, fill checked 6.18:1, icona 6.18:1 light / 8.02:1 dark, asterisco 4.6:1. Target 16px di altezza, impilati con gap < 3px (SL-CHECKBOX-05). Forced-colors: icona e bordo `rgb(0,0,0)` su `Canvas`, stato leggibile. |
| 8 | API pubblica a11y | ✅ | Slot (nome), `help-text`, `required`, `disabled`, `indeterminate` propagati. Nome senza testo visibile possibile con `<sl-visually-hidden>` nello slot. |
| 9 | Docs e test | ⚠️ | Un solo test axe sullo stato base; docs senza sezione Accessibility (miglioramento). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-CHECKBOX-05 | Bassa | Aspetti visivi | Il target (`<label>`) è alto quanto il control: 14/16/20px. Nell'esempio docs "Sizes" (checkbox impilati con `<br>`) le righe distano < 3px: il cerchio da 24px centrato su un target interseca i vicini, quindi l'eccezione di spaziatura non si applica. | src/components/checkbox/checkbox.styles.ts:40-41, 116 | runtime: `size:#m >>> label: 74.8x16.0 px`; label s 19.8-33.8, m 36.8-52.8, l 53.6-73.6 → cerchio di m 32.8-56.8 interseca s e l | 2.5.8 (AA) | `.checkbox { min-block-size: 24px; align-items: center; }` (oppure `padding-block` sul `<label>`). |
| SL-CHECKBOX-09 | Bassa | Nome/stato | Con `checked` e `indeterminate` entrambi true l'UI mostra la spunta, ma l'input nativo resta `indeterminate` ed è esposto come `mixed`: stato visivo e programmatico divergono (es. "seleziona tutto" in cui il consumer imposta `checked` senza azzerare `indeterminate`). | src/components/checkbox/checkbox.component.ts:211-212, 230-245 | runtime: `<sl-checkbox checked indeterminate>` → `checkbox "Entrambi" [checked="mixed"]`, icone renderizzate `["checked-icon:check"]` | 1.3.1, 4.1.2 (A) | Allineare al nativo: se `indeterminate` mostrare l'icona indeterminate (prioritaria sulla spunta), oppure azzerare `indeterminate` quando `checked` diventa true. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-CHECKBOX-01 | miglioramento | Rimuovere `aria-checked` esplicito dall'input nativo: vietato da ARIA in HTML e ridondante. In Chromium non produce effetti (`indeterminate` → `mixed`). | checkbox.component.ts:215 |
| SL-CHECKBOX-02 | miglioramento | Property `label` per checkbox senza testo visibile (righe di tabella). Oggi si può già fare con `<sl-visually-hidden>` nello slot: va documentato. | checkbox.component.ts:205-222, 247-249 |
| SL-CHECKBOX-03 | miglioramento | Il componente non è form-associated: `<label for>` esterna e `aria-describedby` del consumer non raggiungono l'input. Slot e `help-text` coprono l'uso documentato. | checkbox.component.ts:43 |
| SL-CHECKBOX-04 | miglioramento | Messaggio d'errore persistente e visibile (property `error-message` collegata con `aria-describedby`). Oggi lo stato `invalid` è esposto dal nativo e l'errore è il fumetto del browser. | checkbox.component.ts:126-129, 205-222 |
| SL-CHECKBOX-07 | miglioramento | L'asterisco `::after` entra nel nome ("Accetto *"). Non viola 2.5.3 (il nome contiene l'etichetta visibile); `content: var(--sl-input-required-content) / ''` lo toglierebbe. | checkbox.styles.ts:122-126 |
| SL-CHECKBOX-06 | miglioramento | Media query `forced-colors` per il fill checked (`Highlight`) e il disabled (`GrayText`). Oggi lo stato si legge comunque dall'icona `CanvasText`. | checkbox.styles.ts:87-91, 108-111 |
| SL-CHECKBOX-08 | miglioramento | Test axe per indeterminate/disabled/required; sezione Accessibility nelle docs. | checkbox.test.ts:10-13 |
| SL-CHECKBOX-V01 | miglioramento | Invio di un form con più controlli Shoelace invalidi: il focus va al controllo il cui listener `submit` è stato registrato per primo (ordine di definizione), non al primo invalido nel DOM. Con checkbox + switch required il focus è andato su `sl-switch` (in coda). Trasversale. | src/internal/form.ts:237-251 |

### Responsabilità del consumer
- Fornire sempre testo nello slot (o un testo visivamente nascosto) come nome.
- Non impostare `checked` e `indeterminate` insieme per lo stesso stato logico.
- Lasciare almeno 8px verticali tra checkbox impilati finché SL-CHECKBOX-05 non è corretto.

### Da verificare con AT reali
- Firefox e Safari con NVDA/VoiceOver: con `aria-checked="false"` esplicito e `indeterminate=true` va annunciato "misto". In Chromium è `mixed`; altri motori potrebbero dare precedenza all'attributo ARIA.
- VoiceOver/Safari: nome calcolato dal testo slottato dentro il `<label>` dello shadow root.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-CHECKBOX-01 | Alta | scartato | Chromium espone `checked="mixed"` con `indeterminate`: l'`aria-checked` non sovrascrive lo stato nativo. Resta un miglioramento di pulizia. |
| SL-CHECKBOX-02 | Media | riclassificato | Il nome si ottiene dallo slot, anche visivamente nascosto: miglioramento. |
| SL-CHECKBOX-03 | Media | riclassificato | `label for` esterno/FACE non serve all'uso documentato: miglioramento. |
| SL-CHECKBOX-04 | Media | scartato | `invalid="true"` è esposto dal nativo prima e dopo `reportValidity()`; c'è il messaggio nativo. |
| SL-CHECKBOX-05 | Media | ridimensionato | Confermato con `size:` (16px, eccezione di spaziatura non applicabile se impilati), ma l'impatto è limitato (target larghi, mancano 8px in altezza): Bassa. |
| SL-CHECKBOX-06 | Bassa | scartato | In forced-colors icona e bordo `rgb(0,0,0)` su `Canvas`, focus `solid` `CanvasText`: stato e focus visibili. |
| SL-CHECKBOX-07 | Bassa | riclassificato | "Accetto *" non viola nessun criterio A/AA: miglioramento. |
| SL-CHECKBOX-08 | Bassa | riclassificato | Test e docs: miglioramento. |
| SL-CHECKBOX-09 | Suggerimento | ridimensionato | Divergenza visivo/programmatico dimostrata (`mixed` con la spunta): errore Bassa. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| slot default (nome) | Sì | Sì: `checkbox "Normale"` | Sì |
| `help-text` / slot | Sì | Sì: `desc="Aiuto"` | Sì |
| `indeterminate` | Sì | Sì: `checked="mixed"` (tranne con `checked`, SL-CHECKBOX-09) | Sì |
| `required` | Sì | Sì: `invalid="true"` finché non è spuntato | Sì |
| `disabled` | Sì | Sì: `[disabled]`, fuori dal Tab | Sì |
| `label` / `aria-label` | No | — | No: lo slot con testo nascosto copre il caso |
| `error-message` | No | — | Miglioramento |

### Fix proposti
```ts
// checkbox.component.ts (render): l'icona indeterminate prevale, come nel nativo
${this.indeterminate
  ? html`<sl-icon part="indeterminate-icon" class="checkbox__indeterminate-icon" library="system" name="indeterminate"></sl-icon>`
  : this.checked
    ? html`<sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>`
    : ''}
```
```css
/* checkbox.styles.ts */
.checkbox { min-block-size: 24px; align-items: center; }
```
