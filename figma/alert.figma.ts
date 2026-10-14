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

export default {
  example: figma.html`<sl-alert variant="${variant}" open${closable ? ' closable' : ''}>${text('This is a standard alert. You can put any information you want here.')}</sl-alert>`,
  imports: ["import 'src/components/alert/alert.js'"],
  id: 'alert',
  metadata: { nestable: true }
};
