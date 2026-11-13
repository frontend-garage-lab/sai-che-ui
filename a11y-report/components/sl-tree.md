## Tree (`sl-tree` – src/components/tree/tree.component.ts)
**Pattern APG di riferimento:** Tree View (single / multi-select)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

> Gli errori della modalità `selection="multiple"` (checkbox senza nome, stato misto non esposto) e il troncamento delle label sono in `sl-tree-item` (SL-TREE-ITEM-01, SL-TREE-ITEM-03).

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `tree "Alberi" [multiselectable=false orientation="vertical"]` → `treeitem` → `group` → `treeitem`: Chromium attraversa slot e `role="group"` nello shadow root. |
| 2 | Nome/descrizione/stato | ✅ | Livelli calcolati (`level=1/2/3`), `expanded`, `selected`, `disabled`, `multiselectable` con `selection="multiple"`. Il nome del tree arriva da `aria-label` sull'host (host con `role="tree"`); gli esempi docs non lo mettono (consumer). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruoli/stati sugli host light DOM; nessun riferimento ID tra shadow root. |
| 4 | Tastiera e focus | ⚠️ | Funzionano: Tab entra nel tree e ne esce (`Tab → button#b`), roving tabindex con ritorno all'ultimo item (`Shift+Tab → "Leaf top"`), Up/Down/Home/End, ArrowRight espande, ArrowLeft chiude, Enter/Space selezionano (`treeitem "Coniferous" [focused expanded selected]`). Deviazioni APG non bloccanti: ArrowLeft su figlio va al fratello precedente (`"Red maple" → ArrowLeft → "Field maple"`, non "Maple"), ArrowRight su foglia sposta il focus (`"Red maple" → "Oak"`), nessun typeahead, ingresso sul primo item anche se disabilitato (`"Dis" [disabled focused]`). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ✅ | Lazy: `treeitem "Loading Lazy" [busy=1]` (vedi sl-tree-item). |
| 7 | Aspetti visivi | ✅ | Vedi sl-tree-item: testo 9.07:1 / 8.75:1 (dark), focus ring 6.18:1 / 10.31:1, forced colors outline `solid`. |
| 8 | API pubblica a11y | ✅ | `aria-label`/`aria-labelledby` sull'host funzionano (`tree "Alberi"`); `selection` → `aria-multiselectable`. |
| 9 | Docs e test | ⚠️ | Docs senza `aria-label` negli esempi né sezione tastiera; test axe solo su single. |

### Errori verificati
— nessun errore verificato —

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-TREE-V01 | miglioramento | ArrowLeft su un figlio chiuso/foglia: spostare il focus al genitore (APG) invece che all'item precedente. Dimostrato: `"Red maple" → ArrowLeft → "Field maple"`. Il genitore resta raggiungibile con ArrowUp. | tree.component.ts:275-276 |
| SL-TREE-V02 | miglioramento | ArrowRight su foglia: non fare nulla (APG). Dimostrato: `"Red maple" → ArrowRight → "Oak"`. | tree.component.ts:264-265 |
| SL-TREE-V03 | miglioramento | Typeahead (APG "recommended") e `*` per espandere i fratelli. | tree.component.ts:225 |
| SL-TREE-V04 | miglioramento | Ingresso nel tree: focalizzare l'item selezionato o il primo abilitato (oggi il primo del DOM anche se disabilitato: `treeitem "Dis" [disabled focused]`; ArrowDown recupera). | tree.component.ts:338-340 |
| SL-TREE-V05 | miglioramento | Docs: mostrare `aria-label` sull'host in ogni esempio, sezione tastiera; warning in dev mode se il tree non ha nome. | docs/pages/components/tree.md |
| SL-TREE-V06 | miglioramento | Il keydown ignora solo `input`/`textarea`: eventuali bottoni/link annidati in un item perderebbero Enter/Space (nessun uso documentato; i controlli annidati in un treeitem sono comunque sconsigliati). | tree.component.ts:229-240 |
| SL-TREE-V07 | miglioramento | Test axe in `multiple`/`leaf`, test ArrowLeft figlio→genitore. | tree.test.ts |

### Responsabilità del consumer
- Dare un nome al tree con `aria-label`/`aria-labelledby` sull'host (ARIA 1.2: nome richiesto per `tree`); funziona: `tree "Alberi"`.

### Da verificare con AT reali
- Annuncio di livello/posizione ("livello 2, 1 di 3") con NVDA/JAWS (Chrome) e VoiceOver (Safari) per item nidificati via slot: Chromium calcola `level` correttamente, `posinset/setsize` non sono stampati dall'harness.
- Annuncio di espansione/compressione e `aria-busy` durante il lazy load.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-TREE-01 | Media | riclassificato | Dimostrato (`"Red maple" → "Field maple"`), ma il genitore è raggiungibile con ArrowUp: deviazione APG, nessuna funzione inoperabile → V01. |
| SL-TREE-02 | Bassa | riclassificato | Dimostrato (`"Red maple" → "Oak"`), non blocca alcuna funzione → V02. |
| SL-TREE-03 | Bassa | riclassificato | Typeahead è opzionale/raccomandato APG → V03. |
| SL-TREE-04 | Bassa | riclassificato | Dimostrato ingresso sul primo item (anche disabilitato); ordine comunque coerente, ArrowDown recupera → V04. |
| SL-TREE-05 | Bassa | riclassificato | `aria-label` sull'host funziona (`tree "Alberi"`): responsabilità del consumer + docs → V05. |
| SL-TREE-06 | Bassa | riclassificato | Scenario ipotetico senza uso documentato → V06. |
| SL-TREE-07 | Suggerimento | riclassificato | Tasti opzionali e test → V03/V07. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `aria-label`/`aria-labelledby` sull'host | Consumer | Sì (`tree "Alberi"`) | Sì (nome richiesto) |
| `selection` → `aria-multiselectable` | Sì | Sì (`multiselectable` con `multiple`) | Sì |
| `label` | No | — | No (l'host ha il ruolo, `aria-label` basta) |

### Fix proposti
Nessun errore verificato in questo componente (fix degli errori in sl-tree-item).
