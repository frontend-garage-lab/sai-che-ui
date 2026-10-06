---
meta:
  title: Table
  description: Tables display a list of records in columns, with optional sorting, row selection and pagination.
layout: component
---

Columns go in the `columns` slot and define both the header and the table's column widths. Each row contains one
`<sl-table-cell>` per column, in the same order.

```html:preview
<sl-table>
  <sl-table-column slot="columns" key="protocol" width="14rem">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>
  <sl-table-column slot="columns" key="type" width="10rem">Correspondence Type</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-table-cell>Key personnel for the project</sl-table-cell>
    <sl-table-cell>Letter</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="2">
    <sl-table-cell>MOM-001</sl-table-cell>
    <sl-table-cell>Kick off meeting</sl-table-cell>
    <sl-table-cell>Minutes of Meeting</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="3">
    <sl-table-cell>L-SAI-EXT-10</sl-table-cell>
    <sl-table-cell>Training session</sl-table-cell>
    <sl-table-cell>Letter</sl-table-cell>
  </sl-table-row>
</sl-table>
```

## Examples

### Sorting

Add `sortable` to a column to let users sort on it. The table sorts the rows itself using the text of the matching
cells, cycling between ascending and descending order, and emits `sl-table-sort` every time the sort changes.

Use `sort-value` on a cell when the text isn't sortable on its own, e.g. a formatted date or a status icon.

```html:preview
<sl-table sort-column="date" sort-direction="desc">
  <sl-table-column slot="columns" key="protocol" sortable width="14rem">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject" sortable>Subject</sl-table-column>
  <sl-table-column slot="columns" key="date" sortable width="10rem">Date</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-table-cell>Key personnel for the project</sl-table-cell>
    <sl-table-cell sort-value="2021-01-18">18 Jan 2021</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="2">
    <sl-table-cell>MOM-001</sl-table-cell>
    <sl-table-cell>Kick off meeting</sl-table-cell>
    <sl-table-cell sort-value="2021-02-01">1 Feb 2021</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="3">
    <sl-table-cell>L-SAI-EXT-10</sl-table-cell>
    <sl-table-cell>Training session</sl-table-cell>
    <sl-table-cell sort-value="2020-11-30">30 Nov 2020</sl-table-cell>
  </sl-table-row>
</sl-table>
```

:::tip
When the rows come from a server, set `sort-mode="server"`. The table then leaves the row order alone and only emits
`sl-table-sort` so you can refetch.
:::

### Selecting rows

Set `selection` to `single` or `multiple`. In multiple mode the table shows a checkbox on every row plus a select all
checkbox in the header, and supports <kbd>Shift</kbd> + click for ranges and <kbd>Ctrl/⌘</kbd> + <kbd>A</kbd> to select
the page. Clicks on links, buttons and other interactive content inside a cell never change the selection.

```html:preview
<sl-table class="selectable-table" selection="multiple">
  <sl-table-column slot="columns" key="protocol" width="14rem">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-table-cell>Key personnel for the project</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="2">
    <sl-table-cell>MOM-001</sl-table-cell>
    <sl-table-cell>Kick off meeting</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="3" disabled>
    <sl-table-cell>L-SAI-EXT-10</sl-table-cell>
    <sl-table-cell>Training session (locked)</sl-table-cell>
  </sl-table-row>
</sl-table>

<script>
  const table = document.querySelector('.selectable-table');

  table.addEventListener('sl-table-selection-change', event => {
    console.log(event.detail.selection.map(row => row.value));
  });
</script>
```

### Pagination

Add `paginate` to show the footer controls. By default the table paginates the rows in the default slot itself and
reports how many records are on screen.

```html:preview
<sl-table class="paginated-table" paginate page-size="2" page-sizes="2 5 10">
  <sl-table-column slot="columns" key="protocol" width="14rem">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-table-cell>Key personnel for the project</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="2">
    <sl-table-cell>MOM-001</sl-table-cell>
    <sl-table-cell>Kick off meeting</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="3">
    <sl-table-cell>L-SAI-EXT-10</sl-table-cell>
    <sl-table-cell>Training session</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="4">
    <sl-table-cell>L-SAI-EXT-11</sl-table-cell>
    <sl-table-cell>Site mobilization</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="5">
    <sl-table-cell>L-SAI-EXT-12</sl-table-cell>
    <sl-table-cell>Shipping schedule</sl-table-cell>
  </sl-table-row>
</sl-table>

<script>
  const table = document.querySelector('.paginated-table');

  table.addEventListener('sl-table-page-change', event => {
    console.log(event.detail.page, event.detail.pageSize);
  });
</script>
```

When a server returns one page at a time, set `total-items` to the full record count. The table then stops hiding rows
and expects you to replace them in response to `sl-table-page-change`.

Use `summaryFormatter` and `pageFormatter` to localize or reword the footer text:

```js
table.summaryFormatter = (start, end, total) => `Displaying ${start} - ${end} of ${total}`;
table.pageFormatter = (page, pageCount) => `Page ${page} of ${pageCount}`;
```

