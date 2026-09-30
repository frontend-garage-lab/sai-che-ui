// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=34-62
// source=src/components/status/status.component.ts
// component=SlStatus
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
const size = instance.getEnum('Size', { small: 'small', medium: 'medium' });

export default {
  example: figma.html`<sl-status variant="${variant}" size="${size}">${text('Status label')}</sl-status>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/status/status.js'"],
  id: 'status',
  metadata: { nestable: true }
};
