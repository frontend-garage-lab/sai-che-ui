## Menu Label (`sl-menu-label` – src/components/menu-label/menu-label.component.ts)
**Pattern APG di riferimento:** Menu — gruppi di item con `role="group"` + `aria-labelledby` (https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 2 · Bassa 1 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ❌ | Nessun ruolo: testo generico dentro `role="menu"`; gli item che "descrive" non sono raggruppati (`role="group"`) né collegati all'etichetta (SL-MENU-LABEL-01). |
| 2 | Nome, descrizione, stato | ❌ | L'etichetta non diventa nome di alcun gruppo: navigando con le frecce (focus solo sugli item) non viene mai annunciata. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il testo è nel light DOM (slot): un id sull'host sarebbe referenziabile da un `role="group"` nello stesso root, ma il DS non offre un contenitore di gruppo. |
| 4 | Tastiera e focus | ✅ | Non focusabile ed escluso da `getAllItems()` (non è menuitem) ✅. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | `neutral-500` a 12px: 4.71:1 su panel light ✅ (al limite), **2.95:1 in dark** (`--sl-surface-panel` = `neutral-100` dark) ❌ (SL-MENU-LABEL-02, SHARED-03). `text-transform: uppercase` + `letter-spacing` loose: solo leggibilità. |
| 8 | API pubblica a11y | ⚠️ | Nessuna API per associare l'etichetta a un gruppo. |
| 9 | Documentazione e test | ⚠️ | Test axe solo standalone, fuori da `sl-menu` (SL-MENU-LABEL-03); docs presentano la label come descrizione di gruppo senza dire che non è esposta ad AT. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-MENU-LABEL-01 | Media | 1/2 | La label "descrive un gruppo di item" (summary r. 8) solo visivamente: non ha ruolo, gli item non sono in un `role="group"` con `aria-labelledby`, e nella navigazione a frecce dei menu il testo non viene annunciato. La struttura di raggruppamento non è determinabile programmaticamente. | src/components/menu-label/menu-label.component.ts:8, 20-22 `<slot part="base" class="menu-label"></slot>`; docs/pages/components/menu-label.md:8-17 | WCAG 1.3.1; APG Menu (group + aria-labelledby) | Nuovo contenitore `sl-menu-group` (host `role="group"`, `aria-labelledby` verso la propria `sl-menu-label` o property `label`) e `sl-menu.getAllItems()` che attraversa i gruppi; in alternativa assegnare un id alla label e far impostare a `sl-menu` `aria-describedby` sugli item successivi fino al prossimo divider/label. |
| SL-MENU-LABEL-02 | Media | 7 | Colore `neutral-500` per testo di 12px: in tema dark sul pannello (`neutral-100`) il contrasto è 2.95:1. | src/components/menu-label/menu-label.styles.ts:15 `color: var(--sl-color-neutral-500);` | WCAG 1.4.3; SHARED-03 | Usare `--sl-color-neutral-600` (light 6.63:1 su `neutral-0`; dark 4.83:1 su `neutral-100`, calcolati dai token) o un token `--sl-menu-label-color` conforme in entrambi i temi. |
| SL-MENU-LABEL-03 | Bassa | 9 | L'unico test axe renderizza la label fuori da un menu: non verifica il contesto reale (`role="menu"` con figli generici). | src/components/menu-label/menu-label.test.ts:6-9 | Qualità | Test axe con `<sl-menu><sl-menu-label>…<sl-menu-item>…</sl-menu>`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| Slot di default (testo) | Sì | Testo esposto come generico | — |
| `id` per `aria-labelledby` di gruppo | Possibile (host nel light DOM) | — | Serve un contenitore `role="group"` (SL-MENU-LABEL-01) |
| `role` | No | — | Non serve sulla label; serve sul gruppo |

### Fix proposti
```ts
// sl-menu-group (nuovo) — src/components/menu-group/menu-group.component.ts
export default class SlMenuGroup extends ShoelaceElement {
  @property() label = '';
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'group'); // o internals.role
  }
  updated() {
    if (this.label) this.setAttribute('aria-label', this.label);
  }
  render() {
    return html`${this.label ? html`<div part="label" class="menu-label" aria-hidden="true">${this.label}</div>` : ''}<slot></slot>`;
  }
}

// sl-menu.getAllItems(): includere gli item dentro sl-menu-group
getAllItems() {
  return (this.defaultSlot.assignedElements({ flatten: true }) as HTMLElement[])
    .flatMap(el => (el.localName === 'sl-menu-group' ? [...el.children] as HTMLElement[] : [el]))
    .filter(el => !el.inert && this.isMenuItem(el)) as SlMenuItem[];
}
```
```css
.menu-label { color: var(--sl-color-neutral-600); }
```

### Non verificabile
- Lettura del testo generico all'interno di `role="menu"` in modalità navigazione virtuale (NVDA/JAWS/VoiceOver) — in modalità focus/application non viene letto.
- Contrasto su superfici diverse da `--sl-surface-panel` se il consumer ridefinisce lo sfondo del menu.
