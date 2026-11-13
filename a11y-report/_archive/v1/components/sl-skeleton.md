## Skeleton (`<sl-skeleton>` – src/components/skeleton/skeleton.component.ts)
**Pattern APG di riferimento:** nessun pattern APG; elemento decorativo. Lo stato di caricamento va comunicato dal contenitore con `aria-busy="true"` e un messaggio testuale/live region (WAI-ARIA 1.2 `aria-busy`).
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 2 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Due `<div>` vuoti senza ruolo (r. 29-36): nessun nodo con contenuto esposto agli AT (di fatto ignorato). |
| 2 | Nome, descrizione, stato | ⚠️ | Nessuna informazione testuale di "caricamento"; il componente non offre `label`/testo sr-only, né `aria-hidden` esplicito. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID. |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Nessun supporto né documentazione per `aria-busy` sul contenitore o per un messaggio "Caricamento…" (consumer). |
| 7 | Aspetti visivi | ⚠️ | Colore neutral-200 su bianco 1.25:1: accettabile solo se decorativo (lo stato di caricamento va comunicato anche in altro modo). Animazioni `sheen` (8s) e `pulse` (2s) infinite senza `prefers-reduced-motion` (r. 26-34). `forced-colors` presente (r. 36-41) ma con `effect="sheen"` lo shorthand `background: linear-gradient(…)` viene rimosso in HC e il colore di sfondo resta trasparente. |
| 8 | API pubblica a11y | ⚠️ | Nessuna API: valutare `aria-hidden` automatico sull'host. |
| 9 | Documentazione e test | ⚠️ | 1 test axe (test r. 6-9) ✅; docs senza esempio `aria-busy`/testo di caricamento. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-SKELETON-01 | Media | Live region / Docs | Un'area composta solo da skeleton è "vuota" per gli SR: nessun testo, nessun `aria-busy`, nessun annuncio di caricamento/completamento; docs non indicano cosa deve fare il consumer. (consumer + docs) | src/components/skeleton/skeleton.component.ts:27-38; docs/pages/components/skeleton.md (nessuna occorrenza di `aria-busy`) | WCAG 1.3.1; 4.1.3 | Documentare: `aria-busy="true"` sul contenitore durante il caricamento + `<div role="status">Caricamento…</div>` presente prima; opzionale property `label` resa come testo sr-only (in un solo skeleton per gruppo). |
| SL-SKELETON-02 | Bassa | Aspetti visivi | Animazioni infinite `sheen`/`pulse` senza `prefers-reduced-motion`. | src/components/skeleton/skeleton.styles.ts:26-34 `animation: sheen 8s ease-in-out infinite;` / `animation: pulse 2s ease-in-out 0.5s infinite;` | WCAG 2.2.2; 2.3.3 (AAA) | `@media (prefers-reduced-motion: reduce) { .skeleton__indicator { animation: none !important; } }` |
| SL-SKELETON-03 | Bassa | Aspetti visivi | In `forced-colors` la variante `sheen` usa solo `background: linear-gradient(...)` (che il browser rimuove in alto contrasto) e lo skeleton scompare; `--color: GrayText` vale solo per gli altri effetti. | src/components/skeleton/skeleton.styles.ts:26-28, 36-41 | WCAG 1.4.11 (forced colors) | Nel blocco forced-colors: `.skeleton__indicator { background: GrayText; }` anche per `--sheen`. |
| SL-SKELETON-04 | Suggerimento | API | L'host non è esplicitamente nascosto: se un consumer slotta/aggiunge contenuto o attributi (`aria-label`, `title`) potrebbe esporre nodi vuoti. | src/components/skeleton/skeleton.component.ts:27-38 | WCAG 1.3.1 (buona pratica) | In `connectedCallback`: `if (!this.hasAttribute('aria-hidden')) this.setAttribute('aria-hidden', 'true')`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `aria-hidden` | No | — | Suggerito di default sull'host |
| `label` (testo sr-only di caricamento) | No | — | Opzionale; preferibile messaggio unico del consumer |
| `aria-busy` | N/A | — | Va sul contenitore del consumer |

### Fix proposti
```ts
connectedCallback() {
  super.connectedCallback();
  if (!this.hasAttribute('aria-hidden')) this.setAttribute('aria-hidden', 'true');
}
```
```css
@media (prefers-reduced-motion: reduce) {
  .skeleton--sheen .skeleton__indicator,
  .skeleton--pulse .skeleton__indicator { animation: none; }
}
@media (forced-colors: active) {
  .skeleton__indicator { background: GrayText; }
}
```
```html
<!-- Docs: pattern consigliato -->
<section aria-busy="true" aria-describedby="loading-msg">
  <div id="loading-msg" role="status">Caricamento dei documenti…</div>
  <sl-skeleton></sl-skeleton><sl-skeleton></sl-skeleton>
</section>
```

### Non verificabile
- Come gli SR trattano un contenitore con `aria-busy` nella pratica (VoiceOver/NVDA ignorano spesso `aria-busy`): serve test manuale.
- Resa in Windows High Contrast con colori personalizzati `--color`/`--sheen-color`.
