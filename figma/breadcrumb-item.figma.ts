// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=63-47
// source=src/components/breadcrumb-item/breadcrumb-item.component.ts
// component=SlBreadcrumbItem
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

const isLink = instance.getEnum('Type', { link: true, current: false });

export default {
  example: figma.html`<sl-breadcrumb-item${isLink ? ' href="#"' : ''}>${text('Documents', 'Contract_001.pdf')}</sl-breadcrumb-item>`,
  imports: ["import 'src/components/breadcrumb-item/breadcrumb-item.js'"],
  id: 'breadcrumb-item',
  metadata: { nestable: true }
};
