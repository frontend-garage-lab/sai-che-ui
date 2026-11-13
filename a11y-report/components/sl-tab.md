## Tab (`sl-tab` – src/components/tab/tab.component.ts)
**Pattern APG di riferimento:** Tabs (elemento `tab`)
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 1 · Media 0 · Bassa 1
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `role="tab"` sull'host (r. 63): `tab "General" [selected controls=[sl-tab-panel-1]]`. Chromium espone il close come `button "Close"` figlio del tab. |
| 2 | Nome/descrizione/stato | ✅ | Nome dal testo slottato; `aria-selected`/`aria-disabled` (r. 73, 78) esposti (`[disabled selected=false]`). Con `closable` il nome diventa `tab "Closable 1 Close"` (miglioramento). Badge contatore escluso dal nome (`tab "Review"` + `status "11"`): da verificare con AT. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo, ID (r. 89) e `aria-*` sull'host light DOM; `aria-controls` risolto. |
| 4 | Tastiera e focus | ❌ | Tab `closable` non chiudibile da tastiera (SL-TAB-01). Riabilitare un tab crea un secondo tab stop (miglioramento V02). Focus ring `outline` su `:host(:focus-visible)` visibile anche in forced colors (`outlineStyle = solid`). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | (il `sl-badge` interno ha `role="status"`: è del badge) |
| 7 | Aspetti visivi | ⚠️ | Contrasti OK: inattivo 6.64:1 / 5.72:1 (dark), attivo 6.18:1 / 8.02:1, card attiva 5.86:1 / 4.98:1, badge contatore 6.64:1 / 5.72:1 (neutral) e 6.18:1 / 8.02:1 (primary). Close button 18×18 px (SL-TAB-04). |
| 8 | API pubblica a11y | ⚠️ | Nessun `close-label`; label "Close" localizzata ma generica (miglioramento). |
| 9 | Docs e test | ⚠️ | Nessun test tastiera per la chiusura; docs non dicono come chiudere da tastiera. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-TAB-01 | Alta | Tastiera | Tab `closable` (esempio docs "Closable Tabs"): il close button è fuori dal tab order e né `sl-tab` né `sl-tab-group` gestiscono Delete → la chiusura è impossibile da tastiera. | tab.component.ts:101-110 (`<sl-icon-button … tabindex="-1">`); tab-group.component.ts:203-268 (nessun ramo `Delete`) | runtime: `key:ArrowRight → focus sl-tab#sl-tab-2 ;; tab → focus button#b` (il close non riceve focus) `;; key:Delete ;; key:Backspace ;; events → (nessuno)` | WCAG 2.1.1 (A); APG Tabs (Delete) | Gestire Delete nel gruppo (emette `sl-close`), documentarlo, `aria-keyshortcuts="Delete"` sul tab closable; nell'esempio docs spostare il focus sul tab adiacente. |
| SL-TAB-04 | Bassa | Target size | Close button 18×18 px annidato nel tab (68×34): il cerchio di 24 px interseca il target del tab, quindi l'eccezione di spaziatura non si applica e non c'è un controllo equivalente. | tab.styles.ts:76-83 (`font-size: var(--sl-font-size-small)`; `padding: var(--sl-spacing-3x-small)`) | runtime: `size:sl-tab[panel=closable-1] >>> sl-icon-button >>> button: 18.0x18.0 px` | WCAG 2.5.8 (AA) | `.tab__close-button::part(base) { min-width: 1.5rem; min-height: 1.5rem; }` |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-TAB-V01 | miglioramento | `close-label` per una label specifica ("Chiudi Closable 1"); oggi il nome del tab include "Close" (`tab "Closable 1 Close"`). Con il fix SL-TAB-01 valutare `aria-hidden` sul close + `aria-keyshortcuts`. | tab.component.ts:106 |
| SL-TAB-V02 | miglioramento | `handleDisabledChange` imposta `tabIndex = 0` riabilitando un tab: `["general:0:0","custom:-1:-1","disabled:0:0"]` → Tab da `sl-tab-1` va a `sl-tab-3` (secondo tab stop). Ordine ancora logico e funzione operabile, ma devia dal roving tabindex APG. | tab.component.ts:80-84 |
| SL-TAB-V03 | miglioramento | Variante `card` con `<sl-badge pill>`: il contatore non entra nel nome del tab (`tab "Review"`, figlio `status "11"`); suggerire nei docs testo nascosto o `aria-label` sull'host (funziona: l'host ha ruolo `tab`). | docs/pages/components/tab-group.md:929-941 |
| SL-TAB-V04 | miglioramento | Test axe con `closable`/`card`/`disabled` in un tab group, test tastiera di chiusura. | tab.test.ts |

### Responsabilità del consumer
- Tab con sola icona: fornire `aria-label` sull'host (`sl-tab` ha `role="tab"` sull'host, quindi funziona) o `sl-icon label`.
- Badge contatore: se il numero è informativo, includerlo nel nome (es. testo visivamente nascosto).

### Da verificare con AT reali
- Close button dentro `role="tab"` (ARIA: children presentational): Chromium lo espone come `button "Close"`; verificare in Firefox/Safari e con NVDA/VoiceOver come viene letto il tab.
- Annuncio del contatore (`sl-badge` con `role="status"`) quando il tab riceve il focus, con NVDA/JAWS/VoiceOver.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-TAB-01 | Alta | confermato | Dimostrato: close non focusabile, Delete/Backspace non emettono `sl-close`. |
| SL-TAB-02 | Media | riclassificato | Chromium espone `button "Close"` dentro il tab (nessuna perdita di semantica in Chromium); label generica = qualità → V01 + verifica AT. |
| SL-TAB-03 | Media | riclassificato | Dimostrato il secondo tab stop, ma l'ordine resta logico e il tablist è operabile → V02. |
| SL-TAB-04 | Bassa | confermato | `size` 18×18 px, annidato nel target del tab: nessuna eccezione 2.5.8 applicabile. |
| SL-TAB-05 | Bassa | riclassificato | Test/docs → V04; badge senza contesto → consumer/V03. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `active` → `aria-selected` | Sì | Sì (`[selected]`) | Sì |
| `disabled` → `aria-disabled` | Sì | Sì (`[disabled selected=false]`) | Sì |
| `aria-label` sull'host | Consumer | Sì (host con ruolo `tab`) | Per tab icon-only |
| `close-label` | No | — | Utile (V01) |

### Fix proposti
```ts
// tab-group.component.ts, handleKeyDown(): chiusura da tastiera
if (event.key === 'Delete' && tab?.closable && !tab.disabled) {
  event.preventDefault();
  tab.emit('sl-close');
  return;
}

// tab.component.ts
@watch('closable')
handleClosableChange() {
  if (this.closable) this.setAttribute('aria-keyshortcuts', 'Delete');
  else this.removeAttribute('aria-keyshortcuts');
}
```
```css
/* tab.styles.ts */
.tab__close-button::part(base) {
  padding: var(--sl-spacing-3x-small);
  min-width: 1.5rem;
  min-height: 1.5rem;
}
```
Docs (esempio closable): dopo `tab.remove()` chiamare `.focus()` sul tab mostrato.
