// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=64-15
// source=src/components/details/details.component.ts
// component=SlDetails
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

const open = instance.getEnum('State', { collapsed: false, expanded: true });

export default {
  example: figma.html`<sl-details summary="${text('Document metadata')}"${open ? ' open' : ''}>
  ${text('Author, revision, and approval history go here.')}
</sl-details>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/details/details.js'"],
  id: 'details',
  metadata: { nestable: true }
};
