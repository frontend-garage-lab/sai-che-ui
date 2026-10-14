// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=685-10
// source=src/components/spinner/spinner.component.ts
// component=SlSpinner
import figma from 'figma';
const instance = figma.selectedInstance;

// The component has no `size` prop in code — size is controlled via `font-size`,
// so the Figma Size variant maps to an inline font-size style instead of an attribute.
const size = instance.getEnum('Size', { small: '', medium: '2rem', large: '3rem' });
const style = size ? ` style="font-size: ${size};"` : '';

export default {
  example: figma.html`<sl-spinner${style}></sl-spinner>`,
  imports: ["import 'src/components/spinner/spinner.js'"],
  id: 'spinner',
  metadata: { nestable: true }
};
