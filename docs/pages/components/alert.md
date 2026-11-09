---
meta:
  title: Alert
  description: Alerts are used to display important messages inline or as toast notifications.
layout: component
---

```html:preview
<sl-alert open>
  <sl-icon slot="icon" name="info-circle"></sl-icon>
  This is a standard alert. You can customize its content and even the icon.
</sl-alert>
```

```jsx:react
import SlAlert from '@shoelace-style/shoelace/dist/react/alert';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';

const App = () => (
  <SlAlert open>
    <SlIcon slot="icon" name="info-circle" />
    This is a standard alert. You can customize its content and even the icon.
  </SlAlert>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-alert-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-alert open>
      <sl-icon slot="icon" name="info-circle"></sl-icon>
      This is a standard alert. You can customize its content and even the icon.
    </sl-alert>
  `
})
export class AlertExampleComponent {}
```

:::tip
Alerts will not be visible if the `open` attribute is not present.
:::

## Examples

### Variants

Set the `variant` attribute to change the alert's variant.

```html:preview
<sl-alert variant="primary" open>
  <sl-icon slot="icon" name="info-circle"></sl-icon>
  <strong>This is super informative</strong><br />
  You can tell by how pretty the alert is.
</sl-alert>

<br />

<sl-alert variant="success" open>
  <sl-icon slot="icon" name="check2-circle"></sl-icon>
  <strong>Your changes have been saved</strong><br />
  You can safely exit the app now.
</sl-alert>

<br />

<sl-alert variant="neutral" open>
  <sl-icon slot="icon" name="gear"></sl-icon>
  <strong>Your settings have been updated</strong><br />
  Settings will take effect on next login.
</sl-alert>

<br />

<sl-alert variant="warning" open>
  <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
  <strong>Your session has ended</strong><br />
  Please login again to continue.
</sl-alert>

<br />

<sl-alert variant="danger" open>
  <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
  <strong>Your account has been deleted</strong><br />
  We're very sorry to see you go!
</sl-alert>
```

```jsx:react
import SlAlert from '@shoelace-style/shoelace/dist/react/alert';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';

const App = () => (
  <>
    <SlAlert variant="primary" open>
      <SlIcon slot="icon" name="info-circle" />
      <strong>This is super informative</strong>
      <br />
      You can tell by how pretty the alert is.
    </SlAlert>

    <br />

    <SlAlert variant="success" open>
      <SlIcon slot="icon" name="check2-circle" />
      <strong>Your changes have been saved</strong>
      <br />
      You can safely exit the app now.
    </SlAlert>

    <br />

    <SlAlert variant="neutral" open>
      <SlIcon slot="icon" name="gear" />
      <strong>Your settings have been updated</strong>
      <br />
      Settings will take effect on next login.
    </SlAlert>

    <br />

    <SlAlert variant="warning" open>
      <SlIcon slot="icon" name="exclamation-triangle" />
      <strong>Your session has ended</strong>
      <br />
      Please login again to continue.
    </SlAlert>

    <br />

    <SlAlert variant="danger" open>
      <SlIcon slot="icon" name="exclamation-octagon" />
      <strong>Your account has been deleted</strong>
      <br />
      We're very sorry to see you go!
    </SlAlert>
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-alert-variants-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-alert variant="primary" open>
      <sl-icon slot="icon" name="info-circle"></sl-icon>
      <strong>This is super informative</strong><br />
      You can tell by how pretty the alert is.
    </sl-alert>

    <br />

    <sl-alert variant="success" open>
      <sl-icon slot="icon" name="check2-circle"></sl-icon>
      <strong>Your changes have been saved</strong><br />
      You can safely exit the app now.
    </sl-alert>

    <br />

    <sl-alert variant="neutral" open>
      <sl-icon slot="icon" name="gear"></sl-icon>
      <strong>Your settings have been updated</strong><br />
      Settings will take effect on next login.
    </sl-alert>

    <br />

    <sl-alert variant="warning" open>
      <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
      <strong>Your session has ended</strong><br />
      Please login again to continue.
    </sl-alert>

    <br />

    <sl-alert variant="danger" open>
      <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
      <strong>Your account has been deleted</strong><br />
      We're very sorry to see you go!
    </sl-alert>
  `
})
export class AlertVariantsExampleComponent {}
```

### Closable

Add the `closable` attribute to show a close button that will hide the alert.

```html:preview
<sl-alert variant="primary" open closable class="alert-closable">
  <sl-icon slot="icon" name="info-circle"></sl-icon>
  You can close this alert any time!
</sl-alert>

<script>
  const alert = document.querySelector('.alert-closable');
  alert.addEventListener('sl-after-hide', () => {
    setTimeout(() => (alert.open = true), 2000);
  });
</script>
```

```jsx:react
import { useState } from 'react';
import SlAlert from '@shoelace-style/shoelace/dist/react/alert';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';

const App = () => {
  const [open, setOpen] = useState(true);

  function handleHide() {
    setOpen(false);
    setTimeout(() => setOpen(true), 2000);
  }

  return (
    <SlAlert open={open} closable onSlAfterHide={handleHide}>
      <SlIcon slot="icon" name="info-circle" />
      You can close this alert any time!
    </SlAlert>
  );
};
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-alert-closable-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-alert variant="primary" [open]="open()" closable (sl-after-hide)="reopenLater()">
      <sl-icon slot="icon" name="info-circle"></sl-icon>
      You can close this alert any time!
    </sl-alert>
  `
})
export class AlertClosableExampleComponent {
  readonly open = signal(true);

