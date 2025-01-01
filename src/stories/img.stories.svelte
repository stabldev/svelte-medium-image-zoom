<script lang="ts" module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Zoom from '$lib/index.js';
  import '$lib/styles.css';

  import { img_that_wanaka_tree } from './assets/index.js';

  const { Story } = defineMeta({
    title: '<img>',
    component: Zoom
  });
</script>

<Story name="Regular">
  <h1>Zooming a regular image</h1>
  <Zoom>
    <img alt={img_that_wanaka_tree.alt} src={img_that_wanaka_tree.src} width="500" />
  </Zoom>
</Story>
