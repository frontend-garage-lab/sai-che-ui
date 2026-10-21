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
const actions = instance.getSlot('Actions');
// "Nav" slot: the Header Item instances of the main navigation, each rendered through its own template.
const nav = instance.getSlot('Nav');
// Optional application name next to the brand mark (Show App Name + App Name), a second slot="logo" element.
const appName = instance.getBoolean('Show App Name') ? instance.getString('App Name') : '';

const appNameCode = appName ? figma.html`\n  <span slot="logo">${appName}</span>` : '';
const navCode = nav ? figma.html`\n  ${nav}` : '';
const actionsCode = actions ? figma.html`\n  <div slot="actions" style="display: contents">${actions}</div>` : '';

export default {
  example: figma.html`<sl-header logo-src="/assets/images/saipem-mark.png" logo-label="Saipem">${appNameCode}${navCode}${actionsCode}
</sl-header>`,
  imports: ["import 'src/components/header/header.js'", "import 'src/components/header-item/header-item.js'"],
  id: 'header',
  metadata: { nestable: false }
};
