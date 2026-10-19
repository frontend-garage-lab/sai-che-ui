// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=396-1722
// source=src/components/detail-panel/detail-panel.component.ts
// component=SlDetailPanel
import figma from 'figma';
const instance = figma.selectedInstance;

const titleLayer = instance.findText('Title');
const title = titleLayer.type === 'TEXT' ? titleLayer.textContent : '';
const metaLayer = instance.findText('Meta');
const showMeta = instance.getBoolean('Show Meta');
const meta = showMeta && metaLayer.type === 'TEXT' ? metaLayer.textContent : '';
const showTitleIcon = instance.getBoolean('Title Icon');
const titleIcon = showTitleIcon ? instance.getInstanceSwap('Title Icon Type') : null;
let titleIconCode;
if (titleIcon && titleIcon.type === 'INSTANCE') {
  titleIconCode = titleIcon.executeTemplate().example;
}
const actions = instance.getSlot('Actions');
const body = instance.getSlot('Body');

// The Figma component is always drawn as a self-contained block (outline on every side), which is what
// `contained` renders in code; the start-border-only look is the code default for sidebars attached to the page edge.
export default {
  example: figma.html`<sl-detail-panel contained>
  <span slot="label">${titleIconCode ? titleIconCode : ''}${title}</span>
  ${meta ? figma.html`<span slot="meta">${meta}</span>` : ''}
  ${actions ? figma.html`<span slot="actions" style="display: contents">${actions}</span>` : ''}
  ${body}
</sl-detail-panel>`,
  imports: ["import 'src/components/detail-panel/detail-panel.js'"],
  id: 'detail-panel',
  metadata: { nestable: true }
};
