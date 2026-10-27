# Audit `getSlot` nei template Code Connect — 2026-10-26

Sola lettura. Fonte: `get_code_connect_map` sul file DS (`CdCRuuAnOeYrOOn1HYkxDM`), stato pubblicato. Nessun file Figma modificato.
Contesto: nella Table `getSlot('Toolbar')` e `getSlot('Actions')` emettevano un segnaposto compresso (`<Toolbar />`, `Actions [+]`) al posto degli snippet delle istanze mappate; risolto inlinando con `executeTemplate()`.

## A. Slot con istanze mappate → segnaposto compresso (stesso schema della Table)

| Template | Slot | Segnaposto pubblicato | Contenuto nascosto |
|---|---|---|---|
| `menu.figma.ts` | Items | `<Items />` | Menu Item, Divider |
| `header.figma.ts` | Nav, Actions | `<Nav />`, `<Actions />` | Header Item, Select, Account |
| `sidebar.figma.ts` | Groups | `<Groups_n />` + `<Items_n />` annidati | Sidebar Group, Sidebar Item |
| `sidebar-group.figma.ts` | Items | `<Items_n />` | Sidebar Item |
| `tree.figma.ts` | Items | `<Items />`, `<Children_n />` | Tree Item |
| `tree-item.figma.ts` | Children | `<Children />` (solo se `expanded`) | Tree Item |
| `dialog.figma.ts` | Footer Content | `<FooterContent_n />` | Button Cancel/Confirm |
| `comment.figma.ts` | Attachment | `<Attachment />` | Icon |

## B. Bug: `{/* Missing snippet for undefined */}` nello snippet

`sidebar-group.figma.ts` chiama `getSlot('Items')` anche quando `Collapsed=true`: lo slot non esiste e Code Connect stampa il letterale.
Visibile in: sidebar-group `1053:54`, `1053:123`, `1054:194`, `1054:252`, `1054:307` e nel Groups_2 di sidebar `1054:191`.
Fix proposto: `const items = collapsed ? '' : instance.getSlot('Items');`

## C. Slot a contenuto libero (segnaposto inevitabile, corretto)

`card` Body / Footer Content (solo testo), `details` Body, `drawer` Body, `dialog` Body, `detail-panel` Body, `comment` Body.
Il segnaposto mostra il codice di design del contenuto; non c'è mapping da inlinare.

## D. Slot vuoti → segnaposto vuoto (rumore)

`card` Header Actions (`<HeaderActions />`), `description-list-item` Value Suffix, `detail-panel` Actions, `comment` Body, `tree-item` Children (variante expanded senza figli).
Emessi come `<X />` anche se lo slot è vuoto. Nessun errore, ma lo snippet è meno pulito.

## E. Altro

- `select.figma.ts`, `split-panel`, `tab-group`, `tooltip`, `table-cell`, `table-column`, `table-pagination`: contengono un commento `<!-- ... -->` al posto dei figli (es. `<!-- sl-option elements -->`).
- `table-toolbar`: 8 slot fissi → 2 righe vuote nello snippet con 6 azioni.
- Non verificati: tipo reale delle property (`getBoolean` su VARIANT) e node-id obsoleti — richiedono controllo contro Figma (vedi `instruction.md`).

## Stato

## Fix applicati (2026-10-26, in attesa di `figma connect publish`)

Le istanze connesse direttamente nello slot (`getSlot(...).connectedInstances`, shallow) sono rese col proprio template; il segnaposto resta come fallback.
`menu`, `tree`, `tree-item`, `sidebar`, `sidebar-group` (+ bug B: nessun `getSlot('Items')` se collapsed), `header` (Nav e Actions), `dialog` (Footer Content), `comment` (attachment cercato per nome layer: Icon/*, Icon Button, Dropdown, perché è dentro un frame).
Limiti: numero fisso di elementi per slot (menu 12, tree/tree-item/sidebar-group 8, sidebar 6, header 6+4, dialog 3). Non verificato in Dev Mode.

## Controllo sistematico template ↔ Figma ↔ Lit (2026-10-26)

Metodo: 156 template, 156 node-id letti da `// url=` e verificati in Figma (tutti esistenti, nessun id obsoleto); 321 chiamate `instance.getX('Nome')` confrontate con `componentPropertyDefinitions` (tipo + opzioni enum); tag, attributi e slot emessi confrontati con `@property`/`@slot` dei `.component.ts`.
Limite: le chiamate fatte tramite helper (es. `iconSlot('Show Prefix', 'Prefix', …)`) e sulle istanze annidate non sono state controllate.

Trovati e corretti (template, in attesa di publish):
- `card`: `getInstanceSwap('Image')` ma `Image` è BOOLEAN che mostra un rettangolo placeholder → l'immagine non usciva mai. Ora `<img slot="image" src="…" alt="">` quando `Image` è attivo.
- `dialog`: `getInstanceSwap('Header Actions')` ma è BOOLEAN → `header-actions` non usciva mai. Ora `getBoolean` + `findInstance('header-actions')`.
- `stat`: la variante `State=disabled` esiste in Figma e `sl-stat` ha `disabled`, ma il template non lo mappava.

Non-problemi: `tab` senza `State=focus` (pseudo-stato CSS), `tooltip` con `left`/`right` in più rispetto a Figma (il codice li supporta; Figma ha solo top/bottom), `slot="nav"` di `tab` (appartiene a `tab-group`), `page-sizes` di `table-pagination` (attributo reale).
Attributi e slot: nessuna discrepanza reale con i componenti Lit.
