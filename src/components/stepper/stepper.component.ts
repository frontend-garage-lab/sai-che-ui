import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './stepper.styles.js';
import type { CSSResultGroup } from 'lit';
import type SlStep from '../step/step.component.js';

/**
 * @summary Steppers show where the user is in a multi-step process, such as creating and distributing a document.
 * @documentation https://shoelace.style/components/stepper
 * @status experimental
 * @since 2.20
 *
 * @slot - One or more `<sl-step>` elements, in order.
 *
 * @event {{ index: number, previousIndex: number }} sl-step-change - Emitted when the current step changes because the
 *  user clicked a completed step, or because `next()` or `previous()` was called. Setting `current` directly does not
 *  emit it.
 *
 * @csspart base - The component's base wrapper.
 */
export default class SlStepper extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  /**
   * The zero-based index of the current step. Steps before it are shown as complete. Set it to the number of steps to
   * show the whole process as complete.
   */
  @property({ type: Number, reflect: true }) current = 0;

  /** Lays the steps out in a row or in a column. Use `vertical` in narrow side panels. */
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  /** Stops users from going back to a completed step by clicking it. */
  @property({ type: Boolean, reflect: true }) linear = false;

  /** An accessible name for the list of steps, e.g. "Create outgoing correspondence". */
  @property() label = '';

  /** Text announced after the label of each completed step. Set it to localize the stepper. */
  @property({ attribute: 'complete-label' }) completeLabel = 'Completed';

  /** Text announced after the label of each step with an error. Set it to localize the stepper. */
  @property({ attribute: 'error-label' }) errorLabel = 'Error';

  /** Gets the stepper's steps, in document order. */
  getSteps(): SlStep[] {
    return [...this.children].filter(child => child.tagName.toLowerCase() === 'sl-step') as SlStep[];
  }

  /** Moves to the next step and emits `sl-step-change`. Does nothing when every step is already complete. */
  next() {
    this.goTo(this.current + 1);
  }

  /** Moves to the previous step and emits `sl-step-change`. Does nothing on the first step. */
  previous() {
    this.goTo(this.current - 1);
  }

  firstUpdated() {
    this.syncSteps();
  }

  @watch(['current', 'orientation', 'linear', 'completeLabel', 'errorLabel'], { waitUntilFirstUpdate: true })
  handleSettingsChange() {
    this.syncSteps();
  }

  private goTo(index: number) {
    const clamped = Math.max(0, Math.min(index, this.getSteps().length));
    if (clamped === this.current) {
      return;
    }

    const previousIndex = this.current;
    this.current = clamped;
    this.emit('sl-step-change', { detail: { index: clamped, previousIndex } });
  }

  private syncSteps() {
    const steps = this.getSteps();

    steps.forEach((step, index) => {
      step.index = index;
      step.last = index === steps.length - 1;
      step.orientation = this.orientation;
      step.state = index < this.current ? 'complete' : index === this.current ? 'current' : 'upcoming';
      step.interactive = !this.linear && !step.disabled && index < this.current;
      step.completeLabel = this.completeLabel;
      step.errorLabel = this.errorLabel;
    });
  }

  private handleClick = (event: MouseEvent) => {
    const step = (event.target as Element).closest('sl-step');
    if (!step || step.parentElement !== this || !step.interactive) {
      return;
    }

    this.goTo(step.index);
  };

  private handleSlotChange = () => {
    this.syncSteps();
  };

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          stepper: true,
          'stepper--horizontal': this.orientation === 'horizontal',
          'stepper--vertical': this.orientation === 'vertical'
        })}
        role="list"
        aria-label=${ifDefined(this.label || undefined)}
        @click=${this.handleClick}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
}
