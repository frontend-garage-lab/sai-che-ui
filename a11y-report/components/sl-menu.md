## Menu (`sl-menu` – src/components/menu/menu.component.ts)
**Pattern APG di riferimento:** Menu (verticale) — https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ ; Menu Button — https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

> Gli errori sugli item (indicatore di focus, sottomenu) e sulle label di gruppo sono nei report `sl-menu-item` e `sl-menu-label`.

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ✅ | `menu "Modifica" [orientation="vertical"]` con figli `menuitem`, `menuitemcheckbox`, `separator`. |
| 2 | Nome/descrizione/stato | ✅ | `aria-label` sull'host funziona (runtime `menu "Modifica"`); senza, `menu` senza nome (nome non obbligatorio per `menu` in ARIA 1.2; miglioramento in dropdown). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo sull'host, item nel light DOM. |
| 4 | Tastiera e focus | ✅ | Tab entra sul primo item (`Undo`), ArrowDown/ArrowUp con wrap (`Undo`→`Redo`; ↑↑ → `Delete`), Home/End ✅, item disabilitati raggiungibili ma `[disabled]`, Space su checkbox → `sl-select` e `checked="false"`, Tab esce (`button#post`). Typeahead assente (`d`, `c` non spostano il focus) ma dichiarato nelle docs (miglioramento: opzionale in APG). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Bordo pannello decorativo; indicatori negli item. |
| 8 | API pubblica a11y | ✅ | `aria-label`/`aria-labelledby` del consumer sull'host. |
| 9 | Docs e test | ⚠️ | Docs dichiarano "type-to-select" non implementato; test senza axe/Home/End. |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-MENU-01 | miglioramento | Typeahead assente (runtime: `type:d` e `type:c` lasciano il focus su `Undo`) mentre le docs lo dichiarano: implementarlo o correggere le docs. | src/components/menu/menu.component.ts:57-99; docs/pages/components/menu.md:8 |
| SL-MENU-02 | miglioramento | Nome di default dal trigger del dropdown (`aria-labelledby`); documentare `aria-label` per menu standalone. | menu.component.ts:28-31 |
| SL-MENU-03 | miglioramento | Ruolo via `setAttribute` sovrascrive un `role` del consumer; nessuna verifica dei figli. | menu.component.ts:30, 158-163 |
| SL-MENU-04 | miglioramento | Test axe e tastiera (Home/End, wrap). | src/components/menu/menu.test.ts |
| SL-MENU-05 | miglioramento | `menuitemradio`/gruppi radio. | menu.component.ts:118-123 |

### Responsabilità del consumer
- Inserire nel menu solo `sl-menu-item`, `sl-divider`, `sl-menu-label`; dare un nome al menu standalone con `aria-label`.

### Da verificare con AT reali
- Nessuna verifica rilevante oltre a quelle degli item.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-MENU-01 | Media | riclassificato | Typeahead opzionale in APG; operabilità piena con frecce/Home/End; docs da correggere |
| SL-MENU-02 | Bassa | riclassificato | Nome non obbligatorio per `menu`; `aria-label` funziona |
| SL-MENU-03 | Bassa | riclassificato | Robustezza ipotetica |
| SL-MENU-04 | Bassa | riclassificato | Test mancanti |
| SL-MENU-05 | Suggerimento | riclassificato | Funzione nuova |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `role="menu"` | Automatico | Sì: `menu [orientation="vertical"]` | Sì |
| `aria-label` sull'host | Attributo nativo | Sì: `menu "Modifica"` | Consigliato |

### Fix proposti
Nessuno (nessun errore verificato).
