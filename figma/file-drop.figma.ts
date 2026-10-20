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

const showLabel = instance.getBoolean('Show Label');
const label = showLabel ? text('label') : '';
const disabled = instance.getEnum('State', { default: false, dragging: false, disabled: true });

export default {
  example: figma.html`<sl-file-drop hint="${text('PDF, DOCX up to 10MB')}"${label ? ` label="${label}"` : ''}${disabled ? ' disabled' : ''}></sl-file-drop>`,
  imports: ["import 'src/components/file-drop/file-drop.js'"],
  id: 'file-drop',
  metadata: { nestable: true }
};
