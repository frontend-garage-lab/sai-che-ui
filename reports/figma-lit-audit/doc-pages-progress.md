# Saipem DS — uniformazione pagine documentazione (Figma)

Avviato 2026-10-21. File: Saipem-DS `CdCRuuAnOeYrOOn1HYkxDM`. Consumer attivo: Saipem-XcMM `aHzBtZSU3XnoXxUZsRDT4a` (xCPage `OfIlK52MJl2iQfPRKg7Xgn` dismesso, non migrare).

## Template approvato (riferimento: pagina Button, frame `1076:105`)

1. **Header** — eyebrow `COMPONENTS · <STATUS> · SINCE <x>` (da JSDoc `@status`/`@since`), titolo, `meta.description` del doc, chip (`<sl-tag>`, n. set/varianti, Code Connect).
2. **Playground** — stage con istanza del set principale + pannello Proprietà (nome, tipo, valori, default).
3. **Esempi** — una card per ogni sezione `###` di `docs/pages/components/<name>.md`, ordine del doc, didascalia = titolo + prima frase. Sezioni solo CSS/JS (Styling, eventi, metodi) escluse e annotate.
4. **Variants** — per ogni set: titolo, chip delle prop non-variant, frase dal doc, matrice con etichette riga/colonna intorno al master **spostato** (mai ricreato → node-id e Code Connect invariati).

Regole: **tutti i testi della pagina in inglese** (anche titoli sezione, hint, pannello Properties, chip); **nessun box "PROVA"** nelle Variants — solo il Playground (richiesta utente 2026-10-21); testi dai doc del repo; gap DS (esempio non rappresentabile / proprietà mancanti / bug master) → annotati qui sotto e proposti all'utente prima di modificare i master; dopo modifiche master l'utente pubblica libreria + `figma connect publish`.

## Stato pagine

Legenda: ✅ fatto · 🟡 fatto con gap aperti · ⬜ da fare

