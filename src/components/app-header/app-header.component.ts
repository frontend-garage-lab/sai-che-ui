import { HasSlotController } from '../../internal/slot.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './app-header.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary App headers are the brand bar at the top of an application: logo, main navigation and global actions such
 *  as the project picker and the user menu.
 * @documentation https://shoelace.style/components/app-header
 * @status experimental
 * @since 2.20
 *
 * @slot logo - The logo and product name.
 * @slot - The main navigation, as `<a>` elements. Mark the current page with `aria-current="page"`.
 * @slot actions - Controls shown at the trailing end, e.g. a project select, a help link and the user menu.
 *
 * @csspart base - The component's base wrapper, a `<header>` element.
 * @csspart logo - The container that wraps the logo slot.
 * @csspart nav - The navigation landmark that wraps the default slot.
 * @csspart actions - The container that wraps the actions slot.
 *
 * @cssproperty --height - The header's height, excluding the accent line.
 * @cssproperty --background - The header's background colour.
 * @cssproperty --color - The colour of text and icons in the header.
 * @cssproperty --accent-color - The colour of the line along the bottom edge.
 */
export default class SlAppHeader extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  private readonly hasSlotController = new HasSlotController(this, '[default]');

  /** The accessible name of the navigation landmark. Set it to localize the component. */
  @property({ attribute: 'nav-label' }) navLabel = 'Main';

  render() {
    const hasNav = this.hasSlotController.test('[default]');

    return html`
      <header part="base" class="app-header">
        <div part="logo" class="app-header__logo"><slot name="logo"></slot></div>
        <nav part="nav" class="app-header__nav" aria-label=${this.navLabel} ?hidden=${!hasNav}>
          <slot></slot>
        </nav>
        <div part="actions" class="app-header__actions"><slot name="actions"></slot></div>
      </header>
    `;
  }
}
