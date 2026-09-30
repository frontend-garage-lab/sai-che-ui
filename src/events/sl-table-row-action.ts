import type SlMenuItem from '../components/menu-item/menu-item.js';
import type SlTableRow from '../components/table-row/table-row.js';

export type SlTableRowActionEvent = CustomEvent<{ row: SlTableRow; item: SlMenuItem }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-table-row-action': SlTableRowActionEvent;
  }
}
