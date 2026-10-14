// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=768-283
// source=src/components/dropdown/dropdown.component.ts
// component=SlDropdown
import figma from 'figma';
const instance = figma.selectedInstance;

// First connected instance is the trigger Button; the rest are Menu Item instances inside the Panel.
const connected = instance.findConnectedInstances(() => true);
const trigger = connected[0] && connected[0].type === 'INSTANCE' ? connected[0].executeTemplate().example : '';
const item1 = connected[1] && connected[1].type === 'INSTANCE' ? connected[1].executeTemplate().example : '';
const item2 = connected[2] && connected[2].type === 'INSTANCE' ? connected[2].executeTemplate().example : '';
const item3 = connected[3] && connected[3].type === 'INSTANCE' ? connected[3].executeTemplate().example : '';

export default {
  example: figma.html`<sl-dropdown>
  <span slot="trigger">${trigger}</span>
  <sl-menu>
    ${item1}
    ${item2}
    ${item3}
  </sl-menu>
</sl-dropdown>`,
  imports: [
    "import 'src/components/dropdown/dropdown.js'",
    "import 'src/components/menu/menu.js'"
  ],
  id: 'dropdown',
  metadata: { nestable: false }
};
