import SlStatGroup from './stat-group.component.js';

export * from './stat-group.component.js';
export default SlStatGroup;

SlStatGroup.define('sl-stat-group');

declare global {
  interface HTMLElementTagNameMap {
    'sl-stat-group': SlStatGroup;
  }
}
