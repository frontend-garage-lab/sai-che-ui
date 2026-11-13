## Header (`sl-header` – src/components/header/header.component.ts)
**Pattern APG di riferimento:** Landmark Regions (banner + navigation)
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 1 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

> Lo stato corrente delle voci (wash 1.59:1) è registrato in `sl-header-item` come **SL-HEADER-ITEM-03**; vale anche per gli `<a>` semplici slottati (header.styles.ts:91-94).

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `banner` › `image "Saipem"`, `navigation "Main"` › `button "Project Data"`, `link "Dashboard"`; actions fuori dal nav. Nessuna lista (miglioramento). |
| 2 | Nome/descrizione/stato | ✅ | `nav-label` (default `'Main'`, docs: "Set it to localize the component") e `logo-label` → `image "Saipem"` funzionano. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Le voci restano nel light DOM o gestiscono i propri attributi (sl-header-item). |
| 4 | Tastiera e focus | ❌ | A 1280 px Tab percorre voci → select → icon button. A 320 px il nav è largo 0 px: le voci ricevono il focus ma restano invisibili (SL-HEADER-03). Focus ring bianco 11.34:1; in forced colors `outlineStyle = solid`. |
| 5 | Form e validazione | N/A | Controlli negli `actions` del consumer (nell'esempio docs `combobox value="xCMM Demo"` senza nome: consumer). |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Testo voci 8.15:1, corrente 7.13:1, hover 8.48:1 (uguale in dark: il brand non cambia). Reflow a 320 px fallito (SL-HEADER-03). Linea accent decorativa. |
| 8 | API pubblica a11y | ✅ | `nav-label`, `logo-label` applicati agli elementi giusti. |
| 9 | Docs e test | ⚠️ | Nessuna indicazione responsive; esempio con `sl-select` senza label. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-HEADER-03 | Alta | Reflow / focus | Layout senza comportamento responsive: logo e actions `flex: 0 0 auto`, nav `flex: 1 1 auto; min-width: 0; overflow-x: auto; scrollbar-width: none`. A 320 px (zoom 400%) con l'esempio docs il nav si riduce a **0 px**, la pagina scorre orizzontalmente e le voci di navigazione principali sono invisibili anche quando ricevono il focus da tastiera. Senza la select resta una finestra di 31 px. Workaround solo via `::part` (non documentato). | header.styles.ts:15-28 (`height: var(--height)`, nessun wrap), 48-56 (nav), 101-107 (actions `flex: 0 0 auto`) | runtime `--viewport 320x640`: `[scrollWidth 493, nav.clientWidth 0, nav.scrollWidth 524]`; dopo 3 Tab focus su `a[part=base]` "Dashboard": `{"nav":[125,125,0],"link":[76,172],"hit":"SL-HEADER"}` (il link focalizzato non è visibile). Senza select: `nav.clientWidth 31` | WCAG 1.4.10 (AA), 2.4.7 (AA) | Sotto una soglia (container query) consentire `flex-wrap: wrap` con nav su riga propria (`flex-basis: 100%`) o un menu "overflow"/hamburger; mai larghezza 0 per il nav; `min-height` al posto di `height`. |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-HEADER-V01 | miglioramento | Default di `nav-label` localizzato (oggi `'Main'`, sovrascrivibile e documentato). | header.component.ts:39 |
| SL-HEADER-V02 | miglioramento | Warning in dev mode con `logo-src` senza `logo-label` (oggi `alt=""`). | header.component.ts:48, 58 |
| SL-HEADER-V03 | miglioramento | `min-height` al posto di `height` per tollerare text spacing / testo su più righe (non dimostrato un taglio). | header.styles.ts:19 |
| SL-HEADER-V04 | miglioramento | Struttura a lista per le voci del nav. | header.component.ts:62-64 |

### Responsabilità del consumer
- `nav-label` nella lingua della pagina; `logo-label` quando il logo è l'unico nome del prodotto.
- Dare un nome ai controlli negli `actions` (es. `sl-select` con `label`/`aria-label`: nell'esempio docs è `combobox` senza nome).

### Da verificare con AT reali
- Esposizione del `<header>` come `banner` quando l'host è dentro `main`/`section` nella pagina del consumer (in Chromium, a livello body, è `banner`).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-HEADER-01 | Bassa | riclassificato | `nav-label` sovrascrivibile e documentato per la localizzazione → consumer + V01. |
| SL-HEADER-02 | Bassa | riclassificato | `alt=""` solo se il consumer omette `logo-label` (l'esempio docs lo imposta: `image "Saipem"`) → consumer + V02. |
| SL-HEADER-03 | Media | ridimensionato | Peggio del previsto: a 320 px il nav è 0 px e il link focalizzato è invisibile (`hit: SL-HEADER`) → Alta (1.4.10 + 2.4.7). |
| SL-HEADER-04 | Bassa | riclassificato | Taglio non dimostrato (voci `nowrap` alte 2rem in 3.5rem) → V03. |
| SL-HEADER-05 | Bassa | riclassificato | Lista non richiesta da WCAG → V04. |
| SL-HEADER-06 | Bassa | confermato | Accorpato in SL-HEADER-ITEM-03 (wash 1.59:1, invisibile in forced colors). |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|---------------------------------|----------------|
| `nav-label` | Sì | Sì (`navigation "Main"`) | Sì |
| `logo-label` | Sì | Sì (`image "Saipem"`) | Sì con `logo-src` |

### Fix proposti
```css
/* header.styles.ts */
:host { container-type: inline-size; }
.header { min-height: var(--height); height: auto; }

@container (max-width: 40rem) {
  .header { flex-wrap: wrap; padding-block: var(--sl-spacing-2x-small); }
  .header__actions { flex: 0 1 auto; flex-wrap: wrap; }
  .header__nav { order: 3; flex: 1 0 100%; flex-wrap: wrap; overflow-x: visible; }
}
```
