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
// Footer Content slot: footer markup (e.g. a subheading and a menu), only variants with a footer have it.
const footerContent = hasFooter ? instance.getSlot('Footer Content') : null;
const footer = hasFooter ? figma.html`\n  <div slot="footer">${footerContent ? footerContent : ''}</div>` : '';

// `Image` is a BOOLEAN that shows the `card__image` placeholder (a plain rectangle, not an instance): the code side is
// an <img> in the `image` slot, whose `src` comes from the application.
const hasImage = instance.getBoolean('Image');

// Free-form slot: the connected instances found under `Body` (e.g. a Table, a Select) are rendered through their own
// templates so they show up in the snippet, interpolated individually (not .map().join()); when there are none, the
// slot placeholder is kept.
const bodySlot = instance.getSlot('Body');
const bodyInstances = instance.findConnectedInstances(() => true, { path: ['Body'] });
const bodyAt = (index: number) =>
  bodyInstances[index] && bodyInstances[index].type === 'INSTANCE'
    ? figma.html`${index ? '\n  ' : ''}${bodyInstances[index].executeTemplate().example}`
    : '';
// A body made only of text has no instance to render and `getSlot` would print just the slot name: the text layers
// found under `Body` are emitted as the body content instead.
const bodyTexts = bodyInstances.length
  ? []
  : instance
      .findLayers(node => node.type === 'TEXT', { path: ['Body'] })
      .flatMap(node => (node.type === 'TEXT' ? [node.textContent] : []));
const body = bodyInstances.length
  ? figma.html`${bodyAt(0)}${bodyAt(1)}${bodyAt(2)}${bodyAt(3)}${bodyAt(4)}${bodyAt(5)}${bodyAt(6)}${bodyAt(7)}`
  : bodyTexts.length
    ? bodyTexts.join('\n  ')
    : bodySlot;

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
  example: figma.html`<sl-card${variant ? ` variant="${variant}"` : ''}>${hasImage ? figma.html`\n  <img slot="image" src="…" alt="" />` : ''}${header}
  ${body}${footer}
</sl-card>`,
  imports: ["import 'src/components/card/card.js'"],
  id: 'card',
  metadata: { nestable: true }
};
