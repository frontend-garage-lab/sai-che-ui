// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=65-19
// source=src/components/range/range.component.ts
// component=SlRange
import figma from 'figma';
const instance = figma.selectedInstance;

const disabled = instance.getEnum('State', { default: false, hover: false, focus: false, disabled: true });

export default {
  example: figma.html`<sl-range${disabled ? ' disabled' : ''}></sl-range>`,
  imports: ["import 'src/components/range/range.js'"],
  id: 'range',
  metadata: { nestable: true }
};
