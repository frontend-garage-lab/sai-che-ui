// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=63-2
// source=src/components/menu-label/menu-label.component.ts
// component=SlMenuLabel
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

export default {
  example: figma.html`<sl-menu-label>${text('SECTION LABEL')}</sl-menu-label>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/menu-label/menu-label.js'"],
  id: 'menu-label',
  metadata: { nestable: true }
};
