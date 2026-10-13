// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=53-37
// source=src/components/table/table.component.ts
// component=SlTable
import figma from 'figma';
const instance = figma.selectedInstance;

// Same limitation as table-header-row.figma.ts: there's no more `<sl-table-row>`/`<sl-table-cell>` to
// render, so this surfaces the equivalent `data`/`rowVariant`/`rowDisabled`/column-`cell()` snippets a
// row like this one would need, read straight from its text layers and variant state.
const cells = (instance.findLayers(n => n.type === 'TEXT') as { textContent: string }[]).map(c => c.textContent);

const striped = instance.getBoolean('Striped');
const disabled = instance.getEnum('State', { default: false, hover: false, selected: false, disabled: true });
const marker = instance.getEnum('Marker', {
  none: '',
  primary: 'primary',
  accent: 'accent',
  success: 'success',
  neutral: 'neutral',
  warning: 'warning',
  danger: 'danger'
});
// "Quick Info" shows two short status badges side by side (see the "Status icons and alignment" example
// in docs/pages/components/table.md) — the first is the formal instance-swap property, the second is a
// plain nested instance (Figma component properties can't expose two independent instance-swaps bound to
// the same boolean), so it's read by layer name instead.
const hasQuickInfo = instance.getBoolean('Quick Info');
const firstBadgeSwap = hasQuickInfo ? instance.getInstanceSwap('Quick Info Variant') : undefined;
const firstBadgeVariant =
  firstBadgeSwap && firstBadgeSwap.type === 'INSTANCE' ? (firstBadgeSwap.name.match(/Variant=(\w+)/)?.[1] ?? 'neutral') : 'neutral';
const secondBadge = hasQuickInfo ? instance.findInstance('Badge 2') : undefined;
const secondBadgeVariant =
  secondBadge && secondBadge.type === 'INSTANCE' ? (secondBadge.name.match(/Variant=(\w+)/)?.[1] ?? 'neutral') : 'neutral';
const actions = instance.getBoolean('Actions');

const dataFields = cells.map((text, i) => `column${i + 1}: '${text}'`).join(', ');

const extraLines = [
  marker ? `\n  table.rowVariant = row => '${marker}';` : '',
  disabled ? `\n  table.rowDisabled = row => true;` : '',
  hasQuickInfo
    ? `\n  // "Quick Info" column for this row:\n  // {\n  //   id: 'status', header: 'Quick Info',\n  //   cell: ({ row }) => html\`\n  //     <sl-badge variant="${firstBadgeVariant}">O</sl-badge>\n  //     <sl-badge variant="${secondBadgeVariant}">W</sl-badge>\n  //   \`\n  // }`
    : '',
  actions ? `\n  // Trailing actions column: { id: 'actions', meta: { actions: true }, cell: ({ row }) => ... }` : ''
]
  .filter(Boolean)
  .join('');

export default {
  example: figma.html`<sl-table${striped ? ' striped' : ''}></sl-table>

<script type="module">
  table.data = [{ ${dataFields} }];
${extraLines}
</script>`,
  imports: ["import 'src/components/table/table.js'"],
  id: 'table-row',
  metadata: { nestable: false }
};
