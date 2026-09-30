// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=65-97
// source=src/components/split-panel/split-panel.component.ts
// component=SlSplitPanel
import figma from 'figma';
const instance = figma.selectedInstance;

export default {
  example: figma.html`<sl-split-panel>
  <div slot="start"><!-- start panel --></div>
  <div slot="end"><!-- end panel --></div>
</sl-split-panel>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js'"],
  id: 'split-panel',
  metadata: { nestable: false }
};
