## Relative Time (`<sl-relative-time>` – src/components/relative-time/relative-time.component.ts)
**Pattern APG di riferimento:** N/A (formatter); HTML `<time datetime>`; WCAG 4.1.3 (per gli aggiornamenti), 3.1.2
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 0 · Suggerimento 2 (+ trasversale SL-FORMAT-BYTES-01, non conteggiato)

Semantica corretta: `<time datetime=${isoTime}>` con frase relativa localizzata (r. 102). Con `sync`, l'aggiornamento periodico (r. 82-100) non usa live region, quindi non viene annunciato: è la scelta giusta, perché annunci ogni minuto sarebbero invasivi. Lit aggiorna il nodo di testo solo quando la stringa cambia, anche se il re-render avviene ogni secondo per l'unità `minute` (r. 87-88). Manca però l'accesso alla data assoluta.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<time datetime>` nativo (r. 102). |
| 2 | Nome, descrizione, stato | ⚠️ | Viene esposta solo la frase relativa ("3 ore fa"). Il valore `datetime` non è letto dalla maggior parte delle AT e non c'è un `title` o un'altra via per conoscere la data esatta (SL-RELATIVE-TIME-01). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Testo nello shadow root, entra nel nome dei contenitori. |
| 4 | Tastiera e focus | N/A | Non focusabile. Un eventuale `title` non sarebbe raggiungibile da tastiera (vedi fix). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ✅ | Nessuna live region: gli aggiornamenti di `sync` sono silenziosi, come deve essere. Se però il consumer avvolge il componente in una regione `aria-live`, riceve un annuncio a ogni cambio di minuto (SL-RELATIVE-TIME-02, docs). |
| 7 | Aspetti visivi | N/A | Nessuno stile proprio. Nessuna animazione. |
| 8 | API pubblica a11y | ⚠️ | Nessuna opzione per esporre la data assoluta. `lang` non riflesso quando impostato come property (SL-FORMAT-BYTES-01). |
| 9 | Documentazione e test | ✅ | Test axe presente (test r. 74-77) e test sui formati. Docs con esempio `sync` (md r. 29) ma senza note a11y. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-RELATIVE-TIME-01 | Suggerimento | 2 / 8 | La data e l'ora esatte sono disponibili solo nel `datetime` (machine-readable, in genere non letto dalle AT) e non c'è `title`: nessun utente, vedente o con AT, può risalire all'istante preciso, a volte essenziale (es. scadenze, log). | src/components/relative-time/relative-time.component.ts:102 `<time datetime=${this.isoTime}>${this.relativeTime}</time>` | Buona pratica (WCAG 1.3.1 / 3.3.5 AAA) | Aggiungere la property `show-absolute` / `absolute-label`, che rende la data assoluta localizzata come testo visivamente nascosto o visibile tra parentesi. Evitare di affidarsi al solo `title`, che non è accessibile da tastiera né su touch. |
| SL-RELATIVE-TIME-02 | Suggerimento | 6 / 9 | Le docs di `sync` non avvisano di non inserire il componente in una regione `aria-live`/`role="status"`, perché genererebbe annunci periodici invasivi (consumer). | docs/pages/components/relative-time.md:29 (sezione "Keeping Time in Sync"); component r. 99 `window.setTimeout(() => this.requestUpdate(), nextInterval)` | WCAG 2.2.2 / 4.1.3 (buona pratica) | Aggiungere una nota a11y nelle docs. |
| (rif.) SL-FORMAT-BYTES-01 | Bassa | 8 | `lang`/`dir` non riflessi quando impostati come property. | src/internal/shoelace-element.ts:67-68 | WCAG 3.1.2 | `reflect: true` (vedi sl-format-bytes.md). |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `datetime` (su `<time>`) | Sì | Sì | Corretto. |
| `show-absolute` (o simile) | No | — | Da valutare per esporre la data esatta. |
| `lang` / `dir` | Sì (ereditate) | Parziale | Vedi SL-FORMAT-BYTES-01. |

### Fix proposti
```ts
/** Mostra (o espone alle AT) anche la data assoluta localizzata. */
@property({ attribute: 'show-absolute', type: Boolean }) showAbsolute = false;

// in render()
const absolute = this.localize.date(then, { dateStyle: 'medium', timeStyle: 'short' });
return html`
  <time datetime=${this.isoTime}>
    ${this.relativeTime}${this.showAbsolute ? html`<sl-visually-hidden> (${absolute})</sl-visually-hidden>` : ''}
  </time>
`;
```
(Per una resa visibile, usare uno span tra parentesi al posto di `sl-visually-hidden`.)

### Non verificabile
- Comportamento degli screen reader quando il testo cambia sotto il cursore virtuale con `sync` attivo (atteso: nessun annuncio).
- Lettura del contenuto `<time>` (alcuni lettori potrebbero esporre il `datetime`).
