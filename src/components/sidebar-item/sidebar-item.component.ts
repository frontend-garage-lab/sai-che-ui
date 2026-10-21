import { classMap } from 'lit/directives/class-map.js';
import { HasSlotController } from '../../internal/slot.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlBadge from '../badge/badge.component.js';
import styles from './sidebar-item.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Sidebar items are the links inside a [sidebar group](/components/sidebar-group).
 * @documentation https://shoelace.style/components/sidebar-item
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-badge
 *
 * @slot - The item's label.
 * @slot prefix - An optional icon. Items with an icon stay visible (icon only) when the sidebar is collapsed; items
 *  without one are hidden.
 *
 * @csspart base - The component's base wrapper, an `<a>`.
 * @csspart prefix - The prefix container.
 * @csspart label - The item's label.
 * @csspart count - The item's count, an `<sl-badge>`.
 */
export default class SlSidebarItem extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = { 'sl-badge': SlBadge };

  private readonly hasSlotController = new HasSlotController(this, 'prefix');

  /** The URL to direct the user to. */
  @property() href?: string;

  /** Tells the browser where to open the link. Only used when `href` is set. */
  @property() target?: '_blank' | '_parent' | '_self' | '_top';

  /** Marks this as the item for the current page. */
  @property({ type: Boolean, reflect: true }) current = false;

  /** An optional count shown at the end of the item. */
  @property() count?: string;

  /** Set by the parent `<sl-sidebar>`. */
  @property({ type: Boolean, reflect: true }) collapsed = false;

  render() {
    const hasPrefix = this.hasSlotController.test('prefix');

    return html`
      <a
        part="base"
        class=${classMap({
          'sidebar-item': true,
          'sidebar-item--has-prefix': hasPrefix,
          'sidebar-item--collapsed': this.collapsed
        })}
        href=${ifDefined(this.href)}
        target=${ifDefined(this.target)}
        aria-current=${ifDefined(this.current ? 'page' : undefined)}
        title=${ifDefined(this.collapsed ? this.textContent?.trim() : undefined)}
      >
        <slot name="prefix" part="prefix" class="sidebar-item__prefix"></slot>
        <span part="label" class="sidebar-item__label"><slot></slot></span>
        ${this.count !== undefined
          ? html`<sl-badge part="count" class="sidebar-item__count" variant="neutral" pill>${this.count}</sl-badge>`
          : ''}
      </a>
    `;
  }
}
