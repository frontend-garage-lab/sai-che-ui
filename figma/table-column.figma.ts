// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=871-2690
// source=src/components/table/table.component.ts
// component=SlTable
import figma from 'figma';
const instance = figma.selectedInstance;

// A Table Column is one entry of `<sl-table>`'s `columns`, not an element, so this surfaces the entry it stands for.
const kind = instance.getEnum('Kind', { data: 'data', selection: 'selection', actions: 'actions' });
const label = instance.getString('Label');
const sort = instance.getEnum('Sort', { off: 'off', none: 'none', asc: 'asc', desc: 'desc' });
const align = instance.getEnum('Align', { start: 'start', center: 'center', end: 'end' });
const id = label
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const entry =
  kind === 'selection'
    ? `// Select-all column: set selection="multiple" on <sl-table>, no column entry is needed`
    : kind === 'actions'
      ? `{ id: 'actions', meta: { actions: true }, cell: ({ row }) => html\`<sl-menu>…</sl-menu>\` }`
      : `{ id: '${id}', accessorKey: '${id}', header: '${label}'${sort !== 'off' ? ', enableSorting: true' : ''}${align !== 'start' ? `, meta: { align: '${align}' }` : ''} }`;

export default {
  example: figma.html`<!-- columns entry: ${entry} -->`,
  imports: ["import 'src/components/table/table.js'"],
  id: 'table-column',
  metadata: { nestable: true }
};
