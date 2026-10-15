---
meta:
  title: Detail Panel
  description: A non-modal panel that shows details for a selected item alongside the page.
layout: component
---

Detail panels show more information about a selected item without taking over the screen the way a
[dialog](/components/dialog) does, e.g. a document's review history shown next to the list it was selected from. The
header has a `label` slot for the title, a `meta` slot for a secondary line such as a revision code, an `actions` slot
for extra header buttons, and a close button. The default slot holds the panel's content, commonly an
[`sl-tab-group`](/components/tab-group).

> Detail panels only provide the header/body shell — they don't position or animate themselves. Place one in a layout
> column, a fixed-position sidebar, or similar, the way you would any other block-level element.

```html:preview
<sl-detail-panel style="height: 20rem; max-width: 24rem;">
  <span slot="label">Statement of Work.pdf</span>
  <span slot="meta">Revision 4 &middot; Expiring in 12 days</span>

  <div style="padding: var(--sl-spacing-medium);">
    This agreement was last reviewed on September 18, 2026 and is due for renewal.
  </div>
</sl-detail-panel>
```

## Examples

### With tabs and a selection list

Combine the panel with [`sl-tab-group`](/components/tab-group) and a list of
[`sl-selectable-item`](/components/selectable-item) rows for a richer detail view.

```html:preview
<sl-detail-panel class="detail-panel-demo" style="height: 24rem; max-width: 28rem;">
  <span slot="label">Statement of Work.pdf</span>
  <span slot="meta">Revision 4 &middot; Expiring in 12 days</span>

  <sl-tab-group style="height: 100%;">
    <sl-tab slot="nav" panel="documents">Related documents</sl-tab>
    <sl-tab slot="nav" panel="history">History</sl-tab>

    <sl-tab-panel name="documents">
      <div style="display: flex; flex-direction: column; gap: 0.25rem; padding: var(--sl-spacing-medium);">
        <sl-selectable-item value="doc-1" checked>
          Statement of Work.pdf
          <span slot="meta">Oct 3, 2026</span>
        </sl-selectable-item>
        <sl-selectable-item value="doc-2">
          Amendment 1.pdf
          <span slot="meta">Sep 18, 2026</span>
        </sl-selectable-item>
      </div>
    </sl-tab-panel>

    <sl-tab-panel name="history">
      <div style="padding: var(--sl-spacing-medium);">No changes recorded yet.</div>
    </sl-tab-panel>
  </sl-tab-group>
</sl-detail-panel>

<script>
  const panel = document.querySelector('.detail-panel-demo');
  panel.addEventListener('sl-request-close', () => panel.remove());
</script>
```

### With header actions

Add `<sl-icon-button>` elements to the `actions` slot for extra header buttons, e.g. to add or edit the item. They're
shown before the close button.

```html:preview
<sl-detail-panel style="height: 12rem; max-width: 24rem;">
  <span slot="label">Details</span>

  <sl-icon-button slot="actions" name="plus-lg" library="system" label="Add"></sl-icon-button>
  <sl-icon-button slot="actions" name="pencil" library="system" label="Edit"></sl-icon-button>

  <div style="padding: var(--sl-spacing-medium);">Panel content</div>
</sl-detail-panel>
```

### Contained

Set `contained` to draw the panel as a self-contained block, with an outline on every side and rounded corners like
[table](/components/table) and [card](/components/card). Use it when the panel sits in a grid next to other blocks; leave
it off for a sidebar attached to the edge of the page.

```html:preview
<sl-detail-panel contained style="height: 12rem; max-width: 24rem;">
  <span slot="label">Statement of Work.pdf</span>
  <span slot="meta">Revision 4</span>

  <div style="padding: var(--sl-spacing-medium);">Panel content</div>
</sl-detail-panel>
```

### Listening for the close request

Clicking the close button emits `sl-request-close`. Call `event.preventDefault()` to keep the panel open, e.g. if
closing requires confirming unsaved changes first.

```html:preview
<sl-detail-panel class="detail-panel-confirm" style="height: 12rem; max-width: 24rem;">
  <span slot="label">Amendment 1.pdf</span>
  <span slot="meta">Unsaved changes</span>
  <div style="padding: var(--sl-spacing-medium);">Closing this panel will discard your unsaved edits.</div>
</sl-detail-panel>

<script>
  const confirmPanel = document.querySelector('.detail-panel-confirm');
  confirmPanel.addEventListener('sl-request-close', event => {
    event.preventDefault();
    alert('Save or discard your changes before closing.');
  });
</script>
```

[component-metadata:sl-detail-panel]
