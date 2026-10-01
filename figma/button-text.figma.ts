// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=32-124
// source=src/components/button/button.component.ts
// component=SlButton
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

const disabled = instance.getEnum('State', { default: false, hover: false, active: false, disabled: true });

export default {
  example: figma.html`<sl-button variant="text"${disabled ? ' disabled' : ''}>${text('Button')}</sl-button>`,
  imports: ["import 'src/components/button/button.js'"],
  id: 'button-text',
  metadata: { nestable: true }
};
