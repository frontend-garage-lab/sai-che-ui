---
meta:
  title: Comment
  description: Comments show a single message in a thread, pairing an avatar with its author, date, text and an optional attachment.
layout: component
---

Use it for things like review comments or any threaded discussion. Pass an [sl-avatar](/components/avatar) into the
`avatar` slot, and the comment's text as the default slot content.

```html:preview
<sl-comment author="Aiello Ciro" date="02-Oct-2026">
  <sl-avatar slot="avatar" shape="circle" initials="AC"></sl-avatar>
  Submitted for Lead reviewer
</sl-comment>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/avatar/avatar.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/comment/comment.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-comment-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-comment author="Aiello Ciro" date="02-Oct-2026">
      <sl-avatar slot="avatar" shape="circle" initials="AC"></sl-avatar>
      Submitted for Lead reviewer
    </sl-comment>
  `
})
export class CommentExampleComponent {}
```

## Examples

### With an attachment

Pass an `<sl-icon-button>` into the `attachment` slot to let users open a file linked to the comment. It's only shown
when the slot has content.

```html:preview
<sl-comment author="Aiello Ciro" date="02-Oct-2026">
  <sl-avatar slot="avatar" shape="circle" initials="AC"></sl-avatar>
  Submitted for Lead reviewer
  <sl-icon-button slot="attachment" name="file-earmark-pdf" label="Open attachment"></sl-icon-button>
</sl-comment>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/avatar/avatar.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/comment/comment.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon-button/icon-button.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-comment-with-an-attachment-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-comment author="Aiello Ciro" date="02-Oct-2026">
      <sl-avatar slot="avatar" shape="circle" initials="AC"></sl-avatar>
      Submitted for Lead reviewer
      <sl-icon-button slot="attachment" name="file-earmark-pdf" label="Open attachment"></sl-icon-button>
    </sl-comment>
  `
})
export class CommentWithAnAttachmentExampleComponent {}
```

### Without a date

The date line is only shown when `date` is set or the `date` slot has content.

```html:preview
<sl-comment author="Aiello Ciro">
  <sl-avatar slot="avatar" shape="circle" initials="AC"></sl-avatar>
  Submitted for Lead reviewer
</sl-comment>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/avatar/avatar.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/comment/comment.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-comment-without-a-date-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-comment author="Aiello Ciro">
      <sl-avatar slot="avatar" shape="circle" initials="AC"></sl-avatar>
      Submitted for Lead reviewer
    </sl-comment>
  `
})
export class CommentWithoutADateExampleComponent {}
```

### A thread of comments

```html:preview
<div class="comment-thread">
  <sl-comment author="Aiello Ciro" date="02-Oct-2026">
    <sl-avatar slot="avatar" shape="circle" initials="AC"></sl-avatar>
    Submitted for Lead reviewer
    <sl-icon-button slot="attachment" name="file-earmark-pdf" label="Open attachment"></sl-icon-button>
  </sl-comment>
  <sl-comment author="Lead Reviewer" date="03-Oct-2026">
    <sl-avatar slot="avatar" shape="circle" initials="LR"></sl-avatar>
    Looks good, approved.
  </sl-comment>
</div>

<style>
  .comment-thread {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-small);
  }
</style>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/avatar/avatar.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/comment/comment.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon-button/icon-button.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-comment-a-thread-of-comments-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .comment-thread {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-small);
      }
  `,
  template: `
    <div class="comment-thread">
      <sl-comment author="Aiello Ciro" date="02-Oct-2026">
        <sl-avatar slot="avatar" shape="circle" initials="AC"></sl-avatar>
        Submitted for Lead reviewer
        <sl-icon-button slot="attachment" name="file-earmark-pdf" label="Open attachment"></sl-icon-button>
      </sl-comment>
      <sl-comment author="Lead Reviewer" date="03-Oct-2026">
        <sl-avatar slot="avatar" shape="circle" initials="LR"></sl-avatar>
        Looks good, approved.
      </sl-comment>
    </div>
  `
})
export class CommentAThreadOfCommentsExampleComponent {}
```
