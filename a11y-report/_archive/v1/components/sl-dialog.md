## Dialog (`sl-dialog` – src/components/dialog/dialog.component.ts)
**Pattern APG di riferimento:** Dialog (Modal) — https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ (Alert Dialog per varianti `warning`/`danger`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 4 · Bassa 6 · Suggerimento 2

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | `role="dialog"` + `aria-modal="true"` sul pannello (r. 303-304) invece di `<dialog>` nativo con `showModal()`: il resto della pagina non è reso inerte (SL-DIALOG-01). Varianti `warning/danger` senza opzione `alertdialog` (SL-DIALOG-05). `<header>`/`<footer>` interni potenzialmente esposti come landmark (SL-DIALOG-07). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome via `aria-labelledby="title"` (stesso shadow root ✅) o `aria-label` con `no-header`. Se `label` vuota il nome è U+FEFF / `aria-label=""` senza warning (SL-DIALOG-03). Nessun `aria-describedby` (SL-DIALOG-05). Icona di stato `aria-hidden` ✅ ma la variante non è comunicata a AT. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-labelledby="title"` e `id="title"` nello stesso shadow root; contenuto slot `label` incluso nel nome (flattened tree). `aria-*` del consumer sull'host (`display: contents`) non arrivano al pannello: nessun passthrough per descrizione (SL-DIALOG-05). |
| 4 | Tastiera e focus | ⚠️ | Focus iniziale su pannello o `[autofocus]` + evento `sl-initial-focus` ✅; trap Tab/Shift+Tab (modal.ts r. 81-146) ✅; Esc via `CloseWatcher`/keydown (r. 151-175) ✅; ritorno al trigger (r. 260-264) ✅. Corpo scrollabile con `tabindex="-1"` non scorribile da tastiera se privo di elementi focusabili (SL-DIALOG-02). |
| 5 | Form e validazione | N/A | Contenitore; i controlli sono del consumer. |
| 6 | Live region | N/A | Il dialog è annunciato tramite spostamento del focus, non serve live region. |
| 7 | Aspetti visivi | ⚠️ | Titolo `neutral-900` su panel ✅; close button 16px+2×8px = 32px ✅ 2.5.8; focus ring dell'icon-button `--sl-focus-ring` 6.21:1 ✅; `forced-colors` con bordo pannello ✅; animazioni JS rispettano `prefers-reduced-motion` (animate.ts) ✅. Titolo troncato con ellipsis (SL-DIALOG-08). |
| 8 | API pubblica a11y | ⚠️ | `label`/slot `label` ✅, close label localizzato (`localize.term('close')`) ma non sovrascrivibile (SL-DIALOG-06, SHARED-06); mancano `aria-describedby`/`description`, `role`/`alertdialog`, livello heading. |
| 9 | Documentazione e test | ⚠️ | Nessun test axe, nessun test di ritorno del focus; esempi docs con `sl-icon-button` e `sl-input` senza nome (SL-DIALOG-09, SL-DIALOG-10). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-DIALOG-01 | Media | 1/4 | Il resto della pagina non è reso inerte: niente `<dialog>.showModal()`, niente `inert`/`aria-hidden` sui fratelli. L'isolamento per AT dipende solo da `aria-modal` (supporto non uniforme col cursore virtuale) e il trap intercetta solo Tab/`focusin`. | src/components/dialog/dialog.component.ts:300-305 `role="dialog" aria-modal="true"`; src/internal/modal.ts:21-26 (solo listener `focusin`/`keydown`) | WCAG 1.3.2, 2.4.3; APG Dialog (Modal) | Usare `<dialog>` nativo con `showModal()` (top layer + inert automatico) oppure impostare `inert` sui fratelli dell'host a livello di `document.body` durante l'apertura. |
| SL-DIALOG-02 | Media | 4 | Il corpo è scrollabile (`overflow: auto`) ma ha `tabindex="-1"`: con contenuto lungo e senza elementi focusabili non si può scorrere da tastiera (il focus è sul pannello, che non è il contenitore scrollabile). `tabbable.ts` esclude esplicitamente `tabindex<=-1`. | dialog.component.ts:342 `<div part="body" class="dialog__body" tabindex="-1">`; dialog.styles.ts:111-117; src/internal/tabbable.ts:68 | WCAG 2.1.1 | Rendere il body focusabile (`tabindex="0"`, `role="region"`, `aria-labelledby="title"`) solo quando `scrollHeight > clientHeight` (ResizeObserver) oppure mettere `overflow` sul pannello. |
| SL-DIALOG-03 | Media | 2/8 | Nome accessibile vuoto non segnalato: con `label=""` e slot vuoto `aria-labelledby` punta a un `<h2>` che contiene solo U+FEFF; con `no-header` e senza label viene renderizzato `aria-label=""` (`ifDefined` filtra solo `undefined`). Nessun warning in dev. | dialog.component.ts:306 `aria-label=${ifDefined(this.noHeader ? this.label : undefined)}`; :322 `String.fromCharCode(65279)` | WCAG 4.1.2; APG Dialog (nome obbligatorio) | `ifDefined(this.noHeader && this.label ? this.label : undefined)` + `console.warn` in dev se manca sia `label` sia lo slot `label`. |
| SL-DIALOG-04 | Media | 9 | Nessun test axe (`to.be.accessible()`) né test sul ritorno del focus al trigger, su `aria-modal`/nome, su `no-header`. | src/components/dialog/dialog.test.ts (nessuna occorrenza di `accessible`); test presenti: Esc r. 139, trap r. 152 | Qualità / WCAG 4.1.2 | Aggiungere test axe a dialog aperto (con e senza header), test `document.activeElement === trigger` dopo `sl-after-hide`. |
| SL-DIALOG-05 | Bassa | 1/2 | Varianti `warning`/`danger` (conferme distruttive) comunicate solo da icona `aria-hidden` e colore; nessuna opzione `alertdialog`, nessun `aria-describedby` verso il messaggio. | dialog.component.ts:117, 303, 313-319 `aria-hidden="true"` | WCAG 1.3.1; APG Alert Dialog | Property `role: 'dialog' \| 'alertdialog'` (default `alertdialog` per `danger`?) e `aria-describedby="body"` opzionale (es. attributo `describe-body`); testo visivamente nascosto con lo stato localizzato. |
| SL-DIALOG-06 | Bassa | 8 | Etichetta del close button localizzata ma non sovrascrivibile per istanza (es. "Chiudi finestra Modifica offerta"). | dialog.component.ts:331 `label=${this.localize.term('close')}` | WCAG 2.4.6; SHARED-06 | Property `close-label` con fallback a `localize.term('close')`. |
| SL-DIALOG-07 | Bassa | 1 | `<header>` e `<footer>` nel shadow root non sono discendenti di elementi sezionanti: alcuni browser possono esporli come landmark `banner`/`contentinfo` aggiuntivi dentro ogni dialog. | dialog.component.ts:312 `<header part="header">`, :344 `<footer part="footer">` | WCAG 1.3.1 (ARIA landmarks) | Usare `<div>` per header/footer (sono solo layout) oppure `role="presentation"`/`role="group"`. |
| SL-DIALOG-08 | Bassa | 7 | Il titolo è troncato su una riga (`white-space: nowrap; text-overflow: ellipsis`): con zoom 200%/reflow 320px il testo del titolo non è leggibile per intero. | dialog.styles.ts:89-91 | WCAG 1.4.10, 1.4.4 | Consentire il wrap (`white-space: normal; overflow-wrap: anywhere`) o renderlo opzionale. |
| SL-DIALOG-09 | Bassa | 9 | Esempi docs con `sl-icon-button` icon-only senza `label` nello slot `header-actions` (anche Angular). | docs/pages/components/dialog.md:328, 389 `<sl-icon-button ... name="box-arrow-up-right">` | WCAG 4.1.2 (esempio) | Aggiungere `label="Apri in una nuova finestra"`. |
| SL-DIALOG-10 | Bassa | 9 | Esempio "Customizing Initial Focus" usa `sl-input` con solo `placeholder` come etichetta; nessuna sezione Accessibility (nome obbligatorio, `no-header`, ritorno focus). | docs/pages/components/dialog.md:512, 541, 565 | WCAG 3.3.2 (esempio) | Aggiungere `label` all'input e una sezione "Accessibilità". |
| SL-DIALOG-11 | Suggerimento | 1 | `aria-hidden` alternato `"true"/"false"` sul pannello è ridondante (il contenitore usa già `hidden`); `aria-hidden="false"` è sconsigliato. | dialog.component.ts:305 | ARIA 1.2 (aria-hidden) | Rimuovere l'attributo; affidarsi a `hidden`. |
| SL-DIALOG-12 | Suggerimento | 1 | Livello heading del titolo fisso a `<h2>`, non adattabile alla gerarchia della pagina. | dialog.component.ts:321 | WCAG 1.3.1 (buona pratica) | Property `heading-level` (1-6) con `role="heading" aria-level`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` / slot `label` | Sì | Sì (`aria-labelledby="title"` o `aria-label` con `no-header`) | Evitare `aria-label=""` (SL-DIALOG-03) |
| `aria-label` sull'host | No | No (host `display: contents`, nessun ruolo) | Usare `label` |
| `aria-describedby` / `description` | No | — | Da aggiungere (SL-DIALOG-05) |
| `role` (`dialog`/`alertdialog`) | No | — | Da aggiungere |
| `close-label` | No | Default `localize.term('close')` ✅ | Da aggiungere (SL-DIALOG-06) |
| `aria-modal` | Interno fisso `true` | Sì | — |
| Focus iniziale (`autofocus`, `sl-initial-focus`) | Sì | Sì | — |
| `heading-level` | No | — | Suggerito |

### Fix proposti
```ts
@property({ attribute: 'close-label' }) closeLabel?: string;
@property({ attribute: 'dialog-role' }) dialogRole: 'dialog' | 'alertdialog' = 'dialog';
@property({ attribute: 'describe-body', type: Boolean }) describeBody = false;

updated() {
  if (!this.label && !this.querySelector('[slot="label"]')) {
    console.warn('<sl-dialog>: manca un nome accessibile. Imposta "label" (anche con no-header).');
  }
}

// render()
<div part="panel" class="dialog__panel"
  role=${this.dialogRole}
  aria-modal="true"
  aria-label=${ifDefined(this.noHeader && this.label ? this.label : undefined)}
  aria-labelledby=${ifDefined(!this.noHeader ? 'title' : undefined)}
  aria-describedby=${ifDefined(this.describeBody ? 'body' : undefined)}
  tabindex="-1">
  <div part="header" class="dialog__header">…
    <sl-icon-button … label=${this.closeLabel || this.localize.term('close')}></sl-icon-button>
  </div>
  <div part="body" id="body" class="dialog__body"
    tabindex=${this.bodyScrollable ? '0' : '-1'}
    role=${ifDefined(this.bodyScrollable ? 'region' : undefined)}
    aria-labelledby=${ifDefined(this.bodyScrollable ? 'title' : undefined)}><slot></slot></div>
  <div part="footer" class="dialog__footer"><slot name="footer"></slot></div>
</div>
```
```ts
// Inert del resto della pagina (alternativa a <dialog>.showModal())
private inerted: Element[] = [];
private setBackgroundInert(on: boolean) {
  if (on) {
    let node: Element | null = this;
    while (node && node !== document.body) {
      const parent: Element | null = node.parentElement;
      [...(parent?.children ?? [])].forEach(sib => {
        if (sib !== node && !sib.hasAttribute('inert')) { sib.setAttribute('inert', ''); this.inerted.push(sib); }
      });
      node = parent;
    }
  } else {
    this.inerted.forEach(el => el.removeAttribute('inert'));
    this.inerted = [];
  }
}
```
```css
.dialog__title { white-space: normal; overflow-wrap: anywhere; }
```

### Non verificabile
- Rispetto di `aria-modal` da parte di NVDA/JAWS/VoiceOver/TalkBack in modalità lettura (possibilità di uscire dal dialog col cursore virtuale): test manuale.
- Esposizione effettiva di `<header>`/`<footer>` shadow come landmark nei diversi browser (albero AX Chrome/Safari).
- Annuncio del nome quando il focus va sul pannello (`tabindex="-1"`) vs su `[autofocus]`.
- Contrasto di contenuti/bottoni nel footer su `--sl-surface-sunken`: dipende dal contenuto del consumer.
