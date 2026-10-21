import SlSidebar from './sidebar.component.js';

export * from './sidebar.component.js';
export default SlSidebar;

SlSidebar.define('sl-sidebar');

declare global {
  interface HTMLElementTagNameMap {
    'sl-sidebar': SlSidebar;
  }
}
