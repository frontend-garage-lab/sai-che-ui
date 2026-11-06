# Flusso 8 — Nuovo componente DS → Figma

Obiettivo: un componente che esiste nel codice ma non in Figma diventa un **master nel file DS** (component set con
varianti e proprietà coerenti con l'API del codice, legato alle variabili), con la sua **pagina di documentazione**
nella stessa struttura dei componenti già fatti e il suo **template Code Connect**. Il flusso scrive sul file A e
nel repository: ogni scrittura va approvata.

Input: componenti da portare (tag o nome; se l'utente non li indica, elencali al passo 1), file A, cartella dei
componenti, documentazione, sito docs renderizzato (`anteprima.docs_url`), pagina di riferimento
(`figma.pagina_doc_riferimento`, es. la pagina Dialog). Carica `figma:figma-use` + `figma:figma-generate-library`, e
`figma:figma-code-connect` per il template.

## 1. Quali componenti mancano (read-only)

```bash
python3 <skill>/scripts/cc_inventario.py --mancanti
```

Elenca i componenti del codice senza template Code Connect. Escludi quelli **senza resa visiva** (formatter come
`format-date`, observer, `include`, `visually-hidden`, `animation`): non hanno nulla da disegnare. Per ognuno controlla anche Figma: nome della pagina,
`search_design_system`, ricerca per nome di COMPONENT/COMPONENT_SET. Se il master **esiste già** (anche senza
template), non va ricreato: usa il flusso 4 (audit) e il flusso 1 (template). Mostra l'elenco e chiedi quali portare.

## 2. Lettura del componente (read-only)

Dal codice: `@property` (tipo, valori, default, `reflect`), `@state`, `@slot`, `@csspart`, custom property CSS, gli
stili per variante e dimensione (padding, altezze, raggi, colori: **quali token** usa ogni variante), le
dipendenze da altri componenti (icone, bottoni interni). Dal JSDoc: `@status`, `@since`. Dalla documentazione: una
riga di descrizione e le sezioni `###` con gli esempi.

Screenshot di riferimento dal sito docs per ogni variante rilevante (Playwright, se autorizzato): sono la verità
visiva del passo 5.

## 3. Proposta (prima di qualunque scrittura)

Guarda **un componente simile già fatto** nel file A (stesso tipo: campo, contenitore, feedback…) e riprendine le
convenzioni: nomi delle proprietà (maiuscola iniziale, es. `Size`, `State`, `Variant`), valori in minuscolo come nel
codice, nomi dei layer di testo, uso di BOOLEAN / INSTANCE_SWAP / SLOT. Poi proponi:

| Proprietà del codice | Proprietà Figma | Tipo | Valori | Note |
| --- | --- | --- | --- | --- |
| `variant` | Variant | VARIANT | primary, neutral… | solo i valori del codice |
| `size` | Size | VARIANT | small, medium, large | |
| `disabled`, `checked`… | State | VARIANT | default, checked, disabled… | stati visivi; gli pseudo-stati CSS (hover, focus) solo se il DS li disegna per componenti simili |
| `pill`, `outline`… con resa diversa | Pill… | VARIANT o BOOLEAN | | BOOLEAN se mostra/nasconde un figlio |
| slot con icona | Icon + Icon Type | BOOLEAN + INSTANCE_SWAP | Icon/… del DS | |
| slot di contenuto | Body, Footer… | SLOT | | |

Includi: numero di varianti (prodotto delle VARIANT: se esplode, proponi di spezzare in più set come Button /
Button Outline), variabili da legare (colori `Color`/`Palette`, `Spacing`, `Radius`, text style), posizione della
pagina nell'ordine del file (accanto ai componenti della stessa famiglia), template Code Connect previsto. Aspetta
l'approvazione.

## 4. Costruzione del master (file A, dopo l'ok)

1. Nuova pagina `<Nome>` nella posizione approvata.
2. Una variante base costruita in auto-layout, con **solo** variabili e text style del DS (fill, stroke, gap,
   padding, raggio, tipografia) e icone dalla pagina Icons. Nomi dei layer di testo stabili, perché li legge Code
   Connect.
3. Le altre varianti per clonazione della base, cambiando solo ciò che il codice cambia. Poi `combineAsVariants`,
   con nomi `Prop=valore, Prop=valore`.
4. Proprietà non-variant sul set: BOOLEAN legate a `visible`, INSTANCE_SWAP con default corretto, SLOT con il frame
   `slotContentId` in **ogni** variante.
5. Descrizione del set (`description`) con una riga dalla documentazione.
6. Ogni chiamata `use_figma` restituisce gli id; nessun delete + create sui nodi creati dopo che sono stati
   referenziati.

## 5. Verifica del master

Per ogni variante: `get_screenshot` del set e confronto con gli screenshot del sito docs (stessa variante, stessi
testi): misure, padding, colori, tipografia, icone. Controlla anche che:

- le definizioni di proprietà corrispondano alla proposta (script del flusso 1 §2);
- non ci siano valori non legati a variabili (fill/stroke/gap/padding senza `boundVariables`);
- le istanze si comportino bene (istanza temporanea: cambia varianti, attiva i BOOLEAN, inserisci contenuto negli
  slot), poi rimuovi l'istanza.

Correggi e ripeti, con al massimo un giro di conferma.

## 6. Pagina di documentazione

Costruisci la pagina con la **stessa struttura della pagina di riferimento** (flusso 6). Nel file Saipem DS il
frame è `<Nome> — Documentation`: auto-layout verticale, larghezza 1520, padding 80/80/96/80, gap 64, fondo legato.
Contiene:

1. **Header**: eyebrow `COMPONENTS · <STATUS> · SINCE <x>`, titolo, descrizione, `Meta` con le chip (tag
   `<sl-…>`, conteggio set e varianti, Code Connect), divider.
2. **Section: Playground**: `Section Title` (titolo + istruzione), `Card: Playground` con `Stage` (istanza
   "(Preview)") e il pannello `Properties` (per ogni proprietà: nome, chip del tipo, valori, default).
3. **Section: Examples**: `Examples Grid` con una card `Example: <titolo>` per sezione `###` della doc (Stage con
   le istanze + titolo + prima frase); le sezioni solo JS/CSS sono elencate come "Not shown".
4. **Section: Variants**: per ogni set, `Set: <Nome>` con la riga titolo + chip delle proprietà non-variant, una
   frase, e `Card: <Nome>` con la `Matrix` che contiene il **master spostato qui** (non copiato) e le etichette
   delle combinazioni.

Il modo più sicuro è **clonare il frame di documentazione della pagina di riferimento** nella nuova pagina e
sostituire contenuti e istanze, sezione per sezione. Testi nella lingua `preferenze.lingua_contenuti`.

## 7. Template Code Connect

1. Crea `<code_connect.dir>/<nome>.figma.ts` sul modello di un template simile: `// url=` con il node-id del
   **COMPONENT_SET**, `// source=`, `// component=`, il helper per i testi, un getter per ogni proprietà della
   proposta, `example` con `figma.html` che emette solo attributi e slot reali, `imports`, `id`.
2. Leggi le proprietà del set (flusso 1 §2) e lancia `cc_inventario.py --figma …`: 0 P0/P1 sul nuovo file. Poi
   `code_connect.validazione` e il formatter.
3. Se il progetto ha dati derivati (es. mappa Code Connect, inventario componenti nei `riferimenti_progetto`),
   rigenerali con i loro script.

## 8. Pubblicazione e chiusura

1. Chiedi all'utente: publish della libreria (componente nuovo + pagina) e `code_connect.publish`. Aspetta la
   conferma di entrambi.
2. Verifica: `get_code_connect_map` sul set e su una variante; `search_design_system` lo trova nella libreria.
3. Aggiorna il report di avanzamento delle pagine doc (se esiste) e scrivi nel messaggio: pagina e node-id del set,
   varianti create, template, cosa resta (es. pseudo-stati non disegnati, esempi non rappresentabili).
4. Proponi il passo successivo: flusso 7 se il componente va usato nel file di progetto, flusso 3 se serve in una
   pagina restyle.

## Da non fare

- Non inventare varianti o stati che il codice non ha; non trasformare una custom property CSS in una variante
  senza dirlo.
- Non creare il componente nel file di progetto: si crea solo nella libreria.
- Non duplicare un master esistente perché ha un nome diverso: cerca anche per tag, Code Connect e somiglianza.
- Non usare `generate_figma_design` per creare il master: produce frame, non un component set.
