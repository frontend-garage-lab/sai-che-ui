## Relative Time (`<sl-relative-time>` – src/components/relative-time/relative-time.component.ts)
**Pattern APG di riferimento:** N/A (testo formattato); HTML `<time datetime>`; WCAG 4.1.3 (non applicabile: non è un messaggio di stato)
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | `<time datetime=${isoTime}>` (r. 102): runtime `time > text "questo minuto"`, `datetime="2026-11-12T11:17:42.126Z"`. |
| 2 | Nome/descrizione/stato | ✅ | Testo localizzato esposto. |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Trasversale `lang` via property: contato una sola volta in SL-FORMAT-BYTES-01 (gli esempi React delle docs, r. 95-103, passano `lang` come prop). |
| 4 | Tastiera e focus | N/A | — |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | ✅ | Con `sync` il testo si aggiorna da solo (`setTimeout` r. 99): runtime "questo minuto" → dopo 61 s "1 minuto fa", senza `aria-live`. Corretto: un aggiornamento periodico non è un messaggio di stato e annunciarlo sarebbe invasivo. |
| 7 | Aspetti visivi | N/A | Aggiornamenti al massimo al minuto per i valori recenti: nessun movimento. |
| 8 | API pubblica a11y | ✅ | — |
| 9 | Docs e test | ⚠️ | Docs di `sync` senza avviso sulle live region (r. 31-35). Test axe presente (test r. 77). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| — nessun errore verificato — (trasversale `lang` via property: vedi SL-FORMAT-BYTES-01) | | | | | | | |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-RELATIVE-TIME-M01 | miglioramento | La data/ora assoluta è solo nel `datetime` (non letto dalle AT, nessun `title`): opzione per mostrarla come testo (best practice, nessun criterio A/AA). | relative-time.component.ts:102 |
| SL-RELATIVE-TIME-M02 | consumer | Non inserire un `sl-relative-time` con `sync` in una regione `aria-live`/`role="status"`: genererebbe annunci periodici. Suggerita nota nelle docs. | docs/pages/components/relative-time.md:31-35; relative-time.component.ts:99 |

### Responsabilità del consumer
- Quando l'istante esatto è essenziale (scadenze, log), mostrarlo anche come testo.
- Non avvolgere il componente con `sync` in una live region.

### Da verificare con AT reali
- Nessuna verifica rilevante.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-RELATIVE-TIME-01 | Suggerimento | riclassificato | Best practice/AAA → SL-RELATIVE-TIME-M01. |
| SL-RELATIVE-TIME-02 | Suggerimento | riclassificato | Docs/consumer → SL-RELATIVE-TIME-M02; verificato che il componente non introduce annunci. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| `date` → `datetime` | Sì | Sì (`datetime="2026-11-12T11:17:42.126Z"`) | Sì |
| `sync` | Sì | Sì ("questo minuto" → "1 minuto fa") | Sì |
| `lang` | Sì | Solo come attributo (SL-FORMAT-BYTES-01) | Sì |

### Fix proposti
Nessun errore specifico: vedi fix di SL-FORMAT-BYTES-01.
