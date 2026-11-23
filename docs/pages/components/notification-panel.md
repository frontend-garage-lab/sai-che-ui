---
meta:
  title: Notification Panel
  description: A bell button with an unread counter that opens the list of the user's notifications.
layout: component
---

Put the notification panel in the `actions` slot of the [header](/components/header), before the account menu. The
bell shows a badge with the number of new (unread) notifications; clicking it opens a panel with one
`<sl-notification-item>` per notification, newest first. Read notifications stay in the list until the application
removes them (e.g. after the retention period): only the "New" marker and the counter change.

```html:preview
<sl-header>
  <span slot="logo">Saipem</span>
  <sl-notification-panel slot="actions" description="All projects and working areas">
    <sl-notification-item variant="danger" heading="ZIP download failed" date="2026-11-23T12:38:00" project="99_PAGE_AM" section="Job Documents">
      The archive could not be generated. No file was produced.
      <sl-button slot="actions" size="small"><sl-icon slot="prefix" name="arrow-right"></sl-icon>Open My downloads</sl-button>
    </sl-notification-item>
    <sl-notification-item variant="success" heading="Excel export completed" date="2026-11-20T17:02:00" project="99_PAGE_AM" section="Job Documents" read>
      The Job Documents list was exported (24 rows).
      <sl-button slot="actions" size="small"><sl-icon slot="prefix" name="download"></sl-icon>Download</sl-button>
    </sl-notification-item>
    <span slot="footer">Notifications are kept for 3 days from when they are generated, read or unread.</span>
  </sl-notification-panel>
</sl-header>
```

## Read and unread

- New items show a single "New" badge next to the time (text, not only colour) and count in the badge.
- Opening the panel counts as viewing them: the markers stay visible while the panel is open, so the user can see
  what's new, and the items become read when it closes. Add `manual-read` to disable this.
- Clicking one of the item's actions marks it as read immediately. "Mark all as read" (shown while there are new
  items) marks all of them.
- Every change emits `sl-notification-read` on the item, so the application can save it.

## Accessibility

- The bell's accessible name includes the counter, e.g. "Notifications, 3 unread"; the badge itself is hidden from
  assistive technology.
- The panel is a labelled dialog containing a list. <kbd>Escape</kbd> closes it and returns focus to the bell.
- The outcome is carried by the icon shape (and its label for screen readers), never by colour alone.
- New notifications added while the page is open are announced through a polite live region.

## Examples

### Empty

When there are no notifications the panel shows an empty state. Replace it with the `empty` slot, and change the
default texts with `label`, `read-all-label` and `empty-label`.

```html:preview
<sl-notification-panel open empty-label="You're all caught up" style="display: block; height: 14rem;"></sl-notification-panel>
```

### Counter

By default the badge counts the unread items. Set `count` when the server knows a total larger than the items loaded
in the panel; values above `max` (99) are shown as `99+`.

```html:preview
<sl-notification-panel count="128">
  <sl-notification-item heading="Document approved" date="2026-11-23T09:12:00">DOC-0042 has been approved.</sl-notification-item>
</sl-notification-panel>
```

### Handling events

Clicking an action emits `sl-notification-action` and marks the item as read; every read emits
`sl-notification-read`; "Mark all as read" emits `sl-notification-read-all` (cancelable).

```html:preview
<div class="notification-events">
  <sl-notification-panel>
    <sl-notification-item variant="success" heading="Excel export completed" date="2026-11-23T09:12:00">
      The Job Documents list was exported (24 rows).
      <sl-button slot="actions" size="small"><sl-icon slot="prefix" name="download"></sl-icon>Download</sl-button>
    </sl-notification-item>
    <sl-notification-item variant="info" heading="Review assigned" date="2026-11-23T08:30:00">You were assigned to the review of DOC-0107.</sl-notification-item>
  </sl-notification-panel>
  <p class="notification-events__log">Last event: none</p>
</div>

<script>
  const container = document.querySelector('.notification-events');
  const log = container.querySelector('.notification-events__log');
  ['sl-notification-action', 'sl-notification-read', 'sl-notification-read-all'].forEach(name =>
    container.addEventListener(name, event => {
      const text = event.detail.item ? event.detail.item.heading : 'all';
      log.textContent = `Last event: ${name} (${text})`;
    })
  );
</script>
```

### Footer

Use the `footer` slot for information about the list, such as the retention policy, and optionally a link to the
notification settings.

```html:preview
<sl-notification-panel open style="display: block; height: 16rem;">
  <sl-notification-item heading="Document approved" date="2026-11-23T09:12:00" read>DOC-0042 has been approved.</sl-notification-item>
  <span slot="footer">Notifications are kept for 3 days.</span>
  <sl-button slot="footer" variant="text" size="small">Settings</sl-button>
</sl-notification-panel>
```
