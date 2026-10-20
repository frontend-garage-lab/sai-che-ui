// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1014-3376
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
    ? figma.html`<sl-icon name="file-earmark" variant="${variant}"></sl-icon>`
    : figma.html`<sl-icon name="file-earmark"></sl-icon>`,
  imports: ["import 'src/components/icon/icon.js'"],
  id: 'icon-file-earmark',
  metadata: { nestable: true }
};
