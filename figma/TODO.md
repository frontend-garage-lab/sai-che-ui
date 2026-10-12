# Figma Code Connect — da aggiornare prima della prossima release

## Variante `card` su `sl-tab` (Workflow Stage Tab)

In `src/components/tab` è stata aggiunta la proprietà booleana `card` (vedi `tab.component.ts` / `tab.styles.ts`) per
supportare il pattern "Workflow Stage Tab" del file `xCPage` (card bordata + `<sl-badge pill>` come contatore),
segnalato come mancante nel DS. Prima di pubblicare la prossima versione della libreria, va allineato anche il lato Figma:

1. **File `Saipem-DS` (fileKey `CdCRuuAnOeYrOOn1HYkxDM`)** — il componente `Tab` (node `45-10`) ha oggi solo la variant
   `State` (default/hover/active/disabled). Va aggiunto un boolean prop `Card` (o una variant dedicata) che rifletta lo
   stile a card visto in `xCPage` (bordo/bg/radius a riposo e stato attivo, vedi token usati in `tab.styles.ts`:
   `--sl-panel-background-color`, `--sl-panel-border-color`, `--sl-border-radius-large`, `--sl-color-primary-50`,
   `--sl-color-primary-600`).
2. **`figma/tab.figma.ts`** — aggiornare il template per leggere il nuovo prop `Card` e generare l'attributo `card`
   nell'HTML di esempio (oggi genera solo `active`/`disabled`), analogo a come `badge-pill.figma.ts` espone `variant`.
3. Verificare se in `xCPage` la combinazione "Tab (card) + Badge Pill" va ri-collegata al componente `Tab` del DS una
   volta aggiunto il prop, così da far sparire l'annotazione "⚠ Missing in Saipem DS" sui nodi Stage · PVA/Consolidation/Review.
4. **Pubblicazione**: come da [[figma-code-connect-todo]], l'MCP non può sovrascrivere mapping già esistenti — serve
   `npx figma connect publish` con `FIGMA_ACCESS_TOKEN`, non tramite MCP.

Riferimento implementazione lato codice: `src/components/tab/tab.component.ts`, `src/components/tab/tab.styles.ts`,
esempio in `docs/pages/components/tab-group.md` ("Card Tabs with Counters").

## Icon prop su `Tab` + active indicator per-tab su `Tab Group` (Detail Tabs)

Nodo `xCPage` 22:4244 "Tab item · Review Comments (active)": lato codice `<sl-tab>` supporta già un'icona
(`<sl-icon>` nello slot di default, prima della label) e `<sl-tab-group>` disegna già l'indicator attivo in automatico
(2px `--sl-color-primary-600` su un track 2px `--sl-border-subtle`) — nessun markup aggiuntivo per singolo tab.
Per rendere il pattern esplicito/documentato è stato comunque aggiunto:

- Spacing dedicato nel CSS (`.tab ::slotted(sl-icon)`, margine dopo l'icona) in `tab.styles.ts`.
- Esempio "Tabs with Icons" in `docs/pages/components/tab-group.md`.

Il gap resta solo lato Figma:

1. **File `Saipem-DS`** — il componente `Tab` (node `45-10`) non ha un prop per l'icona: nei mockup l'icona viene
   disegnata come layer separato fuori dal componente Tab (vedi frame "Tab item · Review Comments"), mentre nel codice
   l'icona è dentro `<sl-tab>` stesso. Aggiungere un boolean prop `Icon` (con istanza icona annidata) al componente.
2. **`Tab Group`** nel file Figma non espone l'indicator attivo per singolo tab — nei mockup viene simulato con un
   bordo inferiore 2px disegnato a mano sul frame del singolo tab item, invece di essere una proprietà del componente
   Tab/Tab Group. Aggiungere la rappresentazione dell'indicator (es. variant `Active` con bordo inferiore) al componente
   Tab nella libreria, così i designer non devono più disegnarlo manualmente.
3. Dopo le modifiche, aggiornare `figma/tab.figma.ts` per leggere il nuovo prop `Icon` e includere l'icona nell'HTML
   generato (`<sl-icon name="...">`).
4. Pubblicazione: stesso vincolo del punto precedente — CLI con `FIGMA_ACCESS_TOKEN`, non MCP.

## Content slot su `Detail Panel` (nessuna modifica di codice necessaria)

Nodo `xCPage` 10:1383 "Details panel": `<sl-detail-panel>` nel codice ha **già** uno slot di default per il contenuto
del body (`<slot></slot>` in `detail-panel.component.ts:80`, dietro `part="body"`) — pensato apposta per ospitare
`<sl-tab-group>` + contenuto, come da JSDoc del componente. Nessun cambiamento lato `sai-che-ui` necessario.

Il gap è solo nel file Figma:

1. **File `Saipem-DS`** — il componente `Detail Panel` non ha uno slot/area per il contenuto del Body, quindi in
   `xCPage` l'istanza è stata staccata ("detached") per poter piazzare Tab + Empty State dentro Body, perdendo il
   collegamento al componente DS (niente più aggiornamenti automatici da libreria).
2. Aggiungere al componente `Detail Panel` un'area contenuto in Body configurabile (slot/instance-swap o content
   region), analoga a come `Empty State` (node `10:218`) espone già "Icon" e "Action" come instance-swap slot opzionali.