  reopenLater() {
    setTimeout(() => this.open.set(true), 2000);
  }
}
```

### Without Icons

Icons are optional. Simply omit the `icon` slot if you don't want them.

```html:preview
<sl-alert variant="primary" open> Nothing fancy here, just a simple alert. </sl-alert>
```

```jsx:react
import SlAlert from '@shoelace-style/shoelace/dist/react/alert';

const App = () => (
  <SlAlert variant="primary" open>
    Nothing fancy here, just a simple alert.
  </SlAlert>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-alert-without-icons-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-alert variant="primary" open> Nothing fancy here, just a simple alert. </sl-alert>`
})
export class AlertWithoutIconsExampleComponent {}
```

### Duration

Set the `duration` attribute to automatically hide an alert after a period of time. This is useful for alerts that don't require acknowledgement.

```html:preview
<div class="alert-duration">
  <sl-button variant="primary">Show Alert</sl-button>

  <sl-alert variant="primary" duration="3000" closable>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    This alert will automatically hide itself after three seconds, unless you interact with it.
  </sl-alert>
</div>

<script>
  const container = document.querySelector('.alert-duration');
  const button = container.querySelector('sl-button');
  const alert = container.querySelector('sl-alert');

  button.addEventListener('click', () => alert.show());
</script>

<style>
  .alert-duration sl-alert {
    margin-top: var(--sl-spacing-medium);
  }
</style>
```

```jsx:react
import { useState } from 'react';
import SlAlert from '@shoelace-style/shoelace/dist/react/alert';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';

const css = `
  .alert-duration sl-alert {
    margin-top: var(--sl-spacing-medium);
  }
`;

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="alert-duration">
        <SlButton variant="primary" onClick={() => setOpen(true)}>
          Show Alert
        </SlButton>

        <SlAlert variant="primary" duration="3000" open={open} closable onSlAfterHide={() => setOpen(false)}>
          <SlIcon slot="icon" name="info-circle" />
          This alert will automatically hide itself after three seconds, unless you interact with it.
        </SlAlert>
      </div>

      <style>{css}</style>
    </>
  );
};
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/button/button.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from '@angular/core';
import type SlAlert from '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.component.js';

@Component({
  selector: 'app-alert-duration-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    sl-alert {
      margin-top: var(--sl-spacing-medium);
    }
  `,
  template: `
    <sl-button variant="primary" (click)="show()">Show Alert</sl-button>

    <sl-alert #alert variant="primary" duration="3000" closable>
      <sl-icon slot="icon" name="info-circle"></sl-icon>
      This alert will automatically hide itself after three seconds, unless you interact with it.
    </sl-alert>
  `
})
export class AlertDurationExampleComponent {
  private readonly alert = viewChild.required<ElementRef<SlAlert>>('alert');

  show() {
    void this.alert().nativeElement.show();
  }
}
```

### Countdown

Set the `countdown` attribute to display a loading bar that indicates the alert remaining time. This is useful for alerts with relatively long duration.

```html:preview
<div class="alert-countdown">
  <sl-button variant="primary">Show Alert</sl-button>

  <sl-alert variant="primary" duration="10000" countdown="rtl" closable>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    You're not stuck, the alert will close after a pretty long duration.
  </sl-alert>
</div>

<script>
  const container = document.querySelector('.alert-countdown');
  const button = container.querySelector('sl-button');
  const alert = container.querySelector('sl-alert');

  button.addEventListener('click', () => alert.show());
</script>

<style>
  .alert-countdown sl-alert {
    margin-top: var(--sl-spacing-medium);
  }
</style>
```

```jsx:react
import { useState } from 'react';
import SlAlert from '@shoelace-style/shoelace/dist/react/alert';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';

