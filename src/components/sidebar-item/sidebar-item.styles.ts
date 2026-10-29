import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .sidebar-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-x-small);
    min-height: var(--sl-input-height-medium);
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-small);
    /* Labels line up with the group label, past the group icon tile */
    padding-inline-start: calc(
      var(--sl-spacing-x-small) + var(--icon-size, var(--sl-input-height-small)) + var(--sl-spacing-small)
    );
    border-radius: var(--sl-border-radius-medium);
    color: var(--sl-color-neutral-700);
    line-height: var(--sl-line-height-dense);
    text-decoration: none;
    cursor: pointer;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) background-color;
  }

  .sidebar-item--has-prefix {
    padding-inline-start: var(--sl-spacing-small);
  }

  .sidebar-item:hover {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-900);
  }

  /* Current page: tinted row plus an accent bar on the leading edge */
  .sidebar-item[aria-current='page'] {
    background-color: var(--sl-color-primary-100);
    color: var(--sl-color-primary-800);
    font-weight: var(--sl-font-weight-semibold);
  }

  .sidebar-item[aria-current='page']::before {
    content: '';
    position: absolute;
    inset-block: var(--sl-spacing-x-small);
    inset-inline-start: 0;
    width: var(--sl-spacing-3x-small);
    border-radius: var(--sl-border-radius-pill);
    background-color: var(--sl-color-primary-600);
  }

  .sidebar-item:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(-1 * var(--sl-focus-ring-width));
  }

  .sidebar-item__prefix {
    flex: 0 0 auto;
    display: flex;
    font-size: var(--sl-font-size-medium);
  }

  /* An empty prefix would still take the flex gap and push the label past the group label */
  .sidebar-item:not(.sidebar-item--has-prefix) .sidebar-item__prefix {
    display: none;
  }

  .sidebar-item__label {
    flex: 1 1 auto;
    min-width: 0;
  }

  .sidebar-item__count {
    flex: 0 0 auto;
  }

  /* Counts are quiet: plain muted numbers, a white pill only on the current item */
  .sidebar-item__count::part(base) {
    min-width: var(--sl-spacing-x-large);
    background-color: transparent;
    color: var(--sl-color-neutral-500);
    font-weight: var(--sl-font-weight-semibold);
    font-variant-numeric: tabular-nums;
  }

  .sidebar-item[aria-current='page'] .sidebar-item__count::part(base) {
    background-color: var(--sl-color-neutral-0);
    color: var(--sl-color-primary-700);
  }

  /* Collapsed: icon-only items are centred, text-only items are hidden. Done on the inner link because
     :host(:has(...)) is not supported by every browser. */
  .sidebar-item--collapsed:not(.sidebar-item--has-prefix) {
    display: none;
  }

  .sidebar-item--collapsed {
    justify-content: center;
    padding-inline: 0;
  }

  .sidebar-item--collapsed .sidebar-item__label,
  .sidebar-item--collapsed .sidebar-item__count {
    display: none;
  }
`;
