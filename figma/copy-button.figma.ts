// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=60-10
// source=src/components/copy-button/copy-button.component.ts
// component=SlCopyButton
import figma from 'figma';
const instance = figma.selectedInstance;

const disabled = instance.getEnum('State', { default: false, success: false, error: false, disabled: true });

export default {
  example: figma.html`<sl-copy-button value="Text to copy"${disabled ? ' disabled' : ''}></sl-copy-button>`,
  imports: ["import 'src/components/copy-button/copy-button.js'"],
  id: 'copy-button',
  metadata: { nestable: true }
};
