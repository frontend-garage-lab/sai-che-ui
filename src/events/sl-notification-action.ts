import type SlNotificationItem from '../components/notification-item/notification-item.js';

export type SlNotificationActionEvent = CustomEvent<{ item: SlNotificationItem }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-notification-action': SlNotificationActionEvent;
  }
}
