# svelte-medium-image-zoom

[![NPM Version](https://img.shields.io/npm/v/svelte-medium-image-zoom?style=flat-square)](https://www.npmjs.com/package/svelte-medium-image-zoom)
[![NPM License](https://img.shields.io/npm/l/svelte-medium-image-zoom?style=flat-square)](https://www.npmjs.com/package/svelte-medium-image-zoom)
[![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/svelte-medium-image-zoom?style=flat-square)](https://www.npmjs.com/package/svelte-medium-image-zoom)
[![NPM Downloads](https://img.shields.io/npm/dm/svelte-medium-image-zoom?style=flat-square)](https://www.npmjs.com/package/svelte-medium-image-zoom)

The original [medium.com-inspired image zooming](https://medium.design/image-zoom-on-medium-24d146fc0c20) library for [Svelte](https://svelte.dev/).\
[View the storybook examples](https://moonlitgrace.github.io/svelte-medium-image-zoom/)
to see various usages.

Features:

- `<img />`, including all [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
  values, any [`object-position`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position),
  and [`loading="lazy"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading)
- `<div>` and `<span>` with any [`background-image`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-image),
  [`background-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size),
  and [`background-position`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position)
- `<picture>` with `<source />` and `<img />` (coming)
- `<figure>` with `<img />` (coming)
- `<svg>` (coming)
- [Custom zoom modal content](#custom-zoom-modal-content) (👇)
- Zero `dependencies`

Requirements to know about:

- `<dialog>` element ([caniuse dialog](https://caniuse.com/dialog))
- `ResizeObserver` ([caniuse ResizeObserver](https://caniuse.com/mdn-api_resizeobserver))
- Package build target is `ESNext`. If you need to support older environments,
  run this package through your build system.

## Quickstart

```bash
npm install --save svelte-medium-image-zoom
```

<!-- prettier-ignore-start -->
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
<!-- prettier-ignore-end -->

## API

Note: component type props are rendered as `snippets`, check [this](https://svelte.dev/docs/svelte/snippet) for more.\
[example use](https://github.com/moonlitgrace/svelte-medium-image-zoom/pull/17)

<!-- prettier-ignore-start -->
```ts
export interface ZoomProps {
  // Accessible label text for when you want to unzoom.
  // Default: 'Minimize image'
  a11y_name_button_unzoom?: string;

  // Accessible label text for when you want to zoom.
  // Default: 'Expand image'
  a11y_name_button_zoom?: string;

  // Your image (required).
  children: Snippet<[]>;

  // Custom CSS class to add to the unzoom and zoom buttons.
  class_button?: string;

  // Custom CSS class to add to the zoomed <dialog>.
  class_dialog?: string;

  // Transition duration for modal image and overlay elements.
  // Default: 300ms
  duration?: string | number;

  // Provide your own unzoom button icon.
  // Default: ICompress
  icon_unzoom?: Snippet<[]>;

  // Provide your own zoom button icon.
  // Default: IEnlarge
  icon_zoom?: Snippet<[]>;

  // Tell the component whether or not it should be zoomed.
  // Default: false
  is_zoomed?: boolean;

  // Listen for hints from the component about when you
  // should zoom (`true` value) or unzoom (`false` value).
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
    handle_unzoom: () => void;
  }]>;

  // Offset in pixels the zoomed image should
  // be from the window's boundaries.
  // Default: 0
  zoom_margin?: number;
}
```
<!-- prettier-ignore-end -->

## Basic Usage

Import the component and the CSS, wrap your image with the component, and the
component will handle it's own state.

```svelte
<script lang="ts">
  import Zoom from 'svelte-medium-image-zoom';
  import 'svelte-medium-image-zoom/dist/styles.css';
</script>

<!-- <img /> -->
<Zoom>
  <img
    alt="That Wanaka Tree, New Zealand by Laura Smetsers"
    src="/path/to/thatwanakatree.jpg"
    width="500"
  />
</Zoom>

<!-- <div> -->
<Zoom>
  <div
    aria-label="That Wanaka Tree, New Zealand by Laura Smetsers"
    role="img"
    class="div-img"
    style="
      background-color: #fff;
      background-image: url(/media/laura-smetsers.jpg);
      background-position: 50%;
      background-repeat: no-repeat;
      background-size: cover;
      width: 500px;
      height: 300px;
    "
  ></div>
</Zoom>
```

### Controlled usage

Import the component and the CSS, wrap your image with the component, and then dictate the `is_zoomed` with `on_zoom_change` handler state to the component.

```svelte
<script lang="ts">
  import Zoom from 'svelte-medium-image-zoom';
  import 'svelte-medium-image-zoom/dist/styles.css';

  let is_zoomed = $state(false);
</script>

<Zoom
  {is_zoomed}
  on_zoom_change={(z) => (is_zoomed = z)}
  wrap_element="span"
  zoom_margin={25}
>
  <img
    alt="That Wanaka Tree, New Zealand by Laura Smetsers"
    src="/path/to/thatwanakatree.jpg"
    width="500"
    decoding="async"
    loading="lazy"
  />
</Zoom>
```

The `on_zoom_change` prop accepts a callback that will receive `true` or `false`
based on events that occur (like click or scroll events) to assist you in
determining when to zoom and unzoom the component.

## Styles

You can import the default styles from `svelte-medium-image-zoom/dist/styles.css`
and override the values from your code, or you can copy [the styles.css
file](./src/lib/styles.css) and alter it to your liking. The latter is the best
option, given `rem`s should be used instead of `px` to account for different
default browser font sizes, and it's hard for a library to guess at what these
values should be.

An example of customizing the transition duration, timing function, overlay
background color, and unzoom button styles with `:focus-visible` can be found in
this story: [custom-modal-styles](https://moonlitgrace.github.io/svelte-medium-image-zoom/?path=/story/img--custom-modal-styles).

## Custom zoom modal content

If you want to customize the zoomed modal experience with a caption, form, or
other set of components, you can do so by providing a custom component to the
`zoom_content` prop.

[View the live example of custom zoom modal content.](https://moonlitgrace.github.io/svelte-medium-image-zoom/?path=/story/img--modal-figure-caption)

Below is some example code that demonstrates how to use this feature.

```svelte
<script lang="ts">
  import Zoom from 'svelte-medium-image-zoom';
  import 'svelte-medium-image-zoom/dist/styles.css';
</script>

<Zoom>
  {#snippet zoom_content({ img, button_unzoom, modal_state })}
    {@render button_unzoom()}
    <figure>
      {@render img()}
      <figcaption
        class="zoom-caption zoom-caption--bottom"
        class:zoom-caption--loaded={modal_state === 'LOADED'}
      >
        That Wanaka Tree, also known as the Wanaka Willow, is a willow tree located at the
        southern end of Lake Wānaka in the Otago region of New Zealand.
        <cite className="zoom-caption-cite">
          Wikipedia, <a
            className="zoom-caption-link"
            href="https://en.wikipedia.org/wiki/That_Wanaka_Tree"
          >
            That Wanaka Tree
          </a>
        </cite>
      </figcaption>
    </figure>
  {/snippet}
  <img
    alt="That Wanaka Tree, New Zealand by Laura Smetsers"
    src="/path/to/thatwanakatree.jpg"
    width="500"
    decoding="async"
    loading="lazy"
  />
</Zoom>
```

## Credits

This project is inspired from [rpearce](https://github.com/rpearce)'s [`react-medium-image-zoom`](https://github.com/rpearce/react-medium-image-zoom) library.
