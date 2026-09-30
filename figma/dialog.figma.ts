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

const hasFooter = instance.getEnum('Footer', { true: true, false: false });
const footer = hasFooter
  ? figma.html`\n  <sl-button slot="footer">${text('Cancel')}</sl-button>\n  <sl-button slot="footer" variant="primary">${text('Confirm')}</sl-button>`
  : '';

export default {
  example: figma.html`<sl-dialog label="${text('Dialog title')}" open>
  ${text('This dialog body can contain any content, such as a form or a confirmation message.')}${footer}
</sl-dialog>`,
  imports: [
    "import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'",
    "import '@shoelace-style/shoelace/dist/components/button/button.js'"
  ],
  id: 'dialog',
  metadata: { nestable: false }
};
