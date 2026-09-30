import { css } from 'lit';

export default css`
  :host {
    display: flex;
    align-items: center;
    min-width: 0;
    box-sizing: border-box;
    /* Small caps-style headers: clearly a label row, never mistaken for data */
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-x-small);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-dense);
    letter-spacing: var(--sl-letter-spacing-loose);
    text-transform: uppercase;
    color: var(--sl-color-neutral-600);
  }

  :host([align='center']) {
    justify-content: center;
  }

  :host([align='end']) {
    justify-content: flex-end;
  }

  .column {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-2x-small);
    width: 100%;
    min-width: 0;
    padding: var(--sl-spacing-x-small) var(--sl-spacing-small);
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-small);
    font: inherit;
    color: inherit;
    text-align: inherit;
  }

  :host([align='center']) .column {
    justify-content: center;
  }

  :host([align='end']) .column {
    justify-content: flex-end;
  }

  .column--sortable {
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .column--sortable:hover {
    color: var(--sl-color-neutral-1000);
  }

  .column--sortable:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(-1 * var(--sl-focus-ring-width));
  }

  .column__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .column__sort-icon {
    flex: 0 0 auto;
    color: var(--sl-color-primary-600);
    transition: rotate var(--sl-transition-fast) ease;
  }

  .column__sort-icon--ascending {
    rotate: 180deg;
  }

  .column__sort-icon--placeholder {
    color: var(--sl-color-neutral-400);
    visibility: hidden;
  }

  .column--sortable:hover .column__sort-icon--placeholder {
    visibility: visible;
  }
`;
