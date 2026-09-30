---
meta:
  title: File Drop
  description: File drops let users pick files by dragging them onto a zone or by browsing.
layout: component
---

The whole zone is a button: users can click it, focus it and press <kbd>Enter</kbd>, or drop files onto it. The picked
files are available in the `files` property and are listed under the zone.

```html:preview
<sl-file-drop label="Attachments" hint="PDF, DOCX or DWG, up to 20 MB" multiple></sl-file-drop>
```

## Examples

### Accepting files

`accept` takes the same format as a file input: extensions, MIME types or wildcards. Files that don't match, that are
larger than `max-file-size` (in bytes) or that go over `max-files` are turned away, and `sl-file-reject` tells you which
ones and why. Show the reasons to the user, e.g. in an [alert](/components/alert).

```html:preview
<div class="file-drop-rules">
  <sl-file-drop
    label="Attachments"
    hint="PDF or DOCX, up to 1 MB, at most 3 files"
    accept=".pdf,.docx"
    max-file-size="1048576"
    max-files="3"
    multiple
  ></sl-file-drop>

  <sl-alert variant="danger" closable style="margin-top: 1rem;">
    <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
    <span class="file-drop-rules__message"></span>
  </sl-alert>
</div>

<script>
  const container = document.querySelector('.file-drop-rules');
  const fileDrop = container.querySelector('sl-file-drop');
  const alert = container.querySelector('sl-alert');
  const reasons = { type: 'file type not allowed', size: 'larger than 1 MB', count: 'too many files' };

  fileDrop.addEventListener('sl-file-reject', event => {
    alert.querySelector('.file-drop-rules__message').textContent = event.detail.rejections
      .map(({ file, reason }) => `${file.name}: ${reasons[reason]}`)
      .join(' · ');
    alert.show();
  });
</script>
```

### Single file

Without `multiple`, each new file replaces the previous one. Use it for things like importing the signed version of a
letter.

```html:preview
<sl-file-drop label="Signed version" hint="PDF only" accept=".pdf,application/pdf"></sl-file-drop>
```

### Uploading

The file drop doesn't upload anything itself. Listen for `sl-change`, read `files`, and call `clear()` once the upload
has finished.

```html:preview
<div class="file-drop-upload">
  <sl-file-drop label="Attachments" multiple></sl-file-drop>
  <sl-button variant="primary" style="margin-top: 1rem;" disabled>Upload</sl-button>
</div>

<script>
  const container = document.querySelector('.file-drop-upload');
  const fileDrop = container.querySelector('sl-file-drop');
  const button = container.querySelector('sl-button');

  fileDrop.addEventListener('sl-change', () => {
    button.disabled = fileDrop.files.length === 0;
  });

  button.addEventListener('click', async () => {
    button.loading = true;
    // Replace with your upload, e.g. a fetch() with a FormData body
    await new Promise(resolve => setTimeout(resolve, 1000));
    button.loading = false;
    button.disabled = true;
    fileDrop.clear();
  });
</script>
```

### Localization

Use the `instructions` slot to translate the text inside the zone, and `remove-label` for the remove buttons.

```html:preview
<sl-file-drop label="Allegati" hint="PDF o DOCX, massimo 20 MB" remove-label="Rimuovi" multiple>
  <span slot="instructions"><strong>Sfoglia</strong> o trascina qui i file</span>
</sl-file-drop>
```

### Disabled

```html:preview
<sl-file-drop label="Attachments" hint="Check in the document to add attachments" disabled></sl-file-drop>
```