3. Una volta aggiunto lo slot, ricollegare l'istanza in `xCPage` al componente DS aggiornato.

## Icone Bootstrap mancanti nel set icone Figma

Icone aggiunte localmente in `xCPage` (layer "Icon/\*") ma assenti nel set icone della libreria Figma — nel codice
sono già tutte disponibili via `bootstrap-icons` (nessuna azione lato `sai-che-ui`):

- `plus-lg` (node `9:145`)
- `pencil` (node `9:139`)
- `grid` (node `9:130`)
- `clock-history` (node `9:111`)
- `list-ul` (node `9:136`)
- `inbox` (node `9:133`)

Da aggiungere come varianti del componente icona nella libreria Saipem-DS prima della prossima release, per evitare
altre istanze icona "locali" non linkate al DS. Si aggiungono qui anche `dash-lg` (node `9:120`) e `trash` (node
`9:154`), segnalate nel frame "19 · Import Comment — upload failed" (vedi sezione successiva).

## Nuovo componente `sl-file-upload-item` (File Upload Item)

Nodo `xCPage` 15:2150 / dialog "Import Comment" (frame "Files" 15:2585): implementato in codice il componente mancante
segnalato — una riga che mostra lo stato di upload di un singolo file, con 4 stati (`waiting` / `uploading` /
`uploaded` / `failed`), composta da icona di stato (o `sl-spinner` quando in upload), `sl-progress-bar`,
`sl-icon-button` per la rimozione e `sl-button` outline/small per il retry in caso di errore.

- Implementazione: `src/components/file-upload-item/` (`file-upload-item.component.ts`, `.styles.ts`, `.test.ts`).
- Esempi: `docs/pages/components/file-upload-item.md`.
- Registrato in `src/shoelace.ts`; wrapper React e metadata rigenerati automaticamente dalla build.
- Stati `uploaded` (bg `--sl-color-success-50`/bordo `--sl-color-success-200`, icona `check2-circle`) e `failed` (bg
  `--sl-color-danger-50`/bordo `--sl-color-danger-200`, icona `exclamation-octagon`, pulsante "Retry") seguono
  esattamente i token visti nel frame Figma. Gli stati `waiting` (icona `hourglass-split`) e `uploading` (spinner +
  barra di progresso) non comparivano nel frame — dedotti dall'annotazione, da validare col design una volta che
  esistono nel file Figma.

Il gap resta tutto lato Figma — nessun componente "File Upload Item" esiste nel file `Saipem-DS`:

1. Creare il componente nella libreria Saipem-DS con variant `State` (`waiting` / `uploading` / `uploaded` / `failed`),
   composto da istanze swap di Icon, Progress Bar e Spinner, più Icon Button e Button Outline Small, rispecchiando
   l'implementazione sopra.
