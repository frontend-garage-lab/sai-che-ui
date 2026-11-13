## Copy Button (`sl-copy-button` – src/components/copy-button/copy-button.component.ts)
**Pattern APG di riferimento:** APG Button pattern · WAI-ARIA `status` (live region per il feedback "Copiato") · APG Tooltip pattern
**Esito sintetico:** ❌ Non conforme
**Conteggio finding:** Blocker 1 · Alta 1 · Media 1 · Bassa 3 · Suggerimento 0

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<button type="button">` nativo (r. 274-283). |
| 2 | Nome, descrizione, stato | ❌ | Il `<button>` **non ha nome accessibile**: nessun `aria-label`, icone di sistema senza `label` (quindi `aria-hidden`, r. 285-291). Il nome "Copia" esiste solo come contenuto del tooltip, che viene creato in modo lazy al primo hover/focus (r. 114-153, 296-298). Il test axe ignora esplicitamente `button-name`. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il tooltip non collega `aria-describedby` al bottone (lo slot `aria-describedby="tooltip"` in tooltip.component.ts:283 non viene esposto); `aria-label` sull'host non propagato (SHARED §2). |
| 4 | Tastiera e focus | ✅ | Enter/Space nativi; `:focus-visible` con `--sl-focus-ring` (styles r. 35-38); focus ripristinato dopo la ricreazione del bottone (r. 137-145). Disabled nativo (fuori dal tab order). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ❌ | Il feedback "Copiato"/"Errore" è annunciato solo se il tooltip è aperto: il `role="tooltip"` ha `aria-live` che passa da `off` a `polite` nello stesso momento in cui si apre (tooltip.component.ts:286); dopo `feedback-duration` (1000 ms) il contenuto torna a "Copia" e viene riannunciato. Nessuna live region stabile nel componente. |
| 7 | Aspetti visivi | ⚠️ | Successo/errore distinti da forma (check / x-lg) e colore (success-600 4.60, danger-600 4.61 su bianco) ✅. Target ≥ 1em + 16px ✅. Animazioni `copy.in/out` con `Element.animate()` diretto che ignora `prefers-reduced-motion` (SL-COPY-BUTTON-04). |
| 8 | API pubblica a11y | ⚠️ | `copy-label`, `success-label`, `error-label` con default localizzati (`copy`, `copied`, `error`, r. 228-230, 272) ✅ (SHARED-06 rispettato), ma non vengono usati come nome del bottone. |
| 9 | Documentazione e test | ❌ | Test axe con `ignoredRules = ['button-name']` (test r. 5-6, 18-19): il difetto è noto e mascherato. Docs: nessuna nota a11y. |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-COPY-BUTTON-01 | Blocker | 2 Nome | Il bottone interno non ha nome accessibile: niente `aria-label`, icone senza `label` (decorative). Navigando per elementi/rotore o con la modalità di lettura lo screen reader annuncia solo "pulsante". Il nome passa esclusivamente dal live region del tooltip, che esiste solo dopo il primo hover/focus. Il test axe ignora la regola `button-name`. | src/components/copy-button/copy-button.component.ts:274-293 (nessun `aria-label`); 285 `<sl-icon library="system" name="copy">`; copy-button.test.ts:5-6 `const ignoredRules = ['button-name']` | WCAG 4.1.2, 2.4.6, 1.1.1; APG Button | `aria-label=${copyLabel}` sul `<button>` (localizzato, sovrascrivibile da `copy-label`); rimuovere `ignoredRules` dal test. |
| SL-COPY-BUTTON-02 | Alta | 6 Live region | Il feedback dell'esito non è affidabile: dipende da un tooltip aperto il cui `aria-live` diventa `polite` contestualmente all'apertura; con il tooltip chiuso (Esc, `disabled`, tocco su mobile) "Copiato"/"Errore" non viene annunciato. Dopo 1 s il ritorno a "Copia" genera un secondo annuncio. Lo stato di errore è trasmesso solo da icona e colore. | copy-button.component.ts:235-237, 258-260; src/components/tooltip/tooltip.component.ts:286 `aria-live=${this.open ? 'polite' : 'off'}` | WCAG 4.1.3, 1.3.1 | Live region dedicata sempre presente nel shadow root (`<span role="status" class="sr-only">`) aggiornata con `successLabel`/`errorLabel` e svuotata al ritorno a riposo (senza annunciare "Copia"). |
| SL-COPY-BUTTON-03 | Media | 3/8 Passthrough | Un `aria-label` / `aria-describedby` sull'host resta sull'host (SHARED §2); il consumer non può dare un nome contestuale ("Copia IBAN", "Copia codice pratica") se non tramite `copy-label`, che però oggi alimenta solo il tooltip. | copy-button.component.ts:80-81, 272 | WCAG 2.4.6, 4.1.2 | Usare `copyLabel` (o `aria-label` dell'host) come nome del bottone; documentare l'uso di `copy-label` per il contesto. |
| SL-COPY-BUTTON-04 | Bassa | 7 Motion | Le animazioni di feedback usano `Element.animate()` direttamente con le keyframe del registry: a differenza di `animateTo` non rispettano `prefers-reduced-motion` (scale 0.25 → 1). | copy-button.component.ts:240, 248, 252, 256; 320-334 | WCAG 2.3.3 (AAA) / SHARED §6 | Usare `animateTo()` di `internal/animate.ts` (che forza `duration: 0`) o controllare `prefersReducedMotion()`. |
| SL-COPY-BUTTON-05 | Bassa | 6 Feedback contraddittorio | Se `from` non trova il target ma `value` è valorizzato viene mostrato l'errore (non atteso, r. 197) e subito dopo si copia `value` con `showStatus('success')`: feedback/annunci contrastanti. | copy-button.component.ts:195-209 | WCAG 3.3.1, 4.1.3 | `return` dopo l'errore di target mancante (o fallback esplicito su `value` senza errore). |
| SL-COPY-BUTTON-06 | Bassa | 9 Docs/Test | Nessun test su annuncio del feedback, tastiera (Enter/Space), stato disabled; docs senza indicazioni su nome contestuale e annuncio. | src/components/copy-button/copy-button.test.ts:13-196; docs/pages/components/copy-button.md:34-45 | — (qualità) | Aggiungere test su `aria-label` e sul contenuto della live region; sezione "Accessibilità" in docs. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `copy-label` | Sì | No | Solo contenuto del tooltip; deve diventare anche il nome del `<button>`. |
| `success-label` / `error-label` | Sì | Parziale | Solo tooltip; da annunciare in una live region stabile. |
| Default localizzati (`copy`, `copied`, `error`) | Sì | Sì | Via LocalizeController (r. 228-230). |
| `aria-label` sull'host | No | No | Da usare come fallback/override del nome. |
| `aria-describedby` | No | — | Non necessario se il nome è corretto. |
| `disabled` | Sì | Sì | `<button disabled>` nativo + tooltip disabilitato. |
| live region (`role="status"`) | No | — | Da aggiungere. |

### Fix proposti
```ts
// copy-button.component.ts
@state() private announcement = '';

