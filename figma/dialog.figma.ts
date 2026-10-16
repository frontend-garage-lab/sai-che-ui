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
// The footer holds two real "Button" instances named "Cancel" and "Confirm"; the label is the text layer
// of each Button (the layer is named after the Button's default content, whatever the override).
function buttonLabel(instanceName: string) {
  const button = instance.findInstance(instanceName);
  if (button.type !== 'INSTANCE') return '';
  const layer = button.findText('Button');
  return layer.type === 'TEXT' ? layer.textContent : '';
}
const footer = hasFooter
  ? figma.html`\n  <sl-button slot="footer">${buttonLabel('Cancel')}</sl-button>\n  <sl-button slot="footer" variant="primary">${buttonLabel('Confirm')}</sl-button>`
  : '';

const headerActions = instance.getInstanceSwap('Header Actions');
let headerActionsCode;
if (hasHeader && headerActions && headerActions.type === 'INSTANCE') {
  headerActionsCode = headerActions.executeTemplate().example;
}

const body = instance.getSlot('Body');

export default {
  example: figma.html`<sl-dialog${hasHeader ? ` label="${text('Dialog title')}"` : ' no-header'} open>
  ${headerActionsCode ? figma.html`<span slot="header-actions">${headerActionsCode}</span>\n  ` : ''}${body}${footer}
</sl-dialog>`,
  imports: [
    "import 'src/components/dialog/dialog.js'",
    "import 'src/components/button/button.js'"
  ],
  id: 'dialog',
  metadata: { nestable: false }
};
