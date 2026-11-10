# Legend + Menu con ricerca — Figma DS (2026-11-09)

File DS `CdCRuuAnOeYrOOn1HYkxDM`. Flusso 8 (nuovo componente) + aggiornamento in-place di Menu Item.

## Fatto

| Cosa | Dove | Note |
| --- | --- | --- |
| Menu Item: `Suffix Text` (TEXT) + `Show Suffix Text` (BOOLEAN, off) | set `62:41`, pagina Menu | layer `suffix-text` in ogni variante, stile Caption, fill `neutral/600`; key invariata |
| Template `figma/menu-item.figma.ts` | repo | emette `<span slot="suffix">…</span>` |
| Esempio "With a Search Field" | doc Menu `1160:104`, card `1649:1024` | Menu + Input small con icona search in un frame di padding `Spacing/x-small`, Divider, Menu Label, 3 Menu Item con codice |
| Pagina **Legend** | `1646:2`, dopo Description List | |
| **Legend Item** | set `1646:37`, 7 varianti (Variant none…danger) | Term/Show Term, Description, Show Marker, Marker (SLOT); swatch 12×12 `Radius/small`, colori `<palette>/600` (neutral 500); gap `Spacing/2x-small` |
| **Legend** | set `1647:60`, 3 varianti (Layout inline/list × Columns 1/2) | Label/Show Label, Icon (swap, `Icon/info-circle`, `neutral/500`)/Show Icon, Items (SLOT) |
| Doc "Legend — Documentation" | `1648:77` | clonata da Description List (master clonati rimossi); Playground, 5 esempi (Terms, Symbols, List, Statuses, Colours), Variants con i master spostati nelle Matrix |
| Template `figma/legend.figma.ts`, `figma/legend-item.figma.ts` | repo | `tsc` + `figma connect parse` ok; inventario P0/P1/P2 = 0 |

## Limiti noti

- Columns=2 in Figma = wrap a 480 px con voci larghe 226: nel codice è una griglia; le voci vanno messe a larghezza fissa.
- Icona e titolo della Legend: con entrambi spenti nessuno spazio residuo; con il titolo senza icona, il titolo è un fratello delle voci (gap della variante).
- ~~Menu Item non `checked` non riserva la colonna della spunta~~: corretto, vedi sotto.
- Test dei componenti non eseguiti (Chromium).

## Da fare (utente)

1. Publish della libreria dall'interfaccia Figma (Menu Item aggiornato + Legend nuova).
2. `FIGMA_ACCESS_TOKEN=… npx figma connect publish` (menu-item, legend, legend-item).

## Aggiornamento (dopo il primo publish)

- Publish libreria e Code Connect verificati: `get_code_connect_map` su `1647:60`, `1646:37`, `62:41` ok; `search_design_system` dal file B trova Legend e Legend Item.
- **Menu Item `62:41`, colonna della spunta:** nel codice `.menu-item__check` è sempre larga 1.5em (21 px) e nascosta con `visibility: hidden` quando la voce non è spuntata; nel master era larga 0 tranne in `checked`. Corretto in-place: layer `check` (ex `Text`) a 21 px fissi, centrato, in tutte le 5 varianti. Key invariata. Tutti i menu del file di progetto si allineano al codice (testo 21 px più a destra). Serve un nuovo publish della libreria.

## Correzioni DS emerse dal confronto HTML → Figma (in attesa di publish)

| Master | Correzione | Perché |
| --- | --- | --- |
| Menu Item `62:41` | colonna `check` 13 px (+ gap 8 = 21 = 1.5em) | il codice non ha gap tra spunta e prefisso: con 21 + 8 il testo partiva 8 px più a destra dell'HTML |
| Menu Item `62:41` | frame `chevron` 13 px fisso con dentro `submenu-indicator` | nel codice `.menu-item__chevron` è sempre 1.5em (nascosto senza sottomenu): i suffissi finivano 19 px troppo a destra |
| Avatar `59:8` | varianti `Variant=accent/success/warning/danger` per Shape=rounded, Type=initials, Size=large (fill `<pal>/100`, testo `<pal>/700`) + template `figma/avatar.figma.ts` | il codice ha 6 varianti, Figma 3; servono ai badge di Project Discovery |
| Alert `35:32` | testo con text style Body/Small (14/150%) | interlinea AUTO = 17 px contro 21 dell'HTML: l'avviso era 11 px più basso |

