---
meta:
  title: Stat
  description: Stats show a count with a label, such as how many documents are in each status.
layout: component
---

Stats render as icon-first KPI cards: an icon in a tinted badge, a large count, and a label below it. The count is
formatted for the page's locale. Set `variant` to tint the icon badge with the same palette as [status](/components/status),
so a stat and the table cells it counts share one colour.

```html:preview
<sl-stat count="1284" variant="success">
  <sl-icon slot="prefix" name="check-circle"></sl-icon>
  Distributed
</sl-stat>
```

## Examples

### As filters

Put stats in a [stat group](/components/stat-group) to turn them into quick filters.

```html:preview
<sl-stat-group label="Filter by status" value="working">
  <sl-stat value="working" count="8" variant="neutral">
    <sl-icon slot="prefix" name="clock"></sl-icon>
    Working
  </sl-stat>
  <sl-stat value="signed" count="1" variant="primary">
    <sl-icon slot="prefix" name="pencil"></sl-icon>
    Signed
  </sl-stat>
  <sl-stat value="distributed" count="8" variant="success">
    <sl-icon slot="prefix" name="check-circle"></sl-icon>
    Distributed
  </sl-stat>
</sl-stat-group>
```

### KPI summary row

A dashboard summary, e.g. contract review/consolidation status, with one stat selected. Variants map to tones:
`success` for Safe, `warning` for Expiring, `danger` for Expired, and `accent` for Notified.

```html:preview
<sl-stat-group label="Filter by status" value="expiring">
  <sl-stat value="safe" count="128" variant="success">
    <sl-icon slot="prefix" name="shield-check"></sl-icon>
    Safe
  </sl-stat>
  <sl-stat value="expiring" count="14" variant="warning">
    <sl-icon slot="prefix" name="hourglass-split"></sl-icon>
    Expiring
  </sl-stat>
  <sl-stat value="expired" count="3" variant="danger">
    <sl-icon slot="prefix" name="exclamation-triangle"></sl-icon>
    Expired
  </sl-stat>
  <sl-stat value="notified" count="9" variant="accent">
    <sl-icon slot="prefix" name="bell"></sl-icon>
    Notified
  </sl-stat>
</sl-stat-group>
```

### Without an icon

The `prefix` slot is optional — the icon badge collapses when it's empty.

```html:preview
<sl-stat count="3">Checked out</sl-stat>
```
