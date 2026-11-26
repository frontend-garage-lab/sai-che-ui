import SlNotificationItem from './notification-item.component.js';

export * from './notification-item.component.js';
export default SlNotificationItem;

SlNotificationItem.define('sl-notification-item');

declare global {
  interface HTMLElementTagNameMap {
    'sl-notification-item': SlNotificationItem;
  }
}
