# Saipem DS patterns

Recurring problems and the DS answer to each. The same problem must always get the same solution, across screens and
teams. Snippets are plain HTML: in Angular apply the binding rules of [angular.md](angular.md) (`[prop]` for
non-string values, `(sl-event)` for events). Every snippet passes `ds.mjs validate`.

Layout wrappers in the snippets use small local classes (`.page`, `.grid`, …) that only set `display`, `gap`, `padding`
and `grid-*` with `--sl-spacing-*` tokens: write the equivalent in your app.

## Page structure

```html
<sl-header logo-label="Saipem" nav-label="Main">
  <sl-header-item href="/documents" current>Documents</sl-header-item>
  <sl-header-item href="/transmittals">Transmittals</sl-header-item>
  <sl-header-item slot="actions">
    <sl-avatar initials="MR" label="Mario Rossi" size="small"></sl-avatar>
    Mario Rossi
  </sl-header-item>
</sl-header>

<main class="page">
  <sl-breadcrumb>
    <sl-breadcrumb-item href="/">Home</sl-breadcrumb-item>
    <sl-breadcrumb-item href="/documents">Project documents</sl-breadcrumb-item>
    <sl-breadcrumb-item>Job documents</sl-breadcrumb-item>
  </sl-breadcrumb>
  <h1 class="page-title">Job documents</h1>
  <div class="grid">…regions…</div>
</main>
```

- One page title (`h1`, page-title typography). Breadcrumb above it on inner pages, not on the home page.
- Project navigation with many sections goes in an `sl-sidebar` with `sl-sidebar-group` / `sl-sidebar-item`
  (see the sidebar reference); the header then keeps only brand, project selector and user.

## Filters and KPIs

```html
<div class="grid">
  <sl-card class="span-8">
    <div slot="header" class="cluster-between">
      <span class="heading">Filters</span>
      <sl-button variant="text" size="small">
        <sl-icon slot="prefix" name="funnel"></sl-icon>
        More filters (8)
      </sl-button>
    </div>
    <div class="fields">
      <sl-input class="span-4" label="Search" type="search" size="small" clearable></sl-input>
      <sl-select class="span-2" label="Discipline" size="small" clearable>
        <sl-option value="civil">Civil</sl-option>
        <sl-option value="piping">Piping</sl-option>
      </sl-select>
    </div>
    <div slot="footer" class="cluster-end">
      <sl-button variant="text">Reset</sl-button>
      <sl-button variant="primary">
        <sl-icon slot="prefix" name="search"></sl-icon>
        Search
      </sl-button>
    </div>
  </sl-card>

  <sl-stat-group class="span-4" label="Filter by deadline">
    <sl-stat value="safe" count="42" variant="success">
      <sl-icon slot="prefix" name="shield-check"></sl-icon>
      Safe
    </sl-stat>
    <sl-stat value="expiring" count="7" variant="warning">
      <sl-icon slot="prefix" name="hourglass-split"></sl-icon>
      Expiring
    </sl-stat>
    <sl-stat value="expired" count="3" variant="danger">
      <sl-icon slot="prefix" name="exclamation-triangle"></sl-icon>
      Expired
    </sl-stat>
  </sl-stat-group>
</div>
```

- Few visible filters (search + up to 4 selects); the rest in an `sl-drawer placement="end"` opened by
  "More filters (n)". Applied filters show as `sl-tag removable` chips with a "Clear all" `text` button.
- KPIs that act as quick filters are `sl-stat` inside `sl-stat-group` (listen to `sl-change`). The stat variant
  matches the `sl-status` variant of the state it counts. While loading, show `sl-skeleton` in their place.

## List with toolbar, empty state and detail panel

```html
<div class="grid">
  <sl-table class="span-8" label="Documents" selection="multiple" paginate>
    <sl-button slot="toolbar" variant="primary" size="small">
      <sl-icon slot="prefix" name="plus-lg"></sl-icon>
      New document
    </sl-button>
    <sl-button slot="toolbar" size="small" disabled>
      <sl-icon slot="prefix" name="download"></sl-icon>
      Download
    </sl-button>
    <sl-empty-state
      slot="empty"
      title-text="No documents match these filters"
      description="Clear a filter or search for another code."
    >
      <sl-icon slot="icon" name="search"></sl-icon>
    </sl-empty-state>
  </sl-table>

  <sl-detail-panel class="span-4">
    <span slot="label">MZ-CCX-L-RDW-100021</span>
    <span slot="meta">Rev. B · Piping</span>
    <sl-icon-button slot="actions" name="pencil" label="Edit"></sl-icon-button>
    <sl-description-list cols="2">
      <sl-description-list-item label="Status">
        <sl-status variant="success" size="small" filled>Distributed</sl-status>
      </sl-description-list-item>
      <sl-description-list-item label="Revision">
        <sl-tag variant="neutral" size="small">B</sl-tag>
      </sl-description-list-item>
      <sl-description-list-item label="Issue date">16-Jun-2023</sl-description-list-item>
    </sl-description-list>
  </sl-detail-panel>
</div>
```

- `columns`, `data`, `rowVariant`, `getRowId` are **properties**: set them from code (see the table reference for
  `SlTableColumnDef`, sorting, server-side pagination, row action menus and the context menu).
