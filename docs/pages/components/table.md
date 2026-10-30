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

### Status icons and alignment

Cells hold any content a `cell` function returns, so a status column can combine a pulsing `sl-status` dot, a
decision `sl-badge` and an `sl-icon-button` for an attachment, as in the xCPage review table. Set `meta.align` on a
column to align its header and cells.

```html:preview
<sl-table class="status-table" selection="single">
  <div slot="toolbar" style="display: flex; align-items: center; gap: var(--sl-spacing-x-small); width: 100%;">
    <div style="display: flex; gap: var(--sl-spacing-3x-small);">
      <sl-tooltip content="Download document">
        <sl-icon-button name="download" label="Download document" variant="primary"></sl-icon-button>
      </sl-tooltip>
      <sl-tooltip content="Import comment">
        <sl-icon-button name="upload" label="Import comment" variant="neutral"></sl-icon-button>
      </sl-tooltip>
    </div>
    <sl-divider vertical style="height: 1.5rem;"></sl-divider>
    <div style="display: flex; gap: var(--sl-spacing-3x-small);">
      <sl-tooltip content="Release task">
        <sl-icon-button name="arrow-counterclockwise" label="Release task" variant="danger"></sl-icon-button>
      </sl-tooltip>
      <sl-tooltip content="Refresh list">
        <sl-icon-button name="arrow-clockwise" label="Refresh list" variant="primary"></sl-icon-button>
      </sl-tooltip>
    </div>
    <sl-divider vertical style="height: 1.5rem;"></sl-divider>
    <div style="display: flex; gap: var(--sl-spacing-3x-small);">
      <sl-tooltip content="Take task">
        <sl-icon-button name="check-lg" label="Take task" variant="accent" filled></sl-icon-button>
      </sl-tooltip>
      <sl-tooltip content="Complete review task">
        <sl-icon-button name="check2-circle" label="Complete review task" variant="neutral"></sl-icon-button>
      </sl-tooltip>
    </div>
    <span style="margin-inline-start: auto; color: var(--sl-color-neutral-500);">
      <strong style="color: var(--sl-color-neutral-900);">3</strong> tasks in review
    </span>
  </div>
</sl-table>

<script type="module">
  import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
  // sl-status is rendered inside sl-table's own shadow DOM, where the autoloader's mutation observer can't see
  // it, so it never gets auto-registered here — import it explicitly.
  import '/dist/components/status/status.js';

  const table = document.querySelector('.status-table');

  table.columns = [
    {
      id: 'status',
      header: '',
      meta: { width: '9rem' },
      cell: ({ row }) => html`
        <div style="display: flex; align-items: center; gap: var(--sl-spacing-x-small);">
          <sl-status variant=${row.original.variant} size="small" pulse title=${row.original.state}></sl-status>
          <sl-badge pill variant=${row.original.decision === 'Approver' ? 'success' : 'danger'}>
            ${row.original.decision}
          </sl-badge>
          ${row.original.hasComment
            ? html`<sl-icon-button
                name="file-earmark-pdf"
                label="Comment uploaded"
                variant="danger"
                style="scale: 0.75;"
              ></sl-icon-button>`
            : ''}
        </div>
      `
    },
    {
      id: 'task',
      header: 'Task',
      meta: { width: '14rem' },
      cell: ({ row }) => html`
        <div>
          <div>${row.original.title}</div>
          <div class="muted">${row.original.ref}</div>
        </div>
      `
    },
    {
      id: 'rev',
      header: 'Rev.',
      meta: { width: '4rem' },
      cell: ({ row }) => html`<sl-tag size="small" variant="neutral">${row.original.rev}</sl-tag>`
    },
    { id: 'created', accessorKey: 'created', header: 'Created', meta: { width: '8rem', nowrap: true } },
    { id: 'due', accessorKey: 'due', header: 'Due date', meta: { width: '8rem', nowrap: true } },
    { id: 'discipline', accessorKey: 'discipline', header: 'Discipline', meta: { width: '8rem' } },
    { id: 'originator', accessorKey: 'originator', header: 'Originator', meta: { width: '8rem' } }
  ];

  table.data = [
    {
      variant: 'danger',
      state: 'expired',
      decision: 'Reject',
      hasComment: true,
      title: 'Key personnel for the project',
      ref: 'L-SAI-EXT-7',
      rev: 'A1',
      created: '20-Feb-2026',
      due: '25-Jun-2026',
      discipline: 'CIVIL & ARCHITECTURE',
      originator: 'VDR-20240415'
    },
    {
      variant: 'success',
      state: 'safe',
      decision: 'Approver',
      hasComment: false,
      title: 'Kick off meeting',
      ref: 'MOM-001',
      rev: 'A',
      created: '12-Sep-2025',
      due: '01-Dec-2025',
      discipline: 'MECHANICAL',
      originator: 'VDR-20240512'
    }
  ];
</script>
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
