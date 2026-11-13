---
meta:
  title: Angular
  description: How to use Shoelace components in an Angular app.
---

# Angular

Angular [plays nice](https://custom-elements-everywhere.com/#angular) with custom elements, so Shoelace components can be used directly in Angular templates. This page targets **Angular 22** and the standalone, signal-based, zoneless style that is the default there. Everything below also works on Angular 16+ with minor adjustments, which are called out where they matter.

## Installation

Install the package from npm.

```bash
npm install @saipem/design-system
```

### Load a theme

Add [a theme](/getting-started/themes) to the global stylesheet so the design tokens are available everywhere.

```css
/* src/styles.css */
@import '@saipem/design-system/%NPMDIR%/themes/light.css';
```

### Set the base path

Icons and other assets are fetched at runtime, so the library needs to know where they live. Do this once, at bootstrap, before any component renders.

```ts
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { setBasePath } from '@saipem/design-system/%NPMDIR%/utilities/base-path.js';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

{# CDN disabled: the design system is installed locally only (not published on jsDelivr/npm). Uncomment to re-enable.
setBasePath('https://cdn.jsdelivr.net/npm/@saipem/design-system@%VERSION%/%CDNDIR%/');
#}
setBasePath('/saipem-design-system');

void bootstrapApplication(AppComponent, appConfig);
```

{# CDN disabled: the design system is installed locally only (not published on jsDelivr/npm). Uncomment to re-enable.
:::tip
To avoid the CDN, copy `node_modules/@saipem/design-system/%NPMDIR%/assets` into your `public` folder with a build step and point `setBasePath()` at that folder instead.
:::
#}

The base path must point to the folder that contains the library `assets` directory. Copy it at build time from `node_modules` by adding this entry to the `assets` array of your build target in `angular.json`:

```json
{
  "glob": "**/*",
  "input": "node_modules/@saipem/design-system/%NPMDIR%/assets",
  "output": "saipem-design-system/assets"
}
```

:::tip
If the app is served from a sub-path (a `<base href>` other than `/`), prefix the base path accordingly, e.g. `setBasePath('/my-app/saipem-design-system')`.
:::

### Application config

```ts
// src/app/app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Shoelace components dispatch native DOM events, which Angular picks up through the template without Zone.js.
    provideZonelessChangeDetection()
  ]
};
```

:::tip
`provideZonelessChangeDetection()` requires Angular 20 or later. On older versions, keep Zone.js and drop this provider — nothing else on this page changes.
:::

## Importing components

Import only the components you use. The import registers the custom element; there is no Angular wrapper to declare.

```ts
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/input/input.js';
```

Put these imports in the standalone component that uses them, or in a single shared file imported once at startup. Importing twice is harmless: custom element registration is idempotent.

## The schema

Angular validates template tags against known elements. Add `CUSTOM_ELEMENTS_SCHEMA` to every standalone component that renders a Shoelace tag, otherwise the compiler reports `'sl-button' is not a known element`.

```ts
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@saipem/design-system/%NPMDIR%/components/button/button.js';

@Component({
  selector: 'app-greeting',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-button variant="primary">Click me</sl-button>`
})
export class GreetingComponent {}
```

:::warning
`CUSTOM_ELEMENTS_SCHEMA` turns off unknown-element and unknown-property checking for the whole component template, including your own typos. Keep such components small, or put the Shoelace markup in a thin presentational component.
:::

## Binding properties

This is the one rule worth internalising, and it is the source of most bugs when using web components with Angular.

| Syntax                  | What Angular does                      | Use it for                                     |
| ----------------------- | -------------------------------------- | ---------------------------------------------- |
| `variant="primary"`     | Sets an **attribute**, always a string | Static string values                           |
| `[variant]="expr"`      | Sets a **property** on the element     | Everything else                                |
| `[attr.variant]="expr"` | Sets an **attribute**, stringified     | Styling hooks that rely on attribute selectors |

Attributes are strings. A boolean bound as an attribute is the string `"false"`, which is truthy, so the component stays enabled:

{% raw %}

```html
<!-- Wrong: the button is enabled, because the attribute is the string "false" -->
<sl-button disabled="{{ isDisabled }}">Save</sl-button>

<!-- Right: sets the boolean property -->
<sl-button [disabled]="isDisabled()">Save</sl-button>
```

{% endraw %}

The same applies to numbers, arrays and objects: anything that is not a string must go through property binding.

## Listening to events

Shoelace components emit custom events prefixed with `sl-`. Bind them with ordinary Angular event syntax — hyphens and all.

{% raw %}

```ts
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import '@saipem/design-system/%NPMDIR%/components/input/input.js';
import type SlInput from '@saipem/design-system/%NPMDIR%/components/input/input.component.js';

@Component({
  selector: 'app-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-input label="Search" [value]="term()" (sl-input)="onInput($event)"></sl-input>
    <p>Searching for: {{ term() }}</p>
  `
})
export class SearchComponent {
  readonly term = signal('');

  onInput(event: Event) {
    this.term.set((event.target as SlInput).value);
  }
}
```

{% endraw %}

Events that carry data expose it on `detail`:

```ts
onSelect(event: CustomEvent<{ item: HTMLElement }>) {
  console.log(event.detail.item);
}
```

:::tip
Shoelace events bubble and are composed, so they cross shadow boundaries and can be bound on an ancestor element when that is more convenient.
:::

## Calling methods and reading state

Use a signal-based `viewChild` query and type it with the component class.

```ts
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from '@angular/core';
import '@saipem/design-system/%NPMDIR%/components/drawer/drawer.js';
import type SlDrawer from '@saipem/design-system/%NPMDIR%/components/drawer/drawer.component.js';

@Component({
  selector: 'app-drawer-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-button (click)="open()">Open drawer</sl-button>
    <sl-drawer #drawer label="Drawer">Content</sl-drawer>
  `
})
export class DrawerExampleComponent {
  private readonly drawer = viewChild.required<ElementRef<SlDrawer>>('drawer');

