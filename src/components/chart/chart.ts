import SlChart from './chart.component.js';

export * from './chart.component.js';
export default SlChart;

SlChart.define('sl-chart');

declare global {
  interface HTMLElementTagNameMap {
    'sl-chart': SlChart;
  }
}
