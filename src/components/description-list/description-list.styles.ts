import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .description-list {
    display: grid;
    grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr));
    row-gap: var(--sl-spacing-x-small);
    column-gap: var(--sl-spacing-medium);
  }
`;
