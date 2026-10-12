import { css } from 'lit';

export default css`
  :host {
    display: block;
    min-width: 0;
  }

  .description-list-item {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-3x-small);
    min-width: 0;
  }

  .description-list-item__label {
    font-size: var(--sl-font-size-x-small);
    color: var(--sl-input-help-text-color);
    white-space: nowrap;
  }

  .description-list-item__value {
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-input-label-color);
    overflow-wrap: anywhere;
  }
`;
