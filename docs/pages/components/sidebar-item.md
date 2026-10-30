---
meta:
  title: Sidebar Item
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

## Examples

### Collapsed

In a collapsed [`sl-sidebar`](/components/sidebar), items with a `prefix` icon are shown icon-only and centred, while
items without an icon are hidden. Give top-level items a prefix icon when the sidebar can be collapsed.

```html:preview
<div style="height: 220px; display: flex;">
  <sl-sidebar collapsed>
    <sl-sidebar-item href="#" current><sl-icon slot="prefix" name="briefcase"></sl-icon>Projects</sl-sidebar-item>
    <sl-sidebar-item href="#"><sl-icon slot="prefix" name="folder"></sl-icon>Documents</sl-sidebar-item>
    <sl-sidebar-item href="#"><sl-icon slot="prefix" name="gear"></sl-icon>Settings</sl-sidebar-item>
    <sl-sidebar-item href="#">Hidden when collapsed</sl-sidebar-item>
  </sl-sidebar>
</div>
```

:::tip
In Figma the Sidebar Item master has a `Collapsed` variant: icon-only, 44×36, available with `Prefix=true` only.
:::
