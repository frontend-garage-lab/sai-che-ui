---
meta:
  title: Skeleton
  description: Skeletons are used to provide a visual representation of where content will eventually be drawn.
layout: component
---

These are simple containers for scaffolding layouts that mimic what users will see when content has finished loading. This prevents large areas of empty space during asynchronous operations.

Skeletons try not to be opinionated, as there are endless possibilities for designing layouts. Therefore, you'll likely use more than one skeleton to create the effect you want. If you find yourself using them frequently, consider creating a template that renders them with the desired arrangement and styles.

```html:preview
<div class="skeleton-overview">
  <header>
    <sl-skeleton></sl-skeleton>
    <sl-skeleton></sl-skeleton>
  </header>

  <sl-skeleton></sl-skeleton>
  <sl-skeleton></sl-skeleton>
  <sl-skeleton></sl-skeleton>
</div>

<style>
  .skeleton-overview header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .skeleton-overview header sl-skeleton:last-child {
    flex: 0 0 auto;
    width: 30%;
  }

  .skeleton-overview sl-skeleton {
    margin-bottom: 1rem;
  }

  .skeleton-overview sl-skeleton:nth-child(1) {
    float: left;
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
    vertical-align: middle;
  }

  .skeleton-overview sl-skeleton:nth-child(3) {
    width: 95%;
  }

  .skeleton-overview sl-skeleton:nth-child(4) {
    width: 80%;
  }
</style>
```

```jsx:react
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const css = `
  .skeleton-overview header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .skeleton-overview header sl-skeleton:last-child {
    flex: 0 0 auto;
    width: 30%;
  }

  .skeleton-overview sl-skeleton {
    margin-bottom: 1rem;
  }

  .skeleton-overview sl-skeleton:nth-child(1) {
    float: left;
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
    vertical-align: middle;
  }

  .skeleton-overview sl-skeleton:nth-child(3) {
    width: 95%;
  }

  .skeleton-overview sl-skeleton:nth-child(4) {
    width: 80%;
  }
`;

const App = () => (
  <>
    <div className="skeleton-overview">
      <header>
        <SlSkeleton />
        <SlSkeleton />
      </header>

      <SlSkeleton />
      <SlSkeleton />
      <SlSkeleton />
    </div>

    <style>{css}</style>
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/skeleton/skeleton.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-skeleton-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .skeleton-overview header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
      }

      .skeleton-overview header sl-skeleton:last-child {
        flex: 0 0 auto;
        width: 30%;
      }

      .skeleton-overview sl-skeleton {
        margin-bottom: 1rem;
      }

      .skeleton-overview sl-skeleton:nth-child(1) {
        float: left;
        width: 3rem;
        height: 3rem;
        margin-right: 1rem;
        vertical-align: middle;
      }

      .skeleton-overview sl-skeleton:nth-child(3) {
        width: 95%;
      }

      .skeleton-overview sl-skeleton:nth-child(4) {
        width: 80%;
      }
  `,
  template: `
    <div class="skeleton-overview">
      <header>
        <sl-skeleton></sl-skeleton>
        <sl-skeleton></sl-skeleton>
      </header>

      <sl-skeleton></sl-skeleton>
      <sl-skeleton></sl-skeleton>
      <sl-skeleton></sl-skeleton>
    </div>
  `
})
export class SkeletonExampleComponent {}
```

## Examples

### Effects

There are two built-in effects, `sheen` and `pulse`. Effects are intentionally subtle, as they can be distracting when used extensively. The default is `none`, which displays a static, non-animated skeleton.

```html:preview
<div class="skeleton-effects">
  <sl-skeleton effect="none"></sl-skeleton>
  None

  <sl-skeleton effect="sheen"></sl-skeleton>
  Sheen

  <sl-skeleton effect="pulse"></sl-skeleton>
  Pulse
</div>

<style>
  .skeleton-effects {
    font-size: var(--sl-font-size-small);
  }

  .skeleton-effects sl-skeleton:not(:first-child) {
    margin-top: 1rem;
  }
</style>
```

```jsx:react
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const css = `
  .skeleton-effects {
    font-size: var(--sl-font-size-small);
  }

  .skeleton-effects sl-skeleton:not(:first-child) {
    margin-top: 1rem;
  }
`;

