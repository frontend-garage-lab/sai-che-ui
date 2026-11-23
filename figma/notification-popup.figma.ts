// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=1748-12
// source=src/components/notification-panel/notification-panel.component.ts
// component=SlNotificationPanel
import figma from 'figma';
const instance = figma.selectedInstance;

// The open panel of <sl-notification-panel>. The Items slot holds Notification Item instances, rendered through their
// own template and interpolated one by one (not .map().join()), as in header.figma.ts.
const title = instance.getString('Title');
const showItems = instance.getBoolean('Show Items');
const itemsSlot = showItems ? instance.getSlot('Items') : undefined;
const items = itemsSlot ? itemsSlot.connectedInstances : [];
const itemAt = (index: number) => (items[index] ? figma.html`\n  ${items[index].executeTemplate().example}` : '');
const item1 = itemAt(0);
const item2 = itemAt(1);
const item3 = itemAt(2);
const item4 = itemAt(3);
const item5 = itemAt(4);
const showFooter = instance.getBoolean('Show Footer');
const footerSlot = showFooter ? instance.getSlot('Footer') : undefined;
const footerCode = footerSlot ? figma.html`\n  <div slot="footer">${footerSlot}</div>` : '';
const labelAttr = title && title !== 'Notifications' ? ` label="${title}"` : '';
const description = instance.getBoolean('Show Description') ? instance.getString('Description') : '';
const descriptionAttr = description ? ` description="${description}"` : '';

export default {
  example: figma.html`<sl-notification-panel slot="actions" open${labelAttr}${descriptionAttr}>${item1}${item2}${item3}${item4}${item5}${footerCode}
</sl-notification-panel>`,
  imports: [
    "import 'src/components/notification-panel/notification-panel.js'",
    "import 'src/components/notification-item/notification-item.js'"
  ],
  id: 'notification-popup'
};
