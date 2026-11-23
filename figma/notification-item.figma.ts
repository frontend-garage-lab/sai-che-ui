// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1764-344
// source=src/components/notification-item/notification-item.component.ts
// component=SlNotificationItem
import figma from 'figma';
const instance = figma.selectedInstance;

// Time is the rendered relative time ("5 minutes ago"); in code it comes from the `date` attribute (ISO 8601),
// so the example uses a sample date. Origin "project · section" is split into the two attributes.
const read = instance.getEnum('State', { New: false, Read: true });
const title = instance.getString('Title');
const message = instance.getString('Message');
const origin = instance.getBoolean('Show Origin') ? instance.getString('Origin') : '';
const [project = '', section = ''] = origin.split(' · ').map(part => part.trim());

// The outcome icon maps to `variant` (one shape per outcome); any other icon goes in the icon slot.
const VARIANT_BY_ICON: Record<string, string> = {
  'check2-circle': 'success',
  'exclamation-triangle': 'warning',
  'exclamation-octagon': 'danger',
  'info-circle': 'info'
};
const icon = instance.getBoolean('Show Icon') ? instance.getInstanceSwap('Icon') : null;
const iconName = icon && icon.type === 'INSTANCE' ? icon.name.replace(/^Icon\//, '') : '';
const variant = VARIANT_BY_ICON[iconName] ?? '';
const customIcon = iconName && !variant ? figma.html`\n  <sl-icon slot="icon" name="${iconName}"></sl-icon>` : '';

const actions = instance.getBoolean('Show Action')
  ? instance.findConnectedInstances(node => node.name === 'Action')
  : [];
const action = actions[0] ? figma.html`\n  <div slot="actions">${actions[0].executeTemplate().example}</div>` : '';

const variantAttr = variant ? ` variant="${variant}"` : '';
const projectAttr = project ? ` project="${project}"` : '';
const sectionAttr = section ? ` section="${section}"` : '';
const readAttr = read ? ' read' : '';

export default {
  example: figma.html`<sl-notification-item${variantAttr} heading="${title}" date="2026-11-23T09:12:00"${projectAttr}${sectionAttr}${readAttr}>${customIcon}
  ${message}${action}
</sl-notification-item>`,
  imports: ["import 'src/components/notification-item/notification-item.js'"],
  id: 'notification-item',
  metadata: { nestable: true }
};
