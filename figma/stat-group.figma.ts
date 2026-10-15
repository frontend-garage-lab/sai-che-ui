// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=840-91
// source=src/components/stat-group/stat-group.component.ts
// component=SlStatGroup
import figma from 'figma';
const instance = figma.selectedInstance;

// The Stat Group is a wrapping row of real "Stat" instances; render each one through its own Code Connect
// template, interpolated individually (not .map().join()), as the Tab Group and Dropdown mappings do.
const stats = instance.findConnectedInstances(() => true);
const stat1 = stats[0] && stats[0].type === 'INSTANCE' ? stats[0].executeTemplate().example : '';
const stat2 = stats[1] && stats[1].type === 'INSTANCE' ? stats[1].executeTemplate().example : '';
const stat3 = stats[2] && stats[2].type === 'INSTANCE' ? stats[2].executeTemplate().example : '';
const stat4 = stats[3] && stats[3].type === 'INSTANCE' ? stats[3].executeTemplate().example : '';
const stat5 = stats[4] && stats[4].type === 'INSTANCE' ? stats[4].executeTemplate().example : '';
const stat6 = stats[5] && stats[5].type === 'INSTANCE' ? stats[5].executeTemplate().example : '';

export default {
  // `label` names the filter for screen readers and is not drawn, so it has no Figma layer; `value` (the selected
  // stat) and `required` (a stat must stay selected) are runtime state, not design properties.
  example: figma.html`<sl-stat-group label="Filter by status">
  ${stat1}
  ${stat2}
  ${stat3}
  ${stat4}
  ${stat5}
  ${stat6}
</sl-stat-group>`,
  imports: ["import 'src/components/stat-group/stat-group.js'", "import 'src/components/stat/stat.js'"],
  id: 'stat-group',
  metadata: { nestable: false }
};
