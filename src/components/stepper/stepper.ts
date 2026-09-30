import SlStepper from './stepper.component.js';

export * from './stepper.component.js';
export default SlStepper;

SlStepper.define('sl-stepper');

declare global {
  interface HTMLElementTagNameMap {
    'sl-stepper': SlStepper;
  }
}
