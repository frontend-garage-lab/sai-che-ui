// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=53-87
// source=src/components/card/card.component.ts
// component=SlCard
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

const hasHeader = instance.getEnum('Header', { true: true, false: false });
const hasFooter = instance.getEnum('Footer', { true: true, false: false });
const header = hasHeader ? figma.html`\n  <div slot="header">${text('Card header')}</div>` : '';
const footer = hasFooter ? figma.html`\n  <div slot="footer">${text('Footer content')}</div>` : '';

const image = instance.getInstanceSwap('Image');
let imageCode;
if (image && image.type === 'INSTANCE') {
  imageCode = image.executeTemplate().example;
}

const body = instance.getSlot('Body');

export default {
  example: figma.html`<sl-card>${imageCode ? figma.html`\n  <span slot="image">${imageCode}</span>` : ''}${header}
  ${body}${footer}
</sl-card>`,
  imports: ["import 'src/components/card/card.js'"],
  id: 'card',
  metadata: { nestable: true }
};
