import { css } from 'lit';

export default css`
  :host {
    --panel-width: 26rem;
    --panel-max-height: 32rem;

    display: inline-block;
  }

  /* Bell button: same ghost behaviour as sl-icon-button; inherits the header colour through --color */
  .notification-panel__trigger {
    position: relative;
    display: flex;
    align-items: center;
    padding: var(--sl-spacing-x-small);
    border: none;
    border-radius: var(--sl-border-radius-medium);
    background: none;
    /* Same text colour as sl-header-item: --color at 82%, full strength on hover */
    color: color-mix(in srgb, var(--color, var(--sl-color-neutral-600)) 82%, transparent);
    font-size: var(--sl-font-size-large);
    cursor: pointer;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) background-color;
  }

  .notification-panel__trigger:hover,
  .notification-panel__trigger:focus-visible,
  :host([open]) .notification-panel__trigger {
    color: var(--color, var(--sl-color-neutral-600));
    background-color: color-mix(in srgb, var(--color, var(--sl-color-neutral-600)) 10%, transparent);
  }

  .notification-panel__trigger:focus {
    outline: none;
  }

  .notification-panel__trigger:focus-visible {
    outline: solid 2px currentColor;
    outline-offset: -2px;
  }

  .notification-panel__badge {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    translate: 25% -10%;
    font-size: var(--sl-font-size-2x-small);
    pointer-events: none;
  }

  .notification-panel__badge::part(base) {
    min-width: 1.25em;
    padding: 0 var(--sl-spacing-3x-small);
  }

  .notification-panel {
    display: flex;
    flex-direction: column;
    width: var(--panel-width);
    max-width: calc(100vw - 2 * var(--sl-spacing-medium));
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    background-color: var(--sl-panel-background-color);
    box-shadow: var(--sl-shadow-large);
    overflow: hidden;
  }

  .notification-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sl-spacing-small);
    padding: var(--sl-spacing-x-small) var(--sl-spacing-x-small) var(--sl-spacing-x-small) var(--sl-spacing-medium);
    border-bottom: solid var(--sl-panel-border-width) var(--sl-color-neutral-200);
  }

  .notification-panel__heading {
    min-width: 0;
    padding: var(--sl-spacing-2x-small) 0;
  }

  .notification-panel__description {
    margin: 0;
    color: var(--sl-color-neutral-600);
    font-size: var(--sl-font-size-x-small);
    line-height: var(--sl-line-height-normal);
  }

  .notification-panel__title {
    margin: 0;
    color: var(--sl-color-neutral-900);
    /* Same as the DS Heading/H4 text style (card titles, .rs-heading) */
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-normal);
  }

  .notification-panel__list {
    max-height: var(--panel-max-height);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .notification-panel__empty {
    padding: var(--sl-spacing-large) var(--sl-spacing-medium);
  }

  [hidden] {
    display: none !important;
  }

  /* Informational footer (retention, settings link): Caption, aligned with the items' text */
  .notification-panel__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sl-spacing-small);
    padding: var(--sl-spacing-small) var(--sl-spacing-medium);
    background-color: var(--sl-color-neutral-50);
    color: var(--sl-color-neutral-600);
    font-size: var(--sl-font-size-x-small);
    line-height: var(--sl-line-height-normal);
    border-top: solid var(--sl-panel-border-width) var(--sl-color-neutral-200);
  }

  .notification-panel__live {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
`;
