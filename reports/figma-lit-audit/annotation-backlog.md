# Richieste annotate — Consumer Figma (xCPage)

- Figma B / consumer URL: `https://www.figma.com/design/OfIlK52MJl2iQfPRKg7Xgn/xCPage`
- Figma A / DS URL: `https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS`
- Extraction date: `2026-10-14`
- Coverage: 1 pagina canvas su 1 (`0:1 Page 1`); sezioni scansionate: `9:102` (Local components — missing in Saipem DS) e `19:4670` (xCPage — rebuilt with Saipem DS). Nessuna pagina incompleta.
- Annotations: 117 istanze pinned (Dev Mode, via `figma.annotations`), deduplicate in **13 richieste uniche** per fingerprint testo. Esiste inoltre una "Legend" testuale non-annotation (frame `19:4671`) che riassume lo stesso contenuto — letta come contesto, non come fonte primaria.
- Comments (separati dalle annotation): `COMMENTS_NOT_READ` — la Plugin API non espone i commenti Figma; non letti.
- Safety: nessuna annotazione originale è stata modificata, eliminata o marcata come risolta. **Nessun file Figma è stato scritto.**

| ID | Istanze | Testo originale (sintesi) | Tipo richiesta | Master A / Lit | Stato richiesta | Verifica | Nota |
|---|---|---|---|---|---|---|---|
| REQ-001 | 39 | Workflow Stage Tab (card tab + counter), composta da Tab+Badge Pill | DS_CHANGE | Tab (`45:10`) + Badge Pill (`34:88`) / `sl-tab[card]` + `sl-badge[pill]` | **IMPLEMENTED** | PASS | Counter+Counter Type aggiunti; Card background ribind a token. Fix applicato 2026-10-14 |
| REQ-002 | 13 | Table Header Row: larghezze colonna fisse, non override | DS_CHANGE | Table Header Row (`53:2`) / `sl-table` ColumnDef | **IMPLEMENTED** | PASS | 6 colonne convertite FIXED→FILL, testato con resize istanza. Fix applicato 2026-10-14 |
| REQ-003 | 14 | Detail Panel: nessuno slot body; header senza azioni extra | DS_CHANGE | Detail Panel (`396:1722`) / `sl-detail-panel` | **IMPLEMENTED** | PASS | Body + Actions convertiti in vere property SLOT. Fix applicato 2026-10-14 |
| REQ-004 | 14 | Tab: manca prop icona; Tab Group: manca indicatore attivo per-tab | DS_CHANGE | Tab (`45:10`) / Tab Group (`354:74`) | **IMPLEMENTED** | PASS | Icon/indicatore già presenti; nessuna ulteriore patch necessaria. Verificato 2026-10-14 |
| REQ-005 | 3 | Card: nessuno slot body | DS_CHANGE | Card (`53:87`) / `sl-card` | **IMPLEMENTED** | PASS | Body convertito in SLOT su tutte le 4 varianti. Fix applicato 2026-10-14 |
| REQ-006 | 6 | Description List (label/value) | NEW_DS_COMPONENT | Description List Item (`700:1775`) + Description List (`700:1776`) / `sl-description-list(-item)` | **IMPLEMENTED** | PASS | Nuovo master creato (pagina "Description List"). Fix applicato 2026-10-14 |
| REQ-007 | 6 | Dialog: nessuno slot body | DS_CHANGE | Dialog (`54:21`) / `sl-dialog` | **IMPLEMENTED** | PASS | Body convertito in SLOT su tutte le 4 varianti. Fix applicato 2026-10-14 |
| REQ-008 | 2 | Toast: nessun componente dedicato, workaround Alert+Shadow/Large | DS_CHANGE (documentazione) | Alert (`35:32`) / `sl-alert.toast()` | **IMPLEMENTED** | PASS | Nessun gap di codice reale: `Shadow/Large` già esiste come effect style, `sl-alert.toast()` è già il meccanismo ufficiale. Aggiunto esempio composizione "Alert + Shadow/Large" nella pagina Alert. Fix applicato 2026-10-14 |
| REQ-009 | 15 | File Upload Item (4 stati) | DS_CHANGE (già risolto) | File Upload Item (`661:61`) / `sl-file-upload-item` | **IMPLEMENTED** | NOT_TESTED | **Annotazione obsoleta**: componente già presente in A e nel codice (invariato in questa sessione) |
| REQ-010 | 1 | Review Comment item (avatar, autore, data, testo, allegato) | NEW_DS_COMPONENT | Comment (`704:2`) / `sl-comment` | **IMPLEMENTED** | PASS | Nuovo master creato (pagina "Comment"). Fix applicato 2026-10-14 |
| REQ-011 | 2 | Table Row: celle multi-riga/icona non rappresentabili | DS_CHANGE | Table Row (`53:37`) | **IMPLEMENTED** | PASS | Column width fix applicato alle 28 varianti. Fix applicato 2026-10-14 |
| REQ-012 | 1 | Table Row: colonna timestamp 90px fissa, testo tagliato | DS_CHANGE | Table Row (`53:37`) | **IMPLEMENTED** | PASS | Colonna DUE DATE ora flessibile. Fix applicato 2026-10-14 |
| REQ-013 | 1 | Table Row: nessuna cella avatar/icona | DS_CHANGE | Table Row (`53:37`) | **IMPLEMENTED** | PASS | Vincolo di larghezza risolto; cell-renderer custom resta lato codice (già supportato). Fix applicato 2026-10-14 |

## Fix applicati 2026-10-14 (Batch 1, 2, 3, 4, 5 — solo File A, nessuna pubblicazione)

