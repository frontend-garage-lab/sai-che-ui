// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=32-115
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

export default {
  example: figma.html`<sl-button variant="${variant}" outline${disabled ? ' disabled' : ''}>${text('Button')}</sl-button>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/button/button.js'"],
  id: 'button-outline',
  metadata: { nestable: true }
};
