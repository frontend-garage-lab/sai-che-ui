// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1398-539
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
    ? figma.html`<sl-icon name="arrow-down" variant="${variant}"></sl-icon>`
    : figma.html`<sl-icon name="arrow-down"></sl-icon>`,
  imports: ["import 'src/components/icon/icon.js'"],
  id: 'icon-arrow-down',
  metadata: { nestable: true }
};
