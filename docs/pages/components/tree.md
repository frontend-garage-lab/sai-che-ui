---
meta:
  title: Tree
  description: Trees allow you to display a hierarchical list of selectable tree items. Items with children can be expanded and collapsed as desired by the user.
layout: component
---

```html:preview
<sl-tree>
  <sl-tree-item>
    Deciduous
    <sl-tree-item>Birch</sl-tree-item>
    <sl-tree-item>
      Maple
      <sl-tree-item>Field maple</sl-tree-item>
      <sl-tree-item>Red maple</sl-tree-item>
      <sl-tree-item>Sugar maple</sl-tree-item>
    </sl-tree-item>
    <sl-tree-item>Oak</sl-tree-item>
  </sl-tree-item>

  <sl-tree-item>
    Coniferous
    <sl-tree-item>Cedar</sl-tree-item>
    <sl-tree-item>Pine</sl-tree-item>
    <sl-tree-item>Spruce</sl-tree-item>
  </sl-tree-item>

  <sl-tree-item>
    Non-trees
    <sl-tree-item>Bamboo</sl-tree-item>
    <sl-tree-item>Cactus</sl-tree-item>
    <sl-tree-item>Fern</sl-tree-item>
  </sl-tree-item>
</sl-tree>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/tree/tree.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/tree-item/tree-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-tree-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-tree>
      <sl-tree-item>
        Deciduous
        <sl-tree-item>Birch</sl-tree-item>
        <sl-tree-item>
          Maple
          <sl-tree-item>Field maple</sl-tree-item>
          <sl-tree-item>Red maple</sl-tree-item>
          <sl-tree-item>Sugar maple</sl-tree-item>
        </sl-tree-item>
        <sl-tree-item>Oak</sl-tree-item>
      </sl-tree-item>

      <sl-tree-item>
        Coniferous
        <sl-tree-item>Cedar</sl-tree-item>
        <sl-tree-item>Pine</sl-tree-item>
        <sl-tree-item>Spruce</sl-tree-item>
      </sl-tree-item>

      <sl-tree-item>
        Non-trees
        <sl-tree-item>Bamboo</sl-tree-item>
        <sl-tree-item>Cactus</sl-tree-item>
        <sl-tree-item>Fern</sl-tree-item>
      </sl-tree-item>
    </sl-tree>
  `
})
export class TreeExampleComponent {}
```

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@shoelace-style/shoelace/dist/react/tree';
import SlTreeItem from '@shoelace-style/shoelace/dist/react/tree-item';

const App = () => (
  <SlTree>
    <SlTreeItem>
      Deciduous
      <SlTreeItem>Birch</SlTreeItem>
      <SlTreeItem>
        Maple
        <SlTreeItem>Field maple</SlTreeItem>
        <SlTreeItem>Red maple</SlTreeItem>
        <SlTreeItem>Sugar maple</SlTreeItem>
      </SlTreeItem>
      <SlTreeItem>Oak</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Coniferous
      <SlTreeItem>Cedar</SlTreeItem>
      <SlTreeItem>Pine</SlTreeItem>
      <SlTreeItem>Spruce</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Non-trees
      <SlTreeItem>Bamboo</SlTreeItem>
      <SlTreeItem>Cactus</SlTreeItem>
      <SlTreeItem>Fern</SlTreeItem>
    </SlTreeItem>
  </SlTree>
);
```

## Examples

### Selection Modes

The `selection` attribute lets you change the selection behavior of the tree.

- Use `single` to allow the selection of a single item (default).
- Use `multiple` to allow the selection of multiple items.
- Use `leaf` to only allow leaf nodes to be selected.

