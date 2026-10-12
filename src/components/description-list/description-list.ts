import SlDescriptionList from './description-list.component.js';

export * from './description-list.component.js';
export default SlDescriptionList;

SlDescriptionList.define('sl-description-list');

declare global {
  interface HTMLElementTagNameMap {
    'sl-description-list': SlDescriptionList;
  }
}
