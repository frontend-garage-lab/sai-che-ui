---
meta:
  title: Dialog
  description: 'Dialogs, sometimes called "modals", appear above the page and require the user''s immediate attention.'
layout: component
---

<!-- cspell:dictionaries lorem-ipsum -->

```html:preview
<sl-dialog label="Dialog" class="dialog-overview">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-dialog>

<sl-button>Open Dialog</sl-button>

<script>
  const dialog = document.querySelector('.dialog-overview');
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector('sl-button[slot="footer"]');

  openButton.addEventListener('click', () => dialog.show());
  closeButton.addEventListener('click', () => dialog.hide());
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDialog from '@saipem/design-system/dist/react/dialog';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDialog label="Dialog" open={open} onSlAfterHide={() => setOpen(false)}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDialog>

      <SlButton onClick={() => setOpen(true)}>Open Dialog</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/dialog/dialog.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-dialog-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-dialog label="Dialog" [open]="open()" (sl-after-hide)="open.set(false)">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-dialog>

    <sl-button (click)="open.set(true)">Open Dialog</sl-button>
  `
})
export class DialogExampleComponent {
  // Bind `open` rather than calling show()/hide(): the dialog also closes on its own (close button, overlay,
  // Escape), so listen for sl-after-hide to keep the signal in step with the element.
  readonly open = signal(false);
}
```

## Examples

### Variants

Use the `variant` attribute to mark a confirmation or an outcome. `success`, `warning` and `danger` show a status icon
before the title; `default` shows none. The footer buttons keep their own variants: a destructive confirmation uses a
`danger` primary action.

```html:preview
<div class="dialog-variants">
  <sl-dialog label="Return to working" variant="warning">
    Do you want to return 2026-BID-000003 to the Working state?
    <sl-button slot="footer">Cancel</sl-button>
    <sl-button slot="footer" variant="primary">Return to working</sl-button>
  </sl-dialog>
  <sl-dialog label="Bid deleted" variant="success">
    2026-BID-000003 has been deleted.
    <sl-button slot="footer" variant="primary">Close</sl-button>
  </sl-dialog>
  <sl-dialog label="Delete bid" variant="danger">
    2026-BID-000003 and its attachments will be deleted. This cannot be undone.
    <sl-button slot="footer">Cancel</sl-button>
    <sl-button slot="footer" variant="danger">Delete bid</sl-button>
  </sl-dialog>

  <sl-button data-variant="warning">Warning</sl-button>
  <sl-button data-variant="success">Success</sl-button>
  <sl-button data-variant="danger">Danger</sl-button>
</div>

<script>
  const container = document.querySelector('.dialog-variants');

  container.querySelectorAll('sl-button[data-variant]').forEach(button => {
    const dialog = container.querySelector(`sl-dialog[variant="${button.dataset.variant}"]`);
    button.addEventListener('click', () => dialog.show());
    dialog.querySelectorAll('sl-button[slot="footer"]').forEach(b => b.addEventListener('click', () => dialog.hide()));
  });
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/dialog/dialog.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

type DialogVariant = 'warning' | 'success' | 'danger';

@Component({
  selector: 'app-dialog-variants-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-dialog
      label="Return to working"
      variant="warning"
      [open]="openVariant() === 'warning'"
      (sl-after-hide)="close()"
    >
      Do you want to return 2026-BID-000003 to the Working state?
      <sl-button slot="footer" (click)="close()">Cancel</sl-button>
      <sl-button slot="footer" variant="primary" (click)="close()">Return to working</sl-button>
    </sl-dialog>

    <sl-dialog label="Bid deleted" variant="success" [open]="openVariant() === 'success'" (sl-after-hide)="close()">
      2026-BID-000003 has been deleted.
      <sl-button slot="footer" variant="primary" (click)="close()">Close</sl-button>
    </sl-dialog>

    <sl-dialog label="Delete bid" variant="danger" [open]="openVariant() === 'danger'" (sl-after-hide)="close()">
      2026-BID-000003 and its attachments will be deleted. This cannot be undone.
      <sl-button slot="footer" (click)="close()">Cancel</sl-button>
      <sl-button slot="footer" variant="danger" (click)="close()">Delete bid</sl-button>
    </sl-dialog>

    <sl-button (click)="openVariant.set('warning')">Warning</sl-button>
    <sl-button (click)="openVariant.set('success')">Success</sl-button>
    <sl-button (click)="openVariant.set('danger')">Danger</sl-button>
  `
})
export class DialogVariantsExampleComponent {
  readonly openVariant = signal<DialogVariant | null>(null);

  close() {
    this.openVariant.set(null);
  }
}
```

### Custom Width

Use the `--width` custom property to set the dialog's width.

```html:preview
<sl-dialog label="Dialog" class="dialog-width" style="--width: 50vw;">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-dialog>

<sl-button>Open Dialog</sl-button>

<script>
  const dialog = document.querySelector('.dialog-width');
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector('sl-button[slot="footer"]');

  openButton.addEventListener('click', () => dialog.show());
  closeButton.addEventListener('click', () => dialog.hide());
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/dialog/dialog.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-dialog-custom-width-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-dialog label="Dialog" style="--width: 50vw;" [open]="open()" (sl-after-hide)="open.set(false)">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-dialog>

    <sl-button (click)="open.set(true)">Open Dialog</sl-button>
  `
})
export class DialogCustomWidthExampleComponent {
  readonly open = signal(false);
}
```

{% raw %}

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDialog from '@saipem/design-system/dist/react/dialog';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDialog label="Dialog" open={open} style={{ '--width': '50vw' }} onSlAfterHide={() => setOpen(false)}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDialog>

      <SlButton onClick={() => setOpen(true)}>Open Dialog</SlButton>
    </>
  );
};
```

