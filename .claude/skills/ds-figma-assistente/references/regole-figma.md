# Regole Figma: MCP, Plugin API e problemi noti

Raccolta delle regole emerse nei lavori precedenti. Valgono per qualunque DS. Se trovi un problema nuovo e
generale, aggiungilo qui; se riguarda solo il progetto, mettilo nei `riferimenti_progetto`.

## Sessione e chiamate

- `create_session` con la fileKey prima di ogni altro tool sul file; riusa il `sessionId`.
- Prima di `use_figma` carica `figma:figma-use` (+ `figma-generate-design` per le schermate, `figma-generate-library`
  per i componenti). Passa i nomi in `skillNames`.
- `await figma.setCurrentPageAsync(page)` prima di lavorare su una pagina. Le pagine si caricano in modo
  incrementale.
- Una chiamata = una regione o un componente. Deve poter essere rilanciata senza danni e deve restituire gli id
  creati o modificati.
- Uno script che lancia un errore viene **annullato per intero**: rileggi lo stato prima di riprovare.
- `search_design_system` (con la library key del DS) come prima ricerca di componenti, variabili e stili.

## Scansione della pagina di destinazione (read-only)

```js
const page = await figma.getNodeByIdAsync('<pagina>');
await figma.setCurrentPageAsync(page);
const wrappers = page.children.flatMap(n => (n.type === 'SECTION' ? n.children : [n])).filter(n => n.type === 'FRAME');
return wrappers.map(w => {
  const old = w.children.find(c => c.name === 'OLD'),
    neu = w.children.find(c => c.name === 'NEW');
  return {
    wrapper: w.id,
    name: w.name,
    y: Math.round(w.y),
    h: Math.round(w.height),
    old: old && { id: old.id, image: !!old.findOne(n => n.fills?.some?.(f => f.type === 'IMAGE')) },
    new: neu && { id: neu.id, frame: neu.children.find(c => c.name.startsWith('NEW'))?.id }
  };
});
```

## Costruzione

- Proprietà: chiave completa con `#id` per TEXT/BOOLEAN/INSTANCE_SWAP, nome semplice per VARIANT.
  ```js
  const k = (inst, prefix) => Object.keys(inst.componentProperties).find(x => x.startsWith(prefix));
  inst.setProperties({ State: 'active' }); // prima le varianti…
  inst.setProperties({ [k(inst, 'Icon#')]: true }); // …poi il resto, rileggendo le chiavi
  ```
- `setProperties` **rigenera gli id dei figli** delle istanze annidate: ricerca i nodi per nome dopo ogni chiamata.
- Variante e testi nella stessa chiamata possono fallire ("Could not find a component property"): prima la variante,
  poi rileggi `componentProperties`.
- "Unable to find a variant with those property values" significa che la combinazione non esiste: leggi i nomi
  delle varianti (`mainComponent.parent.children.map(c => c.name)`).
- `appendChild` dentro un'istanza funziona solo in uno **SLOT**.
- `layoutSizing* = "FILL"` solo dopo `appendChild` in un auto-layout; `resize()` prima dei sizing mode.
- Un overlay (scrim, dialog, drawer, menu aperto) dentro un frame auto-layout va con
  `layoutPositioning = "ABSOLUTE"`, altrimenti finisce in coda e allunga il frame.
- I nuovi figli di un componente auto-layout che devono sovrapporsi vogliono anch'essi `ABSOLUTE` + x/y.
- Componenti senza proprietà di testo: scrivi nei layer che Code Connect legge (`findText`). Un `setProperties` con
  chiavi inventate non fa nulla e non dà errore.
- Testi: carica i font di tutti i segmenti (`getStyledTextSegments(["fontName"])` + `loadFontAsync`). Un testo che
  resta tagliato dopo un cambio di `characters` si sistema riassegnandolo (vuoto → testo) e riapplicando i font.
