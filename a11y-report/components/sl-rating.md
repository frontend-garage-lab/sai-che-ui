## Rating (`sl-rating` – src/components/rating/rating.component.ts)
**Pattern APG di riferimento:** APG Slider (Rating Slider) — `div role="slider"` custom
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 1 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `slider "Rating" value="3" [valuemin=0 valuemax=5]`; simboli `presentation`. |
| 2 | Nome/descrizione/stato | ✅ | Nome da `label` (`aria-label`); valore e massimo esposti; `precision="0.5"` → `value="2.5"`. Senza `label` → `slider value="0"` senza nome (consumer; esempi docs tutti con `label`). `valuetext=""` (non impostato: da verificare con AT). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento per id. |
| 4 | Tastiera e focus | ✅ | Tab → `sl-rating > div[part=base]`; ArrowRight 3→4, Home → 0, End → 5; PageUp/PageDown assenti (opzionali). `readonly`/`disabled` fuori dal Tab. Focus ring 6.18:1 light, 10.31:1 dark; forced-colors `solid` `Highlight`. |
| 5 | Form e validazione | N/A | Non è un form control. |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Light: stelle attive 2.15:1, inattive 1.56:1, attive vs inattive ~1.38:1 con lo stesso simbolo (SL-RATING-01). Dark: attive 8.00:1, inattive 1.65:1. Simbolo 23.2×23.2px, controllo unico 115.9×23.2 isolato. |
| 8 | API pubblica a11y | ✅ | `label`, `readonly` (`aria-readonly="true"`), `disabled`, custom property colori documentate. |
| 9 | Docs e test | ⚠️ | Un solo test axe (miglioramento). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-RATING-01 | Alta | Aspetti visivi | Tema light di default: il valore (quante stelle sono piene) è dato solo dal colore dello stesso simbolo `star-fill`. Le stelle attive `amber-500` hanno 2.15:1 sullo sfondo, le inattive `neutral-300` 1.56:1, e tra loro ~1.38:1: valore e scala non sono percepibili. In dark le inattive (1.65:1) rendono illeggibile il massimo. Le custom property sono documentate, ma senza indicazioni sui colori accessibili. | src/components/rating/rating.styles.ts:5-6, 34, 43-46; src/components/rating/rating.component.ts:74 | runtime: `.rating__symbol--active #f59e0b su #ffffff = 2.15:1`; inattiva `#cbd0d2 su #ffffff = 1.56:1`; dark: attiva `8.00:1`, inattiva `#353d41 su #0f161a = 1.65:1` | 1.4.11 (AA), 1.4.1 (A) | Default `--symbol-color-active` ≥3:1 (es. `amber-600/700`) e `--symbol-color` ≥3:1 (`--sl-input-border-color`: 3.21 light / 3.48 dark), oppure simbolo inattivo diverso (contorno) per non affidarsi al solo colore. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-RATING-02 | miglioramento | `aria-valuetext` localizzato ("3 su 5") e `valueTextFormatter` (simboli value-based come le emoji). Oggi `valuenow`/`valuemax` sono comunque esposti. | rating.component.ts:271-277 |
| SL-RATING-03 | miglioramento | `aria-label=${ifDefined(this.label \|\| undefined)}` e warning dev se manca `label` (oggi `aria-label=""` → slider senza nome). | rating.component.ts:49, 272 |
| SL-RATING-04 | miglioramento | `readonly` è fuori dal Tab (`tabindex=-1`); il valore resta leggibile in browse mode (`slider "Rating" value="3"`). Valutare focusabile o `role="img"` con "3 su 5". | rating.component.ts:278 |
| SL-RATING-05 | miglioramento | Simbolo 23.2px: il controllo è un unico target 115.9×23.2 isolato (eccezione di spaziatura). `--symbol-spacing` leggermente maggiore porterebbe ogni stella a ≥24px. | rating.styles.ts:7-8, 39-41 |
| SL-RATING-06 | miglioramento | Forced-colors: le stelle attive usano `SelectedItem` come colore del testo su `Canvas` (rgb(179,215,255) su bianco nella palette emulata); la parte piena dei simboli parziali è `CanvasText`, uguale alle inattive (2.5 appare come 2). Il focus è visibile. | rating.styles.ts:85-90 |
| SL-RATING-07 | miglioramento | Test axe per readonly/disabled/precision e asserzioni ARIA. | rating.test.ts:9-12 |
| SL-RATING-09 | miglioramento | In `readonly` click e touch emettono comunque `sl-change` (runtime: `eventi: sl-change <- sl-rating`, `value` 3 invariato); PageUp/PageDown assenti. | rating.component.ts:128-135, 209-213 |