const css = `
  .alert-countdown sl-alert {
    margin-top: var(--sl-spacing-medium);
  }
`;

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="alert-countdown">
        <SlButton variant="primary" onClick={() => setOpen(true)}>
          Show Alert
        </SlButton>

        <SlAlert variant="primary" duration="3000" countdown="rtl" open={open} closable onSlAfterHide={() => setOpen(false)}>
          <SlIcon slot="icon" name="info-circle" />
          You're not stuck, the alert will close after a pretty long duration.
        </SlAlert>
      </div>

      <style>{css}</style>
    </>
  );
};
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/button/button.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from '@angular/core';
import type SlAlert from '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.component.js';

@Component({
  selector: 'app-alert-countdown-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    sl-alert {
      margin-top: var(--sl-spacing-medium);
    }
  `,
  template: `
    <sl-button variant="primary" (click)="show()">Show Alert</sl-button>

    <sl-alert #alert variant="primary" duration="10000" countdown="rtl" closable>
      <sl-icon slot="icon" name="info-circle"></sl-icon>
      You're not stuck, the alert will close after a pretty long duration.
    </sl-alert>
  `
})
export class AlertCountdownExampleComponent {
  private readonly alert = viewChild.required<ElementRef<SlAlert>>('alert');

  show() {
    void this.alert().nativeElement.show();
  }
}
```

### As a toast notification

The dashboard's four toast cases map onto `sl-alert` variants: `success`, `danger` for "error", `warning`, and
`primary` for "information" — `primary` is the closer semantic fit than `accent` here, since `accent` is reserved
for the "Notified" KPI tone elsewhere in this design, while `primary` is this library's general informative variant.
Each one is closable, carries custom icon slot content, and floats to [the toast stack](#the-toast-stack) top-right
when `toast()` is called.

```html:preview
<div class="alert-toast-semantic">
  <sl-button variant="success">Success</sl-button>
  <sl-button variant="danger">Error</sl-button>
  <sl-button variant="warning">Warning</sl-button>
  <sl-button variant="primary">Information</sl-button>

  <sl-alert variant="success" closable>
    <sl-icon slot="icon" name="check2-circle"></sl-icon>
    <strong>Contract renewed</strong><br />
    The agreement was signed and distributed to all parties.
  </sl-alert>

  <sl-alert variant="danger" closable>
    <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
    <strong>Contract expired</strong><br />
    This agreement lapsed without a signed renewal.
  </sl-alert>

  <sl-alert variant="warning" closable>
    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
    <strong>Contract expiring soon</strong><br />
    Renew before the term ends to avoid a lapse.
  </sl-alert>

  <sl-alert variant="primary" closable>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>Stakeholders notified</strong><br />
    An email was sent to everyone on the distribution list.
  </sl-alert>
</div>

<script>
  const semanticContainer = document.querySelector('.alert-toast-semantic');

  ['success', 'danger', 'warning', 'primary'].map(variant => {
    const button = semanticContainer.querySelector(`sl-button[variant="${variant}"]`);
    const alert = semanticContainer.querySelector(`sl-alert[variant="${variant}"]`);

    button.addEventListener('click', () => alert.toast());
  });
</script>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/button/button.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChildren } from '@angular/core';
import type SlAlert from '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.component.js';

@Component({
  selector: 'app-alert-toast-semantic-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-button variant="success" (click)="toast(0)">Success</sl-button>
    <sl-button variant="danger" (click)="toast(1)">Error</sl-button>
    <sl-button variant="warning" (click)="toast(2)">Warning</sl-button>
    <sl-button variant="primary" (click)="toast(3)">Information</sl-button>

    <sl-alert #alert variant="success" closable>
      <sl-icon slot="icon" name="check2-circle"></sl-icon>
      <strong>Contract renewed</strong><br />
      The agreement was signed and distributed to all parties.
    </sl-alert>

    <sl-alert #alert variant="danger" closable>
      <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
      <strong>Contract expired</strong><br />
      This agreement lapsed without a signed renewal.
    </sl-alert>

    <sl-alert #alert variant="warning" closable>
      <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
      <strong>Contract expiring soon</strong><br />
      Renew before the term ends to avoid a lapse.
    </sl-alert>

    <sl-alert #alert variant="primary" closable>
      <sl-icon slot="icon" name="info-circle"></sl-icon>
      <strong>Stakeholders notified</strong><br />
      An email was sent to everyone on the distribution list.
    </sl-alert>
  `
})
export class AlertToastSemanticExampleComponent {
  private readonly alerts = viewChildren<ElementRef<SlAlert>>('alert');

