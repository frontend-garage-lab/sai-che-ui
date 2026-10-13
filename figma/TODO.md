# Figma Code Connect — da aggiornare prima della prossima release

## Prop `logo-src`/`logo-label` su `Header` + gap di navigazione più ampio

Richiesta: predisporre l'header per usare un logo a immagine (non solo testo/markup nello slot) e allargare lo
spazio tra le voci di navigazione (vedi screenshot con tile arancione "S" + "xCPage" e voci "Project Data" /
"Configuration" / "Dashboard" ben distanziate).

Lato codice, completato:

- **`SlHeader`** (`src/components/header/header.component.ts`): aggiunte le proprietà `logoSrc` (attributo
  `logo-src`) e `logoLabel` (attributo `logo-label`). Quando lo slot `logo` è vuoto, viene mostrato un `<img>` di
  fallback con quella `src`/`alt` — pensato per i casi semplici (un solo logo a immagine), lasciando lo slot per i
  casi compositi (icona + wordmark, come nel demo `xcpage`). Nuova `@cssproperty --nav-gap` (default
  `var(--sl-spacing-large)`, prima la spaziatura tra voci era `var(--sl-spacing-3x-small)`, troppo stretta).
  Allargato anche il gap label/chevron in `sl-header-item` (`--sl-spacing-x-small`, prima `--sl-spacing-2x-small`).
  Corretto anche un bug di allineamento verticale: `.header__nav` usava `align-items: stretch`, che per spec CSS
  posiziona un figlio ad altezza fissa (le voci `sl-header-item`, `height: 2rem`) in alto anziché centrarlo —
  risultato: le voci di menu erano allineate al top dell'header invece che al centro, disallineate rispetto a logo
  e `sl-select` nelle `actions`. Cambiato in `align-items: center`.
- Demo `xcpage`: aggiunto un tile "S" (SVG inline arancione, come da screenshot) nello slot `logo` accanto al testo
  "xCPage".
- Esempio "Setting a logo with `logo-src`" aggiunto in `docs/pages/components/header.md`.

Il gap resta lato Figma:

1. ~~Il componente `Header` (node `52-2`) non ha un modo per impostare un'immagine di logo come prop~~ **Risolto
   lato Figma** (verificato 2026-10-13 via MCP): `Header` espone ora `Logo [INSTANCE_SWAP]`. `figma/header.figma.ts`
   sceglie deliberatamente di continuare a generare markup nello slot `logo` invece di leggere l'instance-swap (vedi
   commento nel file) — nessuna modifica al template necessaria.
2. Allineare lo spacing tra le voci di navigazione nel componente Figma a quello ora in codice (token
   `--sl-spacing-large`), idealmente legato alla stessa variabile di spaziatura usata altrove nel DS, non a un
   valore fisso sul frame. **Ancora da verificare** (richiede confronto visivo, non controllabile via proprietà
   componente).
3. Pubblicazione: `npx figma connect publish` con `FIGMA_ACCESS_TOKEN`, non tramite MCP (vedi
   [[figma-code-connect-todo]]).

## Rename `App Header` → `Header` + dropdown sulle voci di menu (`sl-header-item`)

Richiesta: rinominare `App Header` in `Header` e dare la possibilità di cliccare su una voce del menu principale per
aprire una dropdown con altre voci (vedi screenshot xCPage con "Project Data" e "Configuration" che aprono un menu),
oltre ad allineare lo stile al nuovo screenshot.

Lato codice, completato:

- **Rename**: `src/components/app-header/` → `src/components/header/` (classe `SlAppHeader` → `SlHeader`, tag
  `sl-app-header` → `sl-header`). Aggiornati `src/shoelace.ts`, `docs/pages/components/header.md`,
  `docs/assets/demo/xcpage/index.html`, `figma/header.figma.ts` (rinominato da `app-header.figma.ts`).
