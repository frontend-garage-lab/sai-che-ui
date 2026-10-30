// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1016-521
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
    ? figma.html`<sl-icon name="check-square" variant="${variant}"></sl-icon>`
    : figma.html`<sl-icon name="check-square"></sl-icon>`,
  imports: ["import 'src/components/icon/icon.js'"],
  id: 'icon-check-square',
  metadata: { nestable: true }
};
