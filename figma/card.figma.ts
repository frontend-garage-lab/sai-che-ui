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
// Optional leading icon in the header (Header Icon + Header Icon Type); only variants with a header have it.
const showHeaderIcon = hasHeader ? instance.getBoolean('Header Icon') : false;
const headerIcon = showHeaderIcon ? instance.getInstanceSwap('Header Icon Type') : null;
let headerIconCode;
if (headerIcon && headerIcon.type === 'INSTANCE') {
  headerIconCode = headerIcon.executeTemplate().example;
}
// Header Actions slot: content on the right of the header (e.g. a text button), inside the same header slot.
const headerActions = hasHeader ? instance.getSlot('Header Actions') : null;
const header = hasHeader
  ? figma.html`\n  <div slot="header">${headerIconCode ? headerIconCode : ''}${text('Card header')}${headerActions ? headerActions : ''}</div>`
  : '';
const footer = hasFooter ? figma.html`\n  <div slot="footer">${text('Footer content')}</div>` : '';

const image = instance.getInstanceSwap('Image');
let imageCode;
if (image && image.type === 'INSTANCE') {
  imageCode = image.executeTemplate().example;
}

const body = instance.getSlot('Body');

// Accent: colored top edge, its color is the Variant of the nested Card Accent instance.
const accent = instance.getBoolean('Accent') ? instance.findInstance('card-accent') : null;
const variant =
  accent && accent.type === 'INSTANCE'
    ? accent.getEnum('Variant', {
        primary: 'primary',
        accent: 'accent',
        success: 'success',
        neutral: 'neutral',
        warning: 'warning',
        danger: 'danger'
      })
    : '';

export default {
  example: figma.html`<sl-card${variant ? ` variant="${variant}"` : ''}>${imageCode ? figma.html`\n  <span slot="image">${imageCode}</span>` : ''}${header}
  ${body}${footer}
</sl-card>`,
  imports: ["import 'src/components/card/card.js'"],
  id: 'card',
  metadata: { nestable: true }
};
