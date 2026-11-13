---
meta:
  title: Table
  description: Tables display a list of records in columns, with optional sorting, row selection and pagination.
layout: component
---

Built on [TanStack Table](https://tanstack.com/table/latest). Set `columns` and `data` as properties — build the
`columns` array once and keep the reference stable, since it drives TanStack's internal memoization.

`columns`, `data` and `rowVariant` are properties, not attributes, so they cannot be written as HTML markup. In a
Lit template (or any framework that supports property bindings) bind them with the `.` prefix:

```ts
const columns = [
  { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number' },
  { id: 'subject', accessorKey: 'subject', header: 'Subject' }
];
const data = [{ protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project' }];

html`<sl-table .columns=${columns} .data=${data}></sl-table>`;
```

The Code Connect snippet of the Table in Figma Dev Mode uses this form.

```html:preview
<sl-table class="basic-table"></sl-table>

<script type="module">
  const table = document.querySelector('.basic-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' },
    { id: 'type', accessorKey: 'type', header: 'Correspondence Type', meta: { width: '10rem' } }
  ];

  table.data = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project', type: 'Letter' },
    { protocol: 'MOM-001', subject: 'Kick off meeting', type: 'Minutes of Meeting' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session', type: 'Letter' }
  ];
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
  type: string;
}

@Component({
  selector: 'app-table-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sl-table [columns]="columns" [data]="data"></sl-table>`
})
export class TableExampleComponent {
  // `columns` and `data` are properties, not attributes, so they need [] bindings. Keep both references stable:
  // TanStack memoizes on their identity, so a getter or an array literal written straight into the template would
  // hand the table a brand new array on every change detection run and throw that memoization away.
  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' },
    { id: 'type', accessorKey: 'type', header: 'Correspondence Type', meta: { width: '10rem' } }
  ];

  readonly data: Correspondence[] = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project', type: 'Letter' },
    { protocol: 'MOM-001', subject: 'Kick off meeting', type: 'Minutes of Meeting' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session', type: 'Letter' }
  ];
}
```

## Examples

### Sorting

Add `enableSorting: true` to a column to let users sort on it. The table sorts the rows itself, cycling between
ascending and descending order, and emits `sl-table-sort` every time the sort changes.

```html:preview
<sl-table class="sortable-table" sort-column="date" sort-direction="desc"></sl-table>

<script type="module">
  const table = document.querySelector('.sortable-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', enableSorting: true, meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject', enableSorting: true },
    { id: 'date', accessorKey: 'date', header: 'Date', enableSorting: true, meta: { width: '10rem' } }
  ];

  table.data = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project', date: '2021-01-18' },
    { protocol: 'MOM-001', subject: 'Kick off meeting', date: '2021-02-01' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session', date: '2020-11-30' }
  ];
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
  date: string;
}

