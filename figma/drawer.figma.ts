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

const body = instance.getSlot('Body');

export default {
  example: figma.html`<sl-drawer${hasHeader ? ` label="${label}"` : ' no-header'} open>
  ${headerActionsCode ? figma.html`<span slot="header-actions">${headerActionsCode}</span>\n  ` : ''}${body}${footer}
</sl-drawer>`,
  imports: ["import 'src/components/drawer/drawer.js'", "import 'src/components/button/button.js'"],
  id: 'drawer',
  metadata: { nestable: false }
};
