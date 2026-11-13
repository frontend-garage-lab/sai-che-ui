## Sidebar Group (`sl-sidebar-group` – src/components/sidebar-group/sidebar-group.component.ts)
**Pattern APG di riferimento:** Navigation landmark con gruppi (role=group); nessun pattern widget
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="group"` con nome (r. 78-79) ✅; gli item (link) non sono in una lista (03). `sl-divider` (role=separator) tra i gruppi: annunciato come separatore, accettabile. |
| 2 | Nome, descrizione, stato | ⚠️ | Nome del gruppo da `aria-label=${this.label}`: con `label` vuoto diventa `aria-label=""` (04). Il contatore (`sl-badge`) è letto come numero nudo senza contesto (03). Icona slottata: `sl-icon` senza label → `aria-hidden` ✅. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo e nome sullo stesso nodo interno; nessun riferimento cross-root. |
| 4 | Tastiera e focus | ⚠️ | Nessun elemento interattivo proprio. In collapsed il nome del gruppo è visibile solo nel tooltip al passaggio del mouse sull'icona (non focusabile) (05). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Label `neutral-600` 12px 6.63:1 / 5.70:1 ✅; icona `neutral-600` su `neutral-100` 6.01:1 ✅; gruppo corrente: tile `primary-600` con icona bianca 6.21:1 ✅. Contatore `neutral-400` su `neutral-0`: 3.21:1 light / 2.17:1 dark per testo 12px ❌ (01). |
| 8 | API pubblica a11y | ⚠️ | Nessuna property per il testo descrittivo del contatore (es. `count-label`). |
| 9 | Documentazione e test | ⚠️ | 1 test axe statico (test r. 6-14); nessun test in collapsed; docs senza note a11y. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-SIDEBAR-GROUP-01 | Media | Contrasto | Il contatore del gruppo usa `neutral-400` su sfondo trasparente (panel `neutral-0`): 3.21:1 (light) e 2.17:1 (dark) per testo 12px. | sidebar-group.styles.ts:76-80 `color: var(--sl-color-neutral-400);` | WCAG 1.4.3 | `color: var(--sl-color-neutral-600)` (6.63:1 / 5.70:1). |
| SL-SIDEBAR-GROUP-02 | Bassa | Nome | Il contatore è letto come numero isolato dopo il titolo ("PROCUREMENT (SAP) 71"), senza indicare cosa conta. | sidebar-group.component.ts:86-88 `<sl-badge ...>${this.count}</sl-badge>` | WCAG 1.3.1, 2.4.6 | Property `count-label` (es. "71 documenti") resa in `sl-visually-hidden` con il numero `aria-hidden`. |
| SL-SIDEBAR-GROUP-03 | Bassa | Semantica | Gli item sono link in sequenza dentro `div`: nessuna lista `ul/li` (`role=list/listitem`), quindi numero di voci non annunciato. | sidebar-group.component.ts:90 `<div part="items" class="sidebar-group__items"><slot></slot></div>` | WCAG 1.3.1 | `role="list"` sul contenitore items e `role="listitem"` sugli host `sl-sidebar-item` (impostato dal gruppo). |
| SL-SIDEBAR-GROUP-04 | Bassa | Nome | Con `label` vuoto (default) viene emesso `aria-label=""`: `role="group"` senza nome. | sidebar-group.component.ts:43 `label = ''`; 79 `aria-label=${this.label}` | WCAG 4.1.2 | `aria-labelledby` verso lo `span` della label (stesso shadow root) e omettere `role="group"` quando `label` è vuoto (`ifDefined`/`nothing`). |
| SL-SIDEBAR-GROUP-05 | Suggerimento | Visivi / tastiera | In `collapsed` il titolo del gruppo è disponibile solo come tooltip sull'icona non focusabile (solo hover); il gruppo "corrente" è segnalato solo dal colore della tile. | sidebar-group.component.ts:82-84 `<sl-tooltip ... ?disabled=${!this.collapsed}>`; sidebar-group.styles.ts:44-47 | WCAG 1.4.1, 1.4.13 (informativo) | Mostrare il tooltip anche al focus degli item del gruppo, o aggiungere un indicatore non cromatico (bordo/forma) per il gruppo corrente. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | Sì | Sì (aria-label del `role=group`) | Vuoto → `aria-label=""`. |
| `count` | Sì | Testo del badge | Aggiungere `count-label`. |
| `collapsed` | Sì (dal sidebar) | — | — |

### Fix proposti
```ts
@property({ attribute: 'count-label' }) countLabel = '';

render() {
  return html`
    <div part="base" class="sidebar-group…"
      role=${this.label ? 'group' : nothing}
      aria-labelledby=${this.label ? 'label' : nothing}>
      <div part="header" class="sidebar-group__header">
        …
        <span id="label" part="label" class="sidebar-group__label">${this.label}</span>
        ${this.count !== undefined
          ? html`<sl-badge part="count" class="sidebar-group__count" variant="neutral" pill aria-hidden=${this.countLabel ? 'true' : nothing}>${this.count}</sl-badge>
                 ${this.countLabel ? html`<sl-visually-hidden>${this.countLabel}</sl-visually-hidden>` : ''}`
          : ''}
      </div>
      <div part="items" class="sidebar-group__items" role="list"><slot></slot></div>
      …`;
}
```
```css
.sidebar-group__count::part(base) { color: var(--sl-color-neutral-600); }
```

### Non verificabile
- Lettura del nome del gruppo quando si entra nel gruppo con NVDA/VoiceOver (dipende dall'annuncio dei `role=group` nominati).
