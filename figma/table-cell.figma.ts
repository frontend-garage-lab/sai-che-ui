// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=867-2425
// source=src/components/table/table.component.ts
// component=SlTable
import figma from 'figma';
const instance = figma.selectedInstance;

// Body cells are rendered by the column's `cell` function, so each type surfaces the template it stands for.
const type = instance.getEnum('Type', {
  text: 'text',
  document: 'document',
  status: 'status',
  tag: 'tag',
  checkbox: 'checkbox',
  actions: 'actions',
  composite: 'composite',
  'quick-info': 'quick-info'
});
const text = instance.getString('Text');
const meta1 = instance.getString('Meta 1');
// `composite` is one cell holding any mix of status, badge and icon: the Content slot is rendered as is.
// `quick-info` is the same slot preset with a label-less status dot and the task icons (check-square, chat).
const content = type === 'composite' || type === 'quick-info' ? instance.getSlot('Content') : '';

// `Marker` flags the row with a coloured leading bar: it is the table's `rowVariant`, one colour per record.
const marker = instance.getBoolean('Marker');
const markerSwap = marker ? instance.getInstanceSwap('Marker Variant') : undefined;
// The swapped instance is named after its component set, so the colour is read from its `Variant` property.
const markerVariant =
  markerSwap && markerSwap.type === 'INSTANCE'
    ? markerSwap.getEnum('Variant', {
        primary: 'primary',
        accent: 'accent',
        success: 'success',
        neutral: 'neutral',
        warning: 'warning',
        danger: 'danger'
      })
    : 'primary';
const markerNote = marker ? ` (row marker: table.rowVariant = row => '${markerVariant}')` : '';

const example =
  type === 'quick-info'
    ? figma.html`<!-- cell: ({ row }) => html\`<span style="display: inline-flex; align-items: center; gap: var(--sl-spacing-x-small);">${content}</span>\`${markerNote} -->`
    : type === 'composite'
    ? figma.html`<!-- cell: ({ row }) => html\`${content}\`${markerNote} -->`
    : type === 'document'
      ? figma.html`<!-- cell: ({ row }) => html\`<strong>${text}</strong><br /><small>${meta1}</small>\`${markerNote} -->`
      : type === 'status'
        ? figma.html`<!-- cell: () => html\`<sl-status variant="neutral" size="small">…</sl-status>\`${markerNote} -->`
        : type === 'tag'
          ? figma.html`<!-- cell: ({ row }) => html\`<sl-tag size="small" variant="neutral">…</sl-tag>\`${markerNote} -->`
          : type === 'checkbox'
            ? figma.html`<!-- selection column: set selection="multiple" on <sl-table> -->`
            : type === 'actions'
              ? figma.html`<!-- actions column: { id: 'actions', meta: { actions: true }, cell: () => html\`<sl-menu>…</sl-menu>\` } -->`
              : figma.html`<!-- cell: the column's accessorKey value${markerNote} -->`;

export default {
  example,
  imports: ["import 'src/components/table/table.js'"],
  id: 'table-cell',
  metadata: { nestable: true }
};
