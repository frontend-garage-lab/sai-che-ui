## Detail Panel (`<sl-detail-panel>` – src/components/detail-panel/detail-panel.component.ts)
**Pattern APG di riferimento:** nessun pattern dedicato (pannello non modale). Landmark Regions per la struttura; APG Button per il close.
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ❌ | Fuori da `main`/`aside`/`section` l'`<header>` interno è esposto come `banner` (SL-DETAIL-PANEL-02). Dentro `<main>` diventa `sectionheader` (corretto). Titolo `heading … [level=2]`. |
| 2 | Nome/descrizione/stato | ✅ | Close: `button "Close"` (localizzato, r. 93). Titolo dal slot `label`. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID tra root. |
| 4 | Tastiera e focus | ⚠️ | Tab: `#next` → close → `div[part=body]` (Chromium rende focusabile il body scrollabile). Con il pattern docs `sl-request-close` → `panel.remove()`, dopo Enter il focus va su `body`, ma il Tab successivo va su `button#after` (l'ordine resta). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Titolo 15.50 / 12.71:1. Meta **2.96:1** in dark (SL-DETAIL-PANEL-03), 4.71:1 in light. Icona close 6.64 / 4.86:1, target 32×32 px. `forcedcolors`: outline del close `solid`. |
| 8 | API pubblica a11y | ✅ | `sl-request-close` cancellabile permette al consumer di gestire focus e chiusura. |
| 9 | Docs e test | ⚠️ | Nessun test di focus. Il test di chiusura verifica solo `el.hidden` (test r. 79), non la scomparsa effettiva (vedi bug V01). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-DETAIL-PANEL-03 | Media | Aspetti visivi | Il testo meta (es. "Revision 4 · Expiring in 12 days", informativo) in tema dark ha un contrasto di 2.96:1 a 14 px. | src/components/detail-panel/detail-panel.styles.ts:59 `color: var(--sl-color-neutral-500);` | runtime dark: `contrast:sl-detail-panel >>> .detail-panel__meta` → `#636e74 su #1f2528 = 2.96:1` (light 4.71:1) | WCAG 1.4.3 Contrast (Minimum) (AA) | `color: var(--sl-color-neutral-600)` (in dark #869298 su #1f2528 = 4.86:1, misurato sull'icona close). |
| SL-DETAIL-PANEL-02 | Bassa | Semantica | L'`<header>` nello shadow root, se il pannello non sta dentro `main`/`aside`/`article`/`section` (es. colonna laterale accanto a `<main>`), viene esposto come landmark `banner`: il header del pannello sembra il banner del sito e si aggiunge a quello della pagina. | src/components/detail-panel/detail-panel.component.ts:74 `<header part="header" class="detail-panel__header">` | runtime (pannello fuori da `main`): `banner` › `heading "Statement of Work.pdf" [level=2]`, `button "Close"`; dentro `<main>`: `sectionheader` | WCAG 1.3.1 Info and Relationships (A) | Sostituire `<header>` con `<div>` (o dare al base `role="region"`/`<section>` con `aria-labelledby` verso il titolo, che fa diventare l'header `sectionheader`). |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-DETAIL-PANEL-V01 | miglioramento | **Bug funzionale (non a11y), priorità alta:** senza listener `sl-request-close`, il close imposta `hidden` ma il pannello resta visibile ed esposto. `:host { display: flex }` batte la regola UA `[hidden]`. Prova: click sul close → `[height 160, hidden true, height 160, "flex"]`, albero a11y invariato. Le docs (r. 141) dicono "The panel hides itself". Fix: `:host([hidden]) { display: none; }`. | detail-panel.styles.ts:4-8; detail-panel.component.ts:68 |
| SL-DETAIL-PANEL-01 | miglioramento | Dopo la chiusura il focus va su `body`. L'ordine di Tab resta (→ elemento successivo), ma riportare il focus al trigger (o documentarlo nel listener `sl-request-close`) è preferibile. | detail-panel.component.ts:58-69 |
| SL-DETAIL-PANEL-04 | miglioramento | `h2` fisso: property `heading-level`. Il salto di livello non è una violazione A/AA. | detail-panel.component.ts:76-78 |
| SL-DETAIL-PANEL-05 | miglioramento | `close-label` contestuale ("Chiudi dettagli"). Il default localizzato è già un nome valido. | detail-panel.component.ts:93 |
| SL-DETAIL-PANEL-06 | miglioramento | Body scrollabile senza `tabindex`: in Chromium è già focusabile (`focus: div[part=body]`). Valutare `tabindex="0"` + nome per altri browser. | detail-panel.styles.ts:78-82 |
| SL-DETAIL-PANEL-07 | miglioramento | Docs/test: sezione Accessibilità, test sul focus e sulla scomparsa effettiva. | detail-panel.test.ts:62-91 |

### Responsabilità del consumer
- Nel listener `sl-request-close` (pattern docs `panel.remove()`), spostare il focus sull'elemento che aveva aperto il pannello.

### Da verificare con AT reali
- NVDA/JAWS (browse mode) e VoiceOver: posizione del cursore virtuale quando il focus finisce su `body` dopo la chiusura.
- Safari: il body scrollabile non è focusabile da tastiera (in Chromium lo è); verificare la lettura e lo scroll da tastiera del contenuto lungo.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-DETAIL-PANEL-01 | Alta | riclassificato | Falso che si debba "ripartire dall'inizio": dopo la chiusura Tab va all'elemento successivo. Il ritorno al trigger non è richiesto per un pannello non modale. |
| SL-DETAIL-PANEL-02 | Media | ridimensionato | Il landmark mancante non è un errore, ma il `banner` spurio fuori da `main` è dimostrato → Bassa. |
| SL-DETAIL-PANEL-03 | Media | confermato | Misurato 2.96:1 in dark. |
| SL-DETAIL-PANEL-04 | Media | riclassificato | Il livello fisso non è una violazione; l'`h2` vuoto non è esposto. |
| SL-DETAIL-PANEL-05 | Bassa | riclassificato | Il nome esiste ed è localizzato. |
| SL-DETAIL-PANEL-06 | Bassa | riclassificato | In Chromium il body scrollabile è focusabile; altri browser da verificare. |
| SL-DETAIL-PANEL-07 | Suggerimento | riclassificato | Docs/test. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| slot `label` → `h2` | Sì | Sì: `heading "SOW.pdf" [level=2]` | Sì |
| `sl-request-close` (cancellabile) | Sì | Sì (il listener riceve l'evento) | Sì |
| `close-label` / `heading-level` | No | — | Utili |

### Fix proposti
```ts
// detail-panel.component.ts:74 / :97
<div part="header" class="detail-panel__header"> … </div>
```
```css
/* detail-panel.styles.ts */
.detail-panel__meta { color: var(--sl-color-neutral-600); }
:host([hidden]) { display: none; } /* bug funzionale V01 */
```
