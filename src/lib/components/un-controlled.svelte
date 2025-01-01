<script lang="ts">
  import type { UncontrolledProps } from '$lib/types.js';
  import Controlled from './controlled.svelte';

  let props: UncontrolledProps = $props();

  let is_zoomed = $state(false);
  function handle_is_zoomed(_is_zoomed: boolean) {
    is_zoomed = _is_zoomed;
  }
</script>

<Controlled {...props} isZoomed={is_zoomed} onZoomChange={handle_is_zoomed} />
