## Image Comparer (`<sl-image-comparer>` – src/components/image-comparer/image-comparer.component.ts)
**Pattern APG di riferimento:** APG Slider (o Window Splitter)
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 2 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ❌ | Handle esposto come `scrollbar value="50" [orientation="vertical"]`: ruolo e orientamento sbagliati per un controllo orizzontale di posizione (SL-IMAGE-COMPARER-01). Immagini `image "Versione in scala di grigi"` / `"Versione a colori"` ✅. |
| 2 | Nome/descrizione/stato | ❌ | Handle senza nome; `aria-label` sull'host resta su `generic "Confronto gattini"` (SL-IMAGE-COMPARER-01). Valore `value="50"`, `valuemin=0 valuemax=100` ✅, `valuetext=""` (miglioramento). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-controls="image-comparer"` nello stesso shadow root. |
| 4 | Tastiera e focus | ✅ | Tab → `div[part=handle]`; → +1, Shift+→ +10 (50 → 61), End → 100, Home → 0 ✅. ↑/↓/PageUp non fanno nulla (61 → 61, miglioramento). Focus visibile anche in `forcedcolors` (`outlineStyle = solid`). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Valore esposto sul controllo focusato. |
| 7 | Aspetti visivi | ❌ | Solo trascinamento come input puntatore: click sull'immagine non sposta il divider (SL-IMAGE-COMPARER-02). Handle 40×40 px ✅; icona grip 9.07:1 light / 8.75:1 dark sul fondo dell'handle ✅. In forced colors divider e handle diventano `Canvas` (bianco) con icona `CanvasText`: restano visibili. |
| 8 | API pubblica a11y | ❌ | Nessuna `label`; nessuna chiave di traduzione per il nome. |
| 9 | Docs e test | ⚠️ | Test di tastiera presenti; nessun test axe; nessuna nota a11y nei docs. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-IMAGE-COMPARER-01 | Alta | Semantica/Nome | L'handle ha `role="scrollbar"` (orientamento implicito verticale) e nessun nome; non esiste API per darglielo (`aria-label` sull'host resta sull'host). | image-comparer.component.ts:136-145 `role="scrollbar" aria-valuenow=… tabindex="0"`; :47-48 (unica property `position`) | runtime: `scrollbar value="50" [focused orientation="vertical" valuemin=0 valuemax=100 valuetext=""]` senza nome; host `generic "Confronto gattini"` | 4.1.2; APG Slider | `role="slider"`, `aria-orientation="horizontal"`, `aria-label` da nuova property `label` con default localizzato |
| SL-IMAGE-COMPARER-02 | Alta | Puntatore | La posizione si cambia col puntatore solo trascinando il divider: nessuna alternativa a puntatore singolo senza trascinamento. Workaround possibile solo con codice del consumer (click sull'host → `position`), non documentato. | image-comparer.component.ts:127-135 `@mousedown/@touchstart=${this.handleDrag}` solo sul divider | runtime: `position=20` → `click` su `.image-comparer__image` → `position` resta `20` | 2.5.7 (AA) | Listener `click` su `.image-comparer__image` che imposta `position` dal punto cliccato |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-IMAGE-COMPARER-04 | miglioramento | `aria-valuetext` (es. "50%") per dare unità e significato; dopo un drag il valore può essere decimale (`toFixed(2)`). | image-comparer.component.ts:58, :140 |
| SL-IMAGE-COMPARER-05 | miglioramento | ↑/↓ e PageUp/PageDown come da APG Slider (oggi ignorati: 61 → 61); la funzione è già operabile con ←/→/Home/End. | image-comparer.component.ts:69 |
| SL-IMAGE-COMPARER-07 | miglioramento | Test axe e sezione accessibilità nei docs. | image-comparer.test.ts |

### Responsabilità del consumer
- `alt` di `before`/`after` che indichino quale versione è (gli esempi docs lo fanno).
- Contrasto del divider/handle rispetto alle immagini scelte.

### Da verificare con AT reali
- Annuncio del valore e del nome dopo la correzione del ruolo (NVDA/JAWS/VoiceOver), in particolare con valori decimali.
- Contrasto di divider e focus ring sulle immagini reali (dipende dal contenuto; non misurabile in modo generale).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-IMAGE-COMPARER-01 | Alta | confermato | `scrollbar` verticale senza nome (runtime). |
| SL-IMAGE-COMPARER-02 | Media | ridimensionato → Alta | Click non sposta il divider (runtime); è la funzione principale, AA, workaround non documentato. |
| SL-IMAGE-COMPARER-03 | Media | confermato (accorpato in SL-IMAGE-COMPARER-01) | `aria-label` sull'host non arriva all'handle: è il motivo per cui SL-IMAGE-COMPARER-01 non ha workaround. |
| SL-IMAGE-COMPARER-04 | Bassa | riclassificato (miglioramento) | Valore numerico con min/max esposti; `aria-valuetext` non obbligatorio. |
| SL-IMAGE-COMPARER-05 | Bassa | riclassificato (miglioramento) | Funzione operabile con ←/→/Home/End. |
| SL-IMAGE-COMPARER-06 | Bassa | scartato | In forced colors divider e handle sono resi `Canvas` con icona `CanvasText` (`rgb(0,0,0)`): non spariscono. |
| SL-IMAGE-COMPARER-07 | Suggerimento | riclassificato (miglioramento) | Test/docs. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `label` | No | — | Sì (unico modo per nominare l'handle) |
| `aria-label` sull'host | — | ❌ resta su `generic "Confronto gattini"` | — |
| `position` | Sì | ✅ `value="50"` → `"0"` dopo Home | Sì |

### Fix proposti
```ts
@property() label = '';

<div part="handle" class="image-comparer__handle"
  role="slider"
  aria-orientation="horizontal"
  aria-label=${this.label || this.localize.term('imageComparerPosition') /* nuova chiave */}
  aria-valuenow=${this.position} aria-valuemin="0" aria-valuemax="100"
  aria-valuetext=${`${Math.round(this.position)}%`}
  aria-controls="image-comparer" tabindex="0">…</div>

// SL-IMAGE-COMPARER-02
<div class="image-comparer__image" @click=${this.handleImageClick}>…</div>
private handleImageClick(event: MouseEvent) {
  const { left, width } = this.base.getBoundingClientRect();
  const pct = clamp(((event.clientX - left) / width) * 100, 0, 100);
  this.position = this.localize.dir() === 'rtl' ? 100 - pct : pct;
}
```
