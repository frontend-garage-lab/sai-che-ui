// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=34-75
// source=src/components/badge/badge.component.ts
// component=SlBadge
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

export default {
  example: figma.html`<sl-badge variant="${variant}">${text('1')}</sl-badge>`,
  imports: ["import 'src/components/badge/badge.js'"],
  id: 'badge',
  metadata: { nestable: true }
};
