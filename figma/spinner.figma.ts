// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=60-16
// source=src/components/spinner/spinner.component.ts
// component=SlSpinner
import figma from 'figma';
const instance = figma.selectedInstance;

export default {
  example: figma.html`<sl-spinner></sl-spinner>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'"],
  id: 'spinner',
  metadata: { nestable: true }
};