File B: 1-Home aggiornato in-place, 2/3/4 creati (`1614:107841`, `1614:107911`, `1614:107981`), 5-ProjectDiscovery clonato dalla Clipboard (`1619:108434`, da adattare dopo il publish).

## Secondo giro di correzioni DS (in attesa di publish)

| Master | Correzione | Perché |
| --- | --- | --- |
| Menu Label `63:2` | interlinea 150% (18 px) | AUTO = 15 px: etichetta 23 contro 26 dell'HTML |
| Avatar `59:8` | iniziali = metà della dimensione (24/18/12) in tutte le 31 varianti initials | il codice usa `calc(--size * 0.5)`, Figma 0.375 |

Nota: dopo l'update della libreria le istanze in B possono tenere il layout vecchio (es. `chevron` a metà voce): forzare il ricalcolo con un `setProperties` avanti e indietro e la ricetta resize/FILL per Input e Divider.

## Terzo giro di correzioni DS (2026-11-10, in attesa di publish)

| Master | Correzione | Perché |
| --- | --- | --- |
| Icone nuove `Icon/sliders` (`1665:44`) e `Icon/box-arrow-in-left` (`1665:67`) + template `figma/icon-*.figma.ts` | 6 varianti di colore come le altre, vettore dallo SVG di bootstrap-icons | usate da Customise dashboard e Check in; il lint HTML non controlla i nomi delle icone |
| Stat (pagina `31:18`) | vettore dell'icona legato a `<palette>/600` (accent `/700`) in tutte le 18 varianti; il colore resta dopo lo swap dell'icona | nel codice `.stat__icon { color: var(--stat-color) }`; in Figma l'icona era scura |
| Progress Bar `60:58` | indicatore con constraint `SCALE` (21 varianti) | con l'istanza allargata la percentuale non era rispettata (65% reso ~48%) |

HTML: Clipboard, icone Promote/Demote `arrow-up-circle`/`arrow-down-circle` → `arrow-up`/`arrow-down` (non esistono nel DS).
File B: Clipboard aggiornata (header, sidebar, Edit con icona, tabella a tutta altezza, Title/Meta del Detail Panel riallineati al master); Dashboard `1635:108867` costruita.

## Quarto giro di correzioni DS (2026-11-10, in attesa di publish)

| Master | Correzione | Perché |
| --- | --- | --- |
| Empty State `388:3` | Title e Description FILL con a capo (`HEIGHT`), `maxWidth` 512; componente a larghezza fissa di default (362) | nel codice `width: 100%` e descrizione `max-width: 32rem` che va a capo; in Figma il testo era hug e veniva tagliato (Customise, "Free position") |
| Card `53:87` (varianti Header=true) | frame `Heading` (VERTICAL, gap `x-small`) con il titolo + testo `Header Meta` (Caption, `neutral/600`); proprietà `Header Meta` (TEXT) e `Show Header Meta` (BOOLEAN, off) + template `figma/card.figma.ts` | nel codice l'header è uno slot: Preferences ha titolo + riga secondaria |
| Legend `1647:38` (Columns=2) | slot Items FILL, larghezza della variante fissa (480) e decisa dall'istanza | con la larghezza fissa dello slot le voci di QMIS 2-Legend andavano 4 per riga: ora l'istanza si dimensiona su colonna 1 + gap + colonna 2 |

File B: Customise `1651:109429` costruita; QMIS 2-Legend con 3 Legend list (larghezza da sistemare dopo il publish).
