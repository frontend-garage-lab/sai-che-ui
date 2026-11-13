# Saipem DS design rules

Saipem DS is the visual language of document-management tools where engineers, reviewers and document controllers
spend whole working days: task lists, transmittals, revisions, comments, deadlines. It should read like a well-kept
technical ledger: aligned, labelled, dense through order rather than squeezed space. Nothing is decorative.

**The components and tokens are the vocabulary. Screens are composed from them, never restyled.** The theme already
gives every component its Saipem look (colours, radii, density, focus ring); recreating it by hand is always wrong.

## Principles

1. **Operate mode first.** Scannability, consistency and a stable context beat expression.
2. **One primary action per region** (page, card, dialog, toolbar): `variant="primary"` marks the next step of the
   job. It can move as the workflow progresses (Accept → Complete).
3. **Colour belongs to the data, not the frame.** Semantic colours mark states and outcomes, never the difference
   between two buttons. Every colour signal also has a label or tooltip (WCAG 1.4.1).
4. **Tonal layering, minimal shadows.** App background → white panels → sunken areas inside panels.
5. **Keep every datum and action** when you redesign a legacy screen: regroup, rename or move to an overflow menu,
   never delete.

## Colour

Always reference tokens (see [tokens.md](tokens.md)); never copy their values.

| Role            | Token                                                                        | Use                                                                                |
| --------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Brand teal      | `--sl-color-primary-600`                                                     | Primary buttons, links, focus, selected row marker, current navigation item. Rare. |
| Hover / pressed | `--sl-color-primary-700`, `--sl-color-primary-800`                           | Handled by the components.                                                         |
| Selected row    | `--sl-color-primary-50` (hover `--sl-color-primary-100`)                     | Handled by `sl-table`.                                                             |
| Brand ink       | `--sl-color-brand`                                                           | Literal logo colour on brand surfaces such as the app header.                      |
| Accent orange   | `--sl-color-accent-500`, `variant="accent"`                                  | A single highlight. Never a second primary.                                        |
| Success         | `--sl-color-success-600`, `variant="success"`                                | Approved, completed, distributed.                                                  |
| Warning         | `--sl-color-warning-600`, `variant="warning"`                                | Approaching deadline, attention needed.                                            |
| Danger          | `--sl-color-danger-600`, `variant="danger"`                                  | Overdue, rejected, destructive actions.                                            |
| App background  | `--sl-surface-app`                                                           | Page background.                                                                   |
| Panel           | `--sl-surface-panel`                                                         | Cards, panels, tables, inputs.                                                     |
| Sunken          | `--sl-surface-sunken`                                                        | Headers and side areas inside a panel.                                             |
| Borders         | `--sl-border-subtle` (panels), `--sl-border-strong`                          | 1px.                                                                               |
| Text            | `--sl-color-neutral-900` titles, `-800` strong, `-700` body, `-600` metadata |                                                                                    |

Do not use the primitive palettes (`--sl-color-teal-*`, `--sl-color-red-*`, …): they are not the Saipem palette.

## Typography

One family (Inter, set by the theme) at small, dense sizes. Hierarchy comes from weight and colour, not big jumps.

| Role                        | Size                            | Weight                      | Line height               | Colour      |
| --------------------------- | ------------------------------- | --------------------------- | ------------------------- | ----------- |
| Page title (one per page)   | `--sl-font-size-x-large` (24px) | `--sl-font-weight-bold`     | `--sl-line-height-dense`  | neutral-900 |
| Region / card heading       | `--sl-font-size-medium` (16px)  | `--sl-font-weight-semibold` | `--sl-line-height-normal` | neutral-900 |
| Group label inside a region | `--sl-font-size-small` (14px)   | `--sl-font-weight-semibold` | `--sl-line-height-dense`  | neutral-800 |
| Body, table cells           | `--sl-font-size-small` (14px)   | `--sl-font-weight-normal`   | `--sl-line-height-normal` | neutral-700 |
| Metadata, captions          | `--sl-font-size-x-small` (12px) | `--sl-font-weight-normal`   | `--sl-line-height-dense`  | neutral-600 |

- `semibold` is 500. Never use 600 or 700 for emphasis inside content; bold is only for the page title.
- **Identifier first**: a record shows its readable identifier (document name or code + revision) first, in the
  group-label style, with metadata underneath in the metadata style. A technical ID is never the first thing read.
- Dates: `16-Jun-2023`, with time `16-Jun-2023 17:34`. An empty date is "—", never an epoch date.

## Layout and spacing

