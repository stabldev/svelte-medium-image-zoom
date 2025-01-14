<script lang="ts">
  import Zoom from '$lib/index.js';
  import '$lib/styles.css';
  import { img_that_wanaka_tree } from '../stories/assets/index.js';

  let is_zoomed = $state(false);
</script>

<h1 style="font-family: monospace;">svelte-medium-image-zoom</h1>
<!-- <Zoom -->
<!--   {is_zoomed} -->
<!--   on_zoom_change={(z) => (is_zoomed = z)} -->
<!--   wrap_element="span" -->
<!--   zoom_margin={0} -->
<!-- > -->
<!--   {#snippet zoom_content({ img, button_unzoom, modal_state })} -->
<!--     {@render img()} -->
<!--     <div -->
<!--       style=" -->
<!--         opacity: {modal_state === 'LOADING' || modal_state === 'LOADED' ? '1' : '0'}; -->
<!--         transition: opacity 0.3s; -->
<!--       " -->
<!--     > -->
<!--       {@render button_unzoom()} -->
<!--     </div> -->
<!--   {/snippet} -->
<!--   <img -->
<!--     alt={img_that_wanaka_tree.alt} -->
<!--     src={img_that_wanaka_tree.src} -->
<!--     width="500" -->
<!--     decoding="async" -->
<!--     loading="lazy" -->
<!--   /> -->
<!-- </Zoom> -->
<Zoom>
  <img
    alt={img_that_wanaka_tree.alt}
    src={img_that_wanaka_tree.src}
    style="width: 500px; height: 500px; object-fit: fill; object-position: center;
    background-color: cyan;"
    decoding="async"
    loading="lazy"
  />
</Zoom>
