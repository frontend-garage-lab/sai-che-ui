// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=37-65
// source=src/components/checkbox/checkbox.component.ts
// component=SlCheckbox
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
const checked = instance.getEnum('State', {
  unchecked: false,
  'unchecked-hover': false,
  checked: true,
  'checked-hover': true,
  disabled: false,
  'disabled-checked': true
});
const disabled = instance.getEnum('State', {
  unchecked: false,
  'unchecked-hover': false,
  checked: false,
  'checked-hover': false,
  disabled: true,
  'disabled-checked': true
});

export default {
  example: figma.html`<sl-checkbox size="${size}"${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}>${text('Checkbox label')}</sl-checkbox>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'"],
  id: 'checkbox',
  metadata: { nestable: true }
};
