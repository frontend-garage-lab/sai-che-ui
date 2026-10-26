import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
    /*
     * Reset the inherited value: containers such as sl-tab-group define their own --indicator-color, which would
     * otherwise turn every dot inside a tab panel into the tab colour. Setting it on sl-status itself still works.
     */
    --indicator-color: initial;
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

  /*
   * A document state name is user/data driven and can run long; let it truncate instead of
   * overflowing or wrapping when a consumer (e.g. a table column) constrains the width.
   */
  .status__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
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

  /*
   * Filled: the label takes the variant colour on a soft background (same tokens as sl-tag, so contrast is the same).
   * A pill without border keeps it distinct from a tag.
   */
  .status--filled {
    padding: 0.25em 0.625em;
    border-radius: var(--sl-border-radius-pill);
    background-color: var(--status-fill);
    color: var(--status-label);
  }

  .status--filled .status__indicator {
    box-shadow: none;
  }

  .status--primary {
    --status-fill: var(--sl-color-primary-50);
    --status-label: var(--sl-color-primary-800);
  }

  .status--accent {
    --status-fill: var(--sl-color-accent-50);
    --status-label: var(--sl-color-accent-800);
  }

  .status--success {
    --status-fill: var(--sl-color-success-50);
    --status-label: var(--sl-color-success-800);
  }

  .status--neutral {
    --status-fill: var(--sl-color-neutral-100);
    --status-label: var(--sl-color-neutral-800);
  }

  .status--warning {
    --status-fill: var(--sl-color-warning-50);
    --status-label: var(--sl-color-warning-800);
  }

  .status--danger {
    --status-fill: var(--sl-color-danger-50);
    --status-label: var(--sl-color-danger-800);
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
    .status--filled {
      border: solid 1px CanvasText;
    }

    .status__indicator {
      background-color: CanvasText;
      box-shadow: none;
    }
  }
`;
