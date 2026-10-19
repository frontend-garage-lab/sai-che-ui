// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=64-40
// source=src/components/textarea/textarea.component.ts
// component=SlTextarea
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
const showLabel = instance.getBoolean('Show Label');
const label = showLabel ? text('Label') : '';
const showHelpText = instance.getBoolean('Show Help Text');
const helpText = showHelpText ? text('Help text') : '';
const required = instance.getBoolean('Required');

export default {
  example: figma.html`<sl-textarea size="${size}"${label ? ` label="${label}"` : ''} placeholder="${text('Enter your notes here...')}"${helpText ? ` help-text="${helpText}"` : ''}${filled ? ' filled' : ''}${required ? ' required' : ''}${disabled ? ' disabled' : ''}></sl-textarea>`,
  imports: ["import 'src/components/textarea/textarea.js'"],
  id: 'textarea',
  metadata: { nestable: true }
};
