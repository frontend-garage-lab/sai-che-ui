// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1081-6712
// source=src/components/button/button.component.ts
// component=SlButton
import figma from 'figma';
const instance = figma.selectedInstance;

const variant = instance.getEnum('Variant', {
  default: 'default',
  primary: 'primary',
  accent: 'accent',
  success: 'success',
  neutral: 'neutral',
  warning: 'warning',
  danger: 'danger',
  text: 'text'
});
const size = instance.getEnum('Size', { small: 'small', medium: '', large: 'large' });
const disabled = instance.getEnum('State', { default: false, hover: false, active: false, disabled: true });
const outline = instance.getEnum('Outline', { true: true, false: false });
const circle = instance.getEnum('Circle', { true: true, false: false });
const label = instance.getBoolean('Show Label') ? instance.getString('Label') : '';
const loading = instance.getBoolean('Loading');

// Pill is the Shape of the exposed nested "background" instance (circle variants use the pill shape internally).
const background = instance.findInstance('background');
const pill = !circle && background.type === 'INSTANCE' ? background.getEnum('Shape', { rounded: false, pill: true }) : false;

function iconCode(swapName: string, showName?: string) {
  if (showName && !instance.getBoolean(showName)) return undefined;
  const icon = instance.getInstanceSwap(swapName);
  return icon && icon.type === 'INSTANCE' ? icon.executeTemplate().example : undefined;
}

const attrs = figma.html`variant="${variant}"${size ? figma.html` size="${size}"` : ''}${outline ? ' outline' : ''}${pill ? ' pill' : ''}${circle ? ' circle' : ''}${loading ? ' loading' : ''}${disabled ? ' disabled' : ''}`;

let example;
if (circle) {
  example = figma.html`<sl-button ${attrs}>${iconCode('Prefix')}</sl-button>`;
} else {
  const caret = instance.getBoolean('Caret');
  const prefixCode = iconCode('Prefix', 'Show Prefix');
  const suffixCode = iconCode('Suffix', 'Show Suffix');
  example = figma.html`<sl-button ${attrs}${caret ? ' caret' : ''}>${prefixCode ? figma.html`<span slot="prefix">${prefixCode}</span>` : ''}${label}${suffixCode ? figma.html`<span slot="suffix">${suffixCode}</span>` : ''}</sl-button>`;
}

export default {
  example,
  imports: ["import 'src/components/button/button.js'"],
  id: 'button',
  metadata: { nestable: true }
};
