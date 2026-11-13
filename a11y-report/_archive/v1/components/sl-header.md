## Header (`sl-header` – src/components/header/header.component.ts)
**Pattern APG di riferimento:** Landmark Regions (banner + navigation)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 5 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<header>` (r. 54) + `<nav aria-label>` (r. 62) nativi; il nav viene nascosto con `hidden` se lo slot è vuoto (r. 62) ✅. Nessuna lista per le voci (05). |
| 2 | Nome, descrizione, stato | ⚠️ | `nav-label` sovrascrivibile ma default inglese `'Main'` (01). Logo da `logo-src` con `alt=${this.logoLabel}` default `''` → immagine decorativa senza avviso (02). `aria-current` sulle `<a>` slottate è del consumer (documentato, header.md:175). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Link slottati restano nel light DOM: `aria-current`/`aria-label` del consumer funzionano. `aria-label` sull'host non serve (landmark interni con property dedicate). |
| 4 | Tastiera e focus | ✅ | Nessun widget proprio; focus ring sulle `<a>` slottate `outline: solid 2px var(--color)` (r. 96-99): bianco su brand 11.34:1 ✅. |
| 5 | Form e validazione | N/A | Controlli negli slot `actions` (consumer). |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Testo link `--color` 82% su brand 8.15:1, hover 8.53:1, corrente 7.15:1 ✅ (calcolati con blending). Linea accent decorativa. Nav con overflow orizzontale e scrollbar nascosta (03); altezza fissa 3.5rem (04); corrente distinto solo da sfondo (1.59:1 vs brand) e perso in forced-colors (06). |
| 8 | API pubblica a11y | ✅ | `nav-label`, `logo-label` presenti e applicati all'elemento giusto. |
| 9 | Documentazione e test | ⚠️ | axe statico (test r. 6-17) e test su nome del nav (r. 25-31). Docs: esempio con `sl-select` negli `actions` senza `label` (consumer, header.md:33). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-HEADER-01 | Bassa | i18n | Default del nome del landmark in inglese (`'Main'`), non localizzato; sovrascrivibile con `nav-label`. | header.component.ts:39 `navLabel = 'Main';` | WCAG 3.1.2; SHARED-06 | Default da `LocalizeController` (nuova chiave `mainNavigation`, it: "Navigazione principale"). |
| SL-HEADER-02 | Bassa | Testo alternativo | Con `logo-src` e senza `logo-label` il logo riceve `alt=""` senza avviso: il nome del prodotto/brand sparisce per AT. | header.component.ts:48 `logoLabel = ''`; 58 `alt=${this.logoLabel}` | WCAG 1.1.1 | Warning in dev mode se `logoSrc && !logoLabel`; documentare quando l'alt vuoto è corretto (nome già in testo adiacente). |
| SL-HEADER-03 | Media | Reflow | Il nav scorre orizzontalmente con scrollbar nascosta (`overflow-x: auto; scrollbar-width: none`) e senza pulsanti di scroll: a 320px/zoom 400% le voci oltre il bordo non sono visibili né scopribili con il mouse. | header.styles.ts:48-56 | WCAG 1.4.10 | Menu "overflow" (voci in eccesso in un dropdown) o wrap; in alternativa mostrare la scrollbar / scroll button come in `sl-tab-group`. |
| SL-HEADER-04 | Bassa | Ridimensionamento testo | Altezza fissa `height: var(--height)` (3.5rem) con `align-items: stretch`: con text-spacing/zoom testo solo (200%) le voci su più righe vengono tagliate. | header.styles.ts:19 | WCAG 1.4.4, 1.4.12 | `min-height: var(--height)` al posto di `height`. |
| SL-HEADER-05 | Bassa | Semantica | Le voci del nav sono slottate direttamente nel `<nav>` senza lista: numero di voci non annunciato. | header.component.ts:62-64 | WCAG 1.3.1 | `<div role="list">` attorno allo slot e `role="listitem"` sugli item (o documentare l'uso di `<ul>` nel light DOM). |
| SL-HEADER-06 | Bassa | Forced colors / visivi | La voce corrente (`a[aria-current=page]`) è distinta solo da uno sfondo al 16% (1.59:1 rispetto al brand) e dal testo al 100% vs 82%; in `forced-colors` lo sfondo sparisce. | header.styles.ts:91-94 | WCAG 1.4.1, 1.4.11; SHARED-02 | Indicatore non cromatico (sottolineatura/barra inferiore) e `@media (forced-colors: active) { ::slotted(a[aria-current='page']) { outline: 2px solid Highlight; } }`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `nav-label` | Sì | Sì, sul `<nav>` | Default inglese. |
| `logo-label` | Sì | Sì, `alt` dell'`<img>` | Warning se assente. |
| `aria-current` sulle `<a>` | Consumer | Sì (light DOM) | Documentato. |

### Fix proposti
```ts
private readonly localize = new LocalizeController(this);
@property({ attribute: 'nav-label' }) navLabel = '';

updated() {
  if (this.logoSrc && !this.logoLabel) {
    console.warn('<sl-header>: logo-src senza logo-label: il logo sarà ignorato dalle tecnologie assistive.');
  }
}

render() {
  // …
  html`<nav part="nav" class="header__nav" aria-label=${this.navLabel || this.localize.term('mainNavigation')} ?hidden=${!hasNav}>
         <div role="list" class="header__list"><slot></slot></div>
       </nav>`;
}
```
```css
.header { min-height: var(--height); height: auto; }
.header__list { display: contents; }
@media (forced-colors: active) {
  .header__nav ::slotted(a[aria-current='page']) { outline: 2px solid Highlight; outline-offset: -2px; }
}
```

### Non verificabile
- Esposizione di `<header>` come landmark `banner`: dipende dalla posizione dell'host `sl-header` nel documento (se è dentro `main`/`article`/`section`, diventa generico). Verificare nella pagina del consumer.
- Contrasto con `--background`/`--color` ridefiniti dal consumer.
