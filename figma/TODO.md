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

**Risolto lato Figma (2026-10-13)**: creato da zero il componente `File Upload Item` nella libreria Saipem-DS, su una
nuova pagina dedicata "File Upload Item" (`658:2`, stessa convenzione una-pagina-per-componente già in uso nel file).

1. ~~Creare il componente nella libreria Saipem-DS con variant `State`...~~ **Fatto**: component set `File Upload Item`
   (node `661:61`) con singola proprietà `State` (`waiting`/`uploading`/`uploaded`/`failed`, minuscolo come `Tab`),
   4 varianti (`661:2`/`661:15`/`661:31`/`661:44`). Composizione via Plugin API (`use_figma`), stessa tecnica già
   documentata altrove in questo file (istanze reali dei componenti DS, variabili condivise, overlay/visibilità
   per stato invece di layout paralleli):
   - Riga in auto-layout orizzontale (hug, non fixed — stesso fix applicato a `Table Row`), `align-items: center`,
     padding/gap/radius legati alle stesse variabili `Spacing`/`Radius` usate da `Alert` (`x-small`/`small`/`medium`).
     Sfondo/bordo legati a `surface/panel`+`border/subtle` (base, come da `--sl-panel-background-color`/
     `--sl-panel-border-color` in `light.css`) per `waiting`/`uploading`, `success/50`+`success/200` per `uploaded`,
     `danger/50`+`danger/200` per `failed` — stesse variabili `Palette` già usate da `Alert`/`Card`.
   - Icona di stato: istanza reale di `Icon/hourglass-split` (waiting), `Icon/check2-circle` (uploaded, già esistente,
     `214:6`), `Icon/exclamation-octagon` (failed, già esistente, `214:16`), o di `Spinner` (`60:16`, ridimensionato
     16×16) per `uploading` — una per variante (nessun instance-swap formale: Figma non espone condizionalmente due
     tipi di componente diversi su una proprietà singola senza esplodere in varianti aggiuntive, stessa limitazione
     già annotata per "Decision"/"Quick Info" su `Table Row`). Colore dell'icona ricolorato per istanza (override di
     `fills`/`strokes` sui vettori nidificati) con `neutral/600` (waiting), `success/600` (uploaded), `danger/600`
     (failed), stesso pattern di override visto sull'icona di `Alert` (success).
   - Colonna contenuto: testo filename (bold, `text/label`, dimensione `size/small`) + testo meta (`size/x-small`,
     colore `text/help` di base, `success/600`/`danger/600` per gli stati corrispondenti) + istanza di `Progress Bar`
     (`Value=60`, `60:52`) visibile solo nella variante `uploading`.
   - Pulsante Retry: istanza di `Button Outline Small` variante `danger`/`default` (`198:168`), testo impostato a
     "Retry", presente solo nella variante `failed`.
   - Pulsante Remove: istanza di `Icon Button` variante `default`/`default` (`47:2`) con la proprietà `Icon`
     (instance-swap) ripuntata su `Icon/trash`, presente in tutte e 4 le varianti.
2. ~~Icone Bootstrap mancanti~~ **Create**: `Icon/hourglass-split` (`656:4`) e `Icon/trash` (`656:8`) non esistevano
   nel set icone (confermato via `search_design_system` scoped alla library Saipem-DS) — create importando l'SVG reale
   da `node_modules/bootstrap-icons/icons/{hourglass-split,trash}.svg` via `figma.createNodeFromSvg`, fill legato alla
   stessa variabile `text/body` (`27:11`) usata dalle altre icone, stesso procedimento già documentato per
   `Icon/arrow-clockwise`. Verificate via screenshot: glifi leggibili e correttamente colorati.
3. ~~Aggiungere `figma/file-upload-item.figma.ts`~~ **Fatto**: legge `State` (enum) e i layer di testo filename/meta
   (letti dinamicamente, non hardcoded) e genera `<sl-file-upload-item state="..." filename="..." meta="...">`.
   Validato con `npx tsc -p figma` e `npx figma connect parse` (nessun errore).
