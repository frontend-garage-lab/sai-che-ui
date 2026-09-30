// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=62-41
// source=src/components/menu-item/menu-item.component.ts
// component=SlMenuItem
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

const checked = instance.getEnum('State', {
  default: false,
  hover: false,
  focus: false,
  checked: true,
  disabled: false
});
const disabled = instance.getEnum('State', {
  default: false,
  hover: false,
  focus: false,
  checked: false,
  disabled: true
});

export default {
  example: figma.html`<sl-menu-item${checked ? ' type="checkbox" checked' : ''}${disabled ? ' disabled' : ''}>${text('Menu item')}</sl-menu-item>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'"],
  id: 'menu-item',
  metadata: { nestable: true }
};
