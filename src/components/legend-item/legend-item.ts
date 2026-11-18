import SlLegendItem from './legend-item.component.js';

export * from './legend-item.component.js';
export default SlLegendItem;

SlLegendItem.define('sl-legend-item');

declare global {
  interface HTMLElementTagNameMap {
    'sl-legend-item': SlLegendItem;
  }
}
