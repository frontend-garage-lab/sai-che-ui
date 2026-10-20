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

const values = {
  '0': '0',
  '5': '5',
  '10': '10',
  '15': '15',
  '20': '20',
  '25': '25',
  '30': '30',
  '35': '35',
  '40': '40',
  '45': '45',
  '50': '50',
  '55': '55',
  '60': '60',
  '65': '65',
  '70': '70',
  '75': '75',
  '80': '80',
  '85': '85',
  '90': '90',
  '95': '95',
  '100': '100',
  indeterminate: 'indeterminate'
};
const value = instance.getEnum('Value', values);
const indeterminate = value === 'indeterminate';

export default {
  example: indeterminate
    ? figma.html`<sl-progress-bar indeterminate></sl-progress-bar>`
    : figma.html`<sl-progress-bar value="${value}">${text(...Object.keys(values).map(v => `${v}%`))}</sl-progress-bar>`,
  imports: ["import 'src/components/progress-bar/progress-bar.js'"],
  id: 'progress-bar',
  metadata: { nestable: true }
};
