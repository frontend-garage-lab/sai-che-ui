## Format Number (`<sl-format-number>` – src/components/format-number/format-number.component.ts)
**Pattern APG di riferimento:** N/A (formatter di testo); WCAG 3.1.2
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 0 · Suggerimento 1 (+ trasversale SL-FORMAT-BYTES-01, non conteggiato)

Testo semplice localizzato con `Intl.NumberFormat` (r. 49-59). Restituisce `''` se il valore è `NaN` (r. 45-47). Non ha problemi propri oltre al limite trasversale di `lang`/`dir` impostati come property (SL-FORMAT-BYTES-01), da cui l'esito ⚠️.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Testo puro. Nessun elemento `<data value>`: non serve alle AT. |
| 2 | Nome, descrizione, stato | ✅ | Con `currency-display="symbol"` (default, r. 27) le AT leggono simbolo e valore localizzati. `narrowSymbol` ("$") può essere ambiguo tra valute diverse: è una scelta del consumer. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Testo nello shadow root, entra nel nome dei contenitori. |
| 4 | Tastiera e focus | N/A | — |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Se il consumer aggiorna `value` in tempo reale, l'annuncio resta a suo carico. |
| 7 | Aspetti visivi | N/A | Nessuno stile proprio. |
| 8 | API pubblica a11y | ⚠️ | `lang` non riflesso quando impostato come property (SL-FORMAT-BYTES-01). |
| 9 | Documentazione e test | ⚠️ | Test estesi su lingua, tipo, valuta e grouping (test r. 7-76), ma senza axe (SL-FORMAT-NUMBER-01). Docs di localizzazione con l'attributo `lang` ✅ (md r. 87-94). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-FORMAT-NUMBER-01 | Suggerimento | 9 | Nessun test axe. | src/components/format-number/format-number.test.ts (nessun `to.be.accessible()`) | Buona pratica | Aggiungere `await expect(el).to.be.accessible()`. |
| (rif.) SL-FORMAT-BYTES-01 | Bassa | 8 | `lang`/`dir` non riflessi quando impostati come property. | src/internal/shoelace-element.ts:67-68 | WCAG 3.1.2 | `reflect: true` (vedi sl-format-bytes.md). |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `lang` / `dir` | Sì (ereditate) | Parziale | Vedi SL-FORMAT-BYTES-01. |
| `currency-display` | Sì | — | Documentare che `name`/`code` sono più chiari per le AT nei contesti multi-valuta. |

### Fix proposti
```ts
it('passes accessibility test', async () => {
  const el = await fixture(html`<sl-format-number value="1000" type="currency" currency="EUR" lang="it"></sl-format-number>`);
  await expect(el).to.be.accessible();
});
```

### Non verificabile
- Lettura di simboli di valuta, separatori e percentuali con i diversi screen reader e lingue.
