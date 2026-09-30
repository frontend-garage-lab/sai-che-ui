---
meta:
  title: Table Row
  description: Table rows hold a set of table cells inside a table.
layout: component
---

Table rows go in a [table's](/components/table) default slot and contain one [table cell](/components/table-cell) per
column. Give each row a `value` so selection events can tell you which records the user picked.

```html:preview
<sl-table selection="multiple">
  <sl-table-column slot="columns" key="protocol" width="14rem">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>

  <sl-table-row value="1" selected>
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-table-cell>Selected row</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="2">
    <sl-table-cell>MOM-001</sl-table-cell>
    <sl-table-cell>Normal row</sl-table-cell>
  </sl-table-row>
  <sl-table-row value="3" disabled>
    <sl-table-cell>L-SAI-EXT-10</sl-table-cell>
    <sl-table-cell>Disabled row</sl-table-cell>
  </sl-table-row>
</sl-table>
```

The checkbox shown in `multiple` selection mode is presentational — the table handles clicks for the whole row.

## Action menus

Put an `<sl-menu>` in the `actions` slot and the row shows a button that opens it, as long as the table has the
`actions` attribute. Call `showActionMenu()` to open it programmatically, e.g. from a `sl-table-row-context-menu`
handler.

```html:preview
<sl-table actions>
  <sl-table-column slot="columns" key="protocol">Protocol Number</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-menu slot="actions">
      <sl-menu-item value="properties">Properties</sl-menu-item>
      <sl-menu-item value="download">Download</sl-menu-item>
    </sl-menu>
  </sl-table-row>
</sl-table>
```
