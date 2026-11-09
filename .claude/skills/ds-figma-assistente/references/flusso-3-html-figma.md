# Flusso 3 — HTML → Figma (con verifica e aggiornamento del DS)

Obiettivo: per ogni pagina HTML, una schermata nel file di progetto (B) fatta **solo di istanze della libreria DS**
collegate a Code Connect, **identica all'HTML renderizzato**, senza che l'utente debba correggerla. Quando il DS non
copre un caso: si corregge il master nel file DS (A), si aggiorna Code Connect, l'utente pubblica, e solo dopo si
aggiorna il design in B.

```
scelta pagina → mappa (gap DS?) ──no──→ costruzione → verifica ⟲ → chiusura
                     │ sì                                   ↑
                     └→ proposta fix → [ok] fix master A → template CC → [utente] publish
                        libreria + CC → accetta update in B → applica ─┘
```

Input (da configurazione, chiedi solo i mancanti): cartella HTML, cartella screenshot (per l'eventuale confronto
OLD/NEW), anteprima, file A, file B + pagina di destinazione, registro pagine, template Code Connect. Leggi
[regole-figma.md](regole-figma.md) e i `riferimenti_progetto` (mappatura HTML → Figma, pagine di riferimento).
Carica `figma:figma-use` e `figma:figma-generate-design`, più `figma:figma-generate-library` per i fix al DS.

## Fase 1 — Scelta della pagina (sempre)

1. Anteprima attiva: stessa procedura di [flusso-2-screenshot-html.md](flusso-2-screenshot-html.md) §1 passo 0 (avvio o creazione del server).
2. Scansione read-only della pagina di destinazione in B (script in `regole-figma.md` §Scansione) e confronto con il
   registro. Se ci sono wrapper non registrati o voci registrate che non esistono più, aggiorna il registro e dillo.
3. `python3 <skill>/scripts/stato_pagine.py [<flusso>]`.
4. Se l'utente non ha indicato la pagina, mostra l'elenco (fatte / parziali / da riverificare / da fare / senza HTML)
   e **chiedi quale** (AskUserQuestion). Non andare avanti finché non risponde.
5. Se la pagina esiste già in Figma, dillo con il suo stato e chiedi se riverificarla o sceglierne un'altra. Non
   creare un secondo wrapper per la stessa schermata.
6. Se manca l'HTML, proponi il flusso 2.

## Fase 2 — Mappa della pagina (prima di toccare Figma)

1. Leggi commento `State:`, `<body>`, script finali, dati mock e CSS del flusso.
2. Screenshot del browser alla viewport configurata ed estrazione del DOM (misure, testi, attributi). Non fidarti
   della lettura dell'immagine per numeri e testi.
3. Scrivi la mappa, una riga per ogni elemento visibile:

| Regione | Elemento HTML (tag + attributi) | Componente DS (da Code Connect) | Proprietà / valori | Contenuto reale |
| ------- | ------------------------------- | ------------------------------- | ------------------ | --------------- |

Regole:

- **Code Connect al contrario**: scegli il componente e le proprietà il cui template genera esattamente quel markup.
  `cc_inventario.py --json` ti dà, per ogni template, il nodo e le proprietà lette.
- Ogni attributo presente nell'HTML deve corrispondere a una proprietà letta da Code Connect. Gli attributi assenti
  lasciano la proprietà al default.
- I figli vanno negli **slot** del componente, mai in frame affiancati.
- Si disegna solo ciò che l'HTML mostra **in questo stato**: niente dialog chiusi, tab non attive, menu chiusi.
- Layout → auto-layout con gap e padding legati alle variabili DS; testo libero → text style del DS.
- Riga senza componente o proprietà corrispondente = **gap DS**. Raccogli **tutti** i gap prima di costruire.
- Scegli la pagina già fatta più simile come riferimento (nel registro o nei `riferimenti_progetto`).

Mostra la mappa all'utente solo se ci sono gap o scelte ambigue. Se ci sono gap, vai alla Fase 5 **prima** di
costruire le parti che ne dipendono.

## Fase 3 — Costruzione (chiedi prima: è una scrittura su B)

Mostra: pagina di riferimento da clonare, cosa riusi (es. header, tab, layout) e cosa adatti, dove crei il wrapper.
Aspetta il sì, poi:

1. **Wrapper** secondo la struttura del progetto. Default: frame `<N-Nome>` con **OLD** (etichetta + frame con lo
   screenshot originale caricato con `upload_assets`) e **NEW** (etichetta + frame della pagina alla larghezza della
   viewport). Va sotto l'ultimo wrapper, o nella SECTION del flusso.
2. **Clona prima di costruire**: se esiste una pagina o un componente composto simile (tabella configurata, toolbar,
   tab group), clonalo e adattalo invece di rifarlo. Consuma meno token ed è più coerente.
