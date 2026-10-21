// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=47-10
// source=src/components/icon-button/icon-button.component.ts
// component=SlIconButton
import figma from 'figma';
const instance = figma.selectedInstance;

const variant = instance.getEnum('Variant', {
  default: 'default',
  primary: 'primary',
  accent: 'accent',
  success: 'success',
  neutral: 'neutral',
  warning: 'warning',
  danger: 'danger'
});
const disabled = instance.getEnum('State', { default: false, hover: false, active: false, disabled: true });
const filled = instance.getBoolean('Filled');
// Size exists only on the default (ghost) variant, which inherits font-size; semantic variants have a fixed size.
const fontSize = instance.getEnum('Size', { medium: '', large: '1.5rem', 'x-large': '2rem' });

// Icon component instances are named "Icon/<name>", matching the sl-icon `name` attribute directly.
const icon = instance.getInstanceSwap('Icon');
const iconName = icon && icon.type === 'INSTANCE' ? icon.name.replace(/^Icon\//, '') : 'gear';

export default {
  example: figma.html`<sl-icon-button name="${iconName}" label="Settings" variant="${variant}"${filled ? ' filled' : ''}${disabled ? ' disabled' : ''}${fontSize ? figma.html` style="font-size: ${fontSize};"` : ''}></sl-icon-button>`,
  imports: ["import 'src/components/icon-button/icon-button.js'"],
  id: 'icon-button',
  metadata: { nestable: true }
};
