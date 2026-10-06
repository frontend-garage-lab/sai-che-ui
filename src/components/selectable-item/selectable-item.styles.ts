import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .selectable-item {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-small);
    box-sizing: border-box;
    width: 100%;
    min-height: 2.75rem;
    padding: var(--sl-spacing-x-small) var(--sl-spacing-small);
    border-radius: var(--sl-border-radius-medium);
    cursor: pointer;
    font-family: var(--sl-font-sans);
    transition: var(--sl-transition-fast) background-color;
  }

  .selectable-item:hover:not(.selectable-item--disabled) {
    background-color: var(--sl-color-neutral-50);
  }

  .selectable-item--checked {
    background-color: var(--sl-color-primary-50);
  }

  .selectable-item--checked:hover:not(.selectable-item--disabled) {
    background-color: var(--sl-color-primary-50);
  }

  .selectable-item--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .selectable-item__checkbox {
    flex: 0 0 auto;
  }

  .selectable-item__label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    color: var(--sl-color-neutral-900);
  }

  .selectable-item__meta {
    flex: 0 0 auto;
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    color: var(--sl-color-neutral-500);
  }

  .selectable-item__meta:empty {
    display: none;
  }
`;
