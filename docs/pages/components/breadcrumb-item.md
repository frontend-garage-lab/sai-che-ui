---
meta:
  title: Breadcrumb Item
  description: Breadcrumb Items are used inside breadcrumbs to represent different links.
layout: component
---

```html:preview
<sl-breadcrumb>
  <sl-breadcrumb-item>
    <sl-icon slot="prefix" name="house"></sl-icon>
    Home
  </sl-breadcrumb-item>
  <sl-breadcrumb-item>Clothing</sl-breadcrumb-item>
  <sl-breadcrumb-item>Shirts</sl-breadcrumb-item>
</sl-breadcrumb>
```

```jsx:react
import SlBreadcrumb from '@saipem/design-system/dist/react/breadcrumb';
import SlBreadcrumbItem from '@saipem/design-system/dist/react/breadcrumb-item';
import SlIcon from '@saipem/design-system/dist/react/icon';

const App = () => (
  <SlBreadcrumb>
    <SlBreadcrumbItem>
      <SlIcon slot="prefix" name="house"></SlIcon>
      Home
    </SlBreadcrumbItem>
    <SlBreadcrumbItem>Clothing</SlBreadcrumbItem>
    <SlBreadcrumbItem>Shirts</SlBreadcrumbItem>
  </SlBreadcrumb>
);
```

:::tip
Additional demonstrations can be found in the [breadcrumb examples](/components/breadcrumb).
:::
