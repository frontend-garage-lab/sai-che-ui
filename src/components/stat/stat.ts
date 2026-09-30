import SlStat from './stat.component.js';

export * from './stat.component.js';
export default SlStat;

SlStat.define('sl-stat');

declare global {
  interface HTMLElementTagNameMap {
    'sl-stat': SlStat;
  }
}
