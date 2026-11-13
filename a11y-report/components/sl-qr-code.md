## QR Code (`<sl-qr-code>` – src/components/qr-code/qr-code.component.ts)
**Pattern APG di riferimento:** Immagine informativa (`role="img"` + nome); WCAG 1.1.1
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `<canvas role="img">` (r. 75). Runtime: `image "Scan this code to visit Shoelace on the web!"`. |
| 2 | Nome/descrizione/stato | ✅ | Con `label` → nome = label; aggiornamento dinamico (`label="Nuovo"` → `aria-label "Nuovo"`). Senza `label` → `image "https://shoelace.style/"` (il valore codificato: equivalente testuale del contenuto, poco descrittivo dello scopo). Con `value=""` e senza label → `image` senza nome (caso non realistico: QR vuoto). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-label` sull'host resta sull'host: `generic "Host label" > image "x"` (verificato anche dal coordinatore). La property `label` copre il caso d'uso. |
| 4 | Tastiera e focus | N/A | Non interattivo (Tab passa oltre). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Default `fill="black"` su `background="white"` (21:1). Colori custom a carico del consumer. |
| 8 | API pubblica a11y | ✅ | `label` propagata al canvas. |
| 9 | Docs e test | ⚠️ | Solo il primo esempio usa `label` (docs r. 12 vs 80-126). Test axe presente (test r. 104-108). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| — nessun errore verificato — | | | | | | | |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-QR-CODE-M01 | miglioramento | Senza `label` il nome è il `value` grezzo (`image "https://shoelace.style/"`): non dice che è un QR né lo scopo, e può esporre payload lunghi/sensibili. Suggerito prefisso localizzato "Codice QR" e warning in dev se manca `label`. | qr-code.component.ts:76 |
| SL-QR-CODE-M02 | miglioramento | Con `value=""` e senza `label`: `role="img"` con `aria-label=""` → `image` senza nome. Caso non d'uso (QR vuoto); suggerito `aria-hidden` quando non c'è contenuto. | qr-code.component.ts:25, 75-76; runtime `<canvas … role="img" aria-label="">` |
| SL-QR-CODE-M03 | consumer | Contrasto/scansionabilità con `fill`/`background` custom o `transparent` su tema scuro. | qr-code.component.ts:33-37 |
| SL-QR-CODE-M04 | consumer | Fornire accanto al QR l'equivalente testuale (link/testo) per chi non può scansionarlo; docs senza indicazioni. | docs/pages/components/qr-code.md:12, 80-126 |

### Responsabilità del consumer
- Passare `label` che descrive scopo/destinazione del codice.
- Mostrare il contenuto (URL, dati) anche come testo/link vicino al QR.
- Garantire contrasto tra `fill` e `background`.

### Da verificare con AT reali
- Nessuna verifica rilevante: `role="img"` con nome è esposto correttamente in Chromium.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-QR-CODE-01 | Media | riclassificato | Il nome esiste (il valore codificato) e `label` permette un nome descrittivo: qualità del default → SL-QR-CODE-M01. |
| SL-QR-CODE-02 | Bassa | riclassificato | Riprodotto (`image` senza nome) solo con QR vuoto, uso non realistico → SL-QR-CODE-M02. |
| SL-QR-CODE-03 | Bassa | riclassificato | Colori scelti dal consumer; default 21:1 → consumer SL-QR-CODE-M03. |
| SL-QR-CODE-04 | Suggerimento | riclassificato | Docs/consumer → SL-QR-CODE-M04. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `label` | Sì | Sì: `image "Scan this code…"`, aggiornamento dinamico ok | Sì |
| `role="img"` (fisso) | Sì | Sì | Sì |
| `aria-label` sull'host | No (resta sull'host) | No: `generic "Host label" > image "x"` | No, c'è `label` |
| `decorative` | No | — | Utile per QR duplicati di un link visibile |

### Fix proposti
Nessun errore verificato: nessun fix obbligatorio.
