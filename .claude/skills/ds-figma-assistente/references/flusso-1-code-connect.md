# Flusso 1 — Verifica Code Connect

Obiettivo: per ogni template Code Connect, dimostrare che **nodo Figma**, **proprietà lette** e **codice emesso**
sono coerenti tra loro e con il componente reale. Il flusso è **in sola lettura**: produce un report. Le correzioni
ai template si fanno solo dopo l'approvazione dell'utente, e il publish lo lancia l'utente.

Input (da configurazione, chiedi solo quelli che mancano):

- cartella dei template (`code_connect.dir`) e cartella dei componenti (`codice.componenti_dir`);
- file DS (`figma.ds_url`);
- facoltativi: documentazione dei componenti (`codice.doc_componenti`) e un elenco di componenti per restringere
  l'analisi (default: tutti).

Prima di cominciare leggi [regole-code-connect.md](regole-code-connect.md), che elenca le classi di bug da cercare.

## 1. Controlli statici (senza Figma)

```bash
python3 <skill>/scripts/cc_inventario.py --json <report_dir>/cc-inventario.json
```

Lo script trova: URL senza node-id, node-id duplicati, fileKey diverso dal DS, `source=` inesistenti, tag fuori dal
manifest, `getEnum` incoerenti nello stesso file. Alla fine stampa l'elenco dei node-id da leggere in Figma.

Poi esegui la validazione indicata in `code_connect.validazione` (es. `npx tsc -p figma`, `npx figma connect parse`).
**Non** lanciare `publish`. Tieni presente che `tsc` e `parse` controllano solo sintassi e struttura. Non trovano un
tipo di proprietà sbagliato, perché quello si vede solo in Figma.

## 2. Proprietà reali da Figma (read-only)

`create_session` sul file DS, poi carica `figma:figma-use` e lancia `use_figma` in sola lettura con i node-id stampati
al passo 1, a blocchi di circa 40:

```js
const ids = [/* "37:65", ... */];
const out = {};
for (const id of ids) {
  const n = await figma.getNodeByIdAsync(id);
  if (!n) { out[id] = null; continue; }
  const owner = n.type === "COMPONENT" && n.parent?.type === "COMPONENT_SET" ? n.parent : n;
  let defs = {};
  try { defs = owner.componentPropertyDefinitions || {}; } catch (e) { out[id] = { name: owner.name, type: owner.type, error: String(e) }; continue; }
  out[id] = {
    name: owner.name, type: owner.type, key: owner.key,
    props: Object.fromEntries(Object.entries(defs).map(([k, v]) => [k.split("#")[0], { type: v.type, options: v.variantOptions }]))
  };
}
return out;
```

Unisci i blocchi in `<report_dir>/figma-props.json` e rilancia:

```bash
python3 <skill>/scripts/cc_inventario.py --figma <report_dir>/figma-props.json --json <report_dir>/cc-inventario.json
```

Ora lo script trova anche: nodi cancellati (URL obsoleti), proprietà inesistenti, tipo sbagliato (`getBoolean` su
una VARIANT `true/false`), `getEnum` non esaustivi o con valori inventati, e valori di variante che corrispondono a una
`@property` riflessa del componente ma non vengono emessi. Se lo script dà `error` su un set, il component set
potrebbe essere in errore (per esempio due varianti con lo stesso nome): segnalalo come P0.

Se c'è anche un Code Connect pubblicato, confronta con `get_code_connect_map` sul file DS. Lo stato "locale" e lo
stato "pubblicato" vanno tenuti distinti: un template corretto in locale ma non ancora pubblicato è
`IN ATTESA DI PUBLISH`, non `OK`.

## 3. Controlli manuali (quello che lo script non vede)

Per ogni template segnalato, e a campione sugli altri:

1. **Attributi e slot emessi ↔ codice**: ogni attributo nello snippet deve essere una `@property` (con `attribute`)
   del componente, ogni `slot="…"` deve esistere tra gli `@slot` del JSDoc. Gli attributi che il componente non
   espone sono bug P1.
2. **Stati semantici** (classe di bug 1 in `regole-code-connect.md`): se una variante `State` contiene `checked`,
   `selected`, `open`, `expanded`, `current`, `active`, verifica nel sorgente se è una `@property` riflessa (va
   emessa) oppure uno `@state()` interno o gestito dal genitore (l'omissione è corretta).
3. **Slot**: `getSlot` su slot con istanze mappate stampa un segnaposto (`<Items />`). Valuta se rendere le istanze
   collegate con `executeTemplate()`. Un `getSlot` chiamato quando la variante non ha lo slot stampa
   `Missing snippet for undefined`.
4. **Helper e istanze annidate** (`iconSlot(...)`, `findInstance(...)`): lo script non li segue, quindi controlla a
   mano i nomi dei layer.
5. **Componenti senza template**: confronta l'elenco dei component set del DS (`get_metadata` o lo script del passo
   2 sulla pagina) con i template. Le icone vanno incluse: senza template, `prefix`/`suffix` che risolvono a
   un'icona non producono codice.
6. **Verifica visiva facoltativa in Dev Mode**: su 2-3 istanze per componente cambia variante e controlla lo snippet.
   Questo controllo lo fa l'utente o si fa via `get_code_connect_map`.

## 4. Report

Scrivi `<report_dir>/code-connect-audit-AAAA-MM-GG.md` con `assets/report-code-connect.md`: riepilogo numerico,
tabella dei problemi (gravità, template:riga, nodo, problema, correzione proposta), non-problemi verificati
(per non riaprirli), limiti della verifica.

## 5. Correzioni (solo su approvazione)

1. Proponi le correzioni raggruppate per tipo e aspetta il sì.
2. Modifica i template e rilancia `cc_inventario.py --figma …` e la validazione, che devono dare 0 P0/P1 sui file
   toccati. Esegui il formatter del repo (es. `npx prettier --check <file>`).
3. Se la correzione richiede di cambiare il **componente Figma** (proprietà mancante, tipo sbagliato), è una
   modifica al DS: proponila e applicala con [flusso-3-html-figma.md](flusso-3-html-figma.md) §Correzione del DS,
   con approvazione separata.
4. Chiedi all'utente di lanciare `code_connect.publish` (`--dry-run` prima, se vuole) dal suo terminale con il
   token. Dopo la conferma, verifica con `get_code_connect_map`.
5. Aggiorna il report: `CORRETTO (in attesa di publish)` → `PUBBLICATO VERIFICATO`.