- Toolbar order, left to right: the creation / next-step action (`primary`) → record actions in lifecycle order →
  `sl-divider vertical` → grouped menus → `sl-divider vertical` → the destructive action (`danger` `outline`) last.
  At most 4–5 labelled buttons; the rest go in an `sl-dropdown` "More" menu.
- Selection actions are disabled while nothing is selected (with a tooltip saying why).
- Row actions: the table's action column (⋮ menu, `sl-table-row-action` event) or `sl-icon-button size="small"
variant="neutral"` with a tooltip.
- Deadlines on rows: `rowVariant` returns `success` / `warning` / `danger`; selection takes priority.
- Section counters sit on the title row, right-aligned (title + number), never in a separate "N items" line.

## Status of a record

```html
<sl-status variant="neutral" size="small" filled>Working</sl-status>
<sl-status variant="primary" size="small" filled>Signed</sl-status>
<sl-status variant="success" size="small" filled>Distributed</sl-status>
<sl-status variant="warning" size="small" filled>Staging</sl-status>
<sl-status variant="danger" size="small" filled>Rejected</sl-status>
```

A state that changes in the workflow is always `sl-status` (tables, panels, dialogs, description lists — as its own
item, never glued to a date). A fixed code is an `sl-tag`; a counter is an `sl-badge`. Keep one variant per state
across the whole application.

## Dialogs

```html
<sl-dialog label="Reassign task" variant="warning">
  The task will leave your list and move to the new assignee.
  <sl-button slot="footer">Cancel</sl-button>
  <sl-button slot="footer" variant="primary">Reassign task</sl-button>
</sl-dialog>
```

- Footer: Cancel (`default`) + the primary action named with its verb ("Reassign task", never "OK").
- Confirmation and outcome dialogs use the dialog `variant` (`success`, `warning`, `danger`); destructive actions
  always need one.
- Never stack a dialog on a dialog: a choice that used to open a second dialog becomes a sub-view of the same dialog
  with a "Back" button.
- Prerequisites that block an operation: an `sl-alert variant="warning" open` at the top and the primary disabled.

### Wizard

```html
<sl-dialog label="Create transmittal" style="--width: 80rem">
  <sl-stepper current="0" label="Steps">
    <sl-step description="Protocol, subject, organizations">General information</sl-step>
    <sl-step description="Letters, drawings, annexes">Attachments</sl-step>
    <sl-step description="Recipients and dates">Distribution</sl-step>
  </sl-stepper>
  …step content…
  <sl-button slot="footer" variant="text">Cancel</sl-button>
  <sl-button slot="footer">Back</sl-button>
  <sl-button slot="footer" variant="primary">Next: Attachments</sl-button>
</sl-dialog>
```

The last step's primary uses the final verb ("Create transmittal").

## Upload

```html
<sl-dialog label="Upload files">
  <sl-file-drop label="Attachments" hint="PDF up to 10 MB" accept=".pdf" multiple></sl-file-drop>
  <sl-button slot="footer">Cancel</sl-button>
  <sl-button slot="footer" variant="primary" disabled>Upload</sl-button>
</sl-dialog>
```

The primary stays disabled until a file is chosen. Files being uploaded are `sl-file-upload-item`s.

## Feedback

```html
<sl-alert variant="primary" open>
  <sl-icon slot="icon" name="info-circle"></sl-icon>
  Accept the task to start the review.
</sl-alert>

<sl-alert variant="success" closable class="upload-done">
  <sl-icon slot="icon" name="check-circle"></sl-icon>
  MZ-CCX-L-RDW-100021 uploaded. Next: send it for review.
</sl-alert>
```

- "Next step" instructions: `sl-alert variant="primary" open` with `info-circle`.
- The outcome of a background action is a toast: call `alert.toast()` on an `sl-alert` (it moves into the
  `.sl-toast-stack`). Name the object and, if there is one, the next step — never just "Success."
- Reloading a section: `sl-skeleton effect="sheen"` in place of the content, the section's actions disabled and
  `aria-busy="true"` on the region.

## Forms

- Two-column forms on a nested 12-column grid (6/6); long forms in a dialog are split into titled sections.
- Fixed values in a form are shown in an `sl-description-list`, not as read-only inputs.
- Inline form actions (Add another, Remove, Edit) are `sl-button size="small" variant="text"` with a `prefix` icon
  (`plus-lg`, `trash`, `pencil`), not icon buttons.
- Choosing between two input modes (e.g. "Project users / Manual input") is an `sl-radio-group` with
  `sl-radio-button`s above the fields.
- Date and time: `sl-input type="date"` and `sl-input type="time"` side by side.

## Review comments

```html
<sl-comment author="Mario Rossi">
  <sl-avatar slot="avatar" initials="MR" label="Mario Rossi" size="small"></sl-avatar>
  <span slot="date">16-Jun-2023 17:34 · Comment on Rev. B</span>
  Please update the isometric with the new valve tag.
</sl-comment>
```

## Overflow menu

```html
<sl-dropdown>
  <sl-button slot="trigger" size="small" caret>More</sl-button>
  <sl-menu>
    <sl-menu-item value="history">
      <sl-icon slot="prefix" name="clock-history"></sl-icon>
      View history
    </sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item value="delete">
      <sl-icon slot="prefix" name="trash"></sl-icon>
      Delete
    </sl-menu-item>
  </sl-menu>
</sl-dropdown>
```

Listen to `sl-select` on the `sl-menu`; the selected item is `event.detail.item`.
