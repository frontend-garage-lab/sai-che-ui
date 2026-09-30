import type SlTableColumn from '../components/table-column/table-column.js';

export type SlTableSortEvent = CustomEvent<{
  column: SlTableColumn;
  key: string;
  direction: 'asc' | 'desc';
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-table-sort': SlTableSortEvent;
  }
}
