// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=704-2
// source=src/components/comment/comment.component.ts
// component=SlComment
import figma from 'figma';
const instance = figma.selectedInstance;

const author = instance.getString('Author');
const date = instance.getString('Date');
const text = instance.getString('Text');
// Extra content under the text (e.g. the commented file row `a.rs-file`), dropped into the "Body" slot.
// Free-form slot: the connected instances found under `Body` (e.g. a Table, a Select) are rendered through their own
// templates so they show up in the snippet, interpolated individually (not .map().join()); when there are none, the
// slot placeholder is kept.
const bodySlot = instance.getSlot('Body');
const bodyInstances = instance.findConnectedInstances(() => true, { path: ['Body'] });
const bodyAt = (index: number) =>
  bodyInstances[index] && bodyInstances[index].type === 'INSTANCE'
    ? figma.html`${index ? '\n  ' : ''}${bodyInstances[index].executeTemplate().example}`
    : '';
// A body made only of text has no instance to render and `getSlot` would print just the slot name: the text layers
// found under `Body` are emitted as the body content instead.
const bodyTexts = bodyInstances.length
  ? []
  : instance
      .findLayers(node => node.type === 'TEXT', { path: ['Body'] })
      .flatMap(node => (node.type === 'TEXT' ? [node.textContent] : []));
const body = bodyInstances.length
  ? figma.html`${bodyAt(0)}${bodyAt(1)}${bodyAt(2)}${bodyAt(3)}${bodyAt(4)}${bodyAt(5)}${bodyAt(6)}${bodyAt(7)}`
  : bodyTexts.length
    ? bodyTexts.join('\n  ')
    : bodySlot;
// Right-side action (a file icon-button or an action menu `sl-dropdown`), dropped into the "Attachment" slot.
const hasAttachment = instance.getBoolean('Has Attachment');
const attachmentSlot = hasAttachment ? instance.getSlot('Attachment') : undefined;
// The attachment (Icon, Icon Button or Dropdown) is usually wrapped in a frame inside the slot, so it is searched by
// layer name instead of through `connectedInstances`; the slot placeholder stays as the fallback.
const attachmentNode = hasAttachment
  ? instance.findConnectedInstances(
      node => node.name.startsWith('Icon/') || node.name === 'Icon Button' || node.name === 'Dropdown'
    )[0]
  : undefined;
const attachment =
  attachmentNode && attachmentNode.type === 'INSTANCE'
    ? figma.html`\n  <span slot="attachment">${attachmentNode.executeTemplate().example}</span>`
    : attachmentSlot
      ? figma.html`\n  <span slot="attachment">${attachmentSlot}</span>`
      : '';

export default {
  example: figma.html`<sl-comment author="${author}" date="${date}">
  <sl-avatar slot="avatar"></sl-avatar>
  ${text}${body}${attachment}
</sl-comment>`,
  imports: [
    "import 'src/components/comment/comment.js'",
    "import 'src/components/avatar/avatar.js'",
    "import 'src/components/icon-button/icon-button.js'",
    "import 'src/components/icon/icon.js'"
  ],
  id: 'comment',
  metadata: { nestable: true }
};
