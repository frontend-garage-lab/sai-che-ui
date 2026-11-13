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

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/file-upload-item/file-upload-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-file-upload-item-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-file-upload-item state="waiting" filename="H10-RD-A-87166_A2_A.pdf" meta="Waiting to upload"></sl-file-upload-item>
  `
})
export class FileUploadItemExampleComponent {}
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

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/file-upload-item/file-upload-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-file-upload-item-states-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .file-upload-item-states {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-small);
      }
  `,
  template: `
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
  `
})
export class FileUploadItemStatesExampleComponent {}
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

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/file-drop/file-drop.js';
import '@saipem/design-system/%NPMDIR%/components/file-upload-item/file-upload-item.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, viewChild } from '@angular/core';
import type SlFileDrop from '@saipem/design-system/%NPMDIR%/components/file-drop/file-drop.component.js';

interface Upload {
  id: number;
  filename: string;
  state: 'uploading' | 'uploaded';
  progress: number;
  meta: string;
}

@Component({
  selector: 'app-file-upload-item-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .list {
      display: flex;
      flex-direction: column;
      gap: var(--sl-spacing-small);
      margin-top: var(--sl-spacing-small);
    }
  `,
  template: `
    <sl-file-drop #drop label="Attachments" hint="PDF up to 10 MB" multiple hideFileList (sl-change)="onChange()">
    </sl-file-drop>

    <div class="list">
      @for (upload of uploads(); track upload.id) {
        <sl-file-upload-item
          [state]="upload.state"
          [filename]="upload.filename"
          [progress]="upload.progress"
          [meta]="upload.meta"
          (sl-remove)="remove(upload.id)"
        ></sl-file-upload-item>
      }
    </div>
  `
})
export class FileUploadItemDemoComponent {
  private readonly drop = viewChild.required<ElementRef<SlFileDrop>>('drop');
  private nextId = 0;
  readonly uploads = signal<Upload[]>([]);

  onChange() {
    const files = this.drop().nativeElement.files.slice(this.uploads().length);

    files.forEach(file => {
      const id = this.nextId++;
      this.uploads.update(list => [
        ...list,
        { id, filename: file.name, state: 'uploading', progress: 0, meta: '0% · Uploading' }
      ]);

      const timer = setInterval(() => {
        let done = false;

        this.uploads.update(list =>
          list.map(upload => {
            if (upload.id !== id) return upload;
            const progress = Math.min(upload.progress + 20, 100);
            done = progress === 100;
            return {
              ...upload,
              progress,
              state: done ? 'uploaded' : 'uploading',
              meta: done ? 'Uploaded' : `${progress}% · Uploading`
            };
          })
        );

        if (done) clearInterval(timer);
      }, 400);
    });
  }

  remove(id: number) {
    this.uploads.update(list => list.filter(upload => upload.id !== id));
  }
}
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

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/file-upload-item/file-upload-item.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload-item-retry-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-file-upload-item
      [state]="state()"
      [progress]="progress()"
      [meta]="meta()"
      filename="H10-RC-B-21214_A1_I.pdf"
      (sl-retry)="retry()"
    ></sl-file-upload-item>
  `
})
export class FileUploadItemRetryExampleComponent {
  readonly state = signal<'uploading' | 'uploaded' | 'failed'>('failed');
  readonly progress = signal(0);
  readonly meta = signal('Upload failed · Connection lost');

  retry() {
    this.state.set('uploading');
    this.progress.set(0);
    this.meta.set('0% · Uploading');

    const timer = setInterval(() => {
      const next = Math.min(this.progress() + 25, 100);
      this.progress.set(next);

      if (next === 100) {
        clearInterval(timer);
        this.state.set('uploaded');
        this.meta.set('Uploaded');
      } else {
        this.meta.set(`${next}% · Uploading`);
      }
    }, 400);
  }
}
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

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/file-upload-item/file-upload-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-file-upload-item-localization-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-file-upload-item
      state="failed"
      filename="H10-RC-B-21214_A1_I.pdf"
      meta="Caricamento non riuscito · Connessione persa"
      retry-label="Riprova"
      remove-label="Rimuovi"
    ></sl-file-upload-item>
  `
})
export class FileUploadItemLocalizationExampleComponent {}
```