**Batch 3 aggiunto dopo verifica richiesta dall'utente** (lo stato di Table era stato ri-controllato in Figma prima di intervenire, confermando che il lavoro manuale del giorno precedente su Quick Info/marker non aveva toccato la larghezza colonne):
- **Table Header Row (`53:2`)** + **Table Row (`53:37`, 28 varianti)**: le 6 colonne dati (TASKS, REV. CODE, CREATED DATE, DUE DATE, DISCIPLINE, ORIGINATOR) convertite da `FIXED` a `FILL` con `layoutGrow` proporzionale; componenti bloccati in `primaryAxisSizingMode=FIXED` alla larghezza attuale (nessun cambiamento visivo di default). `stripe-overlay` (presente in 14 varianti default/disabled) impostato a `constraints.horizontal=STRETCH` per restare sincronizzato. Testato con resize di un'istanza di prova (830→1200px): colonne si ridistribuiscono proporzionalmente senza detach; istanza di prova rimossa dopo la verifica.

**Batch 5**: aggiunto esempio "Toast = Alert (success, closable) + Shadow/Large" nella pagina Alert — nessun nuovo componente, `Shadow/Large` e il meccanismo `sl-alert.toast()` esistevano già sia in Figma sia nel codice.

## Regressione rilevata e corretta 2026-10-14 (post Batch 3)

L'utente ha segnalato colonne che uscivano dal contenitore in `Table (Toolbar Actions)` (node `435:573`). Causa: le istanze `435:574` (Table Header Row) e `435:575/576/577` (Table Row) avevano un override pre-esistente (4 delle 6 colonne dati rimosse per mostrare un esempio a sole 2 colonne); l'override non ha ereditato il nuovo `layoutGrow` impostato sul master durante il fix di Batch 3 ed è rimasto al valore di default `1` invece di `90` sulla colonna "REV. CODE", schiacciandola e facendo traboccare "SUBJECT". Corretto impostando `layoutGrow=90` direttamente sulle 4 istanze. Verificato con screenshot prima/dopo. Scansionate tutte le 12 istanze di Table Header Row/Table Row nella pagina Table: nessun'altra anomalia.

## Verifica parità Tab/Tab Group codice↔Figma e fix 2026-10-14

Su richiesta dell'utente, verificato che tutti gli esempi di `docs/pages/components/tab-group.md` avessero un corrispettivo in Figma A. Risultato: le property/varianti erano tutte presenti (Placement, Closable, Card, Icon, Counter), ma **nessun esempio di composizione era mai stato costruito** sulla pagina Tabs (solo i component set grezzi) — da cui il "Card Tabs with Counters" mancante segnalato dall'utente.

Scoperta aggiuntiva: il **Nav di Tab Group (tutte e 4 le varianti Placement) usava frame/rettangoli statici indipendenti invece di vere istanze del Tab** — gli aggiornamenti al Tab (Card/Counter/Icon) non si sarebbero mai riflessi lì. Su approvazione dell'utente:

- Sostituiti i frame statici con vere istanze Tab (State=default/active) in tutte e 4 le varianti Placement (top/bottom/start/end), preservando le etichette originali (Overview/Documents/History/Settings, con "Documents" attivo).
- Scoperto un limite di piattaforma Figma: non è possibile sovrascrivere la posizione (`relative-transform`) di un layer non esposto dentro un'istanza. Per rappresentare correttamente l'indicatore attivo a lato (come nel CSS reale: bordo destro per `start`, bordo sinistro per `end`, invece del bordo inferiore di `top`/`bottom`), aggiunte 3 nuove property booleane al Tab (`Indicator Bottom`/`Indicator Left`/`Indicator Right`, solo su State=active) e applicate alle istanze "Documents" di start/end. Verificato con screenshot: indicatore laterale corretto su entrambi i lati.
- Costruito l'esempio "Card Tabs with Counters" sulla pagina Tabs: 3 istanze Tab (PVA/Consolidation 22, neutral; Review 11, primary/attivo), fedele al doc. Verificato con screenshot.

Restano senza esempio di composizione (bassa priorità, non richiesti in questo giro): Tabs with Icons, Closable Tabs, Bottom/Start/End placement standalone demo. Scrolling Tabs/Fixed scroll controls/Manual Activation sono comportamento solo-JS, non rappresentabili come varianti statiche (N/A).

### Bug fix: posizione errata di Indicator Left/Right (segnalato dall'utente su node 725:8)

Causa: in fase di creazione, `x`/`y` erano stati impostati **prima** di cambiare `layoutPositioning` a `'ABSOLUTE'` sui due nuovi rettangoli — mentre il nodo era ancora un figlio di flusso auto-layout, Figma ha ignorato le coordinate assegnate e li ha posizionati secondo il flusso (flex), congelando quella posizione sbagliata (x=94/y=12 e x=77/y=12 invece di bordo destro/sinistro a filo, y=0) nel momento in cui `layoutPositioning` è stato cambiato. Corretto reimpostando `x`/`y`/dimensioni direttamente sul master (`45:6`, State=active) ora che il contesto di posizionamento assoluto era già attivo; la correzione si propaga automaticamente a tutte le istanze (nessun override di posizione esistente su nessuna istanza). Verificato su `725:8` (istanza di test con Bottom+Left+Right tutti attivi) e sulle istanze reali start/end e sull'esempio "Card Tabs with Counters": tutte corrette.

### Bug fix: spaziatura mancante in modalità Card (segnalato dall'utente su node 732:103)

