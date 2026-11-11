---
meta:
  title: Header Item
  description: Header items are the entries in a header's main navigation.
layout: component
---

Used inside [`sl-header`](/components/header) to build the main navigation. Set `href` for a plain link, `current` to
mark the active page, or add a `menu` slot to turn the item into a dropdown.

```html:preview
<sl-header>
  <span slot="logo"></span>

  <sl-header-item>
    Project Data
    <sl-menu slot="menu">
      <sl-menu-item>Documents</sl-menu-item>
      <sl-menu-item>Reports</sl-menu-item>
    </sl-menu>
  </sl-header-item>
  <sl-header-item href="#" current>Dashboard</sl-header-item>
</sl-header>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/header/header.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/header-item/header-item.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/menu/menu.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/menu-item/menu-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-header-item-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-header>
      <span slot="logo"></span>

      <sl-header-item>
        Project Data
        <sl-menu slot="menu">
          <sl-menu-item>Documents</sl-menu-item>
          <sl-menu-item>Reports</sl-menu-item>
        </sl-menu>
      </sl-header-item>
      <sl-header-item href="#" current>Dashboard</sl-header-item>
    </sl-header>
  `
})
export class HeaderItemExampleComponent {}
```

## Examples

### Dropdown with a submenu

Add a `menu` slot containing an [`sl-menu`](/components/menu) with [`sl-menu-item`](/components/menu-item) children.
The item renders a chevron and opens the menu when clicked.

```html:preview
<sl-header>
  <span slot="logo"></span>

  <sl-header-item>
    Configuration
    <sl-menu slot="menu">
      <sl-menu-item>Users</sl-menu-item>
      <sl-menu-item>Permissions</sl-menu-item>
      <sl-menu-item>Workflow Rules</sl-menu-item>
    </sl-menu>
  </sl-header-item>
</sl-header>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/header/header.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/header-item/header-item.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/menu/menu.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/menu-item/menu-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-header-item-dropdown-with-a-submenu-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-header>
      <span slot="logo"></span>

      <sl-header-item>
        Configuration
        <sl-menu slot="menu">
          <sl-menu-item>Users</sl-menu-item>
          <sl-menu-item>Permissions</sl-menu-item>
          <sl-menu-item>Workflow Rules</sl-menu-item>
        </sl-menu>
      </sl-header-item>
    </sl-header>
  `
})
export class HeaderItemDropdownWithASubmenuExampleComponent {}
```

### Current page

Set the `current` attribute to mark the item for the page the user is on.

```html:preview
<sl-header>
  <span slot="logo"></span>
  <sl-header-item href="#" current>Dashboard</sl-header-item>
  <sl-header-item href="#">Reports</sl-header-item>
</sl-header>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/header/header.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/header-item/header-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-header-item-current-page-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-header>
      <span slot="logo"></span>
      <sl-header-item href="#" current>Dashboard</sl-header-item>
      <sl-header-item href="#">Reports</sl-header-item>
    </sl-header>
  `
})
export class HeaderItemCurrentPageExampleComponent {}
```