  open() {
    void this.drawer().nativeElement.show();
  }
}
```

:::tip
On Angular 16 and earlier, use `@ViewChild('drawer') drawer!: ElementRef<SlDrawer>;` instead. The rest is identical.
:::

## Forms

Angular's built-in value accessors only match native form controls, so `[(ngModel)]` and `formControlName` do **not** work out of the box on `<sl-input>`, `<sl-select>`, `<sl-checkbox>` and friends. Add this directive once and they will.

```ts
// shoelace-value-accessor.directive.ts
import { Directive, ElementRef, forwardRef, HostListener, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type ShoelaceControl = HTMLElement & { value?: unknown; checked?: boolean; disabled?: boolean };

@Directive({
  selector:
    'sl-input[ngModel], sl-input[formControl], sl-input[formControlName],' +
    'sl-textarea[ngModel], sl-textarea[formControl], sl-textarea[formControlName],' +
    'sl-select[ngModel], sl-select[formControl], sl-select[formControlName],' +
    'sl-radio-group[ngModel], sl-radio-group[formControl], sl-radio-group[formControlName],' +
    'sl-range[ngModel], sl-range[formControl], sl-range[formControlName],' +
    'sl-checkbox[ngModel], sl-checkbox[formControl], sl-checkbox[formControlName],' +
    'sl-switch[ngModel], sl-switch[formControl], sl-switch[formControlName]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShoelaceValueAccessor),
      multi: true
    }
  ]
})
export class ShoelaceValueAccessor implements ControlValueAccessor {
  private readonly element = inject<ElementRef<ShoelaceControl>>(ElementRef).nativeElement;
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  /** `sl-checkbox` and `sl-switch` carry their state on `checked`, every other control uses `value`. */
  private get usesChecked() {
    const tag = this.element.tagName.toLowerCase();
    return tag === 'sl-checkbox' || tag === 'sl-switch';
  }

  @HostListener('sl-change')
  @HostListener('sl-input')
  handleChange() {
    this.onChange(this.usesChecked ? this.element.checked : this.element.value);
  }

  @HostListener('sl-blur')
  handleBlur() {
    this.onTouched();
  }

  writeValue(value: unknown) {
    if (this.usesChecked) {
      this.element.checked = Boolean(value);
    } else {
      this.element.value = value ?? '';
    }
  }

  registerOnChange(fn: (value: unknown) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.element.disabled = isDisabled;
  }
}
```

Import the directive in the standalone component and both forms APIs behave normally:

```ts
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShoelaceValueAccessor } from './shoelace-value-accessor.directive';
import '@saipem/design-system/%NPMDIR%/components/input/input.js';

@Component({
  selector: 'app-signup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ShoelaceValueAccessor],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-input label="Email" type="email" [formControl]="email"></sl-input>
    @if (email.touched && email.invalid) {
      <sl-alert variant="danger" open>Enter a valid email address.</sl-alert>
    }
  `
})
export class SignupComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
}
```

:::tip
Shoelace components also participate in **native** form submission through the `form` attribute and the ElementInternals API. If you only need a plain `<form>` POST, you do not need the directive at all.
:::

## Server-side rendering

Custom elements are a browser feature. Under Angular SSR the Shoelace imports must not run on the server, and the markup must not be hydrated before the elements are defined.

```ts
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-client-only',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @if (isBrowser) {
      <sl-button variant="primary">Click me</sl-button>
    }
  `
})
export class ClientOnlyComponent {
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    if (this.isBrowser) {
      void import('@saipem/design-system/%NPMDIR%/components/button/button.js');
    }
  }
}
```

A `@defer (on viewport)` block around the Shoelace markup achieves the same thing and keeps the component out of the initial bundle.

## Styling

Shoelace components expose [CSS parts](/getting-started/customizing#css-parts) and [custom properties](/getting-started/customizing#custom-properties). Angular's view encapsulation rewrites selectors, so target parts either from the global stylesheet or with `::ng-deep` scoped under a host class.

```css
/* src/styles.css — global, no encapsulation to work around */
sl-button.app-cta::part(base) {
  border-radius: 999px;
}
```

Custom properties cross the shadow boundary and need no special handling:

```html
<sl-button style="--sl-input-height-medium: 3rem">Tall button</sl-button>
```

## Common pitfalls

- **`'sl-x' is not a known element`** — the component is missing `CUSTOM_ELEMENTS_SCHEMA`, or the `import` that registers the element was never executed.
- **A boolean attribute has no effect** — you used {% raw %}`attr="{{ expr }}"`{% endraw %} instead of `[attr]="expr"`. See [Binding properties](#binding-properties).
- **`[(ngModel)]` does nothing** — add the [value accessor directive](#forms).
- **Icons do not appear** — `setBasePath()` was not called, or was called after the first component rendered.
- **The view does not update after an event** — in a zoneless app, make sure the state you mutate is a signal, or the component is bound to something Angular tracks.
