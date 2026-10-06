import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { LocalizeController } from '../../utilities/localize.js';
import { property, query, state } from 'lit/decorators.js';
import { watch } from '../../internal/watch.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlCheckbox from '../checkbox/checkbox.component.js';
import SlIconButton from '../icon-button/icon-button.component.js';
import SlOption from '../option/option.component.js';
import SlSelect from '../select/select.component.js';
import SlTableCell from '../table-cell/table-cell.component.js';
import SlTableColumn from '../table-column/table-column.component.js';
import SlTableRow from '../table-row/table-row.component.js';
import styles from './table.styles.js';
import type { CSSResultGroup } from 'lit';
import type { SlSelectEvent } from '../../events/events.js';

/** Elements that handle their own clicks, so clicking them must not change the row selection. */
const interactiveSelector =
  'a[href], button, input, select, textarea, sl-button, sl-icon-button, sl-checkbox, sl-switch, sl-select, sl-menu-item, sl-dropdown, [data-sl-table-interactive]';

/** The toolbar slot is meant for a handful of actions — beyond this it tends to wrap awkwardly. */
const maxToolbarActions = 10;

/**
 * @summary Tables display a list of records in columns, with optional sorting, row selection and pagination.
 * @documentation https://shoelace.style/components/table
 * @status experimental
 * @since 2.20
 *
 * @dependency sl-checkbox
 * @dependency sl-icon-button
 * @dependency sl-option
 * @dependency sl-select
 *
 * @event {{ selection: SlTableRow[] }} sl-table-selection-change - Emitted when the row selection changes.
 * @event {{ column: SlTableColumn, key: string, direction: 'asc' | 'desc' }} sl-table-sort - Emitted when the user
 *  sorts on a column.
 * @event {{ page: number, pageSize: number }} sl-table-page-change - Emitted when the user changes page or page size.
 * @event {{ row: SlTableRow, originalEvent: MouseEvent }} sl-table-row-context-menu - Emitted when a row is
 *  right-clicked. Call `preventDefault()` on `originalEvent` to suppress the browser's own context menu.
 * @event {{ row: SlTableRow, item: SlMenuItem }} sl-table-row-action - Emitted when an item in a row's action menu is
 *  selected.
 *
 * @slot - One `<sl-table-row>` per record.
 * @slot columns - One `<sl-table-column>` per column. They define the header and the table's column widths.
 * @slot toolbar - Content shown above the header, e.g. filters or action buttons. Reuse `<sl-button>` (with a
 *  `prefix` icon) for actions and keep it to 10 or fewer so the toolbar doesn't wrap awkwardly.
 * @slot empty - Content shown in place of the rows when the table has nothing to display.
 * @slot footer - Replaces the built-in pagination controls.
 *
 * @csspart base - The component's base wrapper.
 * @csspart toolbar - The container that wraps the toolbar slot.
 * @csspart header - The header row.
 * @csspart select-all - The select all checkbox, an `<sl-checkbox>` element.
 * @csspart actions-header - The empty header cell above the action column.
 * @csspart body - The container that wraps the rows.
 * @csspart empty - The container that wraps the empty slot.
 * @csspart footer - The container that wraps the footer.
 * @csspart summary - The "Showing x – y of z" text.
 * @csspart pagination - The container that wraps the pagination buttons.
 *
 * @cssproperty [--border-color=var(--sl-panel-border-color)] - The color of the table's borders.
 * @cssproperty [--border-radius=var(--sl-border-radius-medium)] - The radius of the table's outer border.
 * @cssproperty [--header-background-color=var(--sl-surface-sunken)] - The background color of the header row.
 * @cssproperty [--stripe-background-color=var(--sl-color-neutral-50)] - The background color of striped rows.
 * @cssproperty [--max-height=none] - The maximum height of the scrolling area that holds the header and the rows.
 */