@Component({
  selector: 'app-table-sorting-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-table
      [columns]="columns"
      [data]="data"
      [attr.sort-column]="sortColumn()"
      [attr.sort-direction]="sortDirection()"
      (sl-table-sort)="handleSort($event)"
    ></sl-table>
  `
})
export class TableSortingExampleComponent {
  readonly sortColumn = signal('date');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');

  readonly columns: SlTableColumnDef<Correspondence>[] = [
    {
      id: 'protocol',
      accessorKey: 'protocol',
      header: 'Protocol Number',
      enableSorting: true,
      meta: { width: '14rem' }
    },
    { id: 'subject', accessorKey: 'subject', header: 'Subject', enableSorting: true },
    { id: 'date', accessorKey: 'date', header: 'Date', enableSorting: true, meta: { width: '10rem' } }
  ];

  readonly data: Correspondence[] = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project', date: '2021-01-18' },
    { protocol: 'MOM-001', subject: 'Kick off meeting', date: '2021-02-01' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session', date: '2020-11-30' }
  ];

  // In the default client mode the table reorders the rows itself and then reports the new state, so the handler
  // only mirrors it back. Set sort-mode="server" instead and this is where you would refetch.
  handleSort(event: Event) {
    const { columnId, direction } = (event as CustomEvent<{ columnId: string; direction: 'asc' | 'desc' }>).detail;
    this.sortColumn.set(columnId);
    this.sortDirection.set(direction);
  }
}
```

:::tip
When the rows come from a server, set `sort-mode="server"`. The table then leaves `data`'s order alone and only emits
`sl-table-sort` so you can refetch.
:::

### Selecting rows

Set `selection` to `single` or `multiple`. In multiple mode the table shows a checkbox on every row plus a select all
checkbox in the header, and supports <kbd>Shift</kbd> + click for ranges and <kbd>Ctrl/⌘</kbd> + <kbd>A</kbd> to select
the page. Clicks on links, buttons and other interactive content inside a cell never change the selection. Use
`rowDisabled` to keep specific records out of the selection.

```html:preview
<sl-table class="selectable-table" selection="multiple"></sl-table>

<script type="module">
  const table = document.querySelector('.selectable-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  table.data = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project' },
    { protocol: 'MOM-001', subject: 'Kick off meeting' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session (locked)' }
  ];

  table.rowDisabled = row => row.protocol === 'L-SAI-EXT-10';

  table.addEventListener('sl-table-selection-change', event => {
    console.log(event.detail.selection.map(row => row.protocol));
  });
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
}

@Component({
  selector: 'app-table-selecting-rows-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-table
      selection="multiple"
      [columns]="columns"
      [data]="data"
      [rowDisabled]="rowDisabled"
      (sl-table-selection-change)="handleSelectionChange($event)"
    ></sl-table>
  `
})
export class TableSelectingRowsExampleComponent {
  readonly selection = signal<Correspondence[]>([]);

  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  readonly data: Correspondence[] = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project' },
    { protocol: 'MOM-001', subject: 'Kick off meeting' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session (locked)' }
  ];

  // A field holding an arrow function, not a method: the table stores the callback and calls it unbound, so a
  // method would lose `this`. The same applies to rowVariant and getRowId.
  readonly rowDisabled = (row: Correspondence) => row.protocol === 'L-SAI-EXT-10';

  handleSelectionChange(event: Event) {
    this.selection.set((event as CustomEvent<{ selection: Correspondence[] }>).detail.selection);
  }
}
```

### Pagination

Add `paginate` to show the footer controls. By default the table paginates `data` itself and reports how many records
are on screen.

```html:preview
<sl-table class="paginated-table" paginate page-size="2" page-sizes="2 5 10"></sl-table>

<script type="module">
  const table = document.querySelector('.paginated-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  table.data = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project' },
    { protocol: 'MOM-001', subject: 'Kick off meeting' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session' },
    { protocol: 'L-SAI-EXT-11', subject: 'Site mobilization' },
    { protocol: 'L-SAI-EXT-12', subject: 'Shipping schedule' }
  ];

  table.addEventListener('sl-table-page-change', event => {
    console.log(event.detail.page, event.detail.pageSize);
  });
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
}

