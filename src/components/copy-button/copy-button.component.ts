import { getAnimation, setDefaultAnimation } from '../../utilities/animation-registry.js';
import { html } from 'lit';
import { LocalizeController } from '../../utilities/localize.js';
import { property, query, state } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlIcon from '../icon/icon.component.js';
import SlTooltip from '../tooltip/tooltip.component.js';
import styles from './copy-button.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Copies text data to the clipboard when the user clicks the trigger.
 * @documentation https://shoelace.style/components/copy
 * @status experimental
 * @since 2.7
 *
 * @dependency sl-icon
 * @dependency sl-tooltip
 *
 * @event sl-copy - Emitted when the data has been copied.
 * @event sl-error - Emitted when the data could not be copied.
 *
 * @slot copy-icon - The icon to show in the default copy state. Works best with `<sl-icon>`.
 * @slot success-icon - The icon to show when the content is copied. Works best with `<sl-icon>`.
 * @slot error-icon - The icon to show when a copy error occurs. Works best with `<sl-icon>`.
 *
 * @csspart button - The internal `<button>` element.
 * @csspart copy-icon - The container that holds the copy icon.
 * @csspart success-icon - The container that holds the success icon.
 * @csspart error-icon - The container that holds the error icon.
 * @csspart tooltip__base - The tooltip's exported `base` part.
 * @csspart tooltip__base__popup - The tooltip's exported `popup` part.
 * @csspart tooltip__base__arrow - The tooltip's exported `arrow` part.
 * @csspart tooltip__body - The tooltip's exported `body` part.
 *
 * @cssproperty --success-color - The color to use for success feedback.
 * @cssproperty --error-color - The color to use for error feedback.
 *
 * @animation copy.in - The animation to use when feedback icons animate in.
 * @animation copy.out - The animation to use when feedback icons animate out.
 */