Causa radice: il CSS reale (`tab.styles.ts`) applica `gap: var(--sl-spacing-x-small)` **solo** quando `.tab--card` è attivo (`.tab` base non ha gap, side a icona/close button coi propri margin). Il master Figma ha `itemSpacing: 0` fissato a livello di componente — corretto per il Tab semplice, ma Figma non permette di legare condizionalmente un gap/padding a una property booleana (`Card`), quindi va impostato per istanza. Corretto impostando `itemSpacing` = `spacing/x-small` sulle 3 istanze dell'esempio "Card Tabs with Counters" (`732:95/103/111`).

Durante il fix, scoperto un comportamento non ovvio della Plugin API: chiamare `instance.setProperties()` con una mappa **parziale** di property può far "riaffiorare" i valori di default originali (quelli passati ad `addComponentProperty` quando la property fu creata) su altre property non specificate nella stessa chiamata, invece di preservare lo stato corrente dell'istanza — ha causato temporaneamente `Icon`/`Closable` a `true` (default originali) e poi, in un secondo tentativo di correzione parziale, la perdita di `Counter=true` su un'istanza. Risolto reimpostando **tutte** le property rilevanti in un'unica chiamata atomica per istanza. **Nota per il futuro**: preferire sempre una singola `setProperties()` con tutte le property desiderate, non chiamate incrementali.

## Verifica e fix Header / Header Item 2026-10-14

Su segnalazione dell'utente, confronto puntuale con `header.styles.ts` / `header-item.styles.ts` (sorgente di verità CSS):

- **Header Item "Default"**: il testo doveva essere bianco all'**82% di opacità** (`color-mix(in srgb, var(--color) 82%, transparent)`), era al 100% → **corretto**.
- **Header Item "Current"**: doveva avere uno sfondo bianco al **16%** (`aria-current="page"` → `color-mix(... 16% ...)`), era completamente assente (fills vuoto) → **corretto**, aggiunto fill bianco 16% opacity sulla variante State=Current.
- **Has Menu → chevron**: verificato corretto (già bindato via `componentPropertyReferences.visible`), nessun fix necessario.
- **Bordo inferiore accent-color** (3px, "brand signature"): verificato corretto, già presente e bindato a variabile.
- **Nav item bespoke dentro Header** (Dashboard/Documents/Reports): non erano istanze di Header Item ma frame indipendenti (stesso pattern di drift già visto in Tab Group). Curiosamente avevano già opacità/wash corretti (82%/16%) ma un `cornerRadius` non-token (4px invece di 6px = `radius/medium`, quello corretto usato da Header Item). **Sostituiti con vere istanze** di Header Item (Dashboard=Default+Has Menu, Documents=Current, Reports=Default+Has Menu), risolvendo radius e garantendo che i futuri fix al componente si propaghino automaticamente.
- **Esempio dropdown/menu mancante**: il mockup del componente Header non mostrava mai la capacità dropdown (nessun chevron), mentre il primo esempio di `header.md` mostra 2 item con `menu` dropdown + 1 item corrente. Allineato: Dashboard e Reports ora hanno `Has Menu=true` (chevron visibile), Documents resta "Current" senza menu — fedele alla composizione del doc.
- Verificato che la correzione si propaga correttamente sia al componente master sia alla sua istanza di esempio nella sezione "Variants" della pagina (screenshot prima/dopo).

## Bug chevron + pannello dropdown mancante (segnalato dall'utente, node 52:2)

L'utente ha abilitato `Has Menu` su un'istanza e notato che il chevron non si vedeva correttamente e che il menu "aperto" non mostrava alcun pannello.

- **Bug colore chevron** (tutti e 3 gli stati Default/Open/Current): il `Vector` del chevron era legato a `text/body` (grigio scuro per sfondi chiari) invece che bianco — risultato: icona praticamente invisibile sullo sfondo petrolio scuro dell'header. Corretto: bianco a 82% di opacità su Default, 100% su Open/Current (coerente con l'opacità del testo in ciascuno stato).
- **Bug rotazione chevron**: lo stato "Open" non ruotava il chevron (dovrebbe puntare in alto, per `[aria-expanded='true'] .header-item__chevron { rotate: 180deg }`) — corretto (rotation=180). Trovato anche un bug opposto pre-esistente sullo stato "Current", che aveva il chevron ruotato a 180° senza motivo (non dovrebbe mai ruotare) — corretto (rotation=0).
- **Pannello dropdown mai costruito**: non esisteva alcuna rappresentazione del menu aperto in Figma (nessuna pagina "Dropdown" con contenuto, solo una pagina vuota). Costruita una composizione di esempio "Header Item — Open with Menu" sulla pagina Header: strip header di sfondo (bg + bordo accent) + trigger "Configuration" (State=Open, Has Menu=true) + pannello dropdown posizionato a filo sotto (gap 0, come da `distance=0` default in `dropdown.component.ts`), con 3 istanze di Menu Item (Users/Permissions/Workflow Rules). Stile pannello fedele al CSS reale: `surface/panel` + `border/subtle` 1px + `radius/large` (8px) + `Shadow/Large` + padding `2x-small` (4px), riutilizzando il component set Menu Item già esistente in DS A (nessun nuovo componente creato per gli item). Verificato con screenshot: corrisponde al riferimento fornito dall'utente.

## Audit Code Connect completo 2026-10-14 (tutti i componenti DS)

Su richiesta dell'utente, inventariate tutte le 48 pagine-componente di Figma A (component set, props) e confrontate con il codice Lit e con i 48 file `.figma.ts` già esistenti in `figma/`.

