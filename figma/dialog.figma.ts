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
// The footer is the `Footer Content` slot: whatever Buttons it holds become the dialog's footer.
const footer = hasFooter ? figma.html`\n  <div slot="footer">${instance.getSlot('Footer Content')}</div>` : '';

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
  imports: ["import 'src/components/dialog/dialog.js'", "import 'src/components/button/button.js'"],
  id: 'dialog',
  metadata: { nestable: false }
};