private async showStatus(status: 'success' | 'error') {
  // ...
  this.announcement = status === 'success' ? successLabel : errorLabel;
  // ...nel setTimeout di ripristino:
  this.announcement = '';
}

render() {
  const copyLabel = this.copyLabel || this.getAttribute('aria-label') || this.localize.term('copy');
  const button = html`
    <button
      class="copy-button__button ..."
      part="button"
      type="button"
      aria-label=${copyLabel}
      ?disabled=${this.disabled}
      @click=${this.handleCopy}
    >
      <!-- slot icone invariati -->
    </button>
    <span class="copy-button__status" role="status">${this.announcement}</span>
  `;
  // ...
}
```
```css
/* copy-button.styles.ts */
.copy-button__status {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
```
```ts
// animazioni: rispettare reduced motion
import { animateTo } from '../../internal/animate.js';
await animateTo(this.copyIcon, hideAnimation.keyframes, hideAnimation.options);
```
```ts
// copy-button.test.ts: rimuovere ignoredRules
await expect(el).to.be.accessible();
```
Nota: la live region deve stare fuori dal `<sl-tooltip>`, che viene ricreato al primo hover/focus (r. 296-316), altrimenti verrebbe inserita contestualmente all'aggiornamento.

### Non verificabile
- Annuncio effettivo del tooltip `aria-live` all'apertura su focus (NVDA/JAWS/VoiceOver/TalkBack): richiede test con screen reader.
- Comportamento su touch (tooltip senza focus/hover persistente).
- Contrasto dell'icona a riposo (eredita `color` del consumer).
