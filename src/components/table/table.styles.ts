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
    /* min-width keeps the row at least as wide as the scroller; fixed-width columns can still push it wider */
    width: 100%;
    min-width: 100%;
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

  /* Column headers */

  .table__column {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-2x-small);
    min-width: 0;
    box-sizing: border-box;
    width: 100%;
    padding: var(--sl-spacing-x-small) var(--sl-spacing-small);
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-small);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-x-small);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-dense);
    letter-spacing: var(--sl-letter-spacing-loose);
    text-transform: uppercase;
    color: var(--sl-color-neutral-600);
    text-align: inherit;
    transition: color var(--sl-transition-x-fast) ease;
  }

  .table__column--align-center {
    justify-content: center;
  }

  .table__column--align-end {
    justify-content: flex-end;
  }

  .table__column--sortable {
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .table__column--sortable:hover {
    color: var(--sl-color-neutral-1000);
  }

  .table__column--sortable:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(-1 * var(--sl-focus-ring-width));
  }

  .table__column-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .table__sort-icon {
    flex: 0 0 auto;
    color: var(--sl-color-primary-600);
    transition: rotate var(--sl-transition-fast) ease;
  }

  .table__sort-icon--ascending {
    rotate: 180deg;
  }

  .table__sort-icon--placeholder {
    color: var(--sl-color-neutral-400);
    visibility: hidden;
  }

  .table__column--sortable:hover .table__sort-icon--placeholder {
    visibility: visible;
  }

  /* Body */

  .table__body {
    display: block;
  }

  .table__row:last-of-type {
    border-bottom: none;
  }

  :host([striped]) .table__row:nth-of-type(even):not([selected]):not(:hover) {
    background-color: var(--stripe-background-color);
  }

  .table__empty {
    padding: var(--sl-spacing-2x-large) var(--sl-spacing-medium);
    text-align: center;
    color: var(--sl-color-neutral-500);
  }

  /* Rows */

  .table__row {
    display: grid;
    grid-template-columns: var(--sl-table-column-template, 1fr);
    align-items: stretch;
    box-sizing: border-box;
    /* min-width keeps the row at least as wide as the scroller; fixed-width columns can still push it wider */
    width: 100%;
    min-width: 100%;
    border-bottom: solid var(--sl-panel-border-width) var(--border-color);
    background-color: var(--sl-color-neutral-0);
    outline: none;
    /* Rows are scanned quickly, so hover/selection feedback needs to feel instant */
    transition:
      background-color var(--sl-transition-x-fast) ease,
      box-shadow var(--sl-transition-x-fast) ease;
  }

  .table__row:hover:not([disabled]) {
    background-color: var(--sl-color-neutral-50);
  }

  /* The variant marker shares the same edge as selection, so selection (set below) takes priority when both apply */
  .table__row[variant='primary'] {
    box-shadow: inset 3px 0 0 var(--marker-color, var(--sl-color-primary-600));
  }

  .table__row[variant='accent'] {
    box-shadow: inset 3px 0 0 var(--marker-color, var(--sl-color-accent-500));
  }

  .table__row[variant='success'] {
    box-shadow: inset 3px 0 0 var(--marker-color, var(--sl-color-success-600));
  }

  .table__row[variant='neutral'] {
    box-shadow: inset 3px 0 0 var(--marker-color, var(--sl-color-neutral-500));
  }

  .table__row[variant='warning'] {
    box-shadow: inset 3px 0 0 var(--marker-color, var(--sl-color-warning-500));
  }

  .table__row[variant='danger'] {
    box-shadow: inset 3px 0 0 var(--marker-color, var(--sl-color-danger-600));
  }

  /* Selected rows get a petrol edge as well as a tint, so selection survives striping */
  .table__row[selected] {
    background-color: var(--sl-color-primary-50);
    box-shadow: inset 3px 0 0 var(--sl-color-primary-600);
  }

  .table__row[selected]:hover {
    background-color: var(--sl-color-primary-100);
  }

  .table__row[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .table__row:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(-1 * var(--sl-focus-ring-width));
    z-index: 1;
  }

  .table__row-selection {
    /* The table handles selection for the whole row, so the checkbox is presentational */
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: var(--sl-spacing-small);
  }

  .table__row-selection sl-checkbox::part(base) {
    display: flex;
  }

  .table__row-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: var(--sl-spacing-2x-small);
  }

  .table__action-trigger {
    font-size: var(--sl-font-size-medium);
    color: var(--sl-color-neutral-600);
  }

  .table__action-trigger:hover,
  .table__action-menu[open] .table__action-trigger {
    color: var(--sl-color-neutral-1000);
  }

  /* Cells */

  .table__cell {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-2x-small);
    min-width: 0;
    box-sizing: border-box;
    padding: var(--sl-spacing-x-small) var(--sl-spacing-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-dense);
    color: var(--sl-color-neutral-800);
  }

  .table__cell--align-center {
    justify-content: center;
    text-align: center;
  }

  .table__cell--align-end {
    justify-content: flex-end;
    text-align: end;
  }

  .table__cell--nowrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  /* Footer */

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
