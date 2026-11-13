---
tags: [saipem-ds]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Crea `src/app/revision-form.component.ts`: form reattivo Angular per "Create new revision" con Revision code (obbligatorio), Issuing description (select obbligatoria) e Content type. Mostra l'errore sui campi non validi e disabilita Create revision finché il form non è valido.