const App = () => (
  <>
    <div className="skeleton-effects">
      <SlSkeleton effect="none" />
      None
      <SlSkeleton effect="sheen" />
      Sheen
      <SlSkeleton effect="pulse" />
      Pulse
    </div>

    <style>{css}</style>
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/skeleton/skeleton.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-skeleton-effects-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .skeleton-effects {
        font-size: var(--sl-font-size-small);
      }

      .skeleton-effects sl-skeleton:not(:first-child) {
        margin-top: 1rem;
      }
  `,
  template: `
    <div class="skeleton-effects">
      <sl-skeleton effect="none"></sl-skeleton>
      None

      <sl-skeleton effect="sheen"></sl-skeleton>
      Sheen

      <sl-skeleton effect="pulse"></sl-skeleton>
      Pulse
    </div>
  `
})
export class SkeletonEffectsExampleComponent {}
```

### Paragraphs

Use multiple skeletons and some clever styles to simulate paragraphs.

```html:preview
<div class="skeleton-paragraphs">
  <sl-skeleton></sl-skeleton>
  <sl-skeleton></sl-skeleton>
  <sl-skeleton></sl-skeleton>
  <sl-skeleton></sl-skeleton>
  <sl-skeleton></sl-skeleton>
</div>

<style>
  .skeleton-paragraphs sl-skeleton {
    margin-bottom: 1rem;
  }

  .skeleton-paragraphs sl-skeleton:nth-child(2) {
    width: 95%;
  }

  .skeleton-paragraphs sl-skeleton:nth-child(4) {
    width: 90%;
  }

  .skeleton-paragraphs sl-skeleton:last-child {
    width: 50%;
  }
</style>
```

```jsx:react
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const css = `
  .skeleton-paragraphs sl-skeleton {
    margin-bottom: 1rem;
  }

  .skeleton-paragraphs sl-skeleton:nth-child(2) {
    width: 95%;
  }

  .skeleton-paragraphs sl-skeleton:nth-child(4) {
    width: 90%;
  }

  .skeleton-paragraphs sl-skeleton:last-child {
    width: 50%;
  }
`;

const App = () => (
  <>
    <div className="skeleton-paragraphs">
      <SlSkeleton />
      <SlSkeleton />
      <SlSkeleton />
      <SlSkeleton />
      <SlSkeleton />
    </div>

    <style>{css}</style>
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/skeleton/skeleton.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-skeleton-paragraphs-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .skeleton-paragraphs sl-skeleton {
        margin-bottom: 1rem;
      }

      .skeleton-paragraphs sl-skeleton:nth-child(2) {
        width: 95%;
      }

      .skeleton-paragraphs sl-skeleton:nth-child(4) {
        width: 90%;
      }

      .skeleton-paragraphs sl-skeleton:last-child {
        width: 50%;
      }
  `,
  template: `
    <div class="skeleton-paragraphs">
      <sl-skeleton></sl-skeleton>
      <sl-skeleton></sl-skeleton>
      <sl-skeleton></sl-skeleton>
      <sl-skeleton></sl-skeleton>
      <sl-skeleton></sl-skeleton>
    </div>
  `
})
export class SkeletonParagraphsExampleComponent {}
```

### Avatars

Set a matching width and height to make a circle, square, or rounded avatar skeleton.

```html:preview
<div class="skeleton-avatars">
  <sl-skeleton></sl-skeleton>
  <sl-skeleton></sl-skeleton>
  <sl-skeleton></sl-skeleton>
</div>

<style>
  .skeleton-avatars sl-skeleton {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    margin-right: 0.5rem;
  }

  .skeleton-avatars sl-skeleton:nth-child(1) {
    --border-radius: 0;
  }

  .skeleton-avatars sl-skeleton:nth-child(2) {
    --border-radius: var(--sl-border-radius-medium);
  }
</style>
```

```jsx:react
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const css = `
  .skeleton-avatars sl-skeleton {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    margin-right: .5rem;
  }

  .skeleton-avatars sl-skeleton:nth-child(1) {
    --border-radius: 0;
  }

  .skeleton-avatars sl-skeleton:nth-child(2) {
    --border-radius: var(--sl-border-radius-medium);
  }
`;