@Component({
  selector: 'app-table-pagination-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-table
      paginate
      page-sizes="2 5 10"
      [columns]="columns"
      [data]="data"
      [page]="page()"
      [pageSize]="pageSize()"
      (sl-table-page-change)="handlePageChange($event)"
    ></sl-table>
  `
})
export class TablePaginationExampleComponent {
  readonly page = signal(1);
  readonly pageSize = signal(2);

  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  readonly data: Correspondence[] = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project' },
    { protocol: 'MOM-001', subject: 'Kick off meeting' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session' },
    { protocol: 'L-SAI-EXT-11', subject: 'Site mobilization' },
    { protocol: 'L-SAI-EXT-12', subject: 'Shipping schedule' }
  ];

  // `page` and `pageSize` are bound as properties so the component stays the source of truth. When a server
  // returns one page at a time, also set [totalItems] and replace `data` from this handler.
  handlePageChange(event: Event) {
    const { page, pageSize } = (event as CustomEvent<{ page: number; pageSize: number }>).detail;
    this.page.set(page);
    this.pageSize.set(pageSize);
  }
}
```

When a server returns one page at a time, set `total-items` to the full record count and pass just that page in
`data`. The table then stops paginating itself and expects you to replace `data` in response to `sl-table-page-change`.

Use `summaryFormatter` and `pageFormatter` to localize or reword the footer text:

```js
table.summaryFormatter = (start, end, total) => `Displaying ${start} - ${end} of ${total}`;
table.pageFormatter = (page, pageCount) => `Page ${page} of ${pageCount}`;
```

### Toolbar and empty state

The `toolbar` slot sits above the header — a good place for filters and actions. The `empty` slot replaces the rows
when there's nothing to display.

```html:preview
<sl-table class="toolbar-table">
  <div slot="toolbar" style="display: flex; gap: var(--sl-spacing-x-small); width: 100%;">
    <sl-input size="small" placeholder="Protocol number" clearable style="flex: 1 1 auto;"></sl-input>
    <sl-button size="small" variant="primary">Search</sl-button>
  </div>
  <span slot="empty">No results found.</span>
</sl-table>

<script type="module">
  const table = document.querySelector('.toolbar-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number' },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/input/input.js';
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
}

@Component({
  selector: 'app-table-toolbar-and-empty-state-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-table [columns]="columns" [data]="data">
      <div slot="toolbar" style="display: flex; gap: var(--sl-spacing-x-small); width: 100%;">
        <sl-input size="small" placeholder="Protocol number" clearable style="flex: 1 1 auto;"></sl-input>
        <sl-button size="small" variant="primary">Search</sl-button>
      </div>
      <span slot="empty">No results found.</span>
    </sl-table>
  `
})
export class TableToolbarAndEmptyStateExampleComponent {
  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number' },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  // Left empty on purpose: with no rows the table shows the `empty` slot in place of the body.
  readonly data: Correspondence[] = [];
}
```

### Action buttons

Put small `<sl-button>` elements with a prefix `<sl-icon>` in the `toolbar` slot for actions like download, upload or
delegate. Disable the actions that don't apply to the current selection. A trailing element, such as a record count,
can be pushed to the end of the toolbar with `margin-inline-start: auto`.

```html:preview
<sl-table class="toolbar-actions-table" selection="single">
  <div slot="toolbar" style="display: flex; align-items: center; gap: var(--sl-spacing-x-small); width: 100%;">
    <sl-button size="small"><sl-icon slot="prefix" name="download"></sl-icon>Download</sl-button>
    <sl-button size="small" disabled><sl-icon slot="prefix" name="upload"></sl-icon>Upload</sl-button>
    <sl-button size="small"><sl-icon slot="prefix" name="arrow-counterclockwise"></sl-icon>Refuse</sl-button>
    <sl-button size="small"><sl-icon slot="prefix" name="arrow-right"></sl-icon>Delegate</sl-button>
    <sl-button size="small"><sl-icon slot="prefix" name="check-square"></sl-icon>Acquire</sl-button>
    <sl-button size="small" disabled><sl-icon slot="prefix" name="check-square-fill"></sl-icon>Complete</sl-button>
    <span style="margin-inline-start: auto; color: var(--sl-color-neutral-500);">
      <strong style="color: var(--sl-color-neutral-900);">3</strong> tasks in review
    </span>
  </div>
</sl-table>

<script type="module">
  const table = document.querySelector('.toolbar-actions-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number' },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  table.data = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project' },
    { protocol: 'MOM-001', subject: 'Kick off meeting' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session' }
  ];
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/icon/icon.js';
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
}

