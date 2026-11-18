---
meta:
  title: Legend Item
  description: A single entry of a legend, a marker or a term and what it means.
layout: component
---

Legend items are used inside [legends](/components/legend). Set `term` to define a word (shown in bold with a colon), put a symbol in the `marker`
slot to explain it, or set `variant` to explain a colour.

```html:preview
<sl-legend>
  <sl-legend-item term="Open">draft, in progress or rejected</sl-legend-item>
  <sl-legend-item><sl-badge slot="marker" variant="warning">O</sl-badge>Ongoing</sl-legend-item>
  <sl-legend-item variant="success">Completed</sl-legend-item>
</sl-legend>
```
