<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Zoom from '$lib/index.js';
  import '$lib/styles.css';
  import './base.css';

  import { img_that_wanaka_tree } from './assets/index.js';

  const { Story } = defineMeta({
    title: '<img>',
    component: Zoom
  });
</script>

<Story name="Regular">
  <main aria-label="Story">
    <h1>Zooming a regular image</h1>
    <Zoom>
      <img alt={img_that_wanaka_tree.alt} src={img_that_wanaka_tree.src} width="500" />
    </Zoom>
  </main>
</Story>

<Story name="Zoom Margin">
  <main aria-label="Story">
    <h1>Setting a zoomMargin of 45(px)</h1>
    <div class="max-w-60">
      <p>This example should always be offset from the window by at least 45px</p>
      <Zoom zoom_margin={45}>
        <img alt={img_that_wanaka_tree.alt} src={img_that_wanaka_tree.src} width="500" />
      </Zoom>
    </div>
  </main>
</Story>
