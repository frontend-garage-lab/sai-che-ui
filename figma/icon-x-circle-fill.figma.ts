// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1014-3331
// source=src/components/icon/icon.component.ts
// component=SlIcon
import figma from 'figma';
const instance = figma.selectedInstance;

const variant = instance.getEnum('Variant', {
  default: '',
  neutral: 'neutral',
  accent: 'accent',
  success: 'success',
  danger: 'danger'
});

export default {
  example: variant
    ? figma.html`<sl-icon name="x-circle-fill" variant="${variant}"></sl-icon>`
    : figma.html`<sl-icon name="x-circle-fill"></sl-icon>`,
  imports: ["import 'src/components/icon/icon.js'"],
  id: 'icon-x-circle-fill',
  metadata: { nestable: true }
};
