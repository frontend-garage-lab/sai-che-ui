# Flusso 4 — Audit dei componenti DS (codice ↔ Figma)

Obiettivo: per ogni componente, stabilire se il master nel file DS rappresenta fedelmente il componente reale
(API, stati, layout, token, aspetto). Il flusso è **in sola lettura**: produce un inventario, un report con i gate
e un piano di modifiche. I fix si fanno dopo, su approvazione, con la Fase 5 del flusso 3.

Input: cartella dei componenti, documentazione, sito della documentazione renderizzato (`anteprima.docs_url`),
file DS. Facoltativi: elenco dei componenti (default: tutti, a blocchi), file di progetto B per contare le istanze.

## 1. Lato codice

Per ogni componente leggi dal sorgente e dal manifest: tag, `@property` (tipo, `reflect`, `attribute`, default),
`@state()` interni, slot (`@slot`), parti (`@csspart`), eventi, custom property CSS e token usati negli stili.
Dalla documentazione prendi esempi e varianti mostrate.

## 2. Lato Figma (read-only)

Con lo script del flusso 1, Fase 2, esteso se serve: tipo del nodo (COMPONENT_SET, COMPONENT o FRAME), varianti e
proprietà, auto-layout (modo, padding, gap, sizing), variabili legate a fill, stroke e spaziature, text style,
istanze annidate, key, publish status (`getPublishStatusAsync`) e template Code Connect esistente. Leggi a blocchi
filtrati per pagina, mai l'intero file in una volta.

## 3. Confronto visivo

Segui il protocollo in [quality-gate.md](quality-gate.md) §Confronto visivo: stessa variante e stato, font caricati,
screenshot del solo nodo in Figma e dell'esempio nel sito della documentazione. Non decidere sulla base della sola
percentuale di pixel diversi: guarda le regioni. Verifica anche testo lungo e stati non di default.

## 4. Gate e classificazione

Applica i gate **G01–G12** di `quality-gate.md`. Ogni esito è `PASS`, `FAIL`, `REVIEW` o `NON VERIFICABILE` e
deve avere un'evidenza. Azione per componente:

| Azione | Quando |
| --- | --- |
| `KEEP` | gate pertinenti PASS |
| `PATCH` | difetti correggibili in-place senza perdere id, proprietà o istanze |
| `REBUILD_PROPOSAL` | struttura sbagliata (es. FRAME al posto di COMPONENT_SET): serve un piano di migrazione approvato |
| `CREATE` | il componente esiste nel codice ma non in Figma |
| `UNVERIFIED` | dati insufficienti |

Gravità: **P0** collegamenti rotti, istanze o semantica perse, mapping al nodo sbagliato; **P1** differenze
sostanziali di aspetto, varianti o proprietà; **P2** naming, documentazione, pulizia.

Errori ricorrenti da cercare:

- proprietà Figma per stati che nel codice non esistono, o viceversa, come pseudo-stati CSS (`hover`, `focus`) resi
  proprietà quando sono solo varianti visive;
- proprietà che dovrebbero essere BOOLEAN (pilotano la visibilità di un figlio) fatte come VARIANT `true/false`;
- valori fissi dove esiste un token;
- master che è solo un FRAME, o due master con lo stesso nome;
- component set in errore (varianti duplicate) che rende illeggibili le proprietà;
- prima di dichiarare "rimossa dal codice" una funzione, controllare il sorgente: a volte manca solo l'esempio nella
  documentazione.

## 5. Report e piano

Scrivi in `percorsi.report_dir`:

- `audit-AAAA-MM-GG.md` (da `assets/report-audit.md`): tabella componente × gate, azioni, evidenze, limiti;
- `inventario.json`: tag ↔ node-id ↔ key ↔ proprietà ↔ template;
- `piano-modifiche.md`: modifiche raggruppate in ordine di dipendenza (token e componenti base → varianti e composti
  → Code Connect → publish → consumer), con rischio sulle istanze e reversibilità.

Chiudi con *"Nessun file Figma è stato modificato"*. Proponi: flusso 3 Fase 5 per i `PATCH`/`CREATE` approvati,
flusso 1 per i template, flusso 7 per la release.
