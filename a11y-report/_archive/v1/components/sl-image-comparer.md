## Image Comparer (`<sl-image-comparer>` – src/components/image-comparer/image-comparer.component.ts)
**Pattern APG di riferimento:** APG Slider (oppure Window Splitter / `separator` focusabile)
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 2 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ❌ | Handle con `role="scrollbar"` (r. 139): ruolo errato per un controllo di posizione, orientamento implicito verticale (SL-IMAGE-COMPARER-01). |
| 2 | Nome, descrizione, stato | ❌ | Handle senza nome accessibile, nessuna property `label`; `aria-valuenow` numerico senza `aria-valuetext` (SL-IMAGE-COMPARER-01, -04). Icona `sl-icon` senza label → `aria-hidden` ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-controls="image-comparer"` punta a un ID nello stesso shadow root (r. 104, 143). Nessun aria del consumer da propagare (manca però l'API, area 8). |
| 4 | Tastiera e focus | ⚠️ | ←/→ (Shift ×10), Home/End, RTL ✅ (r. 65-91); mancano ↑/↓ e PageUp/PageDown del pattern slider (SL-IMAGE-COMPARER-05). Focus ring `--sl-focus-ring` ✅ (styles r. 70-73) su sfondo immagine (non verificabile). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Il valore è esposto da `aria-valuenow` sul controllo focusato. |
| 7 | Aspetti visivi | ⚠️ | Handle 2.5rem (40px) ✅ 2.5.8; solo trascinamento come input pointer (SL-IMAGE-COMPARER-02); divider solo `background-color` → invisibile in forced-colors (SL-IMAGE-COMPARER-06); contrasto handle/divider su immagine NON VERIFICABILE. |
| 8 | API pubblica a11y | ❌ | Nessuna property `label`/`value-text`; nessuna stringa localizzata (SL-IMAGE-COMPARER-03). |
| 9 | Documentazione e test | ⚠️ | Test di tastiera presenti ✅ (test r. 45-211) ma nessun test axe; docs con `alt` corretti ✅, nessuna nota a11y (SL-IMAGE-COMPARER-07). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-IMAGE-COMPARER-01 | Alta | 1/2 | L'handle usa `role="scrollbar"` (che descrive lo scroll di un contenuto, orientamento implicito `vertical`) e non ha alcun nome accessibile: lo screen reader annuncia "barra di scorrimento 50" senza scopo. | image-comparer.component.ts:136-145 `role="scrollbar" aria-valuenow=… tabindex="0"` | WCAG 4.1.2, 1.3.1; APG Slider | `role="slider"`, `aria-orientation="horizontal"`, `aria-label` da property `label` con default localizzato. |
| SL-IMAGE-COMPARER-02 | Media | 7/4 | La posizione si cambia con il puntatore solo trascinando il divider: manca un'alternativa a puntatore singolo (es. click/tap sull'immagine per spostare il divider). | :127-135 `@mousedown/@touchstart=${this.handleDrag}` solo sul divider; styles:18-22 `pointer-events: none` sulle immagini | WCAG 2.5.7 (AA) | Listener `click` su `.image-comparer__image` che imposta `position` dal punto cliccato. |
| SL-IMAGE-COMPARER-03 | Media | 8 | Nessuna API per il nome: niente property `label` né chiave di traduzione; un `aria-label` sull'host resta sull'host senza ruolo (SHARED §2). | image-comparer.component.ts:47-48 (unica property `position`) | WCAG 4.1.2; SHARED-06 | `@property() label` inoltrata all'handle; default localizzato (nuova chiave `imageComparerPosition`). |
| SL-IMAGE-COMPARER-04 | Bassa | 2 | `aria-valuenow` è un numero puro (anche decimale, es. 37.25 dopo drag) senza `aria-valuetext`: manca l'unità e il significato ("37% immagine dopo"). | :58 `toFixed(2)`; :140 | WCAG 4.1.2; APG Slider (`aria-valuetext`) | `aria-valuetext=${`${Math.round(position)}%`}` o formatter localizzato. |
| SL-IMAGE-COMPARER-05 | Bassa | 4 | Mancano ↑/↓ e PageUp/PageDown previsti dal pattern slider (solo ←/→ e Shift per passo grande). | :69 `['ArrowLeft','ArrowRight','Home','End']` | APG Slider (Keyboard interaction) | Mappare ↑/↓ come →/← e PageUp/PageDown come ±10. |
| SL-IMAGE-COMPARER-06 | Bassa | 7 | In `forced-colors` il divider (`background-color`) sparisce e l'handle perde il contorno: la posizione della divisione non è visibile. | image-comparer.styles.ts:41-68 | WCAG 1.4.11; SHARED-02 | `@media (forced-colors: active) { .image-comparer__divider { background: CanvasText } .image-comparer__handle { border: 1px solid CanvasText } }` |
| SL-IMAGE-COMPARER-07 | Suggerimento | 9 | Nessun test axe; docs senza nota che `alt` di before/after deve indicare quale versione è (consumer). | image-comparer.test.ts (assenza di `to.be.accessible()`); docs/pages/components/image-comparer.md | Qualità; WCAG 1.1.1 (consumer) | Aggiungere test axe e sezione a11y. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | No | — | Da aggiungere, inoltrata come `aria-label` all'handle. |
| `aria-valuetext` / formatter | No | — | SL-IMAGE-COMPARER-04. |
| `position` | Sì | ✅ | Esposta come `aria-valuenow`. |
| `role` | Interno `scrollbar` | ❌ | Correggere in `slider`. |

### Fix proposti
```ts
@property() label = '';

render() {
  const value = Math.round(this.position);
  return html`…
    <div part="handle" class="image-comparer__handle"
      role="slider"
      aria-orientation="horizontal"
      aria-label=${this.label || this.localize.term('imageComparerPosition')}
      aria-valuenow=${value} aria-valuemin="0" aria-valuemax="100"
      aria-valuetext=${`${value}%`}
      aria-controls="image-comparer" tabindex="0">…</div>`;
}

private handleKeyDown(event: KeyboardEvent) {
  const map: Record<string, number> = { ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 };
  if (event.key in map) { event.preventDefault(); this.position = clamp(this.position + map[event.key], 0, 100); return; }
  …
}

// 2.5.7 – alternativa a click singolo
private handleImageClick(event: MouseEvent) {
  const { left, width } = this.base.getBoundingClientRect();
  const pct = clamp(((event.clientX - left) / width) * 100, 0, 100);
  this.position = this.localize.dir() === 'rtl' ? 100 - pct : pct;
}
```
```css
.image-comparer__before, .image-comparer__after { pointer-events: none; }
.image-comparer__image { cursor: pointer; }
@media (forced-colors: active) {
  .image-comparer__divider { background-color: CanvasText; }
  .image-comparer__handle { border: 1px solid CanvasText; }
}
```

### Non verificabile
- Contrasto handle bianco/divider e focus ring sulle immagini fornite dal consumer (WCAG 1.4.11).
- Qualità degli `alt` di before/after (consumer).
- Annuncio del cambio di valore con screen reader dopo la correzione del ruolo.
