// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=879-988
// source=src/components/table/table.component.ts
// component=SlTable
import figma from 'figma';
const instance = figma.selectedInstance;

// The Table Toolbar is the content of the table's `toolbar` slot: the Actions slot holds Buttons, Icon Buttons and
// Dividers (each rendered through its own Code Connect template), the summary is plain text at the end.
const actions = instance.getSlot('Actions');
const showSummary = instance.getBoolean('Show Summary');
const summary = showSummary ? instance.getString('Summary') : '';

export default {
  example: figma.html`<div slot="toolbar">
  ${actions}
  ${summary ? figma.html`<span style="margin-inline-start: auto;">${summary}</span>` : ''}
</div>`,
  imports: ["import 'src/components/table/table.js'"],
  id: 'table-toolbar',
  metadata: { nestable: true }
};
