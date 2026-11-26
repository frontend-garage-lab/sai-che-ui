import SlNotificationPanel from './notification-panel.component.js';

export * from './notification-panel.component.js';
export default SlNotificationPanel;

SlNotificationPanel.define('sl-notification-panel');

declare global {
  interface HTMLElementTagNameMap {
    'sl-notification-panel': SlNotificationPanel;
  }
}
