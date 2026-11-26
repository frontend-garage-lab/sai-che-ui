import { classMap } from 'lit/directives/class-map.js';
import { HasSlotController } from '../../internal/slot.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlBadge from '../badge/badge.component.js';
import SlIcon from '../icon/icon.component.js';
import SlRelativeTime from '../relative-time/relative-time.component.js';
import styles from './notification-item.styles.js';
import type { CSSResultGroup } from 'lit';

export type NotificationVariant = 'success' | 'warning' | 'danger' | 'info';

/** One icon per outcome: the shape alone tells them apart, colour only reinforces it. */
const VARIANT_ICON: Record<NotificationVariant, string> = {
  success: 'check2-circle',
  warning: 'exclamation-triangle',
  danger: 'exclamation-octagon',
  info: 'info-circle'
};

const VARIANT_LABEL: Record<NotificationVariant, string> = {
  success: 'Success',
  warning: 'Warning',
  danger: 'Error',
  info: 'Information'
};

/**
 * @summary A notification inside a [notification panel](/components/notification-panel): outcome icon, title,
 *  detail, when and where it was generated, and optional actions. New (unread) items are marked "New".
 * @documentation https://shoelace.style/components/notification-item
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-badge
 * @dependency sl-icon
 * @dependency sl-relative-time
 *
 * @slot - The notification detail.
 * @slot icon - A custom leading icon. Overrides the icon of `variant`.
 * @slot actions - Optional actions, e.g. `<sl-button size="small">`. Not every notification has one.
 *
 * @event {{ item: SlNotificationItem }} sl-notification-read - Emitted when the item goes from new to read.
 * @event {{ item: SlNotificationItem }} sl-notification-action - Emitted when an element in the `actions` slot is
 *  clicked. The item is then marked as read.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the icon.
 * @csspart body - The container of title, detail, meta and actions.
 * @csspart header - The row with the title, the "New" marker and the time.
 * @csspart title - The title.
 * @csspart new - The "New" marker, an `<sl-badge>`.
 * @csspart message - The detail.
 * @csspart time - The relative date, a `<time>` element with the exact date as tooltip.
 * @csspart origin - The project and section the notification comes from.
 * @csspart actions - The container that wraps the actions slot.
 */
export default class SlNotificationItem extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-badge': SlBadge,
    'sl-icon': SlIcon,
    'sl-relative-time': SlRelativeTime
  };

  private readonly hasSlotController = new HasSlotController(this, 'icon', 'actions');

  /** The outcome. Sets the leading icon (a different shape for each one) and its accessible label. */
  @property({ reflect: true }) variant?: NotificationVariant;

  /** The title, e.g. the outcome of the operation ("Excel export completed"). */
  @property() heading = '';

  /** When the notification was generated. Use an ISO 8601 string to avoid timezone issues. */
  @property() date: Date | string = '';

  /** The project the notification refers to. Optional. */
  @property() project = '';

  /** The section (working area) the notification comes from. Optional. */
  @property() section = '';

  /** Marks the notification as read: the "New" marker disappears and it no longer counts as unread. */
  @property({ type: Boolean, reflect: true }) read = false;

  /** Text of the "New" marker. */
  @property({ attribute: 'new-label' }) newLabel = 'New';

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
  }

  /** Marks the notification as read and emits `sl-notification-read`. Returns `false` if it was already read. */
  markAsRead() {
    if (this.read) return false;
    this.read = true;
    this.emit('sl-notification-read', { detail: { item: this } });
    return true;
  }

  private handleActionsClick(event: MouseEvent) {
    if (event.target === event.currentTarget) return;
    this.emit('sl-notification-action', { detail: { item: this } });
    this.markAsRead();
  }

  private formatDate(date: Date) {
    return new Intl.DateTimeFormat(this.lang || undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  render() {
    const date = this.date ? new Date(this.date) : undefined;
    const validDate = date && !isNaN(date.getTime());
    const hasCustomIcon = this.hasSlotController.test('icon');
    const icon = this.variant ? VARIANT_ICON[this.variant] : undefined;
    const origin = [this.project, this.section].filter(Boolean).join(' · ');

    return html`
      <div
        part="base"
        class=${classMap({
          'notification-item': true,
          'notification-item--new': !this.read,
          [`notification-item--${this.variant}`]: !!this.variant
        })}
      >
        <span part="icon" class="notification-item__icon" ?hidden=${!hasCustomIcon && !icon}>
          <slot name="icon">
            ${icon ? html`<sl-icon name=${icon} label=${VARIANT_LABEL[this.variant!]}></sl-icon>` : ''}
          </slot>
        </span>

        <div part="body" class="notification-item__body">
          <div part="header" class="notification-item__header">
            <span part="title" class="notification-item__title">${this.heading}</span>
            <span class="notification-item__aside">
              ${this.read
                ? ''
                : html`<sl-badge part="new" class="notification-item__new" variant="primary" pill
                    >${this.newLabel}</sl-badge
                  >`}
              ${validDate
                ? html`<time
                    part="time"
                    class="notification-item__time"
                    datetime=${date.toISOString()}
                    title=${this.formatDate(date)}
                    ><sl-relative-time .date=${date} lang=${this.lang || ''} sync></sl-relative-time
                  ></time>`
                : ''}
            </span>
          </div>

          <div part="message" class="notification-item__message"><slot></slot></div>

          ${origin ? html`<div part="origin" class="notification-item__origin">${origin}</div>` : ''}

          <div
            part="actions"
            class="notification-item__actions"
            ?hidden=${!this.hasSlotController.test('actions')}
            @click=${this.handleActionsClick}
          >
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    `;
  }
}
