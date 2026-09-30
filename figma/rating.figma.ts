// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=61-33
// source=src/components/rating/rating.component.ts
// component=SlRating
import figma from 'figma';
const instance = figma.selectedInstance;

const value = instance.getEnum('Value', { '1': '1', '3': '3', '5': '5' });

export default {
  example: figma.html`<sl-rating label="Rating" value="${value}"></sl-rating>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/rating/rating.js'"],
  id: 'rating',
  metadata: { nestable: true }
};
