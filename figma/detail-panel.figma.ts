// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=396-1722
// source=src/components/detail-panel/detail-panel.component.ts
// component=SlDetailPanel
import figma from 'figma';
const instance = figma.selectedInstance;

const titleLayer = instance.findText('Title');
const title = titleLayer.type === 'TEXT' ? titleLayer.textContent : '';
const metaLayer = instance.findText('Meta');
const meta = metaLayer.type === 'TEXT' ? metaLayer.textContent : '';
const actions = instance.getSlot('Actions');
const body = instance.getSlot('Body');

export default {
  example: figma.html`<sl-detail-panel>
  <span slot="label">${title}</span>
  <span slot="meta">${meta}</span>
  ${actions}
  ${body}
</sl-detail-panel>`,
  imports: ["import 'src/components/detail-panel/detail-panel.js'"],
  id: 'detail-panel',
  metadata: { nestable: true }
};
