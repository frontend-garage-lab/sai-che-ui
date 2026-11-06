# Flusso 2 — Screenshot → HTML con componenti DS

Obiettivo: per ogni schermata (immagine), una pagina HTML che **conserva tutti i dati e le azioni** dell'originale
ma li organizza con buone regole di design, usando **solo** componenti del DS, token e layout condiviso. Ogni
pagina deve poter diventare Figma (flusso 3) senza perdite. Lavori come un senior product designer che scrive
anche il markup.

## Input da chiedere (in un solo messaggio, se non sono in configurazione)

| Input | Chiave | Note |
| --- | --- | --- |
| Cartella di input con gli screenshot | `percorsi.screenshot_dir` | una sottocartella per flusso applicativo; file `N-Nome.png` in ordine |
| Cartella di output per l'HTML | `percorsi.html_dir` | stessa struttura: `<Flusso>/<N-Nome>.html` |
| Quale flusso o schermata | — | nome (anche parziale), `tutti`, oppure una singola schermata |
| Sovrascrivere pagine esistenti? | — | di default no: chiedi mostrando quali esistono |

Mostra l'elenco con `python3 <skill>/scripts/stato_pagine.py`. Se l'utente non sceglie, suggerisci di partire da
**un solo flusso pilota** per validare le decisioni.

## 1. Preflight

0. **Server di anteprima (obbligatorio, prima di scrivere pagine).**
   1. `curl -s -o /dev/null -w '%{http_code}' <anteprima.base_url>`: se risponde (200/404), il server è attivo.
   2. Se non risponde e `anteprima.comando_avvio` è impostato e il file esiste, avvialo **in background**
      (`run_in_background`) e ricontrolla con `curl` fino a risposta (max ~20 s). Se serve `node` e non è nel PATH,
      prova `source ~/.nvm/nvm.sh`.
   3. Se il progetto **non ha un server** (nessun `comando_avvio`, nessuno script `serve`/`dev`/`demo` in
      `package.json` o in `scripts/`), proponi di crearlo: copia `assets/server-anteprima.mjs` in
      `scripts/serve-preview.mjs` (nessuna dipendenza), poi
      `config.py set anteprima.comando_avvio="node scripts/serve-preview.mjs" anteprima.base_url=http://localhost:4100`.
      Chiedi prima: è un file nuovo nel repository. Se i componenti DS richiedono una compilazione al volo (sorgenti
      TypeScript non compilati), il server statico non basta: proponi un server con esbuild sul modello del progetto,
      oppure di servire il bundle di `codice.comando_build`.
   4. Verifica che una pagina esistente (o una pagina vuota di prova) risponda 200 e che il bundle dei componenti si
      carichi, prima di generare pagine.
1. Manifest aggiornato: se `codice.manifest` manca o è più vecchio dei componenti, chiedi se lanciare
   `codice.comando_build`.
2. Leggi i `riferimenti_progetto` (mappature legacy → DS, regole di design, decisioni già prese) e
   [regole-html-ds.md](regole-html-ds.md). Le decisioni già registrate **prevalgono** sulle mappature generiche.
3. Cerca nella cartella di output i file condivisi (CSS di layout, helper JS, registro decisioni). Se non esistono,
   copiali dagli asset di progetto o crea il minimo indispensabile, e chiedi prima. Non rigenerare mai file
   condivisi che esistono già, perché evolvono nel tempo.
4. Per i componenti che userai, leggi la loro pagina in `codice.doc_componenti` almeno una volta nella sessione:
   gli esempi mostrano slot e combinazioni previste.

## 2. Analisi del flusso (prima di scrivere codice)

1. **Guarda tutti gli screenshot del flusso in ordine** (Read sulle immagini). Spesso più file sono la stessa pagina
   in stati diversi (filtro compilato, menu aperto, dialog, toast): queste pagine devono condividere struttura e
   dati identici, cambia solo lo stato.
2. Ignora ciò che non fa parte dell'applicazione (toolbar di registrazione, puntatore, bande nere, finestre del
   sistema operativo).
3. Per ogni schermata annota: regioni, dati reali (codici, nomi, date, conteggi), azioni, stato (cosa è aperto,
   selezionato, compilato), differenze rispetto alla precedente.
