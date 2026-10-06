// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=333-50
// source=src/components/step/step.component.ts
// component=SlStep
import figma from 'figma';
const instance = figma.selectedInstance;

const error = instance.getBoolean('Error');
const disabled = instance.getEnum('State', { complete: false, current: false, upcoming: false, disabled: true });
const showDescription = instance.getBoolean('Show Description');
const description = showDescription ? instance.getString('Description') : '';
const labelLayer = instance.findText('label');
const label = labelLayer.type === 'TEXT' ? labelLayer.textContent : 'Step label';

export default {
  example: figma.html`<sl-step${error ? ' error' : ''}${disabled ? ' disabled' : ''}${description ? ` description="${description}"` : ''}>${label}</sl-step>`,
  imports: ["import 'src/components/step/step.js'"],
  id: 'step',
  metadata: { nestable: true }
};
