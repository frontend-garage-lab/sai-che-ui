## Tab Group (`sl-tab-group` – src/components/tab-group/tab-group.component.ts)
**Pattern APG di riferimento:** Tabs (automatic / manual activation)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

> Nota: l'impossibilità di chiudere da tastiera un tab `closable` (nessun tasto Delete gestito dal gruppo) è un errore verificato registrato in `sl-tab` come **SL-TAB-01** (Alta), perché il difetto nasce dal close button `tabindex="-1"` di `sl-tab`; il fix tocca entrambi i componenti.

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Chromium espone `tablist` → `tab` ×N → `tabpanel` nonostante slot + `sl-resize-observer` (`tablist [orientation="horizontal"]` / `tab "General" [selected controls=[sl-tab-panel-1]]`). |
| 2 | Nome/descrizione/stato | ✅ | Tab con nome dal testo, `selected`/`disabled` esposti; `tabpanel "General" [labelledby=[General]]`. Il tablist non ha nome (non richiesto da ARIA/WCAG): miglioramento V-01. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-controls`/`aria-labelledby` scritti sugli host light DOM (r. 324-333) e risolti da Chromium (`controls=[sl-tab-panel-1]`, `labelledby=[General]`). |
| 4 | Tastiera e focus | ⚠️ | Frecce con wrap, Home/End, salto del disabilitato, Tab esce dal tablist: verificati (`End → sl-tab-3`, `ArrowRight → sl-tab-1`, `Tab → button#b`). Manual activation: `ArrowRight` sposta il focus senza selezionare, `Space` seleziona. Mancano Delete per i closable (errore in SL-TAB-01) e il roving tabindex si rompe se si riabilita un tab (miglioramento, vedi sl-tab). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Il cambio di pannello è comunicato da `selected` sul tab focalizzato. |
| 7 | Aspetti visivi | ✅ | Indicatore `primary-600` 6.18:1 (light) / 8.02:1 (dark). Forced colors: indicatore `rgb(0,0,0)`, outline del tab focalizzato `solid`, tab attivo con outline `solid`. Scroll button misurati 28×35 px (bottone interno 32×32). |
| 8 | API pubblica a11y | ⚠️ | Nessuna property per nominare il tablist; nessun `aria-orientation` con `placement` start/end (miglioramenti). |
| 9 | Docs e test | ⚠️ | Docs citano solo Left/Right (tab-group.md:1059); esempio closable senza gestione del focus; test tastiera parziali. |

### Errori verificati
— nessun errore verificato — (vedi SL-TAB-01 in `sl-tab` per la chiusura da tastiera)

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-TAB-GROUP-V01 | miglioramento | Aggiungere `label` → `aria-label` sul `[role=tablist]`: oggi un `aria-label` sull'host resta su un generic. APG lo raccomanda, ARIA/WCAG non lo richiedono (il consumer può introdurre il gruppo con un titolo). | tab-group.component.ts:508 |
| SL-TAB-GROUP-V02 | miglioramento | Con `placement="start"/"end"` Chromium espone `tablist [orientation="horizontal"]` mentre la navigazione è con ArrowUp/ArrowDown (ArrowRight non fa nulla). La funzione è operabile; impostare `aria-orientation="vertical"`. | tab-group.component.ts:233-243, 508 |
| SL-TAB-GROUP-V03 | miglioramento | Inizializzazione differita all'IntersectionObserver: con il gruppo fuori viewport tutti i tab sono `selected=false`, `tabindex=0` e nessun pannello è nell'albero a11y (`tab "General" [selected=false]`, nessun `tabpanel`); si sistema dopo lo scroll (~>300 ms dal focus). Eseguire `setAriaLabels()`/`setActiveTab()` subito, usare l'IO solo per l'indicatore. | tab-group.component.ts:151-161 |
| SL-TAB-GROUP-V04 | miglioramento | Esempio docs closable: rimuove il tab senza spostare il focus; aggiornare con `nextTab.focus()` insieme al fix SL-TAB-01. Documentare Home/End, Up/Down, Delete. | docs/pages/components/tab-group.md:314-327, 1059 |
| SL-TAB-GROUP-V05 | miglioramento | Transizione dell'indicatore senza `prefers-reduced-motion` (2.3.3 è AAA). | tab-group.styles.ts:24-26 |
| SL-TAB-GROUP-V06 | miglioramento | Test: Home/End, wrap, verticale, RTL, `aria-controls`, axe con più tab/disabilitati. | tab-group.test.ts |

### Responsabilità del consumer
- Dare un contesto al gruppo di tab (titolo visibile prima del tablist) se la pagina contiene più tab group.
- Spostare il focus su un tab esistente quando si rimuove un tab nell'handler `sl-close`.

### Da verificare con AT reali
- Lettura in browse mode (NVDA/JAWS + Chrome, VoiceOver + Safari) di un tab group fuori viewport prima dell'inizializzazione (V03): il contenuto del pannello non è nell'albero finché il gruppo non interseca il viewport; verificare se l'AT fa scorrere la pagina leggendo.
- Esposizione tablist→tab attraverso slot + `display: contents` in Safari/Firefox (conteggio "tab 1 di N").
- Annuncio dell'orientamento (V02) con JAWS/VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-TAB-GROUP-01 | Media | riclassificato | Il nome del tablist non è richiesto da WCAG/ARIA; best practice APG → V01. |
| SL-TAB-GROUP-02 | Media | riclassificato | Chromium espone `orientation="horizontal"` con navigazione verticale, ma la funzione è operabile con Up/Down; impatto dipende dall'AT → V02. |
| SL-TAB-GROUP-03 | Media | confermato | Accorpato in SL-TAB-01 (Alta): `key:Delete` → nessun `sl-close`; close button fuori dal tab order. La parte "focus perso dopo la rimozione" riguarda solo il mouse (il close non è raggiungibile da tastiera) → V04. |
| SL-TAB-GROUP-04 | Bassa | riclassificato | Dimostrato (fuori viewport `selected=false` su tutti, nessun tabpanel), ma si corregge prima che l'utente interagisca; impatto in browse mode da verificare con AT → V03. |
| SL-TAB-GROUP-05 | Bassa | scartato | Misurato: scroll button 28×35 px, bottone interno 32×32 px (≥24). |
| SL-TAB-GROUP-06 | Bassa | riclassificato | Test/docs mancanti non sono errori → V06/V04. |
| SL-TAB-GROUP-07 | Suggerimento | riclassificato | 2.3.3 è AAA → V05. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `activation` auto/manual | Sì | Sì (manual: ArrowRight → `focused selected=false`, Space → `selected`) | Sì |
| `aria-controls`/`aria-labelledby` automatici | Sì | Sì (`controls=[sl-tab-panel-1]`, `labelledby=[General]`) | Sì |
| `label` del tablist | No | — | Utile (APG), non indispensabile |
| `aria-orientation` | No | Chromium espone `horizontal` anche con `placement="start"` | Utile |

### Fix proposti
Nessun errore verificato in questo componente. Per SL-TAB-01 (in `sl-tab`) il gruppo deve gestire Delete:
```ts
// handleKeyDown()
if (event.key === 'Delete' && tab?.closable && !tab.disabled) {
  event.preventDefault();
  tab.emit('sl-close');
  return;
}
```
