## QR Code (`<sl-qr-code>` – src/components/qr-code/qr-code.component.ts)
**Pattern APG di riferimento:** Immagine informativa (`role="img"` + nome); WCAG 1.1.1 Non-text Content
**Esito sintetico:** ⚠️ Parzialmente conforme
**Conteggio finding:** Blocker 0 · Alta 0 · Media 1 · Bassa 2 · Suggerimento 1

Il `<canvas>` ha `role="img"` e un `aria-label` (r. 72-76), con nome che si può passare da fuori tramite `label` ✅. Il fallback sul `value` produce però nomi poco utili (URL letti carattere per carattere) e diventa un nome vuoto quando `value` è vuoto. Il nome inoltre non dice che si tratta di un QR code.

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `<canvas role="img">` (r. 75): corretto per una grafica informativa. Host senza ruolo. |
| 2 | Nome, descrizione, stato | ⚠️ | `aria-label=${label || value}` (r. 76). Il fallback su `value` è un dato grezzo (URL, vCard, stringhe Wi-Fi…), non un'alternativa che ne descriva lo scopo (SL-QR-CODE-01). Con `value=""` il risultato è `aria-label=""` su `role="img"`: immagine senza nome (SL-QR-CODE-02). |
| 3 | Shadow DOM e riferimenti ARIA | ⚠️ | Il nome sta sul canvas interno ed è passabile solo con `label` ✅. Un `aria-label` scritto sull'host resta sull'host (shared §2). Nessun riferimento ID. |
| 4 | Tastiera e focus | N/A | Non interattivo. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | Quando `value` cambia si aggiorna il nome, senza annunci (comportamento corretto per un'immagine). |
| 7 | Aspetti visivi | ⚠️ | Default `fill="black"` su `background="white"`: 21:1 ✅. Con colori del consumer, o con `background="transparent"` su un tema scuro (moduli neri su `neutral-0` dark), contrasto e leggibilità del codice sono NON VERIFICABILI (SL-QR-CODE-03). `fill`/`background` non accettano custom property (r. 33-37), quindi il QR non segue il tema. Il canvas non viene alterato in `forced-colors` ✅. Dimensione fissa in px (r. 78-79). |
| 8 | API pubblica a11y | ⚠️ | `label` presente e propagata al canvas ✅. Nessun prefisso localizzato tipo "QR code" e nessun warning se manca `label`. |
| 9 | Documentazione e test | ⚠️ | Test axe con `value` (test r. 104-108) e test su label e fallback (r. 110-120) ✅. Non c'è un test con `value` vuoto. Le docs usano `label` solo nel primo esempio e non spiegano quanto conta (SL-QR-CODE-04). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-QR-CODE-01 | Media | 2 / 8 | Senza `label`, il nome accessibile è il `value` grezzo, per esempio "https://shoelace.style/" letto per esteso o un payload lungo (vCard, `WIFI:S:…;T:WPA;P:…`). Non descrive lo scopo, non dice che è un QR code e può esporre dati sensibili come le password Wi-Fi. Questo vale per quasi tutti gli esempi delle docs (consumer + default). | src/components/qr-code/qr-code.component.ts:76 `aria-label=${this.label?.length > 0 ? this.label : this.value}` | WCAG 1.1.1, 4.1.2 | Nome di default localizzato "Codice QR" + `label`. Warning in dev se manca `label`. Documentare che `label` deve descrivere scopo e destinazione. |
| SL-QR-CODE-02 | Bassa | 2 | Con `value=""` (default, r. 25) e senza `label`, il canvas ha `role="img"` con `aria-label=""`: un'immagine senza nome, segnalata da axe (`role-img-alt`). | qr-code.component.ts:25 `value = ''`; :75-76 | WCAG 1.1.1, 4.1.2 | Se non ci sono né `label` né `value`, rendere il canvas `aria-hidden="true"` oppure usare il nome di default localizzato. |
| SL-QR-CODE-03 | Bassa | 7 | Il contrasto tra i moduli dipende interamente dalle props `fill`/`background` scelte dal consumer, senza alcuna guida. Con `background="transparent"` il QR prende lo sfondo della pagina: in tema dark i moduli neri di default finiscono su `hsl(200 26% 8%)` e il codice diventa illeggibile e non scansionabile (consumer). | qr-code.component.ts:33-37 `fill = 'black'`, `background = 'white'` (commento: non accetta custom property) | WCAG 1.4.11 | Documentare il contrasto minimo (≥3:1, consigliato ≥7:1 per la scansione) e sconsigliare `transparent` nei temi scuri. |
| SL-QR-CODE-04 | Suggerimento | 9 | Le docs non spiegano che il contenuto del QR è accessibile solo a chi può scansionarlo: chi non può (screen reader, ipovisione, desktop senza fotocamera) ha bisogno dell'equivalente testuale visibile (link/testo) accanto al codice (consumer). | docs/pages/components/qr-code.md:12, 80-126 (esempi senza `label`) | WCAG 1.1.1 (alternativa equivalente), buona pratica | Sezione "Accessibility": `label` obbligatoria in pratica + mostrare `value` come link o testo vicino al QR. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `label` | Sì | Sì (`aria-label` sul `<canvas role="img">`) | Aggiungere il fallback localizzato "Codice QR" al posto del `value` grezzo. |
| `role` | Fisso `img` sul canvas | Sì | Corretto. |
| `aria-hidden` / decorativo | No | — | Utile per QR duplicati di un link visibile: `decorative` → `aria-hidden="true"`. |

### Fix proposti
```ts
import { LocalizeController } from '../../utilities/localize.js';
private readonly localize = new LocalizeController(this);

/** Nasconde il QR alle AT quando lo stesso contenuto è già disponibile come testo/link adiacente. */
@property({ type: Boolean }) decorative = false;

render() {
  const name = this.label?.trim() || this.localize.term('qrCode'); // nuova chiave: en "QR code", it "Codice QR"
  return html`
    <canvas
      part="base"
      class="qr-code"
      role=${this.decorative ? 'presentation' : 'img'}
      aria-hidden=${this.decorative ? 'true' : nothing}
      aria-label=${this.decorative ? nothing : name}
      style=${styleMap({ width: `${this.size}px`, height: `${this.size}px` })}
    ></canvas>
  `;
}

updated() {
  if (!this.decorative && !this.label) console.warn('<sl-qr-code>: imposta "label" con lo scopo del codice (es. "Codice QR: apri shoelace.style").');
}
```

### Non verificabile
- Contrasto e scansionabilità con i `fill`/`background` scelti dal consumer.
- Annuncio reale del canvas `role="img"` con i vari screen reader (atteso: "<label>, immagine").