**Correzione 2026-10-14 (seconda verifica)**: l'utente ha segnalato che Button Group/Dropdown/Radio Group non erano vuote — avevano ragione. L'errore era nel mio controllo: cercavo solo nodi `COMPONENT`/`COMPONENT_SET`, ma le pagine contenevano frame di esempio reali (Button Group: 11 varianti; Dropdown: 2 varianti; Radio Group: 1 esempio), composti da istanze di altri componenti (Button, Icon Button, Radio Button) — semplicemente non erano MASTER component pubblicabili. Convertito un frame rappresentativo per pagina in vero `COMPONENT` via `figma.createComponentFromNode()` (preserva le istanze figlie, dimensioni verificate invariate con screenshot): "Button Group (medium)"→`768:184`, "Dropdown (Rich Menu)"→`768:283`, "Radio Group (Example)"→`768:37`. Creati `button-group.figma.ts`, `dropdown.figma.ts`, `radio-group.figma.ts` (compongono dinamicamente le istanze figlie via `findConnectedInstances`). Totale ora: **64 file** `.figma.ts`, validati con `tsc` (0 errori) e dry-run publish (tutti risolti correttamente, incluso SlButtonGroup/SlDropdown/SlRadioGroup). Pubblicazione reale non eseguita da me (bloccata dal classificatore di sicurezza "External System Writes") — eseguita dall'utente. Verificato post-pubblicazione via `get_code_connect_map`: SlButtonGroup, SlDropdown, SlRadioGroup live in Figma Dev Mode, tutti compongono correttamente le istanze figlie (bottoni, trigger+menu item, radio option).

**Copertura Code Connect ora completa su tutti i 51 component master del DS A** (nessun gap strutturale residuo).

### Bug fix: `radio-button.figma.ts` non mappava `checked` (segnalato dall'utente)

