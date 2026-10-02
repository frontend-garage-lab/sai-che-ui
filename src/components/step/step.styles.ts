import { css } from 'lit';

export default css`
  :host {
    --indicator-size: 1.5rem;
    --connector-width: 2px;

    display: block;
  }

  .step {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--sl-spacing-x-small);
    font-family: var(--sl-font-sans);
  }

  .step__control {
    display: flex;
    align-items: flex-start;
    gap: var(--sl-spacing-x-small);
    min-width: 0;
    padding: 0;
    margin: 0;
    border: none;
    border-radius: var(--sl-border-radius-small);
    background: none;
    font: inherit;
    color: inherit;
    text-align: start;
  }

  button.step__control {
    cursor: pointer;
  }

  button.step__control:focus {
    outline: none;
  }

  button.step__control:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /*
   * Indicator. Upcoming steps are an outlined number, the current step is a petrol ring with the
   * same halo as <sl-status>, and completed steps are a solid petrol disc with a check.
   */
  .step__indicator {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--indicator-size);
    height: var(--indicator-size);
    border: solid 1.5px var(--sl-color-neutral-400);
    border-radius: var(--sl-border-radius-circle);
    background-color: var(--sl-surface-panel);
    color: var(--sl-color-neutral-600);
    font-size: var(--sl-font-size-x-small);
    font-weight: var(--sl-font-weight-semibold);
    font-variant-numeric: tabular-nums;
    line-height: 1;
    transition:
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) box-shadow;
  }

  .step--current .step__indicator {
    border-width: 2px;
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-50);
    color: var(--sl-color-primary-700);
    box-shadow: 0 0 0 3px var(--sl-color-primary-100);
  }

  .step--complete .step__indicator {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-primary-contrast);
  }

  .step--error .step__indicator {
    border-color: var(--sl-color-danger-600);
    background-color: var(--sl-color-danger-50);
    color: var(--sl-color-danger-600);
    box-shadow: none;
  }

  .step--interactive .step__control:hover .step__indicator {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
  }

  .step--interactive.step--error .step__control:hover .step__indicator {
    border-color: var(--sl-color-danger-700);
    background-color: var(--sl-color-danger-100);
  }

  /* Text */
  .step__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    /* Centre the first line of the label on the indicator */
    padding-top: calc((var(--indicator-size) - 1em * var(--sl-line-height-dense)) / 2);
    font-size: var(--sl-font-size-small);
    line-height: var(--sl-line-height-dense);
  }

  .step__label {
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-600);
    transition: var(--sl-transition-fast) color;
  }

  .step--current .step__label,
  .step--complete .step__label {
    color: var(--sl-color-neutral-900);
  }

  .step--error .step__label {
    color: var(--sl-color-danger-700);
  }

  .step--interactive .step__control:hover .step__label {
    color: var(--sl-color-primary-700);
  }

  .step__description {
    margin-top: var(--sl-spacing-3x-small);
    font-size: var(--sl-font-size-x-small);
    color: var(--sl-color-neutral-600);
  }

  /* Screen-reader-only state text */
  .step__announcement {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  /* Connector */
  .step__connector {
    flex: 1 1 auto;
    display: block;
    border-radius: var(--sl-border-radius-pill);
    background-color: var(--sl-color-neutral-300);
    transition: var(--sl-transition-fast) background-color;
  }

  .step--complete .step__connector {
    background-color: var(--sl-color-primary-600);
  }

  .step--horizontal .step__connector {
    min-width: var(--sl-spacing-large);
    height: var(--connector-width);
    margin-top: calc(var(--indicator-size) / 2 - var(--connector-width) / 2);
    margin-inline: var(--sl-spacing-x-small);
  }

  /* Vertical steps stack, with the connector running down from the indicator */
  .step--vertical:not(.step--last) {
    padding-bottom: var(--sl-spacing-large);
  }

  .step--vertical .step__connector {
    position: absolute;
    top: calc(var(--indicator-size) + var(--sl-spacing-2x-small));
    bottom: var(--sl-spacing-2x-small);
    inset-inline-start: calc(var(--indicator-size) / 2 - var(--connector-width) / 2);
    width: var(--connector-width);
  }

  .step--disabled {
    opacity: 0.5;
  }

  .step--disabled .step__control {
    cursor: not-allowed;
  }

  @media (forced-colors: active) {
    .step--current .step__indicator,
    .step--complete .step__indicator {
      border-color: Highlight;
    }

    .step__connector {
      background-color: CanvasText;
    }
  }
`;
