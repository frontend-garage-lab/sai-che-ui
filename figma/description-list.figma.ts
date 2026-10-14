// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=700-1776
// source=src/components/description-list/description-list.component.ts
// component=SlDescriptionList
import figma from 'figma';
const instance = figma.selectedInstance;

// The Figma example composes 4 "Description List Item" instances in a 2-column layout;
// render each one via its own Code Connect template, interpolated individually.
const items = instance.findConnectedInstances(() => true);
const item1 = items[0] && items[0].type === 'INSTANCE' ? items[0].executeTemplate().example : '';
const item2 = items[1] && items[1].type === 'INSTANCE' ? items[1].executeTemplate().example : '';
const item3 = items[2] && items[2].type === 'INSTANCE' ? items[2].executeTemplate().example : '';
const item4 = items[3] && items[3].type === 'INSTANCE' ? items[3].executeTemplate().example : '';

export default {
  example: figma.html`<sl-description-list cols="2">
  ${item1}
  ${item2}
  ${item3}
  ${item4}
</sl-description-list>`,
  imports: ["import 'src/components/description-list/description-list.js'"],
  id: 'description-list',
  metadata: { nestable: true }
};
