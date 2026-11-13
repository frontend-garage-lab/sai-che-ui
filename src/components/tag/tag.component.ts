import { html } from 'lit';
import { LocalizeController } from '../../utilities/localize.js';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlIconButton from '../icon-button/icon-button.component.js';
import styles from './tag.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Tags are used as labels to organize things or to indicate a selection.
 * @documentation https://shoelace.style/components/tag
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon-button
 *
 * @slot - The tag's content.
 *
 * @event sl-remove - Emitted when the remove button is activated.
 *
 * @csspart base - The component's base wrapper.
 * @csspart content - The tag's content.
 * @csspart remove-button - The tag's remove button, an `<sl-icon-button>`.
 * @csspart remove-button__base - The remove button's exported `base` part.
 */
export default class SlTag extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = { 'sl-icon-button': SlIconButton };

  private readonly localize = new LocalizeController(this);

  /** The tag's theme variant. */
  @property({ reflect: true }) variant: 'primary' | 'accent' | 'success' | 'neutral' | 'warning' | 'danger' | 'text' =
    'neutral';

  /** The tag's size. */
  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Draws a pill-style tag with rounded edges. */
  @property({ type: Boolean, reflect: true }) pill = false;

  /** Makes the tag removable and shows a remove button. */
  @property({ type: Boolean }) removable = false;

  private handleRemoveClick() {
    this.emit('sl-remove');
  }

  render() {
    return html`
      <span
        part="base"
        class="tag tag--${this.variant} tag--${this.size}${this.pill ? ' tag--pill' : ''}${this.removable
          ? ' tag--removable'
          : ''}"
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable
          ? html`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term('remove')}
                class="tag__remove"
                @click=${this.handleRemoveClick}
              ></sl-icon-button>
            `
          : ''}
      </span>
    `;
  }
}
