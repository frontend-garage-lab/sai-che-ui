// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1052-50
// source=src/components/sidebar-item/sidebar-item.component.ts
// component=SlSidebarItem
import figma from 'figma';
const instance = figma.selectedInstance;

const label = instance.getString('Label');
const current = instance.getEnum('State', { default: false, hover: false, current: true });
const hasPrefix = instance.getEnum('Prefix', { true: true, false: false });

// The count is the text of the nested Badge Pill instance
const showCount = instance.getBoolean('Show Count');
const countLayer = showCount ? instance.findInstance('Count') : null;
let count = '';
if (countLayer && countLayer.type === 'INSTANCE') {
  const t = countLayer.findText('1');
  if (t.type === 'TEXT') count = t.textContent;
}

const prefix = hasPrefix ? instance.getInstanceSwap('Prefix Icon') : null;
let prefixCode;
if (prefix && prefix.type === 'INSTANCE') {
  prefixCode = prefix.executeTemplate().example;
}

export default {
  example: figma.html`<sl-sidebar-item href="#"${count ? ` count="${count}"` : ''}${current ? ' current' : ''}>${prefixCode ? figma.html`<span slot="prefix">${prefixCode}</span>` : ''}${label}</sl-sidebar-item>`,
  imports: ["import 'src/components/sidebar-item/sidebar-item.js'"],
  id: 'sidebar-item',
  metadata: { nestable: true }
};
