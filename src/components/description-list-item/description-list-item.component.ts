import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './description-list-item.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary A single label/value pair inside an [sl-description-list](/components/description-list).
 * @documentation https://shoelace.style/components/description-list-item
 * @status experimental
 * @since 2.20
 *
 * @slot - The item's value. Can be plain text or richer content, e.g. an `<sl-tag>`.
 * @slot label - The item's label. Alternatively, you can use the `label` attribute.
 *
 * @csspart base - The component's base wrapper.
 * @csspart label - The container that wraps the label slot.
 * @csspart value - The container that wraps the value.
 */
export default class SlDescriptionListItem extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  /** The item's label. If you need to display HTML, use the `label` slot instead. */
  @property() label = '';

  render() {
    return html`
      <div part="base" class="description-list-item">
        <span part="label" class="description-list-item__label"><slot name="label">${this.label}</slot></span>
        <span part="value" class="description-list-item__value"><slot></slot></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-description-list-item': SlDescriptionListItem;
  }
}
