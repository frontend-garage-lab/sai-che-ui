// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=271-64
// source=src/components/radio-button/radio-button.component.ts
// component=SlRadioButton
import figma from 'figma';
const instance = figma.selectedInstance;

const checked = instance.getEnum('State', { unchecked: false, checked: true, disabled: false });
const disabled = instance.getEnum('State', { unchecked: false, checked: false, disabled: true });
const pill = instance.getEnum('Pill', { true: true, false: false });
const size = instance.getEnum('Size', { small: 'small', medium: 'medium', large: 'large' });
// Position (alone · first · middle · last) is not mapped: in code sl-radio-group's sl-button-group sets it on each
// button (data-sl-button-group__button--first/inner/last), there is no attribute.
const labelLayer = instance.findText('label');
const label = labelLayer.type === 'TEXT' ? labelLayer.textContent : 'Option';
const value = label.toLowerCase().replace(/\s+/g, '-');

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
  example: figma.html`<sl-radio-button value="${value}" size="${size}"${pill ? ' pill' : ''}${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}>${prefixCode ? figma.html`<span slot="prefix">${prefixCode}</span>` : ''}${label}${suffixCode ? figma.html`<span slot="suffix">${suffixCode}</span>` : ''}</sl-radio-button>`,
  imports: ["import 'src/components/radio-button/radio-button.js'"],
  id: 'radio-button',
  metadata: { nestable: true }
};
