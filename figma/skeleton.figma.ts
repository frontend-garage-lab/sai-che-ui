// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=60-19
// source=src/components/skeleton/skeleton.component.ts
// component=SlSkeleton
import figma from 'figma';
const instance = figma.selectedInstance;

export default {
  example: figma.html`<div style="display: flex; gap: 0.75rem;">
  <sl-skeleton style="width: 40px; height: 40px; --border-radius: 50%;"></sl-skeleton>
  <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
    <sl-skeleton style="width: 70%;"></sl-skeleton>
    <sl-skeleton></sl-skeleton>
    <sl-skeleton style="width: 80%;"></sl-skeleton>
  </div>
</div>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js'"],
  id: 'skeleton',
  metadata: { nestable: false }
};
