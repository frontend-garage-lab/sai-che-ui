import SlLegend from './legend.component.js';

export * from './legend.component.js';
export default SlLegend;

SlLegend.define('sl-legend');

declare global {
  interface HTMLElementTagNameMap {
    'sl-legend': SlLegend;
  }
}
