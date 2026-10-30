// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=354-74
// source=src/components/tab-group/tab-group.component.ts
// component=SlTabGroup
import figma from 'figma';
const instance = figma.selectedInstance;

const placement = instance.getEnum('Placement', { top: 'top', bottom: 'bottom', start: 'start', end: 'end' });

// Nav tabs are real "Tab" instances nested inside this Tab Group's Nav; render each via its own
// Code Connect template, interpolated individually (not .map().join()).
// The scroll-control Icon Buttons (layers "scroll-button--start/--end") are part of sl-tab-group itself, not tabs.
const tabs = instance.findConnectedInstances(node => !node.name.startsWith('scroll-button'));
// Seven Tab instances live in Nav: tabs 5–7 are shown by the `Tab 5` / `Tab 6` / `Tab 7` booleans (off by default),
// so a tab is rendered only when its boolean is on.
const extra = [
  true,
  true,
  true,
  true,
  instance.getBoolean('Tab 5'),
  instance.getBoolean('Tab 6'),
  instance.getBoolean('Tab 7')
];
const tabAt = (index: number) => {
  const tab = tabs[index];
  return extra[index] && tab && tab.type === 'INSTANCE' ? tab.executeTemplate().example : '';
};
const tab1 = tabAt(0);
const tab2 = tabAt(1);
const tab3 = tabAt(2);
const tab4 = tabAt(3);
const tab5 = tabAt(4);
const tab6 = tabAt(5);
const tab7 = tabAt(6);

// One <sl-tab-panel> per <sl-tab>: the panel name is the slug of the tab label, the same value the Tab mapping
// writes in its `panel` attribute. The panel content is the page's own, so only the shell is emitted.
function panelFor(tab: (typeof tabs)[number] | undefined) {
  if (!tab || tab.type !== 'INSTANCE') return '';
  const labelLayer = tab.findText('Tab label');
  if (labelLayer.type !== 'TEXT') return '';
  const name = labelLayer.textContent.toLowerCase().replace(/\s+/g, '-');
  return figma.html`<sl-tab-panel name="${name}"><!-- ${labelLayer.textContent} content --></sl-tab-panel>`;
}
const panel1 = panelFor(tabs[0]);
const panel2 = panelFor(tabs[1]);
const panel3 = panelFor(tabs[2]);
const panel4 = panelFor(tabs[3]);
const panel5 = extra[4] ? panelFor(tabs[4]) : '';
const panel6 = extra[5] ? panelFor(tabs[5]) : '';
const panel7 = extra[6] ? panelFor(tabs[6]) : '';

export default {
  example: figma.html`<sl-tab-group placement="${placement}">
  ${tab1}
  ${tab2}
  ${tab3}
  ${tab4}
  ${tab5}
  ${tab6}
  ${tab7}

  ${panel1}
  ${panel2}
  ${panel3}
  ${panel4}
  ${panel5}
  ${panel6}
  ${panel7}
</sl-tab-group>`,
  imports: ["import 'src/components/tab-group/tab-group.js'", "import 'src/components/tab-panel/tab-panel.js'"],
  id: 'tab-group',
  metadata: { nestable: false }
};
