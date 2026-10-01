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
const selected = instance.getEnum('State', { default: false, selected: true });

export default {
  example: figma.html`<sl-stat variant="${variant}" count="${text('128')}"${selected ? ' selected' : ''}>${text('Label')}</sl-stat>`,
  imports: ["import 'src/components/stat/stat.js'"],
  id: 'stat',
  metadata: { nestable: true }
};
