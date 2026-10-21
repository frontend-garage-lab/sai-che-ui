---
meta:
  title: Sidebar Group
  description: Used inside a sidebar to build its navigation.
layout: component
---

Used inside [`sl-sidebar`](/components/sidebar). See the sidebar page for full examples.

```html:preview
<sl-sidebar no-toggle style="--width: 20rem; height: auto;">
  <sl-sidebar-group label="Procurement (SAP)" count="71">
    <sl-icon slot="icon" name="cart"></sl-icon>
    <sl-sidebar-item href="#" count="13" current>Purchase Request</sl-sidebar-item>
    <sl-sidebar-item href="#" count="18">Purchase Order</sl-sidebar-item>
  </sl-sidebar-group>
</sl-sidebar>
```
