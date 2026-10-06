import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlCheckbox from '../checkbox/checkbox.component.js';
import styles from './selectable-item.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary A compact, checkable row for small selection lists, e.g. picking documents inside a dialog.
 * @documentation https://shoelace.style/components/selectable-item
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-checkbox
 *
 * @slot - The primary label, e.g. a document name. Truncates with an ellipsis when it overflows.
 * @slot meta - A secondary value shown after the label, e.g. a date.
 *
 * @event sl-change - Emitted when the user toggles the item's checked state.
 *
 * @csspart base - The component's base wrapper.
 * @csspart checkbox - The checkbox, an `<sl-checkbox>` element.
 * @csspart checkbox__base - The checkbox's exported `base` part.
 * @csspart label - The container that wraps the default slot.
 * @csspart meta - The container that wraps the meta slot.
 */
export default class SlSelectableItem extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-checkbox': SlCheckbox
  };

  @query('.selectable-item__checkbox') checkbox: SlCheckbox;

  /** The value the item reports when selected, e.g. a document id. */
  @property() value = '';

  /** Draws the item in a checked state. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Disables the item, preventing selection. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  // The checkbox is the single source of truth for the checked state. This only keeps the host property
  // in sync and re-emits the change so listeners don't have to reach into the checkbox themselves.
  private handleCheckboxChange = (event: Event) => {
    this.checked = (event.target as SlCheckbox).checked;
    this.emit('sl-change');
  };

  // Clicking anywhere in the row forwards to the checkbox, the same way a native <label> would,
  // so there's a single source of truth and no risk of double-toggling.
  private handleRowClick = (event: Event) => {
    if (this.disabled || (event.target as Element).closest('sl-checkbox')) {
      return;
    }

    this.checkbox.click();
  };

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          'selectable-item': true,
          'selectable-item--checked': this.checked,
          'selectable-item--disabled': this.disabled
        })}
        @click=${this.handleRowClick}
      >
        <sl-checkbox
          part="checkbox"
          exportparts="base:checkbox__base"
          class="selectable-item__checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @sl-change=${this.handleCheckboxChange}
        ></sl-checkbox>

        <span part="label" class="selectable-item__label">
          <slot></slot>
        </span>

        <span part="meta" class="selectable-item__meta">
          <slot name="meta"></slot>
        </span>
      </div>
    `;
  }
}
