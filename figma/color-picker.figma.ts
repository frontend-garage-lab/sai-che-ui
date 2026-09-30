// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=66-2
// source=src/components/color-picker/color-picker.component.ts
// component=SlColorPicker
import figma from 'figma';
const instance = figma.selectedInstance;

export default {
  example: figma.html`<sl-color-picker inline label="Select a color"></sl-color-picker>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/color-picker/color-picker.js'"],
  id: 'color-picker',
  metadata: { nestable: true }
};
