import SlTable from './table.component.js';

export * from './table.component.js';
export default SlTable;

SlTable.define('sl-table');

declare global {
  interface HTMLElementTagNameMap {
    'sl-table': SlTable;
  }
}
