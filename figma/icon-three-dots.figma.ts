// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1014-3349
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
    ? figma.html`<sl-icon name="three-dots" variant="${variant}"></sl-icon>`
    : figma.html`<sl-icon name="three-dots"></sl-icon>`,
  imports: ["import 'src/components/icon/icon.js'"],
  id: 'icon-three-dots',
  metadata: { nestable: true }
};