  toast(index: number) {
    void this.alerts()[index].nativeElement.toast();
  }
}
```

### Toast Notifications

To display an alert as a toast notification, or "toast", create the alert and call its `toast()` method. This will move the alert out of its position in the DOM and into [the toast stack](#the-toast-stack) where it will be shown. Once dismissed, it will be removed from the DOM completely. To reuse a toast, store a reference to it and call `toast()` again later on.

You should always use the `closable` attribute so users can dismiss the notification. It's also common to set a reasonable `duration` when the notification doesn't require acknowledgement.

```html:preview
<div class="alert-toast">
  <sl-button variant="primary">Primary</sl-button>
  <sl-button variant="success">Success</sl-button>
  <sl-button variant="neutral">Neutral</sl-button>
  <sl-button variant="warning">Warning</sl-button>
  <sl-button variant="danger">Danger</sl-button>

  <sl-alert variant="primary" duration="3000" closable>
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    <strong>This is super informative</strong><br />
    You can tell by how pretty the alert is.
  </sl-alert>

  <sl-alert variant="success" duration="3000" closable>
    <sl-icon slot="icon" name="check2-circle"></sl-icon>
    <strong>Your changes have been saved</strong><br />
    You can safely exit the app now.
  </sl-alert>

  <sl-alert variant="neutral" duration="3000" closable>
    <sl-icon slot="icon" name="gear"></sl-icon>
    <strong>Your settings have been updated</strong><br />
    Settings will take effect on next login.
  </sl-alert>

  <sl-alert variant="warning" duration="3000" closable>
    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
    <strong>Your session has ended</strong><br />
    Please login again to continue.
  </sl-alert>

  <sl-alert variant="danger" duration="3000" closable>
    <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
    <strong>Your account has been deleted</strong><br />
    We're very sorry to see you go!
  </sl-alert>
</div>

<script>
  const container = document.querySelector('.alert-toast');

  ['primary', 'success', 'neutral', 'warning', 'danger'].map(variant => {
    const button = container.querySelector(`sl-button[variant="${variant}"]`);
    const alert = container.querySelector(`sl-alert[variant="${variant}"]`);

    button.addEventListener('click', () => alert.toast());
  });
</script>
```

```jsx:react
import { useRef } from 'react';
import SlAlert from '@shoelace-style/shoelace/dist/react/alert';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';

function showToast(alert) {
  alert.toast();
}

const App = () => {
  const primary = useRef(null);
  const success = useRef(null);
  const neutral = useRef(null);
  const warning = useRef(null);
  const danger = useRef(null);

  return (
    <>
      <SlButton variant="primary" onClick={() => primary.current.toast()}>
        Primary
      </SlButton>

      <SlButton variant="success" onClick={() => success.current.toast()}>
        Success
      </SlButton>

      <SlButton variant="neutral" onClick={() => neutral.current.toast()}>
        Neutral
      </SlButton>

      <SlButton variant="warning" onClick={() => warning.current.toast()}>
        Warning
      </SlButton>

      <SlButton variant="danger" onClick={() => danger.current.toast()}>
        Danger
      </SlButton>

      <SlAlert ref={primary} variant="primary" duration="3000" closable>
        <SlIcon slot="icon" name="info-circle" />
        <strong>This is super informative</strong>
        <br />
        You can tell by how pretty the alert is.
      </SlAlert>

      <SlAlert ref={success} variant="success" duration="3000" closable>
        <SlIcon slot="icon" name="check2-circle" />
        <strong>Your changes have been saved</strong>
        <br />
        You can safely exit the app now.
      </SlAlert>

      <SlAlert ref={neutral} variant="neutral" duration="3000" closable>
        <SlIcon slot="icon" name="gear" />
        <strong>Your settings have been updated</strong>
        <br />
        Settings will take effect on next login.
      </SlAlert>

      <SlAlert ref={warning} variant="warning" duration="3000" closable>
        <SlIcon slot="icon" name="exclamation-triangle" />
        <strong>Your session has ended</strong>
        <br />
        Please login again to continue.
      </SlAlert>

      <SlAlert ref={danger} variant="danger" duration="3000" closable>
        <SlIcon slot="icon" name="exclamation-octagon" />
        <strong>Your account has been deleted</strong>
        <br />
        We're very sorry to see you go!
      </SlAlert>
    </>
  );
};
```

{% raw %}

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/button/button.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChildren } from '@angular/core';
import type SlAlert from '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.component.js';

interface Toast {
  variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
  label: string;
  icon: string;
  title: string;
  body: string;
}

@Component({
  selector: 'app-alert-toast-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @for (toast of toasts; track toast.variant) {
      <sl-button [variant]="toast.variant" (click)="show($index)">{{ toast.label }}</sl-button>
    }

    @for (toast of toasts; track toast.variant) {
      <sl-alert #alert [variant]="toast.variant" duration="3000" closable>
        <sl-icon slot="icon" [name]="toast.icon"></sl-icon>
        <strong>{{ toast.title }}</strong><br />
        {{ toast.body }}
      </sl-alert>
    }
  `
})
export class AlertToastExampleComponent {
  private readonly alerts = viewChildren<ElementRef<SlAlert>>('alert');

