// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=271-64
// source=src/components/radio-button/radio-button.component.ts
// component=SlRadioButton
import figma from 'figma';
const instance = figma.selectedInstance;

const disabled = instance.getEnum('State', { unchecked: false, checked: false, disabled: true });
const pill = instance.getBoolean('Pill');
const labelLayer = instance.findText('label');
const label = labelLayer.type === 'TEXT' ? labelLayer.textContent : 'Option';
const value = label.toLowerCase().replace(/\s+/g, '-');

export default {
  example: figma.html`<sl-radio-button value="${value}"${pill ? ' pill' : ''}${disabled ? ' disabled' : ''}>${label}</sl-radio-button>`,
  imports: ["import 'src/components/radio-button/radio-button.js'"],
  id: 'radio-button',
  metadata: { nestable: true }
};
