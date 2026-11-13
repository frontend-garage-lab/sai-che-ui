## Tag (`<sl-tag>` – src/components/tag/tag.component.ts)
**Pattern APG di riferimento:** nessun pattern dedicato. Il pulsante di rimozione segue APG Button.
**Esito:** ❌ Non conforme
**Errori verificati:** Blocker 1 · Alta 0 · Media 1 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | Testo esposto come `text "Milano"`; remove = `button "Remove"`. |
| 2 | Nome/descrizione/stato | ✅ | Remove con nome localizzato (`localize.term('remove')`, r. 67). Il nome non è contestuale (miglioramento). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Nessun riferimento ID. |
| 4 | Tastiera e focus | ❌ | `focus:#a → Tab → focus: button#b`: il remove viene saltato. Delete/Backspace non fanno nulla (eventi: nessuno). Con `.focus()` programmatico, Enter emette `sl-remove`. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | L'annuncio della rimozione è responsabilità del consumer. |
| 7 | Aspetti visivi | ❌ | Testo: light 6.68–15.50:1, dark 6.23–14.96:1. Icona remove in dark: warning **2.47:1**, success **2.69:1** (SL-TAG-V01). Target 14×14 (medium) e 12×12 (small), ma rientra nell'eccezione spacing (vedi revisione SL-TAG-03). |
| 8 | API pubblica a11y | ❌ | Nessun modo di rendere il remove focusabile (tabindex fisso). |
| 9 | Docs e test | ⚠️ | Nessun test axe né di tastiera (tag.test.ts); docs senza indicazioni a11y. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-TAG-01 | Blocker | Tastiera e focus | Il pulsante di rimozione ha `tabindex="-1"` sull'host `sl-icon-button` e il tag non gestisce Delete/Backspace: fuori da `sl-select` un utente da tastiera non può rimuovere un tag `removable`. Non c'è nessuna API pubblica per cambiarlo. (verificato anche dal coordinatore) | src/components/tag/tag.component.ts:70 `tabindex="-1"` | runtime: `focus:#a ;; tab` → `focus: button#b` (remove saltato); `key:Delete`, `key:Backspace` → `eventi: (nessuno)` | WCAG 2.1.1 Keyboard (A); APG Button | Rimuovere `tabindex="-1"`. Per `sl-select`, che gestisce Backspace da sé, passare un flag interno (es. attributo `data-in-select` o property non documentata) che applica `tabindex=-1` solo in quel contesto. |
| SL-TAG-V01 | Media | Aspetti visivi | In tema dark l'icona del remove (unico indicatore visivo del controllo) ha un contrasto < 3:1 sullo sfondo delle varianti warning e success. `::part(base) { color: inherit }` eredita il `neutral-600` del `:host` di `sl-icon-button`, non il colore del tag. | src/components/tag/tag.styles.ts:28-31; src/components/icon-button/icon-button.styles.ts:6 | runtime dark: `contrast:sl-tag[variant=warning] >>> sl-icon-button >>> button` → `#869298 su .tag = 2.47:1`; success = 2.69:1 (light: tutte ≥ 6.15:1) | WCAG 1.4.11 Non-text Contrast (AA) | `.tag__remove { color: inherit; }` sull'host `sl-icon-button`, così prende il colore `-800` della variante (≥ 6.23:1 in dark). |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-TAG-02 | miglioramento | Il nome "Remove" è uguale per tutti i tag. Il tag che precede lo rende comprensibile dal contesto (2.4.6 non è violato; 2.4.4 riguarda i link). Un default "Rimuovi Milano" o una property `remove-label` migliorerebbe la navigazione per elenco di pulsanti. | tag.component.ts:67 |
| SL-TAG-03 | miglioramento | Target del remove 14×14 / 12×12 px (padding 0). L'eccezione spacing di 2.5.8 è soddisfatta: il cerchio di 24 px centrato sul remove (x 124.9–148.9) non interseca altri target (il remove successivo parte a x 206). Un'area ≥ 24 px resta consigliata per righe dense. | tag.styles.ts:28-31 |
| SL-TAG-05 | miglioramento | Aggiungere test axe e un test Tab → Enter → `sl-remove`. | tag.test.ts |

### Responsabilità del consumer
- SL-TAG-04: dopo `sl-remove` il consumer rimuove il tag. Deve spostare il focus su un elemento logico (tag adiacente o campo) e, se utile, annunciare la rimozione.

### Da verificare con AT reali
- Nessuna verifica rilevante oltre agli errori (comportamento di tastiera e contrasto dimostrati in Chromium).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-TAG-01 | Blocker | confermato | Tab salta il remove e non ci sono tasti alternativi (Delete/Backspace senza effetto). |
| SL-TAG-02 | Media | riclassificato | Il nome esiste ed è localizzato; il contesto è dato dal tag adiacente. |
| SL-TAG-03 | Media | scartato | Si applica l'eccezione spacing di 2.5.8 (misurata). |
| SL-TAG-04 | Bassa | riclassificato | La rimozione dal DOM e la gestione del focus spettano al consumer. |
| SL-TAG-05 | Suggerimento | riclassificato | Copertura dei test. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| remove focusabile | No (fisso `-1`) | No: Tab salta il remove | Sì (SL-TAG-01) |
| `remove-label` | No | Default "Remove" localizzato | Utile, non necessario |

### Fix proposti
```ts
// tag.component.ts
<sl-icon-button part="remove-button" … class="tag__remove" @click=${this.handleRemoveClick}
  tabindex=${this.closest('sl-select') || this.getRootNode() instanceof ShadowRoot && (this.getRootNode() as ShadowRoot).host.localName === 'sl-select' ? '-1' : nothing}
></sl-icon-button>
```
```css
/* tag.styles.ts */
.tag__remove { color: inherit; }
.tag__remove::part(base) { color: inherit; padding: 0; }
```
