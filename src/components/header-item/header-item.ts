import SlHeaderItem from './header-item.component.js';

export * from './header-item.component.js';
export default SlHeaderItem;

SlHeaderItem.define('sl-header-item');

declare global {
  interface HTMLElementTagNameMap {
    'sl-header-item': SlHeaderItem;
  }
}
