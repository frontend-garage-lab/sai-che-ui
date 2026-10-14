// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=57-38
// source=src/components/select/select.component.ts
// component=SlSelect
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
const filled = instance.getBoolean('Filled');
const pill = instance.getBoolean('Pill');
const clearable = instance.getBoolean('Clearable');
const multiple = instance.getBoolean('Multiple');
const open = instance.getBoolean('Open');

export default {
  example: figma.html`<sl-select size="${size}" placeholder="${text('Select an option')}"${filled ? ' filled' : ''}${pill ? ' pill' : ''}${clearable ? ' clearable' : ''}${multiple ? ' multiple' : ''}${open ? ' open' : ''}${disabled ? ' disabled' : ''}>
  <!-- sl-option elements -->
</sl-select>`,
  imports: ["import 'src/components/select/select.js'"],
  id: 'select',
  metadata: { nestable: true }
};
