# svelte-medium-image-zoom

![NPM Version](https://img.shields.io/npm/v/svelte-medium-image-zoom)
![NPM License](https://img.shields.io/npm/l/svelte-medium-image-zoom)

The original [medium.com-inspired image zooming](https://medium.design/image-zoom-on-medium-24d146fc0c20) library for [Svelte](https://svelte.dev/).  
[View the storybook examples](https://moonlitgrace.github.io/svelte-medium-image-zoom/)
to see various usages.

> status: alpha

## Quickstart

```bash
npm install --save svelte-medium-image-zoom
```

```svelte
<script lang="ts">
  import Zoom from 'svelte-medium-image-zoom';
  import 'svelte-medium-image-zoom/dist/styles.css';
</script>

<Zoom>
  <img
    alt="That Wanaka Tree, New Zealand by Laura Smetsers"
    src="/media/andres-iga.jpg"
    width="500"
  />
</Zoom>
```

## API

Note: component type props are rendered as `snippets`, check [this](https://svelte.dev/docs/svelte/snippet) for more.  
[example use](https://github.com/moonlitgrace/svelte-medium-image-zoom/pull/17)

```typescript
export interface ZoomProps {
  // Accessible label text for when you want to unzoom.
  // Default: 'Minimize image'
  a11y_name_button_unzoom?: string;

  // Accessible label text for when you want to zoom.
  // Default: 'Expand image'
  a11y_name_button_zoom?: string;

  // Your image (required).
  children: Snippet<[]>;

  // Custom CSS class to add to the zoomed <dialog>.
  class_dialog?: string;

  // Custom CSS class to add to the unzoom button.
  class_button_unzoom?: string;

  // Custom CSS class to add to the zoom button.
  class_button_zoom?: string;

  // Provide your own unzoom button icon.
  // Default: ICompress
  icon_unzoom?: Snippet<[]>;

  // Provide your own zoom button icon.
  // Default: IEnlarge
  icon_zoom?: Snippet<[]>;

  // Tell the component whether or not it should be zoomed
  // Default: false
  is_zoomed?: boolean;

  // Listen for hints from the component about when you
  // should zoom (`true` value) or unzoom (`false` value)
  on_zoom_change?: (value: boolean) => void;

  // Specify what type of element should be used for
  // internal component usage. This is useful if the
  // image is inside a <p> or <button>, for example.
  // Default: 'div'
  wrap_element?: 'div' | 'span';

  // Provide your own custom modal content component.
  zoom_content?: Snippet<[{
    img: Snippet<[]>;
    button_unzoom: Snippet<[]>;
    modal_state: IModalState;
    on_unzoom: () => void;
  }]>;

  // Offset in pixels the zoomed image should
  // be from the window's boundaries.
  // Default: 0
  zoom_margin?: number;
}
```
