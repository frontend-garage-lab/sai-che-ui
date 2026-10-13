import { HasSlotController } from '../../internal/slot.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './header.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Headers are the brand bar at the top of an application: logo, main navigation and global actions such
 *  as the project picker and the user menu.
 * @documentation https://shoelace.style/components/header
 * @status experimental
 * @since 2.20
 *
 * @slot logo - The logo and product name. When empty, falls back to the image set with `logo-src`.
 * @slot - The main navigation, as `<a>` elements or `<sl-header-item>` elements. Mark the current page with
 *  `aria-current="page"` (or the `current` attribute on `<sl-header-item>`).
 * @slot actions - Controls shown at the trailing end, e.g. a project select, a help link and the user menu.
 *
 * @csspart base - The component's base wrapper, a `<header>` element.
 * @csspart logo - The container that wraps the logo slot.
 * @csspart logo-image - The fallback logo `<img>`, shown when `logo-src` is set and the `logo` slot is empty.
 * @csspart nav - The navigation landmark that wraps the default slot.
 * @csspart actions - The container that wraps the actions slot.
 *
 * @cssproperty --height - The header's height, excluding the accent line.
 * @cssproperty --background - The header's background colour.
 * @cssproperty --color - The colour of text and icons in the header.
 * @cssproperty --accent-color - The colour of the line along the bottom edge.
 * @cssproperty --nav-gap - The spacing between main navigation items.
 */
export default class SlHeader extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private readonly hasSlotController = new HasSlotController(this, '[default]');

  /** The accessible name of the navigation landmark. Set it to localize the component. */
  @property({ attribute: 'nav-label' }) navLabel = 'Main';

  /**
   * The source of a logo image to show when the `logo` slot is left empty, e.g. a product mark that doesn't need
   * any custom markup. Ignored if the `logo` slot has content.
   */
  @property({ attribute: 'logo-src' }) logoSrc = '';

  /** An accessible label for the image set with `logo-src`. */
  @property({ attribute: 'logo-label' }) logoLabel = '';

  render() {
    const hasNav = this.hasSlotController.test('[default]');

    return html`
      <header part="base" class="header">
        <div part="logo" class="header__logo">
          <slot name="logo">
            ${this.logoSrc
              ? html`<img part="logo-image" class="header__logo-image" src=${this.logoSrc} alt=${this.logoLabel} />`
              : ''}
          </slot>
        </div>
        <nav part="nav" class="header__nav" aria-label=${this.navLabel} ?hidden=${!hasNav}>
          <slot></slot>
        </nav>
        <div part="actions" class="header__actions"><slot name="actions"></slot></div>
      </header>
    `;
  }
}
