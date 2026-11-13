## Stat Group (`<sl-stat-group>` – src/components/stat-group/stat-group.component.ts)
**Pattern APG di riferimento:** APG Button (toggle button con `aria-pressed`) in `role="group"`
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

Il contrasto della label dello stat selezionato in dark è un errore di `sl-stat` (SL-STAT-01, stat.styles.ts) e si manifesta in ogni gruppo con un valore selezionato: è tracciato lì.

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `group "Filter by status"` con figli `button … [pressed]`. |
| 2 | Nome/descrizione/stato | ✅ | `label` → nome del gruppo; `button "8 Working" [pressed="true"]`, `"1234 Signed" [pressed="false"]`, `"0 Staging" [disabled]`. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Il `role="group"` nello shadow contiene correttamente gli stat slottati. |
| 4 | Tastiera e focus | ✅ | Tab tra gli stat abilitati; Enter seleziona, Space sullo stesso stat deseleziona (`value` → `""`); il disabilitato è saltato. Focus visibile anche in forced colors. |
| 5 | Form e validazione | N/A | Non è un form control. |
| 6 | Live region | N/A | Il risultato del filtro è nella pagina del consumer. |
| 7 | Aspetti visivi | ⚠️ | `flex-wrap` ✅; contrasto selezionato in dark → SL-STAT-01 (sl-stat). |
| 8 | API pubblica a11y | ✅ | `label` propagata (`group "Filter by status"`). |
| 9 | Docs e test | ⚠️ | Test axe e `aria-pressed` presenti; nessun test di tastiera. |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-STAT-GROUP-01 | miglioramento | Warning in dev mode se `label` manca (oggi `group` senza nome). | stat-group.component.ts:30-31, :79-80 |
| SL-STAT-GROUP-02 | miglioramento | Con `required` valutare semantica `radiogroup`/`radio`, o documentare che il toggle premuto non si rilascia. | stat-group.component.ts:33-34, :63 |
| SL-STAT-GROUP-04 | miglioramento | Test di tastiera (Enter/Space) e axe con stat selezionato/disabilitato. | stat-group.test.ts:21-64 |

### Responsabilità del consumer
- Impostare sempre `label` (es. "Filtra per stato") (SL-STAT-GROUP-01).
- Annunciare il risultato del filtro (es. `role="status"` "8 documenti Working") nella lista filtrata (SL-STAT-GROUP-03).

### Da verificare con AT reali
- Nessuna verifica rilevante aperta: `aria-pressed` su `<button>` nativo è esposto correttamente (`pressed="true"`); facoltativo controllare l'annuncio "premuto/non premuto" con NVDA/JAWS/VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-STAT-GROUP-01 | Bassa | riclassificato (consumer + miglioramento) | `label` esiste e funziona; ometterla è uso scorretto del consumer. |
| SL-STAT-GROUP-02 | Suggerimento | riclassificato (miglioramento) | Scelta di pattern, nessun criterio violato. |
| SL-STAT-GROUP-03 | Bassa | riclassificato (consumer) | Il risultato del filtro è contenuto del consumer. |
| SL-STAT-GROUP-04 | Suggerimento | riclassificato (miglioramento) | Test. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` | Sì | ✅ `group "Filter by status"` | Sì |
| `value` | Sì | ✅ `pressed="true"` sullo stat corrispondente | Sì |
| `required` | Sì | ✅ comportamento | — |

### Fix proposti
Nessun errore verificato in questo componente (per SL-STAT-01 vedi `sl-stat.md`).
