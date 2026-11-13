---
meta:
  title: Textarea
  description: Textareas collect data from the user and allow multiple lines of text.
layout: component
---

```html:preview
<sl-textarea></sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => <SlTextarea />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-textarea></sl-textarea>`
})
export class TextareaExampleComponent {}
```

:::tip
This component works with standard `<form>` elements. Please refer to the section on [form controls](/getting-started/form-controls) to learn more about form submission and client-side validation.
:::

## Examples

### Labels

Use the `label` attribute to give the textarea an accessible label. For labels that contain HTML, use the `label` slot instead.

```html:preview
<sl-textarea label="Comments"></sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => <SlTextarea label="Comments" />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-labels-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-textarea label="Comments"></sl-textarea>`
})
export class TextareaLabelsExampleComponent {}
```

### Help Text

Add descriptive help text to a textarea with the `help-text` attribute. For help texts that contain HTML, use the `help-text` slot instead.

```html:preview
<sl-textarea label="Feedback" help-text="Please tell us what you think."> </sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => <SlTextarea label="Feedback" help-text="Please tell us what you think." />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-help-text-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-textarea label="Feedback" help-text="Please tell us what you think."> </sl-textarea>`
})
export class TextareaHelpTextExampleComponent {}
```

### Rows

Use the `rows` attribute to change the number of text rows that get shown.

```html:preview
<sl-textarea rows="2"></sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => <SlTextarea rows={2} />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-rows-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-textarea rows="2"></sl-textarea>`
})
export class TextareaRowsExampleComponent {}
```

### Placeholders

Use the `placeholder` attribute to add a placeholder.

```html:preview
<sl-textarea placeholder="Type something"></sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => <SlTextarea placeholder="Type something" />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-placeholders-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-textarea placeholder="Type something"></sl-textarea>`
})
export class TextareaPlaceholdersExampleComponent {}
```

### Filled Textareas

Add the `filled` attribute to draw a filled textarea.

```html:preview
<sl-textarea placeholder="Type something" filled></sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => <SlTextarea placeholder="Type something" filled />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-filled-textareas-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-textarea placeholder="Type something" filled></sl-textarea>`
})
export class TextareaFilledTextareasExampleComponent {}
```

### Status

Use the `status` attribute to show the outcome of a validation on a textarea. It colors the border, the focus ring, and the help text. Use `danger` for errors.

```html:preview
<sl-textarea label="Success" help-text="Looks good." status="success"></sl-textarea>
<br />
<sl-textarea label="Warning" help-text="Double-check this value." status="warning"></sl-textarea>
<br />
<sl-textarea label="Error" help-text="This field is required." status="danger"></sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => (
  <>
    <SlTextarea label="Success" help-text="Looks good." status="success" />
    <br />
    <SlTextarea label="Warning" help-text="Double-check this value." status="warning" />
    <br />
    <SlTextarea label="Error" help-text="This field is required." status="danger" />
  </>
);
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-status-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-textarea label="Success" help-text="Looks good." status="success"></sl-textarea>
    <br />
    <sl-textarea label="Warning" help-text="Double-check this value." status="warning"></sl-textarea>
    <br />
    <sl-textarea label="Error" help-text="This field is required." status="danger"></sl-textarea>
  `
})
export class TextareaStatusExampleComponent {}
```

### Disabled

Use the `disabled` attribute to disable a textarea.

```html:preview
<sl-textarea placeholder="Textarea" disabled></sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => <SlTextarea placeholder="Textarea" disabled />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-disabled-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-textarea placeholder="Textarea" disabled></sl-textarea>`
})
export class TextareaDisabledExampleComponent {}
```

### Sizes

Use the `size` attribute to change a textarea's size.

```html:preview
<sl-textarea placeholder="Small" size="small"></sl-textarea>
<br />
<sl-textarea placeholder="Medium" size="medium"></sl-textarea>
<br />
<sl-textarea placeholder="Large" size="large"></sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => (
  <>
    <SlTextarea placeholder="Small" size="small"></SlTextarea>
    <br />
    <SlTextarea placeholder="Medium" size="medium"></SlTextarea>
    <br />
    <SlTextarea placeholder="Large" size="large"></SlTextarea>
  </>
);
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-sizes-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-textarea placeholder="Small" size="small"></sl-textarea>
    <br />
    <sl-textarea placeholder="Medium" size="medium"></sl-textarea>
    <br />
    <sl-textarea placeholder="Large" size="large"></sl-textarea>
  `
})
export class TextareaSizesExampleComponent {}
```

### Prevent Resizing

By default, textareas can be resized vertically by the user. To prevent resizing, set the `resize` attribute to `none`.

```html:preview
<sl-textarea resize="none"></sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => <SlTextarea resize="none" />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-prevent-resizing-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-textarea resize="none"></sl-textarea>`
})
export class TextareaPreventResizingExampleComponent {}
```

### Expand with Content

Textareas will automatically resize to expand to fit their content when `resize` is set to `auto`.

```html:preview
<sl-textarea resize="auto"></sl-textarea>
```

```jsx:react
import SlTextarea from '@saipem/design-system/dist/react/textarea';

const App = () => <SlTextarea resize="auto" />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/textarea/textarea.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-expand-with-content-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-textarea resize="auto"></sl-textarea>`
})
export class TextareaExpandWithContentExampleComponent {}
```
