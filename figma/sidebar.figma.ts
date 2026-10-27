// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1054-349
// source=src/components/sidebar/sidebar.component.ts
// component=SlSidebar
import figma from 'figma';
const instance = figma.selectedInstance;

const collapsed = instance.getEnum('Collapsed', { true: true, false: false });
const noToggle = !instance.getBoolean('Show Toggle');
const header = instance.getBoolean('Show Header') ? instance.getSlot('Header') : '';
const footer = instance.getBoolean('Show Footer') ? instance.getSlot('Footer') : '';

// The Groups slot holds Sidebar Group instances
// `getSlot` alone only shows a collapsed `<Slot />` placeholder for the slot node, which has no Code Connect to open:
// the connected instances placed directly in the slot are rendered through their own templates instead, interpolated
// individually (not .map().join()), and the slot placeholder stays as the fallback for free-form content.
const groupSlot = instance.getSlot('Groups');
const groupList = groupSlot ? groupSlot.connectedInstances : [];
const groupAt = (index: number) =>
  groupList[index] ? figma.html`\n  ${groupList[index].executeTemplate().example}` : '';
const group1 = groupAt(0);
const group2 = groupAt(1);
const group3 = groupAt(2);
const group4 = groupAt(3);
const group5 = groupAt(4);
const group6 = groupAt(5);
const groupFallback = groupList.length || !groupSlot ? '' : figma.html`\n  ${groupSlot}`;

export default {
  example: figma.html`<sl-sidebar${collapsed ? ' collapsed' : ''}${noToggle ? ' no-toggle' : ''}>${header ? figma.html`\n  <div slot="header">${header}</div>` : ''}${group1}${group2}${group3}${group4}${group5}${group6}${groupFallback}${footer ? figma.html`\n  <div slot="footer">${footer}</div>` : ''}
</sl-sidebar>`,
  imports: [
    "import 'src/components/sidebar/sidebar.js'",
    "import 'src/components/sidebar-group/sidebar-group.js'",
    "import 'src/components/sidebar-item/sidebar-item.js'",
    "import 'src/components/icon/icon.js'"
  ],
  id: 'sidebar',
  metadata: { nestable: false }
};
