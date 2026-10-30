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
const status = instance.getEnum('Status', { default: '', success: 'success', warning: 'warning', danger: 'danger' });
const filled = instance.getBoolean('Filled');
const showLabel = instance.getBoolean('Show Label');
const label = showLabel ? text('label', 'Label') : '';
const showHelpText = instance.getBoolean('Show Help Text');
const helpText = showHelpText ? text('help-text', 'Help text') : '';
const required = instance.getBoolean('Required');

const placeholder = text('Enter your notes here...');

export default {
  example: figma.html`<sl-textarea size="${size}"${label ? ` label="${label}"` : ''}${placeholder ? ` placeholder="${placeholder}"` : ''}${helpText ? ` help-text="${helpText}"` : ''}${status ? ` status="${status}"` : ''}${filled ? ' filled' : ''}${required ? ' required' : ''}${disabled ? ' disabled' : ''}></sl-textarea>`,
  imports: ["import 'src/components/textarea/textarea.js'"],
  id: 'textarea',
  metadata: { nestable: true }
};
