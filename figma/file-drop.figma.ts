// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=41-12
// source=src/components/file-drop/file-drop.component.ts
// component=SlFileDrop
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

export default {
  example: figma.html`<sl-file-drop hint="${text('PDF, DOCX up to 10MB')}"></sl-file-drop>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/file-drop/file-drop.js'"],
  id: 'file-drop',
  metadata: { nestable: true }
};