### Toolbar and empty state

The `toolbar` slot sits above the header — a good place for filters and actions. The `empty` slot replaces the rows
when there's nothing to display.

```html:preview
<sl-table>
  <div slot="toolbar" style="display: flex; gap: var(--sl-spacing-x-small); width: 100%;">
    <sl-input size="small" placeholder="Protocol number" clearable style="flex: 1 1 auto;"></sl-input>
    <sl-button size="small" variant="primary">Search</sl-button>
  </div>

  <sl-table-column slot="columns" key="protocol">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>

  <span slot="empty">No results found.</span>
</sl-table>
```

### Action buttons

Put up to 10 `<sl-button>` elements in the `toolbar` slot for actions like export, import or bulk approve. Add an
icon to the button's `prefix` slot to pair it with a label.

```html:preview
<sl-table>
  <div slot="toolbar" style="display: flex; gap: var(--sl-spacing-x-small);">
    <sl-button size="small" variant="default" outline>
      <sl-icon slot="prefix" name="download"></sl-icon>
      Export
    </sl-button>
    <sl-button size="small" variant="default" outline>
      <sl-icon slot="prefix" name="upload"></sl-icon>
      Import
    </sl-button>
    <sl-button size="small" variant="primary">
      <sl-icon slot="prefix" name="check2"></sl-icon>
      Approve
    </sl-button>
  </div>

  <sl-table-column slot="columns" key="protocol">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>
</sl-table>
```

### Status icons and alignment

Cells hold any content, so a status column is just icons or badges. Column alignment cascades to the cells below it.

```html:preview
<sl-table>
  <sl-table-column slot="columns" key="status" width="7rem" align="center">Quick Info</sl-table-column>
  <sl-table-column slot="columns" key="protocol" width="14rem">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>
  <sl-table-column slot="columns" key="attachments" width="8rem" align="end">Attachments</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell>
      <sl-badge variant="warning">O</sl-badge>
      <sl-badge variant="neutral">W</sl-badge>
    </sl-table-cell>
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-table-cell nowrap>Key personnel for the project</sl-table-cell>
    <sl-table-cell>3</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="2">
    <sl-table-cell>
      <sl-badge variant="success">I</sl-badge>
      <sl-badge variant="primary">S</sl-badge>
    </sl-table-cell>
    <sl-table-cell>MOM-001</sl-table-cell>
    <sl-table-cell nowrap>Kick off meeting</sl-table-cell>
    <sl-table-cell>0</sl-table-cell>
  </sl-table-row>
</sl-table>
```

### Action menus

Add `actions` to the table to reserve a trailing column, then put an `<sl-menu>` in each row's `actions` slot. The row
shows a button that opens it, and the table emits `sl-table-row-action` with both the row and the selected item.

```html:preview
<sl-table class="actions-table" actions selection="single">
  <sl-table-column slot="columns" key="protocol" width="14rem">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>

  <sl-table-row value="L-SAI-EXT-7">
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-table-cell>Key personnel for the project</sl-table-cell>
    <sl-menu slot="actions">
      <sl-menu-item value="properties">Properties</sl-menu-item>
      <sl-menu-item value="versions">View versions</sl-menu-item>
      <sl-menu-item value="download">Download</sl-menu-item>
      <sl-divider></sl-divider>
      <sl-menu-item value="check-in">Check in</sl-menu-item>
    </sl-menu>
  </sl-table-row>
  <sl-table-row value="MOM-001">
    <sl-table-cell>MOM-001</sl-table-cell>
    <sl-table-cell>Kick off meeting</sl-table-cell>
    <sl-menu slot="actions">
      <sl-menu-item value="properties">Properties</sl-menu-item>
      <sl-menu-item value="download">Download</sl-menu-item>
    </sl-menu>
  </sl-table-row>
  <sl-table-row value="L-SAI-EXT-10">
    <sl-table-cell>L-SAI-EXT-10</sl-table-cell>
    <sl-table-cell>No actions available</sl-table-cell>
  </sl-table-row>
</sl-table>

<script>
  const table = document.querySelector('.actions-table');

  table.addEventListener('sl-table-row-action', event => {
    console.log(event.detail.item.value, 'on', event.detail.row.value);
  });
</script>
```

Rows without an `actions` menu show a disabled button, so the columns stay aligned. Style the row's `action-trigger`
part to restyle the button itself.

### Context menus

Right-clicking a row selects it and emits `sl-table-row-context-menu`. Call `preventDefault()` on the original event to
replace the browser's own menu with your own.

```html:preview
<sl-table class="context-table" actions selection="single">
  <sl-table-column slot="columns" key="protocol" width="14rem">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-table-cell>Right-click me</sl-table-cell>
    <sl-menu slot="actions">
      <sl-menu-item value="properties">Properties</sl-menu-item>
      <sl-menu-item value="download">Download</sl-menu-item>
    </sl-menu>
  </sl-table-row>
  <sl-table-row value="2">
    <sl-table-cell>MOM-001</sl-table-cell>
    <sl-table-cell>Right-click me too</sl-table-cell>
    <sl-menu slot="actions">
      <sl-menu-item value="properties">Properties</sl-menu-item>
      <sl-menu-item value="download">Download</sl-menu-item>
    </sl-menu>
  </sl-table-row>
</sl-table>

<script>
  const table = document.querySelector('.context-table');

  table.addEventListener('sl-table-row-context-menu', event => {
    event.detail.originalEvent.preventDefault();

    // When the row has an `actions` menu, this opens it in place of the browser's menu
    event.detail.row.showActionMenu();
  });
</script>
```

