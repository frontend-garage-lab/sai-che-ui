// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=264-53
// source=src/components/option/option.component.ts
// component=SlOption
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

const disabled = instance.getEnum('State', { default: false, hover: false, current: false, disabled: true });

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

const label = text('label', 'Option');
const value = label.toLowerCase().replace(/\s+/g, '-');

export default {
  example: figma.html`<sl-option value="${value}"${disabled ? ' disabled' : ''}>${prefixCode ? figma.html`<span slot="prefix">${prefixCode}</span>` : ''}${label}${suffixCode ? figma.html`<span slot="suffix">${suffixCode}</span>` : ''}</sl-option>`,
  imports: ["import 'src/components/option/option.js'"],
  id: 'option',
  metadata: { nestable: true }
};
