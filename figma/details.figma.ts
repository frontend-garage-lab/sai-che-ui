// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=64-15
// source=src/components/details/details.component.ts
// component=SlDetails
import figma from 'figma';
const instance = figma.selectedInstance;

// Text layers are named after their default content, which differs between variants.
function text(...layerNames: string[]) {
  for (const name of layerNames) {
    const layer = instance.findText(name);
    if (layer.type === 'TEXT') return layer.textContent;
  }
  return '';
}

const open = instance.getEnum('State', { collapsed: false, expanded: true, disabled: false });
const disabled = instance.getEnum('State', { collapsed: false, expanded: false, disabled: true });

// The expanded body is a slot: any content can be dropped into it (e.g. an sl-description-list).
// Free-form slot: the connected instances found under `Body` (e.g. a Table, a Select) are rendered through their own
// templates so they show up in the snippet, interpolated individually (not .map().join()); when there are none, the
// slot placeholder is kept.
const bodySlot = open ? instance.getSlot('Body') : '';
const bodyInstances = open ? instance.findConnectedInstances(() => true, { path: ['Body'] }) : [];
const bodyAt = (index: number) =>
  bodyInstances[index] && bodyInstances[index].type === 'INSTANCE'
    ? figma.html`${index ? '\n  ' : ''}${bodyInstances[index].executeTemplate().example}`
    : '';
const body = bodyInstances.length
  ? figma.html`${bodyAt(0)}${bodyAt(1)}${bodyAt(2)}${bodyAt(3)}${bodyAt(4)}${bodyAt(5)}${bodyAt(6)}${bodyAt(7)}`
  : bodySlot;

export default {
  example: figma.html`<sl-details summary="${text('Document metadata')}"${open ? ' open' : ''}${disabled ? ' disabled' : ''}>
  ${body}
</sl-details>`,
  imports: ["import 'src/components/details/details.js'"],
  id: 'details',
  metadata: { nestable: true }
};
