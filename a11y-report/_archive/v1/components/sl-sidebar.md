## Sidebar (`sl-sidebar` – src/components/sidebar/sidebar.component.ts)
**Pattern APG di riferimento:** Landmark Regions (navigation / complementary) + Disclosure (toggle di collasso)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 3 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<nav aria-label>` nel shadow root (r. 74) ✅, ma racchiuso in un `<aside>` senza nome (r. 70): doppio landmark (complementary + navigation) per la navigazione principale/secondaria (02). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome del nav di default `'Sidebar'` in inglese (r. 49); label del toggle hardcoded in inglese (r. 88) (01). Il toggle comunica lo stato solo cambiando label, senza `aria-expanded`/`aria-controls` (03). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-label` sull'host non arriva al `<nav>`: usare `label`. Il toggle (`sl-icon-button`) non accetta `aria-expanded`/`aria-controls` (nessuna passthrough). |
| 4 | Tastiera e focus | ✅ | Toggle è un `<button>` nativo (icon-button), il focus resta sul toggle dopo il collasso; contenuti in ordine DOM. Gli item nascosti nel rail sono `display:none` (fuori dal tab order) ✅. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Cambio di stato annunciato tramite cambio di nome del pulsante focalizzato (vedi Non verificabile). |
| 7 | Aspetti visivi | ✅ | Testo `neutral-700` 9.12:1; bordi `neutral-200` decorativi; toggle ≈36×36px (20px + padding 8px) ✅; `prefers-reduced-motion` sulla transizione di larghezza (styles r. 70-74) ✅. Larghezze in `rem`. |
| 8 | API pubblica a11y | ⚠️ | `label` presente (non localizzato); mancano `expand-label`/`collapse-label` per il toggle. |
| 9 | Documentazione e test | ⚠️ | axe statico (test r. 7-18) e test di toggle (r. 20-38, verifica label inglese). Nessun test axe in stato `collapsed`; docs senza sezione a11y. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-SIDEBAR-01 | Media | i18n / nome | Stringhe a11y hardcoded in inglese: nome del landmark `'Sidebar'` e label del toggle `'Expand sidebar'`/`'Collapse sidebar'` non passano da `LocalizeController` e il toggle non è sovrascrivibile. In una UI italiana vengono pronunciate con fonetica errata. | sidebar.component.ts:49 `label = 'Sidebar'`; 88 `label=${this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}` | WCAG 3.1.2, 2.4.6; SHARED-06 | Chiavi di traduzione (`sidebar`, `expandSidebar`, `collapseSidebar`) + property `expand-label`/`collapse-label` che vincono sul default. |
| SL-SIDEBAR-02 | Bassa | Semantica | La navigazione è annidata in un `<aside>` senza nome: viene esposto anche un landmark `complementary` anonimo che contiene header/footer e nav; per una navigazione di pagina il landmark corretto è solo `navigation`. | sidebar.component.ts:70 `<aside part="base" ...>`; 74 `<nav ...>` | WCAG 1.3.1; ARIA Landmarks (complementary) | Usare `<div part="base">` come contenitore (o rendere opzionale il ruolo complementary con nome). |
| SL-SIDEBAR-03 | Bassa | Stato | Il toggle comunica lo stato solo cambiando etichetta: niente `aria-expanded`/`aria-controls`, e `sl-icon-button` non permette di aggiungerli. | sidebar.component.ts:84-90 | WCAG 4.1.2; APG Disclosure | Usare un `<button>` nativo (o estendere `sl-icon-button` con `aria-expanded`/`aria-controls`) con label costante (es. "Menu laterale") e `aria-expanded=${!this.collapsed}` `aria-controls="nav"`. |
| SL-SIDEBAR-04 | Bassa | Test | Nessun test axe in stato `collapsed` (dove i nomi degli item dipendono da `title`) e test che codifica la label inglese. | sidebar.test.ts:7-38 (`expect(toggle.label).to.equal('Expand sidebar')`) | Qualità (WCAG 4.1.2) | Test axe con `collapsed` e asserzioni su nome dei link e `aria-expanded`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` (nav) | Sì | Sì, sul `<nav>` | Default inglese non localizzato. |
| `expand-label` / `collapse-label` | No | — | Da aggiungere con default localizzati. |
| `aria-expanded` toggle | No | — | Da aggiungere. |
| `collapsed` / `no-toggle` | Sì | Propaga `collapsed` a gruppi e item | — |

### Fix proposti
```ts
private readonly localize = new LocalizeController(this);
@property() label = '';
@property({ attribute: 'expand-label' }) expandLabel = '';
@property({ attribute: 'collapse-label' }) collapseLabel = '';

render() {
  const navLabel = this.label || this.localize.term('sidebar');
  return html`
    <div part="base" class="sidebar${this.collapsed ? ' sidebar--collapsed' : ''}">
      …
      <nav id="nav" part="nav" class="sidebar__nav" aria-label=${navLabel}>…</nav>
      …
      ${this.noToggle ? '' : html`
        <div class="sidebar__toggle">
          <button part="toggle" type="button" class="sidebar__toggle-button"
            aria-expanded=${this.collapsed ? 'false' : 'true'}
            aria-controls="nav"
            aria-label=${this.collapsed
              ? this.expandLabel || this.localize.term('expandSidebar')
              : this.collapseLabel || this.localize.term('collapseSidebar')}
            @click=${this.handleToggle}>
            <sl-icon library="system" name=${this.collapsed ? 'chevron-double-right' : 'chevron-double-left'}></sl-icon>
          </button>
        </div>`}
    </div>`;
}
```

### Non verificabile
- Annuncio del cambio di nome del toggle dopo l'attivazione (alcuni screen reader non rileggono il nome aggiornato del pulsante focalizzato).
- Contrasto di eventuali contenuti degli slot `header`/`footer` (consumer).
