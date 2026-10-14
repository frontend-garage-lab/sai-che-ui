// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=704-2
// source=src/components/comment/comment.component.ts
// component=SlComment
import figma from 'figma';
const instance = figma.selectedInstance;

const author = instance.getString('Author');
const date = instance.getString('Date');
const text = instance.getString('Text');
const hasAttachment = instance.getBoolean('Has Attachment');
const attachment = hasAttachment
  ? figma.html`\n  <sl-icon-button slot="attachment" name="paperclip" label="View attachment"></sl-icon-button>`
  : '';

export default {
  example: figma.html`<sl-comment author="${author}" date="${date}">
  <sl-avatar slot="avatar"></sl-avatar>
  ${text}${attachment}
</sl-comment>`,
  imports: [
    "import 'src/components/comment/comment.js'",
    "import 'src/components/avatar/avatar.js'",
    "import 'src/components/icon-button/icon-button.js'"
  ],
  id: 'comment',
  metadata: { nestable: true }
};
