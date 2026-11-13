## Format Date (`<sl-format-date>` – src/components/format-date/format-date.component.ts)
**Pattern APG di riferimento:** N/A (formatter); HTML `<time datetime>`; WCAG 3.1.2
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 0 · Suggerimento 1 (+ trasversale SL-FORMAT-BYTES-01, non conteggiato)

Semantica corretta: il testo è dentro `<time datetime=${date.toISOString()}>` (r. 65), con valore macchina ISO 8601 in UTC, ed è localizzato con `Intl.DateTimeFormat` tramite LocalizeController (r. 66-78). Una data non valida non produce output (r. 60-62). Resta il limite trasversale di `lang`/`dir` impostati come property (SL-FORMAT-BYTES-01), che motiva l'esito ⚠️.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<time datetime>` nativo (r. 65). |
| 2 | Nome, descrizione, stato | ✅ | Il testo visibile è il contenuto. Con formati brevi/numerici (`month="numeric"`) la lettura è ambigua tra GG/MM e MM/GG, ma resta coerente con la lingua scelta (consumer). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Testo nello shadow root, entra nel nome dei contenitori. |
| 4 | Tastiera e focus | N/A | — |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Nessun aggiornamento automatico. |
| 7 | Aspetti visivi | N/A | Nessuno stile proprio. |
| 8 | API pubblica a11y | ⚠️ | `lang` ✅ per la formattazione, ma non riflesso se impostato come property: vedi SL-FORMAT-BYTES-01. `time-zone`, `hour-format` ✅. |
| 9 | Documentazione e test | ⚠️ | Molti test di lingua e formato (test r. 21-50), nessun test axe (SL-FORMAT-DATE-01). Docs di localizzazione con l'attributo `lang` ✅ (md r. 105-112). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-FORMAT-DATE-01 | Suggerimento | 9 | Nessun test axe e nessun test che verifichi `<time datetime>`. | src/components/format-date/format-date.test.ts (nessun `to.be.accessible()`) | Buona pratica | Aggiungere `to.be.accessible()` e un'asserzione su `shadowRoot.querySelector('time').getAttribute('datetime')`. |
| (rif.) SL-FORMAT-BYTES-01 | Bassa | 8 | `lang`/`dir` non riflessi quando impostati come property: il testo localizzato non dichiara la propria lingua. | src/internal/shoelace-element.ts:67-68 | WCAG 3.1.2 | `reflect: true` (vedi sl-format-bytes.md). |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `lang` / `dir` | Sì (ereditate) | Parziale | Vedi SL-FORMAT-BYTES-01. |
| `datetime` (su `<time>`) | Sì (derivato da `date`) | Sì | Corretto. |

### Fix proposti
```ts
// format-date.test.ts
it('passes accessibility test and exposes datetime', async () => {
  const el = await fixture<SlFormatDate>(html`<sl-format-date date="2020-07-15T09:17:00Z"></sl-format-date>`);
  await expect(el).to.be.accessible();
  expect(el.shadowRoot!.querySelector('time')!.getAttribute('datetime')).to.equal('2020-07-15T09:17:00.000Z');
});
```

### Non verificabile
- Pronuncia delle date in formato numerico o abbreviato con i vari screen reader (dipende dalle opzioni scelte dal consumer).
