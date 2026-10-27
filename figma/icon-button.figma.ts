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
// Size ↔ `size` attribute (theme tokens --sl-icon-button-font-size-*); medium = no attribute (inherits font-size).
const size = instance.getEnum('Size', { small: 'small', medium: '', large: 'large', 'x-large': 'x-large' });

// Icon component instances are named "Icon/<name>", matching the sl-icon `name` attribute directly.
const icon = instance.getInstanceSwap('Icon');
// Consumer files rename the swapped layer (e.g. "icon"): when it is not "Icon/<name>", the name is read from the icon's own
// Code Connect snippet (`<sl-icon name="…">`).
function resolveIconName() {
  if (!icon || icon.type !== 'INSTANCE') return 'gear';
  if (/^Icon\//.test(icon.name)) return icon.name.replace(/^Icon\//, '');
  const match = /name=\\?"([a-z0-9-]+)\\?"/.exec(JSON.stringify(icon.executeTemplate().example));
  return match ? match[1] : icon.name;
}
const iconName = resolveIconName();
// A layer renamed by the designer (e.g. "Add selected") is the accessible label; the default layer name keeps "Settings".
const label = instance.name && instance.name !== 'Icon Button' ? instance.name : 'Settings';

export default {
  example: figma.html`<sl-icon-button name="${iconName}" label="${label}" variant="${variant}"${filled ? ' filled' : ''}${disabled ? ' disabled' : ''}${size ? figma.html` size="${size}"` : ''}></sl-icon-button>`,
  imports: ["import 'src/components/icon-button/icon-button.js'"],
  id: 'icon-button',
  metadata: { nestable: true }
};
