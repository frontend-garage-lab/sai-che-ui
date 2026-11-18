// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1647-60
// source=src/components/legend/legend.component.ts
// component=SlLegend
import figma from 'figma';
const instance = figma.selectedInstance;

const layout = instance.getEnum('Layout', { inline: '', list: 'list' });
const columns = instance.getEnum('Columns', { '1': '', '2': '2' });
const showLabel = instance.getBoolean('Show Label');
const label = showLabel ? instance.getString('Label') : '';
// Icon slot: an sl-icon before the legend, e.g. info-circle to mark it as a note.
const showIcon = instance.getBoolean('Show Icon');
const icon = showIcon ? instance.getInstanceSwap('Icon') : null;
let iconCode;
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example;
}

// Items slot: Legend Item instances, each rendered through its own template (same pattern as sl-menu).
const itemSlot = instance.getSlot('Items');
const itemList = itemSlot ? itemSlot.connectedInstances : [];
const itemAt = (index: number) => (itemList[index] ? figma.html`\n  ${itemList[index].executeTemplate().example}` : '');
const item1 = itemAt(0);
const item2 = itemAt(1);
const item3 = itemAt(2);
const item4 = itemAt(3);
const item5 = itemAt(4);
const item6 = itemAt(5);
const item7 = itemAt(6);
const item8 = itemAt(7);
const itemFallback = itemList.length || !itemSlot ? '' : figma.html`\n  ${itemSlot}`;

export default {
  example: figma.html`<sl-legend${label ? ` label="${label}"` : ''}${layout ? ` layout="${layout}"` : ''}${layout && columns ? ` columns="${columns}"` : ''}>${iconCode ? figma.html`\n  <span slot="icon">${iconCode}</span>` : ''}${item1}${item2}${item3}${item4}${item5}${item6}${item7}${item8}${itemFallback}
</sl-legend>`,
  imports: [
    "import 'src/components/legend/legend.js'",
    "import 'src/components/legend-item/legend-item.js'",
    "import 'src/components/icon/icon.js'"
  ],
  id: 'legend',
  metadata: { nestable: true }
};
