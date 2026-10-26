// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=57-38
// source=src/components/select/select.component.ts
// component=SlSelect
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

const size = instance.getEnum('Size', { small: 'small', medium: 'medium', large: 'large' });
const disabled = instance.getEnum('State', { default: false, hover: false, focus: false, disabled: true });
const filled = instance.getBoolean('Filled');
const pill = instance.getBoolean('Pill');
const clearable = instance.getBoolean('Clearable');
const multiple = instance.getBoolean('Multiple');
const open = instance.getBoolean('Open');
const required = instance.getBoolean('Required');

// Label above the control and help text below it (same pattern as Input).
const showLabel = instance.getBoolean('Show Label');
const label = showLabel ? text('label', 'Label') : '';
const showHelpText = instance.getBoolean('Show Help Text');
const helpText = showHelpText ? text('help-text', 'Help text') : '';

// Prefix/suffix slots (icon components are named "Icon/<name>", matching sl-icon `name`).
function iconSlot(showProp: string, swapProp: string, slot: string) {
  if (!instance.getBoolean(showProp)) return '';
  const icon = instance.getInstanceSwap(swapProp);
  return icon && icon.type === 'INSTANCE'
    ? figma.html`
  <sl-icon slot="${slot}" name="${icon.name.replace(/^Icon\//, '')}"></sl-icon>`
    : '';
}
const prefix = iconSlot('Show Prefix', 'Prefix', 'prefix');
const suffix = iconSlot('Show Suffix', 'Suffix', 'suffix');

const placeholder = text('Select an option');

export default {
  example: figma.html`<sl-select size="${size}"${label ? ` label="${label}"` : ''}${placeholder ? ` placeholder="${placeholder}"` : ''}${helpText ? ` help-text="${helpText}"` : ''}${filled ? ' filled' : ''}${pill ? ' pill' : ''}${clearable ? ' clearable' : ''}${multiple ? ' multiple' : ''}${open ? ' open' : ''}${required ? ' required' : ''}${disabled ? ' disabled' : ''}>${prefix}${suffix}
  <!-- sl-option elements -->
</sl-select>`,
  imports: ["import 'src/components/select/select.js'"],
  id: 'select',
  metadata: { nestable: true }
};
