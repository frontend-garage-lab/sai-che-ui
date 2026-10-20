// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1021-10
// source=src/components/skeleton/skeleton.component.ts
// component=SlSkeleton
import figma from 'figma';
const instance = figma.selectedInstance;

const effect = instance.getEnum('Effect', { none: '', pulse: 'pulse', sheen: 'sheen' });

export default {
  example: effect
    ? figma.html`<sl-skeleton effect="${effect}"></sl-skeleton>`
    : figma.html`<sl-skeleton></sl-skeleton>`,
  imports: ["import 'src/components/skeleton/skeleton.js'"],
  id: 'skeleton',
  metadata: { nestable: true }
};
