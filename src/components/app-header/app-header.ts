import SlAppHeader from './app-header.component.js';

export * from './app-header.component.js';
export default SlAppHeader;

SlAppHeader.define('sl-app-header');

declare global {
  interface HTMLElementTagNameMap {
    'sl-app-header': SlAppHeader;
  }
}
