import { css } from 'lit';

export default css`
  :host {
    display: flex;
    align-items: center;
    min-width: 0;
    box-sizing: border-box;
    padding: var(--sl-spacing-x-small) var(--sl-spacing-small);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-dense);
    color: var(--sl-color-neutral-700);
  }

  :host([align='center']) {
    justify-content: center;
    text-align: center;
  }

  :host([align='end']) {
    justify-content: flex-end;
    text-align: end;
  }

  .cell {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-2x-small);
    min-width: 0;
  }

  :host([nowrap]) .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
`;