{% endraw %}

### Scrolling

By design, a dialog's height will never exceed that of the viewport. As such, dialogs will not scroll with the page ensuring the header and footer are always accessible to the user.

```html:preview
<sl-dialog label="Dialog" class="dialog-scrolling">
  <div style="height: 150vh; border: dashed 2px var(--sl-color-neutral-200); padding: 0 1rem;">
    <p>Scroll down and give it a try! 👇</p>
  </div>
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-dialog>

<sl-button>Open Dialog</sl-button>

<script>
  const dialog = document.querySelector('.dialog-scrolling');
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector('sl-button[slot="footer"]');

  openButton.addEventListener('click', () => dialog.show());
  closeButton.addEventListener('click', () => dialog.hide());
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/dialog/dialog.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-dialog-scrolling-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-dialog label="Dialog" [open]="open()" (sl-after-hide)="open.set(false)">
      <div style="height: 150vh; border: dashed 2px var(--sl-color-neutral-200); padding: 0 1rem;">
        <p>Scroll down and give it a try! 👇</p>
      </div>
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-dialog>

    <sl-button (click)="open.set(true)">Open Dialog</sl-button>
  `
})
export class DialogScrollingExampleComponent {
  readonly open = signal(false);
}
```

{% raw %}

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDialog from '@saipem/design-system/dist/react/dialog';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDialog label="Dialog" open={open} onSlAfterHide={() => setOpen(false)}>
        <div
          style={{
            height: '150vh',
            border: 'dashed 2px var(--sl-color-neutral-200)',
            padding: '0 1rem'
          }}
        >
          <p>Scroll down and give it a try! 👇</p>
        </div>

        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDialog>

      <SlButton onClick={() => setOpen(true)}>Open Dialog</SlButton>
    </>
  );
};
```

{% endraw %}

### Header Actions

The header shows a functional close button by default. You can use the `header-actions` slot to add additional [icon buttons](/components/icon-button) if needed.

```html:preview
<sl-dialog label="Dialog" class="dialog-header-actions">
  <sl-icon-button class="new-window" slot="header-actions" name="box-arrow-up-right"></sl-icon-button>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-dialog>

<sl-button>Open Dialog</sl-button>

<script>
  const dialog = document.querySelector('.dialog-header-actions');
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector('sl-button[slot="footer"]');
  const newWindowButton = dialog.querySelector('.new-window');

  openButton.addEventListener('click', () => dialog.show());
  closeButton.addEventListener('click', () => dialog.hide());
  newWindowButton.addEventListener('click', () => window.open(location.href));
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDialog from '@saipem/design-system/dist/react/dialog';
import SlIconButton from '@saipem/design-system/dist/react/icon-button';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDialog label="Dialog" open={open} onSlAfterHide={() => setOpen(false)}>
        <SlIconButton
          class="new-window"
          slot="header-actions"
          name="box-arrow-up-right"
          onClick={() => window.open(location.href)}
        />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDialog>

      <SlButton onClick={() => setOpen(true)}>Open Dialog</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/dialog/dialog.js';
import '@saipem/design-system/%NPMDIR%/components/icon-button/icon-button.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-dialog-header-actions-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-dialog label="Dialog" [open]="open()" (sl-after-hide)="open.set(false)">
      <sl-icon-button slot="header-actions" name="box-arrow-up-right" (click)="openInNewWindow()"></sl-icon-button>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-dialog>

    <sl-button (click)="open.set(true)">Open Dialog</sl-button>
  `
})
export class DialogHeaderActionsExampleComponent {
  readonly open = signal(false);

