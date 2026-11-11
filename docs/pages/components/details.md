---
meta:
  title: Details
  description: Details show a brief summary and expand to show additional content.
layout: component
---

<!-- cspell:dictionaries lorem-ipsum -->

```html:preview
<sl-details summary="Toggle Me">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</sl-details>
```

```jsx:react
import SlDetails from '@shoelace-style/shoelace/dist/react/details';

const App = () => (
  <SlDetails summary="Toggle Me">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </SlDetails>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/details/details.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-details-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-details summary="Toggle Me">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
      aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </sl-details>
  `
})
export class DetailsExampleComponent {}
```

## Examples

### Disabled

Use the `disable` attribute to prevent the details from expanding.

```html:preview
<sl-details summary="Disabled" disabled>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</sl-details>
```

```jsx:react
import SlDetails from '@shoelace-style/shoelace/dist/react/details';

const App = () => (
  <SlDetails summary="Disabled" disabled>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </SlDetails>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/details/details.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-details-disabled-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-details summary="Disabled" disabled>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
      aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </sl-details>
  `
})
export class DetailsDisabledExampleComponent {}
```

### Customizing the Summary Icon

Use the `expand-icon` and `collapse-icon` slots to change the expand and collapse icons, respectively. To disable the animation, override the `rotate` property on the `summary-icon` part as shown below.

```html:preview
<sl-details summary="Toggle Me" class="custom-icons">
  <sl-icon name="plus-square" slot="expand-icon"></sl-icon>
  <sl-icon name="dash-square" slot="collapse-icon"></sl-icon>

  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</sl-details>

<style>
  sl-details.custom-icons::part(summary-icon) {
    /* Disable the expand/collapse animation */
    rotate: none;
  }
</style>
```

```jsx:react
import SlDetails from '@shoelace-style/shoelace/dist/react/details';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';

const css = `
  sl-details.custom-icon::part(summary-icon) {
    /* Disable the expand/collapse animation */
    rotate: none;
  }
`;

const App = () => (
  <>
    <SlDetails summary="Toggle Me" class="custom-icon">
      <SlIcon name="plus-square" slot="expand-icon" />
      <SlIcon name="dash-square" slot="collapse-icon" />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat.
    </SlDetails>

    <style>{css}</style>
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/details/details.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-details-customizing-the-summary-icon-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    sl-details.custom-icons::part(summary-icon) {
        /* Disable the expand/collapse animation */
        rotate: none;
      }
  `,
  template: `
    <sl-details summary="Toggle Me" class="custom-icons">
      <sl-icon name="plus-square" slot="expand-icon"></sl-icon>
      <sl-icon name="dash-square" slot="collapse-icon"></sl-icon>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
      aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </sl-details>
  `
})
export class DetailsCustomizingTheSummaryIconExampleComponent {}
```

### Grouping Details

Details are designed to function independently, but you can simulate a group or "accordion" where only one is shown at a time by listening for the `sl-show` event.

```html:preview
<div class="details-group-example">
  <sl-details summary="First" open>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </sl-details>

  <sl-details summary="Second">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </sl-details>

  <sl-details summary="Third">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </sl-details>
</div>

<script>
  const container = document.querySelector('.details-group-example');

  // Close all other details when one is shown
  container.addEventListener('sl-show', event => {
    if (event.target.localName === 'sl-details') {
      [...container.querySelectorAll('sl-details')].map(details => (details.open = event.target === details));
    }
  });
</script>

<style>
  .details-group-example sl-details:not(:last-of-type) {
    margin-bottom: var(--sl-spacing-2x-small);
  }
</style>
```

{% raw %}

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/details/details.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

const BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ' +
  'dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ' +
  'ea commodo consequat.';

@Component({
  selector: 'app-details-grouping-details-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    sl-details:not(:last-of-type) {
      margin-bottom: var(--sl-spacing-2x-small);
    }
  `,
  template: `
    @for (summary of summaries; track summary) {
      <sl-details
        [summary]="summary"
        [open]="openSummary() === summary"
        (sl-show)="openSummary.set(summary)"
        (sl-hide)="handleHide(summary)"
      >
        {{ body }}
      </sl-details>
    }
  `
})
export class DetailsGroupingDetailsExampleComponent {
  readonly summaries = ['First', 'Second', 'Third'];
  readonly body = BODY;

  /** One signal holds the whole accordion: opening one closes the others through the `open` binding. */
  readonly openSummary = signal<string | null>('First');

  handleHide(summary: string) {
    // Only clear it when the panel that closed is still the one marked as open, otherwise the sl-hide fired by
    // the previously open panel would immediately close the new one.
    if (this.openSummary() === summary) {
      this.openSummary.set(null);
    }
  }
}
```

{% endraw %}
