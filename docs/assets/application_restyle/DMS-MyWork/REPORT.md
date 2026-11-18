# DMS-MyWork — report

Pagina nuova da una bozza ("Saved documents" del DMS legacy), senza flusso di screenshot di origine. Chiamata **My favorites**.

**2026-11-09:** My favorites rimossa ovunque (pagina, voce di sidebar, "Add to favorites" nel menu ⋮, colonne stella e Saved on), perché l'analisi funzionale §4.3 non la prevede. Il wrapper Figma `1366:89503` è stato riusato dall'utente come **1-Clipboard**: l'HTML corrispondente è da creare.

## Pagine

| Pagina                       | Stato riprodotto                                                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `4-Dashboard.html`           | Dashboard Project Management: 4 KPI, Waiting for your action (6), Checked out documents (3), Your documents by group                                                                                                |
| `5-Dashboard-Customise.html` | Modalità personalizzazione: Your open drafts tolto (posizione libera), Tasks delegated by you nuovo e non attivo                                                                                                    |
| `6-Preferences.html`         | Progetto e area preferiti impostati, pagina iniziale non impostata                                                                                                                                                  |
| `3-Clipboard.html`           | Clipboard con 5 documenti, il primo spuntato e aperto nel pannello (Properties, Info aperto); dal Figma 1-Clipboard + analisi §4.3.2                                                                                |
| `2-SelectedDocs.html`        | Selected docs con 4 documenti (quattro dei preferiti, nessun dato nuovo), i primi due spuntati; toolbar con Modify selected doc · IVA promote / demote · Add WBS & plan shop dwgs · Transmit docs e Config in fondo |

## Dati e azioni della bozza

Tutti presenti (più, in fondo alle righe dei preferiti, l'occhio View document; in Selected docs solo il menu ⋮, scelta dell'utente): stella (ora toglie dai preferiti), Document + descrizione, Document type + categoria, Rev., Status, Project, Saved on,
conteggio (riepilogo della paginazione). In più, richiesti dall'utente: sidebar, header, Config in toolbar.

## Nuovi elementi non DS

Nessuno. Modifica al layer condiviso: `STATUS_VARIANT` con `Issued To Subco` (primary) e `Archived` (neutral) in `_shared/restyle.js`.

## Componenti senza Code Connect

Da verificare con `cc_inventario.py`: `icon-button` e icone `star` / `star-fill` hanno il template. `sl-breadcrumb` come nelle altre pagine.

## Stati da disegnare

Tabella vuota (empty state già nel markup) · hover/focus della stella · conferma o toast "Removed from favorites" (con Undo).

## Domande aperte

- Selected docs: i 4 pulsanti agiscono sulle righe spuntate e nessuno è `primary` (la toolbar della bozza non ne ha uno): va indicato il passo principale? Sono disabilitati senza selezione?
- Selected docs: colonne e dati sono quelli dei preferiti (senza stella e Saved on); servono altri campi (Version, DIN)?

- La stella toglie subito la riga o la lascia finché non si ricarica la pagina (per poter annullare)?
- Servono ricerca e filtri (per progetto, tipo, stato)? La bozza non li ha; con molti preferiti diventano necessari.
- Il click su un documento deve aprire il dettaglio? E serve il menu ⋮ con le azioni del documento (Download, View location…)?
- Le voci Dashboard, Tasks, Clipboard del gruppo My work della bozza vanno aggiunte alla sidebar?
- Conferma visiva con screenshot Playwright non ancora fatta (da autorizzare).

## Figma

`1-MyFavorites` portata il 2026-11-02: SECTION `DMS-MyWork` `1366:89502`, wrapper `1366:89503`, solo NEW `1366:89506` (nessun OLD: la bozza non è nel repository). Confronto con lo screenshot HTML fatto. Differenze: altezza righe (41 contro 61, valori di Table Cell) e stella appena tagliata. `2-SelectedDocs` non ha una pagina propria in Figma: la sua shell è quella di S2–S16 (sezione DACS-Toolbar · Screens).
