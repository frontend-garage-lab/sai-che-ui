// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1023-4102
// source=src/components/button-group/button-group.component.ts
// component=SlButtonGroup
import figma from 'figma';
const instance = figma.selectedInstance;

// Each "Button"/"Button Outline"/"Button Small"/"Button Large"/"Icon Button" child is a real
// connected instance; render each via its own Code Connect template, interpolated individually.
const buttons = instance.findConnectedInstances(() => true);
const btn1 = buttons[0] && buttons[0].type === 'INSTANCE' ? buttons[0].executeTemplate().example : '';
const btn2 = buttons[1] && buttons[1].type === 'INSTANCE' ? buttons[1].executeTemplate().example : '';
const btn3 = buttons[2] && buttons[2].type === 'INSTANCE' ? buttons[2].executeTemplate().example : '';

export default {
  example: figma.html`<sl-button-group label="Button group">
  ${btn1}
  ${btn2}
  ${btn3}
</sl-button-group>`,
  imports: ["import 'src/components/button-group/button-group.js'"],
  id: 'button-group',
  metadata: { nestable: true }
};
