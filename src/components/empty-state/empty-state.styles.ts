import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--sl-spacing-small);
    box-sizing: border-box;
    width: 100%;
    padding: var(--sl-spacing-2x-large) var(--sl-spacing-medium);
    text-align: center;
    font-family: var(--sl-font-sans);
  }

  /* Tinted neutral badge. Empty when there's no icon, so it collapses to nothing. */
  .empty-state__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: var(--sl-border-radius-large);
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-500);
    font-size: var(--sl-font-size-x-large);
  }

  .empty-state__icon:empty {
    display: none;
  }

  .empty-state__title {
    margin: 0;
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-dense);
    color: var(--sl-color-neutral-900);
  }

  .empty-state__title:empty {
    display: none;
  }

  .empty-state__description {
    margin: 0;
    max-width: 32rem;
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    color: var(--sl-color-neutral-600);
  }

  .empty-state__description:empty {
    display: none;
  }

  .empty-state__action {
    margin-top: var(--sl-spacing-x-small);
  }

  .empty-state__action:empty {
    display: none;
  }
`;
