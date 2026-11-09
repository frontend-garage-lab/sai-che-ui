---
meta:
  title: Spinner
  description: Spinners are used to show the progress of an indeterminate operation.
layout: component
---

```html:preview
<sl-spinner></sl-spinner>
```

```jsx:react
import SlSpinner from '@shoelace-style/shoelace/dist/react/spinner';

const App = () => <SlSpinner />;
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/spinner/spinner.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-spinner-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-spinner></sl-spinner>`
})
export class SpinnerExampleComponent {}
```

## Examples

### Size

Spinners are sized based on the current font size. To change their size, set the `font-size` property on the spinner itself or on a parent element as shown below.

```html:preview
<sl-spinner></sl-spinner>
<sl-spinner style="font-size: 2rem;"></sl-spinner>
<sl-spinner style="font-size: 3rem;"></sl-spinner>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/spinner/spinner.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-spinner-size-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-spinner></sl-spinner>
    <sl-spinner style="font-size: 2rem;"></sl-spinner>
    <sl-spinner style="font-size: 3rem;"></sl-spinner>
  `
})
export class SpinnerSizeExampleComponent {}
```

{% raw %}

```jsx:react
import SlSpinner from '@shoelace-style/shoelace/dist/react/spinner';

const App = () => (
  <>
    <SlSpinner />
    <SlSpinner style={{ fontSize: '2rem' }} />
    <SlSpinner style={{ fontSize: '3rem' }} />
  </>
);
```

{% endraw %}

### Track Width

The width of the spinner's track can be changed by setting the `--track-width` custom property.

```html:preview
<sl-spinner style="font-size: 50px; --track-width: 10px;"></sl-spinner>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/spinner/spinner.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-spinner-track-width-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-spinner style="font-size: 50px; --track-width: 10px;"></sl-spinner>`
})
export class SpinnerTrackWidthExampleComponent {}
```

{% raw %}

```jsx:react
import SlSpinner from '@shoelace-style/shoelace/dist/react/spinner';

const App = () => (
  <SlSpinner
    style={{
      fontSize: '3rem',
      '--track-width': '6px'
    }}
  />
);
```

{% endraw %}

### Color

The spinner's colors can be changed by setting the `--indicator-color` and `--track-color` custom properties.

```html:preview
<sl-spinner style="font-size: 3rem; --indicator-color: deeppink; --track-color: pink;"></sl-spinner>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/spinner/spinner.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-spinner-color-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-spinner style="font-size: 3rem; --indicator-color: deeppink; --track-color: pink;"></sl-spinner>`
})
export class SpinnerColorExampleComponent {}
```

{% raw %}

```jsx:react
import SlSpinner from '@shoelace-style/shoelace/dist/react/spinner';

const App = () => (
  <SlSpinner
    style={{
      fontSize: '3rem',
      '--indicator-color': 'deeppink',
      '--track-color': 'pink'
    }}
  />
);
```

{% endraw %}
