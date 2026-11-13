## Stat (`<sl-stat>` – src/components/stat/stat.component.ts)
**Pattern APG di riferimento:** Nessuno da solo (contenuto statico); in `sl-stat-group` APG Button (toggle button con `aria-pressed`)
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 1 · Media 1 · Bassa 3 · Suggerimento 1

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<button type="button">` nativo quando interattivo, `<div>` altrimenti (r. 65-77) ✅ first rule of ARIA. |
| 2 | Nome, descrizione, stato | ⚠️ | Nome del button = testo "8 Working" (count + slot) ✅; `aria-pressed` ✅ (r. 71); `selected` fuori da un gruppo è solo visivo (SL-STAT-03). **Trend**: il componente non ha property di trend/delta → N/A; se il consumer aggiunge frecce/icone di trend nello slot deve includere testo. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun IDREF; il testo slottato fornisce il nome del button interno. |
| 4 | Tastiera e focus | ✅ | Button nativo (Enter/Space); `:focus-visible` con `--sl-focus-ring` (styles r. 119-122) ✅; disabled nativo toglie dal Tab order (SL-STAT-06). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Cambio di `count` non annunciato: responsabilità del consumer se il valore è aggiornato in tempo reale. |
| 7 | Aspetti visivi | ❌ | Label `neutral-600` su sfondo selezionato in dark 1.61–3.54:1 (SL-STAT-01); label troncata con ellipsis (SL-STAT-02); icona su badge in dark 2.7:1 (SL-STAT-04); selected in forced-colors con `outline: Highlight` ✅ (styles r. 142-146); selezione indicata anche dallo spessore del bordo 2px (non solo colore) ✅. |
| 8 | API pubblica a11y | ⚠️ | Nessuna property per una descrizione/nome alternativo; ok per il caso d'uso. |
| 9 | Documentazione e test | ⚠️ | Un test axe solo sullo stato non interattivo (test r. 6-10); JSDoc di `variant` descrive un "coloured dot" che non esiste (SL-STAT-05). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-STAT-01 | Alta | 7 | Nello stato selezionato in tema dark la label (`neutral-600`, 14px normale) su `--stat-tint` (-100 del variant) ha contrasto insufficiente: primary 1.94, accent 2.40, success 1.79, warning 1.61, danger 3.22, neutral 4.21, nessun variant (primary-50) 3.54. Light ok (4.93–6.27). Count dark warning 4.21 (testo grande, ok ≥3). | stat.styles.ts:77 `color: var(--sl-color-neutral-600)`; :131-135 `background-color: var(--stat-tint, …)`; dark.css `--sl-color-*-100` = L 28% | WCAG 1.4.3 | In `.stat--selected .stat__label` usare `--sl-color-neutral-800`/`900`, oppure tint dark meno saturo (es. -50) con contrasto ≥4.5:1. |
| SL-STAT-02 | Media | 7 | La label è troncata con ellipsis (`nowrap` + `overflow: hidden`) senza alternativa visibile: a zoom 200-400% o card strette il nome del filtro si perde. | stat.styles.ts:67-78 | WCAG 1.4.10, 1.4.4 | Permettere il wrap (`white-space: normal`, `overflow-wrap: anywhere`) o `-webkit-line-clamp: 2` con wrap; evitare di troncare il nome. |
| SL-STAT-03 | Bassa | 2 | `selected` e `disabled` sono property pubbliche ma fuori da `sl-stat-group` producono solo stile su un `<div>` senza stato esposto. | stat.component.ts:42-46, 77 | WCAG 1.3.1, 4.1.2 | Documentare che sono effettive solo nel gruppo, o ignorarle visivamente quando `!interactive`. |
| SL-STAT-04 | Bassa | 7 | Icona prefix sul badge tinto in dark: primary 2.73:1, danger 2.70:1 (light 3.43–5.45 ✅). Rilevante solo se l'icona è informativa (consumer). | stat.styles.ts:42-43, 80-108 | WCAG 1.4.11 | Usare `-700` come `--stat-color` in dark o tint più scuro. |
| SL-STAT-05 | Bassa | 9 | Test axe solo per lo stato non interattivo (nessun test su selected/disabled/dentro gruppo); JSDoc di `variant` cita un "coloured dot" non renderizzato; docs senza sezione a11y. | stat.test.ts:6-10; stat.component.ts:36-40 | Qualità | Test axe sugli stati; correggere JSDoc; nota su testo del trend nei docs. |
| SL-STAT-06 | Suggerimento | 4 | Uno stat `disabled` nel gruppo usa `disabled` nativo: sparisce dal Tab order e gli utenti tastiera/SR non scoprono che il filtro esiste. | stat.component.ts:72 `?disabled=${this.disabled}` | WCAG 4.1.2 (best practice) | Valutare `aria-disabled="true"` + blocco del click nel gruppo. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| Testo (slot default) | Sì | ✅ | Nome del button. |
| `aria-pressed` (da `selected`) | Interno | ✅ | Solo in gruppo. |
| `disabled` | Sì | ✅ nativo | Vedi SL-STAT-06. |
| `aria-label`/`aria-describedby` sull'host | No | — | Restano sull'host; non necessari se il testo è completo. |
| Trend/delta | No | — | Se aggiunto in futuro: testo (`trend-label`) oltre a colore/icona (WCAG 1.4.1). |

### Fix proposti
```css
/* SL-STAT-01 */
.stat--selected .stat__label { color: var(--sl-color-neutral-800); }
/* SL-STAT-02 */
.stat__label { white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere; }
```

### Non verificabile
- Contrasto di icone/contenuti slottati con colori del consumer.
- Annuncio del nome "8 Working, pulsante attivato/premuto" nei vari screen reader (ordine count/label).
