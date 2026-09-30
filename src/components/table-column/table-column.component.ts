import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlIcon from '../icon/icon.component.js';
import styles from './table-column.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Table columns define the header and the layout of a single column in a [table](/components/table).
 * @documentation https://shoelace.style/components/table-column
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-icon
 *
 * @slot - The column's label.
 *
 * @csspart base - The component's base wrapper, an interactive button when the column is sortable.
 * @csspart label - The container that wraps the column's label.
 * @csspart sort-icon - The icon that indicates the current sort direction.
 */
export default class SlTableColumn extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = { 'sl-icon': SlIcon };

  /**
   * A unique key that identifies the column. The table reports it when sorting and it's how you address a column with
   * the table's `sortColumn` property.
   */
  @property({ reflect: true }) key = '';

  /** Draws the column as sortable. Clicking the header cycles between ascending and descending order. */
  @property({ type: Boolean, reflect: true }) sortable = false;

  /**
   * The width of the column as a CSS grid track, e.g. `1fr`, `auto`, `minmax(8rem, 1fr)` or `12rem`. Widths from every
   * column make up the table's grid template.
   */
  @property({ reflect: true }) width = '1fr';

  /** The column's horizontal alignment. Cells in this column inherit it unless they set their own. */
  @property({ reflect: true }) align: 'start' | 'center' | 'end' = 'start';

  /** The column's current sort direction. The table sets this — set `sortColumn` on the table instead. */
  @property({ attribute: 'sort-direction', reflect: true }) sortDirection: 'asc' | 'desc' | 'none' = 'none';

  /** Returns true if the given element is a table column. */
  static isTableColumn(el: Element | null): el is SlTableColumn {
    return el instanceof Element && el.getAttribute('role') === 'columnheader';
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'columnheader');
  }

  updated() {
    if (this.sortable) {
      this.setAttribute('aria-sort', this.sortDirection === 'none' ? 'none' : `${this.sortDirection}ending`);
    } else {
      this.removeAttribute('aria-sort');
    }
  }

  render() {
    const isSorted = this.sortable && this.sortDirection !== 'none';
    const label = html`<span part="label" class="column__label"><slot></slot></span>`;

    if (!this.sortable) {
      return html`<div part="base" class="column">${label}</div>`;
    }

    return html`
      <button part="base" class="column column--sortable" type="button">
        ${label}
        <sl-icon
          part="sort-icon"
          class=${classMap({
            'column__sort-icon': true,
            'column__sort-icon--ascending': this.sortDirection === 'asc',
            'column__sort-icon--placeholder': !isSorted
          })}
          library="system"
          name="chevron-down"
        ></sl-icon>
      </button>
    `;
  }
}