export default class SlTable extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {
    'sl-checkbox': SlCheckbox,
    'sl-icon-button': SlIconButton,
    'sl-option': SlOption,
    'sl-select': SlSelect,
    'sl-table-cell': SlTableCell,
    'sl-table-column': SlTableColumn,
    'sl-table-row': SlTableRow
  };

  private readonly localize = new LocalizeController(this);
  private mutationObserver: MutationObserver;
  private isReorderingRows = false;
  private lastSelectedRow: SlTableRow | null = null;
  private readonly managedAlignmentCells = new WeakSet<Element>();

  @query('slot:not([name])') defaultSlot: HTMLSlotElement;
  @query('slot[name="columns"]') columnsSlot: HTMLSlotElement;

  @state() private visibleRowCount = 0;
  @state() private hasToolbar = false;

  /** An accessible label for the table, announced by screen readers. */
  @property() label = '';

  /**
   * The selection behavior of the table. `single` allows one row to be selected at a time, `multiple` shows checkboxes
   * and allows any number of rows to be selected.
   */
  @property({ reflect: true }) selection: 'none' | 'single' | 'multiple' = 'none';

  /** The `key` of the column the table is sorted by. An empty string means the table isn't sorted. */
  @property({ attribute: 'sort-column', reflect: true }) sortColumn = '';

  /** The direction rows are sorted in. */
  @property({ attribute: 'sort-direction', reflect: true }) sortDirection: 'asc' | 'desc' = 'asc';

  /**
   * How sorting is carried out. With `client`, the table reorders the rows itself using the cells' sort values. With
   * `server`, the table only emits `sl-table-sort` and expects you to supply the reordered rows.
   */
  @property({ attribute: 'sort-mode' }) sortMode: 'client' | 'server' = 'client';

  /** Shows the pagination controls in the table's footer. */
  @property({ type: Boolean, reflect: true }) paginate = false;

  /** The page that's currently displayed, starting at 1. */
  @property({ type: Number, reflect: true }) page = 1;

  /** The number of rows to show per page. */
  @property({ type: Number, attribute: 'page-size', reflect: true }) pageSize = 10;

  /**
   * The total number of records. Set this when the rows for the current page are supplied by a server, which also stops
   * the table from paginating the rows itself. Leave it unset to paginate the rows in the default slot.
   */
  @property({ type: Number, attribute: 'total-items' }) totalItems: number | undefined;

  /** The page sizes the user can choose from, e.g. `page-sizes="10 25 100"`. */
  @property({
    attribute: 'page-sizes',
    converter: {
      fromAttribute: (value: string | null) =>
        (value ?? '')
          .split(/[\s,]+/)
          .map(Number)
          .filter(size => Number.isFinite(size) && size > 0),
      toAttribute: (value: number[]) => value.join(' ')
    }
  })
  pageSizes: number[] = [10, 25, 50, 100];

  /**
   * Reserves a trailing column for row actions. Put an `<sl-menu>` in a row's `actions` slot and the row shows a button
   * that opens it.
   */
  @property({ type: Boolean, reflect: true }) actions = false;

  /** The label of the button that opens a row's action menu. */
  @property({ attribute: 'action-menu-label' }) actionMenuLabel = 'Actions';

  /** Draws alternating rows with a tinted background. */
  @property({ type: Boolean, reflect: true }) striped = false;

  /** Keeps the header visible while the table's rows scroll. Requires the table to have a constrained height. */
  @property({ type: Boolean, attribute: 'sticky-header', reflect: true }) stickyHeader = false;

  /** The label of the select all checkbox. */
  @property({ attribute: 'select-all-label' }) selectAllLabel = 'Select all rows';

  /** The label of the page size selector. */
  @property({ attribute: 'page-size-label' }) pageSizeLabel = 'Rows per page';

  /** The label of the first page button. */
  @property({ attribute: 'first-page-label' }) firstPageLabel = 'First page';

  /** The label of the previous page button. */
  @property({ attribute: 'previous-page-label' }) previousPageLabel = 'Previous page';

  /** The label of the next page button. */
  @property({ attribute: 'next-page-label' }) nextPageLabel = 'Next page';

  /** The label of the last page button. */
  @property({ attribute: 'last-page-label' }) lastPageLabel = 'Last page';

  /** Formats the text that summarizes the records on screen. Set it to localize or reword the summary. */
  @property({ attribute: false }) summaryFormatter: (start: number, end: number, total: number) => string = (
    start,
    end,
    total
  ) => (total === 0 ? 'No records to display' : `Showing ${start} – ${end} of ${total}`);

  /** Formats the text that reports the current page. */
  @property({ attribute: false }) pageFormatter: (page: number, pageCount: number) => string = (page, pageCount) =>
    `Page ${page} of ${pageCount}`;

  constructor() {
    super();
    this.addEventListener('click', this.handleClick);
    this.addEventListener('contextmenu', this.handleContextMenu);
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('sl-select', this.handleMenuSelect);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'grid');
  }

  async firstUpdated() {
    await this.updateComplete;

    // Rows and columns live in the light DOM, so we watch for structural changes as well as rows the consumer hides
    this.mutationObserver = new MutationObserver(this.handleLightDomChange);
    this.mutationObserver.observe(this, { childList: true, subtree: false, attributeFilter: ['hidden', 'width'] });
    this.syncTable();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.mutationObserver?.disconnect();
  }

  /** The number of records the table knows about, whether they're on screen or not. */
  get itemCount() {
    return this.totalItems ?? this.getRows().length;
  }

  /** The number of pages the records are spread over. */
  get pageCount() {
    return Math.max(1, Math.ceil(this.itemCount / this.pageSize));
  }

  private get paginatesRowsItself() {
    return this.paginate && this.totalItems === undefined;
  }

  /** Gets all the columns in the table, in document order. */
  getColumns(): SlTableColumn[] {
    return [...this.children].filter((child): child is SlTableColumn => SlTableColumn.isTableColumn(child));
  }

  /** Gets all the rows in the table, in document order, excluding rows the consumer has hidden. */
  getRows({ includeHidden = false } = {}): SlTableRow[] {
    return [...this.children].filter(
      (child): child is SlTableRow => SlTableRow.isTableRow(child) && (includeHidden || !child.hidden)
    );
  }

  /** Gets the rows that are on the current page. */
  getVisibleRows(): SlTableRow[] {
    return this.getRows().filter(row => !row.hasAttribute('data-sl-table-hidden'));
  }

  /** Gets the selected rows. */
  getSelection(): SlTableRow[] {
    return this.getRows().filter(row => row.selected);
  }

  /** Replaces the current selection with the given rows and emits `sl-table-selection-change`. */
  setSelection(rows: SlTableRow[]) {
    const next = new Set(rows.filter(row => !row.disabled));

    if (this.selection === 'single' && next.size > 1) {
      const [first] = [...next];
      next.clear();
      next.add(first);
    }

    let changed = false;

    for (const row of this.getRows({ includeHidden: true })) {
      const selected = next.has(row);

      if (row.selected !== selected) {
        row.selected = selected;
        changed = true;
      }
    }

    if (changed) {
      this.emit('sl-table-selection-change', { detail: { selection: this.getSelection() } });
    }

    this.requestUpdate();
  }

  /** Selects every selectable row on the current page. Only applies when selection is `multiple`. */
  selectAll() {
    if (this.selection !== 'multiple') return;
    this.setSelection(this.getVisibleRows().filter(row => !row.disabled));
  }

  /** Clears the selection. */
  clearSelection() {
    this.setSelection([]);
  }

  /** Navigates to the given page, clamped to the available pages, and emits `sl-table-page-change`. */
  goToPage(page: number) {
    const next = Math.min(Math.max(1, Math.trunc(page)), this.pageCount);

    if (next === this.page) return;

    this.page = next;
    this.emit('sl-table-page-change', { detail: { page: this.page, pageSize: this.pageSize } });
  }

  //
  // Syncing
  //

  private syncTable() {
    this.syncColumns();
    this.syncRows();
    this.applySort();
    this.applyPagination();
    this.requestUpdate();
  }

  private syncColumns() {
    const columns = this.getColumns();
    const tracks = columns.map(column => column.width || '1fr');
    const template = [this.selection === 'multiple' ? 'min-content' : '', ...tracks, this.actions ? 'min-content' : '']
      .filter(Boolean)
      .join(' ');

    this.style.setProperty('--sl-table-column-template', template || '1fr');

    for (const column of columns) {
      column.sortDirection = column.key && column.key === this.sortColumn ? this.sortDirection : 'none';
    }
  }

  private syncRows() {
    const columns = this.getColumns();
    const rows = this.getRows();

    this.setAttribute('aria-rowcount', String(this.itemCount));
    this.setAttribute('aria-multiselectable', this.selection === 'multiple' ? 'true' : 'false');

    for (const row of this.getRows({ includeHidden: true })) {
      row.selectionMode = this.selection;
      row.hasActionColumn = this.actions;
      row.actionMenuLabel = this.actionMenuLabel;

      // Column alignment cascades to cells that don't set their own
      row.getCells().forEach((cell, index) => {
        const align = columns[index]?.align;

        if (!cell.hasAttribute('align') || this.managedAlignmentCells.has(cell)) {
          if (align && align !== 'start') {
            cell.setAttribute('align', align);
            this.managedAlignmentCells.add(cell);
          } else if (this.managedAlignmentCells.has(cell)) {
            cell.removeAttribute('align');
            this.managedAlignmentCells.delete(cell);
          }
        }
      });
    }

    // Roving tabindex, so the table is a single tab stop
    const focusable = rows.find(row => row.selected && !row.disabled) ?? rows[0];
    rows.forEach(row => row.setAttribute('tabindex', row === focusable ? '0' : '-1'));
  }

  private applySort() {
    if (this.sortMode !== 'client' || !this.sortColumn) return;

    const columns = this.getColumns();
    const index = columns.findIndex(column => column.key === this.sortColumn);

    if (index === -1) return;

    const rows = this.getRows({ includeHidden: true });
    const direction = this.sortDirection === 'desc' ? -1 : 1;
    const collator = new Intl.Collator(this.localize.lang(), { numeric: true, sensitivity: 'base' });
    const sorted = [...rows].sort((a, b) => {
      const aValue = a.getCells()[index]?.getSortValue() ?? '';
      const bValue = b.getCells()[index]?.getSortValue() ?? '';
      return collator.compare(aValue, bValue) * direction;
    });

    // Reordering the light DOM triggers the mutation observer, so only touch it when the order actually changed
    if (sorted.every((row, i) => row === rows[i])) return;

    this.isReorderingRows = true;
    sorted.forEach(row => this.append(row));
    this.isReorderingRows = false;
  }

  private applyPagination() {
    const rows = this.getRows();

    if (!this.paginatesRowsItself) {
      rows.forEach(row => row.removeAttribute('data-sl-table-hidden'));
      this.visibleRowCount = rows.length;
      return;
    }

    this.page = Math.min(Math.max(1, this.page), this.pageCount);

    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;

    rows.forEach((row, index) => row.toggleAttribute('data-sl-table-hidden', index < start || index >= end));
    this.visibleRowCount = Math.max(0, Math.min(end, rows.length) - start);
  }

  //
  // Event handlers
  //

  private handleLightDomChange = () => {
    if (this.isReorderingRows) return;
    this.syncTable();
  };

  private handleSlotChange = () => {
    this.syncTable();
  };

  private handleToolbarSlotChange = (event: Event) => {
    const assigned = (event.target as HTMLSlotElement).assignedElements({ flatten: true });
    this.hasToolbar = assigned.length > 0;

    const actionButtons = assigned.flatMap(element =>
      element.tagName === 'SL-BUTTON' ? [element] : [...element.querySelectorAll('sl-button')]
    );

    if (actionButtons.length > maxToolbarActions) {
      console.warn(
        `<sl-table> toolbar has ${actionButtons.length} <sl-button> actions, but only ${maxToolbarActions} are supported before it wraps awkwardly.`
      );
    }
  };

  private getRowFromEvent(event: Event): SlTableRow | null {
    for (const target of event.composedPath()) {
      if (!(target instanceof Element)) continue;
      if (SlTableRow.isTableRow(target)) return target;
      if (target === this) break;
    }

    return null;
  }

  private isInteractiveTarget(event: Event) {
    return event.composedPath().some(target => {
      if (!(target instanceof Element)) return false;
      if (SlTableRow.isTableRow(target)) return false;
      return target.matches?.(interactiveSelector) ?? false;
    });
  }

  private handleClick = (event: MouseEvent) => {
    const column = event
      .composedPath()
      .find((target): target is SlTableColumn => target instanceof Element && SlTableColumn.isTableColumn(target));

    if (column) {
      this.handleColumnClick(column);
      return;
    }

    if (this.selection === 'none' || this.isInteractiveTarget(event)) return;

    const row = this.getRowFromEvent(event);

    if (!row || row.disabled) return;

    this.focusRow(row);

    if (this.selection === 'single') {
      this.setSelection([row]);
      this.lastSelectedRow = row;
      return;
    }

    if (event.shiftKey && this.lastSelectedRow) {
      this.selectRange(this.lastSelectedRow, row);
      return;
    }

    this.toggleRowSelection(row);
    this.lastSelectedRow = row;
  };

  private handleColumnClick(column: SlTableColumn) {
    if (!column.sortable || !column.key) return;

    const isSameColumn = this.sortColumn === column.key;

    this.sortDirection = isSameColumn && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column.key;

    this.emit('sl-table-sort', {
      detail: { column, key: column.key, direction: this.sortDirection }
    });
  }

  private handleMenuSelect = (event: SlSelectEvent) => {
    const row = this.getRowFromEvent(event);

    if (!row) return;

    this.emit('sl-table-row-action', { detail: { row, item: event.detail.item } });
  };

  private handleContextMenu = (event: MouseEvent) => {
    const row = this.getRowFromEvent(event);

    if (!row) return;

    // Right-clicking an unselected row selects it first, which is what users expect from a record list
    if (this.selection !== 'none' && !row.selected && !row.disabled) {
      this.setSelection([row]);
      this.lastSelectedRow = row;
    }

    this.emit('sl-table-row-context-menu', { detail: { row, originalEvent: event } });
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    const rows = this.getVisibleRows();

    if (rows.length === 0) return;

    if (event.key === 'a' && (event.ctrlKey || event.metaKey) && this.selection === 'multiple') {
      event.preventDefault();
      this.selectAll();
      return;
    }

    const activeRow = this.getRowFromEvent(event);

    if (!activeRow) return;

    const index = rows.indexOf(activeRow);

    if ([' ', 'Enter'].includes(event.key)) {
      if (this.selection === 'none' || activeRow.disabled || this.isInteractiveTarget(event)) return;

      event.preventDefault();

      if (this.selection === 'single') {
        this.setSelection([activeRow]);
      } else {
        this.toggleRowSelection(activeRow);
      }

      this.lastSelectedRow = activeRow;
      return;
    }

    const nextIndex = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: rows.length - 1
    }[event.key];

    if (nextIndex === undefined || this.isInteractiveTarget(event)) return;

    event.preventDefault();
    this.focusRow(rows[Math.min(Math.max(0, nextIndex), rows.length - 1)]);
  };

  private focusRow(row: SlTableRow) {
    this.getRows().forEach(item => item.setAttribute('tabindex', item === row ? '0' : '-1'));
    row.focus();
  }

  private selectRange(from: SlTableRow, to: SlTableRow) {
    const rows = this.getVisibleRows();
    const start = rows.indexOf(from);
    const end = rows.indexOf(to);

    if (start === -1 || end === -1) {
      this.setSelection([to]);
      return;
    }

    const range = rows.slice(Math.min(start, end), Math.max(start, end) + 1);
    this.setSelection([...new Set([...this.getSelection(), ...range])]);
  }

  private toggleRowSelection(row: SlTableRow) {
    const selection = new Set(this.getSelection());

    if (selection.has(row)) {
      selection.delete(row);
    } else {
      selection.add(row);
    }

    this.setSelection([...selection]);
  }

  private handleSelectAllClick = (event: Event) => {
    const checkbox = event.target as SlCheckbox;

    if (checkbox.checked) {
      this.selectAll();
    } else {
      this.clearSelection();
    }
  };

  private handlePageSizeChange = (event: Event) => {
    const select = event.target as SlSelect;
    const pageSize = Number(select.value);

    if (!Number.isFinite(pageSize) || pageSize <= 0 || pageSize === this.pageSize) return;

    this.pageSize = pageSize;
    this.page = Math.min(this.page, this.pageCount);
    this.emit('sl-table-page-change', { detail: { page: this.page, pageSize: this.pageSize } });
  };

  //
  // Watchers
  //

  @watch('selection', { waitUntilFirstUpdate: true })
  handleSelectionChange() {
    if (this.selection === 'none') {
      this.getRows({ includeHidden: true }).forEach(row => (row.selected = false));
    }

    this.syncTable();
  }

  @watch(['actions', 'actionMenuLabel'], { waitUntilFirstUpdate: true })
  handleActionsChange() {
    this.syncColumns();
    this.syncRows();
  }

  @watch(['sortColumn', 'sortDirection'], { waitUntilFirstUpdate: true })
  handleSortChange() {
    this.syncColumns();
    this.applySort();
    this.applyPagination();
  }

  @watch(['page', 'pageSize', 'paginate', 'totalItems'], { waitUntilFirstUpdate: true })
  handlePaginationChange() {
    this.applyPagination();
  }

  render() {
    const isMultiple = this.selection === 'multiple';
    const selectableRows = this.getVisibleRows().filter(row => !row.disabled);
    const selectedCount = selectableRows.filter(row => row.selected).length;
    const isEmpty = this.visibleRowCount === 0;
    const start = this.itemCount === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.itemCount);

    return html`
      <div part="base" class="table">
        <div part="toolbar" class=${classMap({ table__toolbar: true, 'table__toolbar--empty': !this.hasToolbar })}>
          <slot name="toolbar" @slotchange=${this.handleToolbarSlotChange}></slot>
        </div>

        <div class="table__scroller">
          <div part="header" class="table__header" role="row">
            ${isMultiple
              ? html`
                  <div class="table__select-all">
                    <sl-checkbox
                      part="select-all"
                      title=${this.selectAllLabel}
                      ?checked=${selectableRows.length > 0 && selectedCount === selectableRows.length}
                      ?indeterminate=${selectedCount > 0 && selectedCount < selectableRows.length}
                      ?disabled=${selectableRows.length === 0}
                      @sl-change=${this.handleSelectAllClick}
                    ></sl-checkbox>
                  </div>
                `
              : ''}
            <slot name="columns" @slotchange=${this.handleSlotChange}></slot>
            ${this.actions ? html`<div part="actions-header" class="table__actions-header"></div>` : ''}
          </div>

          <div part="body" class="table__body" role="rowgroup">
            <slot @slotchange=${this.handleSlotChange}></slot>
            ${isEmpty
              ? html`<div part="empty" class="table__empty"><slot name="empty">No results found.</slot></div>`
              : ''}
          </div>
        </div>

        <slot name="footer">
          ${this.paginate
            ? html`
                <div part="footer" class="table__footer">
                  <span part="summary" class="table__summary">
                    ${this.summaryFormatter(start, end, this.itemCount)}
                  </span>

                  <div part="pagination" class="table__pagination">
                    <sl-icon-button
                      library="system"
                      name=${this.localize.dir() === 'rtl' ? 'chevron-double-right' : 'chevron-double-left'}
                      label=${this.firstPageLabel}
                      ?disabled=${this.page <= 1}
                      @click=${() => this.goToPage(1)}
                    ></sl-icon-button>
                    <sl-icon-button
                      library="system"
                      name=${this.localize.dir() === 'rtl' ? 'chevron-right' : 'chevron-left'}
                      label=${this.previousPageLabel}
                      ?disabled=${this.page <= 1}
                      @click=${() => this.goToPage(this.page - 1)}
                    ></sl-icon-button>

                    <span class="table__page-status">${this.pageFormatter(this.page, this.pageCount)}</span>

                    <sl-icon-button
                      library="system"
                      name=${this.localize.dir() === 'rtl' ? 'chevron-left' : 'chevron-right'}
                      label=${this.nextPageLabel}
                      ?disabled=${this.page >= this.pageCount}
                      @click=${() => this.goToPage(this.page + 1)}
                    ></sl-icon-button>
                    <sl-icon-button
                      library="system"
                      name=${this.localize.dir() === 'rtl' ? 'chevron-double-left' : 'chevron-double-right'}
                      label=${this.lastPageLabel}
                      ?disabled=${this.page >= this.pageCount}
                      @click=${() => this.goToPage(this.pageCount)}
                    ></sl-icon-button>
                  </div>

                  ${this.pageSizes.length > 1
                    ? html`
                        <label class="table__page-size">
                          ${this.pageSizeLabel}
                          <sl-select
                            size="small"
                            value=${String(this.pageSize)}
                            hoist
                            @sl-change=${this.handlePageSizeChange}
                          >
                            ${this.pageSizes.map(size => html`<sl-option value=${String(size)}>${size}</sl-option>`)}
                          </sl-select>
                        </label>
                      `
                    : ''}
                </div>
              `
            : ''}
        </slot>
      </div>
    `;
  }
}