4. **Pubblicato** con `npx figma connect publish` (`FIGMA_ACCESS_TOKEN`) — `SlFileUploadItem` ora mappato al node
   `661:61` (verificato nell'output del CLI).

Non fatto in questa passata (fuori scope, nessun nodo `xCPage` noto per questo componente nel file attuale): il
collegamento delle istanze "File item · done/failed" in `xCPage` al nuovo componente DS, visto che il frame
originale citato in cima a questa sezione (`xCPage` `15:2150`/`15:2585`) non è stato ritrovato come pagina del file
`Saipem-DS` in questa sessione — se esiste in un file/branch diverso, ricollegare le istanze lì una volta identificato.

**Fix (2026-10-13, seconda passata)**: revisione dell'utente ha trovato due problemi reali nella prima passata,
corretti via MCP senza ripartire da zero:

1. **Larghezze incoerenti tra le 4 varianti** (205/270/293px, ciascun frame riga era HUG sulla larghezza del proprio
   testo filename) — portate tutte a **440px fissi** (sizing `FIXED` sul frame principale di `661:2`/`661:15`/
   `661:31`/`661:44`, larghezza scelta per contenere comodamente il contenuto più lungo, "H10-RC-B-21214_A1_I.pdf" +
   "Upload failed · Connection lost" + pulsante Retry visibile). Il frame `content` (filename/meta/progress) è stato
   portato a `layoutSizingHorizontal: FILL` per crescere a riempire la riga (replica `flex: 1 1 auto` di
   `.file-upload-item__content` in `file-upload-item.styles.ts`); icona e pulsanti remove/retry restano HUG/fissi
   (`flex: none` nel CSS reale).
2. **Progress Bar con percentuale duplicata**: l'istanza `Progress Bar` (`Value=60`, dentro la variante `uploading`,
   nodo istanza `661:22`) ha un'etichetta testuale "60%" incorporata nella barra di riempimento (`Progress Bar` non
   ha una variante "senza etichetta" — unica component property è `Value`) — la vera `sl-progress-bar` non mostra
   mai questa etichetta inline, solo nella riga `meta` sopra. Nascosta impostando `visible = false` sul nodo di testo
   nidificato (`I661:22;60:54`), stessa tecnica dell'istanza semplice modificabile a mano già documentata per il
   secondo Badge di `Table Row` ("resta un'istanza semplice, modificabile a mano, non esposta nel pannello
   proprietà"). Per il valore più vicino al 45% richiesto dai doc: tenuto `Value=60` (distanza 15) invece di
   `Value=25` (distanza 20) o `Value=90` (distanza 45) — è l'opzione più vicina tra le 3 disponibili.
3. **Testi di default allineati** a `docs/pages/components/file-upload-item.md` (sezione "States"): `waiting` →
   "H10-RD-A-87166_A2_A.pdf" / "Waiting to upload"; `uploading` → "H10-RC-B-21213_A1_R.pdf" / "45% · Uploading";
   `uploaded` → "R1118111-SARC01-A.pdf" / "2.4 MB · Uploaded"; `failed` → "H10-RC-B-21214_A1_I.pdf" / "Upload failed ·
   Connection lost" (prima erano placeholder generici tipo "project-plan.pdf"). `figma/file-upload-item.figma.ts`
   aggiornato di conseguenza (le liste di fallback di `text()` leggono il contenuto corrente dei layer).
4. **Mancava lo scaffold di pagina** (ogni altro componente del file ha una card "Component" + una card "Variants"
   con esempi d'uso realistici — questa pagina aveva solo il component set nudo). Clonata `Alert Page Layout`
   (`316:125`) sulla pagina `File Upload Item` (`658:2`) via `node.clone()`, rinominata in "File Upload Item Page
   Layout" (`677:31`) con sezione "Section: File Upload Item" (`677:32`) e titolo aggiornato; il component set reale
   `661:61` spostato (non clonato) dentro la "Card: Component" clonata al posto del set `Alert` duplicato (poi
   eliminato); nella "Card: Variants" → "Variants Stack" creati 4 frame "File Upload Item (Example) — Waiting/
   Uploading/Uploaded/Failed" (uno per stato, a differenza del singolo esempio di `Alert`, dato che il punto di
   questo componente sono proprio i 4 stati distinti), ciascuno con un'istanza reale della variante corrispondente e
   lo stesso testo demo del punto 3, impilati con `itemSpacing: 20` ereditato dal clone. Tutta la struttura è HUG a
   cascata, quindi si è ridimensionata da sola attorno al nuovo contenuto (verificato via screenshot: nessun
   overflow/clipping, stesso fill/variabili di sfondo della card di `Alert`).
   - Nota operativa: durante i primi tentativi di resize in batch su tutte e 4 le varianti in un unico script, un
     errore a metà script (lookup su un ID di nodo nidificato non più valido dopo un resize) ha causato il rollback
     automatico dell'intero script da parte del plugin runtime, incluse le modifiche già apparentemente riuscite —
     e in un caso ha anche scollegato due varianti (`waiting`/`uploaded`) dal component set, ritrovate come
     componenti standalone sulla pagina e reinserite in `661:61` con `appendChild` prima di riposizionarle. Lezione:
     applicare queste modifiche a piccoli batch isolati e rileggere lo stato con `get_metadata` tra un batch e
     l'altro, non un unico script monolitico su più nodi.
5. **Ripubblicato**: `npx tsc -p figma`, `npx figma connect parse` e `npx figma connect publish` (`FIGMA_ACCESS_TOKEN`)
   eseguiti con successo — `SlFileUploadItem` confermato nell'output del CLI, ancora mappato al node `661:61`.

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
   aligned"). In `Table Row` oggi `Actions#164:5` controlla solo la _visibilità_ dell'istanza `row__actions`
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

## Bug: attivare "Quick Info" rompeva l'allineamento di colonne/header (risolto via MCP, 2026-10-13)

Segnalazione: attivando il boolean "Quick Info" su `Table Row`/`Table Header Row` (lato Figma — lato applicativo
`sl-table` non ha mai avuto il problema), le colonne non si incolonnavano più e con testo più lungo nel badge
"Decision" il layout si rompeva ulteriormente.

Causa trovata via MCP (verificata con screenshot prima/dopo):

1. Il frame "Quick Info" dentro `Table Row` aveva sizing **HUG** (si adattava alla larghezza di "Decision", che
   varia in base al testo — "Approver" vs "Reject"), mentre il frame "Quick Info" dentro `Table Header Row` era
   **FIXED a 112px**. Due larghezze diverse e non deterministiche per la "stessa" colonna → header e righe non
   si allineavano mai, e ogni riga poteva avere una larghezza diversa dalle altre a seconda del testo del badge.
2. Il frame principale di `Table Row` (tutte le 28 varianti) e di `Table Header Row` avevano sizing orizzontale
   **FIXED** (1070px / 958px), non HUG. Quindi attivare "Quick Info" (o Selection/Actions) rendeva visibile una
   colonna in più ma il frame non si allargava per farle spazio: il contenuto eccedeva la larghezza nominale del
   componente invece di spingere la riga a crescere, da cui la rottura del layout.

Fix applicato (via Figma Plugin API, MCP):

- Frame "Quick Info" di tutte le 28 varianti di `Table Row` + `Table Header Row`: sizing portato a **FIXED
  144px** (coerente con `meta: { width: '9rem' }` usato nel codice per questa colonna in
  `docs/pages/components/table.md`) e `clipsContent: true` come rete di sicurezza se un'etichetta "Decision"
  ancora più lunga venisse inserita in futuro.
- Frame principale di tutte le 28 varianti di `Table Row` + `Table Header Row`: `primaryAxisSizingMode` da
  `FIXED` ad **`AUTO`** (hug), così che abilitare Quick Info/Selection/Actions su un'istanza faccia crescere
  l'intera riga invece di farla traboccare. Larghezza di base delle varianti scesa di conseguenza da 1070/958px
  a ~830px (somma reale delle colonne sempre visibili) — è un effetto collaterale atteso e corretto del fix, non
  un regressione: prima il valore 1070/958 era solo uno spazio vuoto non utilizzato quando Quick Info era nascosto.

Verificato creando due istanze di prova (header + row) con "Quick Info" attivo e testo "Decision" forzato ad
"Approver" (il più lungo tra i due): entrambe risultano larghe 974px (830 + 144) e le colonne successive
(Tasks, Rev. Code, Created Date, …) iniziano esattamente alla stessa x in header e row. Istanze di prova
rimosse dopo la verifica. Nessuna modifica al codice (`src/components/table/**`) o ai mapping Code Connect
(`figma/table-row.figma.ts`, `figma/table-header-row.figma.ts`) — il gap era interamente nella struttura del
componente Figma.

## Detail Panel `contained`, Table `fill`, Empty State `title-text` (2026-10-15)

Lato codice, completato:

- **`SlEmptyState`**: l'attributo di `titleText` ora è `title-text` (prima era `titletext`, mentre doc, test e demo
  usavano già `title-text`). `figma/empty-state.figma.ts` aggiornato di conseguenza.
