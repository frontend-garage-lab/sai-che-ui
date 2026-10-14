// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=60-58
// source=src/components/progress-bar/progress-bar.component.ts
// component=SlProgressBar
import figma from 'figma';
const instance = figma.selectedInstance;

// Text layers are named after their default content, which differs between variants.
function text(...layerNames: string[]) {
  for (const name of layerNames) {
    const layer = instance.findText(name);
    if (layer.type === 'TEXT') return layer.textContent;
  }
  return '';
}

const indeterminate = instance.getEnum('Value', { '25': false, '60': false, '90': false, indeterminate: true });
const value = instance.getEnum('Value', { '25': '25', '60': '60', '90': '90', indeterminate: '0' });

export default {
  example: indeterminate
    ? figma.html`<sl-progress-bar indeterminate></sl-progress-bar>`
    : figma.html`<sl-progress-bar value="${value}">${text('25%', '60%', '90%')}</sl-progress-bar>`,
  imports: ["import 'src/components/progress-bar/progress-bar.js'"],
  id: 'progress-bar',
  metadata: { nestable: true }
};
