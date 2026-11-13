---
tags: [saipem-ds]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Add an "Upload files" dialog to `upload-dialog.html`: users drop up to 5 PDF files (max 10 MB each), see each file's upload progress with retry on failure, then confirm with Upload.
