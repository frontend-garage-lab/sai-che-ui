---
meta:
  title: More Design Tokens
  description: Additional design tokens can be found here.
---

# More Design Tokens

All of the design tokens described herein are considered relatively stable. However, some changes might occur in future versions to address mission critical bugs or improvements. If such changes occur, they _will not_ be considered breaking changes and will be clearly documented in the [changelog](/resources/changelog).

Most design tokens are consistent across the light and dark theme. Those that vary will show both values.

:::tip
Currently, the source of design tokens is considered to be [`light.css`](https://github.com/shoelace-style/shoelace/blob/next/src/themes/light.css). The dark theme, [dark.css](https://github.com/shoelace-style/shoelace/blob/next/src/themes/dark.css), mirrors all of the same tokens with dark mode-specific values where appropriate. Work is planned to move all design tokens to a single file, perhaps JSON or YAML, in the near future.
:::

## Focus Rings

Focus ring tokens control the appearance of focus rings. Note that form inputs use `--sl-input-focus-ring-*` tokens instead.

| Token                    | Value                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `--sl-focus-ring-color`  | `var(--sl-color-primary-600)` (light theme)<br>`var(--sl-color-primary-700)` (dark theme) |
| `--sl-focus-ring-style`  | `solid`                                                                                   |
| `--sl-focus-ring-width`  | `2px`                                                                                     |
| `--sl-focus-ring`        | `var(--sl-focus-ring-style) var(--sl-focus-ring-width) var(--sl-focus-ring-color)`        |
| `--sl-focus-ring-offset` | `2px`                                                                                     |

## Buttons

Button tokens control the appearance of buttons. In addition, buttons also currently use some form input tokens such as `--sl-input-height-*` and `--sl-input-border-*`. More button tokens may be added in the future to make it easier to style them more independently.

| Token                          | Value                         |
| ------------------------------ | ----------------------------- |
| `--sl-button-font-size-small`  | `var(--sl-font-size-x-small)` |
| `--sl-button-font-size-medium` | `var(--sl-font-size-small)`   |
| `--sl-button-font-size-large`  | `var(--sl-font-size-medium)`  |

## Form Inputs

Form input tokens control the appearance of form controls such as [input](/components/input), [select](/components/select), [textarea](/components/textarea), etc.

| Token                                   | Value                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `--sl-input-height-small`               | `1.75rem` (28px @ 16px base)                                                              |
| `--sl-input-height-medium`              | `2.25rem` (36px @ 16px base)                                                              |
| `--sl-input-height-large`               | `2.75rem` (44px @ 16px base)                                                              |
| `--sl-input-background-color`           | `var(--sl-color-neutral-0)`                                                               |
| `--sl-input-background-color-hover`     | `var(--sl-input-background-color)`                                                        |
| `--sl-input-background-color-focus`     | `var(--sl-input-background-color)`                                                        |
| `--sl-input-background-color-disabled`  | `var(--sl-color-neutral-100)`                                                             |
| `--sl-input-border-color`               | `var(--sl-color-neutral-400)` (light theme)<br>`var(--sl-color-neutral-500)` (dark theme) |
| `--sl-input-border-color-hover`         | `var(--sl-color-neutral-500)` (light theme)<br>`var(--sl-color-neutral-600)` (dark theme) |
| `--sl-input-border-color-focus`         | `var(--sl-color-primary-500)`                                                             |
| `--sl-input-border-color-disabled`      | `var(--sl-color-neutral-300)`                                                             |
| `--sl-input-border-width`               | `1px`                                                                                     |
| `--sl-input-required-content`           | `*`                                                                                       |
| `--sl-input-required-content-offset`    | `-2px`                                                                                    |
| `--sl-input-required-content-color`     | `var(--sl-color-danger-600)`                                                              |
| `--sl-input-border-radius-small`        | `var(--sl-border-radius-medium)`                                                          |
| `--sl-input-border-radius-medium`       | `var(--sl-border-radius-medium)`                                                          |
| `--sl-input-border-radius-large`        | `var(--sl-border-radius-medium)`                                                          |
| `--sl-input-font-family`                | `var(--sl-font-sans)`                                                                     |
| `--sl-input-font-weight`                | `var(--sl-font-weight-normal)`                                                            |
| `--sl-input-font-size-small`            | `0.8125rem` (13px @ 16px base)                                                            |
| `--sl-input-font-size-medium`           | `var(--sl-font-size-small)`                                                               |
| `--sl-input-font-size-large`            | `var(--sl-font-size-medium)`                                                              |
| `--sl-input-letter-spacing`             | `var(--sl-letter-spacing-normal)`                                                         |
| `--sl-input-color`                      | `var(--sl-color-neutral-700)`                                                             |
| `--sl-input-color-hover`                | `var(--sl-color-neutral-700)`                                                             |
| `--sl-input-color-focus`                | `var(--sl-color-neutral-700)`                                                             |
| `--sl-input-color-disabled`             | `var(--sl-color-neutral-900)`                                                             |
| `--sl-input-icon-color`                 | `var(--sl-color-neutral-500)`                                                             |
| `--sl-input-icon-color-hover`           | `var(--sl-color-neutral-600)`                                                             |
| `--sl-input-icon-color-focus`           | `var(--sl-color-neutral-600)`                                                             |
| `--sl-input-placeholder-color`          | `var(--sl-color-neutral-500)` (light theme)<br>`var(--sl-color-neutral-600)` (dark theme) |
| `--sl-input-placeholder-color-disabled` | `var(--sl-color-neutral-600)`                                                             |
| `--sl-input-spacing-small`              | `var(--sl-spacing-x-small)`                                                               |
| `--sl-input-spacing-medium`             | `var(--sl-spacing-small)`                                                                 |
| `--sl-input-spacing-large`              | `var(--sl-spacing-medium)`                                                                |
| `--sl-input-focus-ring-color`           | `color-mix(in srgb, var(--sl-color-primary-500), transparent 60%)`                        |
| `--sl-input-focus-ring-offset`          | `0`                                                                                       |

## Filled Form Inputs

Filled form input tokens control the appearance of form controls using the `filled` variant.

| Token                                         | Value                         |
| --------------------------------------------- | ----------------------------- |
| `--sl-input-filled-background-color`          | `var(--sl-color-neutral-100)` |
| `--sl-input-filled-background-color-hover`    | `var(--sl-color-neutral-100)` |
| `--sl-input-filled-background-color-focus`    | `var(--sl-color-neutral-100)` |
| `--sl-input-filled-background-color-disabled` | `var(--sl-color-neutral-100)` |
| `--sl-input-filled-color`                     | `var(--sl-color-neutral-800)` |
| `--sl-input-filled-color-hover`               | `var(--sl-color-neutral-800)` |
| `--sl-input-filled-color-focus`               | `var(--sl-color-neutral-700)` |
| `--sl-input-filled-color-disabled`            | `var(--sl-color-neutral-800)` |

## Form Labels

Form label tokens control the appearance of labels in form controls.

| Token                               | Value                         |
| ----------------------------------- | ----------------------------- |
| `--sl-input-label-font-size-small`  | `var(--sl-font-size-x-small)` |
| `--sl-input-label-font-size-medium` | `var(--sl-font-size-small)`   |
| `--sl-input-label-font-size-large`  | `var(--sl-font-size-medium)`  |
| `--sl-input-label-color`            | `var(--sl-color-neutral-800)` |

## Help Text

Help text tokens control the appearance of help text in form controls.

| Token                                   | Value                         |
| --------------------------------------- | ----------------------------- |
| `--sl-input-help-text-font-size-small`  | `var(--sl-font-size-x-small)` |
| `--sl-input-help-text-font-size-medium` | `var(--sl-font-size-x-small)` |
| `--sl-input-help-text-font-size-large`  | `var(--sl-font-size-small)`   |
| `--sl-input-help-text-color`            | `var(--sl-color-neutral-600)` |

## Toggles

Toggle tokens control the appearance of toggles such as [checkbox](/components/checkbox), [radio](/components/radio), [switch](/components/switch), etc.

| Token                     | Value                         |
| ------------------------- | ----------------------------- |
| `--sl-toggle-size-small`  | `0.875rem` (14px @ 16px base) |
| `--sl-toggle-size-medium` | `1rem` (16px @ 16px base)     |
| `--sl-toggle-size-large`  | `1.25rem` (20px @ 16px base)  |

## Overlays

Overlay tokens control the appearance of overlays as used in [dialog](/components/dialog), [drawer](/components/drawer), etc.

| Token                           | Value                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `--sl-overlay-background-color` | `hsl(192 60% 8% / 40%)` (light theme)<br>`hsl(200 30% 3% / 60%)` (dark theme) |

## Surfaces

Surface tokens describe the layers a page is built from. Put panels on the app surface rather than directly on each other, and use the sunken surface for headers and sidebars inside a panel, so the layout reads without extra borders.

| Token                 | Value                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------- |
| `--sl-surface-app`    | `var(--sl-color-neutral-50)` (light theme)<br>`var(--sl-color-neutral-0)` (dark theme) |
| `--sl-surface-panel`  | `var(--sl-color-neutral-0)` (light theme)<br>`var(--sl-color-neutral-50)` (dark theme) |
| `--sl-surface-sunken` | `var(--sl-color-neutral-100)`                                                          |
| `--sl-border-subtle`  | `var(--sl-color-neutral-200)`                                                          |
| `--sl-border-strong`  | `var(--sl-color-neutral-300)`                                                          |

## Panels

Panel tokens control the appearance of panels such as those used in [dialog](/components/dialog), [drawer](/components/drawer), [menu](/components/menu), etc.

| Token                         | Value                     |
| ----------------------------- | ------------------------- |
| `--sl-panel-background-color` | `var(--sl-surface-panel)` |
| `--sl-panel-border-color`     | `var(--sl-border-subtle)` |
| `--sl-panel-border-width`     | `1px`                     |

## Tooltips

Tooltip tokens control the appearance of tooltips. This includes the [tooltip](/components/tooltip) component as well as other implementations, such [range tooltips](/components/range).

| Token                           | Value                                                  |
| ------------------------------- | ------------------------------------------------------ |
| `--sl-tooltip-border-radius`    | `var(--sl-border-radius-small)`                        |
| `--sl-tooltip-background-color` | `var(--sl-color-neutral-900)`                          |
| `--sl-tooltip-color`            | `var(--sl-color-neutral-0)`                            |
| `--sl-tooltip-font-family`      | `var(--sl-font-sans)`                                  |
| `--sl-tooltip-font-weight`      | `var(--sl-font-weight-normal)`                         |
| `--sl-tooltip-font-size`        | `var(--sl-font-size-x-small)`                          |
| `--sl-tooltip-line-height`      | `var(--sl-line-height-dense)`                          |
| `--sl-tooltip-padding`          | `var(--sl-spacing-2x-small) var(--sl-spacing-x-small)` |
| `--sl-tooltip-arrow-size`       | `6px`                                                  |
