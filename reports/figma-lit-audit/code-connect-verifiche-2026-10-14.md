# Verifiche Code Connect — 2026-10-14 (storico)

Ex `instruction.md` della root, spostato qui il 2026-10-27. Le regole operative ora sono in `.claude/rules/code-connect.md` (caricata quando si toccano i file `figma/*.figma.ts`) e in `.claude/skills/ds-figma-assistente/references/regole-code-connect.md`. Questo file resta come registro di cosa è stato verificato e perché.


## Classe di bug da ricontrollare sistematicamente nei file Code Connect (`figma/*.figma.ts`)

Trovato il 2026-10-14: un file mappava la property Figma `State` per calcolare solo `disabled`, ma **non esponeva anche il valore semantico positivo** (es. `checked`), quindi cambiare variante in Figma Dev Mode non aggiornava lo snippet di codice per quel valore.

Pattern di verifica per ogni `getEnum('State', {...})` in `figma/*.figma.ts`:
1. Elenca tutti i valori della variante `State` in Figma (es. `unchecked`, `checked`, `disabled`).
2. Per ogni valore che non sia semplicemente "disabled" o un pseudo-stato CSS (`hover`, `focus`, `active` sul pulsante — questi non sono attributi HTML impostabili, sono stati del browser), verifica nel sorgente del componente (`src/components/<nome>/<nome>.component.ts`) se esiste una **vera `@property` riflessa** con lo stesso significato (es. `checked`, `selected`, `expanded`, `open`).
3. Se esiste, deve essere estratta con un proprio `getEnum`/`getBoolean` E inclusa nel template `example` — non basta che esista una variabile `disabled` che la referenzia indirettamente.
4. Se invece è `@state()` interno (non `@property`), o è gestita dal genitore (es. `sl-radio.checked` gestito da `sl-radio-group`), l'omissione è corretta — non aggiungere nulla.

Componenti con pattern simile da ricontrollare uno per uno: `checkbox`, `switch`, `menu-item`, `tab`, `tree-item`, `stat`, `selectable-item`, `details`, `header-item`, `file-upload-item`, `copy-button`, `file-drop`, `option`, `step`, `table-row`. (I bottoni — `button*`, `icon-button` — hanno solo pseudo-stati CSS su `State`, non serve ricontrollarli per questo pattern specifico.)

**Verifica eseguita il 2026-10-14**: tutti e 14 ricontrollati contro il sorgente reale (`@property(reflect:true)` vs `@state()`). Nessun altro bug trovato — il caso `radio-button` era isolato. Dettaglio: `copy-button` (success/error), `file-drop` (dragging), `option` (current/selected/hasHover), `step` (current/complete/upcoming) e `table-row` (selected) sono tutti `@state()` interni o gestiti dal genitore — l'omissione in quei file è corretta, non serve intervenire. Tutti gli altri (`checkbox`/`switch`/`menu-item`.`checked`, `tab`.`active`, `tree-item`.`expanded`+`selected`, `stat`/`selectable-item`/`header-item`.`selected`-`checked`-`current`, `details`.`open`, `file-upload-item`.`state`) erano già mappati correttamente. Questa classe di bug può considerarsi chiusa per l'intero DS, salvo nuove property aggiunte in futuro.

## Altre classi di bug trovate il 2026-10-14 (seconda verifica, su richiesta esplicita dell'utente)

1. **Icone senza Code Connect**: 56 componenti "Icon/\<nome\>" nella pagina Icons non avevano alcun file `.figma.ts`. Quando `prefix`/`suffix` di altri componenti risolvono a un'icona (il caso più comune), `executeTemplate()` non aveva nulla da eseguire. Creati 56 file `icon-<nome>.figma.ts` (pattern identico, solo nome icona e node-id cambiano — vedi script generatore se servisse rigenerarli).

2. **`getEnum`/`getBoolean` non esaustivi**: `progress-bar` (valore `indeterminate` mancante nell'enum `Value`), `checkbox` (valori `indeterminate`/`indeterminate-hover` mancanti in `State`), `details` (valore `disabled` mancante in `State`, produceva `undefined` invece di `false`/`true`).

3. **Tipo property sbagliato (`getBoolean` su una property che in realtà è `VARIANT` true/false, non `BOOLEAN`)**: `tree-item`.`Expanded` e `radio-button`.`Pill`. Questo bug **non viene rilevato né da `tsc` né da `figma connect publish --dry-run`** (entrambi validano solo sintassi/struttura, non il tipo runtime della property Figma) — va controllato manualmente confrontando `getBoolean(X)`/`getEnum(X, ...)` con il tipo reale restituito da `componentPropertyDefinitions[X].type` in Figma.

**Metodo di verifica usato**: per ogni `getBoolean('Nome')` nei file `figma/*.figma.ts`, controllare via Plugin API (`node.componentPropertyDefinitions['Nome#id'].type`) che sia davvero `"BOOLEAN"` e non `"VARIANT"` con opzioni `["true","false"]` — pattern frequente in questo DS per proprietà puramente cosmetiche/di stato (es. `Expanded`) rispetto a proprietà che pilotano un `visible` binding su un figlio (che **devono** essere `BOOLEAN`, è un vincolo della Plugin API — questo dà un'euristica forte: se la property controlla la visibilità di un elemento figlio, sarà quasi certamente `BOOLEAN`; se è solo informativa/di stato senza alcun figlio da mostrare/nascondere, verificarla esplicitamente).

## Regola operativa trovata il 2026-10-14 — sostituire contenuto di un componente Figma cambia sempre il node-id

Quando si sostituisce il **contenuto** di un componente (es. il vettore di un'icona) con la tecnica delete-old + `figma.createComponentFromNode()`-new (invece di editare i figli esistenti in-place), Figma assegna **sempre un node-id nuovo**, anche se il `name` del componente resta identico. Qualunque file `figma/*.figma.ts` il cui commento `// url=...node-id=<ID>` referenzi quel nodo diventa **stale** e punta a un nodo ormai cancellato.

**Prima di far eseguire `figma connect publish` all'utente dopo un'operazione delete+create su un componente**, cercare (`grep -rn "node-id=<vecchio-id con - al posto di :>"` in `figma/`) tutti i file che referenziano il vecchio ID e aggiornarli con il nuovo. Non farlo dopo: il publish con URL stale fallisce silenziosamente o non aggiorna il mapping, e il dry-run non lo cattura nella sessione agente perché richiede un token Figma che l'agente non ha.

Caso reale: sostituite 16 icone fake (`text-bold`, `caret`, ecc.) con vettori Bootstrap reali via delete+create; i 16 file `figma/icon-<nome>.figma.ts` corrispondenti sono rimasti con l'URL del nodo vecchio fino a dopo che l'utente aveva già fatto un publish — scoperto solo in verifica successiva. Corretto retroattivamente e richiesto nuovo publish.
