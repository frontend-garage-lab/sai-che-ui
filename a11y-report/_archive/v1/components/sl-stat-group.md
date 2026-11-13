## Stat Group (`<sl-stat-group>` – src/components/stat-group/stat-group.component.ts)
**Pattern APG di riferimento:** APG Button (toggle buttons in `role="group"`); in alternativa APG Radio Group quando `required`
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 2 · Suggerimento 2

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `role="group"` sul wrapper interno con stats come `<button aria-pressed>` (r. 76-84; stat.component.ts:67-75). |
| 2 | Nome, descrizione, stato | ⚠️ | `label` → `aria-label` con `ifDefined` ✅ (r. 80) ma facoltativa, nessun avviso se manca (SL-STAT-GROUP-01); stato con `aria-pressed` ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Il gruppo nello shadow contiene gli stat slottati (albero accessibile appiattito). `aria-label` sull'host verrebbe ignorato, ma c'è `label`. |
| 4 | Tastiera e focus | ✅ | Ogni stat è un button nativo nel Tab order; il click (anche da Enter/Space) arriva a `handleClick` (r. 57-68). Focus ring da `sl-stat`. |
| 5 | Form e validazione | N/A | Non è un form control (nessuna partecipazione al form). |
| 6 | Live region | ⚠️ | L'effetto del filtro (lista aggiornata) non è annunciato; responsabilità del consumer (SL-STAT-GROUP-03). |
| 7 | Aspetti visivi | ⚠️ | Vedi sl-stat (SL-STAT-01 contrasto selected dark). Layout `flex-wrap` ✅ reflow. |
| 8 | API pubblica a11y | ✅ | `label` presente e propagata correttamente. |
| 9 | Documentazione e test | ⚠️ | Test axe ✅ e test `aria-pressed` ✅ (test r. 21-64); docs menzionano gli screen reader ✅ (docs r. 9); nessun test tastiera (SL-STAT-GROUP-04). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-STAT-GROUP-01 | Bassa | 2 | `label` è opzionale (default `''`): senza di essa il `role="group"` non ha nome e lo scopo dei toggle ("filtra per stato") non è comunicato; nessun warning in dev. | stat-group.component.ts:30-31, 79-80 | WCAG 1.3.1, 2.4.6 | Warning in dev mode se `label` manca (pattern SHARED §10). |
| SL-STAT-GROUP-02 | Suggerimento | 1 | Con `required` gli stat diventano una scelta singola obbligatoria: un toggle `aria-pressed="true"` che non si può "rilasciare" è meno chiaro di un radiogroup. | stat-group.component.ts:33-34, 63 | APG Radio Group / Button | Con `required` esporre `role="radiogroup"` + `role="radio"`/`aria-checked` con roving tabindex, oppure documentare il comportamento. |
| SL-STAT-GROUP-03 | Bassa | 6 | Selezionare uno stat emette solo `sl-change`: il risultato del filtro (n. record) non è annunciato. (consumer) | stat-group.component.ts:63-67 | WCAG 4.1.3 | Documentare l'uso di una live region `role="status"` nella lista filtrata (es. "8 documenti Working"). |
| SL-STAT-GROUP-04 | Suggerimento | 9 | Nessun test di tastiera (Enter/Space sul button) né axe con stat selezionato/disabilitato. | stat-group.test.ts:21-64 | Qualità | Aggiungere `sendKeys` e axe sugli stati. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | Sì | ✅ (`aria-label` sul `role="group"`, `ifDefined`) | Rendere consigliata con warning. |
| `aria-labelledby` | No | — | IDREF esterni non raggiungibili dallo shadow; `label` sufficiente. |
| `required` | Sì | ✅ comportamento | Semantica radiogroup opzionale (SL-STAT-GROUP-02). |
| `value` | Sì | ✅ | Riflesso su `aria-pressed` degli stat. |

### Fix proposti
```ts
updated() {
  if (!this.label) {
    console.warn('<sl-stat-group>: imposta "label" (es. "Filtra per stato") per dare un nome al gruppo di filtri.');
  }
}
```

### Non verificabile
- Annuncio "pulsante attivato/disattivato" con NVDA/JAWS/VoiceOver al cambio di selezione.
- Annuncio del risultato del filtro nella pagina del consumer.
