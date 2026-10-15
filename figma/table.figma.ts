// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=858-370
// source=src/components/table/table.component.ts
// component=SlTable
import figma from 'figma';
const instance = figma.selectedInstance;

// Regions: the Toolbar slot is the `toolbar` slot of <sl-table>, the footer is the built-in pagination.
const showToolbar = instance.getBoolean('Show Toolbar');
const showPagination = instance.getBoolean('Show Pagination');
const toolbar = showToolbar ? instance.getSlot('Toolbar') : '';
// `Show Empty` swaps the rows for the Empty slot, which is the table's `empty` slot.
const showEmpty = instance.getBoolean('Show Empty');
const empty = showEmpty ? instance.getSlot('Empty') : '';

// `selection` and `striped` live on the header row / rows nested in the Rows slot, `page-size` on the pagination.
const header = instance.findInstance('Table Header Row');
// `multiple` shows the select-all checkbox in the header row; `single` has no checkbox, so it is its own switch.
const singleSelection = instance.getBoolean('Single Selection');
const multiple = header.type === 'INSTANCE' && header.getBoolean('Selection');
const selection = multiple ? ' selection="multiple"' : singleSelection ? ' selection="single"' : '';
const firstRow = instance.findInstance('Table Row');
const striped = firstRow.type === 'INSTANCE' && firstRow.getBoolean('Striped') ? ' striped' : '';
const pagination = showPagination ? instance.findInstance('Pagination') : undefined;
const pageSize =
  pagination && pagination.type === 'INSTANCE'
    ? pagination.getEnum('Page size', { '10': '10', '25': '25', '50': '50', '100': '100' })
    : '';
const paginate = pageSize ? ` paginate page-size="${pageSize}"` : '';

export default {
  example: figma.html`<sl-table${selection}${striped}${paginate} sticky-header>
  ${toolbar ? figma.html`<div slot="toolbar">${toolbar}</div>` : ''}
  ${empty ? figma.html`<div slot="empty">${empty}</div>` : ''}
  <!-- set \`columns\` and \`data\` from the Table Header Row and Table Row mappings -->
</sl-table>`,
  imports: ["import 'src/components/table/table.js'"],
  id: 'table',
  metadata: { nestable: false }
};
