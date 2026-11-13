## Menu Label (`sl-menu-label` – src/components/menu-label/menu-label.component.ts)
**Pattern APG di riferimento:** Menu — gruppi di item (`role="group"` + nome) — https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 2 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------------------------------|
| 1 | Semantica e ruoli | ❌ | Esposta come semplice testo figlio del menu (`text "APPUNTI"`), nessun `group`: il raggruppamento è solo visivo (SL-MENU-LABEL-01). |
| 2 | Nome/descrizione/stato | ❌ | Non dà nome a nessun gruppo; navigando con le frecce non viene mai letta. |
| 3 | Shadow DOM e riferimenti ARIA | N/A | Nessun riferimento. |
| 4 | Tastiera e focus | ✅ | Non focusabile ed esclusa dalla navigazione a frecce (corretto). |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | 12px semibold: light 4.71:1 ✅, dark 2.96:1 ❌ (SL-MENU-LABEL-02). |
| 8 | API pubblica a11y | ⚠️ | Nessun modo di creare un gruppo: `sl-menu.getAllItems()` considera solo i figli diretti dello slot, quindi un wrapper `role="group"` del consumer escluderebbe gli item dalla navigazione. |
| 9 | Docs e test | ⚠️ | Test axe fuori contesto (miglioramento). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-MENU-LABEL-01 | Media | Semantica | La label "descrive un gruppo di item" solo visivamente: non ha ruolo, gli item non sono in un `group` con nome, e con le frecce il testo non viene mai raggiunto. Nessun workaround dall'API (un wrapper `role="group"` esclude gli item da `getAllItems()`). | src/components/menu-label/menu-label.component.ts:8, 20-22 `<slot part="base" class="menu-label"></slot>`; src/components/menu/menu.component.ts:126-133 | runtime: `menu "Modifica"` → `text "APPUNTI"`, `menuitem "Undo"`, `menuitem "Redo"`… (nessun nodo `group`) | WCAG 1.3.1; APG Menu (group etichettato) | Contenitore `sl-menu-group` (`role="group"`, `aria-labelledby` verso la label) e `getAllItems()` che attraversa i gruppi; in alternativa `aria-describedby` dagli item del gruppo verso l'id della label (stesso light DOM) |
| SL-MENU-LABEL-02 | Media | Visivo | Colore `neutral-500` per testo di 12px: in tema dark sul pannello il contrasto è sotto 4.5:1. | src/components/menu-label/menu-label.styles.ts:15 `color: var(--sl-color-neutral-500);` | runtime dark: `color #636e74 su #1f2528 = 2.96:1`, `fontSize = 12px`; light `#6c757a su #ffffff = 4.71:1` | WCAG 1.4.3 | `--sl-color-neutral-600` (o token dedicato) verificato ≥ 4.5:1 in entrambi i temi |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-MENU-LABEL-03 | miglioramento | Test axe nel contesto reale (`sl-menu` con label e item). | src/components/menu-label/menu-label.test.ts:6-9 |
| SL-MENU-LABEL-M01 | miglioramento | `text-transform: uppercase` + `letter-spacing` su 12px: leggibilità; valutare dimensione maggiore. | menu-label.styles.ts:10-14 |

### Responsabilità del consumer
- Nessuna specifica (non esiste oggi un'API per raggruppare correttamente).

### Da verificare con AT reali
- Come NVDA/JAWS/VoiceOver presentano il testo libero dentro `role="menu"` in navigazione virtuale.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---|---|---|---|
| SL-MENU-LABEL-01 | Media | confermato | Runtime: nessun `group`, solo `text` nel menu |
| SL-MENU-LABEL-02 | Media | confermato | Runtime dark 2.96:1 su testo 12px |
| SL-MENU-LABEL-03 | Bassa | riclassificato | Test mancanti |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|---|---|---|---|
| Slot default (testo) | Sì | Esposto come `text`, non come nome di gruppo | Sì |
| Gruppo (`sl-menu-group` / `role=group`) | No | — | Sì (SL-MENU-LABEL-01) |

### Fix proposti
```css
/* menu-label.styles.ts */
.menu-label { color: var(--sl-color-neutral-600); }
```
```ts
// menu.component.ts — attraversare i gruppi
getAllItems() {
  const out: SlMenuItem[] = [];
  for (const el of this.defaultSlot.assignedElements({ flatten: true }) as HTMLElement[]) {
    if (el.getAttribute('role') === 'group') {
      out.push(...([...el.children] as HTMLElement[]).filter(c => !c.inert && this.isMenuItem(c)) as SlMenuItem[]);
    } else if (!el.inert && this.isMenuItem(el)) {
      out.push(el as SlMenuItem);
    }
  }
  return out;
}
```
```html
<!-- nuovo sl-menu-group: host role="group" aria-labelledby verso la propria sl-menu-label -->
<sl-menu-group>
  <sl-menu-label id="g1">Frutta</sl-menu-label>
  <sl-menu-item>Mela</sl-menu-item>
</sl-menu-group>
```
