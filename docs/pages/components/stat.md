---
meta:
  title: Stat
  description: Stats show a count with a label, such as how many documents are in each status.
layout: component
---

The count is formatted for the page's locale. Set `variant` to add the same coloured dot as [status](/components/status),
so a stat and the table cells it counts share one colour.

```html:preview
<sl-stat count="1284" variant="success">Distributed</sl-stat>
```

## Examples

### As filters

Put stats in a [stat group](/components/stat-group) to turn them into quick filters.

```html:preview
<sl-stat-group label="Filter by status" value="working">
  <sl-stat value="working" count="8" variant="neutral">Working</sl-stat>
  <sl-stat value="signed" count="1" variant="primary">Signed</sl-stat>
  <sl-stat value="distributed" count="8" variant="success">Distributed</sl-stat>
</sl-stat-group>
```

### With an icon

Use the `prefix` slot for an icon instead of a dot.

```html:preview
<sl-stat count="3">
  <sl-icon slot="prefix" name="lock"></sl-icon>
  Checked out
</sl-stat>
```
