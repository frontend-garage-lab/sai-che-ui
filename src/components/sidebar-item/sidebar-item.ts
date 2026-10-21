import SlSidebarItem from './sidebar-item.component.js';

export * from './sidebar-item.component.js';
export default SlSidebarItem;

SlSidebarItem.define('sl-sidebar-item');

declare global {
  interface HTMLElementTagNameMap {
    'sl-sidebar-item': SlSidebarItem;
  }
}
