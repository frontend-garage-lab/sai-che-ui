import { classMap } from 'lit/directives/class-map.js';
import { HasSlotController } from '../../internal/slot.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlDropdown from '../dropdown/dropdown.component.js';
import SlIcon from '../icon/icon.component.js';
import styles from './header-item.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Header items are the entries in a [header's](/components/header) main navigation. Add a `menu` slot to
 *  turn an item into a dropdown with additional menu items.
 * @documentation https://shoelace.style/components/header-item
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-dropdown
 * @dependency sl-icon
 *
 * @slot - The item's label.
 * @slot menu - Additional menu items, usually `<sl-menu>` with `<sl-menu-item>` children. When set, the item renders
 *  as a dropdown trigger instead of a link.
 *
 * @csspart base - The component's base wrapper, an `<a>` or a `<button>` when it has a menu.
 * @csspart label - The item's label.
 * @csspart chevron - The chevron icon shown when the item has a menu.
 */
export default class SlHeaderItem extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-dropdown': SlDropdown,
    'sl-icon': SlIcon
  };

  private readonly hasSlotController = new HasSlotController(this, 'menu');

  /** The URL to direct the user to. Ignored when the item has a `menu` slot. */
  @property() href?: string;

  /** Tells the browser where to open the link. Only used when `href` is set. */
  @property() target?: '_blank' | '_parent' | '_self' | '_top';

  /** Marks this as the item for the current page. */
  @property({ type: Boolean, reflect: true }) current = false;

  render() {
    const hasMenu = this.hasSlotController.test('menu');

    if (hasMenu) {
      return html`
        <sl-dropdown>
          <button
            type="button"
            slot="trigger"
            part="base"
            class=${classMap({ 'header-item': true, 'header-item--has-menu': true })}
            aria-current=${ifDefined(this.current ? 'page' : undefined)}
          >
            <slot part="label" class="header-item__label"></slot>
            <sl-icon part="chevron" name="chevron-down" library="system" class="header-item__chevron"></sl-icon>
          </button>
          <slot name="menu"></slot>
        </sl-dropdown>
      `;
    }

    return html`
      <a
        part="base"
        class=${classMap({ 'header-item': true })}
        href=${ifDefined(this.href)}
        target=${ifDefined(this.target)}
        aria-current=${ifDefined(this.current ? 'page' : undefined)}
      >
        <slot part="label" class="header-item__label"></slot>
      </a>
    `;
  }
}
