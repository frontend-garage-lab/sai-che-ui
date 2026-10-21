import SlSidebarGroup from './sidebar-group.component.js';

export * from './sidebar-group.component.js';
export default SlSidebarGroup;

SlSidebarGroup.define('sl-sidebar-group');

declare global {
  interface HTMLElementTagNameMap {
    'sl-sidebar-group': SlSidebarGroup;
  }
}
