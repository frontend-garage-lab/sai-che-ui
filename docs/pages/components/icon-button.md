---
meta:
  title: Icon Button
  description: Icons buttons are simple, icon-only buttons that can be used for actions and in toolbars.
layout: component
---

For a full list of icons that come bundled with Shoelace, refer to the [icon component](/components/icon).

```html:preview
<sl-icon-button name="gear" label="Settings"></sl-icon-button>
```

```jsx:react
import SlIconButton from '@shoelace-style/shoelace/dist/react/icon-button';

const App = () => <SlIconButton name="gear" label="Settings" />;
```

## Examples

### Sizes

Set `size` to `small`, `large` or `x-large`; the values come from the theme tokens `--sl-icon-button-font-size-*` and
`--sl-icon-button-padding-small`. Use `small` for row actions in tables. Without `size` (the Figma `medium` size), the `default` icon button
inherits its parent element's `font-size` and the coloured variants keep their standalone toolbar size.

```html:preview
<sl-icon-button name="info-circle" label="Document info" variant="neutral" size="small"></sl-icon-button>
<sl-icon-button name="info-circle" label="Document info" variant="neutral"></sl-icon-button>
<sl-icon-button name="info-circle" label="Document info" variant="neutral" size="large"></sl-icon-button>
<sl-icon-button name="info-circle" label="Document info" variant="neutral" size="x-large"></sl-icon-button>
```

A custom `font-size` still works for any other size.

```html:preview
<sl-icon-button name="pencil" label="Edit" style="font-size: 1.5rem;"></sl-icon-button>
<sl-icon-button name="pencil" label="Edit" style="font-size: 2rem;"></sl-icon-button>
<sl-icon-button name="pencil" label="Edit" style="font-size: 2.5rem;"></sl-icon-button>
```

{% raw %}

```jsx:react
import SlIconButton from '@shoelace-style/shoelace/dist/react/icon-button';

const App = () => (
  <>
    <SlIconButton name="pencil" label="Edit" style={{ fontSize: '1.5rem' }} />
    <SlIconButton name="pencil" label="Edit" style={{ fontSize: '2rem' }} />
    <SlIconButton name="pencil" label="Edit" style={{ fontSize: '2.5rem' }} />
  </>
);
```

{% endraw %}

### Colors

Icon buttons are designed to have a uniform appearance, so their color is not inherited. However, you can still customize them by styling the `base` part.

```html:preview
<div class="icon-button-color">
  <sl-icon-button name="type-bold" label="Bold"></sl-icon-button>
  <sl-icon-button name="type-italic" label="Italic"></sl-icon-button>
  <sl-icon-button name="type-underline" label="Underline"></sl-icon-button>
</div>

<style>
  .icon-button-color sl-icon-button::part(base) {
    color: #b00091;
  }

  .icon-button-color sl-icon-button::part(base):hover,
  .icon-button-color sl-icon-button::part(base):focus {
    color: #c913aa;
  }

  .icon-button-color sl-icon-button::part(base):active {
    color: #960077;
  }
</style>
```

```jsx:react
import SlIconButton from '@shoelace-style/shoelace/dist/react/icon-button';

const css = `
  .icon-button-color sl-icon-button::part(base) {
    color: #b00091;
  }

  .icon-button-color sl-icon-button::part(base):hover,
  .icon-button-color sl-icon-button::part(base):focus {
    color: #c913aa;
  }

  .icon-button-color sl-icon-button::part(base):active {
    color: #960077;
  }
`;

const App = () => (
  <>
    <div className="icon-button-color">
      <SlIconButton name="type-bold" label="Bold" />
      <SlIconButton name="type-italic" label="Italic" />
      <SlIconButton name="type-underline" label="Underline" />
    </div>

    <style>{css}</style>
  </>
);
```

### Variants

Use the `variant` attribute to give the icon button a semantic color with a soft, pale background. Add the `filled` attribute to use a solid background instead.

```html:preview
<div style="display: flex; gap: var(--sl-spacing-x-small);">
  <sl-icon-button name="download" label="Download" variant="primary"></sl-icon-button>
  <sl-icon-button name="upload" label="Upload" variant="neutral"></sl-icon-button>
  <sl-icon-button name="arrow-counterclockwise" label="Undo" variant="danger"></sl-icon-button>
  <sl-icon-button name="arrow-clockwise" label="Redo" variant="primary"></sl-icon-button>
  <sl-icon-button name="check-lg" label="Approve" variant="accent" filled></sl-icon-button>
  <sl-icon-button name="check2-circle" label="Complete" variant="neutral"></sl-icon-button>
</div>
```

{% raw %}

```jsx:react
import SlIconButton from '@shoelace-style/shoelace/dist/react/icon-button';

const App = () => (
  <div style={{ display: 'flex', gap: 'var(--sl-spacing-x-small)' }}>
    <SlIconButton name="download" label="Download" variant="primary" />
    <SlIconButton name="upload" label="Upload" variant="neutral" />
    <SlIconButton name="arrow-counterclockwise" label="Undo" variant="danger" />
    <SlIconButton name="arrow-clockwise" label="Redo" variant="primary" />
    <SlIconButton name="check-lg" label="Approve" variant="accent" filled />
    <SlIconButton name="check2-circle" label="Complete" variant="neutral" />
  </div>
);
```

{% endraw %}

### Link Buttons

Use the `href` attribute to convert the button to a link.

```html:preview
<sl-icon-button name="gear" label="Settings" href="https://example.com" target="_blank"></sl-icon-button>
```

```jsx:react
import SlIconButton from '@shoelace-style/shoelace/dist/react/icon-button';

const App = () => <SlIconButton name="gear" label="Settings" href="https://example.com" target="_blank" />;
```

### Icon Button with Tooltip

Wrap a tooltip around an icon button to provide contextual information to the user.

```html:preview
<sl-tooltip content="Settings">
  <sl-icon-button name="gear" label="Settings"></sl-icon-button>
</sl-tooltip>
```

```jsx:react
import SlIconButton from '@shoelace-style/shoelace/dist/react/icon-button';
import SlTooltip from '@shoelace-style/shoelace/dist/react/tooltip';

const App = () => (
  <SlTooltip content="Settings">
    <SlIconButton name="gear" label="Settings" />
  </SlTooltip>
);
```

### Disabled

Use the `disabled` attribute to disable the icon button.

```html:preview
<sl-icon-button name="gear" label="Settings" disabled></sl-icon-button>
```

```jsx:react
import SlIconButton from '@shoelace-style/shoelace/dist/react/icon-button';

const App = () => <SlIconButton name="gear" label="Settings" disabled />;
```
