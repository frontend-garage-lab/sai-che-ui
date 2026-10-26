import { FlexRender, TableController } from '@tanstack/lit-table';
import { html, nothing } from 'lit';
import { LocalizeController } from '../../utilities/localize.js';
import { property, state } from 'lit/decorators.js';
import { slTableFeatures } from './table.types.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import SlCheckbox from '../checkbox/checkbox.component.js';
import SlDropdown from '../dropdown/dropdown.component.js';
import SlIcon from '../icon/icon.component.js';
import SlIconButton from '../icon-button/icon-button.component.js';
import SlOption from '../option/option.component.js';
import SlSelect from '../select/select.component.js';
import styles from './table.styles.js';
import type {
  Cell,
  LitTable,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  TableOptions
} from '@tanstack/lit-table';
import type { PropertyValues } from 'lit';
import type { SlSelectEvent } from '../../events/events.js';
import type { SlTableColumnDef, SlTableColumnMeta, SlTableFeatures } from './table.types.js';

type SlTableInstance<TData extends Record<string, unknown>> = LitTable<SlTableFeatures, TData>;

/** Elements that handle their own clicks, so clicking them must not change the row selection. */
const interactiveSelector =
  'a[href], button, input, select, textarea, sl-button, sl-icon-button, sl-checkbox, sl-switch, sl-select, sl-menu-item, sl-dropdown, [data-sl-table-interactive]';

/** The toolbar slot is meant for a handful of actions — beyond this it tends to wrap awkwardly. */
const maxToolbarActions = 10;