  readonly toasts: Toast[] = [
    { variant: 'primary', label: 'Primary', icon: 'info-circle', title: 'This is super informative', body: 'You can tell by how pretty the alert is.' },
    { variant: 'success', label: 'Success', icon: 'check2-circle', title: 'Your changes have been saved', body: 'You can safely exit the app now.' },
    { variant: 'neutral', label: 'Neutral', icon: 'gear', title: 'Your settings have been updated', body: 'Settings will take effect on next login.' },
    { variant: 'warning', label: 'Warning', icon: 'exclamation-triangle', title: 'Your session has ended', body: 'Please login again to continue.' },
    { variant: 'danger', label: 'Danger', icon: 'exclamation-octagon', title: 'Your account has been deleted', body: `We're very sorry to see you go!` }
  ];

  show(index: number) {
    void this.alerts()[index].nativeElement.toast();
  }
}
```

{% endraw %}

### Creating Toasts Imperatively

For convenience, you can create a utility that emits toast notifications with a function call rather than composing them in your HTML. To do this, generate the alert with JavaScript, append it to the body, and call the `toast()` method as shown in the example below.

```html:preview
<div class="alert-toast-wrapper">
  <sl-button variant="primary">Create Toast</sl-button>
</div>

<script>
  const container = document.querySelector('.alert-toast-wrapper');
  const button = container.querySelector('sl-button');
  let count = 0;

  // Always escape HTML for text arguments!
  function escapeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  // Custom function to emit toast notifications
  function notify(message, variant = 'primary', icon = 'info-circle', duration = 3000) {
    const alert = Object.assign(document.createElement('sl-alert'), {
      variant,
      closable: true,
      duration: duration,
      innerHTML: `
        <sl-icon name="${icon}" slot="icon"></sl-icon>
        ${escapeHtml(message)}
      `
    });

    document.body.append(alert);
    return alert.toast();
  }

  button.addEventListener('click', () => {
    notify(`This is custom toast #${++count}`);
  });
</script>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/button/button.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, inject } from '@angular/core';
import type SlAlert from '@shoelace-style/shoelace/%NPMDIR%/components/alert/alert.component.js';

/** A thin service wrapper, so any component can raise a toast without reaching into the DOM itself. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  notify(message: string, variant = 'primary', icon = 'info-circle', duration = 3000) {
    const alert = Object.assign(document.createElement('sl-alert'), {
      variant,
      closable: true,
      duration
    }) as SlAlert;

    const iconElement = document.createElement('sl-icon');
    iconElement.setAttribute('name', icon);
    iconElement.setAttribute('slot', 'icon');

    // Build the body with textContent instead of innerHTML, so the message can never inject markup.
    alert.append(iconElement, document.createTextNode(message));
    document.body.append(alert);

    return alert.toast();
  }
}

@Component({
  selector: 'app-alert-toast-wrapper-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-button variant="primary" (click)="createToast()">Create Toast</sl-button>`
})
export class AlertToastWrapperExampleComponent {
  private readonly toasts = inject(ToastService);
  private count = 0;

  createToast() {
    void this.toasts.notify(`This is custom toast #${++this.count}`);
  }
}
```

### The Toast Stack

The toast stack is a fixed position singleton element created and managed internally by the alert component. It will be added and removed from the DOM as needed when toasts are shown. When more than one toast is visible, they will stack vertically in the toast stack.

By default, the toast stack is positioned at the top-right of the viewport. You can change its position by targeting `.sl-toast-stack` in your stylesheet. To make toasts appear at the top-left of the viewport, for example, use the following styles.

```css
.sl-toast-stack {
  left: 0;
  right: auto;
}
```

To make toasts appear at the bottom-right instead, e.g. for a non-blocking confirmation after a background action:

```css
.sl-toast-stack {
  top: auto;
  bottom: 0;
}
```

:::tip
By design, it is not possible to show toasts in more than one stack simultaneously. Such behavior is confusing and makes for a poor user experience.
:::
