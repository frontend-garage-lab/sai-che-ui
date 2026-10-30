// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1016-211
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
    ? figma.html`<sl-icon name="info-circle" variant="${variant}"></sl-icon>`
    : figma.html`<sl-icon name="info-circle"></sl-icon>`,
  imports: ["import 'src/components/icon/icon.js'"],
  id: 'icon-info-circle',
  metadata: { nestable: true }
};
