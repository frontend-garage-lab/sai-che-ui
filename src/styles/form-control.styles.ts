import { css } from 'lit';

export default css`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    font-weight: var(--sl-font-weight-semibold);
    margin-bottom: var(--sl-spacing-2x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Validation status */
  :host([status='success']) {
    --sl-input-border-color: var(--sl-color-success-600);
    --sl-input-border-color-hover: var(--sl-color-success-700);
    --sl-input-border-color-focus: var(--sl-color-success-600);
    --sl-input-focus-ring-color: color-mix(in srgb, var(--sl-color-success-500), transparent 60%);
    --sl-input-help-text-color: var(--sl-color-success-700);
  }

  :host([status='warning']) {
    --sl-input-border-color: var(--sl-color-warning-600);
    --sl-input-border-color-hover: var(--sl-color-warning-700);
    --sl-input-border-color-focus: var(--sl-color-warning-600);
    --sl-input-focus-ring-color: color-mix(in srgb, var(--sl-color-warning-500), transparent 60%);
    --sl-input-help-text-color: var(--sl-color-warning-700);
  }

  :host([status='danger']) {
    --sl-input-border-color: var(--sl-color-danger-600);
    --sl-input-border-color-hover: var(--sl-color-danger-700);
    --sl-input-border-color-focus: var(--sl-color-danger-600);
    --sl-input-focus-ring-color: color-mix(in srgb, var(--sl-color-danger-500), transparent 60%);
    --sl-input-help-text-color: var(--sl-color-danger-700);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-2x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }
`;
