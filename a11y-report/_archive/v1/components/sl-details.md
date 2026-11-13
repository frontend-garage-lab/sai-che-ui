## Details (`sl-details` – src/components/details/details.component.ts)
**Pattern APG di riferimento:** Disclosure (Show/Hide) — https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ ; Accordion (uso raggruppato) — https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 5 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ⚠️ | Base nativa `<details>/<summary>` ✅ (find-in-page apre il pannello: `MutationObserver` su `open`, r. 78-89). `role="button"` sul `<summary>` (ridondante ma accettabile); `role="region"` su ogni corpo (SL-DETAILS-02); nessuna semantica di heading (SL-DETAILS-06). |
| 2 | Nome, descrizione, stato | ⚠️ | Nome dal `summary`/slot `summary` ✅; `aria-expanded` sincronizzato (r. 206) ✅; `aria-disabled` ✅; icone `sl-icon` senza label → `aria-hidden` automatico ✅. Nessun warning se il summary è vuoto (SL-DETAILS-04). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-controls` e `aria-labelledby` nello stesso shadow root ✅, ma `aria-controls="content"` punta a uno `<slot>` (`display: contents`, nessun nodo AX) (SL-DETAILS-01). Il region è etichettato dal summary (`aria-labelledby="header"`) ✅. |
| 4 | Tastiera e focus | ⚠️ | Tab raggiunge il summary; Enter/Space alternano (r. 111-119) ✅; focus visibile `--sl-focus-ring` 6.21:1 ✅; disabled fuori dal tab order (`tabindex="-1"`). Frecce intercettate con `preventDefault` (SL-DETAILS-03). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Stato via `aria-expanded`. |
| 7 | Aspetti visivi | ✅ | Testo header `neutral-900` su `--sl-surface-panel` ✅; target header ≥ 24px (padding 12px + testo) ✅; outline del focus resta in forced colors ✅; animazione corpo via `animateTo` (reduced motion ✅); rotazione icona con `transition` CSS non disattivata (SHARED-05). Disabled `opacity: .5` (esente). |
| 8 | API pubblica a11y | ⚠️ | `summary`, `disabled`, `open` ✅; nessuna opzione per disattivare `role="region"` o impostare un livello heading. |
| 9 | Documentazione e test | ⚠️ | Test axe aperto/chiuso ✅ (r. 11-21); nessun test di tastiera né di `aria-expanded` (SL-DETAILS-05). Docs senza sezione a11y; esempio "Grouping" (accordion) senza heading. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-DETAILS-01 | Bassa | 3 | `aria-controls="content"` referenzia lo `<slot id="content">`, che ha `display: contents`/`block` ma non è un nodo dell'albero di accessibilità affidabile: la relazione controlla un elemento non esposto. | src/components/details/details.component.ts:207 `aria-controls="content"`; :226 `<slot part="content" id="content" …>` | WCAG 4.1.2 / 1.3.1; APG Disclosure (aria-controls) | Spostare `id="content"` sul `<div class="details__body" role="region">` (r. 225). |
| SL-DETAILS-02 | Bassa | 1 | Ogni `sl-details` crea un landmark `region` (con nome): con molti details (FAQ, form lunghi) la lista dei landmark si riempie; non c'è modo di disattivarlo. | details.component.ts:225 `role="region" aria-labelledby="header"` | APG Accordion (evitare region con molti pannelli); WCAG 1.3.1 | Property `no-region` (o region solo su opt-in) che rimuove `role`/`aria-labelledby`. |
| SL-DETAILS-03 | Bassa | 4 | Frecce su/sinistra chiudono e giù/destra aprono, sempre con `preventDefault()`: con il focus sul summary l'utente non può scorrere la pagina con le frecce; comportamento non previsto per un button di disclosure; non invertito in RTL. | details.component.ts:121-129 | APG Disclosure (solo Enter/Space); WCAG 2.1.1 (coerenza) | Rimuovere la gestione delle frecce o limitarla a un gruppo accordion esplicito; in RTL invertire sinistra/destra. |
| SL-DETAILS-04 | Bassa | 2 | Se `summary` è vuoto e lo slot `summary` non è valorizzato, il `role="button"` resta senza nome; nessun warning in dev. | details.component.ts:67, 213 | WCAG 4.1.2 | Warning in dev se `!this.summary && !this.querySelector('[slot="summary"]')`. |
| SL-DETAILS-05 | Bassa | 9 | Nessun test di tastiera (Enter/Space/frecce) né asserzioni su `aria-expanded`/`aria-controls`/disabled; docs senza sezione accessibilità. | src/components/details/details.test.ts:24-199 | Qualità | Aggiungere test con `sendKeys` e asserzioni ARIA. |
| SL-DETAILS-06 | Suggerimento | 1 | Il summary non è dentro un heading: in uso accordion (esempio "Grouping Details") gli utenti SR non possono navigare per titoli; `role="button"` sovrascrive la semantica nativa del `<summary>`. | details.component.ts:201-212; docs/pages/components/details.md:160-185 | APG Accordion (button dentro heading); WCAG 1.3.1 (buona pratica) | Property `heading-level` che avvolge il contenuto del summary in `role="heading" aria-level=N`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `summary` / slot `summary` | Sì | Sì (nome del button e del region) | Warning se vuoto |
| `open` → `aria-expanded` | Sì | Sì | — |
| `disabled` → `aria-disabled` + `tabindex="-1"` | Sì | Sì | — |
| `aria-controls` | Interno | No (punta a uno slot) | SL-DETAILS-01 |
| `heading-level` | No | — | Suggerito |
| `no-region` | No | — | Suggerito |

### Fix proposti
```ts
@property({ attribute: 'heading-level', type: Number }) headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
@property({ attribute: 'no-region', type: Boolean }) noRegion = false;

// render()
<summary part="header" id="header" class="details__header" role="button"
  aria-expanded=${this.open ? 'true' : 'false'}
  aria-controls="content"
  aria-disabled=${this.disabled ? 'true' : 'false'}
  tabindex=${this.disabled ? '-1' : '0'}
  @click=${this.handleSummaryClick} @keydown=${this.handleSummaryKeyDown}>
  <span role=${ifDefined(this.headingLevel ? 'heading' : undefined)}
        aria-level=${ifDefined(this.headingLevel)} class="details__summary">
    <slot name="summary" part="summary">${this.summary}</slot>
  </span>
  …
</summary>
<div id="content" class="details__body"
  role=${ifDefined(this.noRegion ? undefined : 'region')}
  aria-labelledby=${ifDefined(this.noRegion ? undefined : 'header')}>
  <slot part="content" class="details__content"></slot>
</div>
```
```ts
private handleSummaryKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.open ? this.hide() : this.show();
  }
  // frecce rimosse: comportamento non previsto dal pattern Disclosure
}
```
Nota: un `role="heading"` dentro un `role="button"` ha figli presentazionali nel button; per avere sia heading sia button la soluzione robusta è heading esterno con button interno (richiede di non usare `<summary>` come button o di accettare la semantica nativa).

### Non verificabile
- Annuncio di `aria-expanded` su `<summary role="button">` in Safari/VoiceOver (storicamente con differenze sul `<details>` nativo).
- Ricerca nella pagina (find-in-page) che apre il pannello chiuso: comportamento dipendente dal browser.
