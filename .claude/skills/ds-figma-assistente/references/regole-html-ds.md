# Regole per pagine HTML "pronte per Figma"

Ogni scelta in HTML/CSS deve avere un equivalente diretto in Figma (istanza, proprietà, auto-layout, variabile,
text style). Le regole specifiche del progetto (mappature, pattern di pagina, scala delle spaziature) stanno nei
`riferimenti_progetto` e hanno la precedenza su queste.

## Regole

1. **Tutto ciò che è interattivo o ha una superficie visiva è un componente DS.** Niente `<button>`, `<input>`,
   `<select>`, `<table>`, `<dialog>`, `<hr>` nativi.
2. **I wrapper di layout sono trasparenti**: `div`/`section` con solo `display`, `gap`, `padding`, `grid-*`, che
   diventano frame auto-layout. Niente `background`, `border`, `box-shadow`, `border-radius` sui wrapper: per una
   superficie si usa il componente card o pannello del DS.
3. **Spaziature solo da token**, tramite classi o variabili di layout condivise.
4. **Testo solo con classi tipografiche condivise**, che corrispondono ai text style di Figma. Niente
   `font-size` o `color` ad hoc.
5. **Varianti tramite attributi, non tramite CSS.** Un `::part(...)` che cambia colore, bordo o font significa che
   manca una variante: va segnalato come nuovo elemento.
6. **Custom property documentate** del componente (larghezza del dialog, dimensione del drawer) sono ammesse, con
   valori da token. Se non sono il default, annotale: in Figma potrebbe servire un ridimensionamento.
7. **Uno stato per pagina**, con attributi statici. Niente stati che compaiono solo dopo un'interazione.
8. **Icone solo tra quelle presenti in Figma.** Se nessuna va bene, usa la più vicina e segnala quella ideale.
   Verificalo **prima di consegnare ogni pagina**, non a memoria: ogni `name` di `sl-icon` (anche quelli nei file JS
   del flusso) deve avere un template Code Connect dell'icona, es.
   `for n in <icone usate>; do [ -f <code_connect.dir>/icon-$n.figma.ts ] || echo "MANCA $n"; done`. Un'icona
   mancante scoperta solo nel flusso 3 blocca la pagina in `partial` e costa un publish in più (2026-10-30:
   `arrow-left` e `funnel` in QMIS 25, 27, 28).
