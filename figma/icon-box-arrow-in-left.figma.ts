// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1665-67
// source=src/components/icon/icon.component.ts
// component=SlIcon
import figma from 'figma';
const instance = figma.selectedInstance;

const variant = instance.getEnum('Variant', {
  default: '',
  neutral: 'neutral',
  accent: 'accent',
  success: 'success',
  warning: 'warning',
  danger: 'danger'
});

export default {
  example: variant
    ? figma.html`<sl-icon name="box-arrow-in-left" variant="${variant}"></sl-icon>`
    : figma.html`<sl-icon name="box-arrow-in-left"></sl-icon>`,
  imports: ["import 'src/components/icon/icon.js'"],
  id: 'icon-box-arrow-in-left',
  metadata: { nestable: true }
};
