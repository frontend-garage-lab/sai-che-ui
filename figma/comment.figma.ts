// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=704-2
// source=src/components/comment/comment.component.ts
// component=SlComment
import figma from 'figma';
const instance = figma.selectedInstance;

const author = instance.getString('Author');
const date = instance.getString('Date');
const text = instance.getString('Text');
// Extra content under the text (e.g. the commented file row `a.rs-file`), dropped into the "Body" slot.
const body = instance.getSlot('Body');
// Right-side action (a file icon-button or an action menu `sl-dropdown`), dropped into the "Attachment" slot.
const hasAttachment = instance.getBoolean('Has Attachment');
const attachmentSlot = instance.getSlot('Attachment');
const attachment = hasAttachment ? figma.html`\n  ${attachmentSlot}` : '';

export default {
  example: figma.html`<sl-comment author="${author}" date="${date}">
  <sl-avatar slot="avatar"></sl-avatar>
  ${text}${body}${attachment}
</sl-comment>`,
  imports: [
    "import 'src/components/comment/comment.js'",
    "import 'src/components/avatar/avatar.js'",
    "import 'src/components/icon-button/icon-button.js'"
  ],
  id: 'comment',
  metadata: { nestable: true }
};
