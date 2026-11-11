// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=47-10
// source=src/components/icon-button/icon-button.component.ts
// component=SlIconButton
import figma from 'figma';
import { MISSING_ICON_NAME, resolveIconName } from './icon-name';
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
// Size ↔ `size` attribute (theme tokens --sl-icon-button-font-size-*); medium = no attribute (inherits font-size).
const size = instance.getEnum('Size', { small: 'small', medium: '', large: 'large', 'x-large': 'x-large' });

const icon = instance.getInstanceSwap('Icon');
// A missing or detached icon (not an instance) has no name to read: placeholder, so it shows up in the snippet.
const iconName = icon && icon.type === 'INSTANCE' ? resolveIconName(icon) : MISSING_ICON_NAME;
// A layer renamed by the designer (e.g. "Add selected") is the accessible label; the default layer name keeps "Settings".
const label = instance.name && instance.name !== 'Icon Button' ? instance.name : 'Settings';

export default {
  example: figma.html`<sl-icon-button name="${iconName}" label="${label}" variant="${variant}"${filled ? ' filled' : ''}${disabled ? ' disabled' : ''}${size ? figma.html` size="${size}"` : ''}></sl-icon-button>`,
  imports: ["import 'src/components/icon-button/icon-button.js'"],
  id: 'icon-button',
  metadata: { nestable: true }
};
