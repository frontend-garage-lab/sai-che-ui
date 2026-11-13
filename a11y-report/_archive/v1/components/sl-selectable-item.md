## Selectable Item (`<sl-selectable-item>` – src/components/selectable-item/selectable-item.component.ts)
**Pattern APG di riferimento:** APG Checkbox pattern (checkbox nativo con label); per l'insieme di item: gruppo con nome (`fieldset/legend` o `role="group"` + `aria-labelledby`).
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 1 · Alta 0 · Media 2 · Bassa 1 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Usa `sl-checkbox` (input `type="checkbox"` nativo) invece di ruoli custom (`option`/`aria-selected`) ✅ first rule of ARIA. |
| 2 | Nome, descrizione, stato | ❌ | Il `sl-checkbox` interno (r. 72-79) non ha contenuto nel suo slot: il testo dell'item è in uno `<span>` fratello (r. 81-83) → l'`<input>` non ha nome accessibile ("casella di controllo, non selezionata"). Stato checked/disabled nativi ✅. Meta (data) non associata come descrizione. |
| 3 | Shadow DOM e riferimenti ARIA | ❌ | Il testo label e l'`<input>` sono in shadow root diversi (selectable-item vs checkbox): nessun `aria-labelledby` possibile; l'unica soluzione è inoltrare lo slot dentro il checkbox. |
| 4 | Tastiera e focus | ✅ | Unico tab stop = input nativo; Space alterna ✅; click sulla riga inoltrato a `checkbox.click()` (r. 55-61) solo per il mouse, corretto (la riga non è focusabile, nessun doppio tab stop). Focus ring outline `--sl-focus-ring` sul control (checkbox.styles.ts:81-83) ✅. |
| 5 | Form e validazione | ⚠️ | `value` esposto, ma il checkbox interno non riceve `name`/`value` (non partecipa ai form); nessuna indicazione di raggruppamento per liste di item (consumer). |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ⚠️ | Label neutral-900 su primary-50 14.61/9.28 ✅. Meta `neutral-500`: su bianco 4.71/3.48, su riga selezionata `primary-50` **4.45/2.16**, su hover `neutral-50` **4.46/3.23** ❌ (SHARED-03). Riga min-height 2.75rem ✅ 2.5.8. Label con ellissi (styles r. 46-48) senza alternativa per il testo completo. Stato selezionato anche con spunta (non solo colore) ✅. |
| 8 | API pubblica a11y | ⚠️ | Mancano `label` testuale esplicito e `name`; nessuna property per descrizione. |
| 9 | Documentazione e test | ⚠️ | Test axe presente (test r. 7-16) ma non rileva il checkbox senza nome (assenza di nome confermata dal codice: possibile limite di axe sugli shadow root annidati → da verificare); nessun test di tastiera. Docs: esempio di lista in `<div>` senza gruppo. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-SELECTABLE-ITEM-01 | Blocker | Nome, descrizione, stato | Il checkbox interno non ha nome accessibile: `<sl-checkbox>` è renderizzato senza contenuto e il testo dell'item sta in uno `<span>` fratello, in un altro shadow root. Con SR ogni riga è "casella di controllo non selezionata" senza sapere cosa si seleziona. | src/components/selectable-item/selectable-item.component.ts:72-83 `<sl-checkbox … ></sl-checkbox> <span part="label" class="selectable-item__label"><slot></slot></span>`; src/components/checkbox/checkbox.component.ts:199-250 (nome dell'input = contenuto del `<label>` che avvolge lo slot) | WCAG 4.1.2 Name, Role, Value; 1.3.1; 2.5.3 | Inoltrare lo slot dentro il checkbox: `<sl-checkbox …><slot></slot></sl-checkbox>` (slot forwarding, il nome diventa il testo slottato) mantenendo il layout con `::part(label)`; in alternativa property `label` passata al checkbox. |
| SL-SELECTABLE-ITEM-02 | Media | Aspetti visivi | Testo meta `neutral-500` sotto soglia sugli sfondi di stato: 4.45:1 (selezionato, light), 2.16:1 (selezionato, dark), 4.46/3.23:1 (hover). | src/components/selectable-item/selectable-item.styles.ts:55-61 `color: var(--sl-color-neutral-500);`; :22-28 | WCAG 1.4.3; SHARED-03 | `color: var(--sl-color-neutral-600)` (o `--sl-input-help-text-color`). |
| SL-SELECTABLE-ITEM-03 | Media | Semantica / Docs | Liste di item senza raggruppamento né nome: i docs mostrano item dentro un `<div>` generico, l'utente SR non sa quanti sono né a cosa si riferiscono. La meta non è associata al checkbox (non letta durante la navigazione per controlli). (consumer + componente) | docs/pages/components/selectable-item.md:62-67 `<div class="selectable-item-list" …>`; selectable-item.component.ts:85-87 | WCAG 1.3.1; APG Checkbox (group) | Docs: `<fieldset><legend>Documenti</legend>…` o `role="group" aria-labelledby`; nel componente inoltrare la meta come `slot="help-text"` del checkbox (→ `aria-describedby`). |
| SL-SELECTABLE-ITEM-04 | Bassa | Aspetti visivi | Label troncata con ellissi a una riga (nessun modo di leggere il nome completo a zoom 400%/320 px; dopo il fix 01 lo SR leggerà comunque il testo completo). | src/components/selectable-item/selectable-item.styles.ts:43-48 | WCAG 1.4.10 Reflow | Troncamento opt-in o `title`/tooltip con il testo completo; `white-space: normal` a viewport stretti. |
| SL-SELECTABLE-ITEM-05 | Suggerimento | Test / Form | Test axe non intercetta il checkbox senza nome; nessun test tastiera; il checkbox interno non riceve `name`/`value` (form nativi). | src/components/selectable-item/selectable-item.test.ts:7-16; selectable-item.component.ts:72-79 | Copertura test; WCAG 4.1.2 | Test esplicito: `checkbox.shadowRoot.querySelector('input')` ha nome calcolato = testo dell'item (es. via `getComputedAccessibleName` di Playwright); test Space; inoltrare `value`/`name`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| Testo label (slot default) | Sì | **No** | Non arriva al checkbox (SL-SELECTABLE-ITEM-01) |
| `checked` / `disabled` | Sì | Sì | Passati a `sl-checkbox` nativo |
| `value` / `name` | `value` sì, `name` no | No | Non inoltrati al checkbox |
| Descrizione (meta) | Slot `meta` | No | Non associata (`aria-describedby`) |
| `aria-label` sull'host | No | No | Host senza ruolo: ignorato |

