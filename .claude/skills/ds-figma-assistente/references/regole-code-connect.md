# Regole Code Connect: classi di bug e verifiche

Classi di bug trovate nelle verifiche precedenti. Le classi segnate *(script)* le trova `cc_inventario.py`; le altre
vanno controllate a mano.

| # | Classe | Esempio | Come si trova |
| --- | --- | --- | --- |
| 1 | **Valore semantico non emesso**: `getEnum('State')` calcola solo `disabled` ma non `checked`/`selected`/`open` | radio-button: cambiando variante in Dev Mode lo snippet non cambiava | *(script, con --figma)* + controllo nel sorgente: `@property({reflect:true})` va emesso; `@state()` interno o gestito dal genitore no |
| 2 | **Tipo sbagliato**: `getBoolean` su una VARIANT `true/false`, `getInstanceSwap` su un BOOLEAN | tree-item `Expanded`, card `Image`, dialog `Header Actions` | *(script, con --figma)*: `tsc` e `figma connect parse` **non** lo vedono |
| 3 | **getEnum non esaustivo**: un valore di Figma non è mappato e restituisce `undefined` | progress-bar `indeterminate`, checkbox `indeterminate` | *(script, con --figma)* |
| 4 | **URL obsoleto**: il nodo è stato ricreato (delete + create) e ha un node-id nuovo | 16 icone sostituite: publish con URL vecchi, fallito senza errori | *(script, con --figma)*; dopo ogni delete + create, `grep` del vecchio id **prima** del publish |
| 5 | **Componenti senza template**: tipicamente le icone | 56 icone senza `.figma.ts`: `prefix`/`suffix` non producevano codice | confronta l'elenco dei componenti del DS con i template |
| 6 | **Slot con istanze mappate → segnaposto** (`<Items />`) | menu, header, sidebar, tree, dialog footer | `getSlot(...)`: rendi `connectedInstances` con `executeTemplate()` e lascia il segnaposto come fallback |
| 7 | **getSlot su uno slot che in quella variante non esiste** → `Missing snippet for undefined` | sidebar-group `Collapsed=true` | condiziona la chiamata alla variante |
| 8 | **Variante non mappata** che corrisponde a un attributo reale | stat `State=disabled` | *(script, parziale)* + confronto con le `@property` |
| 9 | **Attributi o slot emessi che il componente non ha** | binding a un attributo inesistente | confronto con manifest / `@property` / `@slot` |
| 10 | **Stile al posto dell'attributo**: il componente non ha una prop, ma Figma ha una variante | spinner `Size` → `style="font-size: …"` | ammesso se documentato nel template |

## Non-problemi (non riaprirli)

- Gli pseudo-stati CSS (`hover`, `focus`, `active` sui bottoni) **non** sono attributi: è giusto non emetterli.
- Stati interni (`@state()`) o gestiti dal genitore (es. `checked` di un radio gestito dal gruppo): l'omissione è
  corretta.
- Il codice supporta più valori di Figma (es. tooltip `left`/`right`): non è un errore del template.
- `get_code_connect_map` può riportare `hasTemplate: false` anche per mapping a template: non è un errore.
- Slot a contenuto libero (Body di card, dialog, drawer) mostrano un segnaposto inevitabile.

## Publish e aggiornamenti

- Validazione locale: `npx tsc -p <dir>` e `npx figma connect parse`. Nessuno dei due verifica i tipi reali in
  Figma.
- Le mappature create con l'MCP (`send_code_connect_mappings`) **non si sovrascrivono** con l'MCP ("already
  mapped"): per aggiornarle usa `npx figma connect publish` con il token, oppure scollega prima in Figma.
- Il publish lo lancia l'utente: `! FIGMA_ACCESS_TOKEN=… npx figma connect publish` (`--dry-run` per provare).
- Verifica dopo il publish: `get_code_connect_map` sui nodi toccati.
- Le mappature vanno sul **COMPONENT_SET**, non sulla singola variante.
- Il layer di testo letto da `findText` deve esistere con quel nome in **tutte** le varianti: se i nomi cambiano tra
  varianti, usa un helper che prova più nomi.
