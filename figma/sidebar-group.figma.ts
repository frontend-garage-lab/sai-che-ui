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

// The Items slot holds Sidebar Item instances
const items = instance.getSlot('Items');

export default {
  example: figma.html`<sl-sidebar-group label="${label}"${count ? ` count="${count}"` : ''}>
  ${iconCode ? figma.html`<span slot="icon">${iconCode}</span>` : ''}
  ${items}
</sl-sidebar-group>`,
  imports: ["import 'src/components/sidebar-group/sidebar-group.js'"],
  id: 'sidebar-group',
  metadata: { nestable: true }
};
