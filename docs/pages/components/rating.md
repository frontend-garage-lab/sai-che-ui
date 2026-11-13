---
meta:
  title: Rating
  description: Ratings give users a way to quickly view and provide feedback.
layout: component
---

```html:preview
<sl-rating label="Rating"></sl-rating>
```

```jsx:react
import SlRating from '@saipem/design-system/dist/react/rating';

const App = () => <SlRating label="Rating" />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/rating/rating.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-rating-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-rating label="Rating"></sl-rating>`
})
export class RatingExampleComponent {}
```

## Examples

### Labels

Ratings are commonly identified contextually, so labels aren't displayed. However, you should always provide one for assistive devices using the `label` attribute.

```html:preview
<sl-rating label="Rate this component"></sl-rating>
```

```jsx:react
import SlRating from '@saipem/design-system/dist/react/rating';

const App = () => <SlRating label="Rate this component" />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/rating/rating.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-rating-labels-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-rating label="Rate this component"></sl-rating>`
})
export class RatingLabelsExampleComponent {}
```

### Maximum Value

Ratings are 0-5 by default. To change the maximum possible value, use the `max` attribute.

```html:preview
<sl-rating label="Rating" max="3"></sl-rating>
```

```jsx:react
import SlRating from '@saipem/design-system/dist/react/rating';

const App = () => <SlRating label="Rating" max={3} />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/rating/rating.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-rating-maximum-value-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-rating label="Rating" max="3"></sl-rating>`
})
export class RatingMaximumValueExampleComponent {}
```

### Precision

Use the `precision` attribute to let users select fractional ratings.

```html:preview
<sl-rating label="Rating" precision="0.5" value="2.5"></sl-rating>
```

```jsx:react
import SlRating from '@saipem/design-system/dist/react/rating';

const App = () => <SlRating label="Rating" precision={0.5} value={2.5} />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/rating/rating.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-rating-precision-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-rating label="Rating" precision="0.5" value="2.5"></sl-rating>`
})
export class RatingPrecisionExampleComponent {}
```

### Symbol Sizes

Set the `--symbol-size` custom property to adjust the size.

```html:preview
<sl-rating label="Rating" style="--symbol-size: 2rem;"></sl-rating>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/rating/rating.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-rating-symbol-sizes-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-rating label="Rating" style="--symbol-size: 2rem;"></sl-rating>`
})
export class RatingSymbolSizesExampleComponent {}
```

{% raw %}

```jsx:react
import SlRating from '@saipem/design-system/dist/react/rating';

const App = () => <SlRating label="Rating" style={{ '--symbol-size': '2rem' }} />;
```

{% endraw %}

### Readonly

Use the `readonly` attribute to display a rating that users can't change.

```html:preview
<sl-rating label="Rating" readonly value="3"></sl-rating>
```

```jsx:react
import SlRating from '@saipem/design-system/dist/react/rating';

const App = () => <SlRating label="Rating" readonly value={3} />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/rating/rating.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-rating-readonly-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-rating label="Rating" readonly value="3"></sl-rating>`
})
export class RatingReadonlyExampleComponent {}
```

### Disabled

Use the `disable` attribute to disable the rating.

```html:preview
<sl-rating label="Rating" disabled value="3"></sl-rating>
```

```jsx:react
import SlRating from '@saipem/design-system/dist/react/rating';

const App = () => <SlRating label="Rating" disabled value={3} />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/rating/rating.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-rating-disabled-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-rating label="Rating" disabled value="3"></sl-rating>`
})
export class RatingDisabledExampleComponent {}
```

### Detecting Hover

Use the `sl-hover` event to detect when the user hovers over (or touch and drag) the rating. This lets you hook into values as the user interacts with the rating, but before they select a value.

The event has a payload with `phase` and `value` properties. The `phase` property tells when hovering starts, moves to a new value, and ends. The `value` property tells what the rating's value would be if the user were to commit to the hovered value.

```html:preview
<div class="detect-hover">
  <sl-rating label="Rating"></sl-rating>
  <span></span>
</div>

<script>
  const rating = document.querySelector('.detect-hover > sl-rating');
  const span = rating.nextElementSibling;
  const terms = ['No rating', 'Terrible', 'Bad', 'OK', 'Good', 'Excellent'];

  rating.addEventListener('sl-hover', event => {
    span.textContent = terms[event.detail.value];

    // Clear feedback when hovering stops
    if (event.detail.phase === 'end') {
      span.textContent = '';
    }
  });
</script>

<style>
  .detect-hover span {
    position: relative;
    top: -4px;
    left: 8px;
    border-radius: var(--sl-border-radius-small);
    background: var(--sl-color-neutral-900);
    color: var(--sl-color-neutral-0);
    text-align: center;
    padding: 4px 6px;
  }

  .detect-hover span:empty {
    display: none;
  }
