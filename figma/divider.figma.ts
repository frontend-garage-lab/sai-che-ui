// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=59-11
// source=src/components/divider/divider.component.ts
// component=SlDivider
import figma from 'figma';
const instance = figma.selectedInstance;

const vertical = instance.getEnum('Orientation', { horizontal: false, vertical: true });

export default {
  example: figma.html`<sl-divider${vertical ? ' vertical' : ''}></sl-divider>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/divider/divider.js'"],
  id: 'divider',
  metadata: { nestable: true }
};
