// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=65-37
// source=src/components/drawer/drawer.component.ts
// component=SlDrawer
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
  ? figma.html`\n  <sl-button slot="footer">${text('Cancel')}</sl-button>\n  <sl-button slot="footer" variant="primary">${text('Apply')}</sl-button>`
  : '';

export default {
  example: figma.html`<sl-drawer label="${text('Drawer title')}" open>
  ${text('This drawer slides in from the edge and can host filters, forms, or document previews.')}${footer}
</sl-drawer>`,
  imports: [
    "import 'src/components/drawer/drawer.js'",
    "import 'src/components/button/button.js'"
  ],
  id: 'drawer',
  metadata: { nestable: false }
};