- **Nuovo componente `sl-header-item`** (`src/components/header-item/`): singola voce di navigazione dell'header.
  Supporta `href`/`target` (link semplice) oppure uno slot `menu` (tipicamente un `<sl-menu>` con `<sl-menu-item>`)
  che trasforma la voce in un trigger di dropdown (`<sl-dropdown>` interno) con chevron che ruota quando aperto.
  Attributo `current` per marcare la pagina attiva (equivalente a `aria-current="page"` su un `<a>` semplice, ancora
  supportato per compatibilità nello slot di default di `sl-header`).
  - Implementazione: `header-item.component.ts` / `.styles.ts` / `.test.ts`.
  - Esempi: `docs/pages/components/header-item.md`; esempio "Plain links" in `docs/pages/components/header.md`.
  - Demo `xcpage`: "Project Data" e "Configuration" ora usano `sl-header-item` con slot `menu` (placeholder: Documents/
    Distribution History/Search e Users/Permissions/Workflow Rules); "Review" resta un `sl-header-item` semplice con
    `current`.

**Risolto lato Figma (2026-10-13)**: il componente `Header Item` (node `552:74`) esisteva già rinominato, con
`State` (`Default`/`Open`/`Current`) e `Has Menu [BOOLEAN]` (chevron legato a `visible` tramite
`componentPropertyReferences`) — ma il component set era in errore perché due varianti si chiamavano entrambe
`State=Open` (duplicato), il che rendeva `componentPropertyDefinitions` illeggibile (sia da MCP che dal plugin) e
nascondeva tutte le sue proprietà. Rinominata la seconda a `State=Current` via Plugin API: il set ora è valido e
corrisponde esattamente a quanto già si aspettava `figma/header-item.figma.ts` (già presente nel repo, nessuna
modifica necessaria). Verificare solo lo stile aggiornato (sfondo/colori/pill) contro lo screenshot xCPage.

Pubblicazione: `npx figma connect publish` con `FIGMA_ACCESS_TOKEN`, non tramite MCP (vedi
[[figma-code-connect-todo]]).

## Variante `card` su `sl-tab` (Workflow Stage Tab)

In `src/components/tab` è stata aggiunta la proprietà booleana `card` (vedi `tab.component.ts` / `tab.styles.ts`) per
supportare il pattern "Workflow Stage Tab" del file `xCPage` (card bordata + `<sl-badge pill>` come contatore),
segnalato come mancante nel DS. Prima di pubblicare la prossima versione della libreria, va allineato anche il lato Figma:

1. ~~Il componente `Tab` (node `45-10`) ha solo `State`, serve un boolean `Card`~~ **Risolto lato Figma** (verificato
   2026-10-13): `Tab` espone già `Card [BOOLEAN]`.
2. **Risolto (2026-10-13)**: `figma/tab.figma.ts` ora legge `Card` ed emette l'attributo `card` nell'HTML generato,
   validato con `npx tsc -p figma`.
3. Verificare se in `xCPage` la combinazione "Tab (card) + Badge Pill" va ri-collegata al componente `Tab` del DS ora
   che il prop esiste, così da far sparire l'annotazione "⚠ Missing in Saipem DS" sui nodi Stage · PVA/Consolidation/Review.
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

1. ~~Il componente `Tab` non ha un prop per l'icona~~ **Risolto lato Figma** (verificato 2026-10-13): `Tab` espone già
   `Icon [BOOLEAN]` + `Icon Type [INSTANCE_SWAP]`. Resta **bloccato lato template**: `figma/tab.figma.ts` non legge
   ancora questi due prop perché non esiste un'infrastruttura generica per mappare il nome di un'istanza icona Figma
   (es. `Icon/chevron-down`) al nome icona Bootstrap usato nel codice (`chevron-down`) — lo stesso limite già
   annotato più sotto per `sl-comment` (mapping errato che generava `name="gear"`). Da risolvere insieme, non
   singolarmente per componente.
2. **`Tab Group`** nel file Figma non espone l'indicator attivo per singolo tab — nei mockup viene simulato con un
   bordo inferiore 2px disegnato a mano sul frame del singolo tab item, invece di essere una proprietà del componente
   Tab/Tab Group. Aggiungere la rappresentazione dell'indicator (es. variant `Active` con bordo inferiore) al componente
   Tab nella libreria, così i designer non devono più disegnarlo manualmente.
3. Dopo le modifiche, aggiornare `figma/tab.figma.ts` per leggere il nuovo prop `Icon` e includere l'icona nell'HTML
   generato (`<sl-icon name="...">`).
4. Pubblicazione: stesso vincolo del punto precedente — CLI con `FIGMA_ACCESS_TOKEN`, non MCP.

