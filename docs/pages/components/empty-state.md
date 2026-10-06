---
meta:
  title: Empty State
  description: Empty states communicate that a list or view has no content yet.
layout: component
---

Use an empty state in place of a list or view when there's nothing to show yet, e.g. a document with no review
comments. Set `title-text` and `description` for the message, use the `icon` slot for a representative icon, and the
`action` slot for an optional call to action.

```html:preview
<sl-empty-state title-text="No comments yet" description="Be the first to leave a comment on this document.">
  <sl-icon slot="icon" name="chat-left-text"></sl-icon>
  <sl-button slot="action" variant="primary">+ Add comment</sl-button>
</sl-empty-state>
```

## Examples

### Without an action

The `action` slot is optional — its container collapses when it's empty.

```html:preview
<sl-empty-state title-text="No activity yet" description="Activity will appear here once this document is shared.">
  <sl-icon slot="icon" name="clock-history"></sl-icon>
</sl-empty-state>
```

### Without an icon

The `icon` slot is also optional and collapses the same way.

```html:preview
<sl-empty-state title-text="No results found" description="Try adjusting your filters."></sl-empty-state>
```

[component-metadata:sl-empty-state]
