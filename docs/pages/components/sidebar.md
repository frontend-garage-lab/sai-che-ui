---
meta:
  title: Sidebar
  description: Sidebars hold the secondary navigation of a page and can be collapsed to a rail of icons.
layout: component
---

Compose a sidebar with [`sl-sidebar-group`](/components/sidebar-group) sections containing
[`sl-sidebar-item`](/components/sidebar-item) links. The button at the bottom (« when open, » when collapsed) toggles between the open and the
collapsed state; when collapsed only the group icons (and item prefix icons) remain visible.

```html:preview
<div style="height: 720px; display: flex;">
  <sl-sidebar>
    <sl-sidebar-group label="Documenti di progetto" count="70">
      <sl-icon slot="icon" name="file-earmark-text"></sl-icon>
      <sl-sidebar-item href="#" count="6" current>Job Document</sl-sidebar-item>
      <sl-sidebar-item href="#" count="24">Isometric Document</sl-sidebar-item>
      <sl-sidebar-item href="#" count="6">Advance Revision Notice</sl-sidebar-item>
      <sl-sidebar-item href="#" count="12">Reference Document</sl-sidebar-item>
      <sl-sidebar-item href="#" count="16">Certificate and Other Document</sl-sidebar-item>
      <sl-sidebar-item href="#" count="6">Dynamic Virtual Binder</sl-sidebar-item>
    </sl-sidebar-group>

    <sl-sidebar-group label="Procurement (SAP)" count="71">
      <sl-icon slot="icon" name="cart"></sl-icon>
      <sl-sidebar-item href="#" count="13">Purchase Request</sl-sidebar-item>
      <sl-sidebar-item href="#" count="18">Purchase Order</sl-sidebar-item>
      <sl-sidebar-item href="#" count="7">Bid Document</sl-sidebar-item>
      <sl-sidebar-item href="#" count="23">ASO - Expediting Report</sl-sidebar-item>
      <sl-sidebar-item href="#" count="10">Invoice</sl-sidebar-item>
    </sl-sidebar-group>

    <sl-sidebar-group label="Comunicazione" count="47">
      <sl-icon slot="icon" name="send"></sl-icon>
      <sl-sidebar-item href="#" count="5">Transmittal</sl-sidebar-item>
      <sl-sidebar-item href="#" count="19">Correspondence</sl-sidebar-item>
      <sl-sidebar-item href="#" count="23">Comment</sl-sidebar-item>
    </sl-sidebar-group>
  </sl-sidebar>
</div>
```

## Examples

### Collapsed

Set the `collapsed` attribute to start in the collapsed state. Listen to `sl-collapse` / `sl-expand` to persist the
user's choice.

```html:preview
<div style="height: 720px; display: flex;">
  <sl-sidebar collapsed>
    <sl-sidebar-group label="Documenti di progetto" count="70">
      <sl-icon slot="icon" name="file-earmark-text"></sl-icon>
      <sl-sidebar-item href="#" count="6" current>Job Document</sl-sidebar-item>
      <sl-sidebar-item href="#" count="24">Isometric Document</sl-sidebar-item>
      <sl-sidebar-item href="#" count="6">Advance Revision Notice</sl-sidebar-item>
      <sl-sidebar-item href="#" count="12">Reference Document</sl-sidebar-item>
      <sl-sidebar-item href="#" count="16">Certificate and Other Document</sl-sidebar-item>
      <sl-sidebar-item href="#" count="6">Dynamic Virtual Binder</sl-sidebar-item>
    </sl-sidebar-group>

    <sl-sidebar-group label="Procurement (SAP)" count="71">
      <sl-icon slot="icon" name="cart"></sl-icon>
      <sl-sidebar-item href="#" count="13">Purchase Request</sl-sidebar-item>
      <sl-sidebar-item href="#" count="18">Purchase Order</sl-sidebar-item>
      <sl-sidebar-item href="#" count="7">Bid Document</sl-sidebar-item>
      <sl-sidebar-item href="#" count="23">ASO - Expediting Report</sl-sidebar-item>
      <sl-sidebar-item href="#" count="10">Invoice</sl-sidebar-item>
    </sl-sidebar-group>

    <sl-sidebar-group label="Comunicazione" count="47">
      <sl-icon slot="icon" name="send"></sl-icon>
      <sl-sidebar-item href="#" count="5">Transmittal</sl-sidebar-item>
      <sl-sidebar-item href="#" count="19">Correspondence</sl-sidebar-item>
      <sl-sidebar-item href="#" count="23">Comment</sl-sidebar-item>
    </sl-sidebar-group>
  </sl-sidebar>
</div>
```

### Items with icons

Items with a `prefix` icon stay visible as icons when the sidebar is collapsed.

```html:preview
<div style="height: 260px; display: flex;">
  <sl-sidebar style="--width: 16rem;">
    <sl-sidebar-group label="Menu">
      <sl-sidebar-item href="#" current><sl-icon slot="prefix" name="grid"></sl-icon>Dashboard</sl-sidebar-item>
      <sl-sidebar-item href="#"><sl-icon slot="prefix" name="bar-chart"></sl-icon>Analysis</sl-sidebar-item>
      <sl-sidebar-item href="#" count="14"><sl-icon slot="prefix" name="bell"></sl-icon>Notifications</sl-sidebar-item>
    </sl-sidebar-group>
  </sl-sidebar>
</div>
```

