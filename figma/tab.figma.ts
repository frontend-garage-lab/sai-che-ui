// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=45-10
// source=src/components/tab/tab.component.ts
// component=SlTab
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

const active = instance.getEnum('State', { default: false, hover: false, active: true, disabled: false });
const disabled = instance.getEnum('State', { default: false, hover: false, active: false, disabled: true });
const label = text('Tab label');
const panel = label.toLowerCase().replace(/\s+/g, '-');

export default {
  example: figma.html`<sl-tab slot="nav" panel="${panel}"${active ? ' active' : ''}${disabled ? ' disabled' : ''}>${label}</sl-tab>`,
  imports: ["import '@shoelace-style/shoelace/dist/components/tab/tab.js'"],
  id: 'tab',
  metadata: { nestable: true }
};
