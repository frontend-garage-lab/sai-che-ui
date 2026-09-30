import SlStatus from './status.component.js';

export * from './status.component.js';
export default SlStatus;

SlStatus.define('sl-status');

declare global {
  interface HTMLElementTagNameMap {
    'sl-status': SlStatus;
  }
}