L'utente ha notato che cambiare `State` in Dev Mode non aggiornava lo snippet per Radio Button. Causa: il file mappava `State` solo per calcolare `disabled`, non `checked` — bug pre-esistente (non introdotto oggi, presente già nel file originale). Verificato nel sorgente che `sl-radio-button` ha `checked` come vera `@property({type: Boolean, reflect: true})` (marcata `@internal` solo come indicazione d'uso, ma realmente settabile/riflessa nel DOM) — a differenza di `sl-radio`, dove `checked` è `@state()` puramente interno e NON va mappato (verificato: `radio.figma.ts` è corretto così com'è, nessun fix necessario lì). Corretto `radio-button.figma.ts` aggiungendo `checked`. Rivalidato con `tsc`: 0 errori su tutti i 64 file.

Creati `CLAUDE.md` + `instruction.md` nella root del repo per ricordare, dopo un `/compact`, di continuare a usare la skill `lit-figma-audit-sync` e dove trovare lo stato (`config.local.json`, questo backlog).

**Verifica sistematica della stessa classe di bug** su altri 14 componenti (`checkbox`, `switch`, `menu-item`, `tab`, `tree-item`, `stat`, `selectable-item`, `details`, `header-item`, `file-upload-item`, `copy-button`, `file-drop`, `option`, `step`, `table-row`), confrontando ogni valore di `State` con `@property(reflect:true)` vs `@state()` nel sorgente: **nessun altro bug trovato**. `copy-button`/`file-drop`/`option`/`step`/`table-row` hanno correttamente valori `@state()` interni non mappati (feedback transitorio o gestito dal genitore); tutti gli altri erano già mappati correttamente.

## Seconda ondata di verifiche 2026-10-14 (su richiesta dell'utente: "cos'altro potrebbe esserci sfuggito?")

- **Gap sistemico sulle icone**: le 56 icone base (pagina Icons) non avevano alcun Code Connect. Ogni volta che un `prefix`/`suffix` di un altro componente risolveva a un'icona (il caso più frequente in tutto il DS), `executeTemplate()` non aveva un template da eseguire. Creati 56 file `icon-<nome>.figma.ts` via script generatore (stesso pattern, solo node-id e nome icona cambiano). Totale file ora: **120**, validati (`tsc` 0 errori, dry-run tutti risolti).
- **`getEnum` non esaustivi** (valore mancante → `undefined` invece di un attributo valido, violazione della regola "exhaustive variant handling" della skill Code Connect): `progress-bar` (mancava `indeterminate`), `checkbox` (mancavano `indeterminate`/`indeterminate-hover`), `details` (mancava `disabled`, bug pre-esistente non introdotto oggi).
- **Bug di tipo `getBoolean` su property che sono in realtà `VARIANT` true/false** (non rilevabile né da `tsc` né da `figma connect publish --dry-run` — solo da confronto manuale col tipo reale in Figma): `tree-item.Expanded` e `radio-button.Pill` (quest'ultimo pre-esistente). Verificate per sicurezza **tutte le altre 24 chiamate `getBoolean()`** del progetto: tutte confermate correttamente `BOOLEAN` (euristica: le property che pilotano un `visible` binding su un figlio devono essere `BOOLEAN` per vincolo della Plugin API — solo le property puramente cosmetiche senza binding strutturale rischiano di essere `VARIANT`).
- Dettaglio completo e metodo di verifica salvati in `instruction.md` (root del repo) per riferimento futuro dopo `/compact`.

## Riorganizzazione pagine + audit visivo completo 2026-10-14

Su richiesta dell'utente: (1) riordinate tutte le 52 pagine del file secondo un raggruppamento logico approvato (Cover/Foundations/Icons → Azioni → Form → Feedback → Navigazione → Layout/Contenitori → Altro); (2) avviato un audit visivo completo (localhost vs Figma) componente per componente.

**Bug sistemico trovato e corretto tramite scansione automatica su tutti i 49 component set del DS**: 3 component set avevano i bounds del frame (`width`/`height`) più piccoli dell'area occupata dalle varianti effettive, con `clipsContent:true` — risultato: le varianti oltre il bordo erano invisibili/non selezionabili sul canvas, pur esistendo nel file.
- **Icon Button**: bounds 320×60 ma serviva 304×544 — **23 delle 28 varianti erano invisibili** (solo Variant=default era visibile).
- **Radio Button**: bounds 305×116 ma serviva 299×344.
- **Tree Item**: bounds 260×240 ma serviva 220×265 (gap minore).

Corretti tutti e 3 con `resizeWithoutConstraints()` sui bounds reali. Scansione eseguita su tutte le 49 pagine component (esclude Cover/Foundations/Icons): nessun altro caso trovato.

**Audit visivo (localhost vs Figma) componente per componente**, per categoria (Azioni/Form/Feedback/Navigazione/Layout-Contenitori/Altro): confrontati colori, varianti, stati per tutti i ~51 componenti. Nessuna incoerenza di design sostanziale trovata oltre a quanto già corretto nelle sessioni precedenti (Tab, Header, Table, Dialog, Card, Detail Panel) — palette, stati e composizioni sono coerenti col codice su tutta la libreria. Falso allarme verificato e scartato: Avatar (le 3 forme sembravano simili nello screenshot a bassa risoluzione, ma i `cornerRadius` reali — 24/6/0 — sono corretti).

**Pulizia layout interno delle pagine**:
- Riallineati gli esempi aggiunti oggi (Card Tabs with Counters, Header Item Open with Menu) vicino al contenuto correlato.
- Corretto un overlap di 80px tra "Description List Item" e "Description List" (pagina Description List).
- Riposizionato "Table Row Marker" (component set reale, non scarto) che si sovrapponeva al frame principale della pagina Table.
- **Eliminati nodi orfani pre-esistenti** (non legati al lavoro di oggi, confermati non referenziati da alcuna istanza prima della cancellazione): 12 Ellipse sciolte sulla pagina Status, 19 istanze Icon/check2-circle duplicate sulla pagina Stat.

Verificata assenza di overlap residui su tutte le pagine toccate.

## Bug "freccia finta" + colore icone invisibili su sfondi scuri (segnalato dall'utente, node 201:62)

L'utente ha segnalato un problema sulla freccia in un bottone dentro l'esempio "Button Group (Dropdown)". Causa radice doppia:

1. **Caratteri unicode hardcoded invece della vera property/icona**: il testo del bottone era letteralmente `"Dropdown ⌄"` (col carattere ⌄ scritto a mano), con la property reale `Caret` impostata su `false`. Stesso pattern trovato e corretto in:
   - **Button Group (Dropdown)** — testo corretto a "Dropdown", `Caret` impostato a `true`.
   - **Button Group (Split Button)**, secondo bottone — testo svuotato, `Caret` impostato a `true`.
   - **Tree Item (master component, tutte le 8 varianti)** — sostituiti i caratteri "▸"/"▾" con vere istanze `Icon/chevron-right`, ruotate 90° per Expanded=true (verificato contro il codice: `tree-item.component.ts` usa `sl-icon name="chevron-right"` con `rotate: 90deg` via CSS quando espanso).
   - **Details (master component, tutte le 3 varianti)** — stesso fix, stessa icona/rotazione (`details.component.ts` usa lo stesso pattern).
   - Durante il primo tentativo su Tree Item ho inizialmente usato l'ID sbagliato (`173:8` = Icon/chevron-**left**, non chevron-right) — individuato dallo screenshot e corretto con `swapComponent()` verso l'icona giusta (`173:11`).

2. **Colore icona non visibile su sfondi scuri**: una volta reso visibile il vero Caret sul bottone "primary" (sfondo teal scuro), l'icona risultava comunque invisibile — il suo colore era legato a `text/body` (grigio scuro per sfondi chiari), non al colore reale del testo del bottone (bianco su primary). Causa di fondo: Figma **non carica l'albero interno dei figli di un'istanza nascosta** (`visible:false`) — va temporaneamente resa visibile per poterne leggere/modificare i discendenti. Esteso il fix a tutte le 28 varianti del master Button (7 variant × 4 state), sia per `caret` sia per `prefix`/`suffix`: colore dell'icona ora allineato al colore reale del testo label in ciascuna variante (bianco su sfondi scuri, grigio scuro su sfondi chiari/default/accent). Verificato che **Icon Button** non ha lo stesso problema (usa un'architettura a doppia istanza `icon`/`icon-contrast` commutata dal boolean `Filled`, già corretta). Nessuna regressione nella griglia Button verificata via screenshot.

## Bug "loading spinner disegnato a mano" (segnalato dall'utente, node 240:28)

Il nodo `loading-spinner` su tutte e 28 le varianti del master Button era un'**ellisse con arco parziale disegnato a mano** (stroke bianco, `arcData` ~287°), non il vero componente Spinner — mentre il codice usa `<sl-spinner part="spinner">` con `--indicator-color: currentColor` (`button.styles.ts`). Sostituita su tutte le 28 varianti con una vera istanza di Spinner (`Size=small`, 16px ridimensionato a 14px), mantenendo il binding `visible` alla property `Loading`, con l'indicatore ricolorato per matchare il colore del testo label di ciascuna variante (coerente con `currentColor`). Verificato con screenshot: anello track+indicatore corretto, nessuna regressione sulla griglia Button.

## Espansione pacchetto icone 2026-10-14 (su richiesta dell'utente)

Verifica data-driven: estratti tutti i `name="..."` usati con `<sl-icon>` in `docs/` e `src/components/`, confrontati con le 56 icone esistenti. La maggior parte dei "nomi mancanti" trovati erano demo di altre librerie icone (Font Awesome, Boxicons, Ionicons) usate solo per mostrare come registrare librerie custom — non pertinenti alla nostra libreria Bootstrap Icons. Trovato un gap reale confermato: **`clock-history`**, usata nell'esempio "Tabs with Icons" di `tab-group.md`, non esisteva affatto.

Su approvazione dell'utente, aggiunte **29 nuove icone** (clock-history + pacchetto di 28 comuni), create importando gli **SVG reali di `node_modules/bootstrap-icons`** (già dipendenza del progetto) via `figma.createNodeFromSvg()` + `figma.createComponentFromNode()`, poi ricolorate per coerenza con la convenzione esistente (fill legato a `text/body`). Nota: "map-pin" non esiste in Bootstrap Icons — sostituita con l'equivalente reale `geo-alt`; "shopping-cart" sostituita con il nome reale Bootstrap `cart`.

Icone aggiunte: clock-history, envelope, bell, calendar, camera, pencil, plus, plus-lg, dash, flag, folder, grid, image, lock, search, printer, clipboard, clipboard-check, clipboard-x, archive, briefcase, cart, star, heart-fill, clock, filter, geo-alt, shield-check, bug.

Creati i 29 file Code Connect corrispondenti (`icon-<nome>.figma.ts`). **Totale ora: 85 icone, 149 file Code Connect**, validati con `tsc` (0 errori) e dry-run publish (tutti risolti). Pubblicazione reale non eseguita da me (bloccata dal classificatore di sicurezza) — da eseguire con `figma connect publish` dall'utente, oltre alla ripubblicazione della libreria in Figma (nuovi componenti creati).

**13 nuovi file `.figma.ts` creati** (componenti senza alcuna mappatura): `detail-panel`, `description-list`, `description-list-item`, `comment`, `empty-state`, `selectable-item`, `option`, `button-small`, `button-large`, `button-outline-small`, `button-outline-large`, `tab-group`.

**19 file `.figma.ts` esistenti corretti** (property Figma non riflesse nel codice generato):
- `alert` (Closable), `badge`+`badge-pill` (Pulse), `breadcrumb-item` (prefix/suffix), `button` (Loading/Caret/prefix/suffix), `button-text` (Size), `card` (Body→`getSlot`, Image), `checkbox` (Help Text), `dialog` (Body→`getSlot`, Header Actions, `no-header`), `file-drop` (Show Label, State/disabled), `icon-button` (Icon instance-swap → nome icona), `input` (Filled, Show Label/Help Text, prefix/suffix, Clearable, Password Toggle), `menu-item` (prefix/suffix, Loading), `radio-button` (prefix/suffix), `select` (Filled/Pill/Clearable/Multiple/Open), `stat` (Icon→slot prefix), `tab` (Closable, Icon, Counter/Badge Pill), `textarea` (Filled), `tooltip` (placement left/right mancanti), `tree-item` (Expanded).

Tutti e 61 i file (48+13) validati con `tsc` contro `@figma/code-connect/figma-types`: **0 errori**. Dry-run (`figma connect publish --dry-run`) completato senza errori su tutti e 61. **Pubblicazione eseguita dall'utente** (bloccata per il mio agente dal classificatore di sicurezza "External System Writes" di Claude Code, azione irreversibile su sistema esterno — l'utente ha lanciato il comando in locale col proprio token). Verificato post-pubblicazione via `get_code_connect_map`: i mapping sono live in Figma Dev Mode, inclusi i componenti creati oggi (Tab, Detail Panel, Description List Item confermati).

Tutte le modifiche sono state fatte **in-place** sul file A (`CdCRuuAnOeYrOOn1HYkxDM`), preservando ID/key esistenti dove presenti. Verifica strutturale (`get_metadata`/lettura property) + visiva (screenshot) per ogni componente. **Nessuna pubblicazione eseguita.**

- **Dialog (`54:21`)**: aggiunta property `Body` (SLOT, key `Body#692:0`) e bind su tutte e 4 le varianti (Header Actions era già presente).
- **Card (`53:87`)**: aggiunta property `Body` (SLOT, key `Body#695:0`) e bind su tutte e 4 le varianti.
- **Detail Panel (`396:1722`)**: aggiunta `Body` (SLOT, key `Body#696:0`) e `Actions` (SLOT, key `Actions#696:1`, nuovo frame inserito nell'header prima del Close Button).
- **Tab (`45:10`)**: trovate proprietà `Card`/`Icon`/`Icon Type` già esistenti ma non bindate a variabili — ribind a `surface/panel`, `border/subtle`, `primary/50`, `primary/600`, `radius/large`. Aggiunta `Counter` (BOOLEAN) + `Counter Type` (INSTANCE_SWAP → Badge Pill) su tutte e 5 le varianti di stato.
- **Tab Group (`354:74`)**: nessuna modifica necessaria — l'indicatore attivo è gestito a livello di Tab.
- **Nuova pagina "Description List"**: `Description List Item` (component set, varianti Size=small/x-small) + `Description List` (esempio composizione 2 colonne).
- **Nuova pagina "Comment"**: componente `Comment` (avatar + Author/Date/Text TEXT + Has Attachment boolean).

## Ambiguità e conflitti

- **REQ-008 (Toast)**: non è chiaro se la richiesta implichi un vero componente `sl-toast` dedicato (richiederebbe scope di codice approvato → `NEEDS_CODE_DECISION`) oppure solo documentare in Figma il pattern Alert+Shadow/Large già usato in produzione (solo DS, nessun codice). Da chiarire con il richiedente prima di pianificare un fix.
- **REQ-009 (File Upload Item)**: l'annotazione segnala "missing" ma sia il codice (`feat(file-upload-item)`, commit `80bd7a3d`) sia il DS Figma A (pagina `658:2`) hanno già il componente completo con i 4 stati. Probabile annotazione scritta prima di questi aggiornamenti — da ri-verificare la data/versione dell'annotazione se accessibile, altrimenti considerarla superata.
- **REQ-011/REQ-013** sono la stessa richiesta concettuale (cella tabella ricca con avatar/icona) annotata due volte su istanze diverse — tenute distinte per tracciabilità ma da trattare come un solo item di piano.

## Associazioni provate

- REQ-001/REQ-004 → `CdCRuuAnOeYrOOn1HYkxDM:45:10` (Tab) + `:354:74` (Tab Group) + `:34:88` (Badge Pill) — Evidenza: `get_metadata`/`use_figma` su DS A, confronto con `src/components/tab/tab.component.ts`, `src/components/tab-group/tab-group.component.ts`.
- REQ-002/REQ-012/REQ-013 → `CdCRuuAnOeYrOOn1HYkxDM:53:2` (Table Header Row) + `:53:37` (Table Row) — Evidenza: `componentPropertyDefinitions` letti via Plugin API (nessuna property larghezza/cella), confronto con `src/components/table/table.types.ts`.
- REQ-003 → `CdCRuuAnOeYrOOn1HYkxDM:396:1722` (Detail Panel) — Evidenza: ispezione diretta di `Body`/`Header` children (solo placeholder text + close button), confronto con `src/components/detail-panel/detail-panel.component.ts`.
- REQ-005 → `CdCRuuAnOeYrOOn1HYkxDM:53:87` (Card) — Evidenza: `componentPropertyDefinitions` = `[Image, Header, Footer]`, nessun body; confronto con `src/components/card/card.component.ts`.
- REQ-007 → `CdCRuuAnOeYrOOn1HYkxDM:54:21` (Dialog) — Evidenza: `componentPropertyDefinitions` = `[Header Actions, Header, Footer]`, nessun body; confronto con `src/components/dialog/dialog.component.ts`.
- REQ-009 → `CdCRuuAnOeYrOOn1HYkxDM:661:61` (File Upload Item, 4 stati) — Evidenza: pagina `658:2` già presente in A; confronto con `src/components/file-upload-item/file-upload-item.component.ts`.
- REQ-006/REQ-010 → nessun node A (componente assente) — Evidenza: elenco pagine DS A non contiene "Description List" né "Comment"/"Review Comment"; confronto con `src/components/description-list*` e `src/components/comment/comment.component.ts`.

## Dipendenze

- Code changes: nessuno richiesto per REQ-001…REQ-013 (il codice Lit è già allineato o più avanti dei master Figma). Unica eccezione potenziale: REQ-008 (Toast) se si decide di creare un vero `sl-toast` invece di documentare il pattern esistente — in tal caso `NEEDS_CODE_DECISION`, fuori scope di questa skill.
- Master DS (fix in A, da pianificare e approvare separatamente): REQ-001 (Tab card/counter), REQ-002/012 (column width), REQ-003 (Detail Panel body+actions), REQ-004 (Tab icon + indicator), REQ-005 (Card body), REQ-006 (nuovo Description List), REQ-007 (Dialog body), REQ-010 (nuovo Comment), REQ-011/013 (Table Row rich cell esempio).
- Consumer local-only: nessuna — tutte le richieste di B puntano a gap/allineamenti del DS A, non a personalizzazioni locali del consumer.
- Già risolto, da adottare: REQ-009 (File Upload Item) — richiede solo publish-status check di A + sostituzione istanze in B (fase `adopt`), nessun fix.

## Log verifiche

- Tutte le 13 richieste: BEFORE = letto da `use_figma` (Plugin API, read-only) su File B (`figma.annotations`) e File A (`get_metadata`/`componentPropertyDefinitions`); confronto codice via agente Explore su `sai-che-ui`. AFTER = nessuno (nessuna scrittura eseguita). Stato: `NOT_TESTED` per tutte tranne REQ-009 (`IMPLEMENTED` lato A/codice, adozione in B non ancora verificata).

## Fix applicato 2026-10-14 — 16 icone con vettore non-Bootstrap sostituite

Su richiesta esplicita dell'utente ("domanda le altre icone presenti nella sezione icon sono quelle di bootstrap?" → "Sì, sostituisci tutte e 16 (Recommended)"): verificati tutti i ~56 componenti `Icon/*` sulla pagina Icons (`173:2`) confrontando il contenuto vettoriale con i path reali in `node_modules/bootstrap-icons/icons/*.svg`. 16 componenti avevano forme disegnate a mano (rettangoli/ellissi/testo) invece del vettore Bootstrap reale:

`text-bold` (`199:2`), `text-italic` (`199:4`), `text-underline` (`199:6`), `align-left` (`199:9`), `align-center` (`199:13`), `align-right` (`199:17`), `caret` (`173:14`), `copy` (`173:57`), `cloud-arrow-up` (`173:70`), `exclamation-lg` (`173:54`), `question-circle` (`205:5`), `info-circle` (`214:2`), `exclamation-triangle` (`214:11`), `exclamation-octagon` (`214:16`), `dot` (`225:2`), `pause-fill` (`173:67`), `grip-vertical` (`173:60`).

Sostituiti tutti e 16 con `figma.createNodeFromSvg()` + `figma.createComponentFromNode()` a partire dal path SVG reale di `bootstrap-icons`, fill bindata a `VariableID:27:11` (stesso token colore testo usato per le 29 icone nuove create in precedenza). **Nome del componente Figma mantenuto invariato** (solo contenuto vettoriale sostituito) per non rompere i riferimenti esistenti (prefix/suffix instance-swap in altri master). Dimensione normalizzata a 16×16.

Bug trovato durante la verifica post-fix: per `caret` era stato usato per errore il path di `caret-down` (outline, due subpath che creano un buco) invece di `caret-down-fill` (solido) — risultava un triangolo vuoto invece che pieno. Corretto con il path giusto, riverificato via screenshot: triangolo pieno coerente con lo stile delle altre icone solide (es. `star-fill`, `x-circle-fill`).

Verifica: screenshot della pagina Icons prima/dopo mostra tutte e 16 le icone renderizzate correttamente con stroke/fill coerenti al resto della libreria. Nessuna pubblicazione eseguita in questa fase (richiede azione manuale dell'utente come per i batch precedenti).

## Fix applicato 2026-10-14 — griglia Icons non uniforme (32 icone senza wrapper/etichetta)

Su richiesta esplicita dell'utente ("Puoi sistemarmi in griglia tutte le icone per avere una visualizzazione corretta? Dove fosse possibile aggiungi anche il nome dell'icona per avere uniformità su figma"): ispezionata la struttura di `Card: Icons` (`326:4`, auto-layout `HORIZONTAL`+`WRAP`). Le 52 icone originali sono ciascuna avvolte in un frame `swatch-<nome>` (auto-layout `VERTICAL`, padding 8/8/10/10, itemSpacing 6, hug/hug, centrato) contenente l'icona + una `TEXT` col nome (Inter Regular 9px, colore `#808080` fisso, centrato) — ma 32 icone (3 aggiunte in sessioni precedenti + le 29 nuove create in questa sessione: `arrow-clockwise`, `hourglass-split`, `trash`, `clock-history`, `envelope`, `bell`, `calendar`, `camera`, `pencil`, `plus`, `plus-lg`, `dash`, `flag`, `folder`, `grid`, `image`, `lock`, `search`, `printer`, `clipboard`, `clipboard-check`, `clipboard-x`, `archive`, `briefcase`, `cart`, `star`, `heart-fill`, `clock`, `filter`, `geo-alt`, `shield-check`, `bug`) erano state inserite come componenti nudi, senza wrapper né etichetta — motivo per cui comparivano senza nome e con spaziatura/allineamento diversi dal resto della griglia.

Creato per ciascuna delle 32 un frame `swatch-<nome>` identico per proprietà a quelli esistenti (stesso auto-layout, padding, font, colore etichetta), l'icona è stata riparentata al suo interno (stessa istanza component, nessuna duplicazione) e inserita alla posizione originale in `Card: Icons` per preservare l'ordine. Verificato via screenshot: griglia ora uniforme su tutte le 85 icone, ciascuna con nome leggibile sotto. Nessuna pubblicazione eseguita (azione manuale utente).

## Bug trovato 2026-10-14 — Code Connect dei 16 icone "fake→reali" puntava a nodi cancellati

Dopo che l'utente ha eseguito `figma connect publish` (pubblicazione libreria + Code Connect), verifica di routine (`get_code_connect_map` + ispezione dei file `figma/icon-*.figma.ts`) ha rivelato che i 16 file corrispondenti alle icone sostituite nel fix precedente contenevano ancora il commento `// url=...node-id=<ID VECCHIO>` riferito ai nodi COMPONENT che erano stati **cancellati** (`.remove()`) durante la sostituzione vettoriale, perché la tecnica usata (delete+create invece di editare i figli in-place) genera un nuovo node-id. Il publish eseguito dall'utente molto probabilmente non ha risolto correttamente questi nodi (mapping assente, stale o fallito in silenzio — non verificabile lato agente perché il dry-run richiede un token Figma non disponibile in questa sessione).

Corretti tutti e 16 i commenti `url=` con il node-id reale e attuale, verificato leggendo `instance.name` via Plugin API su ciascun nuovo ID per conferma di corrispondenza:
`text-bold`→`818:4`, `text-italic`→`818:7`, `text-underline`→`818:10`, `align-left`→`818:13`, `align-center`→`818:16`, `align-right`→`818:19`, `caret`→`820:4` (nodo rigenerato due volte per via del fix separato sul path outline vs fill), `copy`→`818:25`, `cloud-arrow-up`→`818:29`, `exclamation-lg`→`818:32`, `question-circle`→`818:36`, `info-circle`→`818:40`, `exclamation-triangle`→`818:44`, `exclamation-octagon`→`818:48`, `dot`→`818:51`, `pause-fill`→`818:54`, `grip-vertical`→`818:57`.

**Azione richiesta all'utente**: ripetere `figma connect publish` per questi 16 file (o publish completo) ora che gli URL sono corretti, altrimenti Dev Mode continuerà a non trovare/mappare correttamente queste icone.

**Lezione per il futuro** (da riportare anche in `instruction.md`): quando si sostituisce il contenuto di un componente Figma con delete+create (anziché editare i figli in-place), il node-id cambia sempre — va aggiornato manualmente ogni commento `url=` nei file Code Connect che referenziano quel nodo, PRIMA che l'utente esegua il publish, non dopo.
