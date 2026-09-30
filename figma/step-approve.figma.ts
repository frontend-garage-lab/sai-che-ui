// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=40-30
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

export default {
  example: figma.html`<sl-step>${text('Approve')}</sl-step>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/step/step.js'"],
  id: 'step-approve',
  metadata: { nestable: true }
};
