// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=354-74
// source=src/components/tab-group/tab-group.component.ts
// component=SlTabGroup
import figma from 'figma';
const instance = figma.selectedInstance;

const placement = instance.getEnum('Placement', { top: 'top', bottom: 'bottom', start: 'start', end: 'end' });

// Nav tabs are real "Tab" instances nested inside this Tab Group's Nav; render each via its own
// Code Connect template, interpolated individually (not .map().join()).
const tabs = instance.findConnectedInstances(() => true);
const tab1 = tabs[0] && tabs[0].type === 'INSTANCE' ? tabs[0].executeTemplate().example : '';
const tab2 = tabs[1] && tabs[1].type === 'INSTANCE' ? tabs[1].executeTemplate().example : '';
const tab3 = tabs[2] && tabs[2].type === 'INSTANCE' ? tabs[2].executeTemplate().example : '';
const tab4 = tabs[3] && tabs[3].type === 'INSTANCE' ? tabs[3].executeTemplate().example : '';

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

export default {
  example: figma.html`<sl-tab-group placement="${placement}">
  ${tab1}
  ${tab2}
  ${tab3}
  ${tab4}

  ${panel1}
  ${panel2}
  ${panel3}
  ${panel4}
</sl-tab-group>`,
  imports: ["import 'src/components/tab-group/tab-group.js'", "import 'src/components/tab-panel/tab-panel.js'"],
  id: 'tab-group',
  metadata: { nestable: false }
};
