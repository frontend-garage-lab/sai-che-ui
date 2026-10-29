---
name: Saipem DS
description: Web Components design system for Saipem's engineering document management applications.
colors:
  saipem-deep-teal: "#0e6a81"
  saipem-teal-bright: "#16a0c2"
  saipem-teal-deep: "#0c5264"
  saipem-teal-wash: "#e4f3f7"
  saipem-teal-mist: "#f4fafb"
  brand-teal-ink: "#024050"
  signal-orange: "#f28431"
  signal-orange-deep: "#e66c0f"
  success-green: "#1f8466"
  warning-amber: "#947005"
  danger-red: "#db3624"
  app-gray: "#f8f9f9"
  panel-white: "#ffffff"
  sunken-gray: "#f2f4f5"
  border-subtle: "#e3e6e8"
  border-strong: "#cbd0d2"
  input-border: "#889196"
  steel-text: "#1f2529"
  steel-strong: "#2d3539"
  steel-body: "#414a4e"
  steel-meta: "#555e62"
typography:
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.4
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  subheading:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  small: "3px"
  medium: "6px"
  large: "8px"
  x-large: "12px"
  pill: "9999px"
spacing:
  3x-small: "2px"
  2x-small: "4px"
  x-small: "8px"
  small: "12px"
  medium: "16px"
  large: "20px"
  x-large: "28px"
  2x-large: "36px"
  3x-large: "48px"
components:
  button-primary:
    backgroundColor: "{colors.saipem-deep-teal}"
    textColor: "{colors.panel-white}"
    rounded: "{rounded.medium}"
    height: "36px"
  button-default:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.steel-strong}"
    rounded: "{rounded.medium}"
    height: "36px"
  input:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.steel-text}"
    rounded: "{rounded.medium}"
    height: "36px"
  card:
    backgroundColor: "{colors.panel-white}"
    rounded: "{rounded.large}"
    padding: "{spacing.large}"
---

# Design System: Saipem DS

## Overview

**Creative North Star: "The Engineering Ledger"**

Saipem DS is the visual language of tools where engineers, reviewers and document controllers spend whole working
days: task lists, transmittals, revisions, comments, deadlines. It reads like a well-kept technical ledger. Every
column is aligned, every status is labelled, and nothing on the page is there for decoration. Density comes from
order, not from squeezing space.

The mood is sober and precise. The brand's deep teal appears rarely, as a signature on primary actions, the current
location and focus. The signal orange is rarer still. Colour belongs to the data (states, outcomes, deadlines) and
not to the frame around it. Surfaces are quiet: the white panel sits on the light app gray, and the sunken gray marks
headers and sidebars inside a panel, so the layout reads without extra borders.

**Source of truth.** This file describes the system; it does not define it. If they disagree, the order is:
`--sl-*` tokens and component styles in `src/` → shared layout classes in
`docs/assets/application_restyle/_shared/restyle.css` → project rules (`DECISIONS.md`, the rebranding references) →
this file. Fix this file when it drifts.

The system is implemented as Lit Web Components (`sl-*`) with `--sl-*` CSS custom properties, light and dark themes,
and is mirrored 1:1 in the Figma library through Code Connect. **The components and tokens are the vocabulary:
new screens are composed from them, never restyled.**

**Key Characteristics:**
- Operate mode first: scanability, consistency and stable context outrank expression.
- One primary action per region; semantic colour only where it carries meaning.
- Tonal layering (app / panel / sunken) with minimal shadows.
- Inter at small, dense sizes; a strict 4-based spacing scale.
- A 12-column grid in which every region takes a whole number of columns.

## Colors

A restrained teal-and-steel palette, with a single warm signal and a semantic set reserved for meaning.

