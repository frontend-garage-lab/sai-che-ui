import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: var(--sl-spacing-x-small);
    font-family: var(--sl-font-sans);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-dense);
    color: var(--sl-color-neutral-800);
    white-space: nowrap;
  }

  .status--small {
    font-size: var(--sl-font-size-x-small);
  }

  .status--medium {
    font-size: var(--sl-font-size-small);
  }

  /*
   * The dot carries the colour; the label stays neutral so a column of statuses reads as text,
   * not as a row of coloured blocks. The halo lifts the dot off both light and tinted rows.
   */
  .status__indicator {
    flex: 0 0 auto;
    position: relative;
    width: 0.5em;
    height: 0.5em;
    min-width: 6px;
    min-height: 6px;
    border-radius: var(--sl-border-radius-circle);
    background-color: var(--indicator-color, var(--status-color));
    box-shadow: 0 0 0 0.1875em var(--status-halo);
  }

  .status--primary {
    --status-color: var(--sl-color-primary-600);
    --status-halo: var(--sl-color-primary-100);
  }

  .status--accent {
    --status-color: var(--sl-color-accent-500);
    --status-halo: var(--sl-color-accent-100);
  }

  .status--success {
    --status-color: var(--sl-color-success-600);
    --status-halo: var(--sl-color-success-100);
  }

  .status--neutral {
    --status-color: var(--sl-color-neutral-500);
    --status-halo: var(--sl-color-neutral-200);
  }

  .status--warning {
    --status-color: var(--sl-color-warning-500);
    --status-halo: var(--sl-color-warning-100);
  }

  .status--danger {
    --status-color: var(--sl-color-danger-600);
    --status-halo: var(--sl-color-danger-100);
  }

  .status--pulse .status__indicator::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--indicator-color, var(--status-color));
    animation: status-pulse 1.6s ease-out infinite;
  }

  @keyframes status-pulse {
    from {
      opacity: 0.6;
      scale: 1;
    }
    to {
      opacity: 0;
      scale: 2.6;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .status--pulse .status__indicator::after {
      animation: none;
    }
  }

  @media (forced-colors: active) {
    .status__indicator {
      background-color: CanvasText;
      box-shadow: none;
    }
  }
`;
