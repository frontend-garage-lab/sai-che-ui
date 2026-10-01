// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=33-51
// source=src/components/tag/tag.component.ts
// component=SlTag
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

const variant = instance.getEnum('Variant', {
  primary: 'primary',
  accent: 'accent',
  success: 'success',
  neutral: 'neutral',
  warning: 'warning',
  danger: 'danger'
});

export default {
  example: figma.html`<sl-tag variant="${variant}" pill>${text('Tag')}</sl-tag>`,
  imports: ["import 'src/components/tag/tag.js'"],
  id: 'tag-pill',
  metadata: { nestable: true }
};