@Component({
  selector: 'app-table-action-buttons-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-table selection="single" [columns]="columns" [data]="data">
      <div slot="toolbar" style="display: flex; align-items: center; gap: var(--sl-spacing-x-small); width: 100%;">
        <sl-button size="small"><sl-icon slot="prefix" name="download"></sl-icon>Download</sl-button>
        <sl-button size="small" disabled><sl-icon slot="prefix" name="upload"></sl-icon>Upload</sl-button>
        <sl-button size="small"><sl-icon slot="prefix" name="arrow-counterclockwise"></sl-icon>Refuse</sl-button>
        <sl-button size="small"><sl-icon slot="prefix" name="arrow-right"></sl-icon>Delegate</sl-button>
        <sl-button size="small"><sl-icon slot="prefix" name="check-square"></sl-icon>Acquire</sl-button>
        <sl-button size="small" disabled>
          <sl-icon slot="prefix" name="check-square-fill"></sl-icon>Complete
        </sl-button>
        <span style="margin-inline-start: auto; color: var(--sl-color-neutral-500);">
          <strong style="color: var(--sl-color-neutral-900);">3</strong> tasks in review
        </span>
      </div>
    </sl-table>
  `
})
export class TableActionButtonsExampleComponent {
  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number' },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  readonly data: Correspondence[] = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project' },
    { protocol: 'MOM-001', subject: 'Kick off meeting' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session' }
  ];
}
```

### Quick info cell

A quick-info column groups an `sl-status` dot (no label, the state in `title`) with a row marker made of an `sl-icon`.
The marker colour comes from the icon's `variant`: `neutral` while off, `success` once a comment is uploaded. The off
and on states also change shape (`chat` → `chat-fill`), so colour is never the only cue. Lay the elements out in a flex
row with an `x-small` gap and centred items so the dot and the icon share one centre line.

```html:preview
<sl-table class="quick-info-table"></sl-table>

<script type="module">
  import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
  // sl-status and sl-icon are rendered inside sl-table's own shadow DOM, where the autoloader can't see them.
  import '/dist/components/status/status.js';
  import '/dist/components/icon/icon.js';

  const table = document.querySelector('.quick-info-table');

  table.columns = [
    {
      id: 'info',
      header: '',
      meta: { width: '6rem' },
      cell: ({ row }) => html`
        <span style="display: inline-flex; align-items: center; gap: var(--sl-spacing-x-small);">
          <sl-status variant=${row.original.expiry} size="small" title=${row.original.expiry}></sl-status>
          <sl-icon
            variant=${row.original.commented ? 'success' : 'neutral'}
            name=${row.original.commented ? 'chat-fill' : 'chat'}
            title=${row.original.commented ? 'Review comment uploaded' : 'No review comment yet'}
          ></sl-icon>
        </span>
      `
    },
    { id: 'task', accessorKey: 'task', header: 'Task' }
  ];

  table.data = [
    { expiry: 'danger', commented: false, task: 'Key personnel for the project' },
    { expiry: 'warning', commented: false, task: 'Kick off meeting' },
    { expiry: 'success', commented: true, task: 'Piping layout review' }
  ];
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/icon/icon.js';
import '@saipem/design-system/%NPMDIR%/components/status/status.js';
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { html } from 'lit';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Task {
  expiry: 'danger' | 'warning' | 'success';
  commented: boolean;
  task: string;
}

@Component({
  selector: 'app-table-quick-info-cell-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sl-table [columns]="columns" [data]="data"></sl-table>`
})
export class TableQuickInfoCellExampleComponent {
  // A `cell` function must return a Lit template, not Angular markup: the table hands the result to TanStack's
  // FlexRender, which renders it inside sl-table's own shadow DOM where Angular's compiler never reaches. Import
  // `html` from lit and import every component used in a cell explicitly — the autoloader cannot see into that
  // shadow root either. This is the one place in an Angular app where you write Lit.
  readonly columns: SlTableColumnDef<Task>[] = [
    {
      id: 'info',
      header: '',
      meta: { width: '6rem' },
      cell: ({ row }) => html`
        <span style="display: inline-flex; align-items: center; gap: var(--sl-spacing-x-small);">
          <sl-status variant=${row.original.expiry} size="small" title=${row.original.expiry}></sl-status>
          <sl-icon
            variant=${row.original.commented ? 'success' : 'neutral'}
            name=${row.original.commented ? 'chat-fill' : 'chat'}
            title=${row.original.commented ? 'Review comment uploaded' : 'No review comment yet'}
          ></sl-icon>
        </span>
      `
    },
    { id: 'task', accessorKey: 'task', header: 'Task' }
  ];

  readonly data: Task[] = [
    { expiry: 'danger', commented: false, task: 'Key personnel for the project' },
    { expiry: 'warning', commented: false, task: 'Kick off meeting' },
    { expiry: 'success', commented: true, task: 'Piping layout review' }
  ];
}
```

### Quick info with badges

A quick-info cell can also be made of badges: the bid status as a square `sl-badge`, the document state and the
approvals as `pill` badges, followed by an `sl-icon`. Put the meaning of each code in `title`. In Figma the Content slot
of the Table Cell `Type=quick-info` proposes Status, Badge, Tag and every icon as preferred values, in any order.

```html:preview
<sl-table class="quick-info-badges-table"></sl-table>

