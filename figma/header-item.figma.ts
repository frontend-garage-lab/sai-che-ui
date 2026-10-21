// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=552-74
// source=src/components/header-item/header-item.component.ts
// component=SlHeaderItem
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

const current = instance.getEnum('State', { Default: false, Current: true, Open: false });
const hasMenu = instance.getBoolean('Has Menu');
const label = text('Nav Item');
// Account menu: avatar before the label, e.g. the signed-in user in the header's actions slot.
const avatar = instance.getBoolean('Avatar') ? instance.findInstance('avatar') : null;
const avatarCode = avatar && avatar.type === 'INSTANCE' ? avatar.executeTemplate().example : '';

export default {
  example: hasMenu
    ? figma.html`<sl-header-item>${avatarCode ? figma.html`\n  ${avatarCode}` : ''}
  ${label}
  <sl-menu slot="menu">
    <sl-menu-item>Item 1</sl-menu-item>
    <sl-menu-item>Item 2</sl-menu-item>
  </sl-menu>
</sl-header-item>`
    : figma.html`<sl-header-item href="#"${current ? ' current' : ''}>${avatarCode ? avatarCode : ''}${label}</sl-header-item>`,
  imports: [
    "import 'src/components/header-item/header-item.js'",
    "import 'src/components/menu/menu.js'",
    "import 'src/components/menu-item/menu-item.js'",
    "import 'src/components/avatar/avatar.js'"
  ],
  id: 'header-item',
  metadata: { nestable: true }
};