### Striped and sticky

```html:preview
<sl-table striped sticky-header style="--max-height: 10rem;">
  <sl-table-column slot="columns" key="protocol" width="14rem">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>

  <sl-table-row value="1"><sl-table-cell>L-SAI-EXT-7</sl-table-cell><sl-table-cell>Key personnel</sl-table-cell></sl-table-row>
  <sl-table-row value="2"><sl-table-cell>MOM-001</sl-table-cell><sl-table-cell>Kick off meeting</sl-table-cell></sl-table-row>
  <sl-table-row value="3"><sl-table-cell>L-SAI-EXT-10</sl-table-cell><sl-table-cell>Training session</sl-table-cell></sl-table-row>
  <sl-table-row value="4"><sl-table-cell>L-SAI-EXT-11</sl-table-cell><sl-table-cell>Site mobilization</sl-table-cell></sl-table-row>
</sl-table>
```

:::tip
`sticky-header` only has an effect when the table's height is constrained, e.g. with the `--max-height` custom property.
:::

### Many columns

There's no limit to the number of columns — add as many `<sl-table-column>`/`<sl-table-cell>` pairs as the record
needs. When they don't fit the available width, the table scrolls horizontally.

```html:preview
<sl-table>
  <sl-table-column slot="columns" key="c1" width="10rem">Protocol</sl-table-column>
  <sl-table-column slot="columns" key="c2" width="10rem">Subject</sl-table-column>
  <sl-table-column slot="columns" key="c3" width="10rem">Type</sl-table-column>
  <sl-table-column slot="columns" key="c4" width="10rem">Status</sl-table-column>
  <sl-table-column slot="columns" key="c5" width="10rem">Discipline</sl-table-column>
  <sl-table-column slot="columns" key="c6" width="10rem">Originator</sl-table-column>
  <sl-table-column slot="columns" key="c7" width="10rem">Recipient</sl-table-column>
  <sl-table-column slot="columns" key="c8" width="10rem">Issue Date</sl-table-column>
  <sl-table-column slot="columns" key="c9" width="10rem">Due Date</sl-table-column>
  <sl-table-column slot="columns" key="c10" width="10rem">Revision</sl-table-column>
  <sl-table-column slot="columns" key="c11" width="10rem">Priority</sl-table-column>
  <sl-table-column slot="columns" key="c12" width="10rem">Project</sl-table-column>
  <sl-table-column slot="columns" key="c13" width="10rem">Contract</sl-table-column>
  <sl-table-column slot="columns" key="c14" width="10rem">Location</sl-table-column>
  <sl-table-column slot="columns" key="c15" width="10rem">Reference</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-table-cell>Key personnel for the project</sl-table-cell>
    <sl-table-cell>Letter</sl-table-cell>
    <sl-table-cell>Open</sl-table-cell>
    <sl-table-cell>Mechanical</sl-table-cell>
    <sl-table-cell>J. Smith</sl-table-cell>
    <sl-table-cell>A. Rossi</sl-table-cell>
    <sl-table-cell>18 Jan 2021</sl-table-cell>
    <sl-table-cell>1 Feb 2021</sl-table-cell>
    <sl-table-cell>Rev. 2</sl-table-cell>
    <sl-table-cell>High</sl-table-cell>
    <sl-table-cell>Saipem Alpha</sl-table-cell>
    <sl-table-cell>CT-2021-04</sl-table-cell>
    <sl-table-cell>Milan</sl-table-cell>
    <sl-table-cell>REF-1001</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="2">
    <sl-table-cell>MOM-001</sl-table-cell>
    <sl-table-cell>Kick off meeting</sl-table-cell>
    <sl-table-cell>Minutes of Meeting</sl-table-cell>
    <sl-table-cell>Closed</sl-table-cell>
    <sl-table-cell>Electrical</sl-table-cell>
    <sl-table-cell>M. Bianchi</sl-table-cell>
    <sl-table-cell>L. Verdi</sl-table-cell>
    <sl-table-cell>2 Feb 2021</sl-table-cell>
    <sl-table-cell>9 Feb 2021</sl-table-cell>
    <sl-table-cell>Rev. 1</sl-table-cell>
    <sl-table-cell>Medium</sl-table-cell>
    <sl-table-cell>Saipem Beta</sl-table-cell>
    <sl-table-cell>CT-2021-05</sl-table-cell>
    <sl-table-cell>Genoa</sl-table-cell>
    <sl-table-cell>REF-1002</sl-table-cell>
  </sl-table-row>
</sl-table>
```
