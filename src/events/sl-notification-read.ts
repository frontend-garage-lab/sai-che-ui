import type SlNotificationItem from '../components/notification-item/notification-item.js';

export type SlNotificationReadEvent = CustomEvent<{ item: SlNotificationItem }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-notification-read': SlNotificationReadEvent;
  }
}