2. Aggiungere il relativo template `figma/file-upload-item.figma.ts` una volta che il componente esiste (stesso
   pattern di `tab.figma.ts` / `badge-pill.figma.ts`: leggere `State`/testo e generare l'HTML `<sl-file-upload-item>`).
3. Ricollegare le istanze "File item · done/failed" in `xCPage` al nuovo componente DS.
4. Pubblicazione: CLI con `FIGMA_ACCESS_TOKEN`, non MCP (vedi [[figma-code-connect-todo]]).

## Body slot su `Dialog` (nessuna modifica di codice necessaria)

Nodo `xCPage` 15:2572 "Dialog · Import Comment": come per `Detail Panel`, `<sl-dialog>` ha **già** uno slot di default
per il body (`<slot></slot>` in `dialog.component.ts:317`, dietro `part="body"`) oltre a `footer`/`header-actions`.
Nessun cambiamento lato `sai-che-ui` necessario — il footer del dialog "Import Comment" è già ricostruibile con
`<sl-button>` del DS (`Cancel` + `Finish`) nello slot `footer`.

Il gap è solo nel file Figma, stesso identico problema del Detail Panel:

1. **File `Saipem-DS`** — il componente `Dialog` non ha uno slot/area contenuto per il Body, quindi in `xCPage`
   l'istanza è stata staccata per poter comporre il form "Import Comment" (Files + Options) dentro Body.
2. Aggiungere un'area contenuto in Body (slot/instance-swap) al componente `Dialog`, analoga alla modifica richiesta
   per `Detail Panel`.
3. Ricollegare l'istanza in `xCPage` al componente DS aggiornato una volta disponibile.

## Nuovo componente `sl-comment` (Review Comment item)

Nodo `xCPage` 16:3362 "Review comment", schermata "21 · Review Comments — comment uploaded": implementato in codice il
componente mancante segnalato — una riga di commento con avatar, autore, data, testo e un allegato opzionale.

- Implementazione: `src/components/comment/` (`comment.component.ts`, `.styles.ts`, `.test.ts`).
- Esempi: `docs/pages/components/comment.md`.
- Registrato in `src/shoelace.ts`; wrapper React e metadata rigenerati automaticamente dalla build.
- Composizione fedele all'annotazione: slot `avatar` per `<sl-avatar>`, proprietà/slot `author` e `date` (la data è
  opzionale, mostrata solo se valorizzata), testo nello slot di default, slot `attachment` opzionale per un
  `<sl-icon-button>` (nel frame Figma è un'icona PDF rossa — il mapping Code Connect del nodo generava erroneamente
  `name="gear"`, da correggere quando si crea il template `figma/comment.figma.ts`).

Il gap resta tutto lato Figma — nessun componente "Review Comment" esiste nel file `Saipem-DS`:

1. Creare il componente nella libreria Saipem-DS (Avatar + testo autore/data + testo commento + Icon Button opzionale
   per l'allegato), rispecchiando l'implementazione sopra.
2. Aggiungere `figma/comment.figma.ts` una volta che il componente esiste nel file Saipem-DS (stesso pattern degli
   altri template: leggere i layer di testo e generare l'HTML `<sl-comment>`).
3. Ricollegare le istanze "Review comment" in `xCPage` al nuovo componente DS.
4. Pubblicazione: CLI con `FIGMA_ACCESS_TOKEN`, non MCP (vedi [[figma-code-connect-todo]]).

## Toast (nessuna modifica di codice necessaria)

Nodo `xCPage` 16:3058 "Alert" (toast "Comment uploaded", bottom-right), stessa schermata del punto precedente:
lato codice non c'è alcun gap. `sl-alert` ha già il metodo `toast()` che sposta l'alert nello
["toast stack"](docs/pages/components/alert.md) — lo stack ha già `box-shadow: var(--sl-shadow-large)` di default
(il "Shadow/Large" citato nell'annotazione) ed è già riposizionabile via CSS (`.sl-toast-stack`). Ho aggiunto un
esempio in `docs/pages/components/alert.md` ("The Toast Stack") per il caso bottom-right visto in Figma, finora
documentato solo per top-left.

Il gap è solo nel file Figma: non esiste un componente "Toast" dedicato, quindi i designer ricompongono ogni volta
Alert (success, closable) + ombra posizionandolo manualmente in basso a destra.

1. Creare un componente "Toast" nella libreria Saipem-DS, anche solo come variante/preset di `Alert` con l'ombra e il
   posizionamento bottom-right già applicati, per evitare la ricomposizione manuale ogni volta.
2. Nessun nuovo template Code Connect richiesto: resta mappato al componente `Alert` esistente (`figma/alert.figma.ts`).
