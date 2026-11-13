## Visually Hidden (`<sl-visually-hidden>` – src/components/visually-hidden/visually-hidden.component.ts)
**Pattern APG di riferimento:** Tecnica "visually hidden / sr-only" (WCAG C7); skip link (G1)
**Esito:** ✅ Conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 0 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|----------------------------|
| 1 | Semantica e ruoli | ✅ | Solo `<slot>` (component r. 18-20), host senza ruolo: la semantica slottata resta (runtime `link "Skip to main content"`). |
| 2 | Nome/descrizione/stato | ✅ | Il testo nascosto contribuisce al nome: runtime `link "Visit External Page opens in a new window"`. |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Contenuto in light DOM, ID referenziabili. |
| 4 | Tastiera e focus | ✅ | Tab reale: prima `size 1.0x1.0 px`, `clipPath = inset(50%)`; con focus sul link `size 148.8x18.0 px`, `clipPath = none`, `position = static`; al Tab successivo torna 1x1. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Nessun `display:none`: una live region slottata resta nell'albero. |
| 7 | Aspetti visivi | ✅ | Allo sblocco valgono gli stili del consumer. |
| 8 | API pubblica a11y | N/A | Utility, nessuna property necessaria. |
| 9 | Docs e test | ⚠️ | L'esempio "Content Conveyed By Context" crea un landmark `banner` contenente solo testo (runtime `banner > text "Personal Info"`); nessun test axe. |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| — nessun errore verificato — | | | | | | | |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-VISUALLY-HIDDEN-M01 | miglioramento | Esempio docs: `<header>` in `sl-card` (light DOM, non dentro article/section) diventa landmark `banner` con il solo testo "Personal Info", che non è heading né nome del gruppo. Correggere l'esempio con un heading nascosto e `role="group" aria-labelledby`. | docs/pages/components/visually-hidden.md:40-42; runtime `banner` → `text "Personal Info"` |
| SL-VISUALLY-HIDDEN-M02 | miglioramento | Nessun test axe; il test sul focus usa `focus()` programmatico, non Tab. | visually-hidden.test.ts:5-37 |
| SL-VISUALLY-HIDDEN-M03 | da-verificare-AT | Lettura del testo clippato con VoiceOver iOS (può spezzare il testo in più nodi). | visually-hidden.styles.ts:4-14 |

### Responsabilità del consumer
- Contrasto e focus ring del contenuto mostrato al focus (es. skip link): dipendono dagli stili del consumer.
- Usare elementi semantici (heading, label) dentro il componente quando il testo nascosto ha un ruolo strutturale.

### Da verificare con AT reali
- VoiceOver iOS / Safari: lettura del testo dentro `clip-path: inset(50%)` (Chromium lo espone correttamente).

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|---------------|----------------|-------|--------|
| SL-VISUALLY-HIDDEN-01 | Bassa | riclassificato | Problema dell'esempio docs (copiabile dal consumer), non del componente → SL-VISUALLY-HIDDEN-M01 (in più: il `<header>` diventa `banner`). |
| SL-VISUALLY-HIDDEN-02 | Suggerimento | riclassificato | Test mancanti → SL-VISUALLY-HIDDEN-M02. Il comportamento con Tab reale è stato verificato a runtime ed è corretto. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|--------------------|----------|----------------------------------|----------------|
| — | — | — | Utility senza API ARIA: nessuna necessaria |

### Fix proposti
Nessun errore verificato: nessun fix obbligatorio.
