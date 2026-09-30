import SlTableCell from './table-cell.component.js';

export * from './table-cell.component.js';
export default SlTableCell;

SlTableCell.define('sl-table-cell');

declare global {
  interface HTMLElementTagNameMap {
    'sl-table-cell': SlTableCell;
  }
}
