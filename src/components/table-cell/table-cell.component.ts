import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './table-cell.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Table cells hold the content of a single column within a [table row](/components/table-row).
 * @documentation https://shoelace.style/components/table-cell
 * @status experimental
 * @since 2.20
 *
 * @slot - The cell's content.
 *
 * @csspart base - The component's base wrapper.
 */
export default class SlTableCell extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  /** The cell's horizontal alignment. When omitted, the alignment of the matching column is used. */
  @property({ reflect: true }) align: 'start' | 'center' | 'end';

  /**
   * The value the table uses when sorting on this cell's column. When omitted, the cell's text content is used. Set this
   * when the displayed text isn't sortable on its own, e.g. a status icon or a localized date.
   */
  @property({ attribute: 'sort-value', reflect: true }) sortValue: string;

  /** Truncates the cell's content with an ellipsis instead of wrapping it. */
  @property({ type: Boolean, reflect: true }) nowrap = false;

  /** Returns true if the given element is a table cell. */
  static isTableCell(el: Element | null): el is SlTableCell {
    return el instanceof Element && el.getAttribute('role') === 'gridcell';
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'gridcell');
  }

  /** Gets the value used to sort this cell, falling back to its text content. */
  getSortValue() {
    return this.sortValue ?? this.textContent?.trim() ?? '';
  }

  render() {
    return html`<div part="base" class="cell"><slot></slot></div>`;
  }
}