- **`SlDetailPanel`**: nuova property `contained` (bordo completo + `--border-radius`, default
  `--sl-border-radius-medium`) e nuove `@cssproperty` `--border-color` / `--border-radius`.
  `figma/detail-panel.figma.ts` emette sempre `contained`: il componente Figma (`396:1722`) è già disegnato come blocco
  con bordo su tutti i lati, quindi non serve una property Figma.
- **`SlTable`**: nuova property `fill` (altezza del contenitore, righe scorrevoli tra toolbar e paginazione). Nessun
  impatto su Figma, nessun Code Connect da cambiare.

Da fare lato Figma / publish:

1. ~~**Detail Panel (`396:1722`) — raggio**~~ **Fatto il 2026-10-15** (via Plugin API, modifica in-place nel file A):
   `cornerRadius` 0 → 6 legato a `Radius/medium` (`VariableID:28:15`) su tutti e quattro gli angoli e `Clip content`
   attivo. ID e component key (`ad7bf2e0…1589`) invariati, 2 figli, 360×420. **Resta da pubblicare la libreria** (Assets →
   Libraries → Publish), altrimenti i file consumer non vedono il raggio. **Table, rettifica del 2026-10-15**: `Card: Table Row` (`317:318`) è una card di documentazione, come tutte le
   `Card: …` del DS (raggio `Radius/large`, 8px): l'avevo portata a `Radius/medium` per errore e l'ho **ripristinata a
   `Radius/large`**. Il contenitore del component set `Table Row` (`53:37`) ha invece `Radius/medium` legato (era 5), ma è
   solo l'involucro del set e non si propaga alle istanze. Le righe e `Table Header Row` hanno raggio 0: il raggio 6px della
   tabella (`--sl-border-radius-medium`) vive nel codice di `sl-table` e va applicato al contenitore nei design.
