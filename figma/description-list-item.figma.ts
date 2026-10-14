// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=700-1775
// source=src/components/description-list-item/description-list-item.component.ts
// component=SlDescriptionListItem
import figma from 'figma';
const instance = figma.selectedInstance;

const label = instance.getString('Label');
const value = instance.getString('Value');

export default {
  example: figma.html`<sl-description-list-item label="${label}">${value}</sl-description-list-item>`,
  imports: ["import 'src/components/description-list-item/description-list-item.js'"],
  id: 'description-list-item',
  metadata: { nestable: true }
};
