import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .stat {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--sl-spacing-small);
    box-sizing: border-box;
    width: 100%;
    min-width: 11rem;
    min-height: 5.75rem;
    margin: 0;
    padding: var(--sl-spacing-medium);
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

  /* Tinted circular badge that hosts the prefix icon. Empty when there's no icon, so it collapses to nothing. */
  .stat__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--sl-spacing-2x-large);
    height: var(--sl-spacing-2x-large);
    border-radius: var(--sl-border-radius-large);
    background-color: var(--stat-tint);
    color: var(--stat-color);
    font-size: var(--sl-font-size-large);
  }

  .stat__icon:empty {
    display: none;
  }

  .stat__content {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-3x-small);
    min-width: 0;
  }

  .stat__count {
    font-size: var(--sl-font-size-x-large);
    font-weight: var(--sl-font-weight-bold);
    font-variant-numeric: tabular-nums;
    line-height: var(--sl-line-height-denser);
    letter-spacing: var(--sl-letter-spacing-dense);
    color: var(--sl-color-neutral-900);
  }

  .stat__label {
    display: block;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-dense);
    color: var(--sl-color-neutral-600);
  }

  .stat--primary {
    --stat-color: var(--sl-color-primary-600);
    --stat-tint: var(--sl-color-primary-100);
  }

  .stat--accent {
    --stat-color: var(--sl-color-accent-700);
    --stat-tint: var(--sl-color-accent-100);
  }

  .stat--success {
    --stat-color: var(--sl-color-success-600);
    --stat-tint: var(--sl-color-success-100);
  }

  .stat--neutral {
    --stat-color: var(--sl-color-neutral-600);
    --stat-tint: var(--sl-color-neutral-200);
  }

  .stat--warning {
    --stat-color: var(--sl-color-warning-600);
    --stat-tint: var(--sl-color-warning-100);
  }

  .stat--danger {
    --stat-color: var(--sl-color-danger-600);
    --stat-tint: var(--sl-color-danger-100);
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

  /* Tinted background + 2px boundary in the variant color, without shifting the layout
     (1px border plus 1px inset ring). Falls back to primary when no variant is set. */
  .stat--selected {
    border-color: var(--stat-color, var(--sl-color-primary-600));
    background-color: var(--stat-tint, var(--sl-color-primary-50));
    box-shadow: inset 0 0 0 1px var(--stat-color, var(--sl-color-primary-600));
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
