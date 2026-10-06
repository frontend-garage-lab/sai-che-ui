---
meta:
  title: Selectable Item
  description: A compact, checkable row for small selection lists, e.g. picking documents inside a dialog.
layout: component
---

Selectable items are lightweight rows for small selection lists — smaller than a full [table row](/components/table-row),
and meant to live inside things like a dialog. Each one wraps an [`sl-checkbox`](/components/checkbox), a primary
label in the default slot, and an optional secondary value in the `meta` slot.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.25rem;">
  <sl-selectable-item value="doc-1" checked>
    Statement of Work.pdf
    <span slot="meta">Oct 3, 2026</span>
  </sl-selectable-item>
  <sl-selectable-item value="doc-2">
    Amendment 1.pdf
    <span slot="meta">Sep 18, 2026</span>
  </sl-selectable-item>
  <sl-selectable-item value="doc-3" disabled>
    Signature Page.pdf
    <span slot="meta">Aug 2, 2026</span>
  </sl-selectable-item>
</div>
```

The label truncates with an ellipsis when it's too long for the row, and the whole row is clickable, not just the
checkbox.

## Examples

### Listening for changes

Selecting or clearing an item emits `sl-change`. Combine multiple items to build a small selection list.

```html:preview
<div class="selectable-item-list" style="display: flex; flex-direction: column; gap: 0.25rem;">
  <sl-selectable-item value="doc-1">
    Statement of Work.pdf
    <span slot="meta">Oct 3, 2026</span>
  </sl-selectable-item>
  <sl-selectable-item value="doc-2">
    Amendment 1.pdf
    <span slot="meta">Sep 18, 2026</span>
  </sl-selectable-item>

  <p style="margin-top: 0.5rem;">Selected: <strong class="selectable-item-list__value">none</strong></p>
</div>

<script>
  const list = document.querySelector('.selectable-item-list');
  const output = list.querySelector('.selectable-item-list__value');

  list.addEventListener('sl-change', () => {
    const selected = [...list.querySelectorAll('sl-selectable-item')]
      .filter(item => item.checked)
      .map(item => item.value);

    output.textContent = selected.length ? selected.join(', ') : 'none';
  });
</script>
```

[component-metadata:sl-selectable-item]
