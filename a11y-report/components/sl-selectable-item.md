## Selectable Item (`<sl-selectable-item>` – src/components/selectable-item/selectable-item.component.ts)
**Pattern APG di riferimento:** APG Checkbox (checkbox a due stati; per le liste, gruppo con nome).
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 1 · Media 2 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Ogni item espone un `checkbox` nativo (input in `sl-checkbox`). |
| 2 | Nome/descrizione/stato | ❌ | `checkbox [checked="true"]` **senza nome**. Il testo "Statement of Work.pdf" è un nodo `text` fratello, fuori dal label (SL-SELECTABLE-ITEM-01). Stato `checked` e `disabled` esposti correttamente. |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | Il testo dell'item sta nello shadow root dell'item, mentre l'input sta nello shadow root di `sl-checkbox`. `aria-label` sull'host non arriva all'input (verificato dal coordinatore per i passthrough `aria-*`). |
| 4 | Tastiera e focus | ✅ | Tab → `sl-selectable-item > sl-checkbox > input`. Space alterna lo stato (`checked` true → false) ed emette `sl-change` da `sl-checkbox` e da `sl-selectable-item`. L'item disabilitato viene saltato. |
| 5 | Form e validazione | N/A | Non partecipa ai form nativi (`name`/`value` non inoltrati): non è una funzione documentata. |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Label: 14.69–14.70:1 (light), 9.29–13.93:1 (dark). Meta (14 px): selezionato light 4.46:1, hover light 4.46:1, dark 3.49 / 3.25 (hover) / **2.17:1** (selezionato) (SL-SELECTABLE-ITEM-02). A 320 px la label viene troncata (SL-SELECTABLE-ITEM-04). `forcedcolors`: focus outline `solid`. |
| 8 | API pubblica a11y | ❌ | Nessun modo di dare un nome al checkbox interno. |
| 9 | Docs e test | ⚠️ | Il test axe non intercetta il checkbox senza nome; nessun test di tastiera. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-SELECTABLE-ITEM-01 | Alta | Nome/stato | Il checkbox interno non ha nome accessibile. `<sl-checkbox>` viene renderizzato vuoto e il testo dell'item sta in uno `<span>` fratello. Navigando con Tab, lo screen reader annuncia solo "casella di controllo selezionata/non selezionata" per ogni riga. Nessuna API pubblica lo corregge (l'`aria-label` sull'host non viene propagato). | src/components/selectable-item/selectable-item.component.ts:72-83 | runtime: `LabelText › checkbox [invalid="false" checked="true" … labelledby=[17]]` senza nome, seguito da `text "Statement of Work.pdf"`. Controprova del fix: `<sl-checkbox><slot></slot></sl-checkbox>` in uno shadow root → `checkbox "Statement of Work.pdf"` | WCAG 4.1.2 Name, Role, Value (A); 1.3.1; APG Checkbox | Proiettare lo slot di default dentro il checkbox: `<sl-checkbox …><slot></slot></sl-checkbox>` (poi spostare gli stili della label su `::part`/`exportparts`). |
| SL-SELECTABLE-ITEM-02 | Media | Aspetti visivi | Il testo meta (es. la data, 14 px, informativo) è sotto 4.5:1 negli stati selezionato e hover (light) e in tutti gli stati in dark. | src/components/selectable-item/selectable-item.styles.ts:60 `color: var(--sl-color-neutral-500);` | runtime light: selezionato `#6c757a su #f4fafb = 4.46:1`, hover `su #f8f9f9 = 4.46:1` (default 4.71:1); dark: default `#636e74 su #0f161a = 3.49:1`, hover 3.25:1, selezionato `su #024050 = 2.17:1` | WCAG 1.4.3 Contrast (Minimum) (AA) | `color: var(--sl-color-neutral-600)` (o `--sl-input-help-text-color`), da verificare sul fondo selezionato in dark. |
| SL-SELECTABLE-ITEM-04 | Media | Aspetti visivi / Reflow | La label (il nome dell'elemento selezionabile) è forzata su una riga con ellissi. A 320 px la parte nascosta non si può leggere in nessun modo. | src/components/selectable-item/selectable-item.styles.ts:43-48 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` | runtime `--viewport 320x640`, label "Statement of Work - Northern region renewal 2026.pdf": `[scrollWidth 354, clientWidth 140, "nowrap"]` → 214 px di testo nascosti | WCAG 1.4.10 Reflow (AA) | `white-space: normal; overflow-wrap: anywhere;` di default, troncamento opt-in. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-SELECTABLE-ITEM-05 | miglioramento | Test con verifica esplicita del nome calcolato del checkbox e test della tastiera (Space). Eventuale inoltro di `name`/`value` ai form nativi. | selectable-item.test.ts:7-16 |
| SL-SELECTABLE-ITEM-V01 | miglioramento | Associare la meta al checkbox come descrizione (es. inoltrarla nello slot `help-text` di `sl-checkbox`), così da leggerla durante la navigazione per controlli. | selectable-item.component.ts:85-87 |

### Responsabilità del consumer
- SL-SELECTABLE-ITEM-03: raggruppare gli item in un contenitore con nome (`<fieldset><legend>` o `role="group"` + `aria-labelledby`). Correggere anche l'esempio docs, che usa un `<div>` generico.

### Da verificare con AT reali
- Dopo il fix 01: lettura di nome e stato con NVDA/JAWS/VoiceOver e calcolo del nome da slot annidati in Firefox/Safari.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-SELECTABLE-ITEM-01 | Blocker | ridimensionato | Confermato a runtime (checkbox senza nome), ma la selezione resta operabile e il testo adiacente si legge in browse mode: non è "impossibile" → Alta. |
| SL-SELECTABLE-ITEM-02 | Media | confermato | Misurato: 4.46 (light selezionato/hover), fino a 2.17:1 (dark selezionato). |
| SL-SELECTABLE-ITEM-03 | Media | riclassificato | Il raggruppamento della lista è del consumer. La meta come descrizione è un miglioramento. |
| SL-SELECTABLE-ITEM-04 | Bassa | ridimensionato | Troncamento della label dimostrato a 320 px; la label è il nome dell'elemento → Media. |
| SL-SELECTABLE-ITEM-05 | Suggerimento | riclassificato | Test/form. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| `checked` → `checked` | Sì | Sì: `checked="true"` | Sì |
| `disabled` → `disabled` | Sì | Sì: `checkbox [disabled …]`, saltato da Tab | Sì |
| nome del checkbox (dal testo dello slot) | No | No: `checkbox` senza nome | Sì (fix 01, senza nuove API) |
| `aria-label` sull'host | No | No (resta sull'host) | Non necessario dopo il fix |

### Fix proposti
```ts
// selectable-item.component.ts:72-83
<sl-checkbox
  part="checkbox"
  exportparts="base:checkbox__base, label:label"
  class="selectable-item__checkbox"
  ?checked=${this.checked}
  ?disabled=${this.disabled}
  @sl-change=${this.handleCheckboxChange}
><slot></slot></sl-checkbox>
```
```css
/* selectable-item.styles.ts */
.selectable-item__meta { color: var(--sl-color-neutral-600); }
.selectable-item__label { white-space: normal; overflow-wrap: anywhere; }
```
