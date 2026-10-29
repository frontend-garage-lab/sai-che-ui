// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=858-370
// source=src/components/table/table.component.ts
// component=SlTable
import figma from 'figma';
const instance = figma.selectedInstance;

// Regions: the Toolbar slot is the `toolbar` slot of <sl-table>, the footer is the built-in pagination.
const showToolbar = instance.getBoolean('Show Toolbar');
const showPagination = instance.getBoolean('Show Pagination');
// A Table Toolbar instance already renders its own `<div slot="toolbar">` wrapper, so it is inlined as is: going through
// `getSlot` would only emit a `<Toolbar />` placeholder bound to the slot node, which has no Code Connect to open.
const toolbarInstance = showToolbar ? instance.findInstance('Table Toolbar') : undefined;
const toolbarIsComponent = !!toolbarInstance && toolbarInstance.type === 'INSTANCE';
// Any other Toolbar content (Input, Checkbox, Button… placed directly in the slot) is inlined through its own templates.
const toolbarSlot = showToolbar && !toolbarIsComponent ? instance.getSlot('Toolbar') : undefined;
const toolbarList = toolbarSlot ? toolbarSlot.connectedInstances : [];
const toolbarAt = (index: number) =>
  toolbarList[index] ? figma.html`\n    ${toolbarList[index].executeTemplate().example}` : '';
const toolbarItems = toolbarList.length
  ? figma.html`${toolbarAt(0)}${toolbarAt(1)}${toolbarAt(2)}${toolbarAt(3)}${toolbarAt(4)}${toolbarAt(5)}${toolbarAt(6)}${toolbarAt(7)}\n  `
  : toolbarSlot;
const toolbar = !showToolbar
  ? ''
  : toolbarInstance && toolbarInstance.type === 'INSTANCE'
    ? toolbarInstance.executeTemplate().example
    : toolbarItems;
const showRows = instance.getBoolean('Show Rows');
// `Show Empty` swaps the rows for the Empty slot, which is the table's `empty` slot.
const showEmpty = instance.getBoolean('Show Empty');
const emptySlot = showEmpty ? instance.getSlot('Empty') : undefined;
const emptyList = emptySlot ? emptySlot.connectedInstances : [];
const emptyAt = (index: number) =>
  emptyList[index] ? figma.html`\n    ${emptyList[index].executeTemplate().example}` : '';
const empty = emptyList.length ? figma.html`${emptyAt(0)}${emptyAt(1)}${emptyAt(2)}${emptyAt(3)}\n  ` : emptySlot || '';

// Columns: each Table Column instance nested in the Rows slot is one entry of `columns`. `selection` follows the
// selection column (or the select-all checkbox of the legacy Table Header Row), `sort-column` the column that is sorted.
// They are the connected instances directly in the Rows slot (consumer files rename the layers), with the layer name as fallback.
const rowsSlot = instance.getSlot('Rows');
const rowsColumns = rowsSlot ? rowsSlot.connectedInstances : [];
const columns = rowsColumns.length
  ? rowsColumns
  : instance.findConnectedInstances(node => node.name === 'Table Column');
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
        align: column.getEnum('Align', { start: 'start', center: 'center', end: 'end' }),
        sticky: column.getBoolean('Sticky')
      }
    : { kind: 'data', label: '', sort: 'off', align: 'start', sticky: false }
);
const hasSelectionColumn = described.some(column => column.kind === 'selection');
const sorted = described.find(column => column.kind === 'data' && (column.sort === 'asc' || column.sort === 'desc'));
const sortAttributes = sorted ? ` sort-column="${slugify(sorted.label)}" sort-direction="${sorted.sort}"` : '';
const entries = described
  .filter(column => column.kind !== 'selection')
  .map(column => {
    if (column.kind === 'actions')
      return `  { id: 'actions', meta: { actions: true }, cell: ({ row }) => '' /* row actions */ }`;
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
// `columns`, `data` and `rowVariant` are JS-only properties (`attribute: false`): the snippet declares them and binds
// them with the Lit `.property` syntax instead of setting them through a script.
// Several tables can sit in the same snippet (e.g. a Dialog body), so a table with a custom layer name gets prefixed
// variable names (`availableRecipientsColumns`) instead of colliding on `columns` / `data`.
const camel = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)?/g, (_match: string, char?: string) => (char ? char.toUpperCase() : ''))
    .replace(/^[0-9]+/, '');
