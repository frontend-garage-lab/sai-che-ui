// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=60-15
// source=src/components/tooltip/tooltip.component.ts
// component=SlTooltip
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

const placement = instance.getEnum('Placement', { top: 'top', bottom: 'bottom' });

export default {
  example: figma.html`<sl-tooltip content="${text('Tooltip text')}" placement="${placement}">
  <!-- trigger element -->
</sl-tooltip>`,
  imports: ["import 'src/components/tooltip/tooltip.js'"],
  id: 'tooltip',
  metadata: { nestable: true }
};
