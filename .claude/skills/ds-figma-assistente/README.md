# ds-figma-assistente — guida per chi la mantiene

Questa guida è per chi modifica la skill. Claude non la carica: legge `SKILL.md` e, quando servono, i file in
`references/`. La struttura segue la specifica [agentskills.io](https://agentskills.io/specification).

## Come funziona

```
/ds-figma-assistente [argomento]
        │
        ├─ Passo 0: scripts/config.py show → config.local.json (dati del progetto)
        ├─ Passo 1: menu AskUserQuestion (2 livelli, max 4 opzioni ciascuno)
        └─ flusso scelto → references/flusso-N-*.md (caricato solo in quel momento)
```

Tre livelli di caricamento (progressive disclosure):

1. **`name` + `description`** (frontmatter): sempre in contesto. Servono a Claude per capire *quando* usare la
   skill, quindi devono contenere le frasi che diresti tu ("verifica code connect", "porta la pagina in Figma"…).
2. **`SKILL.md`**: si carica quando la skill parte. Contiene menu, smistamento e regole comuni. Tienilo sotto le
   500 righe.
3. **`references/`, `scripts/`, `assets/`**: si leggono solo quando un flusso li richiede.

## Mappa dei file

| File | A cosa serve | Quando modificarlo |
| --- | --- | --- |
| `SKILL.md` | menu, tabella dei flussi, regole comuni, chiusura | aggiungere un flusso, cambiare una regola che vale ovunque |
| `references/configurazione.md` | significato dei campi di configurazione e come trovarli | aggiungere un campo |
| `references/flusso-1-code-connect.md` | verifica template ↔ Figma ↔ codice | nuovi controlli Code Connect |
| `references/flusso-2-screenshot-html.md` | schermate → HTML con componenti DS; avvio/creazione server (§1.0); skill di design `impeccable` vincolata al DS (§2b) | cambia il modo di generare le pagine |
| `references/flusso-3-html-figma.md` | HTML → Figma, gap DS, fix del master, publish, aggiornamento del design | cambia la procedura Figma |
| `references/flusso-4-audit-componenti.md` | audit dei componenti con i gate | nuovi errori ricorrenti |
| `references/flusso-5-annotazioni.md` | annotazioni Dev Mode → backlog | nuove classi di richiesta |
| `references/flusso-6-pagine-doc.md` | pagine di documentazione dei componenti in Figma | cambia il modello di pagina |
| `references/flusso-8-nuovo-componente.md` | componente nuovo del codice → master Figma + pagina doc + Code Connect | cambia la struttura dei componenti o delle pagine |
| `references/flusso-7-release-adozione.md` | publish libreria / Code Connect / consumer | cambia il processo di rilascio |
| `references/regole-figma.md` | Plugin API: ricette e problemi noti | **ogni volta che scopri un problema generale** |
| `references/regole-code-connect.md` | classi di bug dei template | **ogni nuova classe di bug** |
| `references/regole-html-ds.md` | regole per HTML "pronto per Figma" | nuove regole generali di markup |
| `references/quality-gate.md` | G01–G12, R01–R08, confronto visivo | nuovi gate |
| `scripts/config.py` | legge, valida e salva `config.local.json` | nuovi campi obbligatori (`RICHIESTI`) |
| `scripts/cc_inventario.py` | controlli statici e con proprietà Figma sui template | automatizzare una classe di bug |
| `scripts/stato_pagine.py` | stato screenshot → HTML → Figma | — |
| `scripts/lint_html.py` | lint delle pagine contro il manifest | nuove regole di lint |
| `scripts/check_release_manifest.py` | preflight della release (fail-closed) | — |
| `scripts/compare_visuals.py` | confronto PNG facoltativo (richiede Pillow) | — |
| `assets/server-anteprima.mjs` | server statico senza dipendenze, copiato nel progetto se manca un server | — |
| `assets/*` | modelli di config, report, registro pagine, pagina HTML | cambiare il formato dei report |
| `config.local.json` | **i dati di questo progetto** (gitignorato) | con `config.py set` |

## Generico e specifico

- Nei file della skill vanno solo **regole generali**, valide per qualunque DS.
- Tutto ciò che vale solo per un progetto (file key, nomi dei componenti, pagine di riferimento, decisioni di
  design) va in `config.local.json` o in file `.md` del repository elencati in `riferimenti_progetto`.

In questo repository `riferimenti_progetto` punta a `DESIGN.md`, allo storico delle verifiche Code Connect, ai reference della skill `rebranding`
(mappatura HTML → Figma, figma-build, design rules, pattern legacy, inventario componenti, mappa Code Connect) e a
`DECISIONS.md`. La conoscenza accumulata finora resta dov'è e viene riusata, senza duplicarla.

## Ricette di modifica

**Aggiungere un flusso**

1. Crea `references/flusso-8-<nome>.md` con: obiettivo, input, passi, verifica, output, flusso successivo.
2. In `SKILL.md` aggiungi una riga alla tabella **Flussi** e, se serve, un'opzione al menu. Ogni domanda ha al massimo
   4 opzioni: se sono piene, aggiungi un terzo livello o un argomento diretto.
3. Se il flusso richiede dati nuovi, aggiungili a `assets/config.esempio.json`, a `references/configurazione.md` e a
   `RICHIESTI` in `scripts/config.py`.
4. Aggiungi all'`argument-hint` del frontmatter l'argomento nuovo e alla `description` le frasi con cui lo chiederai.

**Aggiungere un controllo Code Connect automatico**: in `cc_inventario.py`, dentro il ciclo sui template, chiama
`add('P0'|'P1'|'P2', t, riga, 'messaggio')`. Poi documenta la classe in `regole-code-connect.md`.

**Aggiungere una regola appresa da un errore**: se è generale va in `regole-*.md`, se è del progetto va nel
reference di progetto. Scrivi il caso reale in una riga ("caso X, data"): aiuta a capire quando la regola si applica.

## Usarla in un altro progetto

1. Copia `ds-figma-assistente/` in `.claude/skills/` (oppure in `~/.claude/skills/` per averla in tutti i
   progetti), **senza** `config.local.json`.
2. Avvia `/ds-figma-assistente configura`.
3. Scrivi le regole specifiche del nuovo progetto in un `.md` e aggiungilo a `riferimenti_progetto`.

## Validazione

```bash
npx skills-ref validate .claude/skills/ds-figma-assistente   # oppure: pip install skills-ref
python3 .claude/skills/ds-figma-assistente/scripts/config.py show
python3 .claude/skills/ds-figma-assistente/scripts/cc_inventario.py --solo-riepilogo
```

Vincoli della specifica: `name` in minuscolo con trattini, uguale al nome della cartella, al massimo 64 caratteri;
`description` al massimo 1024 caratteri; riferimenti ai file con percorsi relativi, a un solo livello da
`SKILL.md`.
