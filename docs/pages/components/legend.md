---
meta:
  title: Legend
  description: Legends explain what the terms, symbols or colours of a view mean.
layout: component
---

A legend is a set of [legend items](/components/legend-item). Each item pairs a term, a symbol or a colour with what it
means. Use it next to a section title to define a term, or above a list to explain its badges. An icon in the `icon`
slot marks it as a note.

```html:preview
<sl-legend>
  <sl-icon slot="icon" name="info-circle"></sl-icon>
  <sl-legend-item term="Open">draft, in progress or rejected</sl-legend-item>
  <sl-legend-item term="Tasks">actions assigned to you</sl-legend-item>
</sl-legend>
```

## Examples

### Symbols

Put the symbol the user sees in the view in the `marker` slot of each item: a badge, a status or an icon. Use `label` to
name the group.

```html:preview
<sl-legend label="Bid status">
  <sl-legend-item><sl-badge slot="marker" variant="warning">O</sl-badge>Ongoing</sl-legend-item>
  <sl-legend-item><sl-badge slot="marker" variant="success">S</sl-badge>Submitted</sl-legend-item>
  <sl-legend-item><sl-badge slot="marker" variant="primary">A</sl-badge>Awarded</sl-legend-item>
  <sl-legend-item><sl-badge slot="marker" variant="accent">OH</sl-badge>On hold</sl-legend-item>
  <sl-legend-item><sl-badge slot="marker" variant="danger">L</sl-badge>Lost</sl-legend-item>
  <sl-legend-item><sl-badge slot="marker" variant="neutral">C</sl-badge>Cancelled</sl-legend-item>
</sl-legend>
```

### List

Set `layout="list"` to put one item per row, for example in a dialog or a panel. Markers share a column, so the
descriptions line up. Use `columns` to split a long list.

```html:preview
<div style="display: flex; flex-direction: column; gap: var(--sl-spacing-large);">
  <sl-legend label="Bid status" layout="list" columns="2">
    <sl-legend-item><sl-badge slot="marker" variant="warning">O</sl-badge>Ongoing</sl-legend-item>
    <sl-legend-item><sl-badge slot="marker" variant="primary">A</sl-badge>Awarded</sl-legend-item>
    <sl-legend-item><sl-badge slot="marker" variant="success">S</sl-badge>Submitted</sl-legend-item>
    <sl-legend-item><sl-badge slot="marker" variant="accent">OH</sl-badge>On hold</sl-legend-item>
  </sl-legend>

  <sl-legend label="Bid approval" layout="list">
    <sl-legend-item><sl-badge slot="marker" variant="neutral" pill>TE</sl-badge>Technical docs approved</sl-legend-item>
    <sl-legend-item><sl-badge slot="marker" variant="neutral" pill>CO</sl-badge>Commercial docs approved</sl-legend-item>
    <sl-legend-item><sl-badge slot="marker" variant="neutral" pill>PM</sl-badge>Bid docs shared with proposal</sl-legend-item>
  </sl-legend>
</div>
```

### Statuses

Any symbol works as a marker, for example the [status](/components/status) shown in a table column.

```html:preview
<sl-legend>
  <sl-legend-item><sl-status slot="marker" variant="primary" size="small"></sl-status>Waiting for an action</sl-legend-item>
  <sl-legend-item><sl-status slot="marker" variant="success" size="small"></sl-status>Completed</sl-legend-item>
  <sl-legend-item><sl-status slot="marker" variant="danger" size="small"></sl-status>Blocked</sl-legend-item>
</sl-legend>
```

### Colours

Without a marker, `variant` shows a colour swatch from the same palette as [status](/components/status) and
[stat](/components/stat), for example to explain the colours of a chart. Never use colour alone: the description always
says what the colour means.

```html:preview
<sl-legend>
  <sl-legend-item variant="success">Completed · 34</sl-legend-item>
  <sl-legend-item variant="warning">Open · 19</sl-legend-item>
  <sl-legend-item variant="danger">Rejected · 2</sl-legend-item>
</sl-legend>
```
