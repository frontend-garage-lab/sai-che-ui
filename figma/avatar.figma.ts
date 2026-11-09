// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=59-8
// source=src/components/avatar/avatar.component.ts
// component=SlAvatar
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

const shape = instance.getEnum('Shape', { circle: 'circle', rounded: 'rounded', square: 'square' });
// large is the default size, so it doesn't need the attribute
const size = instance.getEnum('Size', { small: ' size="small"', medium: ' size="medium"', large: '' });
const type = instance.getEnum('Type', { initials: 'initials', icon: 'icon' });
// Tinted colour scheme (default = solid neutral avatar, no attribute). Figma has primary and neutral only.
const variant = instance.getEnum('Variant', {
  default: '',
  primary: ' variant="primary"',
  neutral: ' variant="neutral"'
});
// Without initials sl-avatar shows the `icon` slot, person-fill by default (same as the Figma default).
const icon = instance.getInstanceSwap('Icon');
const iconName = icon && icon.type === 'INSTANCE' ? icon.name.replace(/^Icon\//, '') : 'person-fill';

export default {
  example:
    type === 'initials'
      ? figma.html`<sl-avatar${size} shape="${shape}"${variant} initials="${text('GD')}"></sl-avatar>`
      : iconName === 'person-fill'
        ? figma.html`<sl-avatar${size} shape="${shape}"${variant}></sl-avatar>`
        : figma.html`<sl-avatar${size} shape="${shape}"${variant}><sl-icon slot="icon" name="${iconName}"></sl-icon></sl-avatar>`,
  imports: ["import 'src/components/avatar/avatar.js'"],
  id: 'avatar',
  metadata: { nestable: true }
};
