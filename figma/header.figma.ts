// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=52-2
// source=src/components/header/header.component.ts
// component=SlHeader
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

// The "Logo" instance-swap property lets designers swap the Saipem Mark instance for any
// other component/wordmark; code-side this is rendered with the `logo-src` and `logo-label`
// attributes on <sl-header> when a single image is used (like the Saipem brand mark).
export default {
  example: figma.html`<sl-header logo-src="/assets/images/saipem-mark.png" logo-label="Saipem">
  <sl-header-item href="#">${text('Dashboard')}</sl-header-item>
  <sl-header-item href="#" current>${text('Documents')}</sl-header-item>
  <sl-header-item href="#">${text('Reports')}</sl-header-item>
</sl-header>`,
  imports: ["import 'src/components/header/header.js'", "import 'src/components/header-item/header-item.js'"],
  id: 'header',
  metadata: { nestable: false }
};
