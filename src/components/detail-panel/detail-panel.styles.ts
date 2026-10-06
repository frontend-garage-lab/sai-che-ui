import { css } from 'lit';

export default css`
  :host {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    background-color: var(--sl-surface-panel);
    border-inline-start: solid var(--sl-panel-border-width) var(--sl-border-subtle);
  }

  .detail-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    font-family: var(--sl-font-sans);
  }

  .detail-panel__header {
    flex: 0 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--sl-spacing-small);
    padding: var(--sl-spacing-medium);
    border-bottom: solid var(--sl-panel-border-width) var(--sl-border-subtle);
  }

  .detail-panel__heading {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-3x-small);
    min-width: 0;
  }

  .detail-panel__title {
    margin: 0;
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-dense);
    color: var(--sl-color-neutral-900);
  }

  .detail-panel__meta {
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    color: var(--sl-color-neutral-500);
  }

  .detail-panel__meta:empty {
    display: none;
  }

  .detail-panel__close {
    flex: 0 0 auto;
    font-size: var(--sl-font-size-medium);
  }

  .detail-panel__body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
  }
`;
