// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1747-18
// source=src/components/notification-panel/notification-panel.component.ts
// component=SlNotificationPanel
import figma from 'figma';
const instance = figma.selectedInstance;

// The bell. State=Open is the panel shown (`open`); the badge number is not an attribute: by default the component
// counts its <sl-notification-item> children, so the items come from the Notification Popup placed below the bell.
const open = instance.getEnum('State', { Default: false, Open: true });

export default {
  example: figma.html`<sl-notification-panel slot="actions"${open ? ' open' : ''}>
  <sl-notification-item variant="success" heading="Excel export completed" date="2026-11-23T09:12:00">The Job Documents list was exported (24 rows).</sl-notification-item>
</sl-notification-panel>`,
  imports: [
    "import 'src/components/notification-panel/notification-panel.js'",
    "import 'src/components/notification-item/notification-item.js'"
  ],
  id: 'notification-panel',
  metadata: { nestable: true }
};
