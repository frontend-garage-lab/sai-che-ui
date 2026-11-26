import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  [hidden] {
    display: none !important;
  }

  .notification-item {
    display: flex;
    align-items: flex-start;
    gap: var(--sl-spacing-small);
    padding: var(--sl-spacing-medium);
    border-bottom: solid var(--sl-panel-border-width) var(--sl-color-neutral-200);
  }

  :host(:last-of-type) .notification-item {
    border-bottom: none;
  }

  /* Outcome icon: the shape carries the meaning (and the label for screen readers), colour reinforces it */
  .notification-item__icon {
    flex: 0 0 auto;
    display: flex;
    padding-top: var(--sl-spacing-3x-small);
    color: var(--sl-color-neutral-600);
    font-size: var(--sl-font-size-large);
  }

  .notification-item--success .notification-item__icon {
    color: var(--sl-color-success-600);
  }

  .notification-item--warning .notification-item__icon {
    color: var(--sl-color-warning-600);
  }

  .notification-item--danger .notification-item__icon {
    color: var(--sl-color-danger-600);
  }

  .notification-item--info .notification-item__icon {
    color: var(--sl-color-primary-600);
  }

  .notification-item {
    transition: var(--sl-transition-fast) background-color;
  }

  .notification-item:hover {
    background-color: var(--sl-color-neutral-50);
  }

  /* New: light primary tint, so new items stand out from the read ones at a glance */
  .notification-item--new {
    background-color: var(--sl-color-primary-50);
  }

  .notification-item--new:hover {
    background-color: var(--sl-color-primary-100);
  }

  .notification-item__body {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-3x-small);
  }

  /* Title left, "New" + time right: what happened and when, scanned on one line */
  .notification-item__header {
    display: flex;
    align-items: flex-start;
    gap: var(--sl-spacing-small);
  }

  /* Body/Small: semibold while new, normal once read, so new items stand out without extra markers */
  .notification-item__title {
    flex: 1 1 auto;
    min-width: 0;
    color: var(--sl-color-neutral-900);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-dense);
    overflow-wrap: break-word;
  }

  :host([read]) .notification-item__title {
    font-weight: var(--sl-font-weight-normal);
  }

  /* As tall as the title's first line, contents centred on it: badge and time line up with the title */
  .notification-item__aside {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    min-height: calc(var(--sl-font-size-small) * var(--sl-line-height-dense));
    gap: var(--sl-spacing-x-small);
    font-size: var(--sl-font-size-x-small);
    line-height: var(--sl-line-height-dense);
    white-space: nowrap;
  }

  /* Single "new" marker: a primary pill badge with text, not only colour */
  .notification-item__new {
    display: flex;
    /* The badge (~22px) is a bit taller than the title line: let it overflow evenly instead of pushing the row */
    margin-block: calc(-1 * var(--sl-spacing-3x-small));
  }

  .notification-item__time {
    color: var(--sl-color-neutral-600);
  }

  .notification-item__message {
    color: var(--sl-color-neutral-700);
    font-size: var(--sl-font-size-small);
    line-height: var(--sl-line-height-normal);
    overflow-wrap: break-word;
  }

  /* Caption: where it comes from */
  .notification-item__origin {
    color: var(--sl-color-neutral-600);
    font-size: var(--sl-font-size-x-small);
    line-height: var(--sl-line-height-dense);
  }

  .notification-item__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sl-spacing-x-small);
    margin-top: var(--sl-spacing-x-small);
  }
`;
