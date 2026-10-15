// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=881-6
// source=src/components/tree/tree.component.ts
// component=SlTree
import figma from 'figma';
const instance = figma.selectedInstance;

// The Tree is a plain container: its Items slot holds Tree Item instances, each rendered through its own Code Connect template.
const items = instance.getSlot('Items');

export default {
  example: figma.html`<sl-tree>
  ${items}
</sl-tree>`,
  imports: ["import 'src/components/tree/tree.js'", "import 'src/components/tree-item/tree-item.js'"],
  id: 'tree',
  metadata: { nestable: true }
};