## Prop mancanti su componenti già mappati (audit 2026-10-13)

Audit completo di tutti i componenti con un template Code Connect esistente: confronto tra le `@property()` del
componente `sai-che-ui` e le proprietà del componente Figma live (letto via MCP, `componentPropertyDefinitions`).

**Risolti lato Figma (2026-10-13)**, via Plugin API, replicando ogni volta la tecnica già in uso altrove nello
stesso file (stesso fill/stroke/variabile, stesso pattern overlay-su-visibilità) — poi template aggiornati e tutto
pubblicato con `npx figma connect publish`:

- **`Status`** (`34:62`) — aggiunto `Pulse [BOOLEAN]`: layer `pulse-ring` (rettangolo con drop-shadow legato alla
  stessa variabile colore `/600` già usata dal pallino, visibilità legata a `Pulse`), stesso pattern di
  `Badge`/`Badge Pill`.
- **`Tag`** (`33:38`) — aggiunto `Removable [BOOLEAN]`: istanza `Icon/x-lg` (dimensione scalata per size:
  12/14/16px) aggiunta a ogni variante, visibilità legata a `Removable`, stesso pattern del pulsante di chiusura su
  `Alert`. Corretto anche un bug minore nel template (`figma/tag.figma.ts`): mancava il valore `text` nella mappa di
  `Variant`, già supportato sia da Figma che dal codice.
- **`Icon Button`** (`47:10`) — aggiunto `Filled [BOOLEAN]` e `Variant [VARIANT]` (7 colori, esplosa la
  combinazione con `State` da 4 a 28 varianti). **Corretto il 13/10** dopo una svista nella prima versione (lo
  sfondo circolare colorato dietro il pulsante non era visibile): `icon-button.styles.ts` mostra uno sfondo
  pallido permanente per ogni variante colorata (non solo in hover) più uno sfondo pieno quando `filled`, con
  icona a contrasto — non solo l'icona tinta come fatto inizialmente. Ricostruito con 4 layer impilati
  (`layoutPositioning: ABSOLUTE`, non auto-layout) per ogni variante: `bg-pale` (sempre visibile, token
  `{colore}/50` o `neutral/100`), `bg-filled` (stesso cerchio, token `{colore}/600` o `accent/500`, visibilità
  legata a `Filled`), `icon` (icona tinta `{colore}/600`, come già fatto), `icon-contrast` (stessa icona in
  `neutral/0` bianco o `primary/950` per `accent` — stesso contrasto già usato da `Button` — visibilità legata a
  `Filled`, sopra `icon` così lo copre del tutto). Pulsante ingrandito da 32×32 a 44×44 e reso circolare
  (`cornerRadius: 999`), icona da 16 a 20px, per rispecchiare `padding: var(--sl-spacing-small)` e
  `font-size: var(--sl-font-size-large)` che il CSS applica solo alle varianti colorate (la variante `default`,
  ghost, resta 32×32 invariata). Verificato via screenshot: cerchio pallido a riposo, cerchio pieno + icona bianca
  con `Filled`, stato `disabled` ancora correttamente attenuato (opacity 0.5 preesistente).
- **`Rating`** (`61:33`) — aggiunto `Disabled [BOOLEAN]` (overlay bianco semi-trasparente, opacità nodo 0.5,
  stesso effetto visivo usato da `Checkbox`/`Radio` per lo stato disabled). `readonly` **non** ha un equivalente
  visivo distinto nel codice (`rating.styles.ts`: solo `disabled` cambia `opacity`, `readonly` è puramente
  comportamentale) — nessuna rappresentazione Figma necessaria per quello.
- **`Radio Button`** (`271:64`) — aggiunto `Size [VARIANT]` (small/medium/large), esplosa la combinazione con
  `State`/`Pill` da 6 a 18 varianti. Valori (altezza 28/36/44, padding 12/16/20, font 12/14/16) presi da
  `Button Text` (`32:124`), che condivide gli stessi identici valori a `Size=medium` — `radio-button.styles.ts`
  riusa letteralmente `button.styles.ts`, quindi è la fonte più coerente per la scala dimensionale.