2. **Publish libreria** (Figma, Full seat) per i raggi di Detail Panel e Table, poi `npx figma connect publish` (con `FIGMA_ACCESS_TOKEN`) per `empty-state.figma.ts` e `detail-panel.figma.ts`. Non
   cambiano i node-id, non serve toccare gli URL.
3. Controllare in Dev Mode che lo snippet di Empty State mostri `title-text=` e quello di Detail Panel `contained`.

## Stat Group (nuovo) + Tab Group con i suoi `sl-tab-panel` (2026-10-15)

Deciso con l'utente: `sl-menu` e `sl-tab-panel` restano **senza componente Figma** (contenitori coperti dagli snippet dei
genitori); `sl-stat-group` ottiene un componente Figma e un Code Connect.

Fatto in Figma (file A, pagina Stat, via Plugin API):

- Nuovo componente **Stat Group** (`840:91`, key `634e4a28…6837`), dentro la
  nuova card di documentazione `Card: Stat Group` (`840:87`, stesse regole di `Card: Component`).
  Auto Layout orizzontale con wrap, larghezza 916 (4 Stat da 220 + 3 gap), gap e gap di riga legati a `Spacing/small`
  (12px, come `sl-stat-group`), 4 istanze di Stat (Safe 128, Expiring 14, Expired 3, Notified 9) come nell'esempio "KPI
  summary row" della doc. Icone: shield-check, hourglass-split, exclamation-triangle, bell.

Fatto nel codice:

- `figma/stat-group.figma.ts` (nuovo): legge fino a 6 Stat figlie con `findConnectedInstances` e le emette dentro
  `<sl-stat-group label="Filter by status">`. `label`, `value` e `required` non hanno un layer Figma.
- `figma/tab-group.figma.ts`: al posto del commento emette un `<sl-tab-panel name="<slug dell'etichetta>">` per ogni Tab,
  con lo stesso slug che il mapping di Tab scrive nell'attributo `panel`.
- Inventario e lint della skill `rebranding`: `sl-menu` e `sl-tab-panel` sono `container`, non più "senza Code Connect".

Da fare:

1. **Publish libreria** in Figma (Stat Group è nuovo) e poi `npx figma connect publish` per `stat-group.figma.ts` e
   `tab-group.figma.ts`.
2. Controllare in Dev Mode che uno Stat Group mostri `<sl-stat-group label=…>` con le `<sl-stat>` annidate, e che un Tab
   Group mostri un `sl-tab-panel` per ogni tab.
