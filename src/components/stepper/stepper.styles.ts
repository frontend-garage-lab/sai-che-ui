import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .stepper {
    display: flex;
  }

  .stepper--horizontal {
    flex-direction: row;
    align-items: flex-start;
  }

  /* Every step but the last stretches, so the connectors share the free space evenly */
  .stepper--horizontal ::slotted(sl-step) {
    flex: 1 1 0;
    min-width: 0;
  }

  .stepper--horizontal ::slotted(sl-step:last-of-type) {
    flex: 0 0 auto;
  }

  .stepper--vertical {
    flex-direction: column;
  }
`;
