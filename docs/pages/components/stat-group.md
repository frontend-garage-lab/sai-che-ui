---
meta:
  title: Stat Group
  description: Stat groups lay out a row of stats that act as quick filters.
layout: component
---

Selecting a [stat](/components/stat) sets the group's `value` and emits `sl-change`. Selecting it again clears the
filter, unless the group is `required`. Stats are toggle buttons, so screen readers announce which filter is on.

```html:preview
<div class="stat-group-filter">
  <sl-stat-group label="Filter by status">
    <sl-stat value="working" count="8" variant="neutral">Working</sl-stat>
    <sl-stat value="signed" count="1" variant="primary">Signed</sl-stat>
    <sl-stat value="distributed" count="8" variant="success">Distributed</sl-stat>
    <sl-stat value="staging" count="0" variant="warning" disabled>Staging</sl-stat>
  </sl-stat-group>

  <p style="margin-top: 1rem;">Showing: <strong class="stat-group-filter__value">all documents</strong></p>
</div>

<script>
  const container = document.querySelector('.stat-group-filter');
  const group = container.querySelector('sl-stat-group');
  const output = container.querySelector('.stat-group-filter__value');

  group.addEventListener('sl-change', () => {
    output.textContent = group.value || 'all documents';
  });
</script>
```

## Examples

### KPI summary row

A dashboard summary row of four stats, with one selected as the active filter.

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

### Required selection

Add `required` when there's always exactly one view, e.g. switching between incoming and outgoing.

```html:preview
<sl-stat-group label="Direction" value="incoming" required>
  <sl-stat value="incoming" count="42">Incoming</sl-stat>
  <sl-stat value="outgoing" count="17">Outgoing</sl-stat>
</sl-stat-group>
```
