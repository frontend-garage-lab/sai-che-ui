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
`;
