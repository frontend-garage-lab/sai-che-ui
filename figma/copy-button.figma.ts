// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=60-10
// source=src/components/copy-button/copy-button.component.ts
// component=SlCopyButton
import figma from 'figma';
const instance = figma.selectedInstance;

const disabled = instance.getEnum('State', { default: false, success: false, error: false, disabled: true });

// Icon components are named "Icon/<name>", matching the sl-icon `name` attribute.
// Only icons that differ from the component defaults are emitted as slots.
function iconSlot(prop: string, slot: string, defaultName: string) {
  const icon = instance.getInstanceSwap(prop);
  const name = icon && icon.type === 'INSTANCE' ? icon.name.replace(/^Icon\//, '') : defaultName;
  return name === defaultName ? '' : figma.html`<sl-icon slot="${slot}" name="${name}"></sl-icon>`;
}

const copyIcon = iconSlot('Copy Icon', 'copy-icon', 'copy');
const successIcon = iconSlot('Success Icon', 'success-icon', 'check');
const errorIcon = iconSlot('Error Icon', 'error-icon', 'x-lg');

export default {
  example: figma.html`<sl-copy-button value="Text to copy"${disabled ? ' disabled' : ''}>${copyIcon}${successIcon}${errorIcon}</sl-copy-button>`,
  imports: ["import 'src/components/copy-button/copy-button.js'"],
  id: 'copy-button',
  metadata: { nestable: true }
};
