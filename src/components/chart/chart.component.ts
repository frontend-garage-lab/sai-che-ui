import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  Tooltip
} from 'chart.js';
import { html } from 'lit';
import { merge } from 'chart.js/helpers';
import { property, query } from 'lit/decorators.js';
import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './chart.styles.js';
import type { ChartConfiguration, ChartData, ChartDataset, ChartOptions, ChartType, ScriptableContext } from 'chart.js';
import type { CSSResultGroup } from 'lit';

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  Tooltip
);

export type SlChartType =
  | 'bar'
  | 'horizontal-bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'doughnut'
  | 'radar'
  | 'polar-area'
  | 'scatter'
  | 'bubble';

export type SlChartLegend = 'top' | 'bottom' | 'left' | 'right' | 'none';

/** Chart types where every data point (not every dataset) gets its own color. */
const PER_POINT_TYPES: SlChartType[] = ['pie', 'doughnut', 'polar-area'];
const RADIAL_TYPES: SlChartType[] = ['pie', 'doughnut', 'polar-area', 'radar'];
const SERIES_COUNT = 8;

interface ThemeTokens {
  series: string[];
  grid: string;
  axis: string;
  surface: string;
  tooltipBackground: string;
  tooltipColor: string;
  fontFamily: string;
  fontSize: number;
  radius: number;
  titleWeight: number;
}

/** Converts a px or rem length token to pixels. */
function toPixels(value: string) {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return 0;
  return value.endsWith('rem') ? n * parseFloat(getComputedStyle(document.documentElement).fontSize) : n;
}

let colorContext: CanvasRenderingContext2D | null = null;

/** Normalizes any CSS color to hex (the canvas understands it) and optionally applies an alpha. */
function toHex(color: string, alpha = 1) {
  colorContext ??= document.createElement('canvas').getContext('2d');
  if (!colorContext) return color;
  colorContext.fillStyle = '#000';
  colorContext.fillStyle = color;
  const hex = String(colorContext.fillStyle);
  if (alpha >= 1 || !hex.startsWith('#') || hex.length !== 7) return hex;
  return `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`;
}

/**
 * @summary Charts visualize data as bars, lines, areas, pies, doughnuts, radars, polar areas, scatter and bubble
 *  plots. Rendered with [Chart.js](https://www.chartjs.org/) and styled with the design tokens.
 * @documentation https://shoelace.style/components/chart
 * @status experimental
 * @since 2.21
 *
 * @slot - Accessible fallback for assistive technologies, e.g. a `<table>` with the same data. Visually hidden.
 *
 * @csspart base - The component's base wrapper.
 * @csspart canvas - The canvas the chart is drawn on.
 *
 * @cssproperty --sl-color-chart-1 - Color of the 1st series (up to `--sl-color-chart-8`).
 * @cssproperty --sl-chart-grid-color - Color of grid lines.
 * @cssproperty --sl-chart-axis-color - Color of ticks and legend labels.
 */
