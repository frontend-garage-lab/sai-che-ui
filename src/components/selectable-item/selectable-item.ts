import SlSelectableItem from './selectable-item.component.js';

export * from './selectable-item.component.js';
export default SlSelectableItem;

SlSelectableItem.define('sl-selectable-item');

declare global {
  interface HTMLElementTagNameMap {
    'sl-selectable-item': SlSelectableItem;
  }
}
