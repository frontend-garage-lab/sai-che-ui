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

export default {
  example: figma.html`<sl-avatar shape="${shape}" initials="${text('GD')}"></sl-avatar>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/avatar/avatar.js'"],
  id: 'avatar',
  metadata: { nestable: true }
};
