export type SlStepChangeEvent = CustomEvent<{
  /** The zero-based index of the new current step. */
  index: number;
  /** The zero-based index of the step that was current before the change. */
  previousIndex: number;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-step-change': SlStepChangeEvent;
  }
}
