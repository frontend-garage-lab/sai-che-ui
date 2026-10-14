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

export default {
  example: figma.html`<sl-tab-group placement="${placement}">
  ${tab1}
  ${tab2}
  ${tab3}
  ${tab4}

  <!-- one <sl-tab-panel> per <sl-tab>, matched by panel name -->
</sl-tab-group>`,
  imports: ["import 'src/components/tab-group/tab-group.js'", "import 'src/components/tab-panel/tab-panel.js'"],
  id: 'tab-group',
  metadata: { nestable: false }
};
