## Copy Button (`sl-copy-button` – src/components/copy-button/copy-button.component.ts)
**Pattern APG di riferimento:** APG Button · `status` live region · APG Tooltip
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 0 · Alta 2 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness), revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<button type="button">` nativo |
| 2 | Nome/descrizione/stato | ❌ | `button [invalid="false"]` **senza nome**. Il tooltip `"Copy"` è un nodo separato, non associato al bottone (SL-COPY-BUTTON-01) |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-label` sull'host resta sull'host (verificato dal coordinatore). Unica via tramite l'API: slottare un'icona con label (`button "Copia IBAN"`) |
| 4 | Tastiera e focus | ❌ | Al primo Tab il focus finisce su `body` (SL-COPY-BUTTON-V01). Dal Tab successivo Enter copia. In forced-colors il focus è `outline solid 2px` |
| 5 | Form e validazione | N/A | |
| 6 | Live region | ⚠️ | La live region del tooltip esiste prima dell'aggiornamento se il tooltip è aperto (`tooltip "Copied" [live="polite"]`). A tooltip chiuso (Esc) l'esito non è esposto (SL-COPY-BUTTON-02) |
| 7 | Aspetti visivi | ✅ | Icona 15.50:1 light, 14.96:1 dark; successo `#1f8466` (4.61:1); target 32x32 |
| 8 | API pubblica a11y | ⚠️ | `copy-label`/`success-label`/`error-label` localizzati, ma `copy-label` non dà il nome al bottone |
| 9 | Docs e test | ❌ | Il test axe ignora `button-name` (copy-button.test.ts:5-6) |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-COPY-BUTTON-01 | Alta | Nome | Il `<button>` interno non ha nome: `copy-label` alimenta solo il tooltip, l'icona è decorativa. C'è un workaround via slot, non documentato | copy-button.component.ts:274-283 (nessun `aria-label`), 285, 303 | `button [invalid="false"]` senza nome. Con `<sl-icon slot="copy-icon" label="Copia IBAN">` diventa `button "Copia IBAN"` | WCAG 4.1.2 | `aria-label=${copyLabel}` sul `<button>` |
| SL-COPY-BUTTON-V01 | Alta | Tastiera e focus | Alla prima interazione da tastiera `createTooltip()` ricrea il bottone dentro `<sl-tooltip>` e chiama `this.button.focus()` prima che il tooltip abbia renderizzato il suo slot: il focus viene perso. Succede su ogni istanza | copy-button.component.ts:137-145, 296-316 | `focus:#a ; Tab` → `focus: body`; Tab successivo → `sl-copy-button#c > button[part=button]` | WCAG 2.4.3, 2.4.7 | `await this.tooltip?.updateComplete` prima di `focus()` |
| SL-COPY-BUTTON-02 | Media | Live region | Se il tooltip è chiuso (Esc) la copia riesce ma "Copied"/"Error" non è esposto: `aria-live` del tooltip è `off` | copy-button.component.ts:235-237, 258-260; tooltip.component.ts:286 | Tab, Escape, Enter → ax: `button [focused]` (nessun nodo di stato); `tooltip.open=false`, `content="Copied"`; `sl-copy` emesso | WCAG 4.1.3 | Live region `role="status"` stabile, fuori dal tooltip |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-COPY-BUTTON-03 | miglioramento | `aria-label` dell'host come fallback; documentare `copy-label` | copy-button.component.ts:80-81, 272 |
| SL-COPY-BUTTON-04 | miglioramento | `Element.animate()` ignora reduced-motion (AAA) | r. 240, 248, 252, 256 |
| SL-COPY-BUTTON-05 | miglioramento | `from` senza target ma con `value`: errore e successo mostrati in parallelo | r. 195-209 |
| SL-COPY-BUTTON-06 | miglioramento | Rimuovere `ignoredRules = ['button-name']`; testare il focus al primo Tab | copy-button.test.ts:5-6 |

### Responsabilità del consumer
- Finché il fix non c'è: dare un nome slottando `<sl-icon slot="copy-icon" name="copy" library="system" label="Copia …">`.

### Da verificare con AT reali
- Annuncio di "Copy" e "Copied" tramite l'`aria-live` del tooltip (NVDA/JAWS/VoiceOver/TalkBack): l'annuncio dipende dall'AT.
- Attivazione dal cursore virtuale senza focus, e uso touch.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-COPY-BUTTON-01 | Blocker | ridimensionato → Alta | Bottone senza nome confermato, ma la copia è operabile ed esiste un workaround via slot (non documentato) |
| SL-COPY-BUTTON-02 | Alta | ridimensionato → Media | Nel flusso di default la live region esiste ed espone "Copied"; manca solo a tooltip chiuso |
| SL-COPY-BUTTON-03 | Media | riclassificato | Assorbito dal fix di 01 |
| SL-COPY-BUTTON-04 | Bassa | riclassificato | Criterio AAA |
| SL-COPY-BUTTON-05 | Bassa | riclassificato | Bug che compare solo con una configurazione errata |
| SL-COPY-BUTTON-06 | Bassa | riclassificato | Test/docs |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `copy-label` | Sì | No: solo `tooltip "Copy"`, il bottone resta senza nome | Sì, come nome |
| `success-label`/`error-label` | Sì | Solo nel tooltip aperto | Sì |
| slot `copy-icon` | Sì | Un'icona con label dà il nome (`button "Copia IBAN"`) | Workaround |
| live region | No | — | Sì (SL-COPY-BUTTON-02) |

### Fix proposti
```ts
// copy-button.component.ts
@state() private announcement = '';

private async createTooltip() {
  // ...
  this.tooltipReady = true;
  await this.updateComplete;
  await this.tooltip?.updateComplete; // il bottone diventa focusabile solo dopo il render dello slot del tooltip
  if (hadFocus) this.button?.focus();
  // ...
}

// showStatus(): this.announcement = status === 'success' ? successLabel : errorLabel; al ripristino: this.announcement = '';

render() {
  const copyLabel = this.copyLabel || this.localize.term('copy');
  const button = html`<button ... aria-label=${copyLabel} ...>...</button>`;
  const status = html`<span class="copy-button__status" role="status">${this.announcement}</span>`; // stile sr-only
  // stesso template esterno: la live region non viene ricreata quando compare il tooltip
  return html`${this.tooltipReady ? html`<sl-tooltip ...>${button}</sl-tooltip>` : button}${status}`;
}
```