</style>
```

```jsx:react
import { useState } from 'react';
import SlRating from '@saipem/design-system/dist/react/rating';

const terms = ['No rating', 'Terrible', 'Bad', 'OK', 'Good', 'Excellent'];
const css = `
  .detect-hover span {
    position: relative;
    top: -4px;
    left: 8px;
    border-radius: var(--sl-border-radius-small);
    background: var(--sl-color-neutral-900);
    color: var(--sl-color-neutral-0);
    text-align: center;
    padding: 4px 6px;
  }

  .detect-hover span:empty {
    display: none;
  }
`;

function handleHover(event) {
  rating.addEventListener('sl-hover', event => {
    setFeedback(terms[event.detail.value]);

    // Clear feedback when hovering stops
    if (event.detail.phase === 'end') {
      setFeedback('');
    }
  });
}

const App = () => {
  const [feedback, setFeedback] = useState(true);

  return (
    <>
      <div class="detect-hover">
        <SlRating label="Rating" onSlHover={handleHover} />
        <span>{feedback}</span>
      </div>
      <style>{css}</style>
    </>
  );
};
```

{% raw %}

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/rating/rating.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

const TERMS = ['No rating', 'Terrible', 'Bad', 'OK', 'Good', 'Excellent'];

@Component({
  selector: 'app-rating-detect-hover-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    span {
      position: relative;
      top: -4px;
      left: 8px;
      border-radius: var(--sl-border-radius-small);
      background: var(--sl-color-neutral-900);
      color: var(--sl-color-neutral-0);
      text-align: center;
      padding: 4px 6px;
    }

    span:empty {
      display: none;
    }
  `,
  template: `
    <sl-rating label="Rating" (sl-hover)="onHover($event)"></sl-rating>
    <span>{{ term() }}</span>
  `
})
export class RatingDetectHoverExampleComponent {
  readonly term = signal('');

  onHover(event: Event) {
    const { phase, value } = (event as CustomEvent<{ phase: string; value: number }>).detail;
    this.term.set(phase === 'end' ? '' : (TERMS[value] ?? ''));
  }
}
```

{% endraw %}

### Custom Icons

You can provide custom icons by passing a function to the `getSymbol` property.

```html:preview
<sl-rating label="Rating" class="rating-hearts" style="--symbol-color-active: #ff4136;"></sl-rating>

<script>
  const rating = document.querySelector('.rating-hearts');
  rating.getSymbol = () => '<sl-icon name="heart-fill"></sl-icon>';
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/rating/rating.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-rating-hearts-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // `getSymbol` is a function, so it has to go through property binding.
  template: `
    <sl-rating label="Rating" [getSymbol]="heart" style="--symbol-color-active: #ff4136;"></sl-rating>
  `
})
export class RatingHeartsExampleComponent {
  readonly heart = () => '<sl-icon name="heart-fill"></sl-icon>';
}
```

{% raw %}

```jsx:react
import SlRating from '@saipem/design-system/dist/react/rating';

const App = () => (
  <SlRating
    label="Rating"
    getSymbol={() => '<sl-icon name="heart-fill"></sl-icon>'}
    style={{ '--symbol-color-active': '#ff4136' }}
  />
);
```

{% endraw %}

### Value-based Icons

You can also use the `getSymbol` property to render different icons based on value.

```html:preview
<sl-rating label="Rating" class="rating-emojis"></sl-rating>

<script>
  const rating = document.querySelector('.rating-emojis');

  rating.getSymbol = value => {
    const icons = ['emoji-angry', 'emoji-frown', 'emoji-expressionless', 'emoji-smile', 'emoji-laughing'];
    return `<sl-icon name="${icons[value - 1]}"></sl-icon>`;
  };
</script>
```

```jsx:react
import SlRating from '@saipem/design-system/dist/react/rating';

function getSymbol(value) {
  const icons = ['emoji-angry', 'emoji-frown', 'emoji-expressionless', 'emoji-smile', 'emoji-laughing'];
  return `<sl-icon name="${icons[value - 1]}"></sl-icon>`;
}

const App = () => <SlRating label="Rating" getSymbol={getSymbol} />;
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/rating/rating.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const ICONS = ['emoji-angry', 'emoji-frown', 'emoji-expressionless', 'emoji-smile', 'emoji-laughing'];

@Component({
  selector: 'app-rating-emojis-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-rating label="Rating" [getSymbol]="emoji"></sl-rating>`
})
export class RatingEmojisExampleComponent {
  readonly emoji = (value: number) => `<sl-icon name="${ICONS[value - 1]}"></sl-icon>`;
}
```
