---
meta:
  title: Table Cell
  description: Table cells hold the content of a single column within a table row.
layout: component
---

Table cells go inside a [table row](/components/table-row), one per column and in the same order as the columns.

```html:preview
<sl-table>
  <sl-table-column slot="columns" key="status" width="7rem" align="center">Quick Info</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>
  <sl-table-column slot="columns" key="date" width="10rem">Date</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell><sl-badge variant="warning">O</sl-badge></sl-table-cell>
    <sl-table-cell nowrap>A subject long enough to be truncated instead of wrapping onto a second line</sl-table-cell>
    <sl-table-cell sort-value="2021-01-18">18 Jan 2021</sl-table-cell>
  </sl-table-row>
</sl-table>
```

Use `sort-value` when the displayed text isn't sortable on its own, such as a formatted date or a status icon, and
`nowrap` to truncate long content with an ellipsis.
