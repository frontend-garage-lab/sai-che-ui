// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=61-33
// source=src/components/rating/rating.component.ts
// component=SlRating
import figma from 'figma';
const instance = figma.selectedInstance;

const value = instance.getEnum('Value', { '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5' });
const disabled = instance.getBoolean('Disabled');

export default {
  example: figma.html`<sl-rating label="Rating" value="${value}"${disabled ? ' disabled' : ''}></sl-rating>`,
  imports: ["import 'src/components/rating/rating.js'"],
  id: 'rating',
  metadata: { nestable: true }
};
