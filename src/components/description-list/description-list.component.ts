import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './description-list.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Description lists show a grid of label/value pairs, e.g. a document's properties.
 * @documentation https://shoelace.style/components/description-list
 * @status experimental
 * @since 2.20
 *
 * @slot - One or more `<sl-description-list-item>` elements.
 *
 * @csspart base - The component's base wrapper.
 */
export default class SlDescriptionList extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  /** The number of columns to arrange items into. Items wrap onto a new row after this many. */
  @property({ type: Number }) cols = 2;

  render() {
    return html`
      <div part="base" class="description-list" style=${styleMap({ '--cols': this.cols })}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-description-list': SlDescriptionList;
  }
}