```html:preview
<sl-select id="selection-mode" value="single" label="Selection">
  <sl-option value="single">Single</sl-option>
  <sl-option value="multiple">Multiple</sl-option>
  <sl-option value="leaf">Leaf</sl-option>
</sl-select>

<br />

<sl-tree class="tree-selectable">
  <sl-tree-item>
    Item 1
    <sl-tree-item>
      Item A
      <sl-tree-item>Item Z</sl-tree-item>
      <sl-tree-item>Item Y</sl-tree-item>
      <sl-tree-item>Item X</sl-tree-item>
    </sl-tree-item>
    <sl-tree-item>Item B</sl-tree-item>
    <sl-tree-item>Item C</sl-tree-item>
  </sl-tree-item>
  <sl-tree-item>Item 2</sl-tree-item>
  <sl-tree-item>Item 3</sl-tree-item>
</sl-tree>

<script>
  const selectionMode = document.querySelector('#selection-mode');
  const tree = document.querySelector('.tree-selectable');

  selectionMode.addEventListener('sl-change', () => {
    tree.querySelectorAll('sl-tree-item').forEach(item => (item.selected = false));
    tree.selection = selectionMode.value;
  });
</script>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/option/option.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/select/select.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/tree/tree.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/tree-item/tree-item.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, viewChild } from '@angular/core';
import type SlSelect from '@shoelace-style/shoelace/%NPMDIR%/components/select/select.component.js';
import type SlTree from '@shoelace-style/shoelace/%NPMDIR%/components/tree/tree.component.js';

@Component({
  selector: 'app-tree-selectable-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-select #mode value="single" label="Selection" (sl-change)="onModeChange()">
      <sl-option value="single">Single</sl-option>
      <sl-option value="multiple">Multiple</sl-option>
      <sl-option value="leaf">Leaf</sl-option>
    </sl-select>

    <br />

    <sl-tree #tree [selection]="selection()">
      <sl-tree-item>
        Item 1
        <sl-tree-item>
          Item A
          <sl-tree-item>Item Z</sl-tree-item>
          <sl-tree-item>Item Y</sl-tree-item>
          <sl-tree-item>Item X</sl-tree-item>
        </sl-tree-item>
        <sl-tree-item>Item B</sl-tree-item>
        <sl-tree-item>Item C</sl-tree-item>
      </sl-tree-item>
      <sl-tree-item>Item 2</sl-tree-item>
      <sl-tree-item>Item 3</sl-tree-item>
    </sl-tree>
  `
})
export class TreeSelectableExampleComponent {
  private readonly mode = viewChild.required<ElementRef<SlSelect>>('mode');
  private readonly tree = viewChild.required<ElementRef<SlTree>>('tree');
  readonly selection = signal<'single' | 'multiple' | 'leaf'>('single');

  onModeChange() {
    // Clear the current selection before switching mode, otherwise stale selections carry over.
    this.tree()
      .nativeElement.querySelectorAll('sl-tree-item')
      .forEach(item => ((item as HTMLElement & { selected: boolean }).selected = false));

    this.selection.set(this.mode().nativeElement.value as 'single' | 'multiple' | 'leaf');
  }
}
```

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@shoelace-style/shoelace/dist/react/tree';
import SlTreeItem from '@shoelace-style/shoelace/dist/react/tree-item';

const App = () => {
  const [selection, setSelection] = useState('single');

  return (
    <>
      <SlSelect label="Selection" value={selection} onSlChange={event => setSelection(event.target.value)}>
        <SlMenuItem value="single">single</SlMenuItem>
        <SlMenuItem value="multiple">multiple</SlMenuItem>
        <SlMenuItem value="leaf">leaf</SlMenuItem>
      </SlSelect>

      <br />

      <SlTree selection={selection}>
        <SlTreeItem>
          Item 1
          <SlTreeItem>
            Item A
            <SlTreeItem>Item Z</SlTreeItem>
            <SlTreeItem>Item Y</SlTreeItem>
            <SlTreeItem>Item X</SlTreeItem>
          </SlTreeItem>
          <SlTreeItem>Item B</SlTreeItem>
          <SlTreeItem>Item C</SlTreeItem>
        </SlTreeItem>
        <SlTreeItem>Item 2</SlTreeItem>
        <SlTreeItem>Item 3</SlTreeItem>
      </SlTree>
    </>
  );
};
```

### Showing Indent Guides

Indent guides can be drawn by setting `--indent-guide-width`. You can also change the color, offset, and style, using `--indent-guide-color`, `--indent-guide-style`, and `--indent-guide-offset`, respectively.