<script type="module">
  import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
  // sl-badge and sl-icon are rendered inside sl-table's own shadow DOM, where the autoloader can't see them.
  import '/dist/components/badge/badge.js';
  import '/dist/components/icon/icon.js';

  const table = document.querySelector('.quick-info-badges-table');

  table.columns = [
    {
      id: 'info',
      header: 'Quick info',
      meta: { width: '14rem' },
      cell: () => html`
        <span style="display: inline-flex; align-items: center; gap: var(--sl-spacing-2x-small);">
          <sl-badge variant="warning" title="Bid status: Open">O</sl-badge>
          <sl-badge variant="success" pill title="Documents: Approved">A</sl-badge>
          <sl-badge variant="neutral" pill title="Technical evaluation">TE</sl-badge>
          <sl-icon name="link-45deg" title="Attachments"></sl-icon>
        </span>
      `
    },
    { id: 'number', accessorKey: 'number', header: 'Bid number' }
  ];

  table.data = [{ number: 'B-2026-0142' }, { number: 'B-2026-0157' }];
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/badge/badge.js';
import '@saipem/design-system/%NPMDIR%/components/icon/icon.js';
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { html } from 'lit';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Bid {
  number: string;
}

@Component({
  selector: 'app-table-quick-info-with-badges-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sl-table [columns]="columns" [data]="data"></sl-table>`
})
export class TableQuickInfoWithBadgesExampleComponent {
  readonly columns: SlTableColumnDef<Bid>[] = [
    {
      id: 'info',
      header: 'Quick info',
      meta: { width: '14rem' },
      cell: () => html`
        <span style="display: inline-flex; align-items: center; gap: var(--sl-spacing-2x-small);">
          <sl-badge variant="warning" title="Bid status: Open">O</sl-badge>
          <sl-badge variant="success" pill title="Documents: Approved">A</sl-badge>
          <sl-badge variant="neutral" pill title="Technical evaluation">TE</sl-badge>
          <sl-icon name="link-45deg" title="Attachments"></sl-icon>
        </span>
      `
    },
    { id: 'number', accessorKey: 'number', header: 'Bid number' }
  ];

  readonly data: Bid[] = [{ number: 'B-2026-0142' }, { number: 'B-2026-0157' }];
}
```

### Marker

Return a colour from `rowVariant` to flag a record with a coloured leading edge, independent of selection — useful
for drawing attention to a record's status at a glance.

```html:preview
<sl-table class="marker-table"></sl-table>

<script type="module">
  const table = document.querySelector('.marker-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' },
    { id: 'status', accessorKey: 'status', header: 'Status', meta: { width: '10rem' } }
  ];

  table.data = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project', status: 'Approved' },
    { protocol: 'MOM-001', subject: 'Kick off meeting', status: 'Pending' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session', status: 'Overdue' }
  ];

  table.rowVariant = row => {
    if (row.status === 'Approved') return 'success';
    if (row.status === 'Overdue') return 'danger';
    return '';
  };
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
  status: 'Approved' | 'Pending' | 'Overdue';
}

@Component({
  selector: 'app-table-marker-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sl-table [columns]="columns" [data]="data" [rowVariant]="rowVariant"></sl-table>`
})
export class TableMarkerExampleComponent {
  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' },
    { id: 'status', accessorKey: 'status', header: 'Status', meta: { width: '10rem' } }
  ];

  readonly data: Correspondence[] = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel for the project', status: 'Approved' },
    { protocol: 'MOM-001', subject: 'Kick off meeting', status: 'Pending' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session', status: 'Overdue' }
  ];

  // Returning '' leaves the row unmarked. Like rowDisabled, this is a field holding an arrow function so the
  // table can call it unbound.
  readonly rowVariant = (row: Correspondence): '' | 'success' | 'danger' => {
    if (row.status === 'Approved') return 'success';
    if (row.status === 'Overdue') return 'danger';
    return '';
  };
}
```

:::tip
The marker shares the same leading edge as row selection — when both apply to the same row, selection's colour
takes priority.
:::

### Action menus

Add a column with `meta: { actions: true }` and a `cell` function that returns an `<sl-menu>` for rows that have one
(return `null` for rows that shouldn't). The table reserves a trailing column, shows a button that opens the menu, and
emits `sl-table-row-action` with both the row and the selected item.

```html:preview
<sl-table class="actions-table" selection="single"></sl-table>

