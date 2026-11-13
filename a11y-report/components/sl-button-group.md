## Button Group (`sl-button-group` – src/components/button-group/button-group.component.ts)
**Pattern APG di riferimento:** WAI-ARIA `group`
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness), revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `group "Alignment"` con i 3 `button` figli. Dentro `sl-radio-group`: `radiogroup "Size"` con `radio`, senza nodi spuri |
| 2 | Nome/descrizione/stato | ✅ | Il nome arriva da `label`; senza `label` il `group` è senza nome (non obbligatorio) |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-labelledby` sull'host dà `generic "Storia"` attorno a un `group` senza nome. `label` dà lo stesso risultato (miglioramento) |
| 4 | Tastiera e focus | ✅ | Ogni bottone è un tab stop |
| 5 | Form e validazione | N/A | |
| 6 | Live region | N/A | |
| 7 | Aspetti visivi | ✅ | Contrasti come in `sl-button`; il separatore è decorativo |
| 8 | API pubblica a11y | ✅ | `label` |
| 9 | Docs e test | ⚠️ | Test axe presente. Gli esempi Alignment e Toolbar non hanno stati (nemmeno visivi) |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-BUTTON-GROUP-01 | miglioramento | Nella docs, per le scelte esclusive rimandare a `sl-radio-group`/`sl-radio-button` | button-group.md:8-13, 624-660 |
| SL-BUTTON-GROUP-02 | miglioramento | Modalità toolbar con roving tabindex (opzionale nell'APG) | button-group.component.ts:71-86 |
| SL-BUTTON-GROUP-03 | miglioramento | `ifDefined` per `aria-label`; warning se manca `label` | button-group.component.ts:77-78 |
| SL-BUTTON-GROUP-04 | miglioramento | Ruolo e nome sull'host (ElementInternals) per supportare `aria-labelledby` | button-group.component.ts:74-78 |
| SL-BUTTON-GROUP-05 | miglioramento | Sezione Accessibilità nella docs | button-group.md |

### Responsabilità del consumer
- Impostare `label` sul gruppo; per i bottoni icon-only usare `<sl-icon label>`, come nell'esempio Toolbar.

### Da verificare con AT reali
- Nessuna verifica rilevante.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-BUTTON-GROUP-01 | Media | riclassificato | Gli esempi non mostrano stati, nemmeno visivi: nessuna informazione persa |
| SL-BUTTON-GROUP-02 | Media | riclassificato | La toolbar APG è opzionale; tutti i bottoni sono raggiungibili con Tab |
| SL-BUTTON-GROUP-03 | Bassa | riclassificato | Un group senza nome non viola WCAG |
| SL-BUTTON-GROUP-04 | Bassa | riclassificato | `label` dà lo stesso risultato |
| SL-BUTTON-GROUP-05 | Suggerimento | riclassificato | Docs |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `label` | Sì | Sì: `group "Alignment"` | Sì |
| `aria-labelledby` sull'host | No | No: `generic "Storia"` | No: c'è `label` |

### Fix proposti
Nessun errore verificato.