- `figma.createAutoLayout()` crea un frame con **fill bianco**: per un contenitore di solo layout (header di pagina, riga) fai `fills = []`, altrimenti nello screenshot compare una banda bianca.
- Le istanze `Tab` dentro un Tab Group, e in generale i figli non-slot di un'istanza, **non si rimuovono** (`Removing this node is not allowed`): si nascondono con `visible = false`. Quelli dentro uno SLOT si rimuovono.
- Dopo `setProperties` o una modifica di testo i riferimenti ai figli di un'istanza possono diventare invalidi (`The node with id … does not exist`): rileggi i nodi dal contenitore prima di leggere le proprietà.
- Input/Select: dopo un `resize` o un `FILL` (clone o istanza nuova) il bordo può restare disegnato alla larghezza vecchia anche se `base.width` e `absoluteRenderBounds` sono giusti: **fidati dello screenshot, non dei dati**. Rimedio verificato: `layoutSizingHorizontal = "FIXED"`, `resize(w - 1)`, `resize(w)`, di nuovo `FILL`, poi `node.screenshot()` del contenitore.
- Un wrapper appena clonato (`clone()` di un frame che contiene istanze con slot) non è navigabile con `findOne` nella **stessa** chiamata (restituisce `null` dentro gli slot): clona in una chiamata, adatta nella successiva usando gli id restituiti.
- Dopo `setProperties` su un'istanza dentro uno slot, anche il **genitore** può diventare un riferimento vecchio (`indexOf` = -1, `children` senza il nodo): rileggi il contenitore partendo da un nodo stabile (id del wrapper o del dialog) prima di `insertChild`/`remove`.
- **Altezza dei frame NEW**: l'utente può allungarli di proposito (es. per mostrare tutto il contenuto). Un frame più alto di 1000 in una pagina **già esistente** non si riporta a 1000 senza chiedere. Vale solo per i frame che crei tu: se un clone eredita `Page`/Tab Group/`Workspace` in altezza fissa o HUG e supera l'HTML, sistemalo in quel frame (FILL, `Workspace` all'altezza del DOM) e dillo.
- Il layout di uno **SLOT** in un'istanza (`layoutMode`, gap) non accetta override: l'assegnazione non dà errore ma non resta. Per impilare più istanze in uno slot orizzontale (es. Tag nella Table Cell composite) mettile in un frame auto-layout figlio (`Tag stack`, VERTICAL, gap legato alla variabile).
- Un'istanza in uno SLOT con contenuto "hug" (es. il Panel di un Tab Group) non riempie la larghezza: imposta `layoutSizingHorizontal = "FILL"` sia sullo slot sia sul figlio.
- `clone()` di un nodo **dentro un'istanza** lo crea al primo livello della pagina: se poi l'`appendChild` fallisce (`New parent is an instance`) resta un nodo sciolto. Non provare ad aggiungere figli non-slot a un'istanza (es. più Tab di quelle del master) e, se un `try/catch` ha inghiottito l'errore, cerca e rimuovi il clone.
- Un frame con altezza FIXED può comunque crescere quando ci metti contenuto più alto (es. pagina con scroll nell'HTML): dopo la costruzione rifai `resize(1600, 1000)` sul frame NEW e controlla l'altezza della colonna `NEW` del wrapper (label + 12 + 1000 = 1029).
- Dopo aver svuotato `Header Actions` o spento l'icona di una **Card**, la linea sotto l'header può restare corta (layout non ricalcolato) anche se le misure sono giuste: porta il frame header e il testo `Card header` a `FIXED`, `resize`, poi di nuovo `FILL`. Confronta i pixel dello screenshot, non le misure.
- Select `Multiple=true` (dal 2026-10-28): i tag sono istanze **Tag** nello slot `Tags` (svuotalo e metti un Tag removable per valore, size uguale al Select); con valori spegni `Show Placeholder`. Multi-select vuoto: `Multiple=true`, slot `Tags` vuoto, `Show Placeholder=true`.
- Il master **Table** ha le Table Column direttamente nello slot `Rows` (nessun frame `Columns`: quello presente in alcune pagine è stato aggiunto a mano). La variante colonna `Kind=actions` esiste solo con `Align=center`. La colonna ⋮ (`Kind=actions`) va sempre con `Sticky=true`, come `sticky-actions` nell'HTML (utente, 2026-11-10).
- **Avatar ridimensionati**: mai fare `resize` di un Avatar per cambiarne la misura (il testo resta alla misura della variante e esce dal cerchio: 125 header con `Size=medium` a 24 px, segnalato dall'utente 2026-11-10). Si cambia la variante `Size` (24 px = `small`, es. account dell'Header). Dopo aver costruito un header, controlla che nessun Avatar abbia `fontSize` > 60% della larghezza.
- Variabili e stili dalla libreria: `figma.variables.importVariableByKeyAsync`, `importStyleByKeyAsync`, poi
  `setBoundVariable`. Mai valori fissi.
- Icone: solo componenti icona del DS, importati per key (`importComponentByKeyAsync`). Mai `createNodeFromSvg` nel
  file di progetto. Se un'icona manca o è rotta nel DS, è un gap DS: il path di riferimento sta nel pacchetto di icone
  del codice (es. `node_modules/bootstrap-icons/icons/<nome>.svg`).

## Istanze e swap

- `setProperties` su un INSTANCE_SWAP può aggiornare il valore senza cambiare l'icona visibile (swap locale
  ereditato da un clone). Verifica `findOne(INSTANCE).mainComponent` e, se serve, usa `swapComponent()` sull'istanza
  annidata. Dopo un cambio di `Size`/`Variant` l'override può tornare indietro: controlla sullo screenshot.
- Lo swap dell'icona può azzerare fill applicati come override: riapplicali legando la variabile.
- Ricreando il contenuto di uno slot, salva e riapplica gli override di colore dei vettori.
- Legando `componentPropertyReferences.mainComponent` a un'istanza nuova, Figma mostra il `defaultValue` della
  proprietà: aggiorna prima il default con `editComponentProperty`.
- Nello **stesso** file del componente, `importComponentByKeyAsync` / `importComponentSetByKeyAsync` possono
  restituire dati incompleti: usa `getNodeByIdAsync(id).createInstance()`.
- Le istanze cross-page possono avere `.children` vuoti se non sono caricate sia la pagina sorgente sia quella di
  destinazione. Anche un'istanza `visible: false` può sembrare vuota in lettura: per verificare, mostrala e poi
  rinascondila.
- `getNodeByIdAsync` con l'id breve di un nodo dentro lo slot di un'istanza restituisce `null`: usa l'id completo
  (`I<istanza>;…`) o `findOne` dal frame.
- Spostare un wrapper in una SECTION cambia gli id dei nodi interni: ritrovali per nome partendo dal wrapper.

## Ricette sul master (file DS, solo dopo approvazione)

- **Ogni proprietà deve restare usata.** Se sposti un binding (es. `visible`) da una proprietà a un'altra, la vecchia resta senza riferimenti e il publish la blocca ("Invalid assets · Unused properties"). Prima di chiudere un fix, controlla che ogni proprietà non-VARIANT del set compaia in `componentPropertyReferences` di almeno un nodo.
- **Un auto-layout non si restringe se i figli sono nascosti o lo slot è vuoto**: conserva l'ultima misura. Per far sparire un gruppo, nascondi il nodo **esterno**, non quello interno.

1. Leggi il codice del componente (sorgente + stili) per sapere come gestisce davvero il caso.
2. Baseline: id, key, `componentPropertyDefinitions` del set.
3. Modifiche **in-place**:
   - booleano: `const k = set.addComponentProperty("Show X", "BOOLEAN", true); layer.componentPropertyReferences = { ...layer.componentPropertyReferences, visible: k };`
   - instance swap: `addComponentProperty("X", "INSTANCE_SWAP", idDefault)` + riferimento `mainComponent`;
   - slot: `addComponentProperty("X", "SLOT", "")` + frame con `componentPropertyReferences = { slotContentId: k }` in
     ogni variante;
   - layout: `resize`, sizing `AUTO` / `FILL`, **una variante alla volta controllando le altre** (un `FILL` giusto per
     una variante può rompere un'altra);
   - colori e gap: variabili locali del DS (`getLocalVariablesAsync`).
   - slot che a vuoto resta 100×28 (clip attivo): `layoutSizing* = FIXED`, `resize(1, 1)`, poi `HUG` e `clipsContent = false`: a vuoto resta 1×1, con un figlio si adatta. Verificalo con un'istanza temporanea (a vuoto e con un figlio) e rimuovila.
   - padding diverso tra due modalità di un booleano (es. Tab flat 8 / card 12): il padding non si lega a una proprietà; metti il padding minimo e aggiungi un layer spaziatore (rettangolo 0.01×N, senza fill) con `visible` legato al booleano, che alza la riga.
   - testi senza stile con altezza automatica (17 invece di 21): crea o riusa un text style legato alle variabili (`setBoundVariable` su fontSize/fontWeight/fontFamily) e applicalo a tutte le varianti; prima confronta riga e peso con gli stili calcolati del codice, non con l'aspetto.
4. Le proprietà che pilotano la visibilità di un figlio **devono** essere BOOLEAN. Le VARIANT `true/false` vanno bene
   solo per stati informativi. In ogni caso il template Code Connect deve usare il getter giusto.
5. Una proprietà booleana non può ridimensionare: i casi che cambiano dimensione o orientamento (bottone cerchio,
   drawer laterale) richiedono varianti vere o un designer.
6. **Mai delete + create**: cambia il node-id e la key. Se è inevitabile (es. sostituire un'icona finta), cerca subito
   nei template `grep -rn "node-id=<vecchio-id con ->"` e aggiornali **prima** del publish di Code Connect.
7. Verifica: key invariata, istanza temporanea con le nuove proprietà + screenshot del set, poi rimuovi l'istanza.
8. Un component set con due varianti dallo stesso nome è in errore e le sue proprietà diventano illeggibili:
   rinomina la duplicata.

## Verifica

- `get_screenshot` può restituire un'immagine vecchia subito dopo una modifica: se contraddice i dati
  (`absoluteRenderBounds`, `visible`), rifallo.
- Inventario numerico (adatta i nomi al DS):
  ```js
  const root = await figma.getNodeByIdAsync('<frame NEW>');
  return {
    istanze: root.findAll(n => n.type === 'INSTANCE').length,
    nonIstanze: root
      .findAll(n => ['RECTANGLE', 'VECTOR'].includes(n.type) && !n.parent?.type?.includes('INSTANCE'))
      .map(n => [n.id, n.name])
      .slice(0, 20),
    testiDefault: root
      .findAll(
        n =>
          n.type === 'TEXT' && n.visible && /placeholder|lorem|^button$|^label$|cell text|^column$/i.test(n.characters)
      )
      .map(n => [n.id, n.characters])
  };
  ```
  `testiDefault` deve essere vuoto.
- Screenshot HTML: ridimensiona il browser **dopo ogni navigazione** (la navigazione lo riporta alla dimensione
  predefinita) e controlla `innerWidth` prima di misurare. Le classi di layout dentro lo shadow DOM non si applicano:
  usa `getComputedStyle` sull'elemento.

## Caricare immagini (OLD)

`upload_assets` con `nodeIds` del frame e `scaleMode: "FIT"` → `curl -s -X POST "<submitUrl>" -F "file=@<png>"` deve
rispondere `"success":true`. L'URL vale una sola volta: se fallisce, richiedi un nuovo `upload_assets`. Poi verifica
il fill `IMAGE`.

## Slot nelle istanze (aggiunto 2026-10-28)

- `layoutMode`, `primaryAxisSizingMode` e simili su uno **SLOT dentro un'istanza** vengono ignorati senza errore (es.
  impilare due Tag in una Table Cell composite). Per cambiare la disposizione metti nello slot un frame
  `createAutoLayout("VERTICAL")` con `fills = []` e gap legato a una variabile DS, e sposta lì i figli.
- Subito dopo l'aggiornamento della libreria nel file di progetto, `node.screenshot()` dentro `use_figma` può
  rendere un'icona appena scambiata con la geometria vecchia (tagliata o deformata). Prima di correggere, controlla i
  dati (`mainComponent`, misure, `overrides`) e rifai la prova con `get_screenshot`, che usa il renderer del server.

## Riferimenti e slot (aggiunto 2026-10-28)

- Dentro lo slot di un'istanza, **spostare** un nodo in un frame nuovo (`appendChild`) e cambiare un testo con
  `characters` invalidano gli id dei nodi vicini (`The node with id … does not exist`, e lo script si annulla per
  intero). Ordine sicuro: prima le modifiche di struttura (rimozioni, spostamenti) rileggendo ogni nodo dal
  contenitore stabile con una funzione (`const q = pred => card().findOne(pred)`), poi i testi, per ultimi i
  `setProperties`.
- Un'istanza da riusare in un'altra riga (es. il Button `Edit`) va messa in un frame temporaneo **prima** di
  rimuovere la riga che la contiene, poi spostata nella cella nuova; infine si toglie il frame temporaneo.

## Verifica nel contesto (aggiunto 2026-10-29)

- Dopo aver inserito istanze nuove (es. Details) in un frame dentro uno SLOT, il frame può restare con larghezza e x
  vecchie (Fields 238 px a x 630), anche se `node.screenshot()` della sola card sembra corretto. La verifica finale
  si fa sempre con `get_screenshot` del **wrapper** sulla pagina, mai con lo screenshot isolato del nodo. Per
  sistemare: `FIXED` → `resize` → `FILL` sul frame e sui figli (anche sul `Frame` header di ogni Details).
- Prima di cercare nodi dentro gli slot con `findOne`/`getNodeByIdAsync`, fai `setCurrentPageAsync` sulla pagina del
  frame: da un'altra pagina i nodi negli slot risultano `null`.
- Un frame creato con `figma.createAutoLayout()` ha uno sfondo bianco di default: nelle card disegna linee grigie ai
  bordi. Nei frame di layout metti sempre `fills = []` subito dopo averli creati.
- Un'istanza in un frame a larghezza `FIXED` più stretto (es. Radio Group 118 px in "Operator" da 117) perde il bordo
  destro: i contenitori dei controlli vanno in `HUG` con `clipsContent = false`.
- **Radio Group `Type=button`** (dal 2026-10-29, dopo il publish): il Radio Button ha la variante `Position`
  (`alone · first · middle · last`), che corrisponde a `data-sl-button-group__button--first/inner/last` del codice
  (in Code Connect non si mappa). In ogni gruppo imposta `Position` per indice: primo `first`, ultimo `last`, gli altri
  `middle`. Niente ritocchi manuali agli angoli: quelli fatti prima del publish vanno sostituiti da `Position`.

## Varianti nuove e slot (aggiunto 2026-10-29)

- `clone()` di una variante con slot restituisce un FRAME al posto dello SLOT (vedi `SlotNode.clone` nella Plugin API):
  la variante nuova perde lo slot e, nei file che la usano, il cambio di variante sostituisce il contenuto con quello
  di default (dati persi). Dopo ogni `clone()` di variante ricrea lo slot: `variant.createSlot()`, copia il layout
  dello slot originale, sposta i figli, `componentPropertyReferences = { slotContentId: '<prop>' }`, rimuovi il frame.
  Attenzione: `createSlot()` crea anche una proprietà SLOT nuova con lo stesso nome ("Conflicting property names" al
  publish): dopo aver collegato lo slot alla proprietà esistente, elimina quella nuova con `deleteComponentProperty`.
  La proprietà nuova si chiama `Slot#…` ma **cambia nome quando rinomini lo slot** (es. `Tags#…`), e a volte sparisce
  da sola: alla fine, elimina le proprietà SLOT del set che nessun layer referenzia (raccogli i valori di
  `componentPropertyReferences` di tutto il set), controllando l'esistenza prima di ogni `deleteComponentProperty`.
  Non confrontare le chiavi "prima/dopo" senza filtro: include anche gli assi VARIANT appena aggiunti (es. `Status`).
  Copia anche `layoutGrow`/`layoutAlign` dello slot originale (2026-10-30, Select `Status`).
- `clone()` di una variante perde anche i `componentPropertyReferences` (testi legati a TEXT, `visible` legato a
  BOOLEAN): nelle istanze i valori tornano al default. Copia i riferimenti dalla variante gemella, layer per layer.
- Prima del publish confronta, variante nuova e gemella, `componentPropertyDefinitions` (nessuna proprietà doppia) e
  i riferimenti di ogni layer; verifica `type === 'SLOT'` sugli slot.
- Prima di cambiare una variante su istanze con contenuto negli slot (es. Table Column `Size`), salva i valori
  (testi delle celle) e verifica dopo il cambio che siano rimasti; se non ci sono, ripristinali dai dati della pagina.
- Spostare un nodo **fuori** da uno slot di un'istanza (`insertChild` in un frame normale) lascia riferimenti non
  validi: clona il nodo, inserisci il clone e rimuovi l'istanza contenitore (es. Tab Group → pannello nella pagina).

## Figli nascosti nel master (aggiunto 2026-10-29)

- Un figlio istanza aggiunto al master con `visible = false` e **senza** proprietà BOOLEAN collegata non compare nelle
  istanze (né in `children` né per id `I<istanza>;<id>`): non si può rendere visibile. Ogni figlio opzionale va
  pilotato da un BOOLEAN (`componentPropertyReferences.visible`), come le Tab 5–7 del Tab Group.
- Un testo dentro un'istanza a cui hai messo `visible = false` (es. il `Value` di un Description List Item con
  componente nel `Value Suffix`) non torna raggiungibile con `findOne` né riappare con `setProperties`: per riusare
  l'item senza componente, crea un'istanza nuova del master invece di clonare quella modificata (2026-10-29).

## Istanze clonate con slot: letture "aliasate" (aggiunto 2026-10-30)

- Dopo più `clone()` della stessa istanza con slot (es. tre Table dalla stessa tabella d'esempio) e modifiche negli
  slot, il plugin può leggere un'istanza come se fosse un'altra (nome e figli sbagliati) mentre `get_metadata` e lo
  screenshot sono corretti. Non fidarti di `children`/`findOne` in quel caso: prendi gli id completi `I<istanza>;…`
  da `get_metadata` e lavora con `getNodeByIdAsync` su quelli (uno spostamento o una rimozione per nodo).

## Stepper (aggiunto 2026-11-02)

- Il master `Stepper` ha i `Step` nello slot `Steps`: in un'istanza si aggiungono con `slot.children[0].mainComponent.createInstance()` + `appendChild` nello slot, poi `layoutSizingHorizontal = "FILL"` (il primo resta HUG).
- Il numero nell'indicatore è un **testo fisso della variante** (current "2", upcoming "3"): va impostato per posizione (`indicator` → TEXT = indice + 1). Nei passi `complete` resta il segno di spunta.
- `setProperties` su un `Step` cambia gli id dell'`Stepper`: non riusare l'id tra una chiamata e l'altra, ritrovalo dal dialog con `findOne(n => n.type === "INSTANCE" && n.name === "Stepper")`.
- Ordine: prima `State`, poi `Show Description` / `Show Connector` (false sull'ultimo) / `Error`, per ultimi i testi.
- Sostituire un Tab Group con un contenuto: `clone()` del frame del pannello (finisce in pagina), `appendChild` nel frame `Wizard` dentro lo slot `Body`, poi `remove()` del Tab Group; il footer si costruisce clonando il Button `Cancel` (non ha spaziatore: i bottoni sono tutti a destra).

## Cloni in blocco e valori dei campi (aggiunto 2026-11-06, CoSy-STQ)

- Clonare N wrapper e modificarli nella **stessa** chiamata fallisce (`findOne` restituisce `null` dentro gli slot dei cloni): prima una chiamata che clona tutti i wrapper e restituisce gli id, poi una seconda che li adatta.
- Dopo `setProperties` su un'istanza, un nodo rinominato nella stessa chiamata può non essere più trovabile per nome: ritrova i figli per **posizione** (`row.children[i]`) partendo dal contenitore, e rinomina per ultimo.
- Select/Input con valore (dal 2026-11-06): `Show Placeholder` spento, `Show Value` acceso e il testo nella proprietà `Value` (layer `Value`, colore `neutral/700` = `--sl-input-color`). Nella Select `Show Placeholder` nasconde tutto il frame `Display`: il valore sta nel frame gemello `Value display`. Non scrivere più il valore nel layer del placeholder.
- Textarea in un form HUG: il frame `field` è FILL e collassa a 1px; dai all'istanza un'altezza FIXED (es. 107 per `rows="3"`).
- Tabella in un contenitore HUG (es. Attachments nel Detail Panel): `layoutSizingVertical = "FIXED"` con l'altezza toolbar + header + righe, altrimenti collassa.
- Tab Group con più di 4 tab: le proprietà booleane `Tab 5/6/7` aggiungono le tab (non serve un gap DS).
- Clonare una variante per aggiungere un asse **perde** i `componentPropertyReferences` delle istanze annidate (es. l'INSTANCE_SWAP dell'icona): dopo il clone ricollegali (`ic.componentPropertyReferences = { mainComponent: '<Prop>#id' }`) e prova lo swap su un'istanza temporanea.

## Avvolgere contenuti esistenti in un componente (aggiunto 2026-11-09, sezioni di form → Card)

Caso tipico: una pagina già fatta cambia layout (es. le sezioni di un form diventano card) e va aggiornata in-place.

- **Un nodo dentro lo slot di un'istanza non si sposta in un'altra istanza**: `appendChild` lo ricrea con un id nuovo
  e la riga dopo fallisce con "node does not exist" (la chiamata viene annullata per intero). Procedura: inserire
  l'istanza nuova con `insertChild(idx, …)` (`idx` con `findIndex` per id: `indexOf` restituisce −1 sui nodi annidati
  in istanza), **rileggerla** da `parent.children[idx]`, **clonare** il contenuto nello slot, rimuovere l'originale
  ritrovandolo per nome/struttura. Ogni id va riletto dopo ogni spostamento.
- **Il clone eredita il sizing del vecchio contesto**: dentro lo slot del nuovo componente impostare
  `layoutSizingHorizontal = "FILL"` e `layoutSizingVertical = "HUG"` (un FILL verticale in uno slot HUG collassa a
  pochi pixel).
- **Il padding del nuovo contenitore riduce la larghezza**: i figli `FIXED` calcolati sulla griglia a colonne vanno
  ricalcolati (span = `round((w+gap)/(colVecchia+gap))`, nuova w = `span·colNuova + (span−1)·gap`). Cercare le righe
  in cui la somma dei figli supera la larghezza e i figli isolati fuori griglia; restituire span prima/dopo.
- **I contenitori HUG crescono** (un dialog si allunga e il footer esce dal frame): applicare il limite dell'HTML
  (`max-height` → altezza FIXED + corpo FILL con clip) e ricentrare.
- Elementi affiancati in una grid HTML (stessa altezza per `align-items: stretch`): `layoutSizingVertical = "FILL"`.
- Prima scansione read-only su tutte le pagine coinvolte (titoli dall'HTML → nodo in Figma); le sezioni non trovate di
  solito sono fuori dallo stato disegnato (tab non attiva, parte tagliata dallo scroll): non vanno aggiunte.

- **Mai `clone()` di un sotto-layer di un'istanza preso da un altro frame** (es. la colonna `Selection` della tabella di S2) per inserirlo in uno SLOT di un'altra istanza: la struttura risulta corretta, ma nel render della pagina intera la copia esce vuota o fuori posto, e lo screenshot del solo nodo può sembrare giusto. Crea invece un'istanza nuova dalla variante del master (`(await old.getMainComponentAsync()).parent` → variante giusta → `createInstance()`) e poi imposta le proprietà (2026-11-09, segnalato dall'utente sulla Clipboard).
- Dopo una modifica dentro una tabella o un altro slot, verifica sempre con lo screenshot del **frame intero della pagina**, non solo del nodo modificato: i due render possono non coincidere.
- **Dopo "Update" della libreria nel file di progetto** le istanze possono mantenere il layout precedente anche se il componente è già quello nuovo (es. un frame aggiunto al master che resta in mezzo alla voce, misure vecchie). Prima di misurare forza il ricalcolo: `setProperties` di un BOOLEAN avanti e indietro sulle istanze toccate, e per Input/Divider la ricetta FIXED → `resize(w-1)` → `resize(w)` → `FILL` (2026-11-09).
- **Margini che nel codice collassano** (elementi block con margini verticali consecutivi, es. `sl-input` e `sl-divider` dentro `sl-menu`): in Figma padding e spaziature si sommano. Riproduci lo spazio reale misurato nel browser, togliendo uno dei due (es. `paddingBottom = 0` sul frame del campo).
- **Prima di proporre una correzione al master per una differenza di testo** (dimensione, interlinea), confronta l'istanza con il master: spesso è un override locale ereditato da una pagina clonata. Conta quante istanze nel file hanno lo stesso scarto (es. testi `Meta` con `fontSize !== 14`): se è solo una, si corregge l'istanza, non il master (2026-11-10, Detail Panel della Clipboard).
- **Non riassegnare a un INSTANCE_SWAP il componente che ha già** (es. `Icon` = la stessa icona di default del master): lo swap azzera gli override annidati, compreso il colore dell'icona impostato nel master. Imposta lo swap solo quando l'icona cambia (2026-11-10, Stat primary della Dashboard).

## Slot di dimensione fissa (aggiunto 2026-11-12, Split Panel)

- Larghezza, altezza e min-size di uno **SLOT** non si sovrascrivono nell'istanza (`resize` non ha effetto, `minWidth` dà "cannot be overridden in an instance"). Se la misura dello slot deve cambiare da istanza a istanza (es. posizione di uno split), nel master lo slot va in **HUG** (con un `minWidth` di riserva): la misura la dà il contenuto messo nell'istanza.
- Nello slot `Items` della Description List invece `itemSpacing` si può sovrascrivere (8 = gap del codice tra le righe).
- I figli nascosti con `visible = false` di un'istanza (es. la 4ª Tab del Tab Group) poi non si ritrovano più nei `children`: per mostrare una tab in più usa i booleani `Tab 5/6/7`.

## Tabelle vuote, Tab Group clonati, multi-select (aggiunto 2026-11-12, xCPage-UserManagement)

- **Tabella vuota con intestazioni** (empty state sotto le colonne, come `sl-table` senza righe): `Show Rows` resta
  `true`, `Show Empty` = `true`; si rimuovono le celle visibili da ogni slot `Cells` (la cella template nascosta
  resta), ogni colonna `resize(w, 40)`, il frame `Columns` in `HUG` e lo slot `Empty` in `FILL`. Con `Show Rows=false`
  sparisce anche la riga delle intestazioni.
- Dopo un `setProperties` sulla Table, `findOne('Columns').children` può risultare vuoto (lettura aliasata) mentre le
  celle ci sono: rimuovi le celle per id completo preso da `get_metadata` (`I<table>;<slot Rows>;<colonna>;<slot Cells>`).
- **Clonare un Tab Group** con tab nascoste via override perde quelle tab (non tornano visibili): per un Tab Group
  con tab diverse crea un'istanza **fresca** del master, clona il contenuto del pannello nello slot `Panel` e metti
  `FILL` sia sullo slot sia sul contenuto (altrimenti il pannello resta largo 378 px).
- **Select `Multiple=true`**: con i Tag nello slot, `clear-group` ed `expand-group` restano attaccati ai tag invece che
  al bordo destro. Metti `tags-group.layoutSizingHorizontal = "FILL"` sull'istanza.
- Cella con icona + testo (es. nome utente con `person-fill`): `Table Cell` `Type=document` con `File type` (swap
  dell'icona) e `Meta 1/2` vuoti; il layer `Reference` vuoto va nascosto, altrimenti il testo sale.