<script type="module">
  import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

  const table = document.querySelector('.actions-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' },
    {
      id: 'actions',
      meta: { actions: true },
      cell: ({ row }) =>
        row.original.actions
          ? html`
              <sl-menu>
                ${row.original.actions.map(action => html`<sl-menu-item value=${action}>${action}</sl-menu-item>`)}
              </sl-menu>
            `
          : null
    }
  ];

  table.data = [
    {
      protocol: 'L-SAI-EXT-7',
      subject: 'Key personnel for the project',
      actions: ['Properties', 'View versions', 'Download', 'Check in']
    },
    { protocol: 'MOM-001', subject: 'Kick off meeting', actions: ['Properties', 'Download'] },
    { protocol: 'L-SAI-EXT-10', subject: 'No actions available', actions: null }
  ];

  table.addEventListener('sl-table-row-action', event => {
    console.log(event.detail.item.value, 'on', event.detail.row.protocol);
  });
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/menu/menu.js';
import '@saipem/design-system/%NPMDIR%/components/menu-item/menu-item.js';
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { html } from 'lit';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
  actions: string[] | null;
}

@Component({
  selector: 'app-table-action-menus-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-table
      selection="single"
      [columns]="columns"
      [data]="data"
      (sl-table-row-action)="handleRowAction($event)"
    ></sl-table>
  `
})
export class TableActionMenusExampleComponent {
  readonly lastAction = signal('');

  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' },
    {
      id: 'actions',
      meta: { actions: true },
      // Return null for rows with no menu: the table still reserves the column and shows a disabled button, so
      // the columns stay aligned. Again a Lit template, not Angular markup.
      cell: ({ row }) =>
        row.original.actions
          ? html`
              <sl-menu>
                ${row.original.actions.map(action => html`<sl-menu-item value=${action}>${action}</sl-menu-item>`)}
              </sl-menu>
            `
          : null
    }
  ];

  readonly data: Correspondence[] = [
    {
      protocol: 'L-SAI-EXT-7',
      subject: 'Key personnel for the project',
      actions: ['Properties', 'View versions', 'Download', 'Check in']
    },
    { protocol: 'MOM-001', subject: 'Kick off meeting', actions: ['Properties', 'Download'] },
    { protocol: 'L-SAI-EXT-10', subject: 'No actions available', actions: null }
  ];

  handleRowAction(event: Event) {
    const { row, item } = (event as CustomEvent<{ row: Correspondence; item: { value: string } }>).detail;
    this.lastAction.set(`${item.value} on ${row.protocol}`);
  }
}
```

Rows without an actions menu show a disabled button, so the columns stay aligned. Style the `action-trigger` part to
restyle the button itself.

### Context menus

Right-clicking a row selects it and emits `sl-table-row-context-menu`. Call `preventDefault()` on the original event
to replace the browser's own menu with your own.

```html:preview
<sl-table class="context-table" selection="single"></sl-table>

<script type="module">
  const table = document.querySelector('.context-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  table.data = [
    { protocol: 'L-SAI-EXT-7', subject: 'Right-click me' },
    { protocol: 'MOM-001', subject: 'Right-click me too' }
  ];

  table.addEventListener('sl-table-row-context-menu', event => {
    event.detail.originalEvent.preventDefault();
    console.log('context menu for', event.detail.row.protocol);
  });
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
}

@Component({
  selector: 'app-table-context-menus-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-table
      selection="single"
      [columns]="columns"
      [data]="data"
      (sl-table-row-context-menu)="handleContextMenu($event)"
    ></sl-table>
  `
})
export class TableContextMenusExampleComponent {
  readonly target = signal('');

  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  readonly data: Correspondence[] = [
    { protocol: 'L-SAI-EXT-7', subject: 'Right-click me' },
    { protocol: 'MOM-001', subject: 'Right-click me too' }
  ];

  // preventDefault() goes on detail.originalEvent, not on the sl-table-row-context-menu event itself: it is the
  // browser's own menu you are suppressing. The row is already selected by the time this fires.
  handleContextMenu(event: Event) {
    const { row, originalEvent } = (event as CustomEvent<{ row: Correspondence; originalEvent: MouseEvent }>).detail;
    originalEvent.preventDefault();
    this.target.set(row.protocol);
  }
}
```

### Filling the container

Set `fill` to make the table take the height of its container, e.g. a grid cell, instead of the height of its rows. The
toolbar and the pagination stay in place and the rows scroll in the space between them, so the table lines up with a
neighbouring [detail panel](/components/detail-panel). The container needs a definite height.

```html:preview
<div style="height: 14rem;">
  <sl-table class="fill-table" fill sticky-header paginate page-size="25"></sl-table>
