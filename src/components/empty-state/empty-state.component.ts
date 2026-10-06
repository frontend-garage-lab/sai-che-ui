import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './empty-state.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Empty states communicate that a list or view has no content yet, e.g. a document with no review comments.
 * @documentation https://shoelace.style/components/empty-state
 * @status experimental
 * @since 2.20
 *
 * @slot icon - An icon shown in the tinted badge above the title, e.g. `<sl-icon>`.
 * @slot action - An optional call to action, e.g. a `<sl-button>` to add the first item.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The tinted circular badge that hosts the icon.
 * @csspart title - The title.
 * @csspart description - The supporting description text.
 * @csspart action - The container that wraps the action slot.
 */
export default class SlEmptyState extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  /** The title text shown below the icon. */
  @property() titleText = '';

  /** The supporting description text shown below the title. */
  @property() description = '';

  render() {
    return html`
      <div part="base" class="empty-state">
        <span part="icon" class="empty-state__icon">
          <slot name="icon"></slot>
        </span>

        <h3 part="title" class="empty-state__title">${this.titleText}</h3>

        <p part="description" class="empty-state__description">${this.description}</p>

        <div part="action" class="empty-state__action">
          <slot name="action"></slot>
        </div>
      </div>
    `;
  }
}
