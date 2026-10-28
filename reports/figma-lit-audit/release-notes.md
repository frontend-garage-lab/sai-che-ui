# Release Saipem DS — 2026-10-28 (ds-2026-10-28-001)

Correzioni in-place (id e key invariati) emerse dal porting di xCPage-DistributionMatrices, più le icone nuove.

- **Select** — tag reali nello slot `Tags` (Tag removable, a capo), booleano `Show Placeholder`; spazi prima di clear e
  freccia e dimensioni delle icone come nel codice. Il campo cresce con le righe di tag.
- **Button** — spaziature di prefisso/suffisso/caret come `button.styles.ts`, icone 12/14/16, label Medium (500).
  Le larghezze cambiano di qualche px (in genere +2 per il bordo).
- **Table Cell** — titolo `document` in Medium (500).
- **File Drop** — `Show Hint`, `Show Help Text` (layer `help-text`), label `Label/Form`. Template Code Connect aggiornato.
- **File Upload Item** — interlinea 150%: altezza 59 come nel codice.
- **Icone** — 19 `Icon/<nome>` nuove (vedi `icone-pulsanti-tab-2026-10-28.md`).

Rollback: ripristino della versione precedente dalla cronologia del file Saipem DS e nuovo publish.
