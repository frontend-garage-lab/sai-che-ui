import { classMap } from 'lit/directives/class-map.js';
import { HasSlotController } from '../../internal/slot.js';
import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './legend-item.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary A single entry of an [sl-legend](/components/legend): a marker or a term, and what it means.
 * @documentation https://shoelace.style/components/legend-item
 * @status experimental
 * @since 2.21
 *
 * @slot - What the marker or the term means.
 * @slot marker - The symbol being explained, e.g. an `<sl-badge>`, an `<sl-status>` or an `<sl-icon>`.
 *
 * @csspart base - The component's base wrapper.
 * @csspart marker - The container of the marker, or the colour swatch.
 * @csspart term - The term, shown in bold and followed by a colon before the description.
 * @csspart description - The container of the description.
 */
export default class SlLegendItem extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private readonly hasSlotController = new HasSlotController(this, 'marker');

  /** The term being explained, shown in bold and followed by a colon, e.g. "Open:". Optional. */
  @property() term = '';

  /** Shows a colour swatch as marker, with the same palette as `sl-status` and `sl-stat`. Ignored with a `marker` slot. */
  @property({ reflect: true }) variant: 'primary' | 'accent' | 'success' | 'neutral' | 'warning' | 'danger' | '' = '';

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
  }

  render() {
    const hasMarker = this.hasSlotController.test('marker');
    const swatch = !hasMarker && this.variant;

    return html`
      <div part="base" class="legend-item">
        <span
          part="marker"
          class=${classMap({
            'legend-item__marker': true,
            'legend-item__marker--hidden': !hasMarker && !swatch
          })}
        >
          <slot name="marker"></slot>
          ${swatch
            ? html`<span class="legend-item__swatch legend-item__swatch--${this.variant}" aria-hidden="true"></span>`
            : nothing}
        </span>
        ${this.term ? html`<span part="term" class="legend-item__term">${this.term}:</span>` : nothing}
        <span part="description" class="legend-item__description"><slot></slot></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-legend-item': SlLegendItem;
  }
}
