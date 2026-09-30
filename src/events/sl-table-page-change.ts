export type SlTablePageChangeEvent = CustomEvent<{ page: number; pageSize: number }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-table-page-change': SlTablePageChangeEvent;
  }
}
