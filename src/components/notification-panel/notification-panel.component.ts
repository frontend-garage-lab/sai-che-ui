import { HasSlotController } from '../../internal/slot.js';
import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlBadge from '../badge/badge.component.js';
import SlButton from '../button/button.component.js';
import SlDropdown from '../dropdown/dropdown.component.js';
import SlEmptyState from '../empty-state/empty-state.component.js';
import SlIcon from '../icon/icon.component.js';
import styles from './notification-panel.styles.js';
import type { CSSResultGroup } from 'lit';
import type SlNotificationItem from '../notification-item/notification-item.component.js';

/**
 * @summary A bell button with an unread counter that opens a panel listing the user's notifications. Usually placed
 *  in the `actions` slot of a [header](/components/header). The badge counts the new (unread) notifications; opening
 *  the panel marks them as read when it closes.
 * @documentation https://shoelace.style/components/notification-panel
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-badge
 * @dependency sl-button
 * @dependency sl-dropdown
 * @dependency sl-empty-state
 * @dependency sl-icon
 *
 * @slot - The notifications, as `<sl-notification-item>` elements, newest first.
 * @slot empty - Content shown when there are no notifications. Defaults to an empty state.
 * @slot footer - Optional content below the list, e.g. the retention policy or a link to the notification settings.
 *
 * @event sl-notification-read-all - Emitted when "Mark all as read" is clicked, before the items are marked as read.
 *  Cancelable: call `event.preventDefault()` to keep the items.
 * @event sl-show - Emitted when the panel opens.
 * @event sl-hide - Emitted when the panel closes.
 *
 * @csspart trigger - The bell button.
 * @csspart badge - The unread counter badge.
 * @csspart panel - The panel container.
 * @csspart header - The panel header, with the title and the "Mark all as read" action.
 * @csspart title - The panel title.
 * @csspart description - The subtitle below the title.
 * @csspart list - The list that wraps the notifications.
 * @csspart footer - The container that wraps the footer slot.
 *
 * @cssproperty --panel-width - The panel width.
 * @cssproperty --panel-max-height - The maximum height of the list before it scrolls.
 */
export default class SlNotificationPanel extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-badge': SlBadge,
    'sl-button': SlButton,
    'sl-dropdown': SlDropdown,
    'sl-empty-state': SlEmptyState,
    'sl-icon': SlIcon
  };

  @query('sl-dropdown') dropdown: SlDropdown;
  @query('.notification-panel__trigger') trigger: HTMLButtonElement;

  private readonly hasSlotController = new HasSlotController(this, 'footer');

  @state() private itemCount = 0;
  @state() private announcement = '';

  /** The panel title, also used for the bell button's accessible name. */
  @property() label = 'Notifications';

  /** The counter shown in the badge. When not set, it's the number of `<sl-notification-item>` children. */
  @property({ type: Number }) count?: number;

  /** Counts above this value are shown as `max+`. */
  @property({ type: Number }) max = 99;

  /** Opens or closes the panel. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Label of the action that marks every notification as read. */
  @property({ attribute: 'read-all-label' }) readAllLabel = 'Mark all as read';

  /** Optional subtitle below the title, e.g. the scope of the list ("All projects and working areas"). */
  @property() description = '';

  /**
   * By default, opening the panel marks its notifications as read when it closes. With `manual-read` they stay new
   * until the user acts on them or clicks "Mark all as read".
   */
  @property({ attribute: 'manual-read', type: Boolean }) manualRead = false;

  /** Title of the default empty state. */
  @property({ attribute: 'empty-label' }) emptyLabel = 'No notifications';

  private get items() {
    return [...this.querySelectorAll<SlNotificationItem>(':scope > sl-notification-item')];
  }

  private get unread() {
    return this.count ?? this.unreadCount;
  }

  @state() private unreadCount = 0;

  /** Items that were new while the panel was open: they become read when it closes. */
  private seen = new Set<SlNotificationItem>();

  private readonly observer = new MutationObserver(() => this.updateCounts());

  private updateCounts() {
    const items = this.items;
    const previous = this.unreadCount;
    this.itemCount = items.length;
    this.unreadCount = items.filter(item => !item.read).length;
    if (this.unreadCount > previous && this.hasUpdated) {
      const added = this.unreadCount - previous;
      this.announcement = added === 1 ? `1 new notification` : `${added} new notifications`;
    }
  }

  private handleSlotChange() {
    this.updateCounts();
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateCounts();
    this.observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['read'] });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer.disconnect();
  }

  /** Marks every notification as read. */
  markAllAsRead() {
    const event = this.emit('sl-notification-read-all', { cancelable: true });
    if (event.defaultPrevented) return;
    this.items.forEach(item => item.markAsRead());
  }

  /** Opens the panel. */
  show() {
    return this.dropdown.show();
  }

  /** Closes the panel. */
  hide() {
    return this.dropdown.hide();
  }

  private handleShow(event: Event) {
    if (event.target !== this.dropdown) return;
    this.open = true;
    // Viewing the panel marks its notifications as read; the "New" markers stay until it closes
    if (!this.manualRead) this.seen = new Set(this.items.filter(item => !item.read));
  }

  private handleHide(event: Event) {
    if (event.target !== this.dropdown) return;
    this.open = false;
    this.seen.forEach(item => item.isConnected && item.markAsRead());
    this.seen.clear();
  }

  render() {
    const unread = this.unread;
    const badgeText = unread > this.max ? `${this.max}+` : String(unread);
    const triggerLabel = unread > 0 ? `${this.label}, ${unread} unread` : this.label;
    const empty = this.itemCount === 0;

    return html`
      <sl-dropdown
        placement="bottom-end"
        distance="4"
        stay-open-on-select
        ?open=${this.open}
        .containingElement=${this}
        @sl-show=${this.handleShow}
        @sl-hide=${this.handleHide}
      >
        <button
          type="button"
          slot="trigger"
          part="trigger"
          class="notification-panel__trigger"
          aria-label=${triggerLabel}
          aria-haspopup="dialog"
        >
          <sl-icon name="bell" aria-hidden="true"></sl-icon>
          ${unread > 0
            ? html`<sl-badge part="badge" class="notification-panel__badge" variant="danger" pill aria-hidden="true"
                >${badgeText}</sl-badge
              >`
            : ''}
        </button>

        <div part="panel" class="notification-panel" role="dialog" aria-labelledby="title">
          <div part="header" class="notification-panel__header">
            <div class="notification-panel__heading">
              <h2 part="title" id="title" class="notification-panel__title">${this.label}</h2>
              ${this.description
                ? html`<p part="description" class="notification-panel__description">${this.description}</p>`
                : ''}
            </div>
            ${this.unreadCount === 0
              ? ''
              : html`<sl-button variant="text" size="small" @click=${this.markAllAsRead}
                  >${this.readAllLabel}</sl-button
                >`}
          </div>

          <div part="list" class="notification-panel__list" role="list" ?hidden=${empty}>
            <slot @slotchange=${this.handleSlotChange}></slot>
          </div>

          <div class="notification-panel__empty" ?hidden=${!empty}>
            <slot name="empty">
              <sl-empty-state title-text=${this.emptyLabel}>
                <sl-icon slot="icon" name="bell"></sl-icon>
              </sl-empty-state>
            </slot>
          </div>

          <div part="footer" class="notification-panel__footer" ?hidden=${!this.hasSlotController.test('footer')}>
            <slot name="footer"></slot>
          </div>
        </div>
      </sl-dropdown>

      <div class="notification-panel__live" aria-live="polite" role="status">${this.announcement}</div>
    `;
  }
}
