## Icon (`sl-icon` – src/components/icon/icon.component.ts)
**Pattern APG di riferimento:** WAI-ARIA `img` role (icona informativa) / contenuto decorativo `aria-hidden` (WAI Images Tutorial)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 2 · Suggerimento 2

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Con `label`: `role="img"` + `aria-label` sull'host (r. 139-142); senza: `aria-hidden="true"` (r. 143-147). I figli SVG sono presentazionali sotto `role="img"`. |
| 2 | Nome, descrizione, stato | ✅ | `label` = alternativa testuale; default decorativo (documentato r. 90-93). Le icone di sistema (library.system.ts) non contengono `<title>` che produrrebbe nomi spuri. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Ruolo/ARIA sull'host (sprouting, SHARED §2): `aria-label`, `role`, `aria-hidden` scritti dal consumer vengono sovrascritti/rimossi dal watcher di `label` (SL-ICON-01). |
| 4 | Tastiera e focus | N/A | Non interattivo. L'SVG non è focusabile (`focusable="false"` serve solo a IE/Edge legacy). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Varianti come grafica (≥3:1): neutral-500 4.71 / 3.48, accent-600 3.22 / 8.24, success-600 4.60 / 9.99, warning-600 4.59 / 11.25, danger-600 4.61 / 4.78 (light / dark su neutral-0). `currentColor` → forced-colors ok. La docs chiede di non affidare il significato al solo colore (icon.md:109-111) ✅. |
| 8 | API pubblica a11y | ⚠️ | `label` ✅; nessun modo per avere un'icona informativa con nome da `aria-labelledby` o descrizione; nessun fallback visibile in caso di errore di caricamento (SL-ICON-03). |
| 9 | Documentazione e test | ✅ | Sezione "Labels" (icon.md:196-201); test axe e test sugli attributi `aria-*` con/senza label (test r. 76-98). Manca il test della transizione label → vuoto. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-ICON-01 | Media | 3/8 ARIA sull'host | Il watcher di `label` gira anche al primo render e, senza `label`, forza `aria-hidden="true"` e rimuove `role`/`aria-label`: un consumer che scrive `<sl-icon aria-label="Errore">` (pattern standard) ottiene un'icona **nascosta** agli AT; con `label` presente un `aria-hidden="true"` voluto dal consumer viene rimosso. | src/components/icon/icon.component.ts:135-148 | WCAG 1.1.1, 4.1.2 | Usare `this.label \|\| this.getAttribute('aria-label')` come nome; non toccare `aria-hidden` se impostato dal consumer; preferire ElementInternals (`internals.role`, `internals.ariaLabel`, `internals.ariaHidden`) per non sovrascrivere attributi dell'autore (SHARED §10). |
| SL-ICON-02 | Bassa | 3 Sprouting | Ruolo e ARIA impostati con `setAttribute` sull'host: attributi visibili/modificabili nel light DOM e in conflitto con framework che riconciliano gli attributi (Angular/React possono rimuoverli al re-render). | icon.component.ts:140-146 | WCAG 4.1.2 (robustezza) | ElementInternals come da SHARED §10. |
| SL-ICON-03 | Bassa | 2/7 Errore di caricamento | Se l'SVG non si carica (`sl-error`) l'host resta `role="img"` con `aria-label` ma non viene disegnato nulla: l'informazione esiste per l'AT ma sparisce per gli utenti vedenti. | icon.component.ts:200-205 `this.svg = null; this.emit('sl-error')` | WCAG 1.1.1, 1.3.3 | Rendere un fallback visibile (es. testo `label` troncato o icona di sistema generica) quando `label` è valorizzato e il caricamento fallisce. |
| SL-ICON-04 | Suggerimento | 9 Docs | L'esempio "Labels" usa `label="Add to favorites"` (un'azione) su un'icona non interattiva; manca la guida su: icona decorativa vs informativa vs dentro un bottone (preferire il nome sul bottone/`sl-icon-button label`). | docs/pages/components/icon.md:196-201 | WAI Images Tutorial | Sostituire con un'etichetta descrittiva ("Preferito") e aggiungere la tabella decorativa / informativa / funzionale. |
| SL-ICON-05 | Suggerimento | 9 Test | Nessun test che verifichi il ritorno a `aria-hidden="true"` quando `label` viene svuotato né il caso `aria-label` impostato dal consumer. | src/components/icon/icon.test.ts:81-98 | — (qualità) | Aggiungere i due casi. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | Sì | Sì | → `role="img"` + `aria-label` sull'host. |
| `aria-label` (consumer) | No | No | Sovrascritto/nascosto (SL-ICON-01). |
| `aria-hidden` (consumer) | No | No | Rimosso se c'è `label`. |
| `role` | No | — | Fisso `img` (corretto); nessuna necessità di override. |
| `aria-describedby` | No | — | Non necessario. |

### Fix proposti
```ts
// icon.component.ts
private internals = this.attachInternals();

@watch('label')
handleLabelChange() {
  const name = this.label || this.getAttribute('aria-label') || '';
  if (name) {
    this.internals.role = 'img';
    this.internals.ariaLabel = name;
    this.internals.ariaHidden = null;
  } else {
    this.internals.role = null;
    this.internals.ariaLabel = null;
    // non forzare se l'autore ha già deciso
    if (!this.hasAttribute('aria-hidden')) this.internals.ariaHidden = 'true';
  }
}

render() {
  if (!this.svg && this.label && this.hasError) {
    return html`<span part="fallback" class="icon__fallback" aria-hidden="true">?</span>`;
  }
  return this.svg;
}
```

### Non verificabile
- Annuncio con screen reader delle icone `role="img"` all'interno di bottoni (`sl-button circle`) e di testo inline.
- Icone da librerie custom registrate dal consumer (possono contenere `<title>`, `role` o colori fissi che non rispettano forced-colors).
