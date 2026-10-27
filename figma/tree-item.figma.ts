// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=46-18
// source=src/components/tree-item/tree-item.component.ts
// component=SlTreeItem
import figma from 'figma';
const instance = figma.selectedInstance;

// Text layers are named after their default content, which differs between variants.
function text(...layerNames: string[]) {
  for (const name of layerNames) {
    const layer = instance.findText(name);
    if (layer.type === 'TEXT') return layer.textContent;
  }
  return '';
}

const selected = instance.getEnum('State', { default: false, hover: false, selected: true, disabled: false });
const disabled = instance.getEnum('State', { default: false, hover: false, selected: false, disabled: true });
const expanded = instance.getEnum('Expanded', { true: true, false: false });
// Nested items live in the Children slot, which only exists when the item is expanded.
// `getSlot` alone only shows a collapsed `<Slot />` placeholder for the slot node, which has no Code Connect to open:
// the connected instances placed directly in the slot are rendered through their own templates instead, interpolated
// individually (not .map().join()), and the slot placeholder stays as the fallback for free-form content.
const childSlot = expanded ? instance.getSlot('Children') : undefined;
const childList = childSlot ? childSlot.connectedInstances : [];
const childAt = (index: number) =>
  childList[index] ? figma.html`\n    ${childList[index].executeTemplate().example}` : '';
const child1 = childAt(0);
const child2 = childAt(1);
const child3 = childAt(2);
const child4 = childAt(3);
const child5 = childAt(4);
const child6 = childAt(5);
const child7 = childAt(6);
const child8 = childAt(7);
const childFallback = childList.length || !childSlot ? '' : figma.html`\n    ${childSlot}`;

export default {
  example: figma.html`<sl-tree-item${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}${expanded ? ' expanded' : ''}>${text('Folder name')}${child1}${child2}${child3}${child4}${child5}${child6}${child7}${child8}${childFallback}${childList.length || childFallback ? '\n' : ''}</sl-tree-item>`,
  imports: ["import 'src/components/tree-item/tree-item.js'"],
  id: 'tree-item',
  metadata: { nestable: true }
};