4. Individua il **job** dell'utente nel flusso: guida la gerarchia e la scelta dell'azione primaria.
5. Apri il report del flusso da `assets/report-flusso-html.md` e compila §1.

## 2b. Direzione di design con skill dedicate (non c'è un design di partenza)

Le regole del progetto dicono **con cosa** si costruisce; le skill di design aiutano a decidere **come organizzare**
la pagina. Usa `impeccable` (se installata). `taste-skill` è stata valutata e **non** si usa: fa art direction per landing page
(direzioni stilistiche proprie, immagini stock, browser automatico, centinaia di migliaia di token) e non rispetta un DS
esistente; le sue regole utili per le schermate applicative sono già in `regole-html-ds.md` §Principi.
Il **DS è il sistema visivo già deciso**: le skill lavorano dentro questo vincolo, mai sopra.

| Momento | Comando | Cosa si chiede |
| --- | --- | --- |
| Prima di costruire, una volta per flusso | `impeccable shape` | job dell'utente, architettura delle informazioni, gerarchia, azione primaria per passo, stati da prevedere |
| Dopo la prima pagina del flusso | `impeccable critique` | revisione UX con punteggio euristico, carico cognitivo |
| Dopo la costruzione | `impeccable layout`, `clarify`, `audit` | ritmo e allineamento con la griglia, testi di label/errori/empty state, accessibilità e responsive |

**Preparazione, una volta per progetto: `DESIGN.md` dal DS.** Impeccable usa `DESIGN.md` (nella root) come
sistema visivo di riferimento. Se il file manca, rischia di proporre uno stile proprio. Prima di usare `shape` o
`critique`:

1. Se `DESIGN.md` non esiste, proponi `/impeccable document` in **scan mode** sul DS: token dei temi, componenti,
   classi di layout e tipografia condivise, regole di design dei `riferimenti_progetto`. Le domande qualitative
   (metafora guida, tono, carattere dei componenti, profondità, nomi dei colori, divieti) vanno fatte all'utente,
   non inventate.
2. Contenuto minimo da verificare: valori del frontmatter uguali ai token reali; tipografia mappata sulle classi
   condivise e sui text style di Figma; i divieti "solo componenti DS, niente superfici custom, niente valori fuori
   token, niente animazioni decorative".
3. Aggiungi `DESIGN.md` ai `riferimenti_progetto`. Va aggiornato (`/impeccable document`, scelta "refresh") quando
   cambiano token o componenti del DS, per esempio dopo una release del flusso 7.
4. Se `DESIGN.md` esiste già, non sovrascriverlo: mostralo e chiedi se aggiornarlo, sostituirlo o unirlo.

Vincoli da passare **sempre** alla skill di design, nel prompt:

- solo componenti, varianti e token del DS (manifest + `riferimenti_progetto`); niente palette, font, ombre,
  animazioni o superfici proprie; niente `DESIGN.md` nuovo che sostituisca il DS;
- comandi esclusi: `bolder`, `colorize`, `animate`, `delight`, `overdrive`, `typeset`, `generate`, e qualunque
  "redesign" dell'identità visiva;
- tutti i dati e le azioni dell'originale restano (si riorganizzano, non si tolgono);
- un passaggio di verifica limitato (una revisione, una correzione, una conferma), non un ciclo infinito.

Come usare l'output:

- un suggerimento esprimibile con componenti/varianti DS → applicalo e scrivilo nel report §6 se cambia il legacy;
- un suggerimento che richiede stile custom o un componente mancante → **non** implementarlo in CSS: va nel report
  §4 come nuovo elemento (proposta per il DS);
- se contraddice una decisione in `DECISIONS.md` o nei `riferimenti_progetto`, vince la decisione registrata:
  segnala il conflitto all'utente invece di scegliere da solo.

Se nessuna skill di design è installata, applica comunque i principi di `regole-html-ds.md` §Principi.

## 3. Decisioni di design

Per ogni regione o elemento:

1. Cerca il pattern nelle decisioni già prese e nei `riferimenti_progetto`.
2. Scegli componente **e variante** tra tutte le opzioni reali del manifest. Per esempio, per una scelta esclusiva
   confronta radio, radio-button, select e selectable item in base a numero di opzioni, frequenza d'uso, spazio e
   descrizioni. Preferisci componenti **con Code Connect**: `cc_inventario.py` ti dà l'elenco.
