import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .details {
    border: solid var(--sl-panel-border-width) var(--sl-border-subtle);
    border-radius: var(--sl-border-radius-large);
    background-color: var(--sl-surface-panel);
    overflow-anchor: none;
  }

  .details--disabled {
    opacity: 0.5;
  }

  .details__header {
    display: flex;
    align-items: center;
    border-radius: inherit;
    padding: var(--sl-spacing-small) var(--sl-spacing-medium);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-900);
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
  }

  .details__header::-webkit-details-marker {
    display: none;
  }

  .details__header:focus {
    outline: none;
  }

  .details__header:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(1px + var(--sl-focus-ring-offset));
  }

  .details--disabled .details__header {
    cursor: not-allowed;
  }

  .details--disabled .details__header:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .details__summary {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }

  .details__summary-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--sl-transition-medium) rotate ease;
  }

  .details--open .details__summary-icon {
    rotate: 90deg;
  }

  .details--open.details--rtl .details__summary-icon {
    rotate: -90deg;
  }

  .details--open slot[name='expand-icon'],
  .details:not(.details--open) slot[name='collapse-icon'] {
    display: none;
  }

  .details__body {
    overflow: hidden;
  }

  /* A divider under the open summary, so a long form section reads as header + body */
  .details--open .details__body {
    border-top: solid var(--sl-panel-border-width) var(--sl-border-subtle);
  }

  .details__content {
    display: block;
    padding: var(--sl-spacing-medium);
  }
`;
