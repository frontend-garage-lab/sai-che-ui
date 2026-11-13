## Breadcrumb (`sl-breadcrumb` – src/components/breadcrumb/breadcrumb.component.ts)
**Pattern APG di riferimento:** Breadcrumb
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 2 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Landmark `<nav>` nel shadow root (r. 97) ✅; nessuna struttura di lista (`ol`/`li` o `role=list`) per gli item (02). |
| 2 | Nome, descrizione, stato | ⚠️ | `label` esiste (r. 38) ma il default è `''` → `aria-label=""` e nav senza nome (01). `aria-current="page"` impostato automaticamente sull'ultimo item, ma sull'host generico (vedi SL-BREADCRUMB-ITEM-01). Separatori clonati dentro `span[aria-hidden]` dell'item ✅ e sorgente nascosta con `hidden aria-hidden` (r. 101-105) ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-label` sull'host non arriva al `<nav>` interno: si deve usare `label`. `aria-current` scritto sugli host light DOM degli item. |
| 4 | Tastiera e focus | ✅ | Solo link/button nativi degli item, ordine DOM. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | `flex-wrap: wrap` (styles r. 7) favorisce il reflow; colori in `sl-breadcrumb-item`. |
| 8 | API pubblica a11y | ⚠️ | `label` presente ma senza default localizzato; corrente non configurabile (sempre l'ultimo item). |
| 9 | Documentazione e test | ⚠️ | axe in 4 scenari ma con `ignoredRules = ['color-contrast']` (test r. 5-7); test su `aria-current` (r. 32-36). Gli esempi docs non impostano `label`. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-BREADCRUMB-01 | Media | Nome / API | `label` ha default `''` e viene sempre renderizzato: il landmark `nav` riceve `aria-label=""` (nome vuoto). Con più `nav` nella pagina (sidebar, header) il breadcrumb non è distinguibile; nessun default localizzato; esempi docs senza `label`. | breadcrumb.component.ts:38 `@property() label = '';`; 97 `<nav ... aria-label=${this.label}>` | WCAG 1.3.1, 2.4.1, 4.1.2; APG Breadcrumb (nav con aria-label) | `aria-label=${this.label \|\| this.localize.term('breadcrumb')}` aggiungendo la chiave `breadcrumb` alle traduzioni (it: "Percorso di navigazione"); docs con `label`. |
| SL-BREADCRUMB-02 | Bassa | Semantica | Gli item non sono esposti come lista ordinata: gli screen reader non annunciano numero di livelli/posizione. | breadcrumb.component.ts:97-99 `<nav ...><slot ...></slot></nav>` | WCAG 1.3.1; APG Breadcrumb (`ol`/`li`) | Wrapper `<div role="list">` attorno allo slot e `role="listitem"` impostato sugli host `sl-breadcrumb-item` in `handleSlotChange`. |
| SL-BREADCRUMB-03 | Bassa | Test / docs | I test axe disabilitano `color-contrast`, nascondendo il fallimento dello stato hover (SL-BREADCRUMB-ITEM-03); nessuna indicazione nei docs su `label` e sulla scelta link/current. | breadcrumb.test.ts:5-7 `const ignoredRules = ['color-contrast'];` | Qualità (WCAG 1.4.3) | Rimuovere l'esclusione dopo il fix dei colori; sezione Accessibility nei docs. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | Sì | Sì, sul `<nav>` | Default vuoto → `aria-label=""`; aggiungere default localizzato. |
| `aria-label` (host) | — | No | Resta sull'host: documentare l'uso di `label`. |
| `aria-current` | Automatico (ultimo item) | Sull'host dell'item, non sul link | Vedi SL-BREADCRUMB-ITEM-01; permettere di scegliere l'item corrente. |

### Fix proposti
```ts
render() {
  return html`
    <nav part="base" class="breadcrumb" aria-label=${this.label || this.localize.term('breadcrumb')}>
      <div role="list" class="breadcrumb__list">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    </nav>
    …
  `;
}

// handleSlotChange()
items.forEach((item, index) => {
  item.setAttribute('role', 'listitem');
  // l'item corrente è l'ultimo, salvo che il consumer ne abbia marcato uno con `current`
  const hasExplicitCurrent = items.some(i => i.hasAttribute('current'));
  item.current = hasExplicitCurrent ? item.hasAttribute('current') : index === items.length - 1;
});
```
```css
.breadcrumb, .breadcrumb__list { display: flex; align-items: center; flex-wrap: wrap; }
```

### Non verificabile
- Annuncio del landmark e del numero di item con NVDA/JAWS/VoiceOver dopo il fix.
