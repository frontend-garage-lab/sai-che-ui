// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=52-2
// source=src/components/header/header.component.ts
// component=SlHeader
import figma from 'figma';
const instance = figma.selectedInstance;

// The "Logo" instance-swap property lets designers swap the Saipem Mark instance for any
// other component/wordmark; code-side this is rendered with the `logo-src` and `logo-label`
// attributes on <sl-header> when a single image is used (like the Saipem brand mark).
// "Actions" slot (project select, account Header Item…). `display: contents` keeps each child a flex item of the
// header's actions area, as if it were assigned to slot="actions" directly.
// "Nav" slot: the Header Item instances of the main navigation, each rendered through its own template.
// `getSlot` alone only shows a collapsed `<Slot />` placeholder for the slot node, which has no Code Connect to open:
// the connected instances placed directly in the slot are rendered through their own templates instead, interpolated
// individually (not .map().join()), and the slot placeholder stays as the fallback for free-form content.
const navSlot = instance.getSlot('Nav');
const navList = navSlot ? navSlot.connectedInstances : [];
const navAt = (index: number) => (navList[index] ? figma.html`\n  ${navList[index].executeTemplate().example}` : '');
const nav1 = navAt(0);
const nav2 = navAt(1);
const nav3 = navAt(2);
const nav4 = navAt(3);
const nav5 = navAt(4);
const nav6 = navAt(5);
const navFallback = navList.length || !navSlot ? '' : figma.html`\n  ${navSlot}`;
const actionSlot = instance.getSlot('Actions');
const actionList = actionSlot ? actionSlot.connectedInstances : [];
const actionAt = (index: number) =>
  actionList[index] ? figma.html`\n    ${actionList[index].executeTemplate().example}` : '';
const action1 = actionAt(0);
const action2 = actionAt(1);
const action3 = actionAt(2);
const action4 = actionAt(3);
const actionFallback = actionList.length || !actionSlot ? '' : figma.html`\n    ${actionSlot}`;
// Optional application name next to the brand mark (Show App Name + App Name), a second slot="logo" element.
const appName = instance.getBoolean('Show App Name') ? instance.getString('App Name') : '';

const appNameCode = appName ? figma.html`\n  <span slot="logo">${appName}</span>` : '';
const navCode = figma.html`${nav1}${nav2}${nav3}${nav4}${nav5}${nav6}${navFallback}`;
const hasActions = actionList.length > 0 || actionFallback;
const actionsCode = hasActions
  ? figma.html`\n  <div slot="actions" style="display: contents">${action1}${action2}${action3}${action4}${actionFallback}\n  </div>`
  : '';

export default {
  example: figma.html`<sl-header logo-src="/assets/images/saipem-mark.png" logo-label="Saipem">${appNameCode}${navCode}${actionsCode}
</sl-header>`,
  imports: [
    "import 'src/components/header/header.js'",
    "import 'src/components/header-item/header-item.js'",
    "import 'src/components/menu/menu.js'",
    "import 'src/components/menu-item/menu-item.js'",
    "import 'src/components/avatar/avatar.js'",
    "import 'src/components/select/select.js'"
  ],
  id: 'header',
  metadata: { nestable: false }
};
