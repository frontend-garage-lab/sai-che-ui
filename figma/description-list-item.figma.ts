// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=700-1775
// source=src/components/description-list-item/description-list-item.component.ts
// component=SlDescriptionListItem
import figma from 'figma';
const instance = figma.selectedInstance;

const label = instance.getString('Label');
const value = instance.getString('Value');
// Optional rich content after the value (e.g. an sl-tag or sl-status), dropped into the "Value Suffix" slot.
const suffix = instance.getSlot('Value Suffix');

export default {
  example: figma.html`<sl-description-list-item label="${label}">${value}${suffix}</sl-description-list-item>`,
  imports: ["import 'src/components/description-list-item/description-list-item.js'"],
  id: 'description-list-item',
  metadata: { nestable: true }
};
