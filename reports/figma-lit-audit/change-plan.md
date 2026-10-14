# Change Plan — Saipem DS (Figma A) allineamento a codice Lit

> **Aggiornamento 2026-10-14**: Batch 1, 2, 3, 4 e 5 **tutti eseguiti** (approvati dall'utente). Nessuna pubblicazione eseguita — tutte le modifiche sono in-place sul file A, non pubblicate.

- Fonte: `annotations.json` / `annotation-backlog.md` (13 richieste uniche, 117 istanze annotate in Figma B) + `audit-2026-10-14.md`.
- Target di tutte le patch: **File A soltanto** (`CdCRuuAnOeYrOOn1HYkxDM` — Saipem DS). Nessuna modifica a File B in questo piano (quella è la fase `adopt`, separata).
- Stato: **proposta, nessuna patch applicata.** Richiede approvazione esplicita per batch prima di passare a `fix`. L'approvazione di un batch non estende alle altre.
- Nessun batch richiede nuovo codice Lit: in tutti i casi il componente Lit è già allineato o più avanti del master Figma (vedi tabella di correlazione nell'audit). Eccezione aperta: Batch 5 (Toast) è una `QUESTION`, non una patch pronta.

## Ordine di dipendenza

1. **Batch 1 — Slot body** (Dialog, Card, Detail Panel): propedeutico a tutto il resto perché tocca i contenitori usati da altri componenti (es. Detail Panel ospita Tab+Empty State).
2. **Batch 2 — Tab / Tab Group** (card variant, icona, indicatore): propedeutico a Batch 1 solo nel punto in cui Detail Panel/Dialog ospitano Tab — ma sono patch indipendenti sui rispettivi master, eseguibili in parallelo a Batch 1.
3. **Batch 3 — Table (column width + rich cell esempio)**: indipendente dagli altri batch.
4. **Batch 4 — Nuovi master** (Description List, Comment): indipendenti, nessuna dipendenza da varianti esistenti oltre agli atomi già pronti (Avatar, Icon Button, text tokens).
5. **Batch 5 — Toast (decisione)**: non è una patch, va risolta prima con una domanda di scope (vedi sotto) — non bloccante per gli altri batch.
6. **Verifica File Upload Item** (REQ-009): non è un fix — è un controllo di publish status, eseguibile in qualunque momento, propedeutico solo alla fase `adopt` su B.

I batch 1–4 sono tra loro indipendenti e possono essere approvati/eseguiti in ordine qualsiasi; l'ordine sopra è solo una raccomandazione per minimizzare il numero di rework su componenti annidati.

---

## Batch 1 — Aggiungere slot/body content ai contenitori — ✅ ESEGUITO

| Master A | Nodo | Modifica proposta | Rischio istanze | Riuso ID? | Reversibilità |
|---|---|---|---|---|---|
| Dialog | `54:21` (COMPONENT_SET) | Sostituire il placeholder fisso in `Body` con un frame esposto come contenuto overridabile (instance-swap o testo libero editabile), mantenendo Header Actions/Header/Footer invariati | Medio: tutte le istanze esistenti di Dialog nei file che lo consumano devono continuare a renderizzare correttamente dopo la patch | Sì, in-place su `54:21` e le 4 varianti figlie | Alta — modifica additiva, nessuna rimozione di property esistenti |
| Card | `53:87` (COMPONENT_SET) | Analogo a Dialog: body content overridabile, Image/Header/Footer invariati | Medio | Sì, in-place su `53:87` | Alta |
| Detail Panel | `396:1722` (COMPONENT) | Sostituire `Body > Placeholder Content` (TEXT) con contenuto overridabile; aggiungere property `actions` (instance-swap, 0+ icon-button) nell'Header accanto a Close Button | Medio-alto: è un COMPONENT singolo (non component set), nessuna variante da propagare, ma è il master con più istanze annotate (14) in B | Sì, in-place su `396:1722` | Alta, ma priorità P0 per via del volume di istanze impattate |

**Precondizione:** nessuna. **Validazione:** rilettura `componentPropertyDefinitions` + struttura `Body`/`Header` post-patch, confronto 1:1 con gli slot already shipped in `dialog.component.ts` / `card.component.ts` / `detail-panel.component.ts`; screenshot prima/dopo.

## Batch 2 — Tab, Tab Group — ✅ ESEGUITO

| Master A | Nodo | Modifica proposta | Rischio istanze | Riuso ID? | Reversibilità |
|---|---|---|---|---|---|
| Tab | `45:10` (COMPONENT_SET) | Aggiungere property booleana `card` (o variant) che rispecchi `sl-tab[card]`; aggiungere supporto icona leading nel default slot | Medio: Tab è usato ovunque nel DS, verificare che l'aggiunta di property non sposti il layout delle varianti esistenti | Sì, in-place | Alta — additiva |
| Tab Group | `354:74` (COMPONENT_SET) | Aggiungere rappresentazione dell'indicatore attivo per-tab (coerente con `part="active-tab-indicator"` del codice) | Basso-medio | Sì, in-place | Alta |

**Precondizione:** nessuna (indipendente da Batch 1). **Validazione:** confronto variante-per-variante con `tab.component.ts`/`tab-group.component.ts`; verificare che Workflow Stage Tab (Tab+Badge Pill) sia ora rappresentabile senza detach.

## Batch 3 — Table: larghezza colonna configurabile + esempio cella ricca — ✅ ESEGUITO

| Master A | Nodo | Modifica proposta | Rischio istanze | Riuso ID? | Reversibilità |
|---|---|---|---|---|---|
| Table Header Row | `53:2` (COMPONENT) | Rendere le colonne ridimensionabili/FILL invece di larghezza fissa, per riflettere `ColumnDef.meta.width` | Medio: tutte le istanze Table Header Row nei consumer dipendono dalle larghezze attuali | Sì, in-place | Media — un cambio di sizing mode può richiedere aggiustamenti nei consumer esistenti |
| Table Row | `53:37` (COMPONENT_SET, 28 varianti) | Stessa modifica di larghezza colonna; aggiungere un esempio/variante documentata di cella ricca (icona/avatar + testo multi-riga) coerente con `ColumnDef.cell` | Medio-alto: 28 varianti da toccare in modo omogeneo | Sì, in-place | Media |

**Precondizione:** nessuna. **Nota:** batch a priorità P2 (bassa) rispetto a 1/2/4 — il codice supporta già il pattern via render function, quindi l'urgenza è solo documentale/di coerenza visiva.

## Batch 4 — Nuovi master DS — ✅ ESEGUITO

| Nuovo master | Lit tag di riferimento | Contenuto proposto | Rischio | Reversibilità |
|---|---|---|---|---|
| Description List (+ Description List Item) | `sl-description-list` / `sl-description-list-item` | Component set con label/value pairs, token testo (text/help, text/label, size/x-small, size/small) | Basso — nessuna istanza esistente da migrare, è una creazione pura | Alta — componente nuovo, rimovibile senza impatti se non adottato |
| Comment (Review Comment item) | `sl-comment` | Component con slot avatar, author/date, testo, attachment, composto da Avatar (`59:8`) + Icon Button esistenti | Basso | Alta |

**Precondizione:** nessuna. **Validazione:** confronto struttura slot con i rispettivi `.component.ts`; nessun confronto "before" perché sono creazioni, non patch.

## Batch 5 — Toast (REQ-008) — ✅ RISOLTO (nessuna decisione di codice necessaria)

Non è una patch pronta per `fix`. Prima di pianificarla serve una risposta a: il Toast deve diventare un **componente Lit dedicato** (richiederebbe scope di codice approvato separatamente, fuori perimetro di questa skill) oppure basta **documentare in Figma** il pattern già in uso in produzione (`sl-alert` con `.toast()` + stile Shadow/Large), senza toccare il codice? Finché non c'è risposta, resta `NEEDS_CODE_DECISION` / `QUESTION` e non entra in nessun batch di `fix`.

## Fuori piano (nessuna azione in questa fase)

- **REQ-009 (File Upload Item)**: nessuna patch — il master esiste già in A. Azione residua: verificare publish status di A (`getPublishStatusAsync` o conferma utente) prima della fase `adopt`, per sostituire le 15 istanze detached in B con vere instance pubblicate.
- **Adozione in File B**: tutte le modifiche sopra riguardano solo File A. L'aggiornamento delle istanze in B (incluse le 117 istanze annotate) avviene solo nella fase `adopt`, dopo pubblicazione manuale di A e approvazione separata.

## Approvazioni richieste

Indica quali batch approvi per passare a `fix` (puoi approvarne uno, alcuni o tutti, in qualsiasi ordine): **Batch 1** (slot body Dialog/Card/Detail Panel), **Batch 2** (Tab/Tab Group), **Batch 3** (Table column width + esempio cella), **Batch 4** (nuovi master Description List + Comment). Batch 5 non è approvabile in questa forma: richiede prima una risposta alla domanda di scope.
