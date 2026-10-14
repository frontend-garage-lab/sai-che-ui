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
const card = instance.getBoolean('Card');
const closable = instance.getBoolean('Closable');
const label = text('Tab label');
const panel = label.toLowerCase().replace(/\s+/g, '-');

const hasIcon = instance.getBoolean('Icon');
const icon = hasIcon ? instance.getInstanceSwap('Icon Type') : null;
const iconName = icon && icon.type === 'INSTANCE' ? icon.name.replace(/^Icon\//, '') : null;
const iconCode = iconName ? figma.html`<sl-icon name="${iconName}"></sl-icon>\n    ` : '';

const hasCounter = instance.getBoolean('Counter');
const counter = hasCounter ? instance.getInstanceSwap('Counter Type') : null;
let counterCode;
if (counter && counter.type === 'INSTANCE') {
  counterCode = counter.executeTemplate().example;
}

export default {
  example: figma.html`<sl-tab slot="nav" panel="${panel}"${active ? ' active' : ''}${disabled ? ' disabled' : ''}${card ? ' card' : ''}${closable ? ' closable' : ''}>
    ${iconCode}${label}${counterCode ? figma.html`\n    ${counterCode}` : ''}
  </sl-tab>`,
  imports: [
    "import 'src/components/tab/tab.js'",
    "import 'src/components/icon/icon.js'",
    "import 'src/components/badge/badge.js'"
  ],
  id: 'tab',
  metadata: { nestable: true }
};
