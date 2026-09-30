// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=52-2
// source=src/components/app-header/app-header.component.ts
// component=SlAppHeader
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

export default {
  example: figma.html`<sl-app-header>
  <span slot="logo">${text('SAIPEM')}</span>

  <a href="#">${text('Dashboard')}</a>
  <a href="#" aria-current="page">${text('Documents')}</a>
  <a href="#">${text('Reports')}</a>
  <a href="#">${text('Settings')}</a>
</sl-app-header>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/app-header/app-header.js'"],
  id: 'app-header',
  metadata: { nestable: false }
};