### Responsabilità del consumer
- Impostare sempre `label`; affiancare un testo visibile che spieghi cosa si valuta (SL-RATING-08), perché `label` è solo `aria-label`.
- Con `--symbol-color*` personalizzati garantire ≥3:1 sullo sfondo e tra attivo e inattivo, o usare `getSymbol` con simboli diversi.

### Da verificare con AT reali
- NVDA/JAWS/VoiceOver: annuncio del valore con `valuetext` vuoto (Chromium espone `valuetext=""`), cioè "3" contro "3 di 5".
- VoiceOver iOS / TalkBack: regolazione con gesti swipe su `role="slider"` custom senza `input`.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-RATING-01 | Alta | confermato | Contrasti misurati: 2.15 / 1.56 / ~1.38 in light, 1.65 per le inattive in dark. |
| SL-RATING-02 | Media | riclassificato | `valuenow`/`valuemax` esposti: `aria-valuetext` è un miglioramento. |
| SL-RATING-03 | Media | riclassificato | Con `label` (sempre negli esempi docs) il nome c'è: consumer + miglioramento `ifDefined`. |
| SL-RATING-04 | Bassa | riclassificato | Il valore readonly è leggibile e non c'è funzione da operare: miglioramento. |
| SL-RATING-05 | Bassa | riclassificato | Target unico isolato da 115.9×23.2: eccezione di spaziatura applicabile. |
| SL-RATING-06 | Bassa | riclassificato | Focus visibile in forced-colors; parziale/SelectedItem è un miglioramento. |
| SL-RATING-07 | Bassa | riclassificato | Test: miglioramento. |
| SL-RATING-08 | Suggerimento | riclassificato | Label visibile: consumer. |
| SL-RATING-09 | Suggerimento | riclassificato | `sl-change` in readonly confermato a runtime, non è a11y A/AA: miglioramento. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `label` | Sì | Sì: `slider "Rating"`; vuota → `aria-label=""` | Sì |
| `readonly` | Sì | Sì: `aria-readonly="true"`, fuori dal Tab | Sì |
| `disabled` | Sì | Sì: `aria-disabled`, `tabindex=-1` | Sì |
| `--symbol-color` / `--symbol-color-active` | Sì | Sì (documentate in JSDoc) | Sì, ma default non conformi |
| `aria-valuetext` | No | — | Miglioramento |

### Fix proposti
Misure dei candidati (harness): `amber-700` 5.02:1 su bianco (dark 12.63:1); `amber-600` 3.19:1; `amber-700` contro un'inattiva `--sl-input-border-color` solo 1.56:1. Il solo cambio colore non basta: serve anche una forma diversa per lo stato inattivo (1.4.1).
```css
/* rating.styles.ts */
:host {
  --symbol-color: var(--sl-input-border-color);        /* inattivo 3.21:1 light, 3.48:1 dark */
  --symbol-color-active: var(--sl-color-amber-700);    /* attivo 5.02:1 light, 12.63:1 dark */
}
```
```ts
// rating.component.ts: simbolo di default diverso per gli stati (contorno vs pieno)
@property() getSymbol: (value: number, active?: boolean) => string = (_v, active) =>
  `<sl-icon name="${active ? 'star-fill' : 'star'}" library="system"></sl-icon>`;
// nel render passare displayValue >= index + 1 come secondo argomento; la libreria system ha solo 'star-fill':
// aggiungere a src/components/icon/library.system.ts l'icona 'star' (Bootstrap Icons bi-star, contorno)
```
