## Icon Button (`sl-icon-button` – src/components/icon-button/icon-button.component.ts)
**Pattern APG di riferimento:** APG Button · APG Link (con `href`)
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness), revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `button "Impostazioni"`; con `href` `link "Link"`; con `href`+`disabled` `link "LinkDis" [disabled]` (non tabbabile, click bloccato: `location` invariata) |
| 2 | Nome/descrizione/stato | ✅ | Con `label` il nome c'è. Senza `label` il bottone è senza nome: è responsabilità del consumer |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | `aria-label` sull'host dà `generic "Host label"` attorno a un `button` senza nome. La soluzione supportata è `label` |
| 4 | Tastiera e focus | ✅ | Tab su tutti i bottoni abilitati; `disabled` escluso; in forced-colors il focus è `outline solid 2px` |
| 5 | Form e validazione | N/A | |
| 6 | Live region | N/A | |
| 7 | Aspetti visivi | ❌ | Variante `accent` tenue, light: 3.02 a riposo, **2.88 con focus**, **2.62 in hover**. Le altre varianti sono ≥3.53 (light e dark), le filled ≥4.59. Dimensione di default 32x32; `small` 22x22 (l'eccezione spacing vale nell'esempio della docs) |
| 8 | API pubblica a11y | ✅ | `label`, `disabled`, `href` |
| 9 | Docs e test | ⚠️ | Tutti gli esempi hanno `label`. Nessun test axe |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-ICON-BUTTON-05 | Media | Aspetti visivi | Variante `accent` tenue (non filled), tema light: l'icona, unico elemento che identifica il bottone, scende sotto 3:1 con focus e in hover | icon-button.styles.ts:79-82 (accent-600 su accent-50), 30-33 (wash in focus), 104-111 (wash in hover) | `#e66c0f` su `#fbf7f3` = 3.02:1; dopo Tab su `#fcf0e7` = **2.88:1**; hover su `#fae4d4` = **2.62:1** | WCAG 1.4.11 | Icona accent-700 in light (oppure wash ridotto) |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-ICON-BUTTON-M01 | miglioramento | `aria-label=${ifDefined(label \|\| undefined)}`, fallback sull'`aria-label` dell'host, warning in dev se manca il nome | icon-button.component.ts:129 |
| SL-ICON-BUTTON-02 | miglioramento | Nessuna API per pressed/expanded/current. L'esempio Bold/Italic della docs non ha stati | icon-button.component.ts:118-134 |
| SL-ICON-BUTTON-03 | miglioramento | Link disabilitato: nessuno stile disabled (`opacity` 1) e `href` mantenuto (si apre col click centrale) | icon-button.component.ts:120, 123 |
| SL-ICON-BUTTON-06 | miglioramento | ARIA ridondante | icon-button.component.ts:127-130 |
| SL-ICON-BUTTON-07 | miglioramento | Nessun test axe | icon-button.test.ts |
| SL-ICON-BUTTON-08 | miglioramento | Documentare l'abbinamento con `sl-tooltip` | docs icon-button.md |

### Responsabilità del consumer
- Impostare sempre `label` (senza: `button` senza nome; `aria-label` sull'host non funziona).
- `size="small"` (22px): lasciare spazio tra i bottoni. Due small affiancati senza spazio (x=16 e x=38) violano l'eccezione spacing di 2.5.8; l'esempio della docs la rispetta.

### Da verificare con AT reali
- Nessuna verifica rilevante.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-ICON-BUTTON-01 | Alta | riclassificato | `label` funziona. Ometterla è un errore del consumer (+ miglioramento M01) |
| SL-ICON-BUTTON-02 | Media | riclassificato | Nessun toggle con stato documentato |
| SL-ICON-BUTTON-03 | Media | riclassificato | Chromium espone `link [disabled]`, non tabbabile, click bloccato |
| SL-ICON-BUTTON-04 | Media | riclassificato | Eccezione spacing rispettata nell'esempio della docs |
| SL-ICON-BUTTON-05 | Media | confermato | 2.88:1 con focus e 2.62:1 in hover |
| SL-ICON-BUTTON-06 | Bassa | riclassificato | Ridondanza senza effetti |
| SL-ICON-BUTTON-07 | Bassa | riclassificato | Test |
| SL-ICON-BUTTON-08 | Suggerimento | riclassificato | 2.5.3 non applicabile senza testo visibile |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| `label` | Sì | Sì: `button "Impostazioni"` | Sì |
| `disabled` | Sì | Sì: `button "Dis" [disabled]`, `link [disabled]` | Sì |
| `aria-label` sull'host | No | No: `generic "Host label"` | No: c'è `label` |
| `aria-pressed`/`expanded` | No | Solo via `sl-dropdown` | Solo se si documentano i toggle |

### Fix proposti
```css
/* icon-button.styles.ts — variante accent tenue */
.icon-button--accent { color: var(--sl-color-accent-700); }
```
