// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=862-126
// source=src/components/menu/menu.component.ts
// component=SlMenu
import figma from 'figma';
const instance = figma.selectedInstance;

// The Menu is a panel whose Items slot holds Menu Item, Menu Label and Divider instances; each one is rendered
// through its own Code Connect template.
const items = instance.getSlot('Items');

export default {
  example: figma.html`<sl-menu>
  ${items}
</sl-menu>`,
  imports: ["import 'src/components/menu/menu.js'", "import 'src/components/menu-item/menu-item.js'"],
  id: 'menu',
  metadata: { nestable: true }
};
