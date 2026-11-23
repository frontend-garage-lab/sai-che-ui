export type SlNotificationReadAllEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-notification-read-all': SlNotificationReadAllEvent;
  }
}
