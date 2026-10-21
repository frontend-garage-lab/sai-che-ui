import { classMap } from 'lit/directives/class-map.js';
import { HasSlotController } from '../../internal/slot.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlIconButton from '../icon-button/icon-button.component.js';
import styles from './sidebar.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Sidebars hold the secondary navigation of a page. They can be collapsed to a narrow rail that shows only
 *  the group icons.
 * @documentation https://shoelace.style/components/sidebar
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-icon-button
 *
 * @slot - The sidebar's content, usually `<sl-sidebar-group>` elements.
 * @slot header - Optional content shown above the navigation.
 * @slot footer - Optional content pinned to the bottom of the sidebar.
 *
 * @event sl-collapse - Emitted when the sidebar is collapsed with the toggle button.
 * @event sl-expand - Emitted when the sidebar is expanded with the toggle button.
 *
 * @csspart base - The component's base wrapper.
 * @csspart header - The header container.
 * @csspart nav - The `<nav>` wrapping the default slot.
 * @csspart footer - The footer container.
 * @csspart toggle - The collapse/expand button at the bottom of the sidebar.
 *
 * @cssproperty --width - The width of the expanded sidebar.
 * @cssproperty --collapsed-width - The width of the collapsed sidebar.
 */
export default class SlSidebar extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = { 'sl-icon-button': SlIconButton };

  private readonly hasSlotController = new HasSlotController(this, 'header', 'footer');

  /** Collapses the sidebar to a narrow rail of icons. */
  @property({ type: Boolean, reflect: true }) collapsed = false;

  /** Hides the collapse/expand toggle button. */
  @property({ attribute: 'no-toggle', type: Boolean, reflect: true }) noToggle = false;

  /** Accessible label for the navigation landmark. */
  @property() label = 'Sidebar';

  @watch('collapsed')
  handleCollapsedChange() {
    this.syncChildren();
  }

  /** Children render their own collapsed layout, so the state is pushed down to every group and item. */
  private syncChildren() {
    this.querySelectorAll('sl-sidebar-group, sl-sidebar-item').forEach(el => {
      (el as HTMLElement & { collapsed: boolean }).collapsed = this.collapsed;
    });
  }

  private handleToggle() {
    this.collapsed = !this.collapsed;
    this.emit(this.collapsed ? 'sl-collapse' : 'sl-expand');
  }

  render() {
    return html`
      <aside part="base" class=${classMap({ sidebar: true, 'sidebar--collapsed': this.collapsed })}>
        <div part="header" class="sidebar__header" ?hidden=${!this.hasSlotController.test('header')}>
          <slot name="header"></slot>
        </div>
        <nav part="nav" class="sidebar__nav" aria-label=${this.label}>
          <slot @slotchange=${this.syncChildren}></slot>
        </nav>
        <div part="footer" class="sidebar__footer" ?hidden=${!this.hasSlotController.test('footer')}>
          <slot name="footer"></slot>
        </div>
        ${this.noToggle
          ? ''
          : html`
              <div class="sidebar__toggle">
                <sl-icon-button
                  part="toggle"
                  name=${this.collapsed ? 'chevron-double-right' : 'chevron-double-left'}
                  library="system"
                  label=${this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  @click=${this.handleToggle}
                ></sl-icon-button>
              </div>
            `}
      </aside>
    `;
  }
}
