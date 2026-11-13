---
meta:
  title: Drawer
  description: Drawers slide in from a container to expose additional options and information.
layout: component
---

<!-- cspell:dictionaries lorem-ipsum -->

```html:preview
<sl-drawer label="Drawer" class="drawer-overview">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-drawer>

<sl-button>Open Drawer</sl-button>

<script>
  const drawer = document.querySelector('.drawer-overview');
  const openButton = drawer.nextElementSibling;
  const closeButton = drawer.querySelector('sl-button[variant="primary"]');

  openButton.addEventListener('click', () => drawer.show());
  closeButton.addEventListener('click', () => drawer.hide());
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDrawer from '@saipem/design-system/dist/react/drawer';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDrawer label="Drawer" open={open} onSlAfterHide={() => setOpen(false)}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDrawer>

      <SlButton onClick={() => setOpen(true)}>Open Drawer</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-drawer-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-drawer label="Drawer" [open]="open()" (sl-after-hide)="open.set(false)">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-drawer>

    <sl-button (click)="open.set(true)">Open Drawer</sl-button>
  `
})
export class DrawerExampleComponent {
  // Bind `open` rather than calling show()/hide(): the drawer also closes on its own (close button, overlay,
  // Escape), so listen for sl-after-hide to keep the signal in step with the element.
  readonly open = signal(false);
}
```

## Examples

### Slide in From Start

By default, drawers slide in from the end. To make the drawer slide in from the start, set the `placement` attribute to `start`.

```html:preview
<sl-drawer label="Drawer" placement="start" class="drawer-placement-start">
  This drawer slides in from the start.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-drawer>

<sl-button>Open Drawer</sl-button>

<script>
  const drawer = document.querySelector('.drawer-placement-start');
  const openButton = drawer.nextElementSibling;
  const closeButton = drawer.querySelector('sl-button[variant="primary"]');

  openButton.addEventListener('click', () => drawer.show());
  closeButton.addEventListener('click', () => drawer.hide());
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDrawer from '@saipem/design-system/dist/react/drawer';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDrawer label="Drawer" placement="start" open={open} onSlAfterHide={() => setOpen(false)}>
        This drawer slides in from the start.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDrawer>

      <SlButton onClick={() => setOpen(true)}>Open Drawer</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-drawer-slide-in-from-start-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-drawer label="Drawer" placement="start" [open]="open()" (sl-after-hide)="open.set(false)">
      This drawer slides in from the start.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-drawer>

    <sl-button (click)="open.set(true)">Open Drawer</sl-button>
  `
})
export class DrawerSlideInFromStartExampleComponent {
  readonly open = signal(false);
}
```

### Slide in From Top

To make the drawer slide in from the top, set the `placement` attribute to `top`.

```html:preview
<sl-drawer label="Drawer" placement="top" class="drawer-placement-top">
  This drawer slides in from the top.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-drawer>

<sl-button>Open Drawer</sl-button>

<script>
  const drawer = document.querySelector('.drawer-placement-top');
  const openButton = drawer.nextElementSibling;
  const closeButton = drawer.querySelector('sl-button[variant="primary"]');

  openButton.addEventListener('click', () => drawer.show());
  closeButton.addEventListener('click', () => drawer.hide());
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDrawer from '@saipem/design-system/dist/react/drawer';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDrawer label="Drawer" placement="top" open={open} onSlAfterHide={() => setOpen(false)}>
        This drawer slides in from the top.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDrawer>

      <SlButton onClick={() => setOpen(true)}>Open Drawer</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-drawer-slide-in-from-top-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-drawer label="Drawer" placement="top" [open]="open()" (sl-after-hide)="open.set(false)">
      This drawer slides in from the top.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-drawer>

    <sl-button (click)="open.set(true)">Open Drawer</sl-button>
  `
})
export class DrawerSlideInFromTopExampleComponent {
  readonly open = signal(false);
}
```

### Slide in From Bottom

To make the drawer slide in from the bottom, set the `placement` attribute to `bottom`.

```html:preview
<sl-drawer label="Drawer" placement="bottom" class="drawer-placement-bottom">
  This drawer slides in from the bottom.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-drawer>

<sl-button>Open Drawer</sl-button>