</div>

<script type="module">
  const table = document.querySelector('.fill-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  table.data = Array.from({ length: 12 }, (_, i) => ({ protocol: `MOM-${String(i + 1).padStart(3, '0')}`, subject: 'Meeting' }));
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
}

@Component({
  selector: 'app-table-filling-the-container-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="height: 14rem;">
      <sl-table fill sticky-header paginate page-size="25" [columns]="columns" [data]="data"></sl-table>
    </div>
  `
})
export class TableFillingTheContainerExampleComponent {
  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  // Built once in the field initializer, so the reference stays stable across change detection.
  readonly data: Correspondence[] = Array.from({ length: 12 }, (_, i) => ({
    protocol: `MOM-${String(i + 1).padStart(3, '0')}`,
    subject: 'Meeting'
  }));
}
```

### Striped and sticky

```html:preview
<sl-table class="striped-table" striped sticky-header style="--max-height: 10rem;"></sl-table>

<script type="module">
  const table = document.querySelector('.striped-table');

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  table.data = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel' },
    { protocol: 'MOM-001', subject: 'Kick off meeting' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session' },
    { protocol: 'L-SAI-EXT-11', subject: 'Site mobilization' }
  ];
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
}

@Component({
  selector: 'app-table-striped-and-sticky-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-table striped sticky-header style="--max-height: 10rem;" [columns]="columns" [data]="data"></sl-table>
  `
})
export class TableStripedAndStickyExampleComponent {
  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '14rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject' }
  ];

  readonly data: Correspondence[] = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel' },
    { protocol: 'MOM-001', subject: 'Kick off meeting' },
    { protocol: 'L-SAI-EXT-10', subject: 'Training session' },
    { protocol: 'L-SAI-EXT-11', subject: 'Site mobilization' }
  ];
}
```

:::tip
`sticky-header` only has an effect when the table's height is constrained, e.g. with the `--max-height` custom property.
:::

### Sizes

Set `size="small"` for a dense table: smaller text and tighter header and body cells. Use it for a table nested in
another table's cell, where each row holds a small matrix of data, and keep the default `medium` for page-level tables.

```html:preview
<sl-table class="sized-table"></sl-table>

<script type="module">
  import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

  const table = document.querySelector('.sized-table');

  const recipientColumns = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
    { id: 'reason', accessorKey: 'reason', header: 'Reason', meta: { width: '5rem' } }
  ];

  table.columns = [
    { id: 'distribution', accessorKey: 'distribution', header: 'Distribution', meta: { width: '8rem' } },
    {
      id: 'recipients',
      header: 'Recipients',
      cell: ({ row }) =>
        html`<sl-table
          size="small"
          label="Recipients of ${row.original.distribution}"
          .columns=${recipientColumns}
          .data=${row.original.recipients}
          style="flex: 1 1 auto; min-width: 0;"
        ></sl-table>`
    }
  ];

  table.data = [
    {
      distribution: '1.0010',
      recipients: [
        { name: 'Cazzaniga Alice', email: 'Alice.Cazzaniga@saipem.com', reason: 'Z' },
        { name: 'Aiello Ciro', email: 'Aiello.Ciro.Guest@saipem.com', reason: 'Z' }
      ]
    },
    {
      distribution: '1.0020',
      recipients: [{ name: 'Mario Rossi', email: 'Mario.Rossi@saipem.com', reason: 'A' }]
    }
  ];
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { html } from 'lit';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Recipient {
  name: string;
  email: string;
  reason: string;
}

interface Distribution {
  distribution: string;
  recipients: Recipient[];
}

