## Visually Hidden (`<sl-visually-hidden>` – src/components/visually-hidden/visually-hidden.component.ts)
**Pattern APG di riferimento:** Tecnica "visually hidden / sr-only" (WCAG technique C7); skip link (WCAG G1)
**Esito sintetico:** ⚠️ Parzialmente conforme — nessun difetto rilevato nel codice; restano verifiche "NON VERIFICABILE" (vedi sezione dedicata), quindi non dichiarabile conforme finché non sono eseguite.
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 1 · Suggerimento 1

La tecnica CSS è quella raccomandata: 1px, `clip` + `clip-path: inset(50%)`, `overflow: hidden`, `white-space: nowrap`, `position: absolute`, tutto con `!important`. Non usa `display:none` né `visibility:hidden`, quindi il contenuto resta nell'albero di accessibilità. Con `:host(:not(:focus-within))` il contenuto torna visibile quando un discendente riceve il focus (WCAG 2.4.7). I finding riguardano solo docs e test.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Host senza ruolo, solo `<slot>` (component r. 18-20): la semantica del contenuto slottato resta intatta. |
| 2 | Nome, descrizione, stato | ✅ | Il testo slottato contribuisce al nome del controllo che lo contiene (es. `<a>`: "opens in a new window"). `HasSlotController` lo ignora nel default slot (shared §1), quindi non altera la logica "has label" degli altri componenti. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Il contenuto resta in light DOM: gli ID usati da `aria-labelledby`/`aria-describedby` esterni restano referenziabili. |
| 4 | Tastiera e focus | ✅ | styles r. 4: `:host(:not(:focus-within))` rimuove tutto il clipping quando il focus è dentro, così il contenuto focusabile diventa visibile. Il test usa `a.focus()` (test r. 28-29), non Tab reale. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Il componente non annuncia nulla; una live region slottata dal consumer resta funzionante perché non è `display:none`. |
| 7 | Aspetti visivi | ✅ | Allo sblocco il contenuto prende gli stili del consumer (contrasto e focus ring a suo carico). Non resetta `margin` (tecnica classica `margin:-1px`): trascurabile. N/A per motion e forced-colors. |
| 8 | API pubblica a11y | N/A | Utility: nessuna property necessaria. |
| 9 | Documentazione e test | ⚠️ | Le docs spiegano bene il comportamento al focus (md r. 10). L'esempio "Content Conveyed By Context" usa testo nascosto non strutturato (SL-VISUALLY-HIDDEN-01). Nessun test axe (SL-VISUALLY-HIDDEN-02). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-VISUALLY-HIDDEN-01 | Bassa | 9 | Esempio docs: il testo "Personal Info" è nascosto dentro `<header>` di `sl-card` ma non è un'intestazione né il nome del gruppo di campi. Viene solo letto in sequenza, non è navigabile per heading e non dà nome al gruppo. Gli adottanti copiano il pattern (consumer). | docs/pages/components/visually-hidden.md:39-45 `<header><sl-visually-hidden>Personal Info</sl-visually-hidden></header>` | WCAG 1.3.1, 2.4.6 | Nell'esempio usare `<sl-visually-hidden><h2 id="pi">Personal Info</h2></sl-visually-hidden>` e un contenitore `role="group" aria-labelledby="pi"`. |
| SL-VISUALLY-HIDDEN-02 | Suggerimento | 9 | Manca un test axe. Il test sul focus usa `focus()` programmatico, non la navigazione con Tab. | src/components/visually-hidden/visually-hidden.test.ts:5-37 | Buona pratica | Aggiungere `await expect(el).to.be.accessible()` e un test con `sendKeys({ press: 'Tab' })`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| — | — | — | Utility senza API ARIA: nessuna necessaria. |

### Fix proposti
```html
<!-- docs: esempio "Content Conveyed By Context" -->
<sl-card role="group" aria-labelledby="personal-info">
  <sl-visually-hidden slot="header"><h2 id="personal-info">Personal Info</h2></sl-visually-hidden>
  <sl-input label="Name"></sl-input>
  <sl-input label="Email" type="email"></sl-input>
</sl-card>
```
```ts
// visually-hidden.test.ts
it('passes accessibility test', async () => {
  const el = await fixture(html`<sl-visually-hidden><a href="#">Skip</a></sl-visually-hidden>`);
  await expect(el).to.be.accessible();
});
```

### Non verificabile
- Lettura con screen reader del testo clippato (tecnica consolidata, ma conviene una prova manuale su VoiceOver iOS, che in alcuni casi divide il testo in più nodi).
- Contrasto e focus ring del contenuto mostrato al focus: dipendono dagli stili del consumer.
