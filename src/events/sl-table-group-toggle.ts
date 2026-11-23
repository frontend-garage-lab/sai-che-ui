export type SlTableGroupToggleEvent = CustomEvent<{
  groupId: string;
  value: unknown;
  expanded: boolean;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-table-group-toggle': SlTableGroupToggleEvent;
  }
}
