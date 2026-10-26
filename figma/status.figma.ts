// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=34-62
// source=src/components/status/status.component.ts
// component=SlStatus
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

const variant = instance.getEnum('Variant', {
  primary: 'primary',
  accent: 'accent',
  success: 'success',
  neutral: 'neutral',
  warning: 'warning',
  danger: 'danger'
});
const size = instance.getEnum('Size', { small: 'small', medium: 'medium' });
const pulse = instance.getBoolean('Pulse');
// `Filled` is a true/false VARIANT (purely visual, no child to show/hide), not a BOOLEAN.
const filled = instance.getEnum('Filled', { true: true, false: false });
// Without a label the status is a bare dot: the state goes in `title`, as in the table's quick-info cell.
const showLabel = instance.getBoolean('Show Label');
const label = text('Status label');

export default {
  example: showLabel
    ? figma.html`<sl-status variant="${variant}" size="${size}"${filled ? ' filled' : ''}${pulse ? ' pulse' : ''}>${label}</sl-status>`
    : figma.html`<sl-status variant="${variant}" size="${size}"${filled ? ' filled' : ''}${pulse ? ' pulse' : ''} title="${label}"></sl-status>`,
  imports: ["import 'src/components/status/status.js'"],
  id: 'status',
  metadata: { nestable: true }
};
