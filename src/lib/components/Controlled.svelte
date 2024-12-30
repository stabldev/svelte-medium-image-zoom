<script lang="ts">
  import type { ControlledProps } from '$lib/types.js';
  import {
    generate_id,
    get_dialog_container,
    test_img,
    test_img_loaded
  } from '$lib/utils.js';
  import { onMount, tick } from 'svelte';
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
  let ref_modal_content = $state<HTMLDivElement | null>(null);

  const id_modal = $derived(`smiz-modal-${_state.id}`);
  const id_modal_img = $derived(`smiz-modal-img-${_state.id}`);

  const data_content_state = $derived(has_image() ? 'found' : 'not-found');
  const data_overlay_state = $derived.by(() =>
    _state.modalState === ModalState.UNLOADED || _state.modalState === ModalState.UNLOADING
      ? 'hidden'
      : 'visible'
  );

  // ==================================================

  onMount(async () => {
    await set_and_track_img();
    handle_img_load();

    // because of SSR, set a unique ID after render
    _state.id = generate_id();
  });

  // ==================================================

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

  /**
   * Find and set the image we're working with
   */
  async function set_and_track_img() {
    // wait for the DOM to update
    await tick();

    if (!ref_content) return;
    _state.imgEl = ref_content.querySelector(
      'img:not([aria-hidden="true"])'
    ) as HTMLImageElement;

    // track
  }

  /**
   * Ensure we always have the latest img src value loaded
   */
  function handle_img_load() {
    if (!_state.imgEl) return;

    const img_src = _state.imgEl.currentSrc;
    if (!img_src) return;

    const img = new Image();

    if (test_img(_state.imgEl)) {
      img.sizes = _state.imgEl.sizes;
      img.srcset = _state.imgEl.srcset;
    }

    // img.src must be set after sizes and srcset
    // because of Firefox flickering on zoom
    img.src = img_src;

    const set_loaded = () => {
      _state.loadedImgEl = img;
    };

    img
      .decode()
      .then(set_loaded)
      .catch(() => {
        if (test_img_loaded(img)) {
          set_loaded();
          return;
        }
        img.onload = set_loaded;
      });
  }
</script>

<div aria-owns={id_modal} data-smiz="">
  <div data-smiz-content={data_content_state} bind:this={ref_content}>
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
    >
      <div data-smiz-modal-overlay={data_overlay_state}></div>
      <div data-smiz-modal-content="" bind:this={ref_modal_content}>
        <img
          alt={_state.imgEl?.alt}
          src={_state.imgEl?.currentSrc}
          srcset={_state.imgEl?.srcset}
          sizes={_state.imgEl?.sizes}
          data-smiz-modal-img=""
          id={id_modal_img}
        />
      </div>
    </dialog>
  {/if}
</div>
