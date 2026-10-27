// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1053-158
// source=src/components/sidebar-group/sidebar-group.component.ts
// component=SlSidebarGroup
import figma from 'figma';
const instance = figma.selectedInstance;

const label = instance.getString('Label');

// Current (brand icon tile) and Collapsed are derived in code — from a `current` item and from the parent
// <sl-sidebar> — so they're not attributes on the group.
const collapsed = instance.getEnum('Collapsed', { true: true, false: false });
const showCount = !collapsed && instance.getBoolean('Show Count');
const countLayer = showCount ? instance.findInstance('Count') : null;
let count = '';
if (countLayer && countLayer.type === 'INSTANCE') {
  const t = countLayer.findText('1');
  if (t.type === 'TEXT') count = t.textContent;
}

const icon = instance.getInstanceSwap('Icon');
let iconCode;
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example;
}

// The Items slot holds Sidebar Item instances and does not exist when the group is collapsed.
// `getSlot` alone only shows a collapsed `<Slot />` placeholder for the slot node, which has no Code Connect to open:
// the connected instances placed directly in the slot are rendered through their own templates instead, interpolated
// individually (not .map().join()), and the slot placeholder stays as the fallback for free-form content.
const itemSlot = collapsed ? undefined : instance.getSlot('Items');
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

const itemsCode = figma.html`${item1}${item2}${item3}${item4}${item5}${item6}${item7}${item8}${itemFallback}`;

export default {
  example: figma.html`<sl-sidebar-group label="${label}"${count ? ` count="${count}"` : ''}>${iconCode ? figma.html`\n  <span slot="icon">${iconCode}</span>` : ''}${itemsCode}
</sl-sidebar-group>`,
  imports: [
    "import 'src/components/sidebar-group/sidebar-group.js'",
    "import 'src/components/sidebar-item/sidebar-item.js'",
    "import 'src/components/icon/icon.js'"
  ],
  id: 'sidebar-group',
  metadata: { nestable: true }
};
