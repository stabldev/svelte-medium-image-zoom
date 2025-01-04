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
  zoom_margin={0}
>
  <img
    alt={img_that_wanaka_tree.alt}
    src={img_that_wanaka_tree.src}
    width="500"
    decoding="async"
    loading="lazy"
  />
</Zoom>
<Zoom>
  <div
    aria-label="That Wanaka Tree, New Zealand by Laura Smetsers"
    role="img"
    class="div-img"
    style="
      background-color: #fff;
      background-image: url(/media/laura-smetsers.jpg);
      background-position: top;
      background-repeat: no-repeat;
      background-size: cover;
      width: 500px;
      height: 300px;
    "
  ></div>
</Zoom>
