---
meta:
  title: Notification Item
  description: A notification inside a notification panel.
layout: component
---

Notification items are the entries of a [notification panel](/components/notification-panel). Each one shows:

- **outcome icon** from `variant` (`success` `check2-circle`, `warning` `exclamation-triangle`, `danger`
  `exclamation-octagon`, `info` `info-circle`): a different shape for each outcome, with its label for screen
  readers. It's the only carrier of the category — no extra status tag or coloured border. Use the `icon` slot for a
  custom icon;
- **title** (`heading`), with the **"New"** badge (`sl-badge primary pill`) and the **relative time** on the same row on the right (the exact date is
  the tooltip); while new, the item has a light primary background and a semibold title; once read, no background and a regular title;
- **detail** (default slot);
- **origin**: `project` · `section`, both optional, on one Caption line;
- **actions** (`actions` slot), optional: always `<sl-button size="small">` with a prefix icon; only the icon tells
  the kind of action (`arrow-right` to open a page, e.g. "Open My downloads"; `download` for a direct download).
  Clicking one marks the item as read;

```html:preview
<sl-notification-panel open style="display: block; height: 34rem;">
  <sl-notification-item variant="danger" heading="ZIP download failed" date="2026-11-23T12:38:00" project="99_PAGE_AM" section="Job Documents">
    The archive could not be generated. No file was produced.
    <sl-button slot="actions" size="small"><sl-icon slot="prefix" name="arrow-right"></sl-icon>Open My downloads</sl-button>
  </sl-notification-item>
  <sl-notification-item variant="warning" heading="Promote completed with exceptions" date="2026-11-23T12:38:00" project="99_PAGE_AM" section="Isometric Document">
    2 of 3 promoted; 1 not promoted because a mandatory attribute is empty. See the result for each document.
    <sl-button slot="actions" size="small"><sl-icon slot="prefix" name="arrow-right"></sl-icon>Open My downloads</sl-button>
  </sl-notification-item>
  <sl-notification-item variant="success" heading="Excel export completed" date="2026-11-20T17:02:00" project="99_PAGE_AM" section="Job Documents" read>
    The Job Documents list was exported (24 rows).
    <sl-button slot="actions" size="small"><sl-icon slot="prefix" name="download"></sl-icon>Download</sl-button>
  </sl-notification-item>
  <sl-notification-item variant="info" heading="Review assigned" date="2026-11-20T09:00:00" read>
    You were assigned to the review of DOC-0107.
  </sl-notification-item>
</sl-notification-panel>
```
