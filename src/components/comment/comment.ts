import SlComment from './comment.component.js';

export * from './comment.component.js';
export default SlComment;

SlComment.define('sl-comment');

declare global {
  interface HTMLElementTagNameMap {
    'sl-comment': SlComment;
  }
}
