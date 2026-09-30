import { css } from 'lit';

export default css`
  :host {
    display: grid;
    grid-template-columns: var(--sl-table-column-template, 1fr);
    align-items: stretch;
    box-sizing: border-box;
    border-bottom: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    background-color: var(--sl-color-neutral-0);
    outline: none;
    transition: background-color var(--sl-transition-fast) ease;
  }

  /* Hidden by the table when the row falls outside the current page */
  :host([data-sl-table-hidden]),
  :host([hidden]) {
    display: none;
  }

  :host(:hover:not([disabled])) {
    background-color: var(--sl-color-neutral-50);
  }

  :host([selected]) {
    background-color: var(--sl-color-primary-100);
  }

  :host([selected]:hover) {
    background-color: var(--sl-color-primary-200);
  }

  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :host(:focus-visible) {
    outline: var(--sl-focus-ring);
    outline-offset: calc(-1 * var(--sl-focus-ring-width));
    z-index: 1;
  }

  .row__selection {
    /* The table handles selection for the whole row, so the checkbox is presentational */
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: var(--sl-spacing-small);
  }

  .row__selection sl-checkbox::part(base) {
    display: flex;
  }

  .row__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: var(--sl-spacing-2x-small);
  }

  .row__action-trigger {
    font-size: var(--sl-font-size-medium);
    color: var(--sl-color-neutral-600);
  }

  .row__action-trigger:hover,
  .row__action-menu[open] .row__action-trigger {
    color: var(--sl-color-neutral-1000);
  }
`;
