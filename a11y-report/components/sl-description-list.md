## Description List (`<sl-description-list>` – src/components/description-list/description-list.component.ts)
**Pattern APG di riferimento:** Nessun pattern APG interattivo; semantica HTML `<dl>/<dt>/<dd>` (ARIA `list`/`listitem` + `term`/`definition`)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ❌ | Chromium espone solo testo piatto: `text "Revision Code"`, `text "A1"`, `text "Second Revision Code"`, `text "—"`… nessun `list`/`term`/`definition` (SL-DESCRIPTION-LIST-01). |
| 2 | Nome/descrizione/stato | ⚠️ | Senza ruolo l'host non può avere un nome; con `role="list"` scritto dal consumer `aria-label` funziona (`list "Proprietà"`). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `role="list"` sull'host + `role="listitem"` sugli item funziona attraverso lo slot (`list > listitem [level=1]`). |
| 4 | Tastiera e focus | N/A | Statico. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Colori ✅ (vedi item). A 320 px l'esempio docs "Columns" (`cols="3"`) sovrappone le label e con `cols` di default si ha scroll orizzontale: causa nelle label `nowrap` dell'item (SL-DESCRIPTION-LIST-ITEM-02). |
| 8 | API pubblica a11y | ⚠️ | Solo `cols`; nessun `label`. |
| 9 | Docs e test | ⚠️ | Test axe passa ma non verifica la struttura; esempi con "—" come valore vuoto. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-DESCRIPTION-LIST-01 | Bassa | Semantica | La griglia di coppie etichetta/valore non espone alcuna struttura (contenitore `div` + `slot`, nessun ruolo sull'host): numero di voci e raggruppamento non sono determinabili. Impatto limitato: l'ordine di lettura mantiene etichetta → valore. Workaround non documentato: `role="list"`/`"listitem"` scritti dal consumer. | description-list.component.ts:25-30 | runtime: `text "Revision Code"`, `text "A1"`, `text "Second Revision Code"`, `text "—"`, `text "Title"`… senza contenitore; con `role` del consumer → `list "Proprietà" > listitem [level=1]` | 1.3.1 | `role="list"` sull'host in `connectedCallback` (se assente), item `listitem` + `term`/`definition` (vedi item) |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-DESCRIPTION-LIST-02 | miglioramento | Colonne fisse senza breakpoint (`repeat(var(--cols, 2), …)`): con le label che vanno a capo 3 colonne a 320 px restano leggibili; la sovrapposizione dimostrata dipende da `white-space: nowrap` dell'item (SL-DESCRIPTION-LIST-ITEM-02). Valutare `auto-fit`/`minmax`. | description-list.styles.ts:10 |
| SL-DESCRIPTION-LIST-03 | miglioramento | Property `label` (efficace dopo aver dato il ruolo all'host). | description-list.component.ts:22-23 |
| SL-DESCRIPTION-LIST-04 | miglioramento | Docs: sezione accessibilità; test che verifichi i ruoli. | docs/pages/components/description-list.md:12-14 |

### Responsabilità del consumer
- Valori vuoti: usare testo esplicito ("Non specificato") invece di "—" (SL-DESCRIPTION-LIST-04).
- Dare un titolo/heading al gruppo di proprietà nella pagina.

### Da verificare con AT reali
- Lettura di `list`/`listitem` e `term`/`definition` attraverso lo shadow DOM (dopo il fix) con NVDA/JAWS/VoiceOver: il supporto di `term`/`definition` non è uniforme.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-DESCRIPTION-LIST-01 | Media | ridimensionato → Bassa | Struttura assente dimostrata; l'ordine di lettura conserva l'accoppiamento e c'è un workaround con `role`. |
| SL-DESCRIPTION-LIST-02 | Bassa | riclassificato (miglioramento) | La sovrapposizione a 320 px è causata dal `nowrap` dell'item (errore in SL-DESCRIPTION-LIST-ITEM-02), non dalle colonne fisse. |
| SL-DESCRIPTION-LIST-03 | Bassa | riclassificato (miglioramento) | API mancante, nessun criterio violato in sé. |
| SL-DESCRIPTION-LIST-04 | Suggerimento | riclassificato (miglioramento + consumer) | Docs/test; "—" è contenuto del consumer. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `cols` | Sì | ✅ presentazionale | — |
| `role` (default interno) | No | — consumer: `role="list"` → `list` ✅ | Sì |
| `label` / `aria-label` | No | ✅ solo con `role` del consumer (`list "Proprietà"`) | Utile |

### Fix proposti
```ts
// SL-DESCRIPTION-LIST-01
connectedCallback() {
  super.connectedCallback();
  if (!this.hasAttribute('role')) this.setAttribute('role', 'list');
}
```
(La parte item — `listitem`, `term`, `definition` — è in `sl-description-list-item.md`.)
