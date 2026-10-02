import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--sl-spacing-3x-small);
    box-sizing: border-box;
    width: 100%;
    min-width: 7.5rem;
    margin: 0;
    padding: var(--sl-spacing-small) var(--sl-spacing-medium);
    border: solid var(--sl-panel-border-width) var(--sl-border-subtle);
    border-radius: var(--sl-border-radius-large);
    background-color: var(--sl-surface-panel);
    box-shadow: var(--sl-shadow-x-small);
    font-family: var(--sl-font-sans);
    color: inherit;
    text-align: start;
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) box-shadow;
  }

  .stat__count {
    font-size: var(--sl-font-size-x-large);
    font-weight: var(--sl-font-weight-semibold);
    font-variant-numeric: tabular-nums;
    line-height: var(--sl-line-height-denser);
    letter-spacing: var(--sl-letter-spacing-dense);
    color: var(--sl-color-neutral-900);
  }

  .stat__label {
    display: inline-flex;
    align-items: center;
    gap: var(--sl-spacing-x-small);
    width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-dense);
    color: var(--sl-color-neutral-600);
  }

  /* Same dot and halo as <sl-status>, so the stat and the table cells it filters match */
  .stat__indicator {
    flex-shrink: 0;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: var(--sl-border-radius-circle);
    background-color: var(--stat-color);
    box-shadow: 0 0 0 3px var(--stat-halo);
  }

  .stat--primary {
    --stat-color: var(--sl-color-primary-600);
    --stat-halo: var(--sl-color-primary-100);
  }

  .stat--accent {
    --stat-color: var(--sl-color-accent-500);
    --stat-halo: var(--sl-color-accent-100);
  }

  .stat--success {
    --stat-color: var(--sl-color-success-600);
    --stat-halo: var(--sl-color-success-100);
  }

  .stat--neutral {
    --stat-color: var(--sl-color-neutral-500);
    --stat-halo: var(--sl-color-neutral-200);
  }

  .stat--warning {
    --stat-color: var(--sl-color-warning-500);
    --stat-halo: var(--sl-color-warning-100);
  }

  .stat--danger {
    --stat-color: var(--sl-color-danger-600);
    --stat-halo: var(--sl-color-danger-100);
  }

  /* Interactive (inside a stat group) */
  .stat--interactive {
    cursor: pointer;
  }

  .stat--interactive:focus {
    outline: none;
  }

  .stat--interactive:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .stat--interactive:hover:not(.stat--disabled, .stat--selected) {
    border-color: var(--sl-color-neutral-300);
    box-shadow: var(--sl-shadow-small);
  }

  /* A 2px petrol boundary without shifting the layout: 1px border plus 1px inset ring */
  .stat--selected {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-50);
    box-shadow: inset 0 0 0 1px var(--sl-color-primary-600);
  }

  .stat--selected .stat__count {
    color: var(--sl-color-primary-800);
  }

  .stat--selected .stat__label {
    color: var(--sl-color-primary-700);
  }

  .stat--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (forced-colors: active) {
    .stat--selected {
      outline: solid 2px Highlight;
    }
  }
`;
