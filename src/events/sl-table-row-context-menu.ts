import type SlTableRow from '../components/table-row/table-row.js';

export type SlTableRowContextMenuEvent = CustomEvent<{
  row: SlTableRow;
  originalEvent: MouseEvent;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-table-row-context-menu': SlTableRowContextMenuEvent;
  }
}
