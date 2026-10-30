// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=879-988
// source=src/components/table/table.component.ts
// component=SlTable
import figma from 'figma';
const instance = figma.selectedInstance;

// The Table Toolbar is the content of the table's `toolbar` slot: the Actions slot holds Buttons, Icon Buttons and
// Dividers, each rendered through its own Code Connect template and interpolated individually (not .map().join()),
// as the Dropdown and Tab Group mappings do. Default content (2026-10-30): Add · View · Edit · Divider · More ·
// Divider · Delete · Spacer · Export · Config (9 connected instances; the Spacer frame has no template). `getSlot('Actions')` would only show a collapsed `Actions` placeholder.
const actions = instance.findConnectedInstances(node => ['Button', 'Icon Button', 'Divider'].includes(node.name));
const render = (index: number) =>
  actions[index] && actions[index].type === 'INSTANCE' ? actions[index].executeTemplate().example : '';
const action1 = render(0);
const action2 = render(1);
const action3 = render(2);
const action4 = render(3);
const action5 = render(4);
const action6 = render(5);
const action7 = render(6);
const action8 = render(7);
const action9 = render(8);
const action10 = render(9);
const showSummary = instance.getBoolean('Show Summary');
const summary = showSummary ? instance.getString('Summary') : '';

export default {
  example: figma.html`<div slot="toolbar">
  ${action1}
  ${action2}
  ${action3}
  ${action4}
  ${action5}
  ${action6}
  ${action7}
  ${action8}
  ${action9}
  ${action10}
  ${summary ? figma.html`<span style="margin-inline-start: auto;">${summary}</span>` : ''}
</div>`,
  imports: [
    "import 'src/components/table/table.js'",
    "import 'src/components/button/button.js'",
    "import 'src/components/icon-button/icon-button.js'",
    "import 'src/components/icon/icon.js'",
    "import 'src/components/divider/divider.js'"
  ],
  id: 'table-toolbar',
  metadata: { nestable: true }
};
