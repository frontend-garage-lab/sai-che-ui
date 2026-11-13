## Sidebar (`sl-sidebar` – src/components/sidebar/sidebar.component.ts)
**Pattern APG di riferimento:** Landmark Regions (navigation) + pulsante di collasso
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `complementary` › `navigation "Sidebar"` › `group "Documenti di progetto"` › `link …`. Il `<aside>` senza nome aggiunge un landmark complementary attorno al nav (non è un errore, miglioramento). |
| 2 | Nome/descrizione/stato | ⚠️ | Nav con nome da `label` (default `'Sidebar'`, sovrascrivibile). Toggle `button "Collapse sidebar"` → dopo Enter `button "Expand sidebar"`: lo stato è comunicato dal cambio di nome (accettabile), ma la stringa è inglese hardcoded e non sovrascrivibile (SL-SIDEBAR-01). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nome del landmark via `label` sul `<nav>` interno. |
| 4 | Tastiera e focus | ✅ | Tab: item → toggle; `key:Enter` sul toggle → evento `sl-collapse`, focus resta sul toggle (`sl-icon-button[part=toggle] > button`). In collapsed gli item senza icona sono `display:none` (fuori dal tab order). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Toggle 36×36 px, icona 6.64:1 (light) / 5.72:1 (dark); forced colors: focus `outlineStyle = solid` sugli item. |
| 8 | API pubblica a11y | ⚠️ | `label` presente; nessuna property per le label del toggle. |
| 9 | Docs e test | ⚠️ | Il test codifica la label inglese; nessun test axe in collapsed. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-SIDEBAR-01 | Media | Lingua / nome | La label del toggle è una stringa inglese hardcoded, non passa da `LocalizeController` e non è sovrascrivibile: in un'app italiana (esempio docs con gruppi in italiano) il pulsante si chiama "Collapse sidebar"/"Expand sidebar" senza `lang`, letto con la voce italiana. | sidebar.component.ts:88 (`label=${this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}`) | runtime (`--lang it`): `button "Collapse sidebar"` → `key:Enter` → `button "Expand sidebar"`; nessuna chiave in `src/translations` | WCAG 3.1.2 (AA) | Chiavi `expandSidebar`/`collapseSidebar` nelle traduzioni + property `expand-label`/`collapse-label`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-SIDEBAR-V01 | miglioramento | Default della `label` del nav localizzato (oggi `'Sidebar'` inglese, ma sovrascrivibile → responsabilità del consumer). | sidebar.component.ts:49 |
| SL-SIDEBAR-V02 | miglioramento | Il contenitore `<aside>` senza nome espone un `complementary` anonimo attorno al `navigation`: usare un `<div>` o dare un nome. | sidebar.component.ts:70 |
| SL-SIDEBAR-V03 | miglioramento | Toggle: label costante + `aria-expanded`/`aria-controls` (oggi lo stato è nel cambio di nome, che è valido). | sidebar.component.ts:84-90 |
| SL-SIDEBAR-V04 | miglioramento | Test axe in `collapsed`; test non vincolati alla stringa inglese. | sidebar.test.ts |

### Responsabilità del consumer
- Impostare `label` in lingua della pagina (es. `label="Navigazione documenti"`): funziona sul `<nav>`.
- Dare un'icona `prefix` agli item che devono restare raggiungibili in collapsed (gli altri spariscono).

### Da verificare con AT reali
- Riannuncio del nome cambiato del toggle focalizzato dopo l'attivazione (NVDA/JAWS/VoiceOver).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-SIDEBAR-01 | Media | confermato | Toggle inglese hardcoded e non sovrascrivibile (`button "Collapse sidebar"`); la parte sul nome del nav è consumer (`label` funziona). |
| SL-SIDEBAR-02 | Bassa | riclassificato | Landmark annidati validi; complementary anonimo è qualità → V02. |
| SL-SIDEBAR-03 | Bassa | riclassificato | Lo stato è comunicato dal cambio di nome (`Collapse` → `Expand`), soluzione valida → V03. |
| SL-SIDEBAR-04 | Bassa | riclassificato | Test → V04. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` | Sì | Sì (`navigation "Sidebar"`) | Sì |
| `collapsed` | Sì | Sì (item/gruppi aggiornati, nomi da `title`) | Sì |
| `expand-label`/`collapse-label` | No | — | Sì (fix 01) |

### Fix proposti
```ts
// sidebar.component.ts
private readonly localize = new LocalizeController(this);
@property({ attribute: 'expand-label' }) expandLabel = '';
@property({ attribute: 'collapse-label' }) collapseLabel = '';

// render()
<sl-icon-button
  part="toggle"
  name=${this.collapsed ? 'chevron-double-right' : 'chevron-double-left'}
  library="system"
  label=${this.collapsed
    ? this.expandLabel || this.localize.term('expandSidebar')
    : this.collapseLabel || this.localize.term('collapseSidebar')}
  @click=${this.handleToggle}
></sl-icon-button>
```
```ts
// src/translations/en.ts / it.ts
expandSidebar: 'Expand sidebar',   // it: 'Espandi barra laterale'
collapseSidebar: 'Collapse sidebar' // it: 'Comprimi barra laterale'
```
