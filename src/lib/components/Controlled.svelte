<script lang="ts">
  import type { ControlledProps } from '$lib/types.js';
  import { generateId } from '$lib/utils.js';

  // ==================================================

  const ModalState = {
    LOADED: 'LOADED',
    LOADING: 'LOADING',
    UNLOADED: 'UNLOADED',
    UNLOADING: 'UNLOADING'
  } as const;

  type IModalState = (typeof ModalState)[keyof typeof ModalState];

  interface ControlledState {
    id: string;
    isZoomImgLoaded: boolean;
    loadedImgEl: HTMLImageElement | undefined;
    modalState: IModalState;
  }

  // ==================================================

  let {}: ControlledProps = $props();

  let controlledState: ControlledState = $state({
    id: '',
    isZoomImgLoaded: false,
    loadedImgEl: undefined,
    modalState: ModalState.UNLOADED
  });

  // ==================================================

  /**
   * Because of SSR, set a unique ID after render
   */
  function setId() {
    controlledState.id = generateId();
  }
</script>

<div></div>
