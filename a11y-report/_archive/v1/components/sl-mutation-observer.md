## Mutation Observer (`<sl-mutation-observer>` – src/components/mutation-observer/mutation-observer.component.ts)
**Pattern APG di riferimento:** N/A (utility non visuale, wrapper di `MutationObserver`)
**Esito sintetico:** ✅ Conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 0 · Suggerimento 1

Componente puramente tecnico. Host con `display: contents` (styles r. 4-6), senza ruolo né contenuto proprio, con un solo `<slot>` (r. 112-114). Non entra nell'albero di accessibilità e non altera la semantica dei figli. Emette solo eventi (`sl-mutation`, r. 60-64), quindi non ha impatto diretto sull'a11y.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Nessun ruolo. `display: contents` è innocuo perché l'host non ha semantica (i bug noti di `display: contents` riguardano elementi con ruolo, es. `<button>`). |
| 2 | Nome, descrizione, stato | N/A | — |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Contenuto in light DOM, riferimenti ID preservati. Un `role`/`aria-*` messo dal consumer sull'host verrebbe perso con `display: contents` in alcuni browser (uso scorretto, consumer). |
| 4 | Tastiera e focus | N/A | Nessun elemento focusabile proprio. |
| 5 | Form e validazione | N/A | L'attributo `disabled` (r. 43) disattiva solo l'osservazione: non ha semantica ARIA su un elemento senza ruolo. |
| 6 | Live region | N/A | Gli annunci per i cambiamenti osservati restano a carico del consumer. |
| 7 | Aspetti visivi | N/A | Nessuna resa visiva. |
| 8 | API pubblica a11y | N/A | Nessuna API ARIA necessaria. |
| 9 | Documentazione e test | ⚠️ | Il test verifica solo il render (test r. 5-9), senza axe (SL-MUTATION-OBSERVER-01). Nota non a11y: i `@watch` alle r. 103-105 usano nomi di attributo (`'attr-old-value'`, `'char-data'`, `'char-data-old-value'`) invece dei nomi di property, quindi i cambi a runtime di queste opzioni non riavviano l'observer. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-MUTATION-OBSERVER-01 | Suggerimento | 9 | Nessun test axe che confermi che il wrapper `display: contents` non introduce violazioni attorno al contenuto slottato. | src/components/mutation-observer/mutation-observer.test.ts:5-9 | Buona pratica | Aggiungere `await expect(el).to.be.accessible()` con un figlio (es. `sl-button`). |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| — | — | — | Utility non visuale: nessuna API ARIA necessaria. Non mettere `role`/`aria-*` sull'host. |

### Fix proposti
```ts
it('passes accessibility test', async () => {
  const el = await fixture(html`<sl-mutation-observer attr="variant"><sl-button>Ok</sl-button></sl-mutation-observer>`);
  await expect(el).to.be.accessible();
});
```

### Non verificabile
- Nessun aspetto rilevante. Come il consumer reagisce a `sl-mutation` (es. annunci) è fuori dal perimetro del componente.
