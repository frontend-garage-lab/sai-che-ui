// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=768-37
// source=src/components/radio-group/radio-group.component.ts
// component=SlRadioGroup
import figma from 'figma';
const instance = figma.selectedInstance;

// Each "Radio Button" child is a real connected instance; render each via its own Code Connect
// template, interpolated individually.
const options = instance.findConnectedInstances(() => true);
const opt1 = options[0] && options[0].type === 'INSTANCE' ? options[0].executeTemplate().example : '';
const opt2 = options[1] && options[1].type === 'INSTANCE' ? options[1].executeTemplate().example : '';
const opt3 = options[2] && options[2].type === 'INSTANCE' ? options[2].executeTemplate().example : '';

export default {
  example: figma.html`<sl-radio-group label="Select an option" name="option">
  ${opt1}
  ${opt2}
  ${opt3}
</sl-radio-group>`,
  imports: ["import 'src/components/radio-group/radio-group.js'"],
  id: 'radio-group',
  metadata: { nestable: true }
};
