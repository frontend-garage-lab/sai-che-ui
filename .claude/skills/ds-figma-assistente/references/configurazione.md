# Configurazione del progetto

La skill è generica: tutto ciò che dipende dal progetto (cartelle, file Figma, porte, prefisso dei tag, regole
specifiche) sta in `config.local.json`, nella cartella della skill. Il file è ignorato da git (`.gitignore`) e
contiene solo riferimenti non segreti. Il modello è in `assets/config.esempio.json`.

## Campi

| Chiave | Significato | Come trovarla da solo |
| --- | --- | --- |
| `progetto.nome` | Nome leggibile, usato nei report | `package.json` → `name` |
| `codice.componenti_dir` | Cartella dei componenti | cartelle con `*.component.ts` o `customElements.define` |
| `codice.prefisso_tag` | Prefisso dei tag (`sl-`, `ds-`…) | `tagName` nel manifest, `@customElement('…')` |
| `codice.manifest` | Custom Elements Manifest | `custom-elements-manifest.config.js`, `dist/custom-elements.json` |
| `codice.doc_componenti` | Documentazione dei componenti (una pagina per componente) | `docs/**/components/` |
| `codice.comando_build` | Comando che rigenera il manifest | script `build` in `package.json` |
| `code_connect.dir` | Cartella dei template `.figma.ts` / `.figma.js` | `figma.config.json` → `include` |
| `code_connect.config` | File di configurazione di Code Connect | `figma.config.json` |
| `code_connect.validazione` | Comandi di controllo senza publish | `npx tsc -p <dir>` se c'è un tsconfig, `npx figma connect parse` |
| `code_connect.publish` | Comando di publish (lo lancia l'utente col suo token) | `npx figma connect publish` |
| `figma.ds_url` | **File A**: libreria del Design System | commento `// url=` nei template Code Connect |
| `figma.progetto_url` | **File B**: file di progetto con le schermate e le annotazioni | da chiedere |
| `figma.progetto_pagina_id` | Pagina del file B dove vanno le schermate | da chiedere o leggere con `get_metadata` |
| `figma.pagina_doc_riferimento` | Pagina del file A con la documentazione di un componente già fatto, da usare come modello (flussi 6 e 8) | da chiedere, o la pagina indicata nei report di avanzamento |
| `figma.library_key` | Library key per `search_design_system` | da `get_libraries` sul file B |
| `anteprima.base_url` | Server che serve le pagine HTML generate | script `serve`/`demo` in `package.json` o `scripts/` |
| `anteprima.comando_avvio` | Comando per avviarlo | idem |
| `anteprima.docs_url` | Sito della documentazione con i componenti renderizzati | script `start`/`dev` |
| `percorsi.screenshot_dir` | Input del flusso 2: cartelle di schermate, una per flusso applicativo | cartelle con molte `.png` |
| `percorsi.html_dir` | Output del flusso 2 e input del flusso 3 | da chiedere |
| `percorsi.report_dir` | Dove la skill scrive report e backlog | default `reports/ds-figma` |
| `percorsi.registro_pagine` | JSON con lo stato delle pagine portate in Figma | default `<report_dir>/registro-pagine.json` |
| `riferimenti_progetto` | Elenco di file `.md` con regole specifiche del progetto (mappature HTML→Figma, gotcha, pattern) | report e reference di skill precedenti |
| `preferenze.lingua_contenuti` | Lingua dei testi in Figma/HTML (`en`, `it`) | da chiedere |
| `preferenze.playwright_autorizzato` | `true` se l'utente ha autorizzato screenshot automatici del browser | da chiedere, default `false` |
| `preferenze.viewport_html` | Viewport di riferimento per screenshot e misure | default `1600x1000` |

## Procedura

1. `python3 <skill>/scripts/config.py show`. Se lo stato è `OK` per il flusso scelto, mostra in 3-4 righe i
   riferimenti che userai e prosegui.
2. Se manca: **prima cerca nel repository** (colonna destra), poi prepara una proposta completa.
3. Fai **una sola richiesta** con AskUserQuestion o in chat: elenca i valori trovati, da confermare, e quelli da
   fornire. Per le cartelle proponi le candidate trovate come opzioni.
4. Salva:
   ```bash
   python3 <skill>/scripts/config.py init
   python3 <skill>/scripts/config.py set progetto.nome="…" figma.ds_url="https://…" percorsi.html_dir="…"
   python3 <skill>/scripts/config.py set 'riferimenti_progetto=["path/a.md","path/b.md"]'
   ```
   I valori JSON (liste, `true`/`false`, `null`) si passano come JSON. Per cambiare un URL Figma già salvato serve
   la conferma dell'utente e `--replace`.
5. Verifica che i riferimenti funzionino davvero. Un URL scritto bene non dimostra che il file sia accessibile:
   - file A e B: `create_session` + `get_metadata` (titolo del file) e controllo che le fileKey siano diverse;
   - anteprima: `curl -s -o /dev/null -w '%{http_code}' <base_url>` deve rispondere 200; se non risponde, chiedi se
     avviare `comando_avvio` in background;
   - cartelle: devono esistere (l'output si può creare, previa conferma).
6. Conferma all'utente: progetto, file A (titolo + key), file B (titolo + key), anteprima raggiungibile, cartelle,
   riferimenti di progetto caricati.

## Non chiedere mai

Token, password, cookie, file `.env`. L'autenticazione Figma passa da OAuth dell'MCP. Il token per
`figma connect publish` lo usa l'utente nel suo terminale.

## Portare la skill su un altro progetto

1. Copia la cartella `ds-figma-assistente/` in `.claude/skills/` del nuovo repository, senza `config.local.json`.
2. Lancia `/ds-figma-assistente configura`: la skill trova da sola quasi tutti i campi.
3. Se il progetto ha regole proprie (mappature tag→componente, pattern di pagina), scrivile in uno o più `.md` del
   repository e aggiungile a `riferimenti_progetto`, invece di modificare i reference generici della skill.
