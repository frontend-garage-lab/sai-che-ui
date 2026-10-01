// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=37-178
// source=src/components/switch/switch.component.ts
// component=SlSwitch
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
const checked = instance.getEnum('State', { off: false, on: true, 'disabled-off': false, 'disabled-on': true });
const disabled = instance.getEnum('State', { off: false, on: false, 'disabled-off': true, 'disabled-on': true });

export default {
  example: figma.html`<sl-switch size="${size}"${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}>${text('Switch label')}</sl-switch>`,
  imports: ["import 'src/components/switch/switch.js'"],
  id: 'switch',
  metadata: { nestable: true }
};