3. Definisci la griglia (span per regione a ≥1280, 1024–1279, <1024) e verifica la checklist degli stati in
   `regole-html-ds.md`. Gli stati che nessuno screenshot mostra vanno nel report come "stati da disegnare".
4. Una decisione con **impatto funzionale** (azione spostata in overflow, step uniti, dialog annidato eliminato) è
   ammessa se motivata, ma va nel report e nel messaggio finale. Se l'ambiguità riguarda *cosa fa* il sistema,
   scegli l'interpretazione più conservativa e scrivila tra le domande aperte.

## 4. Costruzione

1. **Dati mock** del flusso in un modulo condiviso (`<Flusso>/data.js`), trascritti dagli screenshot. Niente lorem
   ipsum: in Figma si vedono troncamenti e lunghezze reali.
2. **Una pagina per screenshot**, dal template del progetto o da `assets/pagina.html`:
   - commento di testa `State: …` che descrive lo stato riprodotto (serve al flusso 3);
   - layout solo con classi condivise; spaziature solo da token; testo solo con classi tipografiche;
   - **stato statico** della schermata con attributi: `open`, `active`, `checked`, `selected`, valori compilati,
     riga selezionata, toast visibile. Gli stati raggiungibili solo con un'interazione non contano;
   - ogni macro-regione con `aria-label`, che diventa il nome del frame in Figma.
3. CSS del flusso solo per regole di **layout** non coperte da quello condiviso. Una regola che serve a più flussi si
   sposta nel file condiviso.

## 5. Verifica

1. Lint, obbligatorio con 0 `ERR`:
   ```bash
   python3 <skill>/scripts/lint_html.py "<html_dir>/<Flusso>"
   ```
   Se il progetto ha un lint più specifico tra i `riferimenti_progetto`, usa anche quello. Ogni riga `NEW` deve
   comparire nel report come **nuovo elemento**, oppure va eliminata correggendo la pagina.
2. Formatter del repo sui file generati.
3. Anteprima: server attivo come da §1 passo 0. Le pagine, i dati e i CSS devono rispondere 200.
4. Controllo visivo: con `playwright_autorizzato` fai lo screenshot alla viewport configurata e confrontalo con
   l'originale; altrimenti chiedi il permesso o chiedi all'utente di aprire gli URL (`stato_pagine.py --url`).
5. Checklist per ogni pagina:
   - [ ] ogni dato e azione dell'originale è presente, oppure lo scostamento è nel report;
   - [ ] un solo `primary` per regione; colori semantici solo dove hanno un significato;
   - [ ] regioni allineate alla griglia, nessuno scroll orizzontale a 1280/1440/1920;
   - [ ] label sopra i campi, nessun placeholder usato come label;
   - [ ] stati vuoti con il componente empty-state del DS;
   - [ ] icone solo tra quelle disponibili in Figma, le altre segnalate;
   - [ ] la pagina riproduce lo stato del suo screenshot e solo quello;
   - [ ] le pagine dello stesso flusso sono identiche nelle parti che non cambiano.

## 6. Chiusura

1. Completa il report del flusso (tutte le sezioni; "Nessuno" dove non c'è niente) e aggiorna il registro delle
   decisioni.
2. Messaggio: pagine create (URL), cartelle saltate, **⚠️ nuovi elementi non DS** (sempre, anche quando sono
   "nessuno"), componenti senza Code Connect usati, icone mancanti, scostamenti funzionali, domande aperte, esito del
   lint.
3. Con più flussi, dopo il pilota fermati e chiedi conferma delle decisioni prima di proseguire.
4. Proponi il **flusso 3** per portare le pagine in Figma. Se ci sono nuovi elementi da aggiungere al DS, proponi il
   flusso 5 o il flusso 4.

## Da non fare

- Non modificare i componenti in `codice.componenti_dir`.
- Non inventare varianti, slot o attributi: tutto deve esistere nel manifest (il lint lo verifica).
- Non usare HTML nativo per controlli o superfici, né valori px/hex fuori dai token per spazi e colori.
- Non eliminare funzioni dell'originale perché "sembrano inutili": riorganizzale e segnalale.
