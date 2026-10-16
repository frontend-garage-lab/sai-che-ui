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
const body = open ? instance.getSlot('Body') : '';

export default {
  example: figma.html`<sl-details summary="${text('Document metadata')}"${open ? ' open' : ''}${disabled ? ' disabled' : ''}>
  ${body}
</sl-details>`,
  imports: ["import 'src/components/details/details.js'"],
  id: 'details',
  metadata: { nestable: true }
};
