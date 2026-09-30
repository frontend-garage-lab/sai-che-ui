import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './status.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Statuses pair a coloured dot with a short label to show the state of a record, e.g. a document's lifecycle.
 * @documentation https://shoelace.style/components/status
 * @status experimental
 * @since 2.20
 *
 * @slot - The status label.
 *
 * @csspart base - The component's base wrapper.
 * @csspart indicator - The coloured dot.
 * @csspart label - The container that wraps the label.
 *
 * @cssproperty --indicator-color - The colour of the dot. Defaults to the variant's colour.
 */
export default class SlStatus extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  /** The status's theme variant. */
  @property({ reflect: true }) variant: 'primary' | 'accent' | 'success' | 'neutral' | 'warning' | 'danger' = 'neutral';

  /** The status's size. */
  @property({ reflect: true }) size: 'small' | 'medium' = 'medium';

  /** Animates the dot to show that the state is ongoing, e.g. an upload or a pending approval. */
  @property({ type: Boolean, reflect: true }) pulse = false;

  render() {
    return html`
      <span
        part="base"
        class=${classMap({
          status: true,
          'status--primary': this.variant === 'primary',
          'status--accent': this.variant === 'accent',
          'status--success': this.variant === 'success',
          'status--neutral': this.variant === 'neutral',
          'status--warning': this.variant === 'warning',
          'status--danger': this.variant === 'danger',
          'status--small': this.size === 'small',
          'status--medium': this.size === 'medium',
          'status--pulse': this.pulse
        })}
      >
        <span part="indicator" class="status__indicator"></span>
        <span part="label" class="status__label"><slot></slot></span>
      </span>
    `;
  }
}