- **`Input`** (`36:26`) — aggiunto `Pill [VARIANT]`: layer `pill-overlay` (stesso fill/stroke della row,
  cornerRadius = altezza/2), identico al pattern già usato da `Select`.
- **`Button`** (`32:58`) — aggiunto `Pill [VARIANT]` con lo stesso pattern `pill-overlay`, su tutte le 28
  combinazioni Variant×State.

**Non risolti (richiedono un vero nuovo layout, non solo un prop boolean/variant)** — a differenza dei casi sopra,
questi due non sono rappresentabili come toggle di visibilità su un overlay: cambiano le **dimensioni o
l'orientamento** del componente, cosa che una proprietà component non può pilotare via Plugin API (solo
`visible`/`mainComponent`/`characters` sono bindabili). Vanno disegnati a mano da chi cura la libreria:

1. **`Button` → `Circle`** (`32:58`) — codice (`button.component.ts:94`, `button.styles.ts:459-481`): nasconde
   prefix/suffix/caret, imposta `width = height` e `border-radius: circle`. In Figma significherebbe restringere la
   larghezza a 36px (il componente ha solo la size "medium"; `Button Small`/`Button Large` andrebbero estesi allo
   stesso modo) e sostituire il testo con un'icona — serve probabilmente un componente dedicato (`Button Circle`),
   sul modello di come `Icon Button` è già separato da `Button`.
2. **`Drawer` → `Placement`** (`65:37`) — codice supporta `top`/`end`/`bottom`/`start`
   (`drawer.component.ts:105`). Il componente Figma attuale (`Header=true, Footer=true`, 360×320, `layoutMode`
   verticale) rappresenta solo il caso `end` (pannello laterale destro). `top`/`bottom` richiederebbero un layout
   orizzontale a piena larghezza, `start` lo specchio di `end` — tre varianti visive da disegnare, non una
   riduzione a singolo prop.

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

## Nuovo componente `sl-description-list` / `sl-description-list-item` (Description list)

Nodo `xCPage` 19:4570 / 19:4607 / 19:4619 (schermata "14 · Properties dialog"), ricorrente 3 volte nella stessa
schermata: implementata in codice la coppia di componenti mancante — una griglia di coppie etichetta/valore.

- Implementazione: `src/components/description-list/` e `src/components/description-list-item/` (pattern
  contenitore + item, come `tab`/`tab-group` o `breadcrumb`/`breadcrumb-item`).
- `sl-description-list` ha una prop `cols` (default 2) che imposta `grid-template-columns`; `sl-description-list-item`
  ha una prop `label` (+ slot `label` per markup ricco) e uno slot di default per il valore (testo o markup, es.
  `<sl-tag>`, già usato nel demo per "Expires on").
- Gap verticale/orizzontale (`--sl-spacing-x-small` / `--sl-spacing-medium`) fedele ai token visti in Figma.
- Esempi: `docs/pages/components/description-list.md`.
- Usato anche per sostituire l'helper `descriptionList()` + CSS `.dl` fatti a mano nel demo `xcpage` (vedi
  `docs/assets/demo/xcpage/xcpage.js`).

Il gap resta tutto lato Figma — nessun componente "Description List" esiste nel file `Saipem-DS`:

1. Creare i due componenti nella libreria Saipem-DS (contenitore a griglia + item label/valore), rispecchiando
   l'implementazione sopra.
2. Aggiungere `figma/description-list.figma.ts` e `figma/description-list-item.figma.ts` una volta creati i
   componenti nel file Saipem-DS.
3. Ricollegare le istanze "Description list" in `xCPage` (nodi 19:4570, 19:4607, 19:4619 e gli analoghi già visti in
   altre schermate) al nuovo componente DS.
4. Pubblicazione: CLI con `FIGMA_ACCESS_TOKEN`, non MCP (vedi [[figma-code-connect-todo]]).

## Riallineamento Code Connect per `sl-table` dopo la riscrittura su TanStack Table (2026-10-13)