| Pagina Figma | Doc | Stato | Note / gap aperti |
|---|---|---|---|
| Button | button | ✅ | Set unico (264 var.) + `_Button Background`; 7 set vecchi eliminati; istanze migrate in DS e XcMM. Escluso solo "Styling Buttons" (CSS). |
| Icons | icon | ✅ | Master ricostruiti (G1): 86 icone da SVG Bootstrap 1.11.3 + 5 alias (`text-bold/italic/underline` ← `type-*`, `align-left/right` ← `text-left/right`); `caret` invariata. Ogni variante = 1 solo `Vector`. Pagina doc fatta: frame `1103:27` (Playground, Examples: Variants/Sizing/Labels/Quick info status icons, Library a griglia con i 92 set). Esclusi: Colors (CSS), Custom Icons e registrazione librerie (JS). Sizing = istanze scalate 2× (le icone non hanno prop size, coerente col codice). |
| Icon Button | icon-button | ✅ | Frame `1092:33`. Escluso: Colors (CSS `::part`). Master: prop `Icon` collegata su tutte le varianti; nuova variante `Size` (medium/large/x-large, solo Variant=default, = font-size 1/1.5/2rem come nel codice) → 36 varianti; tinte icona pale/filled riapplicate. CC `icon-button.figma.ts` aggiornato (Size → `style="font-size"`). |
| Button Group | button-group | ✅ | Frame `1106:288`. Tutti gli 8 esempi del doc. **Fix master**: angoli interni squadrati (solo estremi arrotondati, come in codice). Esempi Dropdown/Split: testo voci spostato dal layer `Text` al layer `Menu item` (uso errato, vedi G3). Toolbar ricostruita con Button icon-only. |
| Dropdown | dropdown | ✅ | Frame `1110:110`. Esempi: Dropdown, Placement (top-start), Distance (30), Skidding (30), Submenus — composti con Menu (slot Items) + Button. Esclusi: Getting the Selected Item (JS), Hoisting (positioning). |
| Copy Button | copy-button | ✅ | Frame `1115:8`. **Fix master**: icone success/error colorate (`fill/success`, `fill/danger`, come `--success-color`/`--error-color`); nuove prop `Copy Icon`/`Success Icon`/`Error Icon` (= slot). CC aggiornato (slot icone se diversi dal default). Escluso: Custom Styles (CSS). |
| Input | input | ✅ | Frame `1117:96`. 12 esempi del doc. Escluso: Customizing Label Position (CSS parts). **Fix master**: overlay filled/pill a larghezza fissa (240) → STRETCH; Pill con doppio bordo → sfondo spostato in layer `background` (maschera pill legata a `Pill` + base + pill-overlay con stroke della variante + filled-overlay). Proprietà invariate (CC/istanze compatibili). Rimossi 4 frame esempio sparsi a livello pagina. |
| Textarea | textarea | ✅ | Frame `1121:7`. 10 esempi (Rows/Resize/Expand come note: in Figma si ridimensiona l'altezza). **Fix master**: filled-overlay STRETCH; componente ad altezza fissa con `field` FILL → le istanze si ridimensionano in verticale (prima impossibile: Figma non ridimensiona layer annidati). |
| Select | select, option | 🟡 | Frame `1124:81`. 15 esempi select + 2 option. Esclusi: Custom Tags, Lazy loading (JS). **Fix master**: stesso fix pill/filled dell'Input (layer `background` + maschera); listbox `dropdown` STRETCH; option nel listbox FILL; nuove prop `Show Prefix/Prefix/Show Suffix/Suffix` (slot) + CC aggiornato. Gap aperti: listbox senza label di sezione/divider (Grouping Options); apertura solo in basso (Placement); icone `telephone`/`patch-check` assenti nel DS. |
| Checkbox | checkbox | ✅ | Frame `1127:27`. 6 esempi. Escluso: Custom Validity (JS). Set riordinato (righe State × colonne Size): le varianti indeterminate erano fuori griglia. Rimosso frame sparso 'Checkbox (Help Text)'. |
| Radio | radio | ✅ | Frame `1131:7`. 3 esempi (in Radio Group). Set riordinato (State × Size). |
| Radio Button | radio-button | 🟡 | Frame `1132:8`. 7 esempi (in Radio Group type=button). **Fix master Radio Group**: angoli interni squadrati (type=button). Gap: nessuna modalità icon-only (Buttons with Icons: label svuotata). |
| Radio Group | radio-group | ✅ | Frame `1133:18`. 6 esempi. Escluso: Custom Validity (JS). **Fix master**: help text troncato (FIXED → HUG, componente non clippa). |
| Switch | switch | ✅ | Frame `1136:12`. 5 esempi. Escluso: Custom Styles (CSS). **Fix master**: nuova prop `Help Text` (struttura row + help-text come Checkbox; 0 istanze in XcMM, nessun override perso); CC aggiornato (help-text). |
| Range | range | ✅ | Frame `1139:10`. 7 esempi. Esclusi: Custom Track Colors/Offset (CSS), Tooltip Formatter (JS). **Fix master** (0 istanze in XcMM): auto layout con `label`/`help-text` (prop Show Label/Show Help Text), indicatore come frame SCALE con thumb/focus-ring/tooltip ancorati a destra (valore proporzionale al resize), prop `Tooltip Top`/`Tooltip Bottom`. CC aggiornato. |
| File Drop | file-drop | ✅ | Frame `1150:28`. 6 esempi (Localization con testo istruzioni tradotto). |
| File Upload Item | file-upload-item | ✅ | Frame `1149:37`. 5 esempi (Localization: Retry→Riprova). |
| Alert | alert | 🟡 | Frame `1147:20`. 7 esempi. Esclusi: toast API (JS). **Fix master**: nuova prop `Show Icon`; icone colorate per variante (come `--alert-icon`); CC aggiornato (slot icon). Gap: countdown bar non modellata; nessuna prop Icon swap (default unico per set cambierebbe le icone per-variante). |
| Badge | badge | ✅ | Frame `1141:46`. 6 esempi. G5 risolto (prop Pill). |
| Tag | tag | 🟡 | Frame `1142:11`. 4 esempi. **Fix master**: rimosse 2 icone x-lg orfane (sempre visibili) nella variante primary/small. G5 risolto (prop Pill × 3 taglie; esempio Pill con Small/Medium/Large). |
| Status | status | ✅ | Frame `1143:14`. 5 esempi (lifecycle come lista protocollo + status). |
| Progress Bar | progress-bar | 🟡 | Frame `1152:8`. 5 esempi. **Fix master**: nuova prop `Show Value` (default true = aspetto invariato; slot di default). CC aggiornato. Gap: Custom Height (CSS). |
| Spinner | spinner | ✅ | Frame `1152:142`. 2 esempi. Esclusi: Track Width, Color (CSS). |
| Skeleton | skeleton | ✅ | Frame `1153:7`. 5 esempi (forme via resize + corner radius). Escluso: Custom Colors (CSS). |
| Rating | rating | 🟡 | Frame `1153:119`. 7 esempi. **Fix master**: aggiunte varianti Value 0/2/4 (scala completa 0–5); CC aggiornato. Gap: max ≠ 5, precision frazionaria, symbol size (CSS). Esclusi: hover/custom icons (JS). |
| Tabs | tab-group, tab, tab-panel | ✅ | Frame `1155:118`. 9 esempi (placement, closable, scroll controls, icons, card+counter). Escluso: Manual Activation (tastiera). |
| Breadcrumb | breadcrumb, breadcrumb-item | ✅ | Frame `1156:122`. 6 esempi (frame esistenti spostati). Trigger dropdown messo in stato default. |
| Tree | tree, tree-item | 🟡 | Frame `1158:51`. 9 esempi (tree + tree-item). Gap: selezione multipla (checkbox), indent guides (CSS), lazy loading (spinner) non modellati; custom expand icons = swap annidato (tutte '+'). |
| Menu | menu, menu-item, menu-label | ✅ | Frame `1160:104`. 9 esempi (menu + menu-item + menu-label), composti nello slot Items. **Fix master**: G3 (prop Label su Menu Item). |
| Stepper | stepper, step | 🟡 | Frame `1163:75`. 6 esempi (step annidati via override). Gap: orientamento verticale non modellato. |
| Card | card | ✅ | Frame `1164:29`. 6 esempi (variants con Card Accent annidato). |
| Dialog | dialog | ✅ | Frame `1165:44`. 4 esempi (Custom Width via resize, Header Actions). Esclusi: Preventing close, Initial focus (JS). |
| Drawer | drawer | 🟡 | Frame `1166:12`. 8 esempi. Esclusi: Preventing close, Initial focus (JS). Gap: placement non è prop (top/bottom = resize); nessuno slot header-actions nel master. |
| Details | details | ✅ | Frame `1169:15`. 4 esempi (icona custom = swap annidato +/−). |
| Divider | divider | ✅ | Frame `1167:140`. 3 esempi (Menu Dividers = frame `238:820` spostato). Esclusi: Width/Color/Spacing (CSS). |
| Split Panel | split-panel | 🟡 | Frame `1175:982`. 5 esempi. Esclusi: Custom Snap Function (JS), Customizing the Divider (CSS). Gap: master senza proprietà — nessuna variante vertical/disabled, position non modellata. |
| Detail Panel | detail-panel | 🟡 | Frame `1176:44`. 4 esempi. Escluso: close request (JS). Gap: nessuna variante `contained`; tabs/actions da comporre negli slot. |
| Header | header, header-item | ✅ | Frame `1176:336`. 6 esempi (header + header-item; Dropdown = frame `749:1922` spostato; stage scuri per gli item). Escluso: Customizing (CSS). Logo image = swap. |
| Sidebar | sidebar, sidebar-group, sidebar-item | ✅ | Frame `1176:801`. 4 esempi (sidebar, collapsed, items with icons, group). 3 set spostati nelle Variants. |
| Stat | stat, stat-group | 🟡 | Frame `1176:1650`. 5 esempi (stat + stat-group). Gap: nessuna prop Show Icon (Without an icon). |
| Table | table | 🟡 | Frame `1176:2910` (larghezza 2400). 11 esempi, tutti sul modello Column/Cell (come XcMM). Esclusi: Context menus (JS), Filling the container (layout). **Rimossi** (0 istanze in XcMM, non annidati): `Table Row`, `Table Header Row`, `Table (Status Icons and Alignment)` + CC `figma/table-row.figma.ts`, `figma/table-header-row.figma.ts`. **Fix master**: Table Column data/off/end, 2ª cella HUG → FIXED 41. Quick info cell rifatto come in XcMM (cella composite + Status small senza label + Icon check-square/chat con varianti neutral/accent/success). **Fix master (approvato 2026-10-21)**: nuova variante Table Cell `Type=quick-info` × start/center/end × compact/tall (slot Content con Status senza label + Icon check-square/chat neutral); Status: nuova prop `Show Label`. Gap: menu azioni aperto non modellato. Istanza Checkbox `166:118` sparsa a livello pagina (da rimuovere?). |
| Description List | description-list | 🟡 | Frame `1175:834`. 3 esempi. Gap: Rich values senza contenuto ricco (slot Value Suffix vuoto). |
| Comment | comment | ✅ | Frame `1175:657`. 4 esempi (thread composto). Without a date = testo Date vuoto. |
| Empty State | empty-state | 🟡 | Frame `1175:314`. 3 esempi. Gap: nessuna prop Show Icon. |
| Selectable Item | selectable-item | ✅ | Frame `1175:521`. 2 esempi. |
| Avatar | avatar | 🟡 | Frame `1174:14`. 6 esempi. Gap: nessuna variante image (Images). |
| Tooltip | tooltip | 🟡 | Frame `1175:5`. 7 esempi (tooltip + Button come trigger). Escluso: Hoisting. **Fix master fatto prima** (auto layout, freccia centrata). Gap: nessuna variante senza freccia; max-width non modellato. |

Doc senza pagina Figma (utility, non visuali — nessuna pagina prevista): animated-image, animation, format-bytes, format-date, format-number, image-comparer, include, mutation-observer, popup, relative-time, resize-observer, visually-hidden.

## Gap aperti da proporre all'utente (master DS)

- ⚠ Pattern da ricontrollare su Select / Textarea / altri campi: overlay `filled`/`pill` a larghezza fissa e doppio bordo in Pill (stesso bug di Input e Button).

- ~~G1 — colore icone perso dopo swap~~ → **approvato e fatto 2026-10-21** (vedi Icons). Effetto collaterale gestito: le tinte impostate nei master sui vecchi vettori si sono perse → riapplicate in Button, Icon Button, Header, Header Item, Avatar, Sidebar, Sidebar Group (scan euristico contrasto/testo). ⚠ Da ricontrollare visivamente pagina per pagina durante il rifacimento (icone colorate via override su sfondo chiaro non sono rilevabili dallo scan) e in Saipem-XcMM dopo il publish (override locali sulle icone).
- ~~G3 — Menu Item senza proprietà testo `Label`~~ → **fatto 2026-10-21**: prop TEXT `Label` sul layer `Menu item` (override esistenti preservati), CC `menu-item.figma.ts` usa `getString('Label')`. Originale: (il testo si modifica a mano sul layer `Menu item`; esiste anche un layer `Text` per il check che viene usato per errore come etichetta). Proposta: aggiungere prop TEXT `Label` + collegare il check a una BOOLEAN. Da proporre quando si arriva alla pagina Menu.
- **G4 — Code Connect icone con nomi inesistenti in Bootstrap**: `text-bold/italic/underline`, `align-left/center/right` → **corretto 2026-10-21** nei file `figma/icon-*.figma.ts` (`type-bold/italic/underline`, `text-left/center/right`); glifo `align-center` ridisegnato come `text-center`.
- ~~G5~~ → **approvato e fatto 2026-10-21**: Badge = Variant × Pill (le 6 varianti di Badge Pill *spostate* nel set → id/key invariati, istanze DS e XcMM restano collegate; Pulse ricollegato alla prop di Badge, 5 esempi pulse riattivati); Tag = Variant × Size × Pill (18 varianti pill create dai Tag, con remove; 5 esempi swappati; set Tag Pill eliminato, 0 istanze XcMM). CC: pill in `badge`/`tag`, rimossi `badge-pill`/`tag-pill`. Originale: **G5 — Pill come set separato** in Badge (`Badge Pill`, 76 istanze in XcMM + Badge 56) e Tag (`Tag Pill`, senza Size → esempio Pill a 3 taglie non rappresentabile). Proposta: unificare come fatto per Button (prop Pill nel set principale) + migrazione istanze XcMM. **Da proporre.**
- ~~G2 — Icon Button senza Size~~ → **approvato e fatto 2026-10-21** (vedi Icon Button).

## Modifiche master applicate da pubblicare

- Icon Button: binding prop `Icon` su tutte le varianti; variante `Size`; tinte icona (2026-10-21).
- Icons: 91 icone ricostruite a vettore singolo (2026-10-21).
- Button: tinte prefix/suffix/caret/icon riapplicate; Header/Header Item/Avatar/Sidebar/Sidebar Group: tinte icona riapplicate (2026-10-21).
- Code Connect modificato: `figma/icon-button.figma.ts` (Size); `figma/icon-{text-bold,text-italic,text-underline,align-left,align-center,align-right}.figma.ts` (nomi Bootstrap reali).
- Button Group: raggi angoli interni (2026-10-21).
- Progress Bar: prop Show Value; CC `figma/progress-bar.figma.ts` (2026-10-21).
- Rating: varianti 0/2/4; CC `figma/rating.figma.ts` (2026-10-21).
- Alert: prop Show Icon + tinte icona per variante; CC `figma/alert.figma.ts` (2026-10-21).
- Menu Item: prop TEXT Label; CC `figma/menu-item.figma.ts` (2026-10-21).
- Tag: rimosse icone orfane in primary/small (2026-10-21).
- Range: ristrutturato (label/help/tooltip, valore proporzionale); CC `figma/range.figma.ts` (2026-10-21).
- Tooltip: auto layout, freccia centrata, hug (2026-10-21).
- Switch: prop Help Text; CC `figma/switch.figma.ts` (2026-10-21).
- Radio Group: raggi angoli interni (type=button); help text HUG + no clip (2026-10-21).
- Select: background+maschera pill, dropdown STRETCH, option FILL, prop prefix/suffix; CC `figma/select.figma.ts` (2026-10-21).
- Input: overlay STRETCH + struttura `background` con maschera pill (2026-10-21).
- Table Cell: variante Type=quick-info (6); Status: prop Show Label; CC `figma/table-cell.figma.ts` (quick-info) e `figma/status.figma.ts` (dot con `title`); fix tipo in `figma/alert.figma.ts` (2026-10-21).
- ✅ 2026-10-21 (dopo publish): XcMM, 132 celle Quick info migrate da composite a Type=quick-info (Status Show Label=false; icone sulla variante DS accent/success/danger/neutral + fill originale conservato; Selected/overlay preservati). Primo tentativo senza fill → restore versione fatto dall'utente.
- CC rimossi (2026-10-21): `figma/{carousel,color-picker,progress-ring,qr-code}.figma.ts` — componenti eliminati dall'utente dal DS (validazione publish fallita: node not found).
- Badge/Tag: prop Pill (G5); set Badge Pill e Tag Pill rimossi; CC aggiornati (2026-10-21).
- ✅ 2026-10-21: XcMM aggiornato — 76 Badge Pill ora `Badge Pill=true` (collegate, override intatti), nessun Pulse da riattivare. ✅ unpublish CC `34-88` e `33-51` fatto dall'utente.
- XcMM: Radio Group "Complete and" allineato all'HTML (opzione Backward + help text) (2026-10-21).
- Table: eliminati Table Row / Table Header Row / Table (Status Icons and Alignment); fix altezza cella Table Column data/off/end; CC table-row e table-header-row rimossi (2026-10-21).
- Table: eliminati Table Row / Table Header Row / Table (Status Icons and Alignment); fix altezza cella Table Column data/off/end; CC table-row e table-header-row rimossi (2026-10-21).
- Copy Button: tinte success/error + 3 prop icona; CC `figma/copy-button.figma.ts` (2026-10-21).
- ➜ Dopo il publish: scan icone in Saipem-XcMM (override colore persi).
- ✅ 2026-10-21: Textarea in XcMM (2 istanze, label+help) verificate: field 80 px, nessuna correzione necessaria.
- Textarea: overlay STRETCH, altezza fissa + field FILL (2026-10-21).

## Log

- 2026-10-21 — Completate tutte le pagine componente (ultime 16: Dialog → Tooltip). Restano: proposta G5, publish libreria + `npx figma connect publish`, verifiche post-publish in XcMM.

- 2026-10-21 — Icon Button fatto (gap G1, G2). Button e Icon Button tradotti in inglese, box PROVA rimossi.
- 2026-10-21 — Button completato (vedi riga). Code Connect: `figma/button.figma.ts` → set `1081:6712`; file `button-*.figma.ts` legacy eliminati.
- Table Cell (2026-10-29, approvato): slot `Content#875:106` con preferred values Status, Badge, Tag + 113 Icon/* (116),
  descrizione, `allowPreferredValuesOnly=false`; key `ecee9a4f…` e id `867:2425` invariati. CC: solo commento in
  `figma/table-cell.figma.ts`. In attesa di publish libreria (per QMIS-BidModule).
- Sidebar Item (2026-10-29, approvato): nuova VARIANT `Collapsed` (false/true); 6 varianti rinominate `Collapsed=false`
  (id invariati), 3 nuove `Prefix=true, Collapsed=true` 44×36 solo icona (`1440:506` default, `1440:513` hover,
  `1440:520` current con indicatore); key `ffadd7dc…` invariata. CC invariato (collapsed lo imposta sl-sidebar).
