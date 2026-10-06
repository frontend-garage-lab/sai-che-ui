// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=53-37
// source=src/components/table-row/table-row.component.ts
// component=SlTableRow
import figma from 'figma';
const instance = figma.selectedInstance;

// Text layers are named after their default content, which differs between variants.
function text(...layerNames: string[]) {
  for (const name of layerNames) {
    const layer = instance.findText(name);
    if (layer.type === 'TEXT') return layer.textContent;
  }
  return '';
}

const selected = instance.getEnum('State', { default: false, hover: false, selected: true, disabled: false });
const disabled = instance.getEnum('State', { default: false, hover: false, selected: false, disabled: true });
const documentName = text('Contract_001.pdf', 'Datasheet_Rev2.pdf', 'Spec_Final.pdf', 'Draft_v0.pdf');
const status = text('Approved', 'In review', 'Locked');
const modified = text('2026-09-12', '2026-09-20', '2026-09-28', '2026-08-01');

const variant = instance.getEnum('Marker', {
  none: '',
  primary: 'primary',
  accent: 'accent',
  success: 'success',
  neutral: 'neutral',
  warning: 'warning',
  danger: 'danger'
});

// Quick Info's colour is independent of Marker (an instance-swap of its own, so the two can show
// different statuses at once). Its label isn't a bound property in Figma, so it's always "Status".
const hasQuickInfo = instance.getBoolean('Quick Info');
const quickInfoSwap = hasQuickInfo ? instance.getInstanceSwap('Quick Info Variant') : undefined;
const quickInfoVariant =
  quickInfoSwap && quickInfoSwap.type === 'INSTANCE' ? (quickInfoSwap.name.match(/Variant=(\w+)/)?.[1] ?? 'neutral') : 'neutral';
const quickInfoLabel = 'Status';

export default {
  example: figma.html`<sl-table-row${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}${variant ? ` variant="${variant}"` : ''}>
  ${hasQuickInfo ? figma.html`<sl-table-cell><sl-badge variant="${quickInfoVariant}">${quickInfoLabel}</sl-badge></sl-table-cell>` : ''}
  <sl-table-cell>${documentName}</sl-table-cell>
  <sl-table-cell>${status}</sl-table-cell>
  <sl-table-cell>${modified}</sl-table-cell>
</sl-table-row>`,
  imports: [
    "import 'src/components/table-row/table-row.js'",
    "import 'src/components/table-cell/table-cell.js'",
    "import 'src/components/badge/badge.js'"
  ],
  id: 'table-row',
  metadata: { nestable: true }
};
