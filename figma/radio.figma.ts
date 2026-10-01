// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=37-129
// source=src/components/radio/radio.component.ts
// component=SlRadio
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
const disabled = instance.getEnum('State', {
  unchecked: false,
  'unchecked-hover': false,
  checked: false,
  'checked-hover': false,
  disabled: true,
  'disabled-checked': true
});

export default {
  example: figma.html`<sl-radio size="${size}"${disabled ? ' disabled' : ''}>${text('Radio label')}</sl-radio>`,
  imports: ["import 'src/components/radio/radio.js'"],
  id: 'radio',
  metadata: { nestable: true }
};
