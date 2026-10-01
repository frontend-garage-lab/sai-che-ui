// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=64-47
// source=src/components/radio-button/radio-button.component.ts
// component=SlRadioButton
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

const disabled = instance.getEnum('State', { unchecked: false, checked: false, disabled: true });
const label = text('Option');
const value = label.toLowerCase().replace(/\s+/g, '-');

export default {
  example: figma.html`<sl-radio-button value="${value}"${disabled ? ' disabled' : ''}>${label}</sl-radio-button>`,
  imports: ["import 'src/components/radio-button/radio-button.js'"],
  id: 'radio-button',
  metadata: { nestable: true }
};
