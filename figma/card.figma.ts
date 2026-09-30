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

export default {
  example: figma.html`<sl-card>${header}
  ${text('This is the card body. It can contain any content you like.')}${footer}
</sl-card>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/card/card.js'"],
  id: 'card',
  metadata: { nestable: true }
};
