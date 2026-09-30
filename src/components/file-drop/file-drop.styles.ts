import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  /*
   * Drop zone. A dashed boundary at the input-border weight (3:1) so it reads as a control, with
   * a petrol wash on hover and a solid petrol boundary while files are dragged over it.
   */
  .file-drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--sl-spacing-2x-small);
    box-sizing: border-box;
    width: 100%;
    padding: var(--sl-spacing-large) var(--sl-spacing-medium);
    border: dashed 1.5px var(--sl-input-border-color);
    border-radius: var(--sl-border-radius-large);
    background-color: var(--sl-surface-panel);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    line-height: var(--sl-line-height-dense);
    color: var(--sl-color-neutral-700);
    text-align: center;
    cursor: pointer;
    transition:
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) border-color;
  }

  .file-drop:focus {
    outline: none;
  }

  .file-drop:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .file-drop:hover:not(.file-drop--disabled) {
    border-color: var(--sl-color-primary-600);
    background-color: color-mix(in srgb, var(--sl-color-primary-50), var(--sl-surface-panel) 40%);
  }

  .file-drop--dragging:not(.file-drop--disabled) {
    border-style: solid;
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-50);
  }

  .file-drop--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .file-drop__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: var(--sl-spacing-2x-small);
    border-radius: var(--sl-border-radius-circle);
    background-color: var(--sl-color-primary-50);
    color: var(--sl-color-primary-700);
    font-size: var(--sl-font-size-large);
    transition:
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) scale;
  }

  .file-drop:hover:not(.file-drop--disabled) .file-drop__icon {
    background-color: var(--sl-color-primary-100);
  }

  .file-drop--dragging .file-drop__icon {
    background-color: var(--sl-color-primary-100);
    scale: 1.08;
  }

  .file-drop__browse {
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-primary-600);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  .file-drop__hint {
    font-size: var(--sl-font-size-x-small);
    color: var(--sl-color-neutral-600);
  }

  /* File list */
  .file-drop__list {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-2x-small);
    margin: var(--sl-spacing-x-small) 0 0;
    padding: 0;
    list-style: none;
  }

  .file-drop__file {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-small);
    padding: var(--sl-spacing-x-small) var(--sl-spacing-x-small) var(--sl-spacing-x-small) var(--sl-spacing-small);
    border: solid var(--sl-panel-border-width) var(--sl-border-subtle);
    border-radius: var(--sl-border-radius-medium);
    background-color: var(--sl-surface-panel);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    line-height: var(--sl-line-height-dense);
  }

  .file-drop__file-type {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: var(--sl-border-radius-small);
    background-color: var(--sl-color-primary-50);
    color: var(--sl-color-primary-700);
    font-size: var(--sl-font-size-2x-small);
    font-weight: var(--sl-font-weight-bold);
    letter-spacing: var(--sl-letter-spacing-loose);
    text-transform: uppercase;
  }

  .file-drop__file-type sl-icon {
    font-size: var(--sl-font-size-medium);
  }

  .file-drop__file-name {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--sl-color-neutral-900);
  }

  .file-drop__file-size {
    flex: 0 0 auto;
    font-size: var(--sl-font-size-x-small);
    font-variant-numeric: tabular-nums;
    color: var(--sl-color-neutral-600);
  }

  .file-drop__remove {
    flex: 0 0 auto;
    font-size: var(--sl-font-size-small);
  }

  @media (forced-colors: active) {
    .file-drop--dragging {
      border-color: Highlight;
    }
  }
`;