<script>
  const drawer = document.querySelector('.drawer-placement-bottom');
  const openButton = drawer.nextElementSibling;
  const closeButton = drawer.querySelector('sl-button[variant="primary"]');

  openButton.addEventListener('click', () => drawer.show());
  closeButton.addEventListener('click', () => drawer.hide());
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDrawer from '@saipem/design-system/dist/react/drawer';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDrawer label="Drawer" placement="bottom" open={open} onSlAfterHide={() => setOpen(false)}>
        This drawer slides in from the bottom.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDrawer>

      <SlButton onClick={() => setOpen(true)}>Open Drawer</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-drawer-slide-in-from-bottom-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-drawer label="Drawer" placement="bottom" [open]="open()" (sl-after-hide)="open.set(false)">
      This drawer slides in from the bottom.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-drawer>

    <sl-button (click)="open.set(true)">Open Drawer</sl-button>
  `
})
export class DrawerSlideInFromBottomExampleComponent {
  readonly open = signal(false);
}
```

### Contained to an Element

By default, drawers slide out of their [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#Identifying_the_containing_block), which is usually the viewport. To make a drawer slide out of a parent element, add the `contained` attribute to the drawer and apply `position: relative` to its parent.

Unlike normal drawers, contained drawers are not modal. This means they do not show an overlay, they do not trap focus, and they are not dismissible with [[Escape]]. This is intentional to allow users to interact with elements outside of the drawer.

```html:preview
<div
  style="position: relative; border: solid 2px var(--sl-panel-border-color); height: 300px; padding: 1rem; margin-bottom: 1rem;"
>
  The drawer will be contained to this box. This content won't shift or be affected in any way when the drawer opens.

  <sl-drawer label="Drawer" contained class="drawer-contained" style="--size: 50%;">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    <sl-button slot="footer" variant="primary">Close</sl-button>
  </sl-drawer>
</div>

<sl-button>Toggle Drawer</sl-button>

<script>
  const drawer = document.querySelector('.drawer-contained');
  const openButton = drawer.parentElement.nextElementSibling;
  const closeButton = drawer.querySelector('sl-button[variant="primary"]');

  openButton.addEventListener('click', () => (drawer.open = !drawer.open));
  closeButton.addEventListener('click', () => drawer.hide());
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-drawer-contained-to-an-element-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="position: relative; border: solid 2px var(--sl-panel-border-color); height: 300px; padding: 1rem; margin-bottom: 1rem;"
    >
      The drawer will be contained to this box. This content won't shift or be affected in any way when the drawer
      opens.

      <sl-drawer
        label="Drawer"
        contained
        style="--size: 50%;"
        [open]="open()"
        (sl-after-hide)="open.set(false)"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
      </sl-drawer>
    </div>

    <sl-button (click)="open.set(!open())">Toggle Drawer</sl-button>
  `
})
export class DrawerContainedToAnElementExampleComponent {
  // A contained drawer needs `position: relative` on the element it is contained by.
  readonly open = signal(false);
}
```

{% raw %}

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDrawer from '@saipem/design-system/dist/react/drawer';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        style={{
          position: 'relative',
          border: 'solid 2px var(--sl-panel-border-color)',
          height: '300px',
          padding: '1rem',
          marginBottom: '1rem'
        }}
      >
        The drawer will be contained to this box. This content won't shift or be affected in any way when the drawer
        opens.
        <SlDrawer
          label="Drawer"
          contained
          no-modal
          open={open}
          onSlAfterHide={() => setOpen(false)}
          style={{ '--size': '50%' }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
            Close
          </SlButton>
        </SlDrawer>
      </div>

      <SlButton onClick={() => setOpen(true)}>Open Drawer</SlButton>
    </>
  );
};
```

{% endraw %}

### Custom Size

Use the `--size` custom property to set the drawer's size. This will be applied to the drawer's width or height depending on its `placement`.

```html:preview
<sl-drawer label="Drawer" class="drawer-custom-size" style="--size: 50vw;">
  This drawer is always 50% of the viewport.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-drawer>

<sl-button>Open Drawer</sl-button>

<script>
  const drawer = document.querySelector('.drawer-custom-size');
  const openButton = drawer.nextElementSibling;
  const closeButton = drawer.querySelector('sl-button[variant="primary"]');

  openButton.addEventListener('click', () => drawer.show());
  closeButton.addEventListener('click', () => drawer.hide());
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-drawer-custom-size-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-drawer label="Drawer" style="--size: 50vw;" [open]="open()" (sl-after-hide)="open.set(false)">
      This drawer is always 50% of the viewport.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-drawer>

    <sl-button (click)="open.set(true)">Open Drawer</sl-button>
  `
})
export class DrawerCustomSizeExampleComponent {
  readonly open = signal(false);
}
```

{% raw %}

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDrawer from '@saipem/design-system/dist/react/drawer';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDrawer label="Drawer" open={open} onSlAfterHide={() => setOpen(false)} style={{ '--size': '50vw' }}>
        This drawer is always 50% of the viewport.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDrawer>

      <SlButton onClick={() => setOpen(true)}>Open Drawer</SlButton>
    </>
  );
};
```