### Primary
- **Saipem Deep Teal** (#0e6a81, `--sl-color-primary-600`): primary buttons, links, the focus ring, the selected
  row marker, the current navigation item. This is the brand's voice and should stay rare.
- **Teal Deep** (#0c5264, `--sl-color-primary-700`) and **Brand Teal Ink** (primary-800): hover and active of
  primary buttons.
- **Teal Bright** (#16a0c2, `--sl-color-primary-500`): the input focus border.
- **Teal Mist** (#f4fafb, primary-50): the selected row background. **Teal Wash** (#e4f3f7, primary-100) is the
  selected row on hover.
- **Brand Teal Ink** (#024050, `--sl-color-brand`): literal logo colour for brand surfaces such as the app header.
  It does not invert in dark mode.

### Secondary
- **Signal Orange** (#f28431, `--sl-color-accent-500` / `--sl-color-brand-accent`): brand accent and the `accent`
  variant. Use it for a single highlight, never as a second primary.

### Semantic
- **Success Green** (#1f8466, `--sl-color-success-600`): approved, completed, positive outcomes.
- **Warning Amber** (#947005, `--sl-color-warning-600`): approaching deadlines, attention needed.
- **Danger Red** (#db3624, `--sl-color-danger-600`): overdue, rejected, destructive actions.

### Neutral
- **App Gray** (#f8f9f9, `--sl-surface-app`): page background.
- **Panel White** (#ffffff, `--sl-surface-panel`): cards, panels, tables, inputs.
- **Sunken Gray** (#f2f4f5, `--sl-surface-sunken`): headers and sidebars inside a panel.
- **Border Subtle** (#e3e6e8, `--sl-border-subtle`): cards and panels. **Border Strong** (#cbd0d2,
  neutral-300): default buttons and disabled inputs. **Input Border** (#889196, neutral-400): input fields.
- **Steel Text** (#1f2529, neutral-900) for titles, **Steel Strong** (#2d3539, neutral-800) for default button
  text, field labels and filled values, **Steel Body** (#414a4e, neutral-700) for body text, **Steel
  Meta** (#555e62, neutral-600) for metadata.

### Named Rules
**The Meaning-Only Rule.** Semantic colours mark outcomes and states, never the difference between buttons: a
legacy green "Export" or red "Reset" becomes `default` or `text`. Every state has a label or tooltip as well as a
colour (WCAG 1.4.1).

**The Rare Teal Rule.** At most one `variant="primary"` per region (page, card, dialog, toolbar).

## Typography

**Body Font:** Inter (with -apple-system, Segoe UI, Roboto, Helvetica, Arial). **Mono:** SFMono-Regular, Consolas,
Menlo (codes, identifiers when needed).

**Character:** a single neutral sans used at small, dense sizes. Hierarchy comes from weight and colour steps, not
from large size jumps.

### Hierarchy
- **Title** (700, 24px, 1.4): the page title, one per page (`.rs-title`, Figma Heading/H2).
- **Headline** (500, 16px, 1.5): card and region headings (`.rs-heading`, Heading/H4).
- **Subheading** (500, 14px, 1.4): group labels inside a region (`.rs-subheading`, Heading/H5).
- **Body** (400, 14px, 1.5): default text in panels and tables (`.rs-body`, Body/Small).
- **Label / Meta** (400, 12px, 1.4): secondary metadata under the primary identifier (`.rs-meta`, Caption).

### Named Rules
**The Identifier-First Rule.** The readable document identifier (name or code + revision) comes first, in the
Subheading weight (500, the `semibold` token; never 600 or 700).
Secondary metadata goes beneath it in Meta. A technical ID is never the first thing a user reads.

## Layout

A 12-column grid (`.rs-grid`, `.rs-span-N`) designed at 1280–1439px and checked at 1280, 1440 and 1920, with no
horizontal scroll. From `restyle.css`: the page margin is 20px (16px below 1280), the gutter between regions is 16px
(12px below 1280), and content stops growing at 1920px. Below 1024 the regions stack and details move into a drawer.

Standard splits: list + detail **8/4** (metadata only) or **7/5** (detail with tables or comments), filters + KPI
**8/4** or **9/3**, two-column forms **6/6**, side-navigated forms **3/9**. Fields inside cards and dialogs use a
nested 12-column grid, so proportions match everywhere.

Spacing roles (`--rs-*` → `--sl-spacing-*`): section gap 16 (12 below 1280), region padding 20, field gap 16, form-group gap 36,
cluster gap 8, icon-to-text 4. The header, context and page title stay fixed; only the content scrolls.

## Elevation & Depth

Depth is mostly **tonal**: panels on the app surface, with sunken areas inside panels. Static surfaces carry only
the faintest shadow, and larger shadows are reserved for things that float above the page.

### Shadow Vocabulary
- **x-small** (`0 1px 2px hsl(192 60% 10% / 6%)`): cards and panels at rest.
- **medium** (`0 4px 8px -2px …/8%, 0 2px 4px -2px …/4%`): dropdowns, menus, popovers.
- **large / x-large** (`0 12px 16px -4px …/10%` → `0 20px 24px -4px …/12%`): dialogs and drawers, above the
  overlay `hsl(192 60% 8% / 40%)`.

### Named Rules
**The Quiet Panel Rule.** Never stack a shadow on a shadow, or panels on panels, just to make groups. Group content
with the sunken surface, a divider or spacing.

## Shapes

Small, consistent radii: 3px for tooltips, 6px for buttons and for inputs of every size, 8px for cards and panels,
12px for large containers, pill only for badges, tags and pill variants. Borders are 1px in Border Subtle. The
system has no ornamental shapes.

## Components

Refined and restrained. State is expressed by colour and border, not by movement or size.

### Buttons (`sl-button`, `sl-icon-button`)
- **Shape:** 6px radius; heights of 28, 36 and 44px for small, medium and large.
- **Primary:** Saipem Deep Teal with white text. It darkens on hover (primary-700) and when pressed (primary-800).
  One per region.
- **Default:** a white surface with a neutral-300 border, neutral-800 text and an x-small shadow. On hover it stays
  **neutral** (neutral-50 background), because teal is reserved for the primary action and for selection.
- **Text:** a bare label for tertiary actions. Distinguish secondary actions with `default` and `text`, never with
  colour.
- **Label:** 500 (`--sl-font-weight-semibold`) at every size; small 12px, medium 14px, large 16px.
- **Icons:** prefix, suffix and caret icons are 1em (12, 14, 16px). With a prefix the button starts with x-small
  (8px, small) or small (12px, medium and large) padding and the same gap before the label; the label keeps its own
  padding (12, 16, 20px) on the side without an icon. Suffix and caret mirror this at the end. Buttons and tabs carry
  the icon given by the icon map in `DECISIONS.md`; Cancel, Reset and Clear stay without one.
- **Focus:** a 2px solid teal ring at 2px offset.

### Cards / Containers (`sl-card`, `sl-detail-panel`)
- **Corner Style:** 8px. **Background:** Panel White. **Shadow:** x-small. **Border:** subtle.
- **Internal Padding:** 20px (`--sl-spacing-large`).
- Cards and detail panels are the only surfaces. Layout wrappers stay transparent.

### Inputs / Fields (`sl-input`, `sl-select`, `sl-textarea`)
- **Style:** a white field with a neutral-400 border (neutral-500 on hover), a 6px radius at every size, and heights
  of 28, 36 or 44px.
- **Labels** always sit above the field. A placeholder is never a label.
- **Focus:** a primary-500 border with the teal focus ring. **Disabled:** a neutral-100 background and a
  neutral-300 border. **Read-only** looks like the default field.
- **Help text** sits under the field: 12px, 1.5 line height, neutral-600, with a 2x-small (4px) gap.
- **Multiple select:** the selected values are removable `sl-tag`s of the select's size that wrap onto new lines
  (gap 3x-small for small, 2x-small for medium and large, 4px block padding); the field grows with them and the
  placeholder hides. `max-options-visible` collapses the rest into a "+N" tag.
- **Trailing controls:** the clear button (`x-circle-fill`) and the expand chevron are 1em; the clear button sits
  after the input spacing (8, 12, 16px), the chevron after small (12px).
- **File drop** (`sl-file-drop`): label above, an optional `hint` inside the zone under the instructions, and
  `help-text` under the zone like any field. **Uploaded files** (`sl-file-upload-item`): filename 14px/500,
  meta 12px, both at 1.5 line height (59px tall).

### Tables (`sl-table`)
- The identifier column comes first, as a two-line cell: the identifier in Subheading (500) and its metadata in
  Meta beneath. Dates do not truncate, and long text truncates with the full value available.
- The selected row uses a 3px inset teal marker (primary-600) and the Teal Mist background (Teal Wash on hover).
  Row variants (`rowVariant`) reuse the same edge in their semantic colour, and selection takes priority. Statuses use `sl-status` or `sl-badge` with a
  label.
- Empty results use `sl-empty-state`, never "No data to display".

### Navigation (`sl-header`, `sl-sidebar`, `sl-tab-group`)
- The brand header uses the brand ink and accent. The current item is marked by state, not by a custom colour.
- Workflow stages use card tabs with pill counters.

## Do's and Don'ts

### Do:
- **Do** compose every screen from `sl-*` components and their documented variants.
- **Do** take spacing only from `--sl-spacing-*` (through `--rs-*` roles) and text only from the typography classes.
- **Do** keep every datum and action of the legacy screen: regroup, rename or move to overflow, never delete.
- **Do** use motion only as state feedback, with the components' own animations and the `--sl-transition-*` tokens.
- **Do** use only icons that exist in the DS icon set (Bootstrap Icons names, Figma `Icon/<name>`). A missing icon is
  added to the DS first, never replaced by an SVG or a look-alike.

### Don't:
- **Don't** use semantic colours to tell buttons apart, or put more than one primary in a region.
- **Don't** add background, border, shadow or radius to layout wrappers. Use `sl-card` or `sl-detail-panel`.
- **Don't** hardcode hex, rgb or px values for colour and spacing outside the tokens, or restyle components through
  `::part`. A missing look is a missing variant: propose it for the DS.
- **Don't** add decorative animation, gradients, illustrations or new typefaces.
- **Don't** copy the preview snippets in `.impeccable/design.json` into pages. They use native elements only to
  preview the style. In pages, always use `sl-button`, `sl-input`, `sl-card` and the other components.
