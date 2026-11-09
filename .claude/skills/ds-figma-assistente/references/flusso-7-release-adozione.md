# Flusso 7 — Release della libreria e adozione nel file di progetto

Obiettivo: portare le modifiche del DS (file A) in modo controllato fino al file di progetto (B) e verificarle.
Sono **tre operazioni distinte**, da tracciare separatamente:

1. **publish della libreria** (Figma UI, lo fa l'utente);
2. **publish di Code Connect** (CLI con token, lo fa l'utente);
3. **aggiornamento del consumer** (accettazione degli update in B, più eventuali sostituzioni di istanze).

I gate R01–R08 sono in [quality-gate.md](quality-gate.md).

## 1. Preflight (read-only)

- Elenco delle modifiche in A dall'ultima release: report dei flussi 3, 4 e 6, `annotation`/backlog, git log dei
  template.
- Nessun P0 aperto sui componenti inclusi. Gate G01–G12 applicati a quelli modificati.
- Compatibilità: node-id, key, nomi delle proprietà e varianti invariati (o piano di migrazione approvato per i
  breaking change). Template Code Connect coerenti: `cc_inventario.py --figma …` con 0 P0/P1.
- Istanze a rischio in B: per ogni componente modificato, conta le istanze e gli override.
- Scrivi `<report_dir>/release-manifest.json` (modello `assets/release-manifest.esempio.json`) e `release-notes.md`.
  Se il manifest ha stato `BLOCKED`, non procedere.

## 2. Publish della libreria (utente)

Istruzioni da dare: file A → *Assets → Libraries → This file → Publish* (o *Review unpublished changes*); controlla
la lista added/modified/removed (niente cancellazioni impreviste), seleziona solo gli asset approvati, incolla le
release notes, *Publish*. Servono Full seat, permesso di modifica e un piano che consenta le librerie.

Poi verifica: `getPublishStatusAsync()` sui componenti, se disponibile, oppure conferma esplicita dell'utente.
Registra `CONFIRMED_API`, `CONFIRMED_USER` o `UNVERIFIED`. Non esiste un endpoint per pubblicare la libreria:
non inventarlo.

## 3. Publish di Code Connect (utente)

Solo se sono cambiati dei template: `code_connect.publish` dal terminale dell'utente (`! FIGMA_ACCESS_TOKEN=… npx
figma connect publish`). Verifica con `get_code_connect_map`. Nota: se le mappature erano state inviate con l'MCP,
l'MCP non può sovrascriverle, quindi l'aggiornamento passa dalla CLI.

## 4. Adozione in B (su approvazione)

1. Inventario **prima**: frame coinvolti, istanze (`getMainComponentAsync`), override, annotazioni, screenshot.
2. L'utente accetta gli aggiornamenti: B → *Libraries → Updates → Review / Update*. Non c'è un'API per farlo.
3. Le istanze già collegate si aggiornano e si **conservano**: non sostituirle per aggiornare lo stile.
4. Le istanze mancanti si creano con `importComponentByKeyAsync` / `importComponentSetByKeyAsync` usando key
   **verificate**, mai node-id o nomi.
5. Frame disegnati a mano, istanze staccate o di altre librerie: proponi la migrazione caso per caso. Lo swap
   (`swapComponent`) richiede un'approvazione puntuale e la verifica delle proprietà.
6. Override locali rimasti dopo l'update (gap, colori, vettori): se il master è stato corretto, riallineali. Se
   ricrei il contenuto di uno slot, salva e riapplica gli override di colore dei vettori, che altrimenti si perdono.
7. Le annotazioni non si toccano: i completamenti si registrano nel backlog esterno.

## 5. Verifica

Confronto prima/dopo: numero di istanze collegate ad A, key, override, testi, layout, screenshot. Ogni richiesta
del backlog passa a `IMPLEMENTED/PASS` solo con un'evidenza; le `CODE_REQUIRED` non si chiudono con la sola modifica
Figma. Stato finale: `READY`, `PARTIAL` o `BLOCKED`, con le azioni umane rimaste e i passi per il rollback (ripristino
della versione dalla cronologia di Figma). Scrivi `<report_dir>/adozione-consumer.md`. Se la release ha cambiato token o componenti, proponi di aggiornare
`DESIGN.md` (`/impeccable document`, refresh) così le pagine nuove usano i valori nuovi.
