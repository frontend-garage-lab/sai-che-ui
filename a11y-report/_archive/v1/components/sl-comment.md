## Comment (`<sl-comment>` – src/components/comment/comment.component.ts)
**Pattern APG di riferimento:** nessun pattern APG; struttura WCAG 1.3.1 (per thread: `role="article"`/lista, `<time datetime>`); per feed dinamici APG Feed pattern (non applicabile al singolo componente).
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Solo `div`/`span` (r. 56-80): nessun raggruppamento (`article`), autore e data non marcati (`<time>` assente). |
| 2 | Nome, descrizione, stato | ⚠️ | Attachment: nome fornito dal consumer via `sl-icon-button label` (docs) ✅. Avatar slottato: nei docs e nei test senza `label` (docs r. 11-12; test r. 8-10) → `role="img"` senza nome (cfr. SL-AVATAR-02) e, se etichettato, duplica il nome dell'autore. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID; l'host non ha ruolo imposto, il consumer può aggiungere `role="article"` + `aria-labelledby` sul light DOM. Ordine DOM = ordine visivo (avatar, autore, data, testo, allegato). |
| 4 | Tastiera e focus | ✅ | Unico elemento interattivo è lo slot `attachment` (bottone nativo del consumer), nell'ordine naturale. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Nuovi commenti in un thread vanno annunciati dal consumer. |
| 7 | Aspetti visivi | ⚠️ | Autore `--sl-input-label-color` 12.51/10.19 ✅; data e testo `--sl-input-help-text-color` su `--sl-surface-panel` 6.63 (light) / 4.83 (dark) ✅ ma con font `x-small` (0.75rem = 12px) per il **testo principale** del commento (r. 52-55). Separatore "· " generato con `::before { content }` (r. 48-50): letto da alcuni SR come "punto centrale". Nessuna animazione. |
| 8 | API pubblica a11y | ⚠️ | `author`, `date` ✅; manca `datetime` (valore macchina) per `<time>`. |
| 9 | Documentazione e test | ⚠️ | 1 test axe (test r. 6-14) ✅ ma con avatar senza `label`; docs senza note a11y (avatar decorativo, struttura del thread). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-COMMENT-01 | Media | Semantica | Il commento non ha struttura: nessun contenitore `article`, autore e data in `<span>` generici, data senza `<time datetime>`. In un thread gli SR non possono passare da un commento all'altro né riconoscere autore/data. | src/components/comment/comment.component.ts:56-71 (`<div part="base" class="comment">`, `<span part="author">`, `<span part="date">`) | WCAG 1.3.1 Info and Relationships | `<article part="base" aria-labelledby="author">` nel shadow root (riferimento nello stesso root) o `role="article"` sull'host; data in `<time datetime=${this.datetime}>`; docs: thread come `<ul>/<li>` o `role="list"`. |
| SL-COMMENT-02 | Bassa | Nome | Avatar slottato senza `label` nei docs e nel test: espone un `role="img"` senza nome; con `label` duplicherebbe il nome dell'autore. Va reso decorativo. (docs + SL-AVATAR-02) | docs/pages/components/comment.md:11-12 `<sl-avatar slot="avatar" shape="circle" initials="AC"></sl-avatar>`; src/components/comment/comment.test.ts:8-10 | WCAG 1.1.1 | Docs: `<sl-avatar slot="avatar" decorative …>` (dopo fix SL-AVATAR-02); oppure il commento imposta `aria-hidden` sul wrapper `part="avatar"` quando c'è un autore. |
| SL-COMMENT-03 | Bassa | Aspetti visivi | Separatore "· " inserito con `::before { content }`: contenuto testuale generato da CSS, pronunciato in modo incoerente dagli SR. | src/components/comment/comment.styles.ts:48-50 | WCAG 1.3.1 (contenuto via CSS) | `content: '·' / ''` (alt-text vuoto CSS) oppure `<span aria-hidden="true">·</span>` nel template. |
| SL-COMMENT-04 | Bassa | Aspetti visivi | Testo principale del commento a `--sl-font-size-x-small` (12px) in colore secondario: leggibilità ridotta (contrasto 4.83:1 in dark, vicino alla soglia). | src/components/comment/comment.styles.ts:52-55 | WCAG 1.4.3 (al limite, dark); leggibilità | `font-size: var(--sl-font-size-small)` e `color: var(--sl-color-neutral-700)` per il corpo. |
| SL-COMMENT-05 | Suggerimento | Docs / API | Data di esempio in formato fisso inglese ("02-Oct-2026") e nessuna property `datetime`; docs senza sezione a11y. | docs/pages/components/comment.md:10; comment.component.ts:48-49 | WCAG 3.1.2 / 1.3.1 | Property `datetime` (ISO) e date formattate con `Intl.DateTimeFormat` dal consumer; sezione Accessibilità. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `author` / slot `author` | Sì | Sì | Testo visibile |
| `date` / slot `date` | Sì | Parziale | Nessun `<time datetime>` |
| `datetime` | No | — | Da aggiungere |
| `role` / `aria-labelledby` sull'host | Sì (nativi) | Sì | Utilizzabili dal consumer (host senza ruolo) |

### Fix proposti
```ts
@property() datetime = '';

render() {
  return html`
    <article part="base" class="comment" aria-labelledby="author">
      <span part="avatar" class="comment__avatar" aria-hidden=${this.author ? 'true' : nothing}>
        <slot name="avatar"></slot>
      </span>
      <div part="content" class="comment__content">
        <div part="meta" class="comment__meta">
          <span id="author" part="author" class="comment__author"><slot name="author">${this.author}</slot></span>
          ${hasDate ? html`<span aria-hidden="true">·</span>
            <time part="date" class="comment__date" datetime=${this.datetime || nothing}><slot name="date">${this.date}</slot></time>` : ''}
        </div>
        <div part="text" class="comment__text"><slot></slot></div>
      </div>
      …
    </article>`;
}
```
```css
.comment__text { font-size: var(--sl-font-size-small); color: var(--sl-color-neutral-700); }
/* rimuovere .comment__date::before */
```

### Non verificabile
- Resa SR di `aria-labelledby` interno che punta allo slot `author` con contenuto slottato.
- Annuncio dei nuovi commenti nel thread e gestione del focus dopo invio: dipendono dal consumer.
- Il test axe passa nonostante l'avatar senza nome: verificare se axe attraversa lo shadow root di `sl-avatar` in questo setup.
