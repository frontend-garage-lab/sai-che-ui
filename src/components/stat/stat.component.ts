import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { LocalizeController } from '../../utilities/localize.js';
import { property, state } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './stat.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Stats show a count with a label as an icon-first KPI card, e.g. how many documents are in each status.
 *  Inside a [stat group](/components/stat-group) they also act as filters.
 * @documentation https://shoelace.style/components/stat
 * @status experimental
 * @since 2.20
 *
 * @slot - The stat's label.
 * @slot prefix - An icon shown in the tinted badge, e.g. `<sl-icon>`.
 *
 * @csspart base - The component's base wrapper. A `<button>` inside a stat group, otherwise a `<div>`.
 * @csspart icon - The tinted circular badge that hosts the prefix icon.
 * @csspart content - The container that wraps the count and the label.
 * @csspart count - The formatted count.
 * @csspart label - The label.
 */
export default class SlStat extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private readonly localize = new LocalizeController(this);

  /** The value the stat group reports when this stat is selected. */
  @property({ reflect: true }) value = '';

  /** The number to show. It's formatted for the current locale. */
  @property({ type: Number }) count = 0;

  /**
   * Adds a coloured dot before the label, matching `<sl-status>`. Use the same variant as the status the stat counts,
   * so "Distributed" is green both here and in the table.
   */
  @property({ reflect: true }) variant: 'primary' | 'accent' | 'success' | 'neutral' | 'warning' | 'danger' | '' = '';

  /** Draws the stat in a selected state. The stat group keeps this in sync with its value. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Disables the stat inside a stat group. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether the stat sits in a stat group and can be selected. The stat group keeps this in sync. */
  @state() interactive = false;

  render() {
    const content = html`
      <span part="icon" class="stat__icon"><slot name="prefix"></slot></span>
      <span part="content" class="stat__content">
        <span part="count" class="stat__count">${this.localize.number(this.count)}</span>
        <span part="label" class="stat__label"><slot></slot></span>
      </span>
    `;

    const classes = classMap({
      stat: true,
      'stat--interactive': this.interactive,
      'stat--selected': this.selected,
      'stat--disabled': this.disabled,
      [`stat--${this.variant}`]: !!this.variant
    });

    return this.interactive
      ? html`
          <button
            part="base"
            type="button"
            class=${classes}
            aria-pressed=${this.selected ? 'true' : 'false'}
            ?disabled=${this.disabled}
          >
            ${content}
          </button>
        `
      : html`<div part="base" class=${classes}>${content}</div>`;
  }
}