3. ~~Icone delle 4 Stat dello Stat Group~~ **Fatto**: `shield-check`, `hourglass-split`, `exclamation-triangle`, `bell`
   impostate con la proprietà instance-swap `Icon` (come nell'esempio della doc).

**Esito della verifica del 2026-10-15** (letto da Figma via MCP, sola lettura): libreria pubblicata (`CURRENT`) per Stat
Group, Detail Panel, Table Row, Empty State e Tab Group; snippet Dev Mode corretti per Empty State (`title-text`), Detail
Panel (`contained`), Stat Group (`<sl-stat-group label=…>` con 4 `<sl-stat>` annidate, icone incluse) e Tab Group (un
`<sl-tab-panel>` per tab). Tutto il lavoro di questa sezione è chiuso.

## Stepper (nuovo) (2026-10-15)

Fatto in Figma (file A, pagina Stepper, via Plugin API):

- Nuovo componente **Stepper** (`847:44`, key `e35e734d…ac17`) dentro `Card: Component`, sotto il set `Step`: Auto Layout
  orizzontale, 640px, 4 istanze di Step (Upload complete, Review current, Approve e Publish upcoming; il collegamento
  dell'ultimo è nascosto). Creato da una copia dell'esempio "Stepper (Horizontal) v2", che resta nella card Variants.
  La variante verticale (`orientation="vertical"`) non è disegnata in Figma.

Fatto nel codice:

- `figma/stepper.figma.ts` (nuovo): emette `<sl-stepper label="Steps" current="N">` con le Step figlie (fino a 6);
  `current` è l'indice della prima Step con `State=current`, oppure il numero di step se sono tutte `complete`.
  `label` e `linear` non hanno un layer Figma.
- La skill `rebranding` lo classifica ora come componente con Code Connect.

Da fare:

1. **Publish libreria** (Stepper è nuovo) e poi `npx figma connect publish` per `stepper.figma.ts`.
2. In Dev Mode, uno Stepper deve mostrare `<sl-stepper … current="1">` con le quattro `<sl-step>` annidate.
3. Facoltativo: variante verticale dello Stepper in Figma (oggi solo orizzontale).

**Esito della verifica del 2026-10-15** (letto da Figma via MCP, sola lettura): Stepper pubblicato (`CURRENT`) e snippet
Dev Mode corretto: `<sl-stepper label="Steps" current="1">` con le quattro `<sl-step>` annidate. Sezione chiusa.

## Table, Table Pagination, doppie chevron (nuovi) (2026-10-15)

Motivo: in Figma non esisteva un componente "Table" (solo Table Header Row, Table Row e Table Row Marker), la toolbar era
solo un frame di esempio e la paginazione non esisteva; ogni pagina componeva la tabella a mano.

Fatto in Figma (file A, pagina Table e pagina Icons, via Plugin API):

- **Table** (`858:370`, key `3d69681d…2e1933`) dentro la nuova card `Card: Table`: contenitore con bordo `neutral/200`, raggio
  `Radius/medium` e fill `neutral/0`; slot **`Toolbar`** (default: Create, Export, "3 records"), slot **`Rows`** (default:
  Table Header Row + 3 Table Row), istanza **`Pagination`**; opzioni **Show Toolbar** e **Show Pagination**. Verificato su
  un'istanza temporanea: senza toolbar l'altezza passa da 250 a 205, senza paginazione a 210.
- **Table Pagination** (`855:430`, set con proprietà `Page size` 10 / 25 / 50 / 100) dentro `Card: Table Pagination`: riepilogo
  "Showing 1 – 25 of 142", primo / precedente / "Page 1 of 6" / successivo / ultimo, "Rows per page" con Select; usa Icon
  Button e Select del DS, stili di testo `Body/Small` e variabili esistenti.
- **Icon/chevron-double-left** (`854:284`) e **Icon/chevron-double-right** (`854:293`) nella pagina Icons, con lo stesso schema
  delle altre icone (swatch, vettore legato a `text/body`). Servono ai pulsanti "prima / ultima pagina".

Fatto nel codice:

- `figma/table.figma.ts` (nuovo): emette `<sl-table [selection] [striped] [paginate page-size] sticky-header>` con la
  toolbar nello slot `toolbar` (`<div slot="toolbar">…</div>`); `selection` e `striped` si leggono dalla Header Row e dalla prima
  Row nello slot `Rows`, `page-size` dall'istanza `Pagination`.
- `figma/table-pagination.figma.ts` (nuovo): `<sl-table paginate page-size="N" page-sizes="10 25 50 100">`.
- `figma/icon-chevron-double-left.figma.ts` e `…-right.figma.ts` (nuovi).
- Table Header Row e Table Row restano mappati come prima (snippet di riferimento per colonne e dati).

Da fare:

1. **Publish libreria** (Table, Table Pagination e le due icone sono nuovi) e poi `npx figma connect publish`.
2. In Dev Mode: una Table con toolbar e paginazione deve mostrare `<sl-table paginate page-size="25" sticky-header>` con
   `<div slot="toolbar">` e i pulsanti annidati; senza toolbar o senza paginazione gli attributi spariscono.
3. Controllare che gli slot compaiano nel pannello Dev Mode/CC come nel Detail Panel. Non l'ho potuto verificare prima del
   publish: `getSlot` funziona sul Detail Panel, ma qui lo slot ha anche la proprietà `Show Toolbar` collegata alla visibilità.
4. Facoltativo: usare l'istanza Table nel file xCPage al posto delle tabelle locali "Task table" (vedi adozione).

**Esito della verifica del 2026-10-15** (letto da Figma via MCP, sola lettura): Table, Table Pagination e le due icone
`chevron-double-*` risultano pubblicati (`CURRENT`). Snippet Dev Mode:

- Table: `<sl-table paginate page-size="25" sticky-header>` con `<div slot="toolbar">` e, dentro, i due `sl-button size="small"`
  (`variant="primary"` Create, `variant="default"` Export); la paginazione compare come `paginate page-size`. Lo slot `getSlot`
  funziona anche con la visibilità collegata a `Show Toolbar`.
- Table Pagination (`Page size=25`): `<sl-table paginate page-size="25" page-sizes="10 25 50 100">`.
- Nota d'uso: nello slot `Toolbar` generano codice solo i componenti del DS (Button, Input, Dropdown…). Spacer e testo semplice
  come "3 records" restano design e non diventano markup: in una pagina vera conviene metterci componenti DS.

Sezione chiusa.

## Table: selezione singola, stato vuoto; nuovo Menu (2026-10-15)

Fatto in Figma (file A, via Plugin API), Table `858:370` modificata **in-place** (stesso nodo e stessa chiave):

- Nuove proprietà: **Single Selection** (boolean), **Show Rows** (boolean, default sì), **Show Empty** (boolean, default no) e
  nuovo slot **`Empty`** con un'istanza di Empty State. Con Show Rows spento e Show Empty acceso l'altezza passa da 250 a 378.
- Nuovo componente **Menu** (`862:126`, key `1adb1eaa…da7bf`) nella pagina Menu, dentro `Card: Menu`: il pannello del
  Dropdown con le voci in uno slot **`Items`** (Menu Item, Menu Label, Divider). Serve anche per il menu ⋮ della riga, da
  posizionare sotto il pulsante.

Fatto nel codice:

- `figma/table.figma.ts`: `selection="single"` quando **Single Selection** è acceso e la Header Row non ha la casella
  (`multiple` resta guidato dalla casella di selezione); con **Show Empty** emette `<div slot="empty">` con l'Empty State.
- `figma/menu.figma.ts` (nuovo): `<sl-menu>` con le voci dello slot `Items`. `sl-menu` ha ora un Code Connect.

Da fare:

1. **Publish libreria** e `npx figma connect publish` (`table.figma.ts` cambia, `menu.figma.ts` è nuovo).
2. In Dev Mode: una Table con Single Selection acceso deve mostrare `selection="single"`; con Show Empty `<div slot="empty">`
   con `<sl-empty-state>`; un Menu deve mostrare `<sl-menu>` con le `<sl-menu-item>` annidate.
3. **Intestazioni ordinabili e colonne configurabili**: non ancora fatti, in attesa della scelta della struttura delle
   colonne (la freccia di ordinamento vive nella cella di intestazione).

## Table a colonne: Table Column, Table Cell (nuovi) (2026-10-15)

Motivo: con Table Header Row e Table Row le colonne erano 6 e fisse, quindi le liste con colonne diverse (documenti, utenti,
revisioni, destinatari) richiedevano di staccare le istanze e perdevano il Code Connect. Scelta: **una colonna è un'istanza**,
dentro lo slot `Rows` di **un'unica Table**: aggiungere o togliere una colonna è aggiungere o togliere un'istanza.

Fatto in Figma (file A, pagina Table, via Plugin API):

- **Table Cell** (`867:2425`, key `ecee9a4f…7b86`, set di 28 varianti) in `Card: Table Cell`: `Type` (text, document, status, tag,
  checkbox, actions), `Align` (start, center, end), `Height` (compact 41, tall 60) più `Selected`, `Striped`, `Text`,
  `Meta 1`, `Meta 2`. Usa Status, Tag, Checkbox e Icon Button del DS, i testi e le variabili delle righe esistenti.
- **Table Column** (`871:2690`, key `db4a725e…e9c0`, set di 14 varianti) in `Card: Table Column`: `Kind`
  (data, selection, actions), `Sort` (off, none, asc, desc), `Align`, proprietà testo `Label` e slot **`Cells`** con 5 Table Cell
  di default. `Kind=selection` ha la casella "seleziona tutto", `Kind=actions` la colonna del menu ⋮.
- **Table** (`858:370`, stessa chiave): lo slot `Rows` ora contiene 4 Table Column (Task, Rev. code, Created, Due date) in
  orizzontale. Provato su un'istanza temporanea: togliere una colonna la rimuove, aggiungerne una (anche di selezione) la inserisce.
- Table Header Row e Table Row restano pubblicati e mappati per chi li usa già (file xCPage), ma per le nuove tabelle va usata la
  Table con le colonne.

Fatto nel codice:

- `figma/table-column.figma.ts` (nuovo): snippet di riferimento della voce di `columns` (`id`, `accessorKey`, `header`,
  `enableSorting`, `meta.align`; colonna azioni con `meta.actions`).
- `figma/table-cell.figma.ts` (nuovo): snippet di riferimento della cella per tipo (status, tag, documento, azioni).
- `figma/table.figma.ts`: ricava dalle colonne annidate `table.columns = […]`, `selection="multiple"` (colonna di selezione),
  `sort-column` e `sort-direction` (colonna con `Sort=asc/desc`), `striped` dalle celle; resta il ripiego sulle vecchie righe.

Limiti noti:

- Le celle di una riga devono avere lo stesso `Height` (e `Align` coerente con l'intestazione) in tutte le colonne: Figma non lo
  propaga. Per marcare una riga selezionata o a strisce si selezionano insieme le celle di quella riga e si accende `Selected`.
- Il testo di Status e Tag si modifica nell'istanza annidata (Figma non permette di collegarlo a una proprietà della cella).
- Il numero di righe di esempio di una colonna si cambia aggiungendo o togliendo istanze nello slot `Cells`.

Da fare:

1. **Publish libreria** (Table Cell e Table Column sono nuovi, Table cambia) e poi `npx figma connect publish`
   (`table-cell`, `table-column` nuovi; `table` modificato).
2. In Dev Mode: una Table con 4 colonne deve mostrare `<sl-table …>` con il commento `table.columns = […]` con 4 voci; con la colonna di
   selezione `selection="multiple"`; con una colonna `Sort=asc` `sort-column` e `sort-direction`. **Non verificato prima del publish:**
   che `findConnectedInstances` raggiunga le colonne dentro lo slot (funziona con le istanze figlie di Dropdown e Tab Group, non
   ancora provato dentro uno slot).
3. Eventuale: usare l'istanza Table a colonne nel file xCPage al posto dei frame locali.

**Verifica del 2026-10-15 dopo il publish** (letto da Figma via MCP, sola lettura):

- Table Column, Table Cell e Menu risultano pubblicati (`CURRENT`). Snippet Dev Mode:
  - Table: `<sl-table paginate page-size="25" sticky-header>` con `<div slot="toolbar">` e il commento
    `table.columns = [ … ]` con le 4 colonne (Task, Rev. code, Created, Due date, ciascuna con `enableSorting: true` perché
    `Sort=none` significa ordinabile). `findConnectedInstances` raggiunge quindi le colonne dentro lo slot.
  - Table Column: `<!-- columns entry: { id: 'column', accessorKey: 'column', header: 'Column' } -->`.
- La Table risultava `CHANGED` (modifiche non pubblicate): la descrizione del componente parlava ancora di Header Row e Row.
  L'ho riscritta (colonne, Show Rows / Show Empty, Single Selection); **serve un nuovo publish della libreria** e poi nulla da
  rifare lato Code Connect.

## Marker di riga, cella composita, Table Toolbar (2026-10-15)

Richiesta: prima di togliere le tabelle vecchie (Header Row, Row) servono il marker di riga, la composizione della toolbar con
gruppi di icon button (frame `435:578`) e una cella unica per stato, badge e icona PDF.

Fatto in Figma (file A, pagina Table, via Plugin API):

- **Table Cell** (`867:2425`, ora 34 varianti, stessa chiave): nuove proprietà **`Marker`** (boolean) e **`Marker Variant`**
  (instance swap su Table Row Marker, 6 colori) con la barra di 3px a sinistra in tutte le varianti; nuovo `Type=composite` con
  slot **`Content`** (di default Status, Badge Pill e Icon Button con icona PDF, 32px). Provato su istanze temporanee:
  Marker acceso con `Variant=success` mostra la barra del colore giusto.
- **Table Toolbar** (`879:988`, key `98029782…d001`) in `Card: Table Toolbar`: copia della toolbar di riferimento con slot **`Actions`**
  (gruppi di Icon Button e Divider, contenuto di default identico all'esempio) e proprietà **`Summary`** (testo) e **`Show Summary`**.
  Padding e bordo li dà lo slot `Toolbar` della Table.
- **Table Row Marker resta**: è la sorgente dello swap del marker, quindi non va eliminato.

Fatto nel codice:

- `figma/table-toolbar.figma.ts` (nuovo): azioni dello slot e riepilogo dentro `<div slot="toolbar">`.
- `figma/table-cell.figma.ts`: tipo `composite` con lo slot `Content`; con `Marker` acceso aggiunge `table.rowVariant = row => '<colore>'`.
- `figma/table.figma.ts`: `table.rowVariant = …` nel commento delle colonne, ricavato dalla prima cella con `Marker`.

Da fare:

1. **Publish libreria** (Table Toolbar è nuovo, Table Cell cambia) e `npx figma connect publish`
   (`table-toolbar` nuovo; `table-cell` e `table` modificati).
2. In Dev Mode: una cella composita deve mostrare `<!-- cell: … ${Status, Badge, Icon Button} -->`; con Marker acceso
   `row marker: table.rowVariant = row => '…'`; una Table Toolbar i suoi Icon Button e Divider dentro `<div slot="toolbar">`.
   **Non verificato prima del publish:** che gli Icon Button annidati nei frame `group` dello slot `Actions` generino codice.
3. Poi la pulizia delle tabelle vecchie, in ordine: rifare i 5 esempi con la nuova Table; migrare xCPage; eliminare Table
   Header Row, Table Row, le 2 card e i Code Connect `table-row` e `table-header-row` (con `figma connect unpublish`).

## Colori del marker e `sl-tree` (2026-10-15)

Contesto: il SUD 3.0 usa tre indicatori di scadenza (Safe / Expiring / Expired) e un albero HBS nella tab Structures.

- **Marker**: nessuna modifica a Figma. Table Row Marker ha già 6 varianti e il codice (`rowVariant`) accetta
  `success | warning | danger`: Safe → `success`, Expiring → `warning`, Expired → `danger`. `figma/table.figma.ts` ora elenca
  **tutti** i colori usati nelle celle con `Marker` (prima emetteva solo il primo): con più colori scrive
  `table.rowVariant = row => '<one per record: success | warning | danger>'`.
- **Tree** (nuovo, `881:6`, pagina Tree, `Card: Tree`): contenitore con slot `Items` di Tree Item, stessa struttura del Menu.
  `figma/tree.figma.ts` emette `<sl-tree>` con gli item dello slot; `sl-tree` risulta ora CC nell'inventario.
- **Limite noto, poi risolto**: Tree Item non aveva uno slot per i figli (vedi la sezione successiva).

Da fare: publish libreria e `npx figma connect publish` (nuovo `tree`, modificato `table`), poi verifica in Dev Mode.

## Icone dei marker di task (2026-10-15)

Richiesta: `person-x` (Abort del Lead Reviewer) mancava; la checkbox "Accepted" e il fumetto del commento devono cambiare forma e colore.

Fatto in Figma (file A, pagina Icons, via Plugin API): quattro nuove icone Bootstrap, clonando lo swatch delle altre (vettore legato alla
variabile `text/body`): **Icon/person-x** (`887:3`), **Icon/check-square** (`887:12`), **Icon/check-square-fill** (`887:21`),
**Icon/chat-fill** (`887:27`). `Icon/chat` esisteva già.

Fatto nel codice:

- `figma/icon-person-x.figma.ts`, `icon-check-square.figma.ts`, `icon-check-square-fill.figma.ts`, `icon-chat-fill.figma.ts` (nuovi).
- Pagine Reviewer e Lead Reviewer: marker "Accepted" `check-square` (neutro) → `check-square-fill` (accent); commento `chat` (neutro) → `chat-fill` (success).

Da fare: publish libreria (4 icone nuove) e `npx figma connect publish` (4 file nuovi); poi in Dev Mode ogni icona deve mostrare
`<sl-icon name="…"></sl-icon>`.

## Tree Item: slot `Children` (2026-10-15)

Fatto in Figma (file A, pagina Tree, via Plugin API) sul set **Tree Item** (`46:18`, stessa chiave; solo le 4 varianti `Expanded=true`):

- Nuova proprietà **`Children`** (slot) e struttura `Row` (la riga originale con fill, bordo, padding e i 3 layer, stessi ID) +
  slot `Children` rientrato di 16px (come `--indent-size`). Radice trasparente, in verticale.
- Gli ID dei layer interni non sono cambiati, quindi gli override di testo delle istanze restano. Le istanze erano 7, tutte nella
  pagina Tree.
- Le varianti `Expanded=true` stavano tutte sullo stesso `y` (si sovrapponevano): le ho riposizionate nel set.
- Lo slot è vuoto di default: un Tree Item non può contenere istanze di se stesso nel master. Il **Tree** di esempio (`881:6`) ora
  mostra tre livelli (03 HBS › LEVEL1 › ele1_1, KT HBS1) e un fratello (test FD).

Fatto nel codice: `figma/tree-item.figma.ts` emette gli item annidati dentro `<sl-tree-item expanded>…</sl-tree-item>`.

Da fare: publish libreria e `npx figma connect publish` (modificato `tree-item`); in Dev Mode il Tree di esempio deve mostrare
`<sl-tree-item expanded>03 HBS<sl-tree-item expanded>LEVEL1<sl-tree-item>ele1_1</sl-tree-item></sl-tree-item><sl-tree-item selected>KT HBS1</sl-tree-item></sl-tree-item>`.
