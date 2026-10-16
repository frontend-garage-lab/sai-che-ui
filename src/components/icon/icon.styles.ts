import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  :host([variant='neutral']) {
    color: var(--sl-color-neutral-500);
  }

  :host([variant='accent']) {
    color: var(--sl-color-accent-600);
  }

  :host([variant='success']) {
    color: var(--sl-color-success-600);
  }

  :host([variant='danger']) {
    color: var(--sl-color-danger-600);
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;
