import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .comment {
    display: flex;
    align-items: flex-start;
    gap: var(--sl-spacing-small);
    padding: var(--sl-spacing-small);
    background-color: var(--sl-panel-background-color);
    border: solid 1px var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-large);
  }

  .comment__avatar {
    flex: none;
  }

  .comment__avatar ::slotted(sl-avatar) {
    --size: 2.25rem;
  }

  .comment__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--sl-spacing-3x-small);
    min-width: 0;
  }

  .comment__meta {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-2x-small);
  }

  .comment__author {
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-input-label-color);
  }

  .comment__date {
    font-size: var(--sl-font-size-x-small);
    color: var(--sl-input-help-text-color);
  }

  .comment__date::before {
    content: '· ';
  }

  .comment__text {
    font-size: var(--sl-font-size-x-small);
    color: var(--sl-input-help-text-color);
  }

  .comment__attachment {
    flex: none;
  }
`;
