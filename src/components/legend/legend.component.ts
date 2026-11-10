import { classMap } from 'lit/directives/class-map.js';
import { HasSlotController } from '../../internal/slot.js';
import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './legend.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Legends explain what the terms, symbols or colours of a view mean, e.g. "Open = draft, in progress or
 * rejected" next to a section title, or the badges of a list in a dialog.
 * @documentation https://shoelace.style/components/legend
 * @status experimental
 * @since 2.21
 *
 * @slot - One or more `<sl-legend-item>` elements.
 * @slot label - The legend's title. Alternatively, you can use the `label` attribute.
 * @slot icon - An icon shown before the legend, e.g. `<sl-icon name="info-circle">`, to mark it as a note.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container of the icon.
 * @csspart label - The legend's title.
 * @csspart items - The container of the items.
 */
export default class SlLegend extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private readonly hasSlotController = new HasSlotController(this, 'icon', 'label');

  /** The legend's title, e.g. the name of the group of symbols it explains. Optional. */
  @property() label = '';

  /** `inline` puts the items in a row that wraps, `list` puts one item per row (dialogs, panels). */
  @property({ reflect: true }) layout: 'inline' | 'list' = 'inline';

  /** Number of columns of a `list` legend. Ignored when `layout` is `inline`. */
  @property({ type: Number }) columns = 1;

  render() {
    const hasIcon = this.hasSlotController.test('icon');
    const hasLabel = Boolean(this.label) || this.hasSlotController.test('label');

    return html`
      <div
        part="base"
        class=${classMap({
          legend: true,
          'legend--inline': this.layout === 'inline',
          'legend--list': this.layout === 'list'
        })}
      >
        ${hasIcon || hasLabel
          ? html`<span class="legend__head">
              ${hasIcon ? html`<span part="icon" class="legend__icon"><slot name="icon"></slot></span>` : nothing}
              ${hasLabel
                ? html`<span part="label" class="legend__label"><slot name="label">${this.label}</slot></span>`
                : nothing}
            </span>`
          : nothing}
        <div part="items" class="legend__items" role="list" style=${styleMap({ '--columns': this.columns })}>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-legend': SlLegend;
  }
}
