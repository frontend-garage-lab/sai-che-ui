---
name: saipem-ds
description: Build and review UI with Saipem DS, the customized Web Components library installed as `@shoelace-style/shoelace` with `sl-*` tags (a fork of Shoelace 2.20 with its own components, variants, events and theme). Use it whenever you write, change or review HTML, Angular or Lit templates, styles or components that use `sl-*` elements or `--sl-*` tokens — screens, forms, tables, filters, dialogs, drawers, app shells, KPI cards, statuses, uploads — and whenever the user mentions Saipem DS, the design system, Shoelace or "sl-" components, even if they don't ask for the skill. Memory of upstream Shoelace or Web Awesome is not reliable for this library; this skill holds the real API and a validator.
---

# Saipem DS

Saipem DS is a fork of Shoelace 2.20.1. The npm package (`@shoelace-style/shoelace`) and the tag prefix (`sl-`) are
the same as the original, **the API is not**: 19 components exist only here (table, status, stat, sidebar, header,
detail panel, stepper, description list, file drop, empty state…) and several upstream ones have new attributes and
values. Treat every attribute, value, event, slot, icon and token as unknown until you have seen it in this skill.
What changed is listed in [references/fork-differences.md](references/fork-differences.md).

In the commands below, `<skill>` is the folder that contains this file.

## Workflow

1. **Pick the components** in [references/catalog.md](references/catalog.md). A DS component always beats native
   HTML or a hand-built widget.
2. **Read the reference of every component you use**, `references/components/<name>.md`: API generated from the
   source plus the official examples. For a quick reminder run `node <skill>/scripts/ds.mjs api <tag>`. Write only
   attributes, values, events and slots that appear there.
3. **Compose the screen** with [references/design-rules.md](references/design-rules.md) and the standard solutions
   in [references/patterns.md](references/patterns.md). Read both before building a page or a non-trivial view.
4. **Angular**: follow [references/angular.md](references/angular.md) — `CUSTOM_ELEMENTS_SCHEMA`, property vs
   attribute binding, `sl-*` events, the value accessor for forms.
5. **Never guess icons or tokens**: `node <skill>/scripts/ds.mjs icons <word>` and
   `node <skill>/scripts/ds.mjs tokens <word>`; all tokens are in [references/tokens.md](references/tokens.md).
6. **Validate before you hand over**: `node <skill>/scripts/ds.mjs validate <files or folders>`. Fix every `ERR`.
   Fix each `WARN` or tell the user why it stays. Mention that you ran it.
7. **Report gaps instead of faking them.** If the DS has no component, variant or icon for what is needed, say so
   and propose the closest composition of existing components. Do not invent attributes, do not restyle components
   with CSS or `::part`, do not fall back to native elements.

## Mistakes to avoid

**API**

- Native `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`, `<table>`, `<details>`, `<hr>`, `<progress>`
  → use the DS component (`sl-button`, `sl-input`, `sl-select`, `sl-textarea`, `sl-dialog`, `sl-table`, …).
- Values differ per component and from upstream: `sl-button` has `accent` and `text` but no `brand`; `sl-dialog`
  `variant` is `default | success | warning | danger`; `sl-icon-button` `size` has no `medium`. Always check.
- Boolean attributes are on when present: `disabled="false"` **disables**. Remove the attribute or bind the property.
- Events are the documented `sl-*` ones (`sl-change`, `sl-input`, `sl-show`…); some components have their own
  (`sl-table-selection-change`, `sl-table-row-action`, `sl-step-change`, `sl-request-close`).
- Some properties have no attribute and must be set from code: `sl-table` `columns`, `data`, `rowVariant`,
  `getRowId` and others marked in the references.
- `sl-table` is data-driven (TanStack column definitions). There is no `sl-table-row`, `sl-table-cell` or
  `sl-table-column`.
- Do not use `wa-*` tags or Web Awesome attributes (`appearance`, `variant="brand"`, …).

**Look and feel**

- Compose, never restyle: no hard-coded colours, `px` spacing or font sizes; only `--sl-*` tokens; no `::part`
  overrides. A missing look is a missing variant to report.
- One `variant="primary"` per region; secondary actions are `default` or `text`, never a semantic colour.
- Labels above fields (`label`), never a placeholder as label; help in `help-text`; validation with `status`.
- Workflow states are `sl-status`, fixed codes `sl-tag`, counters `sl-badge`. Empty lists show `sl-empty-state`.
- Surfaces are only `sl-card` and `sl-detail-panel`; layout wrappers stay transparent.

**Setup**

- Import every component you use: `import '@shoelace-style/shoelace/dist/components/<name>/<name>.js';` (the exact
  path is at the top of each reference) and load the theme `@shoelace-style/shoelace/dist/themes/light.css`.
- Serve the assets from the installed package (copy `node_modules/@shoelace-style/shoelace/dist/assets` and call
  `setBasePath()` on that folder). The public CDN builds of `@shoelace-style/shoelace` on jsDelivr or unpkg are
  **upstream Shoelace**, not Saipem DS: never load components or assets from them.
- React wrappers exist in `@shoelace-style/shoelace/dist/react/<name>`; events become `onSl…` props. The validator
  does not check JSX, so read the references with extra care there.

## Files

| File                              | What it holds                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `references/catalog.md`           | Every component by category, with a one-line purpose.                          |
| `references/components/<name>.md` | Full API + examples of one component (generated).                              |
| `references/fork-differences.md`  | What differs from upstream Shoelace (generated).                               |
| `references/design-rules.md`      | Colour, typography, spacing, layout and component usage rules.                 |
| `references/patterns.md`          | Standard solutions: filters, lists, detail panels, dialogs, wizards, feedback. |
| `references/angular.md`           | Angular integration (generated from the docs).                                 |
| `references/tokens.md`            | All design tokens (generated).                                                 |
| `scripts/ds.mjs`                  | `validate`, `api`, `icons`, `tokens`. No dependencies, Node 18+.               |
