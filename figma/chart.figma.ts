// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1779-454
// source=src/components/chart/chart.component.ts
// component=SlChart
import figma from 'figma';
const instance = figma.selectedInstance;

const type = instance.getEnum('Type', {
  bar: 'bar',
  'horizontal-bar': 'horizontal-bar',
  line: 'line',
  area: 'area',
  pie: 'pie',
  doughnut: 'doughnut',
  radar: 'radar',
  'polar-area': 'polar-area',
  scatter: 'scatter',
  bubble: 'bubble'
});
const stacked = instance.getEnum('Stacked', { false: false, true: true });
const showLegend = instance.getBoolean('Show Legend');

// The Figma master draws sample data: in code, data (and options) are JavaScript properties.
export default {
  example: figma.html`<sl-chart type="${type}"${stacked ? ' stacked' : ''}${showLegend ? '' : ' legend="none"'} label="Chart"></sl-chart>
<script>
  document.querySelector('sl-chart').data = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{ label: 'Series 1', data: [12, 19, 14] }]
  };
</script>`,
  imports: ["import 'src/components/chart/chart.js'"],
  id: 'chart',
  metadata: { nestable: true }
};
