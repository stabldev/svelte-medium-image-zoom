<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Zoom from '$lib/index.js';
  import '$lib/styles.css';
  import './base.css';

  import {
    img_that_wanaka_tree,
    img_douglas_bagg,
    img_nz_map,
    img_kea_small,
    img_glenorchy_lagoon,
    img_hooker_valley_track
  } from './assets/index.js';
  import type { Nullable } from '$lib/types.js';

  const { Story } = defineMeta({
    title: '<img>',
    component: Zoom
  });

  // example states
  let ref_img_dialog = $state<Nullable<HTMLDialogElement>>(null);
</script>

<Story name="Regular">
  <main aria-label="Story">
    <h1>Zooming a regular image</h1>
    <Zoom>
      <img
        alt={img_that_wanaka_tree.alt}
        src={img_that_wanaka_tree.src}
        width="400"
        decoding="async"
        loading="lazy"
      />
    </Zoom>
  </main>
</Story>

<Story name="Zoom Margin">
  <main aria-label="Story" class="max-w-60">
    <h1>Setting a zoomMargin of 45(px)</h1>
    <p>This example should always be offset from the window by at least 45px</p>
    <Zoom zoom_margin={45}>
      <img
        alt={img_that_wanaka_tree.alt}
        src={img_that_wanaka_tree.src}
        width="400"
        decoding="async"
        loading="lazy"
      />
    </Zoom>
  </main>
</Story>

<Story name="Small Portrait">
  <main aria-label="Story" class="max-w-60">
    <h1>A portrait image with a small width specified</h1>
    <p>Small size specifications scale well, too — even on mobile.</p>
    <Zoom>
      <img
        alt={img_douglas_bagg.alt}
        src={img_douglas_bagg.src}
        height="150"
        decoding="async"
        loading="lazy"
      />
    </Zoom>
  </main>
</Story>

<Story name="SVG Source">
  <main aria-label="Story" class="max-w-60">
    <h1>An image with an SVG src</h1>
    <Zoom>
      <img
        alt={img_nz_map.alt}
        src={img_nz_map.src}
        height="150"
        decoding="async"
        loading="lazy"
      />
    </Zoom>
  </main>
</Story>

<Story name="Data SVG Source">
  <main aria-label="Story" class="max-w-60">
    <h1>An image with a data:image/svg+xml src</h1>
    <Zoom>
      <img
        alt="Gatsby G Logo"
        src="data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2a10 10 0 110 20 10 10 0 010-20zm0 2c-3.73 0-6.86 2.55-7.75 6L14 19.75c3.45-.89 6-4.02 6-7.75h-5.25v1.5h3.45a6.37 6.37 0 01-3.89 4.44L6.06 9.69C7 7.31 9.3 5.63 12 5.63c2.13 0 4 1.04 5.18 2.65l1.23-1.06A7.959 7.959 0 0012 4zm-8 8a8 8 0 008 8c.04 0 .09 0-8-8z' fill='%23639'/%3E%3C/svg%3E"
      />
    </Zoom>
  </main>
</Story>

<Story name="Small Src Size">
  <main aria-label="Story" class="max-w-60">
    <h1>An image with a small size</h1>
    <p>
      In order to prevent blurry images, An image won't scale up larger than its natural
      dimensions.
    </p>
    <Zoom>
      <img
        alt={img_kea_small.alt}
        src={img_kea_small.src}
        width="150"
        decoding="async"
        loading="lazy"
      />
    </Zoom>
  </main>
</Story>

<Story name="Custom Modal Styles">
  <main aria-label="Story" class="max-w-60">
    <h1>Custom Modal Styles</h1>
    <p>Use CSS to customize the zoom modal styles.</p>
    <p>Here, we slow down the transition time and use a different overlay color.</p>
    <Zoom class_dialog="custom-zoom">
      <img
        alt={img_glenorchy_lagoon.alt}
        src={img_glenorchy_lagoon.src}
        width="400"
        decoding="async"
        loading="lazy"
      />
    </Zoom>
    <p>
      The CSS class, <code>custom-zoom</code>, is sent to the component via the
      <code>class_dialog</code> string prop. Here are the styles used:
    </p>
    <pre>
          <code>
{`.custom-zoom [data-smiz-modal-overlay],
.custom-zoom [data-smiz-modal-img] {
  transition-duration: 0.8s;
  transition-timing-function: linear;
}
.custom-zoom [data-smiz-modal-overlay="hidden"] {
  background-color: rgb(56, 58, 89, 0);
}
.custom-zoom [data-smiz-modal-overlay="visible"] {
  background-color: rgb(56, 58, 89, 1);
}
.custom-zoom [data-smiz-btn-unzoom] {
  background-color: #bd93f9;
  color: #000;
}
.custom-zoom [data-smiz-btn-unzoom]:focus-visible {
  outline-offset: 0.4rem;
  outline: 0.2rem solid #bd93f9;
}`}
          </code>
        </pre>
  </main>
</Story>

<Story name="Zoom Image From Inside Dialog">
  <main aria-label="Story">
    <h1>Zoom Image From Inside Dialog</h1>
    <button onclick={() => ref_img_dialog?.showModal()}>Open Modal</button>

    <dialog aria-modal="true" bind:this={ref_img_dialog}>
      <button onclick={() => ref_img_dialog?.close()}>Close</button>
      <h1>Zooming should work!</h1>
      <Zoom>
        <img
          alt={img_glenorchy_lagoon.alt}
          src={img_glenorchy_lagoon.src}
          width="400"
          decoding="async"
          loading="lazy"
        />
      </Zoom>
    </dialog>
  </main>
</Story>

<Story name="Modal Figure Caption">
  <main aria-label="Story" class="max-w-60">
    <h1>Modal With Figure And Caption</h1>
    <p>
      If you want more control over the zoom modal's content, you can pass a `zoom_content`
      component
    </p>
    <Zoom>
      {#snippet zoom_content({ img, button_unzoom, modal_state })}
        {@render button_unzoom()}
        <figure>
          {@render img()}
          <figcaption
            class="zoom-caption zoom-caption--bottom"
            class:zoom-caption--loaded={modal_state === 'LOADED'}
          >
            That Wanaka Tree, also known as the Wanaka Willow, is a willow tree located at
            the southern end of Lake Wānaka in the Otago region of New Zealand.
            <cite class="zoom-caption-cite">
              Wikipedia,{' '}
              <a
                href="https://en.wikipedia.org/wiki/That_Wanaka_Tree"
                class="zoom-caption-link"
              >
                That Wanaka Tree
              </a>
            </cite>
          </figcaption>
        </figure>
      {/snippet}
      <img
        alt={img_that_wanaka_tree.alt}
        src={img_that_wanaka_tree.src}
        width="500"
        decoding="async"
        loading="lazy"
      />
    </Zoom>
  </main>
</Story>

<Story name="Custom Button Icons">
  <main aria-label="Story" class="max-w-60">
    <h1>An image with custom zoom & unzoom icons</h1>
    <p>Press TAB to activate the zoom button</p>
    <Zoom class_button="change-icons">
      {#snippet icon_unzoom()}
        <span>-</span>
      {/snippet}
      {#snippet icon_zoom()}
        <span>+</span>
      {/snippet}
      <img
        alt={img_hooker_valley_track.alt}
        src={img_hooker_valley_track.src}
        width="400"
        decoding="async"
        loading="lazy"
      />
    </Zoom>
  </main>
</Story>
