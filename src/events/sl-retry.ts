export type SlRetryEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-retry': SlRetryEvent;
  }
}