- 12-column grid; every region spans a whole number of columns. Design at 1280–1439px, check 1280, 1440 and 1920,
  never scroll horizontally. Below 1024px regions stack and details move into an `sl-drawer`.
- Standard splits: list + detail **8/4** (metadata only) or **7/5** (detail with tables or comments); filters + KPI
  **8/4** or **9/3**; two-column forms **6/6**; side-navigated forms **3/9**.
- Spacing only from `--sl-spacing-*`:

| Role                           | Token                                                           |
| ------------------------------ | --------------------------------------------------------------- |
| Page margin                    | `--sl-spacing-large` (20px; `--sl-spacing-medium` below 1280px) |
| Gap between regions            | `--sl-spacing-medium` (16px; `--sl-spacing-small` below 1280px) |
| Padding inside a card or panel | `--sl-spacing-large`                                            |
| Gap between fields             | `--sl-spacing-medium`                                           |
| Gap between form groups        | `--sl-spacing-2x-large`                                         |
| Cluster of buttons or chips    | `--sl-spacing-x-small`                                          |
| Icon to text                   | `--sl-spacing-2x-small`                                         |

- The app header, the page context and the page title stay fixed; only the content scrolls.
- Layout wrappers (`div`, `section`) are **transparent**: only `display`, `gap`, `padding`, `grid-*`. No background,
  border, shadow or radius on them — a surface is an `sl-card` or an `sl-detail-panel`.

## Elevation and shape

- Cards and panels at rest: the faint shadow the components already have. Menus and popovers: medium. Dialogs and
  drawers: large, over the overlay. Never stack panels in panels or shadows on shadows to group content: use the
  sunken surface, an `sl-divider` or spacing.
- Radii come from the components: 6px buttons and inputs, 8px cards, pill only for tags, badges and pill variants.

## Components

### Buttons (`sl-button`, `sl-icon-button`)

- `primary`: the next step, one per region. `default`: other actions. `text`: tertiary actions such as Reset,
  Clear all, Cancel at the start of a wizard. `danger` (often `outline`): destructive actions, always confirmed.
- Never `success` (or any semantic colour) just to tell buttons apart: a green "Export" becomes `default`.
- A disabled action gets a tooltip that says why.
- Buttons carry a `prefix` icon when it helps recognition; Cancel, Reset and Clear stay without one.
- Icon-only actions always have a `label` (and usually an `sl-tooltip`). Row actions in tables use
  `sl-icon-button size="small" variant="neutral"` with a tooltip, never a bare icon.

### Fields (`sl-input`, `sl-select`, `sl-textarea`, `sl-file-drop`)

- The label always sits above the field (`label` attribute). A placeholder is never a label.
- Help text goes in `help-text`. Validation state uses the `status` attribute (`success`, `warning`, `danger`) with
  a help text that explains it.
- `sl-select multiple` shows removable tags; use `max-options-visible` to collapse the rest into "+N".

### Tables (`sl-table`)

- The identifier column comes first, as a two-line cell (identifier + metadata). Dates do not truncate; long text
  truncates with the full value available in a `title`.
- Statuses in cells use `sl-status` (or `sl-badge` for counters) with a label.
- Empty results use the `empty` slot with an `sl-empty-state` that says what to do — never "No data to display".
- Actions on the selection go in the `toolbar` slot, `size="small"`, disabled while nothing is selected.

### Status, tag, badge

- `sl-status`: a value that changes through the workflow (Working, Signed, Distributed, Overdue). Use the same
  variant for the same state everywhere (tables, stats, panels).
- `sl-tag`: a fixed category or code (revision code, document type), usually `variant="neutral"` `size="small"`.
- `sl-badge`: a counter.

### Surfaces (`sl-card`, `sl-detail-panel`)

- The only surfaces. Card content is padded by the component; do not add your own background or border.
- Record details next to a list go in an `sl-detail-panel` in the same grid as the list, as tall as the list.

### Navigation (`sl-header`, `sl-sidebar`, `sl-breadcrumb`, `sl-tab-group`)

- The current item is marked with the `current` attribute (header items, sidebar items), not a custom colour.
- Card tabs (`sl-tab card`) for workflow stages or work areas; normal tabs for views of the same list.
- Breadcrumb above the page title on inner pages; none on the home page.

## Motion

Only as state feedback, through the components' own animations and the `--sl-transition-*` tokens. No decorative
animation, gradients, illustrations or new typefaces.

## Icons

Use only icons of the DS set (Bootstrap Icons names). Find them with `node <skill>/scripts/ds.mjs icons <word>`.
A missing icon is a gap to report, never an inline SVG or a look-alike from another set.
