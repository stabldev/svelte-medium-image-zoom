<script lang="ts">
  import Zoom from '$lib/index.js';
  import '$lib/styles.css';
  import { img_that_wanaka_tree } from '../stories/assets/index.js';

  let is_zoomed = $state(false);
</script>

<h1 style="font-family: monospace;">svelte-medium-image-zoom</h1>
<Zoom
  {is_zoomed}
  on_zoom_change={(z) => (is_zoomed = z)}
  wrap_element="span"
  zoom_margin={25}
>
  <img
    alt={img_that_wanaka_tree.alt}
    src={img_that_wanaka_tree.src}
    width="500"
    decoding="async"
    loading="lazy"
  />
</Zoom>