  openInNewWindow() {
    window.open(location.href);
  }
}
```

### Preventing the Dialog from Closing

By default, dialogs will close when the user clicks the close button, clicks the overlay, or presses the [[Escape]] key. In most cases, the default behavior is the best behavior in terms of UX. However, there are situations where this may be undesirable, such as when data loss will occur.

To keep the dialog open in such cases, you can cancel the `sl-request-close` event. When canceled, the dialog will remain open and pulse briefly to draw the user's attention to it.

You can use `event.detail.source` to determine what triggered the request to close. This example prevents the dialog from closing when the overlay is clicked, but allows the close button or [[Escape]] to dismiss it.

```html:preview
<sl-dialog label="Dialog" class="dialog-deny-close">
  This dialog will not close when you click on the overlay.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-dialog>

<sl-button>Open Dialog</sl-button>

<script>
  const dialog = document.querySelector('.dialog-deny-close');
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector('sl-button[slot="footer"]');

  openButton.addEventListener('click', () => dialog.show());
  closeButton.addEventListener('click', () => dialog.hide());

  // Prevent the dialog from closing when the user clicks on the overlay
  dialog.addEventListener('sl-request-close', event => {
    if (event.detail.source === 'overlay') {
      event.preventDefault();
    }
  });
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDialog from '@saipem/design-system/dist/react/dialog';

const App = () => {
  const [open, setOpen] = useState(false);

  // Prevent the dialog from closing when the user clicks on the overlay
  function handleRequestClose(event) {
    if (event.detail.source === 'overlay') {
      event.preventDefault();
    }
  }

  return (
    <>
      <SlDialog label="Dialog" open={open} onSlRequestClose={handleRequestClose} onSlAfterHide={() => setOpen(false)}>
        This dialog will not close when you click on the overlay.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDialog>

      <SlButton onClick={() => setOpen(true)}>Open Dialog</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/dialog/dialog.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-dialog-preventing-the-dialog-from-closing-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-dialog
      label="Dialog"
      [open]="open()"
      (sl-request-close)="handleRequestClose($event)"
      (sl-after-hide)="open.set(false)"
    >
      This dialog will not close when you click on the overlay.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-dialog>

    <sl-button (click)="open.set(true)">Open Dialog</sl-button>
  `
})
export class DialogPreventingTheDialogFromClosingExampleComponent {
  readonly open = signal(false);

  // sl-request-close is cancelable: preventing it keeps the dialog open and plays the "deny" animation.
  handleRequestClose(event: Event) {
    const { source } = (event as CustomEvent<{ source: 'close-button' | 'keyboard' | 'overlay' }>).detail;

    if (source === 'overlay') {
      event.preventDefault();
    }
  }
}
```

### Customizing Initial Focus

By default, the dialog's panel will gain focus when opened. This allows a subsequent tab press to focus on the first tabbable element in the dialog. If you want a different element to have focus, add the `autofocus` attribute to it as shown below.

```html:preview
<sl-dialog label="Dialog" class="dialog-focus">
  <sl-input autofocus placeholder="I will have focus when the dialog is opened"></sl-input>
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-dialog>

<sl-button>Open Dialog</sl-button>

<script>
  const dialog = document.querySelector('.dialog-focus');
  const input = dialog.querySelector('sl-input');
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector('sl-button[slot="footer"]');

  openButton.addEventListener('click', () => dialog.show());
  closeButton.addEventListener('click', () => dialog.hide());
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDialog from '@saipem/design-system/dist/react/dialog';
import SlInput from '@saipem/design-system/dist/react/input';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDialog label="Dialog" open={open} onSlAfterHide={() => setOpen(false)}>
        <SlInput autofocus placeholder="I will have focus when the dialog is opened" />
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDialog>

      <SlButton onClick={() => setOpen(true)}>Open Dialog</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/dialog/dialog.js';
import '@saipem/design-system/%NPMDIR%/components/input/input.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-dialog-customizing-initial-focus-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-dialog label="Dialog" [open]="open()" (sl-after-hide)="open.set(false)">
      <sl-input autofocus placeholder="I will have focus when the dialog is opened"></sl-input>
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-dialog>

    <sl-button (click)="open.set(true)">Open Dialog</sl-button>
  `
})
export class DialogCustomizingInitialFocusExampleComponent {
  readonly open = signal(false);
}
```

:::tip
You can further customize initial focus behavior by canceling the `sl-initial-focus` event and setting focus yourself inside the event handler.
:::
