import SlEmptyState from './empty-state.component.js';

export * from './empty-state.component.js';
export default SlEmptyState;

SlEmptyState.define('sl-empty-state');

declare global {
  interface HTMLElementTagNameMap {
    'sl-empty-state': SlEmptyState;
  }
}
