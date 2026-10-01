// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=36-26
// source=src/components/input/input.component.ts
// component=SlInput
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

const size = instance.getEnum('Size', { small: 'small', medium: 'medium', large: 'large' });
const disabled = instance.getEnum('State', { default: false, hover: false, focus: false, disabled: true });

export default {
  example: figma.html`<sl-input size="${size}" placeholder="${text('Placeholder text')}"${disabled ? ' disabled' : ''}></sl-input>`,
  imports: ["import 'src/components/input/input.js'"],
  id: 'input',
  metadata: { nestable: true }
};
