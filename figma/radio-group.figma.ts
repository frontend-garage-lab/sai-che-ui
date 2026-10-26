// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=985-44
// source=src/components/radio-group/radio-group.component.ts
// component=SlRadioGroup
import figma from 'figma';
const instance = figma.selectedInstance;

function text(...layerNames: string[]) {
  for (const name of layerNames) {
    const layer = instance.findText(name);
    if (layer.type === 'TEXT') return layer.textContent;
  }
  return '';
}

const showLabel = instance.getBoolean('Show Label');
const label = showLabel ? text('label', 'Label') : '';
const showHelpText = instance.getBoolean('Show Help Text');
const helpText = showHelpText ? text('help-text', 'Help text') : '';
const required = instance.getBoolean('Required');

// Type=radio holds "Radio" instances (sl-radio, stacked); Type=button holds "Radio Button" instances
// (sl-radio-button, rendered as a button group). Each child renders via its own Code Connect template.
// The options live in the `Options` slot (any number of Radio / Radio Button instances).
const options = instance.findConnectedInstances(() => true);
const opt1 = options[0] && options[0].type === 'INSTANCE' ? options[0].executeTemplate().example : '';
const opt2 = options[1] && options[1].type === 'INSTANCE' ? options[1].executeTemplate().example : '';
const opt3 = options[2] && options[2].type === 'INSTANCE' ? options[2].executeTemplate().example : '';

export default {
  example: figma.html`<sl-radio-group${label ? ` label="${label}"` : ''}${helpText ? ` help-text="${helpText}"` : ''} name="option"${required ? ' required' : ''}>
  ${opt1}
  ${opt2}
  ${opt3}
</sl-radio-group>`,
  imports: ["import 'src/components/radio-group/radio-group.js'"],
  id: 'radio-group',
  metadata: { nestable: true }
};
