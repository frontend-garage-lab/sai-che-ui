export type SlTableSelectionChangeEvent = CustomEvent<{ selection: unknown[] }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-table-selection-change': SlTableSelectionChangeEvent;
  }
}