```html:preview
<sl-tree class="tree-with-lines">
  <sl-tree-item expanded>
    Deciduous
    <sl-tree-item>Birch</sl-tree-item>
    <sl-tree-item expanded>
      Maple
      <sl-tree-item>Field maple</sl-tree-item>
      <sl-tree-item>Red maple</sl-tree-item>
      <sl-tree-item>Sugar maple</sl-tree-item>
    </sl-tree-item>
    <sl-tree-item>Oak</sl-tree-item>
  </sl-tree-item>

  <sl-tree-item>
    Coniferous
    <sl-tree-item>Cedar</sl-tree-item>
    <sl-tree-item>Pine</sl-tree-item>
    <sl-tree-item>Spruce</sl-tree-item>
  </sl-tree-item>

  <sl-tree-item>
    Non-trees
    <sl-tree-item>Bamboo</sl-tree-item>
    <sl-tree-item>Cactus</sl-tree-item>
    <sl-tree-item>Fern</sl-tree-item>
  </sl-tree-item>
</sl-tree>

<style>
  .tree-with-lines {
    --indent-guide-width: 1px;
  }
</style>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/tree/tree.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/tree-item/tree-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-tree-showing-indent-guides-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .tree-with-lines {
        --indent-guide-width: 1px;
      }
  `,
  template: `
    <sl-tree class="tree-with-lines">
      <sl-tree-item expanded>
        Deciduous
        <sl-tree-item>Birch</sl-tree-item>
        <sl-tree-item expanded>
          Maple
          <sl-tree-item>Field maple</sl-tree-item>
          <sl-tree-item>Red maple</sl-tree-item>
          <sl-tree-item>Sugar maple</sl-tree-item>
        </sl-tree-item>
        <sl-tree-item>Oak</sl-tree-item>
      </sl-tree-item>

      <sl-tree-item>
        Coniferous
        <sl-tree-item>Cedar</sl-tree-item>
        <sl-tree-item>Pine</sl-tree-item>
        <sl-tree-item>Spruce</sl-tree-item>
      </sl-tree-item>

      <sl-tree-item>
        Non-trees
        <sl-tree-item>Bamboo</sl-tree-item>
        <sl-tree-item>Cactus</sl-tree-item>
        <sl-tree-item>Fern</sl-tree-item>
      </sl-tree-item>
    </sl-tree>
  `
})
export class TreeShowingIndentGuidesExampleComponent {}
```

{% raw %}

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@shoelace-style/shoelace/dist/react/tree';
import SlTreeItem from '@shoelace-style/shoelace/dist/react/tree-item';

const App = () => (
  <SlTree class="tree-with-lines" style={{ '--indent-guide-width': '1px' }}>
    <SlTreeItem expanded>
      Deciduous
      <SlTreeItem>Birch</SlTreeItem>
      <SlTreeItem expanded>
        Maple
        <SlTreeItem>Field maple</SlTreeItem>
        <SlTreeItem>Red maple</SlTreeItem>
        <SlTreeItem>Sugar maple</SlTreeItem>
      </SlTreeItem>
      <SlTreeItem>Oak</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Coniferous
      <SlTreeItem>Cedar</SlTreeItem>
      <SlTreeItem>Pine</SlTreeItem>
      <SlTreeItem>Spruce</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Non-trees
      <SlTreeItem>Bamboo</SlTreeItem>
      <SlTreeItem>Cactus</SlTreeItem>
      <SlTreeItem>Fern</SlTreeItem>
    </SlTreeItem>
  </SlTree>
);
```

{% endraw %}

### Lazy Loading

Use the `lazy` attribute on a tree item to indicate that the content is not yet present and will be loaded later. When the user tries to expand the node, the `loading` state is set to `true` and the `sl-lazy-load` event will be emitted to allow you to load data asynchronously. The item will remain in a loading state until its content is changed.

If you want to disable this behavior after the first load, simply remove the `lazy` attribute and, on the next expand, the existing content will be shown instead.

```html:preview
<sl-tree>
  <sl-tree-item lazy>Available Trees</sl-tree-item>
</sl-tree>

<script type="module">
  const lazyItem = document.querySelector('sl-tree-item[lazy]');

  lazyItem.addEventListener('sl-lazy-load', () => {
    // Simulate asynchronous loading
    setTimeout(() => {
      const subItems = ['Birch', 'Cedar', 'Maple', 'Pine'];

      for (const item of subItems) {
        const treeItem = document.createElement('sl-tree-item');
        treeItem.innerText = item;
        lazyItem.append(treeItem);
      }

      // Disable lazy mode once the content has been loaded
      lazyItem.lazy = false;
    }, 1000);
  });
</script>
```

