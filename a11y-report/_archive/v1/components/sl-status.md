## Status (`<sl-status>` – src/components/status/status.component.ts)
**Pattern APG di riferimento:** nessun pattern APG (contenuto statico: indicatore decorativo + testo). Non è una live region (`role="status"` non applicato: corretto per uno stato di record).
**Esito sintetico:** ⚠️ Parzialmente conforme — nessun difetto rilevato nel codice (a condizione che il consumer fornisca sempre la label testuale); restano verifiche "NON VERIFICABILE" (vedi sezione dedicata), quindi non dichiarabile conforme finché non sono eseguite.
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 2 · Suggerimento 2

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<span>` generici; dot = `<span part="indicator">` vuoto (r. 48), quindi nessun contenuto esposto agli AT; il testo nello slot (r. 49) porta il significato. |
| 2 | Nome, descrizione, stato | ⚠️ | Lo stato "in corso" espresso da `pulse` è solo visivo; nessun warning se lo slot è vuoto (resta solo il dot colorato). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID; il testo slottato resta nel flusso di lettura. |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Componente statico; un cambio di stato dinamico va annunciato dal consumer (non documentato). |
| 7 | Aspetti visivi | ✅ | Label neutral-800 su bianco 12.51/12.01 ✅; filled: -800 su -50 ≥6.23 (come sl-tag), neutral-800 su neutral-100 11.34/10.19 ✅. Dot: il colore non è l'unica informazione (c'è la label) ✅; contrasto del dot warning/accent-500 su bianco 2.58 (light) — non essenziale. `prefers-reduced-motion` gestito (styles r. 153-157) ✅; `forced-colors` gestito (r. 159-168) ✅. `::after` usato solo per l'alone decorativo ✅. |
| 8 | API pubblica a11y | ✅ | Non servono property ARIA; eventuale testo sr-only per `pulse` (vedi suggerimento). |
| 9 | Documentazione e test | ⚠️ | Test axe presente (test r. 12-15) ✅; docs non dicono che la label è obbligatoria né come annunciare i cambi di stato. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-STATUS-01 | Bassa | Nome, descrizione, stato | `pulse` comunica "stato in corso" solo con l'animazione del dot; per AT (e con reduced motion, dove l'animazione è rimossa) l'informazione sparisce se la label non lo dice già. | src/components/status/status.component.ts:37-38, 44-46; status.styles.ts:133-157 | WCAG 1.3.1; 1.4.1 (analogo per movimento) | Testo sr-only localizzato quando `pulse` (es. chiave `inProgress` → "in corso") oppure documentare che la label deve esprimerlo. |
| SL-STATUS-02 | Bassa | Aspetti visivi | Con slot vuoto resta solo il dot colorato (6 px, warning/accent 2.58:1 su bianco): stato comunicato solo col colore; nessun warning in dev. (consumer) | src/components/status/status.component.ts:48-49 | WCAG 1.4.1; 1.1.1 | Warning in dev mode se lo slot è vuoto; docs: label obbligatoria. |
| SL-STATUS-03 | Suggerimento | Aspetti visivi | Pulse infinito anche senza reduced motion (contenuto in movimento > 5 s senza pausa); mitigato dalla media query. | src/components/status/status.styles.ts:139 `animation: status-pulse 1.6s ease-out infinite;` | WCAG 2.2.2 | Limitare le iterazioni o documentare che `pulse` va rimosso a stato concluso. |
| SL-STATUS-04 | Suggerimento | Documentazione | Docs senza nota a11y: label obbligatoria, cambio di stato da annunciare con live region del consumer. | docs/pages/components/status.md:1-40 | Qualità docs | Aggiungere sezione "Accessibilità". |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| Label testuale (slot default) | Sì | Sì | Unica fonte del significato |
| Testo sr-only per `pulse` | No | — | Opzionale (SL-STATUS-01) |
| `aria-*` / `role` | No | — | Non necessari |

### Fix proposti
```ts
render() {
  return html`
    <span part="base" class="status …">
      <span part="indicator" class="status__indicator"></span>
      <span part="label" class="status__label"><slot></slot></span>
      ${this.pulse ? html`<span class="sr-only">${this.localize.term('inProgress') /* nuova chiave */}</span>` : ''}
    </span>`;
}
```

### Non verificabile
- Contrasto di `--indicator-color` personalizzato dal consumer.
- Coerenza tra variante e testo della label (es. variant `danger` con label "Approvato"): contenuto del consumer.
