import { css } from 'lit';

export default css`
  :host {
    --border-color: var(--sl-panel-border-color);
    --border-radius: var(--sl-border-radius-medium);
    --header-background-color: var(--sl-surface-sunken);
    --stripe-background-color: var(--sl-color-neutral-50);
    --max-height: none;

    display: block;
  }

  .table {
    display: flex;
    flex-direction: column;
    border: solid var(--sl-panel-border-width) var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--sl-color-neutral-0);
    overflow: hidden;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    color: var(--sl-color-neutral-700);
    /* Protocol numbers, dates and sizes line up column-wise */
    font-variant-numeric: tabular-nums;
  }

  .table__toolbar {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-x-small);
    padding: var(--sl-spacing-x-small) var(--sl-spacing-small);
    border-bottom: solid var(--sl-panel-border-width) var(--border-color);
  }

  .table__toolbar--empty {
    display: none;
  }

  .table__scroller {
    overflow: auto;
    max-height: var(--max-height);
  }

  .table__header {
    display: grid;
    grid-template-columns: var(--sl-table-column-template, 1fr);
    align-items: stretch;
    background-color: var(--header-background-color);
    border-bottom: solid var(--sl-panel-border-width) var(--border-color);
  }

  :host([sticky-header]) .table__header {
    position: sticky;
    top: 0;
    z-index: 2;
  }

  .table__select-all {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: var(--sl-spacing-small);
  }

  .table__actions-header {
    /* Matches the width of the action trigger in each row */
    min-width: calc(var(--sl-font-size-medium) + var(--sl-spacing-x-large));
  }

  .table__body {
    display: block;
  }

  .table__body ::slotted(sl-table-row:last-of-type) {
    border-bottom: none;
  }

  /*
   * ::slotted() rules beat the row's own :host() rules, so leave hovered and selected rows
   * alone or their states would disappear on every other row.
   */
  :host([striped]) .table__body ::slotted(sl-table-row:nth-of-type(even):not([selected]):not(:hover)) {
    background-color: var(--stripe-background-color);
  }

  .table__empty {
    padding: var(--sl-spacing-2x-large) var(--sl-spacing-medium);
    text-align: center;
    color: var(--sl-color-neutral-500);
  }

  .table__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--sl-spacing-small);
    padding: var(--sl-spacing-x-small) var(--sl-spacing-small);
    border-top: solid var(--sl-panel-border-width) var(--border-color);
    font-size: var(--sl-font-size-small);
  }

  .table__summary {
    color: var(--sl-color-neutral-600);
  }

  .table__pagination {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-2x-small);
  }

  .table__page-status {
    padding-inline: var(--sl-spacing-2x-small);
    white-space: nowrap;
  }

  .table__page-size {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-x-small);
    white-space: nowrap;
  }

  .table__page-size sl-select {
    width: 6rem;
  }
`;
