import type SlMenuItem from '../components/menu-item/menu-item.js';

export type SlTableRowActionEvent = CustomEvent<{ row: unknown; item: SlMenuItem }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-table-row-action': SlTableRowActionEvent;
  }
}