```jsx:react
import SlTree from '@shoelace-style/shoelace/dist/react/tree';
import SlTreeItem from '@shoelace-style/shoelace/dist/react/tree-item';

const App = () => {
  const [childItems, setChildItems] = useState([]);
  const [lazy, setLazy] = useState(true);

  const handleLazyLoad = () => {
    // Simulate asynchronous loading
    setTimeout(() => {
      setChildItems(['Birch', 'Cedar', 'Maple', 'Pine']);

      // Disable lazy mode once the content has been loaded
      setLazy(false);
    }, 1000);
  };

  return (
    <SlTree>
      <SlTreeItem lazy={lazy} onSlLazyLoad={handleLazyLoad}>
        Available Trees
        {childItems.map(item => (
          <SlTreeItem>{item}</SlTreeItem>
        ))}
      </SlTreeItem>
    </SlTree>
  );
};
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/tree/tree.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/tree-item/tree-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-tree-lazy-loading-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-tree>
      <sl-tree-item lazy>Available Trees</sl-tree-item>
    </sl-tree>

    <script type="module">
      const lazyItem = document.querySelector('sl-tree-item[lazy]');

      lazyItem.addEventListener('sl-lazy-load', () => {
        // Simulate asynchronous loading
        setTimeout(() => {
          const subItems = ['Birch', 'Cedar', 'Maple', 'Pine'];

          for (const item of subItems) {
            const treeItem = document.createElement('sl-tree-item');
            treeItem.innerText = item;
            lazyItem.append(treeItem);
          }

          // Disable lazy mode once the content has been loaded
          lazyItem.lazy = false;
        }, 1000);
      });
    </script>
  `
})
export class TreeLazyLoadingExampleComponent {}
```

### Customizing the Expand and Collapse Icons

Use the `expand-icon` and `collapse-icon` slots to change the expand and collapse icons, respectively. To disable the animation, override the `rotate` property on the `expand-button` part as shown below.

```html:preview
<sl-tree class="custom-icons">
  <sl-icon name="plus-square" slot="expand-icon"></sl-icon>
  <sl-icon name="dash-square" slot="collapse-icon"></sl-icon>

  <sl-tree-item>
    Deciduous
    <sl-tree-item>Birch</sl-tree-item>
    <sl-tree-item>
      Maple
      <sl-tree-item>Field maple</sl-tree-item>
      <sl-tree-item>Red maple</sl-tree-item>
      <sl-tree-item>Sugar maple</sl-tree-item>
    </sl-tree-item>
    <sl-tree-item>Oak</sl-tree-item>
  </sl-tree-item>

  <sl-tree-item>
    Coniferous
    <sl-tree-item>Cedar</sl-tree-item>
    <sl-tree-item>Pine</sl-tree-item>
    <sl-tree-item>Spruce</sl-tree-item>
  </sl-tree-item>

  <sl-tree-item>
    Non-trees
    <sl-tree-item>Bamboo</sl-tree-item>
    <sl-tree-item>Cactus</sl-tree-item>
    <sl-tree-item>Fern</sl-tree-item>
  </sl-tree-item>
</sl-tree>

<style>
  .custom-icons sl-tree-item::part(expand-button) {
    /* Disable the expand/collapse animation */
    rotate: none;
  }
</style>
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/tree/tree.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/tree-item/tree-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-tree-customizing-the-expand-and-collapse-icons-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .custom-icons sl-tree-item::part(expand-button) {
        /* Disable the expand/collapse animation */
        rotate: none;
      }
  `,
  template: `
    <sl-tree class="custom-icons">
      <sl-icon name="plus-square" slot="expand-icon"></sl-icon>
      <sl-icon name="dash-square" slot="collapse-icon"></sl-icon>

      <sl-tree-item>
        Deciduous
        <sl-tree-item>Birch</sl-tree-item>
        <sl-tree-item>
          Maple
          <sl-tree-item>Field maple</sl-tree-item>
          <sl-tree-item>Red maple</sl-tree-item>
          <sl-tree-item>Sugar maple</sl-tree-item>
        </sl-tree-item>
        <sl-tree-item>Oak</sl-tree-item>
      </sl-tree-item>

      <sl-tree-item>
        Coniferous
        <sl-tree-item>Cedar</sl-tree-item>
        <sl-tree-item>Pine</sl-tree-item>
        <sl-tree-item>Spruce</sl-tree-item>
      </sl-tree-item>

      <sl-tree-item>
        Non-trees
        <sl-tree-item>Bamboo</sl-tree-item>
        <sl-tree-item>Cactus</sl-tree-item>
        <sl-tree-item>Fern</sl-tree-item>
      </sl-tree-item>
    </sl-tree>
  `
})
export class TreeCustomizingTheExpandAndCollapseIconsExampleComponent {}
```

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@shoelace-style/shoelace/dist/react/tree';
import SlTreeItem from '@shoelace-style/shoelace/dist/react/tree-item';

