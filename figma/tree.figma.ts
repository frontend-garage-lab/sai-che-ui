// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=881-6
// source=src/components/tree/tree.component.ts
// component=SlTree
import figma from 'figma';
const instance = figma.selectedInstance;

// The Tree is a plain container: its Items slot holds Tree Item instances, each rendered through its own Code Connect template.
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
const itemFallback = itemList.length || !itemSlot ? '' : figma.html`\n  ${itemSlot}`;

export default {
  example: figma.html`<sl-tree>${item1}${item2}${item3}${item4}${item5}${item6}${item7}${item8}${itemFallback}
</sl-tree>`,
  imports: ["import 'src/components/tree/tree.js'", "import 'src/components/tree-item/tree-item.js'"],
  id: 'tree',
  metadata: { nestable: true }
};
