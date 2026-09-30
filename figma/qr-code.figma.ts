// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=71-2
// source=src/components/qr-code/qr-code.component.ts
// component=SlQrCode
import figma from 'figma';
const instance = figma.selectedInstance;

export default {
  example: figma.html`<sl-qr-code value="https://www.saipem.com" label="Scan this code to visit Saipem"></sl-qr-code>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/qr-code/qr-code.js'"],
  id: 'qr-code',
  metadata: { nestable: true }
};
