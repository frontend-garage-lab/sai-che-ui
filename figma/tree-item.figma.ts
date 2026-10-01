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

export default {
  example: figma.html`<sl-tree-item${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}>${text('Folder name')}</sl-tree-item>`,
  imports: ["import 'src/components/tree-item/tree-item.js'"],
  id: 'tree-item',
  metadata: { nestable: true }
};
