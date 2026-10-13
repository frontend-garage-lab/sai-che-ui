// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=661-61
// source=src/components/file-upload-item/file-upload-item.component.ts
// component=SlFileUploadItem
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

const state = instance.getEnum('State', {
  waiting: 'waiting',
  uploading: 'uploading',
  uploaded: 'uploaded',
  failed: 'failed'
});

const filename = text(
  'H10-RD-A-87166_A2_A.pdf',
  'H10-RC-B-21213_A1_R.pdf',
  'R1118111-SARC01-A.pdf',
  'H10-RC-B-21214_A1_I.pdf'
);
// The meta line bundles size/progress + status in the Figma mock (e.g. "2.4 MB · Uploaded"); the code
// component expects it verbatim in the `meta` attribute, same as the `meta` slot it maps to.
const meta = text('Waiting to upload', '45% · Uploading', '2.4 MB · Uploaded', 'Upload failed · Connection lost');

export default {
  example: figma.html`<sl-file-upload-item state="${state}" filename="${filename}" meta="${meta}"></sl-file-upload-item>`,
  imports: ["import 'src/components/file-upload-item/file-upload-item.js'"],
  id: 'file-upload-item',
  metadata: { nestable: true }
};
