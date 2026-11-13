## Button Group (`sl-button-group` – src/components/button-group/button-group.component.ts)
**Pattern APG di riferimento:** WAI-ARIA `group` role · APG Toolbar pattern (per l'esempio "Toolbar") · APG Radio Group (scelte mutuamente esclusive)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 2 · Bassa 2 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `<div role="group">` nel shadow root con i bottoni slottati (r. 74-85) ✅; dentro `sl-radio-group` diventa `role="presentation"` (r. 77, radio-group.component.ts:235) ma mantiene `aria-label` (conflitto ruolo presentazionale + attributo globale, SL-BUTTON-GROUP-03). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome via `label` (r. 29, 78) ✅; senza `label` viene emesso `aria-label=""` (gruppo senza nome, nessun warning). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il nome non può venire da un'intestazione visibile (`aria-labelledby` verso il light DOM non funziona: il ruolo è sul `<div>` interno, SHARED §2); `aria-label` sull'host non propagato. |
| 4 | Tastiera e focus | ✅ | Nessuna gestione propria: ogni bottone è un tab stop (comportamento corretto per un `group`). Il bottone focalizzato viene portato in primo piano (`data-sl-button-group__button--focus`, button.styles.ts:661-664) così il focus ring non è coperto. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Il separatore `::after` (button.styles.ts:638-653) è decorativo (`content: ''`). Contrasti ereditati da `sl-button`. |
| 8 | API pubblica a11y | ⚠️ | Solo `label`; mancano warning dev mode e opzione `role="toolbar"` con roving tabindex. |
| 9 | Documentazione e test | ⚠️ | Test axe presente (test r. 7-15) ✅. La docs chiama "Toolbar Example" un insieme di gruppi senza `role="toolbar"` né frecce, e mostra "Alignment" Left/Center/Right come bottoni semplici senza stato (SL-BUTTON-GROUP-01). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-BUTTON-GROUP-01 | Media | 9/1 Docs | Gli esempi presentano scelte mutuamente esclusive ("Alignment": Left/Center/Right) e toggle (Bold/Italic/Underline) con `sl-button` senza stato selezionato/premuto, e un "Toolbar Example" senza semantica `toolbar` né navigazione con frecce: il consumer copia pattern che non espongono lo stato. | docs/pages/components/button-group.md:8-13, 624-660 | WCAG 4.1.2, 1.3.1; APG Toolbar, APG Radio Group | Per scelte esclusive rimandare a `sl-radio-group` + `sl-radio-button`; per i toggle usare `aria-pressed` (dopo SL-BUTTON-01); rinominare l'esempio o implementare un vero toolbar. |
| SL-BUTTON-GROUP-02 | Media | 8/4 Toolbar | Non esiste una modalità `toolbar` (role="toolbar", roving tabindex, frecce/Home/End): con molti gruppi ogni bottone è un tab stop separato. | src/components/button-group/button-group.component.ts:71-86 | APG Toolbar pattern; WCAG 2.1.1 (efficienza) | Aggiungere un componente `sl-toolbar` (o attributo `toolbar` sul gruppo) con roving tabindex sui `sl-button`/`sl-icon-button` slottati. |
| SL-BUTTON-GROUP-03 | Bassa | 2/1 Nome | `aria-label=${this.label}` senza `ifDefined`: con `label` vuoto si emette `aria-label=""`; con `role="presentation"` (dentro `sl-radio-group`) un `aria-label` valorizzato annulla il ruolo presentazionale (attributo globale) e lascia un generico con nome. Nessun warning se manca il nome. | button-group.component.ts:29, 77-78 | WCAG 4.1.2; ARIA 1.2 Presentational Roles Conflict Resolution | `aria-label=${ifDefined(this.disableRole ? undefined : this.label \|\| undefined)}`; warning in dev se `!disableRole && !label`. |
| SL-BUTTON-GROUP-04 | Bassa | 3 Shadow DOM | Il nome non può essere collegato a un'intestazione visibile del consumer (`aria-labelledby` sull'host non arriva al `<div role="group">` interno) e un `aria-label` sull'host resta su un elemento senza ruolo. | button-group.component.ts:74-78 | WCAG 1.3.1, 4.1.2 | Spostare `role="group"` e `aria-label` sull'host (ElementInternals `internals.role = 'group'`, `internals.ariaLabel`), così anche `aria-labelledby` del light DOM funziona. |
| SL-BUTTON-GROUP-05 | Suggerimento | 9 Docs | La docs non spiega che `label` è il nome del gruppo per gli screen reader né quando usare il gruppo rispetto a un radio-group. | docs/pages/components/button-group.md:1-47 | — (qualità) | Aggiungere una sezione "Accessibilità". |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | Sì | Parziale | Su `<div role="group">` interno ✅; vuoto → `aria-label=""`. |
| `aria-label` / `aria-labelledby` sull'host | No | No | Funzionerebbero spostando il ruolo sull'host. |
| `role` (group/toolbar) | No (fisso `group`) | — | Opzione `toolbar` da valutare (SL-BUTTON-GROUP-02). |
| `aria-orientation` | No | — | Solo se si introduce `toolbar`. |
| warning dev mode | No | — | Da aggiungere. |

### Fix proposti
```ts
// button-group.component.ts
import { ifDefined } from 'lit/directives/if-defined.js';

updated() {
  if (import.meta.env?.DEV !== false && !this.disableRole && !this.label) {
    console.warn('<sl-button-group>: imposta "label" per dare un nome al gruppo.');
  }
}

render() {
  return html`
    <div
      part="base"
      class="button-group"
      role=${this.disableRole ? 'presentation' : 'group'}
      aria-label=${ifDefined(this.disableRole ? undefined : this.label || undefined)}
      @focusout=${this.handleBlur}
      @focusin=${this.handleFocus}
      @mouseover=${this.handleMouseOver}
      @mouseout=${this.handleMouseOut}
    >
      <slot @slotchange=${this.handleSlotChange}></slot>
    </div>
  `;
}
```

### Non verificabile
- Annuncio del nome del gruppo all'ingresso con NVDA/JAWS/VoiceOver (dipende dalla modalità e dal browser).
- Nome dei bottoni icon-only slottati (dipende dal consumer: `<sl-icon label>`).
