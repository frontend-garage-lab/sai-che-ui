// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=53-2
// source=src/components/table/table.component.ts
// component=SlTable
import figma from 'figma';
const instance = figma.selectedInstance;

// `sl-table` has no declarative per-column markup anymore (table-column/table-cell were removed) — it's
// configured via `columns`/`data` properties (see docs/pages/components/table.md). This template can't
// render a real `<sl-table-column>`, so it surfaces the equivalent `columns` entries as a reference snippet
// instead, generated straight from this header row's text layers (no hardcoded labels).
const headers = instance.findLayers(n => n.type === 'TEXT') as { textContent: string }[];

function toKey(label: string) {
  const words = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/);
  return words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join('');
}

const selection = instance.getBoolean('Selection');
const actions = instance.getBoolean('Actions');
const quickInfo = instance.getBoolean('Quick Info');

const columnLines = headers
  .map(h => {
    const key = toKey(h.textContent);
    return `    { id: '${key}', accessorKey: '${key}', header: '${h.textContent}' }`;
  })
  .join(',\n');

const notes = [
  quickInfo ? "  // Add a leading column with a cell() returning an <sl-badge> for the 'Quick Info' indicator." : '',
  actions ? "  // Add a trailing column with meta: { actions: true } for the row action menu." : ''
]
  .filter(Boolean)
  .join('\n');

export default {
  example: figma.html`<sl-table${selection ? ' selection="multiple"' : ''}></sl-table>

<script type="module">
  table.columns = [
${columnLines}
  ];
${notes}
</script>`,
  imports: ["import 'src/components/table/table.js'"],
  id: 'table-header-row',
  metadata: { nestable: false }
};
