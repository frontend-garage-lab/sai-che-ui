import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlCheckbox from '../checkbox/checkbox.component.js';
import SlDropdown from '../dropdown/dropdown.component.js';
import SlIconButton from '../icon-button/icon-button.component.js';
import styles from './table-row.styles.js';
import type { CSSResultGroup } from 'lit';
import type SlTableCell from '../table-cell/table-cell.component.js';

/**
 * @summary Table rows hold a set of [table cells](/components/table-cell) inside a [table](/components/table).
 * @documentation https://shoelace.style/components/table-row
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-checkbox
 * @dependency sl-dropdown
 * @dependency sl-icon-button
 *
 * @slot - One `<sl-table-cell>` per column, in the same order as the table's columns.
 * @slot actions - An `<sl-menu>` of actions for this row. Shown in the table's trailing action column, which the table
 *  only reserves when it has the `actions` attribute.
 *
 * @csspart checkbox - The checkbox shown when the table's selection is `multiple`, an `<sl-checkbox>` element.
 * @csspart checkbox__base - The checkbox's exported `base` part.
 * @csspart actions - The container that wraps the action menu.
 * @csspart action-trigger - The button that opens the action menu, an `<sl-icon-button>` element.
 *
 * @cssproperty --marker-color - The colour of the `variant` marker. Defaults to the variant's colour.
 */
export default class SlTableRow extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-checkbox': SlCheckbox,
    'sl-dropdown': SlDropdown,
    'sl-icon-button': SlIconButton
  };

  @query('.row__action-menu') private actionDropdown: SlDropdown;

  /** A value that identifies the row, e.g. a record id. Reported by the table's selection events. */
  @property({ reflect: true }) value = '';

  /** Draws the row in a selected state. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Disables the row, preventing selection. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Draws a coloured marker on the row's leading edge, e.g. to flag its status. */
  @property({ reflect: true }) variant: '' | 'primary' | 'accent' | 'success' | 'neutral' | 'warning' | 'danger' = '';

  /** The parent table's selection mode. The table keeps this in sync — don't set it yourself. */
  @state() selectionMode: 'none' | 'single' | 'multiple' = 'none';

  /** Whether the parent table reserves a trailing action column. The table keeps this in sync. */
  @state() hasActionColumn = false;

  /** The label of the button that opens the action menu. The table keeps this in sync. */
  @state() actionMenuLabel = 'Actions';

  @state() private hasActions = false;

  /** Returns true if the given element is a table row. */
  static isTableRow(el: Element | null): el is SlTableRow {
    return el instanceof Element && el.getAttribute('role') === 'row' && el.hasAttribute('data-sl-table-row');
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'row');
    this.setAttribute('data-sl-table-row', '');
  }

  @watch('selected')
  handleSelectedChange() {
    this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
  }

  @watch('disabled')
  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  /** Opens this row's action menu. Does nothing when the row has no `actions` content. */
  async showActionMenu() {
    await this.updateComplete;
    await this.actionDropdown?.show();
  }

  /** Closes this row's action menu. */
  async hideActionMenu() {
    await this.actionDropdown?.hide();
  }

  private handleActionsSlotChange = (event: Event) => {
    this.hasActions = (event.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
  };

  /** Gets the cells in this row, in document order. */
  getCells(): SlTableCell[] {
    return [...this.children].filter(child => child.getAttribute('role') === 'gridcell') as SlTableCell[];
  }

  render() {
    return html`
      ${this.selectionMode === 'multiple'
        ? html`
            <div class="row__selection">
              <sl-checkbox
                part="checkbox"
                exportparts="base:checkbox__base"
                ?checked=${this.selected}
                ?disabled=${this.disabled}
                tabindex="-1"
              ></sl-checkbox>
            </div>
          `
        : ''}
      <slot></slot>

      ${this.hasActionColumn
        ? html`
            <div part="actions" class="row__actions">
              <sl-dropdown
                class="row__action-menu"
                placement="bottom-end"
                hoist
                ?disabled=${this.disabled || !this.hasActions}
              >
                <sl-icon-button
                  part="action-trigger"
                  slot="trigger"
                  class="row__action-trigger"
                  library="system"
                  name="three-dots-vertical"
                  label=${this.actionMenuLabel}
                  ?disabled=${this.disabled || !this.hasActions}
                ></sl-icon-button>
                <slot name="actions" @slotchange=${this.handleActionsSlotChange}></slot>
              </sl-dropdown>
            </div>
          `
        : html`<slot name="actions" hidden @slotchange=${this.handleActionsSlotChange}></slot>`}
    `;
  }
}
