import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './stat-group.styles.js';
import type { CSSResultGroup } from 'lit';
import type SlStat from '../stat/stat.component.js';

/**
 * @summary Stat groups lay out a row of [stats](/components/stat) that act as quick filters: selecting one filters a
 *  list to that status, selecting it again clears the filter.
 * @documentation https://shoelace.style/components/stat-group
 * @status experimental
 * @since 2.20
 *
 * @slot - One or more `<sl-stat>` elements.
 *
 * @event sl-change - Emitted when the user selects or clears a stat.
 *
 * @csspart base - The component's base wrapper.
 */
export default class SlStatGroup extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];

  /** The value of the selected stat, or an empty string when none is selected. */
  @property({ reflect: true }) value = '';

  /** An accessible name for the group, e.g. "Filter by status". */
  @property() label = '';

  /** Stops users from clearing the selection by selecting the current stat again. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Gets the group's stats, in document order. */
  getStats(): SlStat[] {
    return [...this.children].filter(child => child.tagName.toLowerCase() === 'sl-stat') as SlStat[];
  }

  firstUpdated() {
    this.syncStats();
  }

  @watch('value', { waitUntilFirstUpdate: true })
  handleValueChange() {
    this.syncStats();
  }

  private syncStats() {
    for (const stat of this.getStats()) {
      stat.interactive = true;
      stat.selected = this.value !== '' && stat.value === this.value;
    }
  }

  private handleClick = (event: MouseEvent) => {
    const stat = (event.target as Element).closest('sl-stat');
    if (!stat || stat.parentElement !== this || stat.disabled) {
      return;
    }

    const next = stat.value === this.value && !this.required ? '' : stat.value;
    if (next !== this.value) {
      this.value = next;
      this.emit('sl-change');
    }
  };

  private handleSlotChange = () => {
    this.syncStats();
  };

  render() {
    return html`
      <div
        part="base"
        class="stat-group"
        role="group"
        aria-label=${ifDefined(this.label || undefined)}
        @click=${this.handleClick}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
}
