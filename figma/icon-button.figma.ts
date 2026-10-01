// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=47-10
// source=src/components/icon-button/icon-button.component.ts
// component=SlIconButton
import figma from 'figma';
const instance = figma.selectedInstance;

const disabled = instance.getEnum('State', { default: false, hover: false, active: false, disabled: true });

export default {
  example: figma.html`<sl-icon-button name="gear" label="Settings"${disabled ? ' disabled' : ''}></sl-icon-button>`,
  imports: ["import 'src/components/icon-button/icon-button.js'"],
  id: 'icon-button',
  metadata: { nestable: true }
};
