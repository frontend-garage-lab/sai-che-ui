// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=65-97
// source=src/components/split-panel/split-panel.component.ts
// component=SlSplitPanel
import figma from 'figma';
const instance = figma.selectedInstance;

// Start / End slots: the content of the two panels. The Start width is the position (position-in-pixels in code).
const start = instance.getSlot('Start');
const end = instance.getSlot('End');

export default {
  example: figma.html`<sl-split-panel>
  <div slot="start">${start}</div>
  <div slot="end">${end}</div>
</sl-split-panel>`,
  imports: ["import 'src/components/split-panel/split-panel.js'"],
  id: 'split-panel',
  metadata: { nestable: false }
};
