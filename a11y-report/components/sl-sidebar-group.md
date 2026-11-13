## Sidebar Group (`sl-sidebar-group` – src/components/sidebar-group/sidebar-group.component.ts)
**Pattern APG di riferimento:** Navigation landmark con gruppi nominati (`role="group"`)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `group "Documenti di progetto"` con i link figli; `separator` tra i gruppi. |
| 2 | Nome/descrizione/stato | ✅ | Nome da `label`; contatore esposto come `status "70"` dopo il titolo. Con `label` vuoto il gruppo resta senza nome (consumer). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo e nome sullo stesso nodo interno. |
| 4 | Tastiera e focus | N/A | Nessun elemento interattivo proprio (l'icona con tooltip non è focusabile; il tooltip compare solo in collapsed). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | (`status` del badge: proprio di `sl-badge`) |
| 7 | Aspetti visivi | ❌ | Titolo 15.50:1 / 14.96:1; tile icona corrente 6.18:1 / 8.02:1, non corrente 6.02:1 / 4.86:1. **Contatore 3.21:1 (light) / 2.18:1 (dark)** (SL-SIDEBAR-GROUP-01). |
| 8 | API pubblica a11y | ✅ | `label` → nome del gruppo. |
| 9 | Docs e test | ⚠️ | Un solo test axe statico; nessun test in collapsed. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-SIDEBAR-GROUP-01 | Media | Contrasto | Il contatore del gruppo (testo informativo, esempio docs `count="70"`) ha contrasto insufficiente in entrambi i temi. | sidebar-group.styles.ts:76-80 (`color: var(--sl-color-neutral-400)`) | runtime: light `contrast:sl-sidebar-group >>> sl-badge >>> .badge: fg #889196 su bg #ffffff = 3.21:1`; dark `fg #464f53 su bg #0f161a = 2.18:1` | WCAG 1.4.3 (AA) | `color: var(--sl-color-neutral-600)` sul `::part(base)` del contatore. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-SIDEBAR-GROUP-V01 | miglioramento | `count-label` per dare contesto al numero (oggi `status "70"` dopo il titolo). | sidebar-group.component.ts:86-88 |
| SL-SIDEBAR-GROUP-V02 | miglioramento | Struttura a lista per gli item (`role="list"`/`listitem`). | sidebar-group.component.ts:90 |
| SL-SIDEBAR-GROUP-V03 | miglioramento | Non emettere `role="group"` con `aria-label=""` quando `label` è vuoto; preferire `aria-labelledby` verso lo span della label. | sidebar-group.component.ts:78-79 |
| SL-SIDEBAR-GROUP-V04 | miglioramento | In collapsed il titolo del gruppo è solo un tooltip all'hover dell'icona non focusabile; mostrarlo anche al focus degli item. Il gruppo corrente è segnalato da sfondo pieno della tile (forte differenza di luminanza), aggiungere comunque un segnale non cromatico. | sidebar-group.component.ts:82-84; sidebar-group.styles.ts:44-47 |

### Responsabilità del consumer
- Impostare sempre `label` (è il nome del `group`).

### Da verificare con AT reali
- Annuncio del nome del gruppo entrando nel gruppo con NVDA/VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-SIDEBAR-GROUP-01 | Media | confermato | 3.21:1 light / 2.18:1 dark misurati. |
| SL-SIDEBAR-GROUP-02 | Bassa | riclassificato | Il numero segue il titolo del gruppo (`group "Documenti di progetto"` › `status "70"`): contesto deducibile, qualità → V01. |
| SL-SIDEBAR-GROUP-03 | Bassa | riclassificato | Lista non richiesta da WCAG → V02. |
| SL-SIDEBAR-GROUP-04 | Bassa | riclassificato | Solo se il consumer omette `label` → consumer + V03. |
| SL-SIDEBAR-GROUP-05 | Suggerimento | riclassificato | Nessun criterio A/AA violato → V04. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` | Sì | Sì (`group "Documenti di progetto"`) | Sì |
| `count` | Sì | Testo del badge (`status "70"`) | Sì |
| `count-label` | No | — | Utile |

### Fix proposti
```css
/* sidebar-group.styles.ts */
.sidebar-group__count::part(base) {
  color: var(--sl-color-neutral-600); /* misurato in sl-tab/badge: 6.64:1 light, 5.72:1 dark */
}
```
