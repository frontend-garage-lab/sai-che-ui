export type SlFileRejectReason = 'type' | 'size' | 'count';

export type SlFileRejectEvent = CustomEvent<{
  /** The files that were turned away, each with the rule it broke. */
  rejections: { file: File; reason: SlFileRejectReason }[];
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-file-reject': SlFileRejectEvent;
  }
}
