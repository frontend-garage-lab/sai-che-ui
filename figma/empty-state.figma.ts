// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=388-3
// source=src/components/empty-state/empty-state.component.ts
// component=SlEmptyState
import figma from 'figma';
const instance = figma.selectedInstance;

const title = instance.getString('Title');
const description = instance.getString('Description');

const icon = instance.getInstanceSwap('Icon');
let iconCode;
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example;
}

const action = instance.getInstanceSwap('Action');
let actionCode;
if (action && action.type === 'INSTANCE') {
  actionCode = action.executeTemplate().example;
}

export default {
  example: figma.html`<sl-empty-state title-text="${title}" description="${description}">
  ${iconCode ? figma.html`<span slot="icon">${iconCode}</span>\n  ` : ''}${actionCode ? figma.html`<span slot="action">${actionCode}</span>` : ''}
</sl-empty-state>`,
  imports: ["import 'src/components/empty-state/empty-state.js'"],
  id: 'empty-state',
  metadata: { nestable: true }
};
