import { css } from 'lit';

export default css`
  :host {
    --border-color: var(--sl-border-subtle);
    --border-radius: var(--sl-border-radius-large);
    --border-width: 1px;
    --padding: var(--sl-spacing-large);
    --accent-width: 3px;

    display: inline-block;
  }

  /* Fills the host when it's stretched (e.g. in a grid row), with the body taking the spare room so footers line up */
  .card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    background-color: var(--sl-panel-background-color);
    box-shadow: var(--sl-shadow-x-small);
    border: solid var(--border-width) var(--border-color);
    border-radius: var(--border-radius);
  }

  .card__image {
    display: flex;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    margin: calc(-1 * var(--border-width));
    overflow: hidden;
  }

  .card__image::slotted(img) {
    display: block;
    width: 100%;
  }

  .card:not(.card--has-image) .card__image {
    display: none;
  }

  .card__header {
    display: block;
    min-width: 0;
    border-bottom: solid var(--border-width) var(--border-color);
    padding: var(--sl-spacing-small) var(--padding);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-900);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card:not(.card--has-header) .card__header {
    display: none;
  }

  .card:not(.card--has-image) .card__header {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .card__body {
    display: block;
    flex: 1 1 auto;
    padding: var(--padding);
  }

  .card--has-footer .card__footer {
    display: block;
    border-top: solid var(--border-width) var(--border-color);
    padding: var(--padding);
  }

  .card:not(.card--has-footer) .card__footer {
    display: none;
  }

  /* Variant: colored top edge, same palette as sl-stat */
  .card--accented {
    border-top: solid var(--accent-width) var(--card-color);
  }

  .card--primary {
    --card-color: var(--sl-color-primary-600);
  }

  .card--accent {
    --card-color: var(--sl-color-accent-700);
  }

  .card--success {
    --card-color: var(--sl-color-success-600);
  }

  .card--neutral {
    --card-color: var(--sl-color-neutral-600);
  }

  .card--warning {
    --card-color: var(--sl-color-warning-600);
  }

  .card--danger {
    --card-color: var(--sl-color-danger-600);
  }
`;
