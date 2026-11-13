## Tab Panel (`sl-tab-panel` – src/components/tab-panel/tab-panel.component.ts)
**Pattern APG di riferimento:** Tabs (elemento `tabpanel`)
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `role="tabpanel"` sull'host (r. 38): `tabpanel "General" [labelledby=[General]]`. |
| 2 | Nome/descrizione/stato | ✅ | Nome da `aria-labelledby` impostato dal gruppo (tab-group.component.ts:330), risolto da Chromium. I pannelli inattivi sono `display:none` e assenti dall'albero. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | ID generato (r. 37) e riferimenti sull'host light DOM. |
| 4 | Tastiera e focus | ✅ | Pannello non focusabile: Tab dal tab attivo passa al primo focusabile successivo (`Tab → button#b`). APG suggerisce `tabindex=0` solo se il pannello non contiene focusabili: non è requisito WCAG (miglioramento). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | N/A | Nessun colore proprio. |
| 8 | API pubblica a11y | ✅ | `tabindex`/`aria-*` del consumer restano sull'host, che porta il ruolo. |
| 9 | Docs e test | ✅ | Test axe e su `aria-hidden`/ID presenti. |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-TAB-PANEL-V01 | miglioramento | Pannello con solo testo: opzione/indicazione docs per `tabindex="0"` sul pannello (APG). | tab-panel.component.ts:35-39 |
| SL-TAB-PANEL-V02 | miglioramento | `aria-hidden="false"` superfluo (il pannello inattivo è già `display:none`); usare `hidden` o rimuovere l'attributo. | tab-panel.component.ts:41-44 |

### Responsabilità del consumer
- Se un pannello contiene solo testo e si vuole lo stop APG, aggiungere `tabindex="0"` sull'host.

### Da verificare con AT reali
- Nessuna verifica rilevante aperta (annuncio del nome del pannello entrando nel contenuto: comportamento standard dell'AT su un `tabpanel` con `aria-labelledby` correttamente esposto).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-TAB-PANEL-01 | Suggerimento | riclassificato | Raccomandazione APG, non WCAG → V01. |
| SL-TAB-PANEL-02 | Suggerimento | riclassificato | Ridondanza senza effetto sbagliato in Chromium → V02. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `aria-labelledby` (dal gruppo) | Sì | Sì (`labelledby=[General]`) | Sì |
| `active` → `aria-hidden` + `display` | Sì | Sì (pannelli inattivi assenti dall'albero) | `aria-hidden` ridondante |
| `tabindex` sull'host | Consumer | Sì | Solo per pannelli senza focusabili |

### Fix proposti
Nessun errore verificato.