### Fix proposti
```ts
render() {
  return html`
    <div part="base" class="selectable-item…" @click=${this.handleRowClick}>
      <sl-checkbox part="checkbox" exportparts="base:checkbox__base,label:label"
        class="selectable-item__checkbox"
        value=${this.value} ?checked=${this.checked} ?disabled=${this.disabled}
        @sl-change=${this.handleCheckboxChange}>
        <span class="selectable-item__label"><slot></slot></span>
        <span slot="help-text" class="selectable-item__meta"><slot name="meta"></slot></span>
      </sl-checkbox>
    </div>`;
}
```
```css
.selectable-item__checkbox { flex: 1 1 auto; min-width: 0; }
.selectable-item__meta { color: var(--sl-color-neutral-600); }
```
(Se si vuole mantenere la meta allineata a destra nella stessa riga, posizionarla con `::part()` del checkbox; l'importante è che label e meta finiscano negli slot del checkbox.)

### Non verificabile
- Motivo per cui il test axe passa nonostante il checkbox senza nome (attraversamento degli shadow root annidati in chai-a11y-axe): verificare con l'ispettore di accessibilità del browser / `getComputedAccessibleName`.
- Lettura SR dopo lo slot forwarding (nome = testo slottato due livelli): test con NVDA/VoiceOver.