{% endraw %}

### Scrolling

By design, a drawer's height will never exceed 100% of its container. As such, drawers will not scroll with the page to ensure the header and footer are always accessible to the user.

```html:preview
<sl-drawer label="Drawer" class="drawer-scrolling">
  <div style="height: 150vh; border: dashed 2px var(--sl-color-neutral-200); padding: 0 1rem;">
    <p>Scroll down and give it a try! 👇</p>
  </div>
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-drawer>

<sl-button>Open Drawer</sl-button>

<script>
  const drawer = document.querySelector('.drawer-scrolling');
  const openButton = drawer.nextElementSibling;
  const closeButton = drawer.querySelector('sl-button[variant="primary"]');

  openButton.addEventListener('click', () => drawer.show());
  closeButton.addEventListener('click', () => drawer.hide());
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-drawer-scrolling-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-drawer label="Drawer" [open]="open()" (sl-after-hide)="open.set(false)">
      <div style="height: 150vh; border: dashed 2px var(--sl-color-neutral-200); padding: 0 1rem;">
        <p>Scroll down and give it a try! 👇</p>
      </div>
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-drawer>

    <sl-button (click)="open.set(true)">Open Drawer</sl-button>
  `
})
export class DrawerScrollingExampleComponent {
  readonly open = signal(false);
}
```

{% raw %}

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDrawer from '@saipem/design-system/dist/react/drawer';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDrawer label="Drawer" open={open} onSlAfterHide={() => setOpen(false)}>
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
      </SlDrawer>

      <SlButton onClick={() => setOpen(true)}>Open Drawer</SlButton>
    </>
  );
};
```

{% endraw %}

### Header Actions

The header shows a functional close button by default. You can use the `header-actions` slot to add additional [icon buttons](/components/icon-button) if needed.

```html:preview
<sl-drawer label="Drawer" class="drawer-header-actions">
  <sl-icon-button class="new-window" slot="header-actions" name="box-arrow-up-right"></sl-icon-button>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-drawer>

<sl-button>Open Drawer</sl-button>

<script>
  const drawer = document.querySelector('.drawer-header-actions');
  const openButton = drawer.nextElementSibling;
  const closeButton = drawer.querySelector('sl-button[variant="primary"]');
  const newWindowButton = drawer.querySelector('.new-window');

  openButton.addEventListener('click', () => drawer.show());
  closeButton.addEventListener('click', () => drawer.hide());
  newWindowButton.addEventListener('click', () => window.open(location.href));
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDrawer from '@saipem/design-system/dist/react/drawer';
import SlIconButton from '@saipem/design-system/dist/react/icon-button';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDrawer label="Drawer" open={open} onSlAfterHide={() => setOpen(false)}>
        <SlIconButton slot="header-actions" name="box-arrow-up-right" onClick={() => window.open(location.href)} />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDrawer>

      <SlButton onClick={() => setOpen(true)}>Open Drawer</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import '@saipem/design-system/%NPMDIR%/components/icon-button/icon-button.js';

@Component({
  selector: 'app-drawer-header-actions-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-drawer label="Drawer" [open]="open()" (sl-after-hide)="open.set(false)">
      <sl-icon-button slot="header-actions" name="box-arrow-up-right" (click)="openInNewWindow()"></sl-icon-button>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-drawer>

    <sl-button (click)="open.set(true)">Open Drawer</sl-button>
  `
})
export class DrawerHeaderActionsExampleComponent {
  readonly open = signal(false);

  openInNewWindow() {
    window.open(location.href);
  }
}
```

### Preventing the Drawer from Closing

By default, drawers will close when the user clicks the close button, clicks the overlay, or presses the [[Escape]] key. In most cases, the default behavior is the best behavior in terms of UX. However, there are situations where this may be undesirable, such as when data loss will occur.

To keep the drawer open in such cases, you can cancel the `sl-request-close` event. When canceled, the drawer will remain open and pulse briefly to draw the user's attention to it.

You can use `event.detail.source` to determine what triggered the request to close. This example prevents the drawer from closing when the overlay is clicked, but allows the close button or [[Escape]] to dismiss it.

```html:preview
<sl-drawer label="Drawer" class="drawer-deny-close">
  This drawer will not close when you click on the overlay.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-drawer>