8b. **`sl-table size="small"` solo per una tabella annidata nella cella di un'altra tabella** (DECISIONS "Sotto-tabella
   in una cella"). Le tabelle di pagina, di dialog e di tab, cronologie comprese, usano la size normale anche quando
   sono strette o con molte colonne (errore segnalato dall'utente il 2026-10-30, QMIS 22).
8c. **Config in ogni tabella con più colonne**: toolbar con `.rs-spacer` + `sl-dropdown data-table-options` (Config)
   in fondo a destra, anche se la tabella non ha altre azioni e anche nei dialog e nei tab. Verificalo prima di
   consegnare: ogni `sl-table` senza `data-table-options` è un errore (DECISIONS "Ordine dei pulsanti nella toolbar";
   2026-10-30, 11 tabelle QMIS senza Config).
   **Eccezione:** le tabelle dentro un `sl-detail-panel` (es. tab Revisions del dettaglio) non hanno toolbar né Config
   (segnalato dall'utente il 2026-10-30, DACS-Toolbar).
8d. **Celle documento uniformi agli altri flussi** (DECISIONS "Cella documento con file", scelta dell'utente
   2026-10-30): nelle **liste principali** la struttura è quella di `documentColumns` (Quick info con l'icona del file
   nativo + `documentCell`); nelle **tabelle dei pannelli di dettaglio** (tab Revisions) e nel flusso DACS-Toolbar la
   cella è `documentRowCell` / `documentFileCell` (icona del file prima del nome, senza Quick info). Mai ridefinire
   icone o celle documento nel `data.js` del flusso.
9. **Contenuti realistici** presi dalle schermate. Menu contestuali, sottomenu e liste di azioni riportano **tutte** le voci della schermata, nello stesso
   ordine e con gli stessi separatori: non si tolgono, non si riordinano e non si raggruppano voci (un sottomenu resta
   una voce con `slot="submenu"`), salvo decisione esplicita dell'utente registrata nelle decisioni del progetto.
10. **Viewport di riferimento** dalla configurazione. Verifica a 1280 e 1920: non deve comparire lo scroll
    orizzontale. Alla viewport di riferimento, se il layout è "a tutta altezza", nessun contenitore deve avere
    `scrollTop > 0` dopo il caricamento (uno `scrollIntoView` scorre anche gli antenati e nasconde breadcrumb e
    titolo): misura `scrollHeight`/`clientHeight` di `main` prima di dichiarare la pagina pronta per Figma.
11. **Regioni nominate** con `aria-label` e una classe semantica.
12. I contenitori senza componente Figma (es. menu dentro un dropdown, pannello di una tab) sono ammessi se sono
    contenuti nello snippet del genitore.

## Cosa conta come "nuovo elemento" (da segnalare sempre)

| Caso | Esempio | Cosa scrivere nel report |
| --- | --- | --- |
| Superficie non DS | box con fondo o bordo | perché la card non basta; proposta di variante o componente |
| Override `::part` | badge con colore non previsto | variante da aggiungere |
| Composizione ricorrente | dual list, document viewer | proposta di pattern o componente composto |
| Icona mancante | `funnel`, `inbox` | nome ideale + icona usata al suo posto |
| Componente senza Code Connect usato come elemento principale | — | richiesta di template Code Connect |
| Testo con stile non coperto | etichetta tabellare 11px | proposta di text style o token |

## Principi di design (applicativi enterprise)

- Gerarchia chiara: un'azione primaria per regione, le azioni secondarie raggruppate, quelle distruttive separate.
- Lista + dettaglio come pattern principale per i flussi documentali. Filtri sopra la lista, in una card, con le
  label sopra i campi.
- Tabelle: colonne con larghezze da token, date che non si troncano, testo lungo troncato con il valore completo
  disponibile, stato vuoto con l'empty-state del DS.
- Dialog per conferme e task brevi, drawer o pannello per i dettagli, wizard con step espliciti per le creazioni
  lunghe.
- Stati da prevedere per ogni regione: vuoto, caricamento, errore, nessun risultato, disabilitato, selezionato,
  lungo/overflow, permessi ridotti.
- Schermate applicative (spunti da taste-skill v2.1, adattati al DS):
  - pannelli "quieti": superfici neutre del DS, il colore semantico sta sui **dati** (stati, badge, scadenze), non
    sulla cornice;
  - numeri e cifre allineati (colonne numeriche allineate a destra o al centro in modo coerente, stesse unità);
  - primo schermo con un titolo chiaro che dice dove si è e cosa si fa;
  - margini uguali sui due lati, nessuna sezione spinta da una parte senza motivo;
  - a larghezze strette la navigazione si comprime (sidebar collapsed, overflow), i dati restano.
- Accessibilità minima: label su tutti i campi, contrasto dei colori semantici, focus visibile, regioni con
  `aria-label`.

- **Valori di sola lettura nei form:** un valore calcolato dal sistema dentro un form è un `sl-input readonly disabled`
  sulla stessa griglia degli altri campi. `readonly` da solo ha lo stesso aspetto di un campo modificabile; una
  description list in mezzo ai campi rompe l'allineamento.
- **Select multiple su una riga:** i tag di `sl-select multiple` non devono andare a capo. Imposta
  `max-options-visible` in base alla larghezza del campo (indicativamente 1 fino a `rs-span-4`, 2 fino a `rs-span-8`,
  3 a tutta larghezza): gli altri valori finiscono nel contatore "+N". In Figma: stessi tag visibili più il Tag "+N".
