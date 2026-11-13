# Skill per agenti AI

Questa cartella contiene le skill distribuite insieme alla libreria. Oggi ce n'è una:

| Skill                             | Per chi                                                         | Cosa fa                                                                                                                                                                 |
| --------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`saipem-ds`](saipem-ds/SKILL.md) | Chi **usa** la libreria in un'applicazione (HTML, Angular, Lit) | Insegna all'agente l'API reale del fork (non quella di Shoelace originale), le regole di design e i pattern, e fornisce un validatore che controlla il codice prodotto. |

La skill `ds-figma-assistente` in `.claude/skills/` resta uno strumento interno per chi **mantiene** il DS (flussi
DS ↔ Figma) e non viene pubblicata.

Il contenuto della skill è in inglese, come la documentazione dei componenti e i messaggi del validatore.

## Struttura

```
skills/saipem-ds/
├── SKILL.md                     scritto a mano: flusso di lavoro e regole principali
├── references/
│   ├── design-rules.md          scritto a mano (da DESIGN.md, senza riferimenti interni)
│   ├── patterns.md              scritto a mano (dai pattern di DECISIONS.md resi generici)
│   ├── catalog.md               generato
│   ├── fork-differences.md      generato
│   ├── tokens.md                generato
│   ├── angular.md               generato da docs/pages/frameworks/angular.md
│   └── components/<nome>.md     generato: API dal manifest + documentazione ed esempi
├── scripts/
│   ├── ds.mjs                   validatore e ricerca (validate, api, icons, tokens)
│   └── ds-api.json              generato: API compatta usata dal validatore
└── evals/                       casi di test (non pubblicati su npm)
```

I file generati **non vanno modificati a mano**: si cambia la sorgente (componente, JSDoc, pagina della
documentazione, tema) e si rigenera.

## Installarla in un progetto che usa la libreria

La skill è inclusa nel pacchetto (`skills/`), con la stessa versione dei componenti: `npm run build` la rigenera e
`npm pack` la mette nel `.tgz` (senza `evals/`). Nel progetto che usa la libreria, dopo
`npm install <percorso>/shoelace-style-shoelace-<versione>.tgz` si trova in
`node_modules/@shoelace-style/shoelace/skills/saipem-ds`.

**Claude Code** — collegamento simbolico, così segue sempre la versione installata:

```bash
mkdir -p .claude/skills
ln -s ../../node_modules/@shoelace-style/shoelace/skills/saipem-ds .claude/skills/saipem-ds
```

In alternativa, copia la cartella (`cp -R node_modules/@shoelace-style/shoelace/skills/saipem-ds .claude/skills/`) e
ricopiala a ogni aggiornamento della libreria.

**Altri agenti** (Copilot, Cursor…) — indica nelle loro istruzioni di progetto (`AGENTS.md`,
`.github/copilot-instructions.md`, …) di leggere `node_modules/@shoelace-style/shoelace/skills/saipem-ds/SKILL.md`
prima di scrivere markup `sl-*` e di eseguire il validatore.

Il validatore funziona anche senza agente, per esempio in CI o in un hook di pre-commit:

```bash
node node_modules/@shoelace-style/shoelace/skills/saipem-ds/scripts/ds.mjs validate src/app
```

## Manutenzione (in questo repository)

| Comando                | Cosa fa                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`        | Build completa; alla fine rigenera anche la skill.                                                                                     |
| `npm run skills:build` | Rigenera solo i file generati (serve una build già fatta, legge `dist/`).                                                              |
| `npm run skills:test`  | Verifica il validatore: 23 casi di allucinazioni tipiche più casi corretti, e gli snippet dei pattern. Non usa modelli, va bene in CI. |
| `npm run skills:eval`  | Esegue i casi di `evals/` con Claude Code e li valuta col validatore. **Sessioni reali, a pagamento.**                                 |

Quando si aggiunge o si modifica un componente:

1. si aggiorna il componente e la sua pagina in `docs/pages/components/`;
2. `npm run build` (o `npm run skills:build`) rigenera riferimenti, catalogo, differenze dal fork e dati del
   validatore;
3. se il componente introduce un pattern nuovo, va aggiunto a mano in `references/patterns.md` (e verificato con
   `npm run skills:test`).

### Differenze dal fork

`fork-differences.md` e gli avvisi "Only in Saipem DS" / "Customized in Saipem DS" nelle pagine dei componenti
nascono dal confronto con [`scripts/skills/upstream-baseline.json`](../scripts/skills/upstream-baseline.json), un'istantanea
dell'API di Shoelace 2.20.1 (commit `25bd8ec7`, l'ultimo prima del fork). Va rigenerata solo se il fork viene
riallineato a una versione più recente di Shoelace: le istruzioni sono in cima a
[`scripts/skills/make-upstream-baseline.mjs`](../scripts/skills/make-upstream-baseline.mjs).

## Eval

Gli eval misurano se la skill evita le allucinazioni. Ogni caso in `evals/<nome>/` ha:

- `prompt.md` — la richiesta, come la scriverebbe uno sviluppatore;
- `case.yaml` — il risultato atteso;
- `graders/*.md` — le affermazioni da verificare, una per file, giudicate da un modello;
- `files/` + `place-files.sh` — eventuali file di partenza.

In più `evals/checks.json` definisce per ogni caso i controlli deterministici sui file prodotti: devono esistere,
passare il validatore senza errori e contenere (o non contenere) certi pattern.

Ci sono due modi per eseguirli, entrambi con sessioni reali a pagamento:

```bash
# Runner deterministico: con la skill e, con --baseline, anche senza, per misurare la differenza
npm run skills:eval -- --baseline
npm run skills:eval -- --case angular-documents-table --runs 3 --keep

# CLI di Claude Code: confronto con e senza skill e grader LLM. --no-publish evita che il report
# venga pubblicato su claude.ai, che altrimenti è il comportamento predefinito.
claude plugin eval skills/saipem-ds --allow-tools Write,Edit,Bash --scaffold --no-publish
```

`evals/trigger-queries.json` contiene 20 richieste (10 che devono attivare la skill, 10 simili che non devono) per
verificare e ottimizzare la `description` della skill con la skill `skill-creator`.

I risultati finiscono in `evals/results/`, esclusa da git.
