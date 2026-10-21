// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=62-41
// source=src/components/menu-item/menu-item.component.ts
// component=SlMenuItem
import figma from 'figma';
const instance = figma.selectedInstance;

const checked = instance.getEnum('State', {
  default: false,
  hover: false,
  focus: false,
  checked: true,
  disabled: false
});
const disabled = instance.getEnum('State', {
  default: false,
  hover: false,
  focus: false,
  checked: false,
  disabled: true
});
const loading = instance.getBoolean('Loading');

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
  example: figma.html`<sl-menu-item${checked ? ' type="checkbox" checked' : ''}${disabled ? ' disabled' : ''}${loading ? ' loading' : ''}>${prefixCode ? figma.html`<span slot="prefix">${prefixCode}</span>` : ''}${instance.getString('Label')}${suffixCode ? figma.html`<span slot="suffix">${suffixCode}</span>` : ''}</sl-menu-item>`,
  imports: ["import 'src/components/menu-item/menu-item.js'"],
  id: 'menu-item',
  metadata: { nestable: true }
};
