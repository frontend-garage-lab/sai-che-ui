// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=65-19
// source=src/components/range/range.component.ts
// component=SlRange
import figma from 'figma';
const instance = figma.selectedInstance;

function text(...layerNames: string[]) {
  for (const name of layerNames) {
    const layer = instance.findText(name);
    if (layer.type === 'TEXT') return layer.textContent;
  }
  return '';
}

const disabled = instance.getEnum('State', { default: false, hover: false, focus: false, disabled: true });
const label = instance.getBoolean('Show Label') ? text('label') : '';
const helpText = instance.getBoolean('Show Help Text') ? text('help-text') : '';
// The tooltip is shown on top by default (while dragging/focused); only the bottom placement needs an attribute.
const tooltipBottom = instance.getBoolean('Tooltip Bottom');

export default {
  example: figma.html`<sl-range${label ? ` label="${label}"` : ''}${helpText ? ` help-text="${helpText}"` : ''}${tooltipBottom ? ' tooltip="bottom"' : ''}${disabled ? ' disabled' : ''}></sl-range>`,
  imports: ["import 'src/components/range/range.js'"],
  id: 'range',
  metadata: { nestable: true }
};
