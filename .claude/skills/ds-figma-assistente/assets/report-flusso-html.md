# {{FLUSSO}} — report conversione screenshot → HTML

Sorgente: `<screenshot_dir>/{{FLUSSO}}/` · Output: `<html_dir>/{{FLUSSO}}/` · Data: {{DATA}}

## 1. Il flusso in breve

<!-- 2-4 righe: chi è l'utente, cosa sta cercando di fare, in quanti passi. -->

| #   | Screenshot   | Pagina                       | Stato rappresentato            |
| --- | ------------ | ---------------------------- | ------------------------------ |
| 1   | `1-Nome.png` | [1-Nome.html](./1-Nome.html) | es. lista vuota, nessun filtro |

## 2. Layout (griglia 12 colonne)

<!-- Per ogni macro-regione: span di colonne a ≥1280 / 1024–1279 / <1024, e perché. -->

| Regione | ≥1280 | 1024–1279 | <1024 | Motivazione |
| ------- | ----- | --------- | ----- | ----------- |

## 3. Mappatura originale → DS

| Elemento legacy             | Componente DS | Variante / attributi                      | Code Connect | Motivazione                                                  |
| --------------------------- | ------------- | ----------------------------------------- | ------------ | ------------------------------------------------------------ |
| es. pulsante verde "Export" | `<prefisso>button`   | `variant="default"` + `prefix` `download` | CC           | Export non è un'azione primaria: un solo primary per regione |

## 4. ⚠️ Nuovi elementi (non coperti dal DS)

<!-- Tutto ciò che non è un componente DS e ha un aspetto visivo proprio: wrapper con fondo/bordo, override ::part,
     composizioni ricorrenti, icone non presenti in Figma. Se vuoto, scrivere "Nessuno". -->

| Elemento | Pagine | Perché il DS non basta | Come è composto ora | Proposta |
| -------- | ------ | ---------------------- | ------------------- | -------- |

## 5. Componenti senza Code Connect usati

<!-- Da cc_inventario.py: solo i componenti `no-CC` (non i `container`, che sono coperti dai genitori). In Figma andranno come istanze "staccate" o frame — da segnalare. "Nessuno" se vuoto. -->

## 6. Scostamenti dal legacy

<!-- Dato/azione spostato, raggruppato, rinominato, nascosto in overflow — mai eliminato. Ogni riga con motivazione. -->

| Legacy | Restyle | Motivazione (regola / reference) |
| ------ | ------- | -------------------------------- |

## 7. Domande aperte

<!-- Ambiguità funzionali da chiarire con il business/utente (es. "Progress e Cancel PVA sono batch action?"). -->
