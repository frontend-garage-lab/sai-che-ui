import SlDescriptionListItem from './description-list-item.component.js';

export * from './description-list-item.component.js';
export default SlDescriptionListItem;

SlDescriptionListItem.define('sl-description-list-item');

declare global {
  interface HTMLElementTagNameMap {
    'sl-description-list-item': SlDescriptionListItem;
  }
}
