## Divider (`<sl-divider>` – src/components/divider/divider.component.ts)
**Pattern APG di riferimento:** WAI-ARIA 1.2 role `separator` (non focusabile, statico); HTML `<hr>`
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 2 · Suggerimento 1

Il componente è un separatore statico corretto per l'uso semantico (es. tra gruppi di `sl-menu-item`). Manca però il modo di renderlo decorativo: il consumer non può sovrascrivere il ruolo.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="separator"` sull'host (r. 26) e `aria-orientation` aggiornato da `@watch('vertical')` (r. 29-32, eseguito anche al primo update: `waitUntilFirstUpdate` è false di default). Separatore non focusabile: non servono `aria-valuenow`. Il ruolo è sempre imposto, anche negli usi puramente decorativi (SL-DIVIDER-01). `aria-orientation="horizontal"` coincide col valore implicito: ridondante ma innocuo. |
| 2 | Nome, descrizione, stato | N/A | Un separatore statico non richiede nome. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessuno shadow content (nessun `render()`): la semantica è sull'host, che resta figlio diretto di `sl-menu` o di altri contenitori, quindi il ruolo separator vale anche dentro `role="menu"`. `role` del consumer sovrascritto in `connectedCallback` (vedi §2 dello shared context). |
| 4 | Tastiera e focus | N/A | Non interattivo, nessun `tabindex`. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Bordo `--sl-panel-border-color` → `--sl-border-subtle` (neutral-200): 1.25:1 light / 1.35:1 dark (SL-DIVIDER-02). In `forced-colors` il `border` viene ridipinto col colore di sistema e resta visibile ✅. Nessuna animazione. |
| 8 | API pubblica a11y | ⚠️ | Solo `vertical`. Nessuna opzione `decorative` e nessun rispetto di un `role` passato dal consumer. |
| 9 | Documentazione e test | ⚠️ | Test axe sul solo stato orizzontale di default (test r. 7-10); `aria-orientation` verificato (r. 16-17, 28). Le docs non spiegano quando il divider è semantico e quando decorativo (SL-DIVIDER-03). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-DIVIDER-01 | Bassa | 1 / 8 | `role="separator"` è imposto sempre e sovrascrive qualunque `role` del consumer. Negli usi decorativi (es. il divider verticale tra testi inline "First / Middle / Last" delle docs) gli screen reader annunciano "separatore" a vuoto, e non c'è modo di passare `role="none"`. | src/components/divider/divider.component.ts:26 `this.setAttribute('role', 'separator');` | WCAG 1.3.1; WAI-ARIA 1.2 `separator` / `none` | Aggiungere la property `decorative` (→ `role="none"`, niente `aria-orientation`), oppure impostare il ruolo solo se il consumer non ne ha già scritto uno. |
| SL-DIVIDER-02 | Bassa | 7 | Colore di default neutral-200 (1.25:1 light, 1.35:1 dark): sotto 3:1. È un problema solo se il separatore è l'unico indicatore visivo del raggruppamento (es. gruppi di menu senza spaziatura o intestazioni). | src/components/divider/divider.styles.ts:5 `--color: var(--sl-panel-border-color);` (→ `--sl-border-subtle`, themes/light.css:555) | WCAG 1.4.11 (solo se la grafica è necessaria a capire il contenuto) | Documentare l'uso di `--color: var(--sl-color-neutral-400)` (3.21:1 light) quando il divider porta significato, o affiancarlo sempre a spaziatura o intestazioni di gruppo. |
| SL-DIVIDER-03 | Suggerimento | 9 | Le docs non dicono che il componente espone `role="separator"` né spiegano quando usarlo come decorativo. Non c'è un test axe per `vertical`. | docs/pages/components/divider.md:138-150; src/components/divider/divider.test.ts:7-10 | Buona pratica | Aggiungere una sezione "Accessibility" e un test `vertical` + `to.be.accessible()`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `role` | Sì (fisso `separator`) | Sull'host | Rispettare il `role` del consumer o aggiungere `decorative`. |
| `aria-orientation` | Sì (derivato da `vertical`) | Sull'host | Corretto; potrebbe essere omesso quando è orizzontale (implicito). |
| `decorative` | No | — | Da aggiungere (→ `role="none"`). |

### Fix proposti
```ts
/** Marca il divider come puramente decorativo (nessuna semantica esposta alle AT). */
@property({ type: Boolean, reflect: true }) decorative = false;

connectedCallback() {
  super.connectedCallback();
  this.updateSemantics();
}

@watch(['vertical', 'decorative'])
updateSemantics() {
  if (this.decorative) {
    this.setAttribute('role', 'none');
    this.removeAttribute('aria-orientation');
    return;
  }
  this.setAttribute('role', 'separator');
  this.setAttribute('aria-orientation', this.vertical ? 'vertical' : 'horizontal');
}
```

### Non verificabile
- Resa reale con gli screen reader (NVDA/JAWS/VoiceOver) del separatore dentro `sl-menu`: alcuni lettori lo saltano, altri lo annunciano. Serve una prova manuale.
- Contrasto con il `--color` personalizzato dal consumer.
