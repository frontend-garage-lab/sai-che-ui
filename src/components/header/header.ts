import SlHeader from './header.component.js';

export * from './header.component.js';
export default SlHeader;

SlHeader.define('sl-header');

declare global {
  interface HTMLElementTagNameMap {
    'sl-header': SlHeader;
  }
}