const App = () => (
  <>
    <div className="skeleton-avatars">
      <SlSkeleton />
      <SlSkeleton />
      <SlSkeleton />
    </div>

    <style>{css}</style>
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/skeleton/skeleton.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-skeleton-avatars-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .skeleton-avatars sl-skeleton {
        display: inline-block;
        width: 3rem;
        height: 3rem;
        margin-right: 0.5rem;
      }

      .skeleton-avatars sl-skeleton:nth-child(1) {
        --border-radius: 0;
      }

      .skeleton-avatars sl-skeleton:nth-child(2) {
        --border-radius: var(--sl-border-radius-medium);
      }
  `,
  template: `
    <div class="skeleton-avatars">
      <sl-skeleton></sl-skeleton>
      <sl-skeleton></sl-skeleton>
      <sl-skeleton></sl-skeleton>
    </div>
  `
})
export class SkeletonAvatarsExampleComponent {}
```

### Custom Shapes

Use the `--border-radius` custom property to make circles, squares, and rectangles. For more complex shapes, you can apply `clip-path` to the `indicator` part. [Try Clippy](https://bennettfeely.com/clippy/) if you need help generating custom shapes.

```html:preview
<div class="skeleton-shapes">
  <sl-skeleton class="square"></sl-skeleton>
  <sl-skeleton class="circle"></sl-skeleton>
  <sl-skeleton class="triangle"></sl-skeleton>
  <sl-skeleton class="cross"></sl-skeleton>
  <sl-skeleton class="comment"></sl-skeleton>
</div>

<style>
  .skeleton-shapes sl-skeleton {
    display: inline-flex;
    width: 50px;
    height: 50px;
  }

  .skeleton-shapes .square::part(indicator) {
    --border-radius: var(--sl-border-radius-medium);
  }

  .skeleton-shapes .circle::part(indicator) {
    --border-radius: var(--sl-border-radius-circle);
  }

  .skeleton-shapes .triangle::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(50% 0, 0 100%, 100% 100%);
  }

  .skeleton-shapes .cross::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(
      20% 0%,
      0% 20%,
      30% 50%,
      0% 80%,
      20% 100%,
      50% 70%,
      80% 100%,
      100% 80%,
      70% 50%,
      100% 20%,
      80% 0%,
      50% 30%
    );
  }

  .skeleton-shapes .comment::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);
  }

  .skeleton-shapes sl-skeleton:not(:last-child) {
    margin-right: 0.5rem;
  }
</style>
```

```jsx:react
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const css = `
  .skeleton-shapes sl-skeleton {
    display: inline-flex;
    width: 50px;
    height: 50px;
  }

  .skeleton-shapes .square::part(indicator) {
    --border-radius: var(--sl-border-radius-medium);
  }

  .skeleton-shapes .circle::part(indicator) {
    --border-radius: var(--sl-border-radius-circle);
  }

  .skeleton-shapes .triangle::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(50% 0, 0 100%, 100% 100%);
  }

  .skeleton-shapes .cross::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);
  }

  .skeleton-shapes .comment::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);
  }

  .skeleton-shapes sl-skeleton:not(:last-child) {
    margin-right: .5rem;
  }
`;

const App = () => (
  <>
    <div className="skeleton-shapes">
      <SlSkeleton className="square" />
      <SlSkeleton className="circle" />
      <SlSkeleton className="triangle" />
      <SlSkeleton className="cross" />
      <SlSkeleton className="comment" />
    </div>

    <style>{css}</style>
  </>
);
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/skeleton/skeleton.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-skeleton-custom-shapes-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .skeleton-shapes sl-skeleton {
        display: inline-flex;
        width: 50px;
        height: 50px;
      }

      .skeleton-shapes .square::part(indicator) {
        --border-radius: var(--sl-border-radius-medium);
      }

      .skeleton-shapes .circle::part(indicator) {
        --border-radius: var(--sl-border-radius-circle);
      }

      .skeleton-shapes .triangle::part(indicator) {
        --border-radius: 0;
        clip-path: polygon(50% 0, 0 100%, 100% 100%);
      }

      .skeleton-shapes .cross::part(indicator) {
        --border-radius: 0;
        clip-path: polygon(
          20% 0%,
          0% 20%,
          30% 50%,
          0% 80%,
          20% 100%,
          50% 70%,
          80% 100%,
          100% 80%,
          70% 50%,
          100% 20%,
          80% 0%,
          50% 30%
        );
      }

      .skeleton-shapes .comment::part(indicator) {
        --border-radius: 0;
        clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);
      }

      .skeleton-shapes sl-skeleton:not(:last-child) {
        margin-right: 0.5rem;
      }
  `,
  template: `
    <div class="skeleton-shapes">
      <sl-skeleton class="square"></sl-skeleton>
      <sl-skeleton class="circle"></sl-skeleton>
      <sl-skeleton class="triangle"></sl-skeleton>
      <sl-skeleton class="cross"></sl-skeleton>
      <sl-skeleton class="comment"></sl-skeleton>
    </div>
  `
})
export class SkeletonCustomShapesExampleComponent {}
```

### Custom Colors

Set the `--color` and `--sheen-color` custom properties to adjust the skeleton's color.

```html:preview
<sl-skeleton effect="sheen" style="--color: tomato; --sheen-color: #ffb094;"></sl-skeleton>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/skeleton/skeleton.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-skeleton-custom-colors-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<sl-skeleton effect="sheen" style="--color: tomato; --sheen-color: #ffb094;"></sl-skeleton>`
})
export class SkeletonCustomColorsExampleComponent {}
```

{% raw %}

```jsx:react
import SlSkeleton from '@shoelace-style/shoelace/dist/react/skeleton';

const css = `
  .skeleton-avatars sl-skeleton {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    margin-right: .5rem;
  }

  .skeleton-avatars sl-skeleton:nth-child(1) {
    --border-radius: 0;
  }

  .skeleton-avatars sl-skeleton:nth-child(2) {
    --border-radius: var(--sl-border-radius-medium);
  }
`;

const App = () => <SlSkeleton effect="sheen" style={{ '--color': 'tomato', '--sheen-color': '#ffb094' }} />;
```

{% endraw %}