const baseName = instance.name === 'Table' ? '' : camel(instance.name);
const columnsVar = baseName ? `${baseName}Columns` : 'columns';
const dataVar = baseName ? `${baseName}Data` : 'data';
const rowVariantVar = baseName ? `${baseName}RowVariant` : 'rowVariant';
const rowVariantCode = markerVariants.length
  ? markerVariants.length === 1
    ? `\nconst ${rowVariantVar} = row => '${markerVariants[0]}';`
    : `\nconst ${rowVariantVar} = row => '<one per record: ${markerVariants.join(' | ')}>';`
  : '';
const rowVariantBinding = markerVariants.length ? ` .rowVariant=\${${rowVariantVar}}` : '';
const columnsCode = entries.length
  ? `const ${columnsVar} = [\n${entries.join(',\n')}\n];`
  : `const ${columnsVar} = []; // set from the Table Column mappings`;
const dataCode = showRows
  ? `const ${dataVar} = []; // one object per record, keyed by each column accessorKey`
  : `const ${dataVar} = []; // no records: the empty slot is shown`;
const properties = `${columnsCode}\n${dataCode}${rowVariantCode}`;

// `striped` lives on the cells (or on the rows of the legacy Table Row), `page-size` is on the pagination.
const header = instance.findInstance('Table Header Row');
const multiple = hasSelectionColumn || (header.type === 'INSTANCE' && header.getBoolean('Selection'));
const selection = multiple ? ' selection="multiple"' : '';
const firstCell = instance.findInstance('Table Cell');
const firstRow = instance.findInstance('Table Row');
const stripedCell = firstCell.type === 'INSTANCE' && firstCell.getBoolean('Striped');
const stripedRow = firstRow.type === 'INSTANCE' && firstRow.getBoolean('Striped');
const striped = stripedCell || stripedRow ? ' striped' : '';
// `size` lives on the cells too: Size=small marks a dense table (e.g. nested in another table's cell).
const small = firstCell.type === 'INSTANCE' && firstCell.getEnum('Size', { medium: false, small: true });
const size = small ? ' size="small"' : '';
const pagination = showPagination ? instance.findInstance('Pagination') : undefined;
const pageSize =
  pagination && pagination.type === 'INSTANCE'
    ? pagination.getEnum('Page size', { '10': '10', '25': '25', '50': '50', '100': '100' })
    : '';
const paginate = pageSize ? ` paginate page-size="${pageSize}"` : '';
// `Sticky` on the actions column: the ⋮ column stays pinned while the rows scroll sideways.
const stickyActions = described.some(column => column.kind === 'actions' && column.sticky) ? ' sticky-actions' : '';

export default {
  example: figma.html`${properties}

<sl-table .columns=\${${columnsVar}} .data=\${${dataVar}}${rowVariantBinding}${size}${selection}${striped}${paginate}${sortAttributes}${stickyActions} sticky-header>${
    toolbar
      ? toolbarIsComponent
        ? figma.html`\n  ${toolbar}`
        : figma.html`\n  <div slot="toolbar">${toolbar}</div>`
      : ''
  }${empty ? figma.html`\n  <div slot="empty">${empty}</div>` : ''}
</sl-table>`,
  // The slots inline other templates, whose own imports are not merged one level down: list the usual toolbar/empty content.
  imports: [
    "import 'src/components/table/table.js'",
    "import 'src/components/button/button.js'",
    "import 'src/components/icon-button/icon-button.js'",
    "import 'src/components/icon/icon.js'",
    "import 'src/components/input/input.js'",
    "import 'src/components/checkbox/checkbox.js'",
    "import 'src/components/divider/divider.js'",
    "import 'src/components/empty-state/empty-state.js'"
  ],
  id: 'table',
  // Nestable so a Table placed in a Dialog/Drawer/Card body is shown inline in that snippet.
  metadata: { nestable: true }
};
