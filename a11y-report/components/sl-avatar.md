## Avatar (`<sl-avatar>` – src/components/avatar/avatar.component.ts)
**Pattern APG di riferimento:** nessuno. WAI-ARIA `role="img"` con nome da `label`.
**Esito:** ⚠️ Parzialmente conforme
**Errori verificati:** Blocker 0 · Alta 0 · Media 2 · Bassa 0
**Metodo:** codice + runtime Chromium (harness) — revisione v2 del 2026-11-12

### Checklist
| # | Area | Esito | Note (con prova sintetica) |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `role="img"` sul base (r. 106). |
| 2 | Nome/descrizione/stato | ✅ | `label` → `image "User avatar"`. Con initials: `image "Avatar with initials: SL"`. Con immagine in errore: `image "Img"` (il nome resta). Senza `label` → `image` senza nome (uso scorretto del consumer, vedi sotto). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | `aria-hidden="true"` sull'host nasconde l'avatar decorativo: il paragrafo espone solo `text "A "` e `text " Mario Rossi"`. |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ❌ | Iniziali di default (bianco su neutral-400) **3.21:1** in light (18 px medium, 12 px small) e **2.18:1** in dark. Tinted in dark 3.49–4.86:1, accent in light 3.70:1 (SL-AVATAR-01). Icona di default o slottata in dark **2.18:1** (SL-AVATAR-03). |
| 8 | API pubblica a11y | ✅ | `label` basta. La modalità decorativa si ottiene con `aria-hidden` sull'host. |
| 9 | Docs e test | ⚠️ | I test ignorano `color-contrast` con una motivazione errata (avatar.test.ts:5-7). |

### Errori verificati
| ID | Severità | Area | Problema | Evidenza codice (file:riga) | Prova | Criterio WCAG 2.2 / APG | Fix |
|----|----------|------|----------|-----------------------------|-------|--------------------------|-----|
| SL-AVATAR-01 | Media | Aspetti visivi | Le iniziali (testo che identifica la persona) non raggiungono 4.5:1. Avatar di default (nessuna variant): light 3.21:1 a 18 px (medium) e 12 px (small); dark 2.18:1 a tutte le misure (anche 24 px large < 3:1). Varianti tinted in dark sotto 4.5:1 per medium/small; accent in light 3.70:1. | src/components/avatar/avatar.styles.ts:30-34 (`neutral-400` / `neutral-0`); :81-109 (tinted `-100`/`-700`) | runtime light: `#ffffff su #889196 = 3.21:1`, `fontSize = 18px` (medium) / `12px` (small); dark: `#0f161a su #464f53 = 2.18:1`; dark tinted: primary 3.49, success 3.66, warning 3.58, accent 3.99, danger 4.12:1; light accent 3.70:1 | WCAG 1.4.3 Contrast (Minimum) (AA) | Default `background-color: var(--sl-color-neutral-600)` (bianco su #555e62 = 6.64:1 in light; in dark #0f161a su #869298 = 5.72:1). Per le tinted in dark usare un primo piano `-800` (o un token dedicato) e verificarlo con `contrast:`. |
| SL-AVATAR-03 | Media | Aspetti visivi | In tema dark l'icona dell'avatar di default (anche quella slottata, es. `briefcase` per "Project Management" nelle docs) ha un contrasto di 2.18:1 sul fondo: un'icona informativa sotto 3:1. | src/components/avatar/avatar.styles.ts:30, 34; avatar.component.ts:95-100 | runtime dark: `contrast:#b >>> .avatar__icon` (`label="Project Management"` + `slot="icon" briefcase`) → `#0f161a su #464f53 = 2.18:1` (light 3.21:1, ok) | WCAG 1.4.11 Non-text Contrast (AA) | Stesso fix di SL-AVATAR-01 (fondo `neutral-600`). |

### Miglioramenti consigliati (non errori)
| ID | Tipo | Descrizione | Evidenza |
|----|------|-------------|----------|
| SL-AVATAR-04 | miglioramento | Rimuovere `ignoredRules = ['color-contrast']` almeno nei test con `initials`: avrebbe intercettato SL-AVATAR-01. | avatar.test.ts:5-7 |
| SL-AVATAR-05 | miglioramento | Regola `forced-colors` (bordo `CanvasText`) per mantenere il contorno del cerchio. | avatar.styles.ts:23-38 |
| SL-AVATAR-V01 | miglioramento | Senza `label` il componente espone `image` senza nome: potrebbe applicare `aria-hidden` (decorativo) o mostrare un warning in dev mode. | avatar.component.ts:106 |

### Responsabilità del consumer
- SL-AVATAR-02: fornire sempre `label`, oppure `aria-hidden="true"` sull'host se l'avatar è affiancato al nome visibile (funziona: verificato a runtime).

### Da verificare con AT reali
- Nessuna verifica rilevante.

### Revisione dei finding precedenti
| ID precedente | Severità prec. | Esito | Motivo |
|----|----|----|----|
| SL-AVATAR-01 | Media | confermato | Misurato: 3.21:1 (light medium/small) e 2.18:1 (dark). |
| SL-AVATAR-02 | Media | riclassificato | Il nome si dà con `label` e il decorativo con `aria-hidden` sull'host (dimostrato): uso del consumer. |
| SL-AVATAR-03 | Media | confermato | Icona in dark 2.18:1, anche con icona informativa slottata (esempio docs). |
| SL-AVATAR-04 | Bassa | riclassificato | Copertura dei test. |
| SL-AVATAR-05 | Suggerimento | riclassificato | Buona pratica forced-colors. |

### API pubbliche a11y
| Property/Attribute | Presente | Propagata correttamente (prova) | Serve davvero? |
|----|----|----|----|
| `label` → `aria-label` | Sì | Sì: `image "User avatar"` | Sì |
| `aria-hidden` sull'host | (nativo) | Sì: avatar escluso dall'albero | Sì, per il decorativo |

### Fix proposti
```css
/* avatar.styles.ts:30-34 */
.avatar {
  background-color: var(--sl-color-neutral-600);
  color: var(--sl-color-neutral-0);
}
/* tinted (dark): primo piano più contrastato, da verificare per ogni variante */
:host([variant='primary']) .avatar { color: var(--sl-color-primary-800); }
```
