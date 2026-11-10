import { css } from 'lit';

export default css`
  :host {
    display: block;
    min-width: 0;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: var(--sl-spacing-2x-small);
    min-width: 0;
  }

  /* In a list legend the parent sets the width so the descriptions line up */
  .legend-item__marker {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
    min-width: var(--sl-legend-marker-min-width, 0);
  }

  .legend-item__marker--hidden {
    display: none;
  }

  .legend-item__swatch {
    width: 0.75em;
    height: 0.75em;
    border-radius: var(--sl-border-radius-small);
    background-color: var(--swatch-color);
  }

  .legend-item__swatch--primary {
    --swatch-color: var(--sl-color-primary-600);
  }
  .legend-item__swatch--accent {
    --swatch-color: var(--sl-color-accent-600);
  }
  .legend-item__swatch--success {
    --swatch-color: var(--sl-color-success-600);
  }
  .legend-item__swatch--neutral {
    --swatch-color: var(--sl-color-neutral-500);
  }
  .legend-item__swatch--warning {
    --swatch-color: var(--sl-color-warning-600);
  }
  .legend-item__swatch--danger {
    --swatch-color: var(--sl-color-danger-600);
  }

  .legend-item__term {
    flex: 0 0 auto;
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-800);
  }

  .legend-item__description {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;
