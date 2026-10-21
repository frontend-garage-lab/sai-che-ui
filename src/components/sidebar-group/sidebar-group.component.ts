import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlBadge from '../badge/badge.component.js';
import SlDivider from '../divider/divider.component.js';
import SlTooltip from '../tooltip/tooltip.component.js';
import styles from './sidebar-group.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Sidebar groups are titled sections of a [sidebar](/components/sidebar) that hold sidebar items.
 * @documentation https://shoelace.style/components/sidebar-group
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-badge
 * @dependency sl-divider
 * @dependency sl-tooltip
 *
 * @slot - The group's items, usually `<sl-sidebar-item>` elements.
 * @slot icon - An icon shown next to the label. It's the only thing visible when the sidebar is collapsed.
 *
 * @csspart base - The component's base wrapper.
 * @csspart header - The row holding icon, label and count.
 * @csspart icon - The icon tile.
 * @csspart label - The group's label.
 * @csspart count - The group's count, an `<sl-badge>`.
 * @csspart items - The container of the group's items.
 * @csspart divider - The `<sl-divider>` separating this group from the next one.
 *
 * @cssproperty --icon-size - The size of the icon tile. Items align their labels past it.
 */
export default class SlSidebarGroup extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-badge': SlBadge,
    'sl-divider': SlDivider,
    'sl-tooltip': SlTooltip
  };

  /** The group's title. */
  @property() label = '';

  /** An optional count shown at the end of the header, e.g. the total of the group's items. */
  @property() count?: string;

  /** Set by the parent `<sl-sidebar>`. */
  @property({ type: Boolean, reflect: true }) collapsed = false;

  /** Whether one of the group's items is the current page. */
  @state() private hasCurrent = false;

  private readonly observer = new MutationObserver(() => this.updateCurrent());

  connectedCallback() {
    super.connectedCallback();
    this.observer.observe(this, { subtree: true, childList: true, attributes: true, attributeFilter: ['current'] });
    this.updateCurrent();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer.disconnect();
  }

  private updateCurrent() {
    this.hasCurrent = this.querySelector('sl-sidebar-item[current]') !== null;
  }

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          'sidebar-group': true,
          'sidebar-group--collapsed': this.collapsed,
          'sidebar-group--current': this.hasCurrent
        })}
        role="group"
        aria-label=${this.label}
      >
        <div part="header" class="sidebar-group__header">
          <sl-tooltip content=${this.label} placement="right" hoist ?disabled=${!this.collapsed}>
            <span part="icon" class="sidebar-group__icon"><slot name="icon"></slot></span>
          </sl-tooltip>
          <span part="label" class="sidebar-group__label">${this.label}</span>
          ${this.count !== undefined
            ? html`<sl-badge part="count" class="sidebar-group__count" variant="neutral" pill>${this.count}</sl-badge>`
            : ''}
        </div>
        <div part="items" class="sidebar-group__items"><slot></slot></div>
        <sl-divider part="divider" class="sidebar-group__divider"></sl-divider>
      </div>
    `;
  }
}
