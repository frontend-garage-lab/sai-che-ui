import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .legend {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    line-height: var(--sl-line-height-dense);
    color: var(--sl-color-neutral-600);
  }

  .legend__label {
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-800);
  }

  /* Icon and title stay together, closer than the items */
  .legend__head {
    display: inline-flex;
    align-items: center;
    gap: var(--sl-spacing-2x-small);
  }

  .legend__icon {
    display: inline-flex;
    align-items: center;
    color: var(--sl-color-neutral-500);
  }

  /* Inline: title and items on one line that wraps, next to a section title or above a list */
  .legend--inline {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--sl-spacing-2x-small) var(--sl-spacing-medium);
  }

  .legend--inline .legend__items {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--sl-spacing-2x-small) var(--sl-spacing-medium);
  }

  /* List: title above, one item per row, in columns; markers share a column so the texts line up */
  .legend--list {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-x-small);
  }

  .legend--list .legend__items {
    --sl-legend-marker-min-width: 2.25em;
    display: grid;
    grid-template-columns: repeat(var(--columns, 1), minmax(0, max-content));
    gap: var(--sl-spacing-x-small) var(--sl-spacing-x-large);
  }
`;
