// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=32-58
// source=src/components/button/button.component.ts
// component=SlButton
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

const variant = instance.getEnum('Variant', {
  default: 'default',
  primary: 'primary',
  accent: 'accent',
  success: 'success',
  neutral: 'neutral',
  warning: 'warning',
  danger: 'danger'
});
const disabled = instance.getEnum('State', { default: false, hover: false, active: false, disabled: true });
const pill = instance.getBoolean('Pill');
const loading = instance.getBoolean('Loading');
const caret = instance.getBoolean('Caret');

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

export default {
  example: figma.html`<sl-button variant="${variant}"${pill ? ' pill' : ''}${loading ? ' loading' : ''}${caret ? ' caret' : ''}${disabled ? ' disabled' : ''}>${prefixCode ? figma.html`<span slot="prefix">${prefixCode}</span>` : ''}${text('Button')}${suffixCode ? figma.html`<span slot="suffix">${suffixCode}</span>` : ''}</sl-button>`,
  imports: ["import 'src/components/button/button.js'"],
  id: 'button',
  metadata: { nestable: true }
};
