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
const status = instance.getEnum('Status', { default: '', success: 'success', warning: 'warning', danger: 'danger' });
const pill = instance.getBoolean('Pill');
const filled = instance.getBoolean('Filled');
const clearable = instance.getBoolean('Clearable');
const passwordToggle = instance.getBoolean('Password Toggle');

const showLabel = instance.getBoolean('Show Label');
const label = showLabel ? text('label', 'Label') : '';
const showHelpText = instance.getBoolean('Show Help Text');
const helpText = showHelpText ? text('help-text', 'Help text') : '';
const required = instance.getBoolean('Required');

const showPrefix = instance.getBoolean('Show Prefix');
const prefix = showPrefix ? instance.getInstanceSwap('Prefix') : null;
let prefixCode;
if (prefix && prefix.type === 'INSTANCE') {
  prefixCode = prefix.executeTemplate().example;
}

const showSuffix = instance.getBoolean('Show Suffix');
const suffix = showSuffix ? instance.getInstanceSwap('Suffix') : null;
let suffixCode;
if (suffix && suffix.type === 'INSTANCE') {
  suffixCode = suffix.executeTemplate().example;
}

const placeholder = text('Placeholder text');

export default {
  example: figma.html`<sl-input size="${size}"${label ? ` label="${label}"` : ''}${placeholder ? ` placeholder="${placeholder}"` : ''}${helpText ? ` help-text="${helpText}"` : ''}${status ? ` status="${status}"` : ''}${pill ? ' pill' : ''}${filled ? ' filled' : ''}${clearable ? ' clearable' : ''}${passwordToggle ? ' type="password" password-toggle' : ''}${required ? ' required' : ''}${disabled ? ' disabled' : ''}>${prefixCode ? figma.html`<span slot="prefix">${prefixCode}</span>` : ''}${suffixCode ? figma.html`<span slot="suffix">${suffixCode}</span>` : ''}</sl-input>`,
  imports: ["import 'src/components/input/input.js'"],
  id: 'input',
  metadata: { nestable: true }
};
