import SlTableRow from './table-row.component.js';

export * from './table-row.component.js';
export default SlTableRow;

SlTableRow.define('sl-table-row');

declare global {
  interface HTMLElementTagNameMap {
    'sl-table-row': SlTableRow;
  }
}
