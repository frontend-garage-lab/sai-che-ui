---
meta:
  title: Input
  description: Inputs collect data from the user.
layout: component
---

```html:preview
<sl-input></sl-input>
```

```jsx:react
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => <SlInput />;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-input></sl-input>`
})
export class InputExampleComponent {}
```

:::tip
This component works with standard `<form>` elements. Please refer to the section on [form controls](/getting-started/form-controls) to learn more about form submission and client-side validation.
:::

## Examples

### Labels

Use the `label` attribute to give the input an accessible label. For labels that contain HTML, use the `label` slot instead.

```html:preview
<sl-input label="What is your name?"></sl-input>
```

```jsx:react
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => <SlInput label="What is your name?" />;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-labels-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-input label="What is your name?"></sl-input>`
})
export class InputLabelsExampleComponent {}
```

### Help Text

Add descriptive help text to an input with the `help-text` attribute. For help texts that contain HTML, use the `help-text` slot instead.

```html:preview
<sl-input label="Nickname" help-text="What would you like people to call you?"></sl-input>
```

```jsx:react
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => <SlInput label="Nickname" help-text="What would you like people to call you?" />;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-help-text-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-input label="Nickname" help-text="What would you like people to call you?"></sl-input>`
})
export class InputHelpTextExampleComponent {}
```

### Placeholders

Use the `placeholder` attribute to add a placeholder.

```html:preview
<sl-input placeholder="Type something"></sl-input>
```

```jsx:react
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => <SlInput placeholder="Type something" />;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-placeholders-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-input placeholder="Type something"></sl-input>`
})
export class InputPlaceholdersExampleComponent {}
```

### Clearable

Add the `clearable` attribute to add a clear button when the input has content.

```html:preview
<sl-input placeholder="Clearable" clearable></sl-input>
```

```jsx:react
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => <SlInput placeholder="Clearable" clearable />;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-clearable-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-input placeholder="Clearable" clearable></sl-input>`
})
export class InputClearableExampleComponent {}
```

### Toggle Password

Add the `password-toggle` attribute to add a toggle button that will show the password when activated.

```html:preview
<sl-input type="password" placeholder="Password Toggle" password-toggle></sl-input>
```

```jsx:react
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => <SlInput type="password" placeholder="Password Toggle" size="medium" password-toggle />;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-toggle-password-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-input type="password" placeholder="Password Toggle" password-toggle></sl-input>`
})
export class InputTogglePasswordExampleComponent {}
```

### Filled Inputs

Add the `filled` attribute to draw a filled input.

```html:preview
<sl-input placeholder="Type something" filled></sl-input>
```

