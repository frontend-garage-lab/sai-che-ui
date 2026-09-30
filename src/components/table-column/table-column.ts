import SlTableColumn from './table-column.component.js';

export * from './table-column.component.js';
export default SlTableColumn;

SlTableColumn.define('sl-table-column');

declare global {
  interface HTMLElementTagNameMap {
    'sl-table-column': SlTableColumn;
  }
}