/**
 * @summary Tables display a list of records in columns, with optional sorting, row selection and pagination. Built on
 *  [TanStack Table](https://tanstack.com/table/latest).
 * @documentation https://shoelace.style/components/table
 * @status experimental
 * @since 2.21
 *
 * @dependency sl-checkbox
 * @dependency sl-dropdown
 * @dependency sl-icon-button
 * @dependency sl-option
 * @dependency sl-select
 *
 * @event {{ selection: unknown[] }} sl-table-selection-change - Emitted when the row selection changes.
 * @event {{ columnId: string, direction: 'asc' | 'desc' }} sl-table-sort - Emitted when the user sorts on a column.
 * @event {{ page: number, pageSize: number }} sl-table-page-change - Emitted when the user changes page or page size.
 * @event {{ row: unknown, originalEvent: MouseEvent }} sl-table-row-context-menu - Emitted when a row is
 *  right-clicked. Call `preventDefault()` on `originalEvent` to suppress the browser's own context menu.
 * @event {{ row: unknown, item: SlMenuItem }} sl-table-row-action - Emitted when an item in a row's action menu is
 *  selected.
 *
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
 * @csspart row - A body row.
 * @csspart cell - A body cell.
 * @csspart checkbox - A row's selection checkbox, an `<sl-checkbox>` element.
 * @csspart actions - The container that wraps a row's action menu trigger.
 * @csspart action-trigger - The button that opens a row's action menu, an `<sl-icon-button>` element.
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
export default class SlTable<TData extends Record<string, unknown> = Record<string, unknown>> extends ShoelaceElement {
  static styles = [componentStyles, styles];
  static dependencies = {
    'sl-checkbox': SlCheckbox,
    'sl-dropdown': SlDropdown,
    'sl-icon': SlIcon,
    'sl-icon-button': SlIconButton,
    'sl-option': SlOption,
    'sl-select': SlSelect
  };

  private readonly localize = new LocalizeController(this);
  private readonly tableController = new TableController<SlTableFeatures, TData>(this);

  @state() private rowSelection: RowSelectionState = {};
  @state() private hasToolbar = false;
  @state() private focusedRowId: string | null = null;

  /** The column definitions. Build this array once and keep the reference stable between renders. */
  @property({ attribute: false }) columns: SlTableColumnDef<TData>[] = [];

  /** The records to display. */
  @property({ attribute: false }) data: TData[] = [];

  /** Derives a stable row id from a record. Defaults to the record's position in `data`. */
  @property({ attribute: false }) getRowId: (row: TData, index: number) => string = (_row, index) => String(index);

  /** Returns `true` when a record can't be selected. */
  @property({ attribute: false }) rowDisabled: (row: TData, index: number) => boolean = () => false;

  /** Returns a coloured marker variant for a record's leading edge, e.g. to flag its status. */
  @property({ attribute: false }) rowVariant: (
    row: TData,
    index: number
  ) => '' | 'primary' | 'accent' | 'success' | 'neutral' | 'warning' | 'danger' = () => '';

  /** An accessible label for the table, announced by screen readers. */
  @property() label = '';

  /**
   * The selection behavior of the table. `single` allows one row to be selected at a time, `multiple` shows checkboxes
   * and allows any number of rows to be selected.
   */
  @property({ reflect: true }) selection: 'none' | 'single' | 'multiple' = 'none';

  /** The `id` of the column the table is sorted by. An empty string means the table isn't sorted. */
  @property({ attribute: 'sort-column', reflect: true }) sortColumn = '';

  /** The direction rows are sorted in. */
  @property({ attribute: 'sort-direction', reflect: true }) sortDirection: 'asc' | 'desc' = 'asc';

  /**
   * How sorting is carried out. With `client`, the table reorders the rows itself. With `server`, the table only emits
   * `sl-table-sort` and expects you to supply the reordered rows.
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
   * the table from paginating the rows itself. Leave it unset to paginate `data` in place.
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

  /** The label of the button that opens a row's action menu. */
  @property({ attribute: 'action-menu-label' }) actionMenuLabel = 'Actions';

  /** Draws alternating rows with a tinted background. */
  @property({ type: Boolean, reflect: true }) striped = false;

  /** Keeps the header visible while the table's rows scroll. Requires the table to have a constrained height. */
  @property({ type: Boolean, attribute: 'sticky-header', reflect: true }) stickyHeader = false;

  /**
   * Keeps the row action column (the ⋮ menu) pinned to the end side while the rows scroll horizontally, so the
   * actions stay reachable on wide tables. Only has an effect when a column has `meta.actions`.
   */
  @property({ type: Boolean, attribute: 'sticky-actions', reflect: true }) stickyActions = false;

  /**
   * Makes the table take the height of its container instead of its content: the rows scroll in the space left by the
   * toolbar and the pagination, which stay in place. The container needs a definite height, e.g. a grid cell.
   */
  @property({ type: Boolean, reflect: true }) fill = false;

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

  willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);

    const tracks = this.columns
      .filter(column => !this.isActionsColumn(column))
      .map(column => (column.meta as SlTableColumnMeta | undefined)?.width ?? 'minmax(0, 1fr)');
    const hasActionsColumn = this.columns.some(column => this.isActionsColumn(column));
    const template = [
      this.selection === 'multiple' ? 'min-content' : '',
      ...tracks,
      hasActionsColumn ? 'min-content' : ''
    ]
      .filter(Boolean)
      .join(' ');

    this.style.setProperty('--sl-table-column-template', template || '1fr');
    this.setAttribute('aria-rowcount', String(this.itemCount));
    this.setAttribute('aria-multiselectable', this.selection === 'multiple' ? 'true' : 'false');
  }

  private isActionsColumn(column: SlTableColumnDef<TData>) {
    return Boolean((column.meta as SlTableColumnMeta | undefined)?.actions);
  }

  private get table() {
    return this.tableController.table(this.buildOptions());
  }

  private buildOptions(): TableOptions<SlTableFeatures, TData> {
    const isServerPaginated = this.totalItems !== undefined;

    return {
      features: slTableFeatures,
      columns: this.columns,
      data: this.data,
      getRowId: this.getRowId,
      renderFallbackValue: null,
      manualSorting: this.sortMode === 'server',
      manualPagination: isServerPaginated,
      rowCount: isServerPaginated ? this.totalItems : undefined,
      enableMultiSort: false,
      enableSortingRemoval: false,
      enableRowSelection: row => this.selection !== 'none' && !this.rowDisabled(row.original, row.index),
      enableMultiRowSelection: this.selection === 'multiple',
      state: {
        sorting: this.sortColumn ? [{ id: this.sortColumn, desc: this.sortDirection === 'desc' }] : [],
        pagination: {
          pageIndex: this.page - 1,
          pageSize: this.paginate ? this.pageSize : Number.POSITIVE_INFINITY
        },
        rowSelection: this.rowSelection
      },
      onSortingChange: updater => this.handleSortingChange(updater),
      onPaginationChange: updater => this.handlePaginationChange(updater),
      onRowSelectionChange: updater => this.handleRowSelectionChange(updater)
    };
  }

  /** The number of records the table knows about, whether they're on screen or not. */
  get itemCount() {
    return this.totalItems ?? this.data.length;
  }

  /** The number of pages the records are spread over. */
  get pageCount() {
    return Math.max(1, this.table.getPageCount());
  }

  /** Gets the selected records. */
  getSelection(): TData[] {
    return this.data.filter((row, index) => this.rowSelection[this.getRowId(row, index)]);
  }

  /** Replaces the current selection with the given records and emits `sl-table-selection-change`. */
  setSelection(rows: TData[]) {
    const matches = new Set(rows);
    let next: RowSelectionState = {};

    this.data.forEach((row, index) => {
      if (matches.has(row) && !this.rowDisabled(row, index)) {
        next[this.getRowId(row, index)] = true;
      }
    });

    if (this.selection === 'single') {
      const [firstId] = Object.keys(next);
      next = firstId ? { [firstId]: true } : {};
    }

    const nextIds = Object.keys(next);
    const prevIds = Object.keys(this.rowSelection);
    const changed = nextIds.length !== prevIds.length || nextIds.some(id => !this.rowSelection[id]);

    if (!changed) return;

    this.rowSelection = next;
    this.emit('sl-table-selection-change', { detail: { selection: this.getSelection() } });
  }

  /** Selects every selectable row on the current page. Only applies when selection is `multiple`. */
  selectAll() {
    if (this.selection !== 'multiple') return;
    this.table.toggleAllPageRowsSelected(true);
  }

  /** Clears the selection. */
  clearSelection() {
    this.table.resetRowSelection(true);
  }

  /** Navigates to the given page, clamped to the available pages, and emits `sl-table-page-change`. */
  goToPage(page: number) {
    const next = Math.min(Math.max(1, Math.trunc(page)), this.pageCount);

    if (next === this.page) return;

    this.table.setPageIndex(next - 1);
  }

  //
  // State callbacks — the table's reactive properties are the source of truth, so these just mirror TanStack's
  // resulting state back into them and emit the matching public event.
  //

  private handleSortingChange: OnChangeFn<SortingState> = updater => {
    const prev: SortingState = this.sortColumn ? [{ id: this.sortColumn, desc: this.sortDirection === 'desc' }] : [];
    const next = typeof updater === 'function' ? updater(prev) : updater;
    const [nextSort] = next;
    const columnId = nextSort?.id ?? '';
    const direction: 'asc' | 'desc' = nextSort?.desc ? 'desc' : 'asc';

    if (columnId === this.sortColumn && direction === this.sortDirection) return;

    this.sortColumn = columnId;
    this.sortDirection = direction;
    this.emit('sl-table-sort', { detail: { columnId, direction } });
  };

  private handlePaginationChange: OnChangeFn<PaginationState> = updater => {
    const prev: PaginationState = {
      pageIndex: this.page - 1,
      pageSize: this.paginate ? this.pageSize : Number.POSITIVE_INFINITY
    };
    const next = typeof updater === 'function' ? updater(prev) : updater;
    const nextPage = next.pageIndex + 1;
    const nextPageSize = Number.isFinite(next.pageSize) ? next.pageSize : this.pageSize;

    if (nextPage === this.page && nextPageSize === this.pageSize) return;

    this.page = nextPage;
    this.pageSize = nextPageSize;
    this.emit('sl-table-page-change', { detail: { page: this.page, pageSize: this.pageSize } });
  };

  private handleRowSelectionChange: OnChangeFn<RowSelectionState> = updater => {
    const next = typeof updater === 'function' ? updater(this.rowSelection) : updater;
    this.rowSelection = next;
    this.emit('sl-table-selection-change', { detail: { selection: this.getSelection() } });
  };

  //
  // Event handlers
  //

  private findRowId(event: Event): string | null {
    for (const target of event.composedPath()) {
      if (!(target instanceof HTMLElement)) continue;
      if (target === this) break;
      if (target.dataset.rowId !== undefined) return target.dataset.rowId;
    }

    return null;
  }

  private findColumnId(event: Event): string | null {
    for (const target of event.composedPath()) {
      if (!(target instanceof HTMLElement)) continue;
      if (target === this) break;
      if (target.dataset.columnId !== undefined) return target.dataset.columnId;
    }

    return null;
  }

  private isInteractiveTarget(event: Event) {
    return event.composedPath().some(target => {
      if (!(target instanceof Element)) return false;
      if (target.hasAttribute('data-row-id')) return false;
      return target.matches?.(interactiveSelector) ?? false;
    });
  }

  private handleClick = (event: MouseEvent) => {
    const columnId = this.findColumnId(event);

    if (columnId) {
      this.table.getColumn(columnId)?.getToggleSortingHandler()?.(event);
      return;
    }

    if (this.selection === 'none' || this.isInteractiveTarget(event)) return;

    const rowId = this.findRowId(event);

    if (!rowId) return;

    const row = this.table.getRow(rowId);

    if (!row.getCanSelect()) return;

    this.focusRow(row);
    row.getToggleSelectedHandler()(event);
  };

  private handleMenuSelect = (event: SlSelectEvent) => {
    const rowId = this.findRowId(event);

    if (!rowId) return;

    const row = this.table.getRow(rowId);
    this.emit('sl-table-row-action', { detail: { row: row.original, item: event.detail.item } });
  };

  private handleContextMenu = (event: MouseEvent) => {
    const rowId = this.findRowId(event);

    if (!rowId) return;

    const table = this.table;
    const row = table.getRow(rowId);

    // Right-clicking an unselected row selects it first, which is what users expect from a record list
    if (this.selection !== 'none' && !row.getIsSelected() && row.getCanSelect()) {
      this.focusRow(row);
      row.toggleSelected(true);
    }

    this.emit('sl-table-row-context-menu', { detail: { row: row.original, originalEvent: event } });
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    const table = this.table;
    const rows = table.getRowModel().rows;

    if (rows.length === 0) return;

    if (event.key === 'a' && (event.ctrlKey || event.metaKey) && this.selection === 'multiple') {
      event.preventDefault();
      table.toggleAllPageRowsSelected(true);
      return;
    }

    const rowId = this.findRowId(event);

    if (!rowId) return;

    const activeRow = table.getRow(rowId);
    const index = rows.findIndex(row => row.id === activeRow.id);

    if ([' ', 'Enter'].includes(event.key)) {
      if (this.selection === 'none' || !activeRow.getCanSelect() || this.isInteractiveTarget(event)) return;

      event.preventDefault();
      activeRow.getToggleSelectedHandler()(event);
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

  private focusRow(row: Row<SlTableFeatures, TData>) {
    this.focusedRowId = row.id;
    void this.updateComplete.then(() => {
      this.shadowRoot!.querySelector<HTMLElement>(`[data-row-id="${row.id}"]`)?.focus();
    });
  }

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

    this.table.setPagination({ pageIndex: 0, pageSize });
  };

  //
  // Rendering
  //

  private renderHeaderRow(table: SlTableInstance<TData>) {
    const [headerGroup] = table.getHeaderGroups();
    const selectableRows = table.getRowModel().rows.filter(row => row.getCanSelect());
    const selectedCount = selectableRows.filter(row => row.getIsSelected()).length;
    const hasActionsColumn = this.columns.some(column => this.isActionsColumn(column));

    return html`
      <div part="header" class="table__header" role="row">
        ${this.selection === 'multiple'
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
        ${headerGroup?.headers.map(header => {
          if (this.isActionsColumn(header.column.columnDef)) return '';

          const meta = header.column.columnDef.meta as SlTableColumnMeta | undefined;
          const canSort = header.column.getCanSort();
          const sortDirection = header.column.getIsSorted();

          return html`
            <div
              part="column"
              class="table__column ${meta?.align ? `table__column--align-${meta.align}` : ''} ${canSort
                ? 'table__column--sortable'
                : ''}"
              role="columnheader"
              data-column-id=${header.column.id}
              tabindex=${canSort ? '0' : '-1'}
              aria-sort=${canSort ? (sortDirection ? `${sortDirection}ending` : 'none') : nothing}
            >
              <span part="column-label" class="table__column-label"
                >${header.isPlaceholder ? '' : FlexRender({ header })}</span
              >
              ${canSort
                ? html`
                    <sl-icon
                      part="sort-icon"
                      class="table__sort-icon ${sortDirection === 'asc'
                        ? 'table__sort-icon--ascending'
                        : ''} ${!sortDirection ? 'table__sort-icon--placeholder' : ''}"
                      library="system"
                      name="chevron-down"
                    ></sl-icon>
                  `
                : ''}
            </div>
          `;
        })}
        ${hasActionsColumn ? html`<div part="actions-header" class="table__actions-header"></div>` : ''}
      </div>
    `;
  }

  private renderCell(cell: Cell<SlTableFeatures, TData, unknown>) {
    const meta = cell.column.columnDef.meta as SlTableColumnMeta | undefined;

    return html`
      <div
        part="cell"
        class="table__cell ${meta?.align ? `table__cell--align-${meta.align}` : ''} ${meta?.nowrap
          ? 'table__cell--nowrap'
          : ''}"
        role="gridcell"
      >
        ${FlexRender({ cell })}
      </div>
    `;
  }

  private renderActionsCell(cell: Cell<SlTableFeatures, TData, unknown>) {
    const cellDef = cell.column.columnDef.cell;
    const content: unknown = typeof cellDef === 'function' ? cellDef(cell.getContext()) : null;
    const hasActions = content !== null && content !== undefined;

    return html`
      <div part="actions" class="table__row-actions" role="gridcell">
        <sl-dropdown class="table__action-menu" placement="bottom-end" hoist ?disabled=${!hasActions}>
          <sl-icon-button
            part="action-trigger"
            slot="trigger"
            class="table__action-trigger"
            library="system"
            name="three-dots-vertical"
            label=${this.actionMenuLabel}
            ?disabled=${!hasActions}
          ></sl-icon-button>
          ${content ?? ''}
        </sl-dropdown>
      </div>
    `;
  }

  private renderBodyRow(row: Row<SlTableFeatures, TData>, focusableRowId: string | undefined) {
    const cells = row.getAllCells();
    const actionsCell = cells.find(cell => this.isActionsColumn(cell.column.columnDef));
    const isFocusable = row.id === focusableRowId;
    const variant = this.rowVariant(row.original, row.index);
    const disabled = this.rowDisabled(row.original, row.index);

    return html`
      <div
        part="row"
        class="table__row"
        role="row"
        data-row-id=${row.id}
        tabindex=${isFocusable ? '0' : '-1'}
        variant=${variant || nothing}
        ?selected=${row.getIsSelected()}
        ?disabled=${disabled}
        aria-selected=${row.getIsSelected() ? 'true' : 'false'}
        aria-disabled=${disabled ? 'true' : 'false'}
      >
        ${this.selection === 'multiple'
          ? html`
              <div class="table__row-selection">
                <sl-checkbox
                  part="checkbox"
                  exportparts="base:checkbox__base"
                  ?checked=${row.getIsSelected()}
                  ?disabled=${disabled}
                  tabindex="-1"
                ></sl-checkbox>
              </div>
            `
          : ''}
        ${cells.filter(cell => !this.isActionsColumn(cell.column.columnDef)).map(cell => this.renderCell(cell))}
        ${actionsCell ? this.renderActionsCell(actionsCell) : ''}
      </div>
    `;
  }

  render() {
    const table = this.table;
    const rows = table.getRowModel().rows;
    const isEmpty = rows.length === 0;
    const start = this.itemCount === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.itemCount);
    const pageCount = Math.max(1, table.getPageCount());

    const defaultFocusableRowId =
      table.getSelectedRowModel().rows.find(selected => !this.rowDisabled(selected.original, selected.index))?.id ??
      rows[0]?.id;
    const focusableRowId =
      this.focusedRowId && rows.some(row => row.id === this.focusedRowId) ? this.focusedRowId : defaultFocusableRowId;

    return html`
      <div part="base" class="table">
        <div part="toolbar" class="table__toolbar ${this.hasToolbar ? '' : 'table__toolbar--empty'}">
          <slot name="toolbar" @slotchange=${this.handleToolbarSlotChange}></slot>
        </div>

        <div class="table__scroller">
          ${this.renderHeaderRow(table)}

          <div part="body" class="table__body" role="rowgroup">
            ${rows.map(row => this.renderBodyRow(row, focusableRowId))}
            ${isEmpty
              ? html`<div part="empty" class="table__empty"><slot name="empty">No results found.</slot></div>`
              : ''}
          </div>
        </div>

        <slot name="footer">
          ${this.paginate
            ? html`
                <div part="footer" class="table__footer">
                  <span part="summary" class="table__summary"
                    >${this.summaryFormatter(start, end, this.itemCount)}</span
                  >

                  <div part="pagination" class="table__pagination">
                    <sl-icon-button
                      library="system"
                      name=${this.localize.dir() === 'rtl' ? 'chevron-double-right' : 'chevron-double-left'}
                      label=${this.firstPageLabel}
                      ?disabled=${this.page <= 1}
                      @click=${() => table.firstPage()}
                    ></sl-icon-button>
                    <sl-icon-button
                      library="system"
                      name=${this.localize.dir() === 'rtl' ? 'chevron-right' : 'chevron-left'}
                      label=${this.previousPageLabel}
                      ?disabled=${this.page <= 1}
                      @click=${() => table.previousPage()}
                    ></sl-icon-button>

                    <span class="table__page-status">${this.pageFormatter(this.page, pageCount)}</span>

                    <sl-icon-button
                      library="system"
                      name=${this.localize.dir() === 'rtl' ? 'chevron-left' : 'chevron-right'}
                      label=${this.nextPageLabel}
                      ?disabled=${this.page >= pageCount}
                      @click=${() => table.nextPage()}
                    ></sl-icon-button>
                    <sl-icon-button
                      library="system"
                      name=${this.localize.dir() === 'rtl' ? 'chevron-double-left' : 'chevron-double-right'}
                      label=${this.lastPageLabel}
                      ?disabled=${this.page >= pageCount}
                      @click=${() => table.lastPage()}
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
