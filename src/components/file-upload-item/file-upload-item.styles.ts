import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .file-upload-item {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-small);
    padding-block: var(--sl-spacing-x-small);
    padding-inline-start: var(--sl-spacing-small);
    padding-inline-end: var(--sl-spacing-x-small);
    background-color: var(--sl-panel-background-color);
    border: solid 1px var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
  }

  .file-upload-item--uploaded {
    background-color: var(--sl-color-success-50);
    border-color: var(--sl-color-success-200);
  }

  .file-upload-item--failed {
    background-color: var(--sl-color-danger-50);
    border-color: var(--sl-color-danger-200);
  }

  .file-upload-item__icon {
    display: flex;
    flex: none;
    align-items: center;
    font-size: var(--sl-font-size-medium);
    color: var(--sl-color-neutral-600);
  }

  .file-upload-item--uploaded .file-upload-item__icon {
    color: var(--sl-color-success-600);
  }

  .file-upload-item--failed .file-upload-item__icon {
    color: var(--sl-color-danger-600);
  }

  .file-upload-item__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--sl-spacing-3x-small);
    min-width: 0;
  }

  .file-upload-item__filename {
    display: block;
    overflow: hidden;
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-input-label-color);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .file-upload-item__meta {
    display: block;
    font-size: var(--sl-font-size-x-small);
    color: var(--sl-input-help-text-color);
  }

  .file-upload-item--uploaded .file-upload-item__meta {
    color: var(--sl-color-success-600);
  }

  .file-upload-item--failed .file-upload-item__meta {
    color: var(--sl-color-danger-600);
  }

  .file-upload-item__progress {
    --height: 4px;

    margin-top: var(--sl-spacing-3x-small);
  }

  .file-upload-item__retry {
    flex: none;
  }
`;
