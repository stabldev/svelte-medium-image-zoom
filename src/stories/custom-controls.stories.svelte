<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Zoom from '$lib/index.js';
  import '$lib/styles.css';
  import './base.css';

  import { img_that_wanaka_tree } from './assets/index.js';
  import { onMount } from 'svelte';

  const { Story } = defineMeta({
    title: 'Example/Custom Controls',
    component: Zoom
  });
</script>

<script lang="ts">
  let is_zoomed = $state(false);

  function handle_keydown(e: KeyboardEvent) {
    if (e.key === 'j') {
      is_zoomed = true;
    } else if (e.key === 'k') {
      is_zoomed = false;
    }
  }
  onMount(() => {
    document.addEventListener('keydown', handle_keydown);
    return () => document.removeEventListener('keydown', handle_keydown);
  });
</script>

<Story name="J and K Zoom Unzoom">
  <main aria-label="Story">
    <h1>Custom zoom and unzoom controls</h1>
    <p>Click into this window, then use "j" to zoom and "k" to unzoom</p>
    <Zoom {is_zoomed} on_zoom_change={undefined}>
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
