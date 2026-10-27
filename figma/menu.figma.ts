// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=862-126
// source=src/components/menu/menu.component.ts
// component=SlMenu
import figma from 'figma';
const instance = figma.selectedInstance;

// The Menu is a panel whose Items slot holds Menu Item, Menu Label and Divider instances; each one is rendered
// through its own Code Connect template.
// `getSlot` alone only shows a collapsed `<Slot />` placeholder for the slot node, which has no Code Connect to open:
// the connected instances placed directly in the slot are rendered through their own templates instead, interpolated
// individually (not .map().join()), and the slot placeholder stays as the fallback for free-form content.
const itemSlot = instance.getSlot('Items');
const itemList = itemSlot ? itemSlot.connectedInstances : [];
const itemAt = (index: number) => (itemList[index] ? figma.html`\n  ${itemList[index].executeTemplate().example}` : '');
const item1 = itemAt(0);
const item2 = itemAt(1);
const item3 = itemAt(2);
const item4 = itemAt(3);
const item5 = itemAt(4);
const item6 = itemAt(5);
const item7 = itemAt(6);
const item8 = itemAt(7);
const item9 = itemAt(8);
const item10 = itemAt(9);
const item11 = itemAt(10);
const item12 = itemAt(11);
const itemFallback = itemList.length || !itemSlot ? '' : figma.html`\n  ${itemSlot}`;

export default {
  example: figma.html`<sl-menu>${item1}${item2}${item3}${item4}${item5}${item6}${item7}${item8}${item9}${item10}${item11}${item12}${itemFallback}
</sl-menu>`,
  imports: [
    "import 'src/components/menu/menu.js'",
    "import 'src/components/menu-item/menu-item.js'",
    "import 'src/components/divider/divider.js'",
    "import 'src/components/icon/icon.js'"
  ],
  id: 'menu',
  metadata: { nestable: true }
};
