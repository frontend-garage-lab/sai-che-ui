import { html } from 'lit';
import { HasSlotController } from '../../internal/slot.js';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlAvatar from '../avatar/avatar.component.js';
import SlIconButton from '../icon-button/icon-button.component.js';
import styles from './comment.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Comments show a single message in a thread, e.g. a review comment, pairing an avatar with its author,
 *  date, text and an optional attachment.
 * @documentation https://shoelace.style/components/comment
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-avatar
 * @dependency sl-icon-button
 *
 * @slot - The comment's text.
 * @slot avatar - The author's avatar, an `<sl-avatar>`.
 * @slot author - The author's name. Alternatively, you can use the `author` attribute.
 * @slot date - The comment's date. Alternatively, you can use the `date` attribute.
 * @slot attachment - An optional attachment action, e.g. an `<sl-icon-button>` that opens an attached file.
 *
 * @csspart base - The component's base wrapper.
 * @csspart avatar - The container that wraps the avatar slot.
 * @csspart content - The container that wraps the meta line and text.
 * @csspart meta - The container that wraps the author and date.
 * @csspart author - The container that wraps the author slot.
 * @csspart date - The container that wraps the date slot.
 * @csspart text - The container that wraps the comment's text.
 * @csspart attachment - The container that wraps the attachment slot.
 */
export default class SlComment extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-avatar': SlAvatar,
    'sl-icon-button': SlIconButton
  };

  private readonly hasSlotController = new HasSlotController(this, 'date', 'attachment');

  /** The comment author's name. If you need to display HTML, use the `author` slot instead. */
  @property() author = '';

  /** The comment's date, e.g. "02-Oct-2026". If you need to display HTML, use the `date` slot instead. */
  @property() date = '';

  render() {
    const hasDate = this.date.length > 0 || this.hasSlotController.test('date');
    const hasAttachment = this.hasSlotController.test('attachment');

    return html`
      <div part="base" class="comment">
        <span part="avatar" class="comment__avatar">
          <slot name="avatar"></slot>
        </span>

        <div part="content" class="comment__content">
          <div part="meta" class="comment__meta">
            <span part="author" class="comment__author"><slot name="author">${this.author}</slot></span>
            ${hasDate
              ? html`<span part="date" class="comment__date"><slot name="date">${this.date}</slot></span>`
              : ''}
          </div>
          <div part="text" class="comment__text">
            <slot></slot>
          </div>
        </div>

        ${hasAttachment
          ? html`
              <span part="attachment" class="comment__attachment">
                <slot name="attachment"></slot>
              </span>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-comment': SlComment;
  }
}