@Component({
  selector: 'app-table-sizes-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sl-table [columns]="columns" [data]="data"></sl-table>`
})
export class TableSizesExampleComponent {
  // The nested table lives inside a cell, so it is created from a Lit template and its own columns and data are
  // bound with Lit's `.` prefix, not Angular's []. Keep `recipientColumns` outside the cell function so every
  // nested table receives the same array reference.
  private readonly recipientColumns: SlTableColumnDef<Recipient>[] = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
    { id: 'reason', accessorKey: 'reason', header: 'Reason', meta: { width: '5rem' } }
  ];

  readonly columns: SlTableColumnDef<Distribution>[] = [
    { id: 'distribution', accessorKey: 'distribution', header: 'Distribution', meta: { width: '8rem' } },
    {
      id: 'recipients',
      header: 'Recipients',
      cell: ({ row }) =>
        html`<sl-table
          size="small"
          label="Recipients of ${row.original.distribution}"
          .columns=${this.recipientColumns}
          .data=${row.original.recipients}
          style="flex: 1 1 auto; min-width: 0;"
        ></sl-table>`
    }
  ];

  readonly data: Distribution[] = [
    {
      distribution: '1.0010',
      recipients: [
        { name: 'Cazzaniga Alice', email: 'Alice.Cazzaniga@saipem.com', reason: 'Z' },
        { name: 'Aiello Ciro', email: 'Aiello.Ciro.Guest@saipem.com', reason: 'Z' }
      ]
    },
    {
      distribution: '1.0020',
      recipients: [{ name: 'Mario Rossi', email: 'Mario.Rossi@saipem.com', reason: 'A' }]
    }
  ];
}
```

### Sticky Row Actions

Add the `sticky-actions` attribute to keep the row action column (the ⋮ menu of a column with `meta.actions`) pinned to the end side while a wide table scrolls horizontally. The pinned cells take the row's background, so hover, selection and striping stay consistent. It is opt-in: tables that fit their container don't need it.

```html:preview
<sl-table class="sticky-actions-table" sticky-actions style="max-width: 32rem;"></sl-table>

<script type="module">
  import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

  const table = document.querySelector('.sticky-actions-table');

  const menu = () => html`
    <sl-menu>
      <sl-menu-item value="edit">Edit</sl-menu-item>
      <sl-menu-item value="delete">Delete</sl-menu-item>
    </sl-menu>
  `;

  table.columns = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '12rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject', meta: { width: '14rem' } },
    { id: 'owner', accessorKey: 'owner', header: 'Owner', meta: { width: '10rem' } },
    { id: 'date', accessorKey: 'date', header: 'Date', meta: { width: '8rem' } },
    { id: 'actions', meta: { actions: true }, cell: menu }
  ];

  table.data = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel', owner: 'Aiello Ciro', date: '14-Oct-2026' },
    { protocol: 'MOM-001', subject: 'Kick off meeting', owner: 'Cazzaniga Alice', date: '12-Oct-2026' }
  ];
</script>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/menu/menu.js';
import '@saipem/design-system/%NPMDIR%/components/menu-item/menu-item.js';
import '@saipem/design-system/%NPMDIR%/components/table/table.js';
import { html } from 'lit';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { SlTableColumnDef } from '@saipem/design-system/%NPMDIR%/components/table/table.types.js';

interface Correspondence {
  protocol: string;
  subject: string;
  owner: string;
  date: string;
}

@Component({
  selector: 'app-table-sticky-row-actions-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-table sticky-actions style="max-width: 32rem;" [columns]="columns" [data]="data"></sl-table>
  `
})
export class TableStickyRowActionsExampleComponent {
  private readonly menu = () => html`
    <sl-menu>
      <sl-menu-item value="edit">Edit</sl-menu-item>
      <sl-menu-item value="delete">Delete</sl-menu-item>
    </sl-menu>
  `;

  readonly columns: SlTableColumnDef<Correspondence>[] = [
    { id: 'protocol', accessorKey: 'protocol', header: 'Protocol Number', meta: { width: '12rem' } },
    { id: 'subject', accessorKey: 'subject', header: 'Subject', meta: { width: '14rem' } },
    { id: 'owner', accessorKey: 'owner', header: 'Owner', meta: { width: '10rem' } },
    { id: 'date', accessorKey: 'date', header: 'Date', meta: { width: '8rem' } },
    { id: 'actions', meta: { actions: true }, cell: this.menu }
  ];

  readonly data: Correspondence[] = [
    { protocol: 'L-SAI-EXT-7', subject: 'Key personnel', owner: 'Aiello Ciro', date: '14-Oct-2026' },
    { protocol: 'MOM-001', subject: 'Kick off meeting', owner: 'Cazzaniga Alice', date: '12-Oct-2026' }
  ];
}
```
