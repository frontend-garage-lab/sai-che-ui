import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlIcon from '../icon/icon.component.js';
import styles from './step.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Steps are the individual stages of a [stepper](/components/stepper).
 * @documentation https://shoelace.style/components/step
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-icon
 *
 * @slot - The step's label.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The clickable area holding the indicator and text. A `<button>` when the step can be navigated
 *  to, otherwise a `<div>`.
 * @csspart indicator - The circle showing the step number, a check mark or an error mark.
 * @csspart label - The container that wraps the label.
 * @csspart description - The description under the label.
 * @csspart connector - The line leading to the next step.
 */
export default class SlStep extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = { 'sl-icon': SlIcon };

  /** A short line under the label, e.g. what the step collects. */
  @property() description = '';

  /** Marks the step as having a problem, e.g. a validation error in the part of the form it represents. */
  @property({ type: Boolean, reflect: true }) error = false;

  /** Prevents the user from navigating to this step. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The step's zero-based position. The stepper keeps this in sync — don't set it yourself. */
  @state() index = 0;

  /** Where the step sits relative to the stepper's current step. The stepper keeps this in sync. */
  @state() state: 'complete' | 'current' | 'upcoming' = 'upcoming';

  /** Whether this is the stepper's last step, which has no connector. The stepper keeps this in sync. */
  @state() last = false;

  /** The stepper's orientation. The stepper keeps this in sync. */
  @state() orientation: 'horizontal' | 'vertical' = 'horizontal';

  /** Whether the user can navigate to this step by clicking it. The stepper keeps this in sync. */
  @state() interactive = false;

  /** Text announced after the label of a completed step. The stepper keeps this in sync. */
  @state() completeLabel = 'Completed';

  /** Text announced after the label of a step with an error. The stepper keeps this in sync. */
  @state() errorLabel = 'Error';

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
  }

  @watch('state')
  handleStateChange() {
    if (this.state === 'current') {
      this.setAttribute('aria-current', 'step');
    } else {
      this.removeAttribute('aria-current');
    }
  }

  private renderIndicator() {
    if (this.error) {
      return html`<sl-icon library="system" name="exclamation-lg" aria-hidden="true"></sl-icon>`;
    }

    if (this.state === 'complete') {
      return html`<sl-icon library="system" name="check-lg" aria-hidden="true"></sl-icon>`;
    }

    return html`<span aria-hidden="true">${this.index + 1}</span>`;
  }

  render() {
    const content = html`
      <span part="indicator" class="step__indicator">${this.renderIndicator()}</span>
      <span class="step__text">
        <span part="label" class="step__label"><slot></slot></span>
        ${this.description ? html`<span part="description" class="step__description">${this.description}</span>` : ''}
        ${this.error
          ? html`<span class="step__announcement">(${this.errorLabel})</span>`
          : this.state === 'complete'
            ? html`<span class="step__announcement">(${this.completeLabel})</span>`
            : ''}
      </span>
    `;

    return html`
      <div
        part="base"
        class=${classMap({
          step: true,
          'step--complete': this.state === 'complete',
          'step--current': this.state === 'current',
          'step--upcoming': this.state === 'upcoming',
          'step--error': this.error,
          'step--disabled': this.disabled,
          'step--interactive': this.interactive,
          'step--last': this.last,
          'step--horizontal': this.orientation === 'horizontal',
          'step--vertical': this.orientation === 'vertical'
        })}
      >
        ${this.interactive
          ? html`<button part="control" type="button" class="step__control">${content}</button>`
          : html`<div part="control" class="step__control">${content}</div>`}
        ${this.last ? '' : html`<span part="connector" class="step__connector"></span>`}
      </div>
    `;
  }
}
