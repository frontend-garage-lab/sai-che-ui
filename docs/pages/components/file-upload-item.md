---
meta:
  title: File Upload Item
  description: File upload items show a single file's upload status in a list, e.g. waiting, uploading, uploaded or failed.
layout: component
---

Pair it with [sl-file-drop](/components/file-drop) to show the progress of each selected file below the drop zone.
`sl-file-drop` doesn't upload anything itself, so you're in control of driving each item's `state` and `progress` as
the upload runs.

```html:preview
<sl-file-upload-item state="waiting" filename="H10-RD-A-87166_A2_A.pdf" meta="Waiting to upload"></sl-file-upload-item>
```

## Examples

### States

`state` can be `waiting`, `uploading`, `uploaded` or `failed`. Each one has its own icon and colors; `uploading` also
shows a progress bar driven by the `progress` attribute (0 to 100), and `failed` adds a retry button.

```html:preview
<div class="file-upload-item-states">
  <sl-file-upload-item state="waiting" filename="H10-RD-A-87166_A2_A.pdf" meta="Waiting to upload"></sl-file-upload-item>
  <sl-file-upload-item
    state="uploading"
    filename="H10-RC-B-21213_A1_R.pdf"
    meta="45% · Uploading"
    progress="45"
  ></sl-file-upload-item>
  <sl-file-upload-item
    state="uploaded"
    filename="R1118111-SARC01-A.pdf"
    meta="2.4 MB · Uploaded"
  ></sl-file-upload-item>
  <sl-file-upload-item
    state="failed"
    filename="H10-RC-B-21214_A1_I.pdf"
    meta="Upload failed · Connection lost"
  ></sl-file-upload-item>
</div>

<style>
  .file-upload-item-states {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-small);
  }
</style>
```

### With a file drop

A common pattern: files appear in the `waiting` state as soon as they're picked, move to `uploading` while the
request is in flight, then settle into `uploaded` or `failed`.

```html:preview
<div class="file-upload-item-demo">
  <sl-file-drop label="Attachments" hint="PDF up to 10 MB" multiple></sl-file-drop>
  <div class="file-upload-item-demo__list"></div>
</div>

<script>
  const container = document.querySelector('.file-upload-item-demo');
  const fileDrop = container.querySelector('sl-file-drop');
  const list = container.querySelector('.file-upload-item-demo__list');

  fileDrop.addEventListener('sl-change', () => {
    const newFiles = fileDrop.files.slice(list.children.length);
    fileDrop.hideFileList = true;

    newFiles.forEach(file => {
      const item = document.createElement('sl-file-upload-item');
      item.state = 'uploading';
      item.filename = file.name;
      item.progress = 0;
      item.meta = '0% · Uploading';
      list.append(item);

      const timer = setInterval(() => {
        item.progress = Math.min(item.progress + 20, 100);
        item.meta = `${item.progress}% · Uploading`;

        if (item.progress === 100) {
          clearInterval(timer);
          item.state = 'uploaded';
          item.meta = 'Uploaded';
        }
      }, 400);
    });
  });

  list.addEventListener('sl-remove', event => {
    event.target.remove();
  });
</script>

<style>
  .file-upload-item-demo__list {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-small);
    margin-top: var(--sl-spacing-small);
  }
</style>
```

### Retrying a failed upload

Listen for `sl-retry` to re-run the upload for that item.

```html:preview
<sl-file-upload-item
  class="file-upload-item-retry"
  state="failed"
  filename="H10-RC-B-21214_A1_I.pdf"
  meta="Upload failed · Connection lost"
></sl-file-upload-item>

<script>
  const item = document.querySelector('.file-upload-item-retry');

  item.addEventListener('sl-retry', () => {
    item.state = 'uploading';
    item.progress = 0;
    item.meta = '0% · Uploading';

    const timer = setInterval(() => {
      item.progress = Math.min(item.progress + 25, 100);
      item.meta = `${item.progress}% · Uploading`;

      if (item.progress === 100) {
        clearInterval(timer);
        item.state = 'uploaded';
        item.meta = 'Uploaded';
      }
    }, 400);
  });
</script>
```

### Localization

Use `retry-label` and `remove-label` to translate the action buttons.

```html:preview
<sl-file-upload-item
  state="failed"
  filename="H10-RC-B-21214_A1_I.pdf"
  meta="Caricamento non riuscito · Connessione persa"
  retry-label="Riprova"
  remove-label="Rimuovi"
></sl-file-upload-item>
```
