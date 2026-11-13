## Include (`<sl-include>` – src/components/include/include.component.ts)
**Pattern APG di riferimento:** N/A (utility di inclusione HTML); WCAG 2.4.3 Focus Order, 4.1.3 Status Messages
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 2 · Suggerimento 2

Il contenuto remoto viene scritto in light DOM con `this.innerHTML = file.html` (r. 61) e mostrato da un `<slot>` (r. 74): la semantica e gli ID dell'HTML incluso restano intatti e referenziabili. L'accessibilità del contenuto incluso (heading, landmark, alt…) resta a carico del consumer. I limiti del componente riguardano il ciclo di vita: nessuno stato busy durante il caricamento, focus perso quando `src` cambia, errore comunicato solo tramite evento.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Host `display: block` senza ruolo (styles r. 4-6), solo `<slot>`. L'HTML incluso mantiene la propria semantica (consumer). |
| 2 | Nome, descrizione, stato | ⚠️ | Durante il fetch nessun `aria-busy` (SL-INCLUDE-03). Nessun nome proprio necessario. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Il contenuto è in light DOM, quindi `aria-labelledby`/`for` tra l'HTML incluso e la pagina funzionano. Attenzione agli ID duplicati se lo stesso include compare più volte (consumer). |
| 4 | Tastiera e focus | ⚠️ | Se il focus è dentro l'include quando `src` cambia, `innerHTML` distrugge l'elemento focusato e il focus finisce sul `<body>` (SL-INCLUDE-01). Gli script inclusi (`allow-scripts`, r. 63-65) possono spostare il focus: dipende dal consumer. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ⚠️ | Né caricamento né errore vengono comunicati alle AT: c'è solo `sl-error` con `status` (r. 57, 69). Nessun contenuto di fallback (SL-INCLUDE-02). Annunciare il contenuto caricato è giustamente lasciato al consumer, perché una live region di default sarebbe invasiva. |
| 7 | Aspetti visivi | N/A | Nessuno stile visivo proprio. |
| 8 | API pubblica a11y | ⚠️ | Nessuna API per busy o errore. `allowScripts` è `false` di default ✅ (sicurezza). |
| 9 | Documentazione e test | ⚠️ | I test coprono solo load ed error, senza axe e senza focus (SL-INCLUDE-04). Le docs non dicono nulla su a11y e focus. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-INCLUDE-01 | Bassa | 4 | Quando `src` cambia, `innerHTML` sostituisce tutto il contenuto: se il focus era su un elemento incluso (es. un link "pagina successiva" che cambia `src`), il focus viene perso e finisce sul `<body>`. Chi usa tastiera o screen reader perde il punto di lettura. | src/components/include/include.component.ts:61 `this.innerHTML = file.html;` | WCAG 2.4.3 | Prima della sostituzione, se `this.contains(document.activeElement)`, salvare lo stato e dopo `sl-load` spostare il focus sul primo heading o sull'host (`tabindex="-1"`). In alternativa documentare che il consumer deve gestirlo in `sl-load`. |
| SL-INCLUDE-02 | Bassa | 6 | Un errore di caricamento viene comunicato solo con l'evento `sl-error`: il contenuto resta vuoto (o quello precedente) senza alcun messaggio visibile o annunciato. Se il consumer non gestisce l'evento, l'utente non sa che manca del contenuto. | include.component.ts:56-58 `this.emit('sl-error', ...); return;` e :68-70 | WCAG 4.1.3 (consumer), 3.3.1 buona pratica | Esempio docs con un messaggio `role="alert"` in `sl-error`, oppure slot `error` di fallback. |
| SL-INCLUDE-03 | Suggerimento | 2 / 6 | Durante il fetch l'host non espone `aria-busy="true"`, quindi le AT possono leggere un contenuto parziale o vecchio mentre viene sostituito. | include.component.ts:45-71 (nessun `aria-busy`) | WAI-ARIA 1.2 `aria-busy` | `this.setAttribute('aria-busy','true')` all'inizio di `handleSrcChange` e rimozione in `finally`. |
| SL-INCLUDE-04 | Suggerimento | 9 | Nessun test axe sul contenuto incluso e nessun test sul comportamento del focus. Le docs non parlano delle responsabilità a11y del contenuto incluso (heading, ID unici, landmark). | src/components/include/include.test.ts:30-67; docs/pages/components/include.md:10 | Buona pratica | Aggiungere `to.be.accessible()` dopo `sl-load` e una nota a11y nelle docs. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `aria-busy` (gestito internamente) | No | — | Da impostare sull'host durante il fetch. |
| Slot/contenuto di errore | No | — | Valutare uno slot `error` o documentare il pattern con `role="alert"`. |
| ARIA del contenuto | Consumer | Sì (light DOM) | Nessuna property necessaria. |

### Fix proposti
```ts
@watch('src')
async handleSrcChange() {
  const hadFocus = this.contains(document.activeElement);
  this.setAttribute('aria-busy', 'true');
  try {
    const src = this.src;
    const file = await requestInclude(src, this.mode);
    if (src !== this.src) return;
    if (!file.ok) { this.emit('sl-error', { detail: { status: file.status } }); return; }

    this.innerHTML = file.html;
    if (this.allowScripts) [...this.querySelectorAll('script')].forEach(s => this.executeScript(s));

    if (hadFocus) {
      const target = this.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6') ?? this;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus();
    }
    this.emit('sl-load');
  } catch {
    this.emit('sl-error', { detail: { status: -1 } });
  } finally {
    this.removeAttribute('aria-busy');
  }
}
```

### Non verificabile
- Accessibilità dell'HTML remoto (struttura, alt, contrasto, ID duplicati): dipende dal file incluso.
- Effetti degli script inclusi con `allow-scripts` (spostamenti del focus, live region, trap).