```jsx:react
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => <SlInput placeholder="Type something" filled />;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-filled-inputs-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-input placeholder="Type something" filled></sl-input>`
})
export class InputFilledInputsExampleComponent {}
```

### Status

Use the `status` attribute to show the outcome of a validation on an input. It colors the border, the focus ring, and the help text. Use `danger` for errors.

```html:preview
<sl-input label="Success" help-text="Looks good." status="success"></sl-input>
<br />
<sl-input label="Warning" help-text="Double-check this value." status="warning"></sl-input>
<br />
<sl-input label="Error" help-text="This field is required." status="danger"></sl-input>
```

```jsx:react
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => (
  <>
    <SlInput label="Success" help-text="Looks good." status="success" />
    <br />
    <SlInput label="Warning" help-text="Double-check this value." status="warning" />
    <br />
    <SlInput label="Error" help-text="This field is required." status="danger" />
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-status-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-input label="Success" help-text="Looks good." status="success"></sl-input>
    <br />
    <sl-input label="Warning" help-text="Double-check this value." status="warning"></sl-input>
    <br />
    <sl-input label="Error" help-text="This field is required." status="danger"></sl-input>
  `
})
export class InputStatusExampleComponent {}
```

### Disabled

Use the `disabled` attribute to disable an input.

```html:preview
<sl-input placeholder="Disabled" disabled></sl-input>
```

```jsx:react
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => <SlInput placeholder="Disabled" disabled />;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-disabled-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-input placeholder="Disabled" disabled></sl-input>`
})
export class InputDisabledExampleComponent {}
```

### Sizes

Use the `size` attribute to change an input's size.

```html:preview
<sl-input placeholder="Small" size="small"></sl-input>
<br />
<sl-input placeholder="Medium" size="medium"></sl-input>
<br />
<sl-input placeholder="Large" size="large"></sl-input>
```

```jsx:react
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => (
  <>
    <SlInput placeholder="Small" size="small" />
    <br />
    <SlInput placeholder="Medium" size="medium" />
    <br />
    <SlInput placeholder="Large" size="large" />
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-sizes-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-input placeholder="Small" size="small"></sl-input>
    <br />
    <sl-input placeholder="Medium" size="medium"></sl-input>
    <br />
    <sl-input placeholder="Large" size="large"></sl-input>
  `
})
export class InputSizesExampleComponent {}
```

### Pill

Use the `pill` attribute to give inputs rounded edges.

```html:preview
<sl-input placeholder="Small" size="small" pill></sl-input>
<br />
<sl-input placeholder="Medium" size="medium" pill></sl-input>
<br />
<sl-input placeholder="Large" size="large" pill></sl-input>
```

```jsx:react
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => (
  <>
    <SlInput placeholder="Small" size="small" pill />
    <br />
    <SlInput placeholder="Medium" size="medium" pill />
    <br />
    <SlInput placeholder="Large" size="large" pill />
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-pill-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-input placeholder="Small" size="small" pill></sl-input>
    <br />
    <sl-input placeholder="Medium" size="medium" pill></sl-input>
    <br />
    <sl-input placeholder="Large" size="large" pill></sl-input>
  `
})
export class InputPillExampleComponent {}
```

### Input Types

The `type` attribute controls the type of input the browser renders.

```html:preview
<sl-input type="email" placeholder="Email"></sl-input>
<br />
<sl-input type="number" placeholder="Number"></sl-input>
<br />
<sl-input type="date" placeholder="Date"></sl-input>
```

```jsx:react
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => (
  <>
    <SlInput type="email" placeholder="Email" />
    <br />
    <SlInput type="number" placeholder="Number" />
    <br />
    <SlInput type="date" placeholder="Date" />
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-input-types-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-input type="email" placeholder="Email"></sl-input>
    <br />
    <sl-input type="number" placeholder="Number"></sl-input>
    <br />
    <sl-input type="date" placeholder="Date"></sl-input>
  `
})
export class InputInputTypesExampleComponent {}
```

### Prefix & Suffix Icons

Use the `prefix` and `suffix` slots to add icons.

```html:preview
<sl-input placeholder="Small" size="small">
  <sl-icon name="house" slot="prefix"></sl-icon>
  <sl-icon name="chat" slot="suffix"></sl-icon>
</sl-input>
<br />
<sl-input placeholder="Medium" size="medium">
  <sl-icon name="house" slot="prefix"></sl-icon>
  <sl-icon name="chat" slot="suffix"></sl-icon>
</sl-input>
<br />
<sl-input placeholder="Large" size="large">
  <sl-icon name="house" slot="prefix"></sl-icon>
  <sl-icon name="chat" slot="suffix"></sl-icon>
</sl-input>
```

```jsx:react
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';
import SlInput from '@shoelace-style/shoelace/dist/react/input';

const App = () => (
  <>
    <SlInput placeholder="Small" size="small">
      <SlIcon name="house" slot="prefix"></SlIcon>
      <SlIcon name="chat" slot="suffix"></SlIcon>
    </SlInput>
    <br />
    <SlInput placeholder="Medium" size="medium">
      <SlIcon name="house" slot="prefix"></SlIcon>
      <SlIcon name="chat" slot="suffix"></SlIcon>
    </SlInput>
    <br />
    <SlInput placeholder="Large" size="large">
      <SlIcon name="house" slot="prefix"></SlIcon>
      <SlIcon name="chat" slot="suffix"></SlIcon>
    </SlInput>
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-prefix-suffix-icons-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-input placeholder="Small" size="small">
      <sl-icon name="house" slot="prefix"></sl-icon>
      <sl-icon name="chat" slot="suffix"></sl-icon>
    </sl-input>
    <br />
    <sl-input placeholder="Medium" size="medium">
      <sl-icon name="house" slot="prefix"></sl-icon>
      <sl-icon name="chat" slot="suffix"></sl-icon>
    </sl-input>
    <br />
    <sl-input placeholder="Large" size="large">
      <sl-icon name="house" slot="prefix"></sl-icon>
      <sl-icon name="chat" slot="suffix"></sl-icon>
    </sl-input>
  `
})
export class InputPrefixSuffixIconsExampleComponent {}
```

### Customizing Label Position

Use [CSS parts](#css-parts) to customize the way form controls are drawn. This example uses CSS grid to position the label to the left of the control, but the possible orientations are nearly endless. The same technique works for inputs, textareas, radio groups, and similar form controls.

```html:preview
<sl-input class="label-on-left" label="Name" help-text="Enter your name"></sl-input>
<sl-input class="label-on-left" label="Email" type="email" help-text="Enter your email"></sl-input>
<sl-textarea class="label-on-left" label="Bio" help-text="Tell us something about yourself"></sl-textarea>

<style>
  .label-on-left {
    --label-width: 3.75rem;
    --gap-width: 1rem;
  }

  .label-on-left + .label-on-left {
    margin-top: var(--sl-spacing-medium);
  }

  .label-on-left::part(form-control) {
    display: grid;
    grid: auto / var(--label-width) 1fr;
    gap: var(--sl-spacing-3x-small) var(--gap-width);
    align-items: center;
  }

  .label-on-left::part(form-control-label) {
    text-align: right;
  }

  .label-on-left::part(form-control-help-text) {
    grid-column-start: 2;
  }
</style>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/input/input.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-input-customizing-label-position-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .label-on-left {
        --label-width: 3.75rem;
        --gap-width: 1rem;
      }

      .label-on-left + .label-on-left {
        margin-top: var(--sl-spacing-medium);
      }

      .label-on-left::part(form-control) {
        display: grid;
        grid: auto / var(--label-width) 1fr;
        gap: var(--sl-spacing-3x-small) var(--gap-width);
        align-items: center;
      }

      .label-on-left::part(form-control-label) {
        text-align: right;
      }

      .label-on-left::part(form-control-help-text) {
        grid-column-start: 2;
      }
  `,
  template: `
    <sl-input class="label-on-left" label="Name" help-text="Enter your name"></sl-input>
    <sl-input class="label-on-left" label="Email" type="email" help-text="Enter your email"></sl-input>
    <sl-textarea class="label-on-left" label="Bio" help-text="Tell us something about yourself"></sl-textarea>
  `
})
export class InputCustomizingLabelPositionExampleComponent {}
```
