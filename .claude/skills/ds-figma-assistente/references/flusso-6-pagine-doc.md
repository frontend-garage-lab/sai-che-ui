# Flusso 6 — Pagine di documentazione dei componenti nel file DS

Obiettivo: ogni componente ha nel file DS una pagina uniforme, leggibile dagli utenti finali e con anteprime
modificabili. I testi vengono dalla documentazione del repository, non da testi inventati. Il flusso scrive sul file
A, quindi va approvato pagina per pagina oppure in blocco se l'utente lo dice.

Input: file A, `codice.doc_componenti`, sorgenti dei componenti (JSDoc `@status`, `@since`), template Code Connect.
Se esiste un report di avanzamento in `percorsi.report_dir` (es. `doc-pages-progress.md`), leggilo per primo e
aggiornalo dopo ogni pagina, così non resta niente in sospeso.

## Struttura della pagina (modello)

Se il progetto ha già una pagina approvata come riferimento (citata nei `riferimenti_progetto` o nel report),
clonala. Altrimenti proponi questo schema e fallo approvare sulla prima pagina:

1. **Header**: eyebrow `COMPONENTS · <STATUS> · SINCE <versione>` (dal JSDoc), titolo, descrizione (dal `meta` o dal
   primo paragrafo della doc), chip (tag del codice, numero di set e varianti, Code Connect sì/no).
2. **Playground**: stage con un'istanza del set principale e pannello Proprietà (nome, tipo, valori, default).
3. **Esempi**: una card per ogni sezione `###` della documentazione, nello stesso ordine, con didascalia = titolo +
   prima frase. Le sezioni solo CSS/JS (styling, eventi, metodi) si escludono e si annotano.
4. **Varianti**: per ogni set, titolo, chip delle proprietà non-variant, frase dalla doc e matrice con etichette di
   riga e colonna intorno al **master spostato**. Il master si sposta, mai si ricrea: così node-id e Code Connect
   restano validi.

Regole: tutti i testi della pagina nella lingua `preferenze.lingua_contenuti`. Nessun box di prova duplicato fuori
dal Playground (se l'utente non lo chiede). Solo istanze, variabili e text style del DS.

## Procedura per pagina

1. Leggi doc e JSDoc, elenca esempi e set, e proponi il contenuto (titoli, esempi inclusi ed esclusi).
2. Dopo l'ok, costruisci con `figma:figma-use` + `figma:figma-generate-library`, sezione per sezione.
3. Verifica con `get_screenshot`, controlla che node-id e key dei master siano invariati e che non ci siano testi di
   default.
4. I gap trovati (esempio non rappresentabile, proprietà mancante, bug del master) **non si correggono di
   passaggio**: annotali nel report e proponili, poi passa al flusso 3 Fase 5.
5. Aggiorna il report di avanzamento (✅ fatta, 🟡 fatta con gap aperti, ⬜ da fare).

Alla fine chiedi all'utente di pubblicare la libreria se sono cambiati i master, e `figma connect publish` se sono
cambiati i template.
