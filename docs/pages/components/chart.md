---
meta:
  title: Chart
  description: Charts visualize data as bars, lines, areas, pies, doughnuts, radars, polar areas, scatter and bubble plots.
layout: component
---

Charts are drawn with [Chart.js](https://www.chartjs.org/) on a canvas. Colors, fonts, grid and tooltip come from the design tokens (`--sl-color-chart-1` … `--sl-color-chart-8`, `--sl-chart-grid-color`, `--sl-chart-axis-color`) and follow the light/dark theme. Set `data` (and optionally `options`) as JavaScript properties, using the [Chart.js data structure](https://www.chartjs.org/docs/4.6.2/general/data-structures.html).

```html:preview
<sl-chart id="chart-overview" type="bar" label="Planned vs actual hours"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-overview').data = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Planned', data: [12, 19, 14, 22, 18, 25] }, { label: 'Actual', data: [10, 17, 16, 20, 21, 23] }] };
  });
</script>
```

## Examples

### Bar

Use `type="bar"` to compare values across categories.

```html:preview
<sl-chart id="chart-bar" type="bar" label="Bar"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-bar').data = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Planned', data: [12, 19, 14, 22, 18, 25] }, { label: 'Actual', data: [10, 17, 16, 20, 21, 23] }] };
  });
</script>
```

### Stacked bar

Add `stacked` to stack the datasets.

```html:preview
<sl-chart id="chart-stacked" type="bar" stacked label="Stacked bar"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-stacked').data = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Planned', data: [12, 19, 14, 22, 18, 25] }, { label: 'Actual', data: [10, 17, 16, 20, 21, 23] }] };
  });
</script>
```

### Horizontal bar

Use `type="horizontal-bar"` for long category labels or rankings.

```html:preview
<sl-chart id="chart-hbar" type="horizontal-bar" label="Horizontal bar"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-hbar').data = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Planned', data: [12, 19, 14, 22, 18, 25] }, { label: 'Actual', data: [10, 17, 16, 20, 21, 23] }] };
  });
</script>
```

### Line

Use `type="line"` to show a trend over time.

```html:preview
<sl-chart id="chart-line" type="line" label="Line"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-line').data = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Planned', data: [12, 19, 14, 22, 18, 25] }, { label: 'Actual', data: [10, 17, 16, 20, 21, 23] }] };
  });
</script>
```

### Area

Use `type="area"` for a line with a filled area. Combine it with `stacked` for cumulative values.

```html:preview
<sl-chart id="chart-area" type="area" label="Area"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-area').data = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Planned', data: [12, 19, 14, 22, 18, 25] }, { label: 'Actual', data: [10, 17, 16, 20, 21, 23] }] };
  });
</script>
```

### Doughnut

Use `type="doughnut"` to show parts of a whole. Every data point gets a series color.

```html:preview
<sl-chart id="chart-doughnut" type="doughnut" legend="right" label="Doughnut"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-doughnut').data = { labels: ['Engineering', 'Procurement', 'Construction', 'Commissioning'], datasets: [{ label: 'Hours', data: [42, 18, 30, 10] }] };
  });
</script>
```

### Pie

Use `type="pie"` for parts of a whole with few categories.

```html:preview
<sl-chart id="chart-pie" type="pie" legend="right" label="Pie"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-pie').data = { labels: ['Engineering', 'Procurement', 'Construction', 'Commissioning'], datasets: [{ label: 'Hours', data: [42, 18, 30, 10] }] };
  });
</script>
```

### Polar area

Use `type="polar-area"` to compare parts of a whole by radius.

```html:preview
<sl-chart id="chart-polar" type="polar-area" legend="right" label="Polar area"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-polar').data = { labels: ['Engineering', 'Procurement', 'Construction', 'Commissioning'], datasets: [{ label: 'Hours', data: [42, 18, 30, 10] }] };
  });
</script>
```

### Radar

Use `type="radar"` to compare several variables at once.

```html:preview
<sl-chart id="chart-radar" type="radar" label="Radar"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-radar').data = { labels: ['Cost', 'Schedule', 'Quality', 'Safety', 'Scope'], datasets: [{ label: 'Project A', data: [4, 3, 5, 4, 2] }, { label: 'Project B', data: [3, 5, 3, 4, 4] }] };
  });
</script>
```

### Scatter

Use `type="scatter"` to show the relationship between two numeric values.

```html:preview
<sl-chart id="chart-scatter" type="scatter" label="Scatter"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-scatter').data = { datasets: [{ label: 'Samples', data: [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 4 }, { x: 4, y: 7 }, { x: 5, y: 6 }, { x: 6, y: 9 }] }] };
  });
</script>
```

### Bubble

Use `type="bubble"` to add a third value, the radius `r`.

```html:preview
<sl-chart id="chart-bubble" type="bubble" label="Bubble"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-bubble').data = { datasets: [{ label: 'Projects', data: [{ x: 10, y: 20, r: 8 }, { x: 25, y: 12, r: 14 }, { x: 40, y: 30, r: 6 }, { x: 55, y: 18, r: 11 }] }] };
  });
</script>
```

### Legend

Set `legend` to `top`, `bottom` (default), `left`, `right` or `none`.

### Size

The chart fills its container. Its height is `20rem` by default; change it with CSS on the host.

```html:preview
<sl-chart id="chart-size" type="line" legend="none" style="height: 10rem;" label="Trend"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    document.querySelector('#chart-size').data = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Progress', data: [5, 12, 20, 34, 52, 70] }] };
  });
</script>
```

### Custom options

`options` are merged over the design-system defaults. Properties set on a dataset (colors included) win over the defaults.

```html:preview
<sl-chart id="chart-options" type="bar" legend="none" label="Progress in percent"></sl-chart>

<script>
  customElements.whenDefined('sl-chart').then(() => {
    const chart = document.querySelector('#chart-options');
    chart.options = { scales: { y: { max: 100, ticks: { callback: value => value + '%' } } } };
    chart.data = {
      labels: ['Design', 'Build', 'Test'],
      datasets: [{ label: 'Progress', data: [90, 60, 25], borderRadius: 0 }]
    };
  });
</script>
```

### Accessibility

Always set `label`. Put a table with the same data in the default slot: it is visually hidden but read by screen readers.

```html
<sl-chart type="doughnut" label="Hours by discipline">
  <table>
    <tr>
      <th>Engineering</th>
      <td>42</td>
    </tr>
    <tr>
      <th>Procurement</th>
      <td>18</td>
    </tr>
  </table>
</sl-chart>
```
