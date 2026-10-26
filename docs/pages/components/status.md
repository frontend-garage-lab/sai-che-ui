---
meta:
  title: Status
  description: Statuses pair a coloured dot with a short label to show the state of a record.
layout: component
---

Use a status wherever a record's state appears in a list, most often in a [table](/components/table) cell. The dot
carries the colour and the label stays neutral, so a column of statuses reads as text rather than as a row of coloured
blocks.

```html:preview
<sl-status variant="neutral">Working</sl-status>
```

## Examples

### Variants

Set `variant` to match the meaning of the state.

```html:preview
<div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
  <sl-status variant="neutral">Neutral</sl-status>
  <sl-status variant="primary">Primary</sl-status>
  <sl-status variant="success">Success</sl-status>
  <sl-status variant="warning">Warning</sl-status>
  <sl-status variant="danger">Danger</sl-status>
  <sl-status variant="accent">Accent</sl-status>
</div>
```

### Correspondence lifecycle

Map each lifecycle state to one variant and use the same mapping everywhere: tables, detail panels and
[stats](/components/stat). Don't reuse the accent orange for a state; keep it for brand highlights such as "New".

| State                         | Variant   |
| ----------------------------- | --------- |
| Working (draft)               | `neutral` |
| Signed                        | `primary` |
| Distributed                   | `success` |
| Staging (Collaboration Space) | `warning` |
| Rejected / Overdue            | `danger`  |

```html:preview
<sl-table>
  <sl-table-column slot="columns" key="protocol" width="14rem">Protocol Number</sl-table-column>
  <sl-table-column slot="columns" key="subject">Subject</sl-table-column>
  <sl-table-column slot="columns" key="status" width="10rem">Status</sl-table-column>

  <sl-table-row value="1">
    <sl-table-cell>MZ-CCX-L-RDW-100021</sl-table-cell>
    <sl-table-cell>KOM for electrical works</sl-table-cell>
    <sl-table-cell><sl-status variant="neutral">Working</sl-status></sl-table-cell>
  </sl-table-row>
  <sl-table-row value="2">
    <sl-table-cell>MZ-CCX-L-ISO-10001</sl-table-cell>
    <sl-table-cell>Insurance certificates</sl-table-cell>
    <sl-table-cell><sl-status variant="primary">Signed</sl-status></sl-table-cell>
  </sl-table-row>
  <sl-table-row value="3">
    <sl-table-cell>MZ-CCX-M-RDW-10002</sl-table-cell>
    <sl-table-cell>Minutes of meeting</sl-table-cell>
    <sl-table-cell><sl-status variant="success">Distributed</sl-status></sl-table-cell>
  </sl-table-row>
  <sl-table-row value="4">
    <sl-table-cell>ATB-SPM-LET-CIV-0019</sl-table-cell>
    <sl-table-cell>Client correspondence</sl-table-cell>
    <sl-table-cell><sl-status variant="warning">Staging</sl-status></sl-table-cell>
  </sl-table-row>
</sl-table>
```

### Filled

Add `filled` when the state must stand out at a glance, e.g. in a short table of reviewers or in a detail panel. The
label takes the variant colour on a soft background; the dot stays, so the state never relies on colour alone. Keep the
default in long columns of states, where coloured blocks would compete with the data.

```html:preview
<div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
  <sl-status filled size="small" variant="neutral">Not acquired</sl-status>
  <sl-status filled size="small" variant="warning">Acquired</sl-status>
  <sl-status filled size="small" variant="success">Completed</sl-status>
  <sl-status filled size="small" variant="danger">Refused</sl-status>
  <sl-status filled size="small" variant="primary">Notified</sl-status>
</div>
```

### Status or tag?

Use a **status** for a value that changes through the workflow (a document's lifecycle, a task's progress). Use a
[tag](/components/tag) for a label that classifies a record and doesn't change with the flow, such as a category or an
applied filter. Use a [badge](/components/badge) for counts. The same state always uses the same component, wherever it
appears: list, detail panel, dialog or description list.

### Ongoing states

Add `pulse` when the state is still in progress, e.g. while a distribution is being sent. The animation is turned off
for users who prefer reduced motion.

```html:preview
<sl-status variant="primary" pulse>Distributing…</sl-status>
```

### Sizes

Use `size="small"` in dense lists and detail panels.

```html:preview
<div style="display: flex; gap: 1.5rem; align-items: center;">
  <sl-status size="small" variant="success">Distributed</sl-status>
  <sl-status variant="success">Distributed</sl-status>
</div>
```
