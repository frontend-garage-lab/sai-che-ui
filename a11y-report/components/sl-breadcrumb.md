## Breadcrumb (`sl-breadcrumb` – src/components/breadcrumb/breadcrumb.component.ts)
**Pattern APG di riferimento:** Breadcrumb
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

> L'`aria-current="page"` scritto da questo componente sull'host dell'ultimo item (breadcrumb.component.ts:79-83) non arriva al link: l'errore è registrato in `sl-breadcrumb-item` come **SL-BREADCRUMB-ITEM-01** (fix su entrambi).

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Landmark `<nav>` nello shadow root: `navigation` → `link "Homepage"`, `link "Our Services"`, … Nessuna lista `ol/li` (raccomandazione APG, non requisito). |
| 2 | Nome/descrizione/stato | ⚠️ | Con `label="Percorso"` → `navigation "Percorso"`. Senza `label` (tutti gli esempi docs) il nav è senza nome (`aria-label=""`). Item corrente non esposto (vedi SL-BREADCRUMB-ITEM-01). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-label` sull'host non raggiunge il `<nav>` (verificato dal coordinatore per gli `aria-*` sull'host): si usa `label`, che funziona. `aria-current` scritto sull'host dell'item è perso. |
| 4 | Tastiera e focus | ✅ | Tab percorre i link/bottoni nativi in ordine DOM (`a[part=label]` → `button[part=label]`). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | `flex-wrap: wrap`: a 320 px gli item vanno a capo. Colori/target in sl-breadcrumb-item. |
| 8 | API pubblica a11y | ⚠️ | `label` funziona ma ha default vuoto non localizzato; l'item corrente non è configurabile (sempre l'ultimo). |
| 9 | Docs e test | ⚠️ | Esempi docs senza `label`; test axe con `color-contrast` disabilitato (breadcrumb.test.ts:5-7). |

### Errori verificati
— nessun errore verificato — (vedi SL-BREADCRUMB-ITEM-01 per `aria-current`)

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-BREADCRUMB-V01 | miglioramento | Default localizzato per `label` (es. "Percorso di navigazione") e non emettere `aria-label=""`; esempi docs con `label`. | breadcrumb.component.ts:38, 97 |
| SL-BREADCRUMB-V02 | miglioramento | Struttura a lista (`role="list"` + `role="listitem"` sugli item) come da APG, per l'annuncio "N elementi". | breadcrumb.component.ts:97-99 |
| SL-BREADCRUMB-V03 | miglioramento | Consentire di indicare l'item corrente (property `current` sull'item) invece di forzare l'ultimo. | breadcrumb.component.ts:79-83 |
| SL-BREADCRUMB-V04 | miglioramento | Rimuovere `ignoredRules = ['color-contrast']` dai test dopo il fix di SL-BREADCRUMB-ITEM-03; sezione Accessibility nei docs. | breadcrumb.test.ts:5-7 |

### Responsabilità del consumer
- Impostare `label` (es. `label="Percorso di navigazione"`) quando nella pagina ci sono più landmark `navigation` (header, sidebar): con `label` il nome è esposto (`navigation "Percorso"`).

### Da verificare con AT reali
- Nessuna verifica rilevante aperta oltre a quelle di sl-breadcrumb-item.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-BREADCRUMB-01 | Media | riclassificato | `label` esiste e funziona (`navigation "Percorso"`); il nome di un landmark unico non è requisito WCAG → consumer + V01. |
| SL-BREADCRUMB-02 | Bassa | riclassificato | La lista è raccomandazione APG; i link sono comunque raggruppati nel landmark → V02. |
| SL-BREADCRUMB-03 | Bassa | riclassificato | Test/docs → V04 (il contrasto hover è errore in SL-BREADCRUMB-ITEM-03). |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` | Sì | Sì (`navigation "Percorso"`) | Sì con più nav |
| `aria-label` sull'host | — | No (resta sull'host) | No, c'è `label` |
| `aria-current` automatico | Sì | No: scritto sull'host (`{"host":"page","inner":null}`) | Sì (vedi SL-BREADCRUMB-ITEM-01) |

### Fix proposti
Vedi SL-BREADCRUMB-ITEM-01; lato breadcrumb:
```ts
// handleSlotChange(): non scrivere aria-current sull'host, impostare la property dell'item
item.current = index === items.length - 1;
```
