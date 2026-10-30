// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=54-21
// source=src/components/dialog/dialog.component.ts
// component=SlDialog
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
// `Variant` drives the status icon before the title; it only exists with `Header=true`, and Default emits nothing.
const variant = instance.getEnum('Variant', { Default: '', Success: 'success', Warning: 'warning', Danger: 'danger' });
const variantAttr = hasHeader && variant ? ` variant="${variant}"` : '';
// The footer is the `Footer Content` slot: whatever Buttons it holds become the dialog's footer.
// `getSlot` alone only shows a collapsed `<Slot />` placeholder for the slot node, which has no Code Connect to open:
// the connected instances placed directly in the slot are rendered through their own templates instead, interpolated
// individually (not .map().join()), and the slot placeholder stays as the fallback for free-form content.
const buttonSlot = hasFooter ? instance.getSlot('Footer Content') : undefined;
const buttonList = buttonSlot ? buttonSlot.connectedInstances : [];
const buttonAt = (index: number) =>
  buttonList[index] ? figma.html`\n    ${buttonList[index].executeTemplate().example}` : '';
const button1 = buttonAt(0);
const button2 = buttonAt(1);
const button3 = buttonAt(2);
const buttonFallback = buttonList.length || !buttonSlot ? '' : figma.html`\n    ${buttonSlot}`;
const footer = hasFooter
  ? figma.html`\n  <div slot="footer">${button1}${button2}${button3}${buttonFallback}\n  </div>`
  : '';

// `Header Actions` is a BOOLEAN that shows the `header-actions` instance (an Icon Button), not an instance swap.
const headerActions = instance.getBoolean('Header Actions') ? instance.findInstance('header-actions') : undefined;
let headerActionsCode;
if (hasHeader && headerActions && headerActions.type === 'INSTANCE') {
  headerActionsCode = headerActions.executeTemplate().example;
}

// Free-form slot: the connected instances found under `Body` (e.g. a Table, a Select) are rendered through their own
// templates so they show up in the snippet, interpolated individually (not .map().join()); when there are none, the
// slot placeholder is kept.
const bodySlot = instance.getSlot('Body');
const bodyInstances = instance.findConnectedInstances(() => true, { path: ['Body'] });
const bodyAt = (index: number) =>
  bodyInstances[index] && bodyInstances[index].type === 'INSTANCE'
    ? figma.html`${index ? '\n  ' : ''}${bodyInstances[index].executeTemplate().example}`
    : '';
// A body made only of text (the default "This dialog body can contain…" layer) has no instance to render: `getSlot`
// would print just the slot name, so the text layers found under `Body` are emitted as the body content instead.
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

// No `open` attribute: showing the dialog is behaviour (`dialog.show()`), not a design state, and every docs example omits it.
export default {
  example: figma.html`<sl-dialog${hasHeader ? ` label="${text('Dialog title')}"` : ' no-header'}${variantAttr}>
  ${headerActionsCode ? figma.html`<span slot="header-actions">${headerActionsCode}</span>\n  ` : ''}${body}${footer}
</sl-dialog>`,
  imports: [
    "import 'src/components/dialog/dialog.js'",
    "import 'src/components/button/button.js'",
    "import 'src/components/icon-button/icon-button.js'",
    "import 'src/components/icon/icon.js'"
  ],
  id: 'dialog',
  metadata: { nestable: false }
};
