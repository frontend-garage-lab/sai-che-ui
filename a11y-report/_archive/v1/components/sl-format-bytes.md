## Format Bytes (`<sl-format-bytes>` – src/components/format-bytes/format-bytes.component.ts)
**Pattern APG di riferimento:** N/A (formatter di testo); WCAG 3.1.2 Language of Parts
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 1 · Suggerimento 2

Il componente restituisce testo semplice localizzato con `Intl.NumberFormat` (`style: 'unit'`, r. 35-39), reso come nodo di testo nello shadow root e letto normalmente dalle AT. Il finding principale è trasversale: `lang` (e `dir`) impostati come **property** non vengono riflessi come attributo, quindi l'HTML non dichiara la lingua del testo prodotto. Vale anche per `sl-format-date`, `sl-format-number` e `sl-relative-time`. È candidato a diventare un `SHARED`.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Testo puro, nessun ruolo. Host inline. |
| 2 | Nome, descrizione, stato | ⚠️ | Con `display="short"` (default, r. 21) o `"narrow"` le unità sono abbreviate ("1.2 MB", "1.2MB", "kb"): la lettura dipende dallo screen reader (SL-FORMAT-BYTES-02). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Il testo è nello shadow root ma entra nel nome dei contenitori (es. una cella o un `sl-file-upload-item` che lo usa). Usato in `file-drop.component.ts:273-277`. |
| 4 | Tastiera e focus | N/A | — |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | N/A | Nessuno stile proprio: eredita colore e font dal contesto. |
| 8 | API pubblica a11y | ⚠️ | `lang` ereditato da `ShoelaceElement` (shoelace-element.ts:68) ✅ per la formattazione, ma non riflesso come attributo (SL-FORMAT-BYTES-01). |
| 9 | Documentazione e test | ⚠️ | I test coprono formati e lingue (test r. 7-13, 46-97) ma non axe (SL-FORMAT-BYTES-03). Docs: esempi di localizzazione con l'attributo `lang` (md r. 109-117) ✅. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-FORMAT-BYTES-01 | Bassa | 8 / 3 | **Trasversale (tutti i componenti, rilevante per i formatter).** `@property() lang` e `@property() dir` ridefiniscono l'accessor nativo di `HTMLElement` senza `reflect`. Lit crea un accessor con storage a Symbol (`reactive-element.js` `createProperty`/`getPropertyDescriptor`), quindi `el.lang = 'de'` (bindings di React 19 / Angular `[lang]`, JS) formatta in tedesco ma non scrive l'attributo `lang`. Le AT leggono il testo con la lingua della pagina, e con `dir` il testo RTL non viene orientato. Con l'attributo HTML `lang="de"` invece funziona. | src/internal/shoelace-element.ts:67-68 `@property() dir: string; @property() lang: string;` | WCAG 3.1.2 (AA), 1.3.2 (per `dir`) | `@property({ reflect: true }) lang` / `dir` in `ShoelaceElement`. Aggiungere un test `el.lang='de'` → `getAttribute('lang') === 'de'`. |
| SL-FORMAT-BYTES-02 | Suggerimento | 2 | Le unità abbreviate (`short`/`narrow`, default `short`) come "kB", "MB", "Mb" possono essere lette lettera per lettera, e "Mb" (megabit) e "MB" (megabyte) suonano uguali. | src/components/format-bytes/format-bytes.component.ts:21 `display = 'short'`; :35-39 | WCAG 3.1.4 (AAA), buona pratica | Documentare `display="long"` dove la distinzione bit/byte è importante, o valutare `<abbr title>` con la forma estesa (supporto AT variabile). |
| SL-FORMAT-BYTES-03 | Suggerimento | 9 | Nessun test axe. | src/components/format-bytes/format-bytes.test.ts (nessun `to.be.accessible()`) | Buona pratica | Aggiungere `await expect(el).to.be.accessible()`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `lang` | Sì (ereditata) | Formattazione sì; attributo HTML solo se impostato come attributo | Rendere `reflect: true` (SL-FORMAT-BYTES-01). |
| `dir` | Sì (ereditata) | Come `lang` | Rendere `reflect: true`. |
| `display` | Sì | — | `long` consigliato per le AT dove serve chiarezza. |

### Fix proposti
```ts
// src/internal/shoelace-element.ts
@property({ reflect: true }) dir: string;
@property({ reflect: true }) lang: string;
```
Nota: con `reflect: true` un valore `undefined` non scrive l'attributo, quindi non nasce un `lang=""` spurio.

### Non verificabile
- Pronuncia delle unità abbreviate con NVDA/JAWS/VoiceOver nelle varie lingue.
- Cambio effettivo di voce/lingua dello screen reader sul testo dello shadow root ereditato dal `lang` dell'host (atteso sì; serve una prova manuale).
