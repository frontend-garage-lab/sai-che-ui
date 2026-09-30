import type SlTableRow from '../components/table-row/table-row.js';

export type SlTableSelectionChangeEvent = CustomEvent<{ selection: SlTableRow[] }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-table-selection-change': SlTableSelectionChangeEvent;
  }
}