3. Adatta **regione per regione**, con una chiamata `use_figma` per regione, che si possa rilanciare senza danni e
   che restituisca gli id toccati.
4. Ogni elemento è un'**istanza DS** con le proprietà della mappa e i contenuti negli slot. Icone solo dal DS
   (`importComponentByKeyAsync` con la key dal template Code Connect dell'icona). Vietati: cattura HTML→Figma,
   frame che imitano componenti, testi segnaposto, valori fissi, override che simulano una proprietà mancante, SVG.
5. Togli **ogni residuo** della pagina clonata (colonne, righe, azioni, badge, testi).
6. **Pagine già fatte, cambiate nell'HTML** (es. una regola di layout applicata a più pagine): non ricostruire,
   modifica in-place il frame NEW esistente. Prova su una pagina, confronto con l'HTML, poi in blocco sulle altre con
   le ricette di [regole-figma.md](regole-figma.md) §Avvolgere contenuti esistenti; aggiorna le note del registro.

## Fase 4 — Verifica (ciclo finché Figma = HTML)

1. `get_screenshot` del frame NEW, accanto allo screenshot HTML.
2. Inventario numerico da Figma (colonne, larghezze, righe, selezioni, testi di default rimasti). Gli script sono in
   `regole-figma.md` §Verifica.
3. Checklist: header, titoli, tab (attiva, contatori, icone); campi e bottoni (ordine, label, placeholder, valori,
   varianti, disabled, larghezze); tabelle (colonne, ordine, label, larghezze ±2px, righe visibili, selezione,
   paginazione); pannelli; overlay solo se aperti nell'HTML; nessun residuo; nessun testo di default; wrapper
   canonico.
4. Classifica ogni differenza: **errore di costruzione** (si corregge subito), **gap DS** (Fase 5), **difetto
   dell'HTML o del codice** (si segnala, non si simula in Figma).
5. Nuovo screenshot dopo ogni correzione. La pagina è completa **solo** quando coincide con l'HTML, a parte le
   differenze che l'utente ha accettato esplicitamente.

## Fase 5 — Correzione del DS (il master non gestisce il caso)

1. **Fermati** e presenta per ogni gap: componente, caso non gestito, effetto sulla pagina, correzione proposta sul
   master (verificando nel codice come lo gestisce il componente), impatto su Code Connect, sulle istanze esistenti e
   sulle pagine già fatte. Controlla prima nei `riferimenti_progetto` se il gap è già stato risolto.
2. Aspetta l'approvazione. Poi **verifica se il componente esiste già** nel DS: cerca per key, nome e Code Connect
   con `search_design_system` e lo script della Fase 2 del flusso 1, senza fermarti al nome. Se esiste, si
   corregge; se non esiste, si crea (`figma:figma-generate-library`, varianti coerenti con le `@property` del
   codice, variabili legate).
3. Applica le correzioni **sul master nel file A, in-place**: stessi id e key, una variante alla volta controllando
   le altre. Ricette in `regole-figma.md` §Ricette sul master. Mai delete + create: cambia il node-id e rompe Code
   Connect e le istanze.
4. **Code Connect**: se cambiano proprietà, aggiorna il template (o creane uno nuovo per un componente nuovo),
   rilancia `cc_inventario.py --figma …` e la validazione, poi il formatter. Se un node-id è cambiato, cerca e
   aggiorna tutti i template che lo citano **prima** del publish.
5. **Pubblicazione, fatta dall'utente**, in due passi da confermare separatamente:
   - libreria: in Figma A, _Assets → Libraries → Publish_, selezionando i componenti modificati;
   - Code Connect: `code_connect.publish` dal suo terminale con il token (`--dry-run` prima, se vuole).
6. **Aggiornamento del design in B**: l'utente accetta gli aggiornamenti della libreria (_Libraries → Updates →
   Update_). Poi verifica che l'istanza in B esponga la correzione (leggi `componentProperties` e misure), applicala
   alla pagina, togli gli override temporanei e allinea quelli locali rimasti (es. `itemSpacing`). Torna alla Fase 4.
7. Se la correzione tocca pagine già fatte, elencale e proponi di aggiornarle.
8. Registra il gap risolto nel reference di progetto, così non viene riproposto.

## Fase 6 — Chiusura

1. Aggiorna il registro pagine (`wrapper`, `status` = `done` / `partial` / `to-verify`, differenze aperte in `open`)
   e verificalo con `stato_pagine.py`.
2. Se hai trovato un caso nuovo (pattern HTML → Figma, problema dell'API, correzione del DS), aggiungilo al
   reference di progetto o a `regole-figma.md`, così la pagina successiva non lo ripete.
3. Messaggio: pagina e id del wrapper, esito del confronto, correzioni DS fatte o in attesa di publish, differenze
   accettate, prossima pagina del flusso.
