---
meta:
  title: App Header
  description: App headers are the brand bar at the top of an application.
layout: component
---

The header uses the brand petrol with the orange accent line along its bottom edge, in both light and dark themes. Put
the logo in the `logo` slot, the main navigation links in the default slot and global controls in the `actions` slot.
Mark the current page with `aria-current="page"`.

```html:preview
<sl-app-header>
  <span slot="logo">xCMM</span>

  <a href="#" aria-current="page">Home</a>
  <a href="#">Incoming</a>
  <a href="#">Outgoing</a>
  <a href="#">Distribution History</a>
  <a href="#">Search</a>

  <sl-select slot="actions" size="small" value="xcmm-demo" style="width: 14rem;">
    <sl-option value="xcmm-demo">xCMM Demo</sl-option>
    <sl-option value="fepco">FEPCO Project</sl-option>
  </sl-select>
  <sl-icon-button slot="actions" name="question-circle" label="Help"></sl-icon-button>
  <sl-icon-button slot="actions" name="gear" label="Settings"></sl-icon-button>
  <sl-icon-button slot="actions" name="box-arrow-right" label="Sign out"></sl-icon-button>
</sl-app-header>
```

## Examples

### With a logo image

Images and SVGs in the `logo` slot are sized to fit the header.

```html:preview
<sl-app-header>
  <svg slot="logo" viewBox="0 0 24 24" role="img" aria-label="Saipem">
    <path fill="#fff" d="M2 2h9v3H5v4H2zM13 2h9v7h-3V5h-6zM2 15h3v4h6v3H2zM19 15h3v7h-9v-3h6z" />
    <path fill="#F28531" d="M6 10.5 18 9v4.5L6 15z" />
  </svg>
  <span slot="logo">xCMM</span>

  <a href="#" aria-current="page">Home</a>
  <a href="#">Incoming</a>
  <a href="#">Outgoing</a>
</sl-app-header>
```

### Customizing

Use `--height`, `--background`, `--color` and `--accent-color` to adapt the header, e.g. for a test environment that
must not be mistaken for production.

```html:preview
<sl-app-header style="--background: var(--sl-color-neutral-800); --accent-color: var(--sl-color-warning-500);">
  <span slot="logo">xCMM · UAT</span>
  <a href="#" aria-current="page">Home</a>
  <a href="#">Incoming</a>
</sl-app-header>
```
