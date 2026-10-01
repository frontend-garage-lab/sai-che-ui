// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=40-18
// source=src/components/step/step.component.ts
// component=SlStep
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

const error = instance.getEnum('State', { complete: false, current: false, upcoming: false, error: true });

export default {
  example: figma.html`<sl-step${error ? ' error' : ''}>${text('Upload', 'Review', 'Approve', 'Publish')}</sl-step>`,
  imports: ["import 'src/components/step/step.js'"],
  id: 'step',
  metadata: { nestable: true }
};
