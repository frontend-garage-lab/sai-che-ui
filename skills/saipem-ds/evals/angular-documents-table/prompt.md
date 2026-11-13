---
tags: [saipem-ds]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

I need an Angular component `src/app/documents-table.component.ts` that shows our project documents in a table: columns Document (name with code and revision underneath), Discipline, Status and Issue date. Users can select multiple rows; with a selection they can Download or Send for review from a toolbar. Rows past their deadline must stand out. Show something useful when there are no results.
