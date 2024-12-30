<script lang="ts">
  import type { ControlledProps } from '$lib/types.js';
  import { generate_id, get_dialog_container } from '$lib/utils.js';
  import { onMount } from 'svelte';
  import { portal } from 'svelte-portal';

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
    imgEl: HTMLImageElement | null;
    loadedImgEl: HTMLImageElement | null;
    modalState: IModalState;
  }

  // ==================================================

  let { children, dialogClass }: ControlledProps = $props();

  let _state: ControlledState = $state({
    id: '',
    isZoomImgLoaded: false,
    imgEl: null,
    loadedImgEl: null,
    modalState: ModalState.UNLOADED
  });

  let ref_content = $state<HTMLDivElement | null>(null);
  let ref_dialog = $state<HTMLDialogElement | null>(null);

  const id_modal = `rmiz-modal-${_state.id}`;
  const id_modal_img = `rmiz-modal-img-${_state.id}`;

  const data_content_state = has_image() ? 'found' : 'not-found';

  // ==================================================

  onMount(() => {
    set_id();
  });

  // ==================================================

  /**
   * Because of SSR, set a unique ID after render
   */
  function set_id() {
    _state.id = generate_id();
  }

  /**
   * Check if we have a loaded image to work with
   */
  function has_image() {
    return (
      _state.imgEl &&
      _state.loadedImgEl &&
      window.getComputedStyle(_state.imgEl).display !== 'none'
    );
  }
</script>

<div aria-owns={id_modal} data-smiz="">
  <div data-rmiz-content={data_content_state} bind:this={ref_content}>
    {@render children()}
  </div>
  {#if has_image()}
    <dialog
      aria-labelledby={id_modal_img}
      aria-modal="true"
      class={dialogClass}
      data-smiz-modal=""
      id={id_modal}
      bind:this={ref_dialog}
      use:portal={get_dialog_container()}
    ></dialog>
  {/if}
</div>
