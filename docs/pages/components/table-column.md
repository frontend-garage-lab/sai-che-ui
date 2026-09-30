---
meta:
  title: Table Column
  description: Table columns define the header and the layout of a single column in a table.
layout: component
---

Table columns belong in a [table's](/components/table) `columns` slot. Their `width` values, in document order, make up
the table's grid template, so every row lines up with the header.

```html:preview
<sl-table>
  <sl-table-column slot="columns" key="protocol" width="14rem" sortable>Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>
  <sl-table-column slot="columns" key="attachments" width="8rem" align="end">Attachments</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell>L-SAI-EXT-7</sl-table-cell>
    <sl-table-cell>Key personnel for the project</sl-table-cell>
    <sl-table-cell>3</sl-table-cell>
  </sl-table-row>
</sl-table>
```

`width` accepts any CSS grid track value, so `1fr`, `auto`, `12rem` and `minmax(8rem, 1fr)` all work. `align` cascades
to the cells in the column unless a cell sets its own.
