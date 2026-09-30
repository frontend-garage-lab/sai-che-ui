import { css } from 'lit';

export default css`
  :host {
    display: contents;

    /* For better DX, we'll reset the margin here so the base part can inherit it */
    margin: 0;
  }

  /*
   * Each variant sets four private properties; the layout below only reads them. The alert
   * is a tinted panel with a thin border and a solid edge on the leading side, so the
   * variant reads at a glance without the whole surface shouting.
   */
  .alert {
    --alert-edge: var(--sl-color-primary-600);
    --alert-tint: var(--sl-color-primary-50);
    --alert-border: var(--sl-color-primary-200);
    --alert-icon: var(--sl-color-primary-600);

    position: relative;
    display: flex;
    align-items: stretch;
    background-color: var(--alert-tint);
    border: solid var(--sl-panel-border-width) var(--alert-border);
    border-inline-start: solid calc(var(--sl-panel-border-width) * 3) var(--alert-edge);
    border-radius: var(--sl-border-radius-medium);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    color: var(--sl-color-neutral-800);
    margin: inherit;
    overflow: hidden;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: flex-start;
    /* Line the 16px icon up with the first 14px line of the message, not the whole block */
    padding-top: calc(var(--sl-spacing-small) + 0.15rem);
    padding-inline-start: var(--sl-spacing-medium);
    font-size: var(--sl-font-size-medium);
    color: var(--alert-icon);
  }

  .alert--has-countdown {
    border-bottom: none;
  }

  .alert--primary {
    --alert-edge: var(--sl-color-primary-600);
    --alert-tint: var(--sl-color-primary-50);
    --alert-border: var(--sl-color-primary-200);
    --alert-icon: var(--sl-color-primary-600);
  }

  .alert--accent {
    --alert-edge: var(--sl-color-accent-500);
    --alert-tint: var(--sl-color-accent-50);
    --alert-border: var(--sl-color-accent-200);
    --alert-icon: var(--sl-color-accent-700);
  }

  .alert--success {
    --alert-edge: var(--sl-color-success-600);
    --alert-tint: var(--sl-color-success-50);
    --alert-border: var(--sl-color-success-200);
    --alert-icon: var(--sl-color-success-600);
  }

  .alert--neutral {
    --alert-edge: var(--sl-color-neutral-500);
    --alert-tint: var(--sl-color-neutral-50);
    --alert-border: var(--sl-color-neutral-200);
    --alert-icon: var(--sl-color-neutral-600);
  }

  .alert--warning {
    --alert-edge: var(--sl-color-warning-500);
    --alert-tint: var(--sl-color-warning-50);
    --alert-border: var(--sl-color-warning-200);
    --alert-icon: var(--sl-color-warning-600);
  }

  .alert--danger {
    --alert-edge: var(--sl-color-danger-600);
    --alert-tint: var(--sl-color-danger-50);
    --alert-border: var(--sl-color-danger-200);
    --alert-icon: var(--sl-color-danger-600);
  }

  .alert__message {
    flex: 1 1 auto;
    display: block;
    padding: var(--sl-spacing-small) var(--sl-spacing-medium);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-small);
    margin-inline-end: var(--sl-spacing-x-small);
    align-self: flex-start;
    margin-top: var(--sl-spacing-2x-small);
  }

  .alert__countdown {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(var(--sl-panel-border-width) * 3);
    background-color: var(--alert-border);
    display: flex;
  }

  .alert__countdown--ltr {
    justify-content: flex-end;
  }

  .alert__countdown .alert__countdown-elapsed {
    height: 100%;
    width: 0;
    background-color: var(--alert-edge);
  }

  .alert__timer {
    display: none;
  }
`;
