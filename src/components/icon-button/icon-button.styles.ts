import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
    color: var(--sl-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition:
      var(--sl-transition-x-fast) color,
      var(--sl-transition-x-fast) background-color;
    -webkit-appearance: none;
  }

  /*
   * Ghost behaviour: hover darkens the icon and adds a wash of its own colour. Deriving the wash
   * from currentColor keeps the button legible on any surface, including the petrol app header.
   */
  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus-visible:not(.icon-button--disabled) {
    background-color: color-mix(in srgb, currentColor 10%, transparent);
  }

  .icon-button:active:not(.icon-button--disabled) {
    background-color: color-mix(in srgb, currentColor 18%, transparent);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
  }

  /*
   * Colored variants: a soft, pale background by default (icon tinted, background barely there), or a
   * solid filled background when the \`filled\` attribute is set. The \`default\` variant is intentionally
   * left out here, it keeps the plain ghost treatment above. These are drawn bigger and fully round so
   * they read as standalone toolbar actions rather than inline ghost icons.
   */
  .icon-button--primary,
  .icon-button--accent,
  .icon-button--success,
  .icon-button--neutral,
  .icon-button--warning,
  .icon-button--danger {
    border-radius: var(--sl-border-radius-circle);
    padding: var(--sl-spacing-small);
    font-size: var(--sl-font-size-large);
  }

  .icon-button--primary {
    color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-50);
  }

  .icon-button--accent {
    color: var(--sl-color-accent-600);
    background-color: var(--sl-color-accent-50);
  }

  .icon-button--success {
    color: var(--sl-color-success-600);
    background-color: var(--sl-color-success-50);
  }

  .icon-button--neutral {
    color: var(--sl-color-neutral-600);
    background-color: var(--sl-color-neutral-100);
  }

  .icon-button--warning {
    color: var(--sl-color-warning-600);
    background-color: var(--sl-color-warning-50);
  }

  .icon-button--danger {
    color: var(--sl-color-danger-600);
    background-color: var(--sl-color-danger-50);
  }

  .icon-button--primary:hover:not(.icon-button--disabled),
  .icon-button--accent:hover:not(.icon-button--disabled),
  .icon-button--success:hover:not(.icon-button--disabled),
  .icon-button--neutral:hover:not(.icon-button--disabled),
  .icon-button--warning:hover:not(.icon-button--disabled),
  .icon-button--danger:hover:not(.icon-button--disabled) {
    background-color: color-mix(in srgb, currentColor 18%, transparent);
  }

  .icon-button--primary.icon-button--filled {
    color: var(--sl-color-primary-contrast);
    background-color: var(--sl-color-primary-600);
  }

  .icon-button--accent.icon-button--filled {
    color: var(--sl-color-accent-contrast);
    background-color: var(--sl-color-accent-500);
  }

  .icon-button--success.icon-button--filled {
    color: var(--sl-color-success-contrast);
    background-color: var(--sl-color-success-600);
  }

  .icon-button--neutral.icon-button--filled {
    color: var(--sl-color-neutral-contrast);
    background-color: var(--sl-color-neutral-600);
  }

  .icon-button--warning.icon-button--filled {
    color: var(--sl-color-warning-contrast);
    background-color: var(--sl-color-warning-600);
  }

  .icon-button--danger.icon-button--filled {
    color: var(--sl-color-danger-contrast);
    background-color: var(--sl-color-danger-600);
  }

  .icon-button--filled:hover:not(.icon-button--disabled) {
    filter: brightness(1.1);
  }

  .icon-button--filled:active:not(.icon-button--disabled) {
    filter: brightness(0.95);
  }

  /*
   * Sizes (theme tokens --sl-icon-button-*). They win over the variant's own size, so a coloured icon
   * button can also be made compact, e.g. a row action in a table. No size = inherits the font size.
   */
  :host([size='small']) .icon-button {
    font-size: var(--sl-icon-button-font-size-small);
    padding: var(--sl-icon-button-padding-small);
  }

  :host([size='large']) .icon-button {
    font-size: var(--sl-icon-button-font-size-large);
  }

  :host([size='x-large']) .icon-button {
    font-size: var(--sl-icon-button-font-size-x-large);
  }
`;
