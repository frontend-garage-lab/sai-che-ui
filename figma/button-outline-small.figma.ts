// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=198-119
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
const caret = instance.getBoolean('Caret');
const showPrefix = instance.getBoolean('Show Prefix Icon');
const prefix = showPrefix ? instance.getInstanceSwap('Prefix Icon') : null;
let prefixCode;
if (prefix && prefix.type === 'INSTANCE') {
  prefixCode = prefix.executeTemplate().example;
}

export default {
  example: figma.html`<sl-button variant="${variant}" size="small" outline${caret ? ' caret' : ''}${disabled ? ' disabled' : ''}>${prefixCode ? figma.html`<span slot="prefix">${prefixCode}</span>` : ''}${text('Button')}</sl-button>`,
  imports: ["import 'src/components/button/button.js'"],
  id: 'button-outline-small',
  metadata: { nestable: true }
};
