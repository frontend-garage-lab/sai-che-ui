// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1016-446
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
    ? figma.html`<sl-icon name="file-earmark-ppt" variant="${variant}"></sl-icon>`
    : figma.html`<sl-icon name="file-earmark-ppt"></sl-icon>`,
  imports: ["import 'src/components/icon/icon.js'"],
  id: 'icon-file-earmark-ppt',
  metadata: { nestable: true }
};
