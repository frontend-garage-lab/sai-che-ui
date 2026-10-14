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

const showPrefix = instance.getBoolean('Show Prefix');
const prefix = showPrefix ? instance.getInstanceSwap('Prefix') : null;
let prefixCode;
if (prefix && prefix.type === 'INSTANCE') {
  prefixCode = prefix.executeTemplate().example;
}

const showSuffix = instance.getBoolean('Show Suffix');
const suffix = showSuffix ? instance.getInstanceSwap('Suffix') : null;
let suffixCode;
if (suffix && suffix.type === 'INSTANCE') {
  suffixCode = suffix.executeTemplate().example;
}

export default {
  example: figma.html`<sl-breadcrumb-item${isLink ? ' href="#"' : ''}>${prefixCode ? figma.html`<span slot="prefix">${prefixCode}</span>` : ''}${text('Documents', 'Contract_001.pdf')}${suffixCode ? figma.html`<span slot="suffix">${suffixCode}</span>` : ''}</sl-breadcrumb-item>`,
  imports: ["import 'src/components/breadcrumb-item/breadcrumb-item.js'"],
  id: 'breadcrumb-item',
  metadata: { nestable: true }
};
