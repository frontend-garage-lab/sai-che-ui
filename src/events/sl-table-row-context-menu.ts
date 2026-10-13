export type SlTableRowContextMenuEvent = CustomEvent<{
  row: unknown;
  originalEvent: MouseEvent;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-table-row-context-menu': SlTableRowContextMenuEvent;
  }
}
