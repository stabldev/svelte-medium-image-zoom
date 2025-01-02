<script lang="ts">
  import type { UncontrolledProps } from '$lib/types.js';
  import Controlled from './controlled.svelte';

  let { children, ...rest_props }: UncontrolledProps = $props();

  let is_zoomed = $state(false);
</script>

<Controlled {...rest_props} isZoomed={is_zoomed} onZoomChange={(z) => (is_zoomed = z)}
  >{@render children()}</Controlled
>
