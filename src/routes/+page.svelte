<script lang="ts">
  import Zoom from '$lib/index.js';
  import '$lib/styles.css';
  import { img_that_wanaka_tree } from '../stories/assets/index.js';

  let zoomed = $state(false);
</script>

<h1 style="font-family: monospace;">svelte-medium-image-zoom</h1>
<Zoom
  isZoomed={zoomed}
  onZoomChange={(z) => (zoomed = z)}
  wrapElement="span"
  zoomMargin={50}
>
  <img alt={img_that_wanaka_tree.alt} src={img_that_wanaka_tree.src} width="500" />
</Zoom>
