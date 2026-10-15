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

// Columns: each Table Column instance nested in the Rows slot is one entry of `columns`. `selection` follows the
// selection column (or the select-all checkbox of the legacy Table Header Row), `sort-column` the column that is sorted.
const columns = instance.findConnectedInstances(node => node.name === 'Table Column');
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const described = columns.map(column =>
  column.type === 'INSTANCE'
    ? {
        kind: column.getEnum('Kind', { data: 'data', selection: 'selection', actions: 'actions' }),
        label: column.getString('Label'),
        sort: column.getEnum('Sort', { off: 'off', none: 'none', asc: 'asc', desc: 'desc' }),
        align: column.getEnum('Align', { start: 'start', center: 'center', end: 'end' })
      }
    : { kind: 'data', label: '', sort: 'off', align: 'start' }
);
const hasSelectionColumn = described.some(column => column.kind === 'selection');
const sorted = described.find(column => column.kind === 'data' && (column.sort === 'asc' || column.sort === 'desc'));
const sortAttributes = sorted ? ` sort-column="${slugify(sorted.label)}" sort-direction="${sorted.sort}"` : '';
const entries = described
  .filter(column => column.kind !== 'selection')
  .map(column => {
    if (column.kind === 'actions') return `  { id: 'actions', meta: { actions: true }, cell: ({ row }) => … }`;
    const id = slugify(column.label);
    const sortable = column.sort !== 'off' ? ', enableSorting: true' : '';
    const align = column.align !== 'start' ? `, meta: { align: '${column.align}' }` : '';
    return `  { id: '${id}', accessorKey: '${id}', header: '${column.label}'${sortable}${align} }`;
  });
// A cell with `Marker` on flags its row: the colour is the table's `rowVariant`.
// Rows can carry different colours (e.g. safe, expiring, expired): every distinct `Marker Variant` found is listed.
const markerVariants = [
  ...new Set(
    instance
      .findConnectedInstances(node => node.name === 'Table Cell')
      .flatMap(cell => {
        if (cell.type !== 'INSTANCE' || !cell.getBoolean('Marker')) return [];
        const swap = cell.getInstanceSwap('Marker Variant');
        return [
          swap && swap.type === 'INSTANCE'
            ? swap.getEnum('Variant', {
                primary: 'primary',
                accent: 'accent',
                success: 'success',
                neutral: 'neutral',
                warning: 'warning',
                danger: 'danger'
              })
            : 'primary'
        ];
      })
  )
];
const markerLine = markerVariants.length
  ? markerVariants.length === 1
    ? `\ntable.rowVariant = row => '${markerVariants[0]}';`
    : `\ntable.rowVariant = row => '<one per record: ${markerVariants.join(' | ')}>';`
  : '';
const columnsComment = entries.length
  ? `table.columns = [\n${entries.join(',\n')}\n];${markerLine}`
  : 'set `columns` and `data` from the Table Header Row and Table Row mappings';

// `striped` lives on the cells (or on the rows of the legacy Table Row), `selection="single"` has no checkbox so it is its own switch, `page-size` is on the pagination.
const singleSelection = instance.getBoolean('Single Selection');
const header = instance.findInstance('Table Header Row');
const multiple = hasSelectionColumn || (header.type === 'INSTANCE' && header.getBoolean('Selection'));
const selection = multiple ? ' selection="multiple"' : singleSelection ? ' selection="single"' : '';
const firstCell = instance.findInstance('Table Cell');
const firstRow = instance.findInstance('Table Row');
const stripedCell = firstCell.type === 'INSTANCE' && firstCell.getBoolean('Striped');
const stripedRow = firstRow.type === 'INSTANCE' && firstRow.getBoolean('Striped');
const striped = stripedCell || stripedRow ? ' striped' : '';
const pagination = showPagination ? instance.findInstance('Pagination') : undefined;
const pageSize =
  pagination && pagination.type === 'INSTANCE'
    ? pagination.getEnum('Page size', { '10': '10', '25': '25', '50': '50', '100': '100' })
    : '';
const paginate = pageSize ? ` paginate page-size="${pageSize}"` : '';

export default {
  example: figma.html`<sl-table${selection}${striped}${paginate}${sortAttributes} sticky-header>
  ${toolbar ? figma.html`<div slot="toolbar">${toolbar}</div>` : ''}
  ${empty ? figma.html`<div slot="empty">${empty}</div>` : ''}
  <!-- ${columnsComment} -->
</sl-table>`,
  imports: ["import 'src/components/table/table.js'"],
  id: 'table',
  metadata: { nestable: false }
};
