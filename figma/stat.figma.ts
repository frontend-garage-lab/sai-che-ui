// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=42-74
// source=src/components/stat/stat.component.ts
// component=SlStat
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
  primary: 'primary',
  accent: 'accent',
  success: 'success',
  neutral: 'neutral',
  warning: 'warning',
  danger: 'danger'
});
const selected = instance.getEnum('State', { default: false, selected: true, disabled: false });
const disabled = instance.getEnum('State', { default: false, selected: false, disabled: true });

const icon = instance.getInstanceSwap('Icon');
let iconCode;
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example;
}

export default {
  example: figma.html`<sl-stat variant="${variant}" count="${text('128')}"${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}>${iconCode ? figma.html`<span slot="prefix">${iconCode}</span>` : ''}${text('Label')}</sl-stat>`,
  imports: ["import 'src/components/stat/stat.js'"],
  id: 'stat',
  metadata: { nestable: true }
};
