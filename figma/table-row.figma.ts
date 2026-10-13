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
// "Quick Info" shows a status dot + decision badge + optional attachment icon (see the "Status icons and
// alignment" example in docs/pages/components/table.md) — the dot is the formal instance-swap property,
// the badge is a plain nested instance (Figma component properties can't expose two independent
// instance-swaps bound to the same boolean) read by layer name instead, and the icon's visibility is a
// second boolean property.
const hasQuickInfo = instance.getBoolean('Quick Info');
const statusSwap = hasQuickInfo ? instance.getInstanceSwap('Quick Info Variant') : undefined;
const statusVariant =
  statusSwap && statusSwap.type === 'INSTANCE' ? (statusSwap.name.match(/Variant=(\w+)/)?.[1] ?? 'neutral') : 'neutral';
const decisionBadge = hasQuickInfo ? instance.findInstance('Decision') : undefined;
const decisionVariant =
  decisionBadge && decisionBadge.type === 'INSTANCE' ? (decisionBadge.name.match(/Variant=(\w+)/)?.[1] ?? 'neutral') : 'neutral';
// The doc example derives the decision label from the same variant the code picks (success = Approver,
// anything else = Reject) rather than reading free text off the layer, so mirror that here.
const decisionLabel = decisionVariant === 'success' ? 'Approver' : 'Reject';
const hasAttachment = hasQuickInfo && instance.getBoolean('Attachment');
const actions = instance.getBoolean('Actions');

const dataFields = cells.map((text, i) => `column${i + 1}: '${text}'`).join(', ');

const extraLines = [
  marker ? `\n  table.rowVariant = row => '${marker}';` : '',
  disabled ? `\n  table.rowDisabled = row => true;` : '',
  hasQuickInfo
    ? `\n  // "Status icons and alignment" column for this row:\n  // {\n  //   id: 'status', header: '',\n  //   cell: ({ row }) => html\`\n  //     <sl-status variant="${statusVariant}" size="small" pulse title="..."></sl-status>\n  //     <sl-badge pill variant="${decisionVariant}">${decisionLabel}</sl-badge>${hasAttachment ? '\\n  //     <sl-icon-button name="file-earmark-pdf" label="Comment uploaded" variant="danger" style="scale: 0.75;"></sl-icon-button>' : ''}\`\n  // }`
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
