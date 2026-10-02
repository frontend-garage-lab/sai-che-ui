import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
    min-width: 0;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: max(12px, 0.75em);
    font-weight: var(--sl-font-weight-semibold);
    letter-spacing: var(--sl-letter-spacing-normal);
    line-height: 1;
    border-radius: var(--sl-border-radius-small);
    border: solid 1px var(--sl-color-neutral-0);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* Compact, dense-row sizing: 4px vertical / 8px horizontal, both on the 4px grid. */
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-small);
    user-select: none;
    -webkit-user-select: none;
    cursor: inherit;
  }

  /* Variant modifiers */
  .badge--primary {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-primary-contrast);
  }

  .badge--accent {
    background-color: var(--sl-color-accent-500);
    color: var(--sl-color-accent-contrast);
  }

  .badge--success {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-success-contrast);
  }

  .badge--neutral {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-contrast);
  }

  .badge--warning {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-warning-contrast);
  }

  .badge--danger {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-danger-contrast);
  }

  /* Pill modifier */
  .badge--pill {
    border-radius: var(--sl-border-radius-pill);
  }

  /* Pulse modifier */
  .badge--pulse {
    animation: pulse 1.5s infinite;
  }

  .badge--pulse.badge--primary {
    --pulse-color: var(--sl-color-primary-600);
  }

  .badge--pulse.badge--accent {
    --pulse-color: var(--sl-color-accent-500);
  }

  .badge--pulse.badge--success {
    --pulse-color: var(--sl-color-success-600);
  }

  .badge--pulse.badge--neutral {
    --pulse-color: var(--sl-color-neutral-600);
  }

  .badge--pulse.badge--warning {
    --pulse-color: var(--sl-color-warning-600);
  }

  .badge--pulse.badge--danger {
    --pulse-color: var(--sl-color-danger-600);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--pulse-color);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }
`;
