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

export default {
  example: figma.html`<sl-table-row${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}>
  <sl-table-cell>${documentName}</sl-table-cell>
  <sl-table-cell>${status}</sl-table-cell>
  <sl-table-cell>${modified}</sl-table-cell>
</sl-table-row>`,
  imports: [
    "import 'src/components/table-row/table-row.js'",
    "import 'src/components/table-cell/table-cell.js'"
  ],
  id: 'table-row',
  metadata: { nestable: true }
};
