// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=35-32
// source=src/components/alert/alert.component.ts
// component=SlAlert
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
const closable = instance.getBoolean('Closable');

// The icon slot: the nested icon instance is named "Icon/<name>", matching the sl-icon `name` attribute.
const showIcon = instance.getBoolean('Show Icon');
const icons = showIcon ? instance.findConnectedInstances(node => node.name.startsWith('Icon/')) : [];
const icon = icons[0];
const iconName = icon && icon.type === 'INSTANCE' ? icon.name.replace(/^Icon\//, '') : '';

export default {
  example: figma.html`<sl-alert variant="${variant}" open${closable ? ' closable' : ''}>${iconName ? figma.html`<sl-icon slot="icon" name="${iconName}"></sl-icon>` : ''}${text('This is a standard alert. You can put any information you want here.')}</sl-alert>`,
  imports: ["import 'src/components/alert/alert.js'"],
  id: 'alert',
  metadata: { nestable: true }
};