export default class SlChart extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  @query('canvas') canvas: HTMLCanvasElement;

  /** The Chart.js instance. Use it for advanced APIs (e.g. `toBase64Image()`); call `refresh()` after mutating it. */
  chart?: Chart;

  private themeObserver?: MutationObserver;

  /** The kind of chart to draw. */
  @property({ reflect: true }) type: SlChartType = 'bar';

  /** Chart.js data: `{ labels, datasets }`. Colors not set on the datasets are taken from the design tokens. */
  @property({ attribute: false }) data: ChartData = { labels: [], datasets: [] };

  /** Chart.js options, merged over the design-system defaults. */
  @property({ attribute: false }) options: ChartOptions = {};

  /** Stacks the datasets (bar, horizontal-bar, line and area charts). */
  @property({ type: Boolean, reflect: true }) stacked = false;

  /** Where the legend is placed, or `none` to hide it. */
  @property() legend: SlChartLegend = 'bottom';

  /** Accessible label announced by assistive technologies. */
  @property() label = '';

  connectedCallback() {
    super.connectedCallback();
    // Light/dark switches change the tokens without resizing anything, so the chart must be redrawn by hand
    this.themeObserver = new MutationObserver(() => this.refresh());
    [document.documentElement, document.body].forEach(el =>
      this.themeObserver!.observe(el, { attributes: true, attributeFilter: ['class'] })
    );
    if (this.hasUpdated) this.createChart();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.themeObserver?.disconnect();
    this.chart?.destroy();
    this.chart = undefined;
  }

  firstUpdated() {
    this.createChart();
  }

  @watch(['type', 'data', 'options', 'stacked', 'legend'], { waitUntilFirstUpdate: true })
  handleConfigChange() {
    // Changing the base Chart.js type requires a new instance; everything else is an in-place update
    if (this.chart && (this.chart.config as { type?: string }).type !== this.chartJsType()) {
      this.createChart();
    } else {
      this.refresh();
    }
  }

  /** Re-applies data, options and theme tokens to the current chart. */
  refresh() {
    if (!this.chart) return;
    const config = this.buildConfig();
    this.chart.data = config.data;
    this.chart.options = config.options!;
    this.chart.update();
  }

  private createChart() {
    if (!this.canvas) return;
    this.chart?.destroy();
    this.chart = new Chart(this.canvas, this.buildConfig());
  }

  private chartJsType(): ChartType {
    switch (this.type) {
      case 'horizontal-bar':
        return 'bar';
      case 'area':
        return 'line';
      case 'polar-area':
        return 'polarArea';
      default:
        return this.type;
    }
  }

  private readTokens(): ThemeTokens {
    const style = getComputedStyle(this);
    const token = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
    return {
      series: Array.from({ length: SERIES_COUNT }, (_, i) => token(`--sl-color-chart-${i + 1}`, '#888')),
      grid: token('--sl-chart-grid-color', '#e5e5e5'),
      axis: token('--sl-chart-axis-color', '#555'),
      surface: token('--sl-color-neutral-0', '#fff'),
      tooltipBackground: token('--sl-chart-tooltip-background', '#333'),
      tooltipColor: token('--sl-chart-tooltip-color', '#fff'),
      fontFamily: token('--sl-font-sans', 'sans-serif'),
      fontSize: parseFloat(style.fontSize) * 0.75 || 12,
      radius: toPixels(token('--sl-border-radius-small', '3px')),
      // Same weight as the Label/Small text style
      titleWeight: parseInt(token('--sl-font-weight-semibold', '500'), 10)
    };
  }

  private themedDatasets(tokens: ThemeTokens): ChartDataset[] {
    const perPoint = PER_POINT_TYPES.includes(this.type);
    const isLine = this.type === 'line' || this.type === 'area' || this.type === 'radar';
    const fillArea = this.type === 'area' || this.type === 'radar';
    const pointCount = this.data.labels?.length ?? 0;

    return (this.data.datasets ?? []).map((dataset, i) => {
      const color = toHex(tokens.series[i % SERIES_COUNT]);
      const ds = { ...dataset } as ChartDataset & Record<string, unknown>;

      if (perPoint) {
        const colors = Array.from({ length: Math.max(pointCount, dataset.data.length) }, (_, j) =>
          toHex(tokens.series[j % SERIES_COUNT], this.type === 'polar-area' ? 0.7 : 1)
        );
        ds.backgroundColor ??= colors;
        ds.borderColor ??= toHex(tokens.surface);
        ds.borderWidth ??= 2;
        ds.hoverOffset ??= 4;
      } else if (isLine) {
        ds.borderColor ??= color;
        ds.backgroundColor ??= toHex(color, fillArea ? 0.2 : 1);
        ds.pointBackgroundColor ??= color;
        ds.borderWidth ??= 2;
        // Straight segments: curves can suggest values that are not in the data
        ds.tension ??= 0;
        if (fillArea) ds.fill ??= this.stacked && i > 0 ? '-1' : 'origin';
      } else {
        ds.backgroundColor ??= this.type === 'bubble' ? toHex(color, 0.6) : color;
        ds.borderColor ??= color;
        if (this.type === 'bar' || this.type === 'horizontal-bar') {
          // Stacked: only the outer segment of each bar is rounded, inner joins stay square
          ds.borderRadius ??= this.stacked
            ? (ctx: ScriptableContext<'bar'>) => (this.isOuterSegment(ctx) ? tokens.radius : 0)
            : tokens.radius;
          ds.maxBarThickness ??= 48;
        }
      }
      return ds;
    });
  }

  /** True when the bar segment is the last visible, non-empty dataset of its stack. */
  private isOuterSegment(ctx: ScriptableContext<'bar'>) {
    const { chart, dataIndex, datasetIndex } = ctx;
    for (let i = chart.data.datasets.length - 1; i > datasetIndex; i--) {
      if (chart.isDatasetVisible(i) && Number(chart.data.datasets[i].data[dataIndex] ?? 0) !== 0) return false;
    }
    return true;
  }

  private buildConfig(): ChartConfiguration {
    const tokens = this.readTokens();
    const radial = RADIAL_TYPES.includes(this.type);
    const font = { family: tokens.fontFamily, size: tokens.fontSize };
    const axis = {
      stacked: this.stacked,
      beginAtZero: true,
      grid: { color: tokens.grid },
      border: { color: tokens.grid },
      ticks: { color: tokens.axis, font }
    };

    const defaults: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      color: tokens.axis,
      font,
      indexAxis: this.type === 'horizontal-bar' ? 'y' : 'x',
      plugins: {
        legend: {
          display: this.legend !== 'none',
          position: this.legend === 'none' ? 'bottom' : this.legend,
          labels: {
            color: tokens.axis,
            font,
            usePointStyle: true,
            pointStyle: 'circle',
            // Chart.js draws the point style with radius boxHeight × √2 / 2: these values give an 8px circle
            boxWidth: 8,
            boxHeight: 8 / Math.SQRT2,
            pointStyleWidth: 8,
            // Solid swatches without outline, whatever the fill opacity or border width of the series
            generateLabels: (chart: Chart) =>
              // Pie, doughnut and polar area list the labels, not the datasets: use the generator of the chart type
              (
                Chart.overrides[this.chartJsType()]?.plugins?.legend?.labels?.generateLabels ??
                Chart.defaults.plugins.legend.labels.generateLabels
              )(chart).map(item => ({
                ...item,
                lineWidth: 0,
                fillStyle: PER_POINT_TYPES.includes(this.type)
                  ? toHex(tokens.series[(item.index ?? 0) % SERIES_COUNT])
                  : toHex(String(chart.data.datasets[item.datasetIndex ?? 0]?.borderColor ?? item.fillStyle))
              }))
          }
        },
        tooltip: {
          backgroundColor: toHex(tokens.tooltipBackground),
          titleColor: toHex(tokens.tooltipColor),
          bodyColor: toHex(tokens.tooltipColor),
          titleFont: { ...font, weight: tokens.titleWeight },
          bodyFont: font,
          cornerRadius: tokens.radius,
          padding: 8,
          boxPadding: 4,
          usePointStyle: true
        }
      }
    } as ChartOptions;

    if (this.type === 'radar' || this.type === 'polar-area') {
      (defaults as Record<string, unknown>).scales = {
        r: {
          grid: { color: tokens.grid },
          angleLines: { color: tokens.grid },
          pointLabels: { color: tokens.axis, font },
          beginAtZero: true,
          // The rings already show the scale: tick labels would sit on top of the data
          ticks: { display: false }
        }
      };
    } else if (!radial) {
      (defaults as Record<string, unknown>).scales = {
        // Bars: only the value axis has grid lines
        x: { ...axis, grid: { ...axis.grid, display: this.type !== 'bar' } },
        y: { ...axis, grid: { ...axis.grid, display: this.type !== 'horizontal-bar' } }
      };
    }
    if (this.type === 'doughnut') (defaults as Record<string, unknown>).cutout = '65%';

    const options = merge(defaults, this.options ?? {}) as ChartOptions;

    return {
      type: this.chartJsType(),
      data: { ...this.data, datasets: this.themedDatasets(tokens) },
      options
    } as ChartConfiguration;
  }

  render() {
    return html`
      <div part="base" class="chart">
        <canvas part="canvas" role="img" aria-label=${this.label || this.type}></canvas>
        <div class="chart__fallback"><slot></slot></div>
      </div>
    `;
  }
}