export default class SlCopyButton extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-icon': SlIcon,
    'sl-tooltip': SlTooltip
  };

  private readonly localize = new LocalizeController(this);

  @query('slot[name="copy-icon"]') copyIcon: HTMLSlotElement;
  @query('slot[name="success-icon"]') successIcon: HTMLSlotElement;
  @query('slot[name="error-icon"]') errorIcon: HTMLSlotElement;
  @query('.copy-button__button') button: HTMLButtonElement;
  @query('sl-tooltip') tooltip: SlTooltip | null;

  @state() isCopying = false;
  @state() status: 'rest' | 'success' | 'error' = 'rest';
  @state() private tooltipReady = false;
  @state() private feedbackIconsReady = false;

  /** Set when the tooltip was asked for while the feedback animation was running, so it can be honoured later. */
  private tooltipRequested = false;

  /** The text value to copy. */
  @property() value = '';

  /**
   * An id that references an element in the same document from which data will be copied. If both this and `value` are
   * present, this value will take precedence. By default, the target element's `textContent` will be copied. To copy an
   * attribute, append the attribute name wrapped in square brackets, e.g. `from="el[value]"`. To copy a property,
   * append a dot and the property name, e.g. `from="el.value"`.
   */
  @property() from = '';

  /** Disables the copy button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** A custom label to show in the tooltip. */
  @property({ attribute: 'copy-label' }) copyLabel = '';

  /** A custom label to show in the tooltip after copying. */
  @property({ attribute: 'success-label' }) successLabel = '';

  /** A custom label to show in the tooltip when a copy error occurs. */
  @property({ attribute: 'error-label' }) errorLabel = '';

  /** The length of time to show feedback before restoring the default trigger. */
  @property({ attribute: 'feedback-duration', type: Number }) feedbackDuration = 1000;

  /** The preferred placement of the tooltip. */
  @property({ attribute: 'tooltip-placement' }) tooltipPlacement: 'top' | 'right' | 'bottom' | 'left' = 'top';

  /**
   * Enable this option to prevent the tooltip from being clipped when the component is placed inside a container with
   * `overflow: auto|hidden|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all,
   * scenarios.
   */
  @property({ type: Boolean }) hoist = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('pointerenter', this.handleFirstInteraction);
    this.addEventListener('focusin', this.handleFirstInteraction);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('pointerenter', this.handleFirstInteraction);
    this.removeEventListener('focusin', this.handleFirstInteraction);
  }

  private handleFirstInteraction = () => {
    void this.createTooltip();
  };

  /**
   * The tooltip, and the popup it contains, is by far the most expensive part of this component and is useless until
   * the user actually interacts with the button. It is created on the first hover or focus instead of on every
   * instance, which is what makes the difference in lists and tables that render many copy buttons at once.
   */
  private async createTooltip() {
    if (this.tooltipReady) {
      return;
    }

    // Creating the tooltip re-creates the button and the icon slots, so it must never happen while the feedback
    // animation is running: that would orphan the animation and lose the icons' visibility state. The request is
    // remembered and honoured as soon as the component is back at rest.
    if (this.isCopying || this.status !== 'rest') {
      this.tooltipRequested = true;
      return;
    }

    this.tooltipRequested = false;
    const hadFocus = this.shadowRoot?.activeElement === this.button;
    const wasHovered = this.matches(':hover');

    this.tooltipReady = true;
    await this.updateComplete;

    if (hadFocus) {
      this.button?.focus();
    }

    // The hover or focus that triggered this has already been dispatched, so the freshly created tooltip never saw
    // it. Opening it here makes the first interaction behave exactly like every later one, and keeps the tooltip's
    // live region announcing the label to assistive technology on the very first focus.
    if (wasHovered || hadFocus) {
      void this.tooltip?.show();
    }
  }

  private async handleCopy() {
    if (this.disabled || this.isCopying) {
      return;
    }
    this.isCopying = true;

    // Copy the value by default
    let valueToCopy = this.value;

    // If an element is specified, copy from that instead
    if (this.from) {
      const root = this.getRootNode() as ShadowRoot | Document;

      // Simple way to parse ids, properties, and attributes
      const isProperty = this.from.includes('.');
      const isAttribute = this.from.includes('[') && this.from.includes(']');
      let id = this.from;
      let field = '';

      if (isProperty) {
        // Split at the dot
        [id, field] = this.from.trim().split('.');
      } else if (isAttribute) {
        // Trim the ] and split at the [
        [id, field] = this.from.trim().replace(/\]$/, '').split('[');
      }

      // Locate the target element by id
      const target = 'getElementById' in root ? root.getElementById(id) : null;

      if (target) {
        if (isAttribute) {
          valueToCopy = target.getAttribute(field) || '';
        } else if (isProperty) {
          // @ts-expect-error - deal with it
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          valueToCopy = target[field] || '';
        } else {
          valueToCopy = target.textContent || '';
        }
      } else {
        // No target
        this.showStatus('error');
        this.emit('sl-error');
      }
    }

    // No value
    if (!valueToCopy) {
      this.showStatus('error');
      this.emit('sl-error');
    } else {
      try {
        await navigator.clipboard.writeText(valueToCopy);
        this.showStatus('success');
        this.emit('sl-copy', {
          detail: {
            value: valueToCopy
          }
        });
      } catch (error) {
        // Rejected by browser
        this.showStatus('error');
        this.emit('sl-error');
      }
    }
  }

  private async showStatus(status: 'success' | 'error') {
    // The success and error icons are only needed once a copy has actually happened. Until then they would be two
    // extra custom elements per button that nobody can see, which adds up in lists and tables.
    this.feedbackIconsReady = true;

    const copyLabel = this.copyLabel || this.localize.term('copy');
    const successLabel = this.successLabel || this.localize.term('copied');
    const errorLabel = this.errorLabel || this.localize.term('error');
    const iconToShow = status === 'success' ? this.successIcon : this.errorIcon;
    const showAnimation = getAnimation(this, 'copy.in', { dir: 'ltr' });
    const hideAnimation = getAnimation(this, 'copy.out', { dir: 'ltr' });

    if (this.tooltip) {
      this.tooltip.content = status === 'success' ? successLabel : errorLabel;
    }

    // Show the feedback icon
    await this.copyIcon.animate(hideAnimation.keyframes, hideAnimation.options).finished;

    // Make sure the feedback icon has been rendered before it is revealed and animated.
    await this.updateComplete;

    this.copyIcon.hidden = true;
    this.status = status;
    iconToShow.hidden = false;
    await iconToShow.animate(showAnimation.keyframes, showAnimation.options).finished;

    // After a brief delay, restore the original state
    setTimeout(async () => {
      await iconToShow.animate(hideAnimation.keyframes, hideAnimation.options).finished;
      iconToShow.hidden = true;
      this.status = 'rest';
      this.copyIcon.hidden = false;
      await this.copyIcon.animate(showAnimation.keyframes, showAnimation.options).finished;

      if (this.tooltip) {
        this.tooltip.content = copyLabel;
      }

      this.isCopying = false;

      // If the tooltip was asked for while the animation was running, it is safe to create it now.
      if (this.tooltipRequested) {
        void this.createTooltip();
      }
    }, this.feedbackDuration);
  }

  render() {
    const copyLabel = this.copyLabel || this.localize.term('copy');
    const button = html`
      <button
        class="copy-button__button${this.status === 'success' ? ' copy-button__button--success' : ''}${this.status ===
        'error'
          ? ' copy-button__button--error'
          : ''}"
        part="button"
        type="button"
        ?disabled=${this.disabled}
        @click=${this.handleCopy}
      >
        <slot part="copy-icon" name="copy-icon">
          <sl-icon library="system" name="copy"></sl-icon>
        </slot>
        <slot part="success-icon" name="success-icon" hidden>
          ${this.feedbackIconsReady ? html`<sl-icon library="system" name="check"></sl-icon>` : ''}
        </slot>
        <slot part="error-icon" name="error-icon" hidden>
          ${this.feedbackIconsReady ? html`<sl-icon library="system" name="x-lg"></sl-icon>` : ''}
        </slot>
      </button>
    `;

    if (!this.tooltipReady) {
      return button;
    }

    return html`
      <sl-tooltip
        class="copy-button"
        content=${copyLabel}
        placement=${this.tooltipPlacement}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        exportparts="
          base:tooltip__base,
          base__popup:tooltip__base__popup,
          base__arrow:tooltip__base__arrow,
          body:tooltip__body
        "
      >
        ${button}
      </sl-tooltip>
    `;
  }
}

setDefaultAnimation('copy.in', {
  keyframes: [
    { scale: '.25', opacity: '.25' },
    { scale: '1', opacity: '1' }
  ],
  options: { duration: 100 }
});

setDefaultAnimation('copy.out', {
  keyframes: [
    { scale: '1', opacity: '1' },
    { scale: '.25', opacity: '0' }
  ],
  options: { duration: 100 }
});