const App = () => (
  <SlTree>
    <SlIcon name="plus-square" slot="expand-icon"></SlIcon>
    <SlIcon name="dash-square" slot="collapse-icon"></SlIcon>

    <SlTreeItem>
      Deciduous
      <SlTreeItem>Birch</SlTreeItem>
      <SlTreeItem>
        Maple
        <SlTreeItem>Field maple</SlTreeItem>
        <SlTreeItem>Red maple</SlTreeItem>
        <SlTreeItem>Sugar maple</SlTreeItem>
      </SlTreeItem>
      <SlTreeItem>Oak</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Coniferous
      <SlTreeItem>Cedar</SlTreeItem>
      <SlTreeItem>Pine</SlTreeItem>
      <SlTreeItem>Spruce</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Non-trees
      <SlTreeItem>Bamboo</SlTreeItem>
      <SlTreeItem>Cactus</SlTreeItem>
      <SlTreeItem>Fern</SlTreeItem>
    </SlTreeItem>
  </SlTree>
);
```

### With Icons

Decorative icons can be used before labels to provide hints for each node.

```html:preview
<sl-tree class="tree-with-icons">
  <sl-tree-item expanded>
    <sl-icon name="folder"></sl-icon>
    Documents

    <sl-tree-item>
      <sl-icon name="folder"> </sl-icon>
      Photos
      <sl-tree-item>
        <sl-icon name="image"></sl-icon>
        birds.jpg
      </sl-tree-item>
      <sl-tree-item>
        <sl-icon name="image"></sl-icon>
        kitten.jpg
      </sl-tree-item>
      <sl-tree-item>
        <sl-icon name="image"></sl-icon>
        puppy.jpg
      </sl-tree-item>
    </sl-tree-item>

    <sl-tree-item>
      <sl-icon name="folder"></sl-icon>
      Writing
      <sl-tree-item>
        <sl-icon name="file"></sl-icon>
        draft.txt
      </sl-tree-item>
      <sl-tree-item>
        <sl-icon name="file-pdf"></sl-icon>
        final.pdf
      </sl-tree-item>
      <sl-tree-item>
        <sl-icon name="file-bar-graph"></sl-icon>
        sales.xls
      </sl-tree-item>
    </sl-tree-item>
  </sl-tree-item>
</sl-tree>
```

```jsx:react
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';
import SlTree from '@shoelace-style/shoelace/dist/react/tree';
import SlTreeItem from '@shoelace-style/shoelace/dist/react/tree-item';

const App = () => {
  return (
    <SlTree class="tree-with-icons">
      <SlTreeItem expanded>
        <SlIcon name="folder" />
        Root
        <SlTreeItem>
          <SlIcon name="folder" />
          Folder 1<SlTreeItem>
            <SlIcon name="files" />
            File 1 - 1
          </SlTreeItem>
          <SlTreeItem disabled>
            <SlIcon name="files" />
            File 1 - 2
          </SlTreeItem>
          <SlTreeItem>
            <SlIcon name="files" />
            File 1 - 3
          </SlTreeItem>
        </SlTreeItem>
        <SlTreeItem>
          <SlIcon name="files" />
          Folder 2<SlTreeItem>
            <SlIcon name="files" />
            File 2 - 1
          </SlTreeItem>
          <SlTreeItem>
            <SlIcon name="files" />
            File 2 - 2
          </SlTreeItem>
        </SlTreeItem>
        <SlTreeItem>
          <SlIcon name="files" />
          File 1
        </SlTreeItem>
      </SlTreeItem>
    </SlTree>
  );
};
```

```ts:angular
import '@shoelace-style/shoelace/%NPMDIR%/components/icon/icon.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/tree/tree.js';
import '@shoelace-style/shoelace/%NPMDIR%/components/tree-item/tree-item.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-tree-with-icons-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-tree class="tree-with-icons">
      <sl-tree-item expanded>
        <sl-icon name="folder"></sl-icon>
        Documents

        <sl-tree-item>
          <sl-icon name="folder"> </sl-icon>
          Photos
          <sl-tree-item>
            <sl-icon name="image"></sl-icon>
            birds.jpg
          </sl-tree-item>
          <sl-tree-item>
            <sl-icon name="image"></sl-icon>
            kitten.jpg
          </sl-tree-item>
          <sl-tree-item>
            <sl-icon name="image"></sl-icon>
            puppy.jpg
          </sl-tree-item>
        </sl-tree-item>

        <sl-tree-item>
          <sl-icon name="folder"></sl-icon>
          Writing
          <sl-tree-item>
            <sl-icon name="file"></sl-icon>
            draft.txt
          </sl-tree-item>
          <sl-tree-item>
            <sl-icon name="file-pdf"></sl-icon>
            final.pdf
          </sl-tree-item>
          <sl-tree-item>
            <sl-icon name="file-bar-graph"></sl-icon>
            sales.xls
          </sl-tree-item>
        </sl-tree-item>
      </sl-tree-item>
    </sl-tree>
  `
})
export class TreeWithIconsExampleComponent {}
```