`sl-table` è stato riscritto su [TanStack Table](https://tanstack.com/table/latest): `<sl-table-row>`,
`<sl-table-column>` e `<sl-table-cell>` sono stati rimossi, sostituiti da due proprietà JS (`columns`/`data`)
impostate imperativamente sul tag `<sl-table>` (vedi `docs/pages/components/table.md`). I vecchi template Code
Connect `figma/table-header-row.figma.ts` e `figma/table-row.figma.ts` generavano quei tag ora inesistenti ed
erano stati cancellati, lasciando i nodi Figma `Table Header Row` (`53:2`) e `Table Row` (`53:37`) senza mapping.

Ricreati entrambi i template, ma non come prima: dato che non esiste più un elemento dichiarativo da generare,
ora producono uno snippet di riferimento (`<sl-table>` + `<script type="module">` con `columns`/`data`), nello
stesso stile degli esempi in `docs/pages/components/table.md`, letto dinamicamente dai layer di testo del nodo
(non più etichette hardcoded come nella versione precedente, che tra l'altro erano già disallineate dai layer
reali del file: DOCUMENT/STATUS/MODIFIED vs gli attuali TASKS/REV. CODE/CREATED DATE/DUE DATE/DISCIPLINE/ORIGINATOR).

- `figma/table-header-row.figma.ts` — genera l'array `columns` dai layer di testo dell'header; se `Selection` è
  true aggiunge `selection="multiple"` al tag; `Actions`/`Quick Info` diventano commenti guida (sono config
  per-colonna via `meta`, non attributi).
- `figma/table-row.figma.ts` — genera un record di esempio per `data`; `Striped` diventa l'attributo
  `striped`; `Marker` diventa `table.rowVariant`; stato `disabled` diventa `table.rowDisabled`; `Quick Info` e
  `Actions` diventano commenti guida con lo snippet di colonna da aggiungere.

Pubblicato con `npx figma connect publish` (`FIGMA_ACCESS_TOKEN`).

**Aggiornamento (2026-10-13): componenti `Table Column`/`Table Cell` rimossi da Figma.** Verificato che non erano
usati da nessuna delle altre 12 card di esempio della pagina `Table` (tutte già basate su `Table Header Row`/
`Table Row`) — l'unico punto che li usava era la card `Table (Column & Cell Properties)`, un'istantanea rimasta
dalla vecchia architettura a elementi dichiarativi (`<sl-table-column>`/`<sl-table-cell>`, oggi cancellati dal
codice). Rimossi dalla libreria Saipem-DS via Plugin API: `Card: Table Column` (`317:322`), `Card: Table Cell`
(`317:326`) e la card di esempio `Table (Column & Cell Properties)` (`305:236`). Non avevano mai avuto un
template Code Connect, quindi nessuna pubblicazione necessaria per questa parte. Lo spazio nello
`Component Stack`/`Variants Stack` della pagina si è richiuso automaticamente (sono frame auto-layout).

**Aggiornamento (2026-10-13): card di esempio `Table (Toolbar Actions)` ricostruita.** La card mostrava ancora la
vecchia toolbar fatta di `Button Outline Small`/`Button Small` testuali (download/upload/take), mentre l'esempio
"Action buttons" in `docs/pages/components/table.md` (e lo screenshot di riferimento fornito dall'utente) usa
`<sl-icon-button>` raggruppati a coppie con `<sl-divider vertical>` fra i gruppi, un testo "N tasks in review"
spinto a destra, più una tabella a sole 2 colonne (Protocol Number/Subject) con la prima riga `selected`.
Ricostruita la toolbar (icon-button `download`/`primary`, `upload`/`neutral`, `arrow-counterclockwise`/`danger`,
`arrow-clockwise`/`primary`, `check-lg`/`accent`+`filled`, `check2-circle`/`neutral`, due `Divider`
verticali, spacer a `layoutSizingHorizontal: FILL` per spingere il testo a destra) e la tabella (nascoste le 4
colonne non usate su `Table Header Row` + le 3 `Table Row`, colonna "Subject" portata a `FILL` per non troncare il
testo, prima riga impostata a `State=selected`).

**Risolto (2026-10-13): icona `Icon/arrow-counterclockwise` corretta e `Icon/arrow-clockwise` creata.** La prima
era costruita con vettori a **stroke** (strokeWeight 1.3, nessun fill) invece che a **fill**, l'unica convenzione
usata da tutte le altre icone del set (confrontata con `Icon/download`) — oltre a questo, i due vettori erano
posizionati fuori dal frame 16×16 (`y: -5.43`), motivo del glifo illeggibile visto nello screenshot. Sostituiti
entrambi i vettori importando l'SVG reale da `node_modules/bootstrap-icons/icons/arrow-counterclockwise.svg`
(stesso pacchetto già usato dal codice) via `figma.createNodeFromSvg`, fill legato alla stessa variabile
`text/body` (`27:11`) usata dalle altre icone. Creato `Icon/arrow-clockwise` da zero con lo stesso procedimento,
leggendo `arrow-clockwise.svg` dallo stesso pacchetto — prima mancava del tutto dal set. Aggiornata la card
"Table (Toolbar Actions)": il pulsante "Refresh list" ora usa la nuova `arrow-clockwise` invece del sostituto
temporaneo.

### Confronto con `docs/pages/components/table.md` (2026-10-13) — due discrepanze trovate e una corretta

Confrontando screenshot reali della pagina doc (`/components/table/`, esempi "Status icons and alignment" e
"Action menus") con `Table Row`/`Table Header Row` in Figma:

1. **Corretto**: "Quick Info" nel codice/doc mostra **due** badge compatti affiancati (es. variant `warning`
   con "O" + variant `neutral` con "W" — conteggio "open"/"waiting", vedi l'esempio `status-table` nei doc).
   Il frame "Quick Info" in `Table Row` (`53:37`) aveva spazio per due badge (112px, esattamente 2× un badge
   da ~22-54px) ma ne conteneva solo uno, oltretutto stirato a 54px con dentro il testo "Status" che sui 22px
   della dimensione naturale del componente `Badge` sarebbe stato tagliato. Sistemato su tutte le 28 varianti:
   frame convertito ad auto-layout (hug, gap 4px), primo badge riportato alla sua `Variant=warning` naturale
   con testo "O", aggiunto un secondo `Badge` (`Variant=neutral`, testo "W") come istanza semplice non legata
   a una component property formale (le component property Figma non supportano due instance-swap indipendenti
   legate allo stesso boolean — il secondo badge resta comunque sostituibile a mano dal designer, solo non
   compare nel pannello proprietà). `figma/table-row.figma.ts` aggiornato per leggere entrambi.
2. **Non corretto, da fare**: l'esempio "Action menus" nei doc mostra il pulsante azioni (icona
   three-dots-vertical) **disabilitato/sbiadito** — non nascosto — per le righe senza un menu, proprio per
   mantenere le colonne allineate ("Rows without an actions menu show a disabled button, so the columns stay
   aligned"). In `Table Row` oggi `Actions#164:5` controlla solo la *visibilità* dell'istanza `row__actions`
   (nascosta quando false), e l'istanza nidificata ha `Variant`/`State` bloccati su un solo valore
   (`default`) — non c'è modo di selezionare uno stato disabled su quell'icon-button dalle proprietà del
   componente. Per allinearsi ai doc servirebbe: rendere `row__actions` sempre visibile quando la tabella ha
   una colonna azioni, ed esporre un modo (property o variant aggiuntiva) per mostrarlo disabled riga per
   riga — una modifica di comportamento, non solo estetica, quindi da valutare con chi cura la libreria.

## Altre segnalazioni emerse in "14 · Properties dialog" (solo da tracciare)

- **Icone mancanti nel set Figma** (già disponibili lato codice via `bootstrap-icons`, nessuna azione in
  `sai-che-ui`): `search` (node `9:148`), `clock` (node `9:116`), `check-square` (node `9:107`),
  ~~`arrow-clockwise` (node `9:103`)~~ **aggiunta il 2026-10-13** (vedi sotto). Si aggiungono alla lista già aperta
  in questo file (`plus-lg`, `pencil`, `grid`, `clock-history`, `list-ul`, `inbox`, `dash-lg`, `trash`).
- ~~**Icona DS rotta**: `Icon/arrow-counterclockwise`~~ **Risolto (2026-10-13)**: il vettore era costruito a
  stroke (non a fill, l'unica convenzione usata da tutte le altre icone) e posizionato fuori dal frame 16×16.
  Ricostruito importando l'SVG reale da `bootstrap-icons` via Plugin API (`figma.createNodeFromSvg`); creato anche
  `Icon/arrow-clockwise`, che mancava del tutto dal set, con lo stesso procedimento. Dettagli nella sezione
  "Riallineamento Code Connect per `sl-table`" più sopra in questo file.
- **Candidato per estendere `Table Row`**: "Review Task Row" (node `9:204`) — annotazione: "rich task row for the
  Review list (status icon, 3-line task title, Rev tag, overdue date). Built locally from DS Table Row Marker, Tag,
  Icon/dot and DS tokens... Candidate: extend DS Table Row with a multi-line/custom cell slot." Non implementato ora
  (è una modifica più ampia alla cella del componente `Table Row`/`Table Column`, non una semplice composizione) —
  da valutare come task a sé quando richiesto esplicitamente.

## Dialog "Complete Review Task" (già implementato, nessun gap di codice)

Nodo `xCPage` 19:4049, schermata con scrim 19:4031: corrisponde esattamente al dialog `#complete-dialog` già presente
nel demo `xcpage` (`docs/assets/demo/xcpage/index.html`) — Alert success, tabella Document/Date, conteggio, bottoni
Cancel/Complete task(s). Nessuna modifica necessaria lato `sai-che-ui`.

- L'annotazione "Dialog has no body slot" è duplicata rispetto a quella già tracciata sopra (Dialog/Detail Panel) —
  stesso gap, solo lato Figma, nessuna nuova voce necessaria.
- **Nuova segnalazione** sul nodo "Table Row" (19:4095): "Table Row columns have fixed widths (90px): the full
  timestamp '2-Oct-2026 01:17' does not fit. Make DS table column widths configurable." Anche qui nessun gap di
  codice: `sl-table-column` supporta già un attributo `width` configurabile (usato nel demo: `width="11rem"` sulla
  colonna data) — il limite è solo nel componente Figma, le cui colonne non sono ridimensionabili sulle istanze.
  Da segnalare al team Figma insieme agli altri gap di ridimensionamento colonne già aperti (vedi "Table Header Row"
  più sopra in questo file).

## `Table Row` "Quick Info" ricostruito per allinearsi alla nuova sezione "Status icons and alignment" (2026-10-13)

I doc (`docs/pages/components/table.md`) hanno sostituito l'esempio "Status icons and alignment": non più due
badge compatti, ma `sl-status` (pallino colorato, pulsante) + `sl-badge pill` (decisione, success/danger) +
`sl-icon-button` opzionale (allegato, `file-earmark-pdf`, danger, scalato 0.75×). Il componente `Table Row`
(`53:37`) in Figma aveva ancora la vecchia implementazione a due badge ("O"/"W") — vedi voce precedente in
questo file — quindi ricostruito su tutte le 28 varianti:

- **Status** (`Quick Info Variant#523:0`, INSTANCE_SWAP già esistente): ripuntato dal componente `Badge` al
  componente `Status` (size=small, label di testo nascosto, ridimensionato a 14×15), `preferredValues`/
  `defaultValue` aggiornati di conseguenza (default ora `danger`).
- **Decision** (ex "Badge 2"): sostituita l'istanza `Badge` con un'istanza di `Badge Pill`, stesso limite già
  noto (le component property di Figma non supportano due instance-swap indipendenti legati allo stesso
  boolean) — resta un'istanza semplice, modificabile a mano, non esposta nel pannello proprietà. Testo di
  default impostato a "Reject" (variant `danger`).
- **Attachment** (nuovo): istanza di `Icon Button` (variant `danger`, icona `file-earmark-pdf`, 33×33 ≈ scale
  0.75 del codice), visibilità legata a una nuova property booleana `Attachment#623:0` (default `true`).

`figma/table-row.figma.ts` aggiornato per leggere tutti e tre (il colore della decisione deriva lo stesso testo
che usa il codice: `success` → "Approver", altrimenti "Reject" — non legge testo libero dal layer, stesso stile
della vecchia implementazione che aveva "O"/"W" hardcoded). Aggiornato anche il commento in
`figma/table-header-row.figma.ts` che citava ancora la vecchia combinazione a due badge. Typecheck
(`npx tsc -p figma`), `npx figma connect parse` e `npx figma connect publish` eseguiti con successo.

Nessun gap aperto da questa modifica oltre al limite "Decision" già descritto sopra (coerente con gli altri
casi analoghi in questo file). Vedi [[figma-code-connect-todo]] per le convenzioni generali.