<sl-button>Open Drawer</sl-button>

<script>
  const drawer = document.querySelector('.drawer-deny-close');
  const openButton = drawer.nextElementSibling;
  const closeButton = drawer.querySelector('sl-button[variant="primary"]');

  openButton.addEventListener('click', () => drawer.show());
  closeButton.addEventListener('click', () => drawer.hide());

  // Prevent the drawer from closing when the user clicks on the overlay
  drawer.addEventListener('sl-request-close', event => {
    if (event.detail.source === 'overlay') {
      event.preventDefault();
    }
  });
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDrawer from '@saipem/design-system/dist/react/drawer';

const App = () => {
  const [open, setOpen] = useState(false);

  // Prevent the drawer from closing when the user clicks on the overlay
  function handleRequestClose(event) {
    if (event.detail.source === 'overlay') {
      event.preventDefault();
    }
  }

  return (
    <>
      <SlDrawer label="Drawer" open={open} onSlRequestClose={handleRequestClose} onSlAfterHide={() => setOpen(false)}>
        This drawer will not close when you click on the overlay.
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Save &amp; Close
        </SlButton>
      </SlDrawer>

      <SlButton onClick={() => setOpen(true)}>Open Drawer</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-drawer-preventing-the-drawer-from-closing-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-drawer
      label="Drawer"
      [open]="open()"
      (sl-request-close)="handleRequestClose($event)"
      (sl-after-hide)="open.set(false)"
    >
      This drawer will not close when you click on the overlay.
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-drawer>

    <sl-button (click)="open.set(true)">Open Drawer</sl-button>
  `
})
export class DrawerPreventingTheDrawerFromClosingExampleComponent {
  readonly open = signal(false);

  // sl-request-close is cancelable: preventing it keeps the drawer open and plays the "deny" animation.
  handleRequestClose(event: Event) {
    const { source } = (event as CustomEvent<{ source: 'close-button' | 'keyboard' | 'overlay' }>).detail;

    if (source === 'overlay') {
      event.preventDefault();
    }
  }
}
```

### Customizing Initial Focus

By default, the drawer's panel will gain focus when opened. This allows a subsequent tab press to focus on the first tabbable element in the drawer. If you want a different element to have focus, add the `autofocus` attribute to it as shown below.

```html:preview
<sl-drawer label="Drawer" class="drawer-focus">
  <sl-input autofocus placeholder="I will have focus when the drawer is opened"></sl-input>
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-drawer>

<sl-button>Open Drawer</sl-button>

<script>
  const drawer = document.querySelector('.drawer-focus');
  const input = drawer.querySelector('sl-input');
  const openButton = drawer.nextElementSibling;
  const closeButton = drawer.querySelector('sl-button[variant="primary"]');

  openButton.addEventListener('click', () => drawer.show());
  closeButton.addEventListener('click', () => drawer.hide());
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@saipem/design-system/dist/react/button';
import SlDrawer from '@saipem/design-system/dist/react/drawer';
import SlInput from '@saipem/design-system/dist/react/input';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlDrawer label="Drawer" open={open} onSlAfterHide={() => setOpen(false)}>
        <SlInput autofocus placeholder="I will have focus when the drawer is opened" />
        <SlButton slot="footer" variant="primary" onClick={() => setOpen(false)}>
          Close
        </SlButton>
      </SlDrawer>

      <SlButton onClick={() => setOpen(true)}>Open Drawer</SlButton>
    </>
  );
};
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import '@saipem/design-system/%NPMDIR%/components/input/input.js';

@Component({
  selector: 'app-drawer-customizing-initial-focus-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-drawer label="Drawer" [open]="open()" (sl-after-hide)="open.set(false)">
      <sl-input autofocus placeholder="I will have focus when the drawer is opened"></sl-input>
      <sl-button slot="footer" variant="primary" (click)="open.set(false)">Close</sl-button>
    </sl-drawer>

    <sl-button (click)="open.set(true)">Open Drawer</sl-button>
  `
})
export class DrawerCustomizingInitialFocusExampleComponent {
  readonly open = signal(false);
}
```

:::tip
You can further customize initial focus behavior by canceling the `sl-initial-focus` event and setting focus yourself inside the event handler.
:::
