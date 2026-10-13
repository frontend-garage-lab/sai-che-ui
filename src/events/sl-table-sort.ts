export type SlTableSortEvent = CustomEvent<{
  columnId: string;
  direction: 'asc' | 'desc';
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-table-sort': SlTableSortEvent;
  }
}
