// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=65-37
// source=src/components/drawer/drawer.component.ts
// component=SlDrawer
import figma from 'figma';
const instance = figma.selectedInstance;

const hasHeader = instance.getEnum('Header', { true: true, false: false });
const hasFooter = instance.getEnum('Footer', { true: true, false: false });
const title = instance.findText('Drawer title');
const label = title.type === 'TEXT' ? title.textContent : '';

// The footer holds two real "Button" instances named "Cancel" and "Apply"; the label is the text layer of each
// Button (the layer is named after the Button's default content, whatever the override).
function buttonLabel(instanceName: string) {
  const button = instance.findInstance(instanceName);
  if (button.type !== 'INSTANCE') return '';
  const layer = button.findText('Button');
  return layer.type === 'TEXT' ? layer.textContent : '';
}
const footer = hasFooter
  ? figma.html`\n  <sl-button slot="footer" variant="text">${buttonLabel('Cancel')}</sl-button>\n  <sl-button slot="footer" variant="primary">${buttonLabel('Apply')}</sl-button>`
  : '';

// `Header Actions` shows an extra Icon Button next to the close button (the `header-actions` slot).
const showHeaderActions = hasHeader && instance.getBoolean('Header Actions');
const headerActions = showHeaderActions ? instance.findInstance('header-actions') : undefined;
const headerActionsCode =
  headerActions && headerActions.type === 'INSTANCE' ? headerActions.executeTemplate().example : undefined;

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

// No `open` attribute: showing the drawer is behaviour (`drawer.show()`), not a design state, and every docs example omits it.
export default {
  example: figma.html`<sl-drawer${hasHeader ? ` label="${label}"` : ' no-header'}>
  ${headerActionsCode ? figma.html`<span slot="header-actions">${headerActionsCode}</span>\n  ` : ''}${body}${footer}
</sl-drawer>`,
  imports: ["import 'src/components/drawer/drawer.js'", "import 'src/components/button/button.js'"],
  id: 'drawer',
  metadata: { nestable: false }
};
