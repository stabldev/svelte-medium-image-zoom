<script lang="ts">
  import { Zoomable } from '$lib/index.js';
  import '$lib/styles.css';
  import { img_that_wanaka_tree } from '../stories/assets/index.js';
</script>

<h1 style="font-family: monospace;">svelte-medium-image-zoom</h1>
<Zoomable wrapElement="span" zoomMargin={50}>
  <img alt={img_that_wanaka_tree.alt} src={img_that_wanaka_tree.src} width="500" />
</Zoomable>
