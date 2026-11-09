---
meta:
  title: Checkbox
  description: Checkboxes allow the user to toggle an option on or off.
layout: component
---

```html:preview
<sl-checkbox>Checkbox</sl-checkbox>
```

```jsx:react
import SlCheckbox from '@shoelace-style/shoelace/dist/react/checkbox';

const App = () => <SlCheckbox>Checkbox</SlCheckbox>;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/checkbox/checkbox.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-checkbox-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-checkbox>Checkbox</sl-checkbox>`
})
export class CheckboxExampleComponent {}
```

:::tip
This component works with standard `<form>` elements. Please refer to the section on [form controls](/getting-started/form-controls) to learn more about form submission and client-side validation.
:::

## Examples

### Checked

Use the `checked` attribute to activate the checkbox.

```html:preview
<sl-checkbox checked>Checked</sl-checkbox>
```

```jsx:react
import SlCheckbox from '@shoelace-style/shoelace/dist/react/checkbox';

const App = () => <SlCheckbox checked>Checked</SlCheckbox>;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/checkbox/checkbox.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-checkbox-checked-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-checkbox checked>Checked</sl-checkbox>`
})
export class CheckboxCheckedExampleComponent {}
```

### Indeterminate

Use the `indeterminate` attribute to make the checkbox indeterminate.

```html:preview
<sl-checkbox indeterminate>Indeterminate</sl-checkbox>
```

```jsx:react
import SlCheckbox from '@shoelace-style/shoelace/dist/react/checkbox';

const App = () => <SlCheckbox indeterminate>Indeterminate</SlCheckbox>;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/checkbox/checkbox.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-checkbox-indeterminate-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-checkbox indeterminate>Indeterminate</sl-checkbox>`
})
export class CheckboxIndeterminateExampleComponent {}
```

### Disabled

Use the `disabled` attribute to disable the checkbox.

```html:preview
<sl-checkbox disabled>Disabled</sl-checkbox>
```

```jsx:react
import SlCheckbox from '@shoelace-style/shoelace/dist/react/checkbox';

const App = () => <SlCheckbox disabled>Disabled</SlCheckbox>;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/checkbox/checkbox.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-checkbox-disabled-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-checkbox disabled>Disabled</sl-checkbox>`
})
export class CheckboxDisabledExampleComponent {}
```

### Sizes

Use the `size` attribute to change a checkbox's size.

```html:preview
<sl-checkbox size="small">Small</sl-checkbox>
<br />
<sl-checkbox size="medium">Medium</sl-checkbox>
<br />
<sl-checkbox size="large">Large</sl-checkbox>
```

```jsx:react
import SlCheckbox from '@shoelace-style/shoelace/dist/react/checkbox';

const App = () => (
  <>
    <SlCheckbox size="small">Small</SlCheckbox>
    <br />
    <SlCheckbox size="medium">Medium</SlCheckbox>
    <br />
    <SlCheckbox size="large">Large</SlCheckbox>
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/checkbox/checkbox.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-checkbox-sizes-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-checkbox size="small">Small</sl-checkbox>
    <br />
    <sl-checkbox size="medium">Medium</sl-checkbox>
    <br />
    <sl-checkbox size="large">Large</sl-checkbox>
  `
})
export class CheckboxSizesExampleComponent {}
```

### Help Text

Add descriptive help text to a switch with the `help-text` attribute. For help texts that contain HTML, use the `help-text` slot instead.

```html:preview
<sl-checkbox help-text="What should the user know about the checkbox?">Label</sl-checkbox>
```

```jsx:react
import SlCheckbox from '@shoelace-style/shoelace/dist/react/checkbox';

const App = () => <SlCheckbox help-text="What should the user know about the switch?">Label</SlCheckbox>;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/checkbox/checkbox.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-checkbox-help-text-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-checkbox help-text="What should the user know about the checkbox?">Label</sl-checkbox>`
})
export class CheckboxHelpTextExampleComponent {}
```

### Custom Validity

Use the `setCustomValidity()` method to set a custom validation message. This will prevent the form from submitting and make the browser display the error message you provide. To clear the error, call this function with an empty string.

```html:preview
<form class="custom-validity">
  <sl-checkbox>Check me</sl-checkbox>
  <br />
  <sl-button type="submit" variant="primary" style="margin-top: 1rem;">Submit</sl-button>
</form>
<script>
  const form = document.querySelector('.custom-validity');
  const checkbox = form.querySelector('sl-checkbox');
  const errorMessage = `Don't forget to check me!`;

  // Set initial validity as soon as the element is defined
  customElements.whenDefined('sl-checkbox').then(async () => {
    await checkbox.updateComplete;
    checkbox.setCustomValidity(errorMessage);
  });

  // Update validity on change
  checkbox.addEventListener('sl-change', () => {
    checkbox.setCustomValidity(checkbox.checked ? '' : errorMessage);
  });

  // Handle submit
  form.addEventListener('submit', event => {
    event.preventDefault();
    alert('All fields are valid!');
  });
</script>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/button/button.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/checkbox/checkbox.js';
import { afterNextRender, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from '@angular/core';
import type SlCheckbox from '@shoelace-style/shoelace/%NPMDIR%/components/checkbox/checkbox.component.js';

const ERROR_MESSAGE = `Don't forget to check me!`;

@Component({
  selector: 'app-checkbox-custom-validity-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <form (submit)="onSubmit($event)">
      <sl-checkbox #checkbox (sl-change)="syncValidity()">Check me</sl-checkbox>
      <br />
      <sl-button type="submit" variant="primary" style="margin-top: 1rem;">Submit</sl-button>
    </form>
  `
})
export class CheckboxCustomValidityExampleComponent {
  private readonly checkbox = viewChild.required<ElementRef<SlCheckbox>>('checkbox');

  constructor() {
    // The element has to be upgraded and rendered before its validity can be set.
    afterNextRender(async () => {
      await this.checkbox().nativeElement.updateComplete;
      this.syncValidity();
    });
  }

  syncValidity() {
    const checkbox = this.checkbox().nativeElement;
    checkbox.setCustomValidity(checkbox.checked ? '' : ERROR_MESSAGE);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    alert('All fields are valid!');
  }
}
```

{% raw %}

```jsx:react
import { useEffect, useRef } from 'react';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import SlCheckbox from '@shoelace-style/shoelace/dist/react/checkbox';

const App = () => {
  const checkbox = useRef(null);
  const errorMessage = `Don't forget to check me!`;

  function handleChange() {
    checkbox.current.setCustomValidity(checkbox.current.checked ? '' : errorMessage);
  }

  function handleSubmit(event) {
    event.preventDefault();
    alert('All fields are valid!');
  }

  useEffect(() => {
    checkbox.current.setCustomValidity(errorMessage);
  }, []);

  return (
    <form class="custom-validity" onSubmit={handleSubmit}>
      <SlCheckbox ref={checkbox} onSlChange={handleChange}>
        Check me
      </SlCheckbox>
      <br />
      <SlButton type="submit" variant="primary" style={{ marginTop: '1rem' }}>
        Submit
      </SlButton>
    </form>
  );
};
```

{% endraw %}
