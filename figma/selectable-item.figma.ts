// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=393-28
// source=src/components/selectable-item/selectable-item.component.ts
// component=SlSelectableItem
import figma from 'figma';
const instance = figma.selectedInstance;

const label = instance.getString('Label');
const meta = instance.getString('Meta');
const checked = instance.getEnum('State', { default: false, checked: true, disabled: false });
const disabled = instance.getEnum('State', { default: false, checked: false, disabled: true });

export default {
  example: figma.html`<sl-selectable-item value="${label.toLowerCase().replace(/\s+/g, '-')}"${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}>
  ${label}
  <span slot="meta">${meta}</span>
</sl-selectable-item>`,
  imports: ["import 'src/components/selectable-item/selectable-item.js'"],
  id: 'selectable-item',
  metadata: { nestable: true }
};
