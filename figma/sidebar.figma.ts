// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1054-349
// source=src/components/sidebar/sidebar.component.ts
// component=SlSidebar
import figma from 'figma';
const instance = figma.selectedInstance;

const collapsed = instance.getEnum('Collapsed', { true: true, false: false });
const noToggle = !instance.getBoolean('Show Toggle');
const header = instance.getBoolean('Show Header') ? instance.getSlot('Header') : '';
const footer = instance.getBoolean('Show Footer') ? instance.getSlot('Footer') : '';

// The Groups slot holds Sidebar Group instances
const groups = instance.getSlot('Groups');

export default {
  example: figma.html`<sl-sidebar${collapsed ? ' collapsed' : ''}${noToggle ? ' no-toggle' : ''}>
  ${header ? figma.html`<div slot="header">${header}</div>` : ''}
  ${groups}
  ${footer ? figma.html`<div slot="footer">${footer}</div>` : ''}
</sl-sidebar>`,
  imports: [
    "import 'src/components/sidebar/sidebar.js'",
    "import 'src/components/sidebar-group/sidebar-group.js'",
    "import 'src/components/sidebar-item/sidebar-item.js'"
  ],
  id: 'sidebar',
  metadata: { nestable: false }
};
