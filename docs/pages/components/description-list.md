---
meta:
  title: Description List
  description: Description lists show a grid of label/value pairs, e.g. a document's properties.
layout: component
---

Each [sl-description-list-item](#) is a label/value pair. Values can be plain text or richer content, e.g. an
`<sl-tag>`.

```html:preview
<sl-description-list>
  <sl-description-list-item label="Revision Code">A1</sl-description-list-item>
  <sl-description-list-item label="Second Revision Code">—</sl-description-list-item>
  <sl-description-list-item label="Title">test_review_doc_0009</sl-description-list-item>
</sl-description-list>
```

## Examples

### Columns

Set `cols` to control how many items sit on a row before wrapping. Defaults to 2.

```html:preview
<sl-description-list cols="3">
  <sl-description-list-item label="Client Document Identification">test_review_doc_0009</sl-description-list-item>
  <sl-description-list-item label="Vendor Document Identification">test_review_doc_0009</sl-description-list-item>
  <sl-description-list-item label="Document Type">External Job Document</sl-description-list-item>
  <sl-description-list-item label="Second Issuing Description">test_review_doc_0001</sl-description-list-item>
  <sl-description-list-item label="Superseded By">—</sl-description-list-item>
  <sl-description-list-item label="Document Status">Received</sl-description-list-item>
</sl-description-list>
```

### Rich values

```html:preview
<sl-description-list>
  <sl-description-list-item label="Created on">02-Oct-2026</sl-description-list-item>
  <sl-description-list-item label="Expires on">
    25-Jun-2026 <sl-tag size="small" variant="warning">Acquired</sl-tag>
  </sl-description-list-item>
</sl-description-list>
```
