<script lang="ts">
  import type { BodyAttrs, ControlledProps, SupportedImage } from '$lib/types.js';
  import {
    generate_id,
    get_dialog_container,
    test_img,
    test_img_loaded,
    get_img_src,
    get_img_alt,
    get_style_modal_img,
    style_obj_to_css_string
  } from '$lib/utils.js';
  import { onMount, tick } from 'svelte';
  import { portal } from 'svelte-portal';
  import IEnlarge from '$lib/components/icons/i-enlarge.svelte';
  import ICompress from '$lib/components/icons/i-compress.svelte';

  // ==================================================

  /**
   * The selector query we use to find and track the image
   */
  const IMAGE_QUERY = ['img', '[role="img"]', '[data-zoom]']
    .map((x) => `${x}:not([aria-hidden="true"])`)
    .join(',');

  /**
   * Helps keep track of some key `<body>` attributes
   * so we can remove and re-add them when disabling and
   * re-enabling body scrolling
   */
  const default_body_attrs: BodyAttrs = {
    overflow: '',
    width: ''
  };

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
    is_zoom_img_loaded: boolean;
    img_el: SupportedImage | null;
    loaded_img_el: HTMLImageElement | undefined;
    modal_state: IModalState;
  }

  // ==================================================

  let {
    a11yNameButtonUnzoom = 'Expand image',
    a11yNameButtonZoom = 'Minimize image',
    children,
    dialogClass,
    IconUnzoom = ICompress,
    IconZoom = IEnlarge,
    isZoomed,
    onZoomChange,
    wrapElement = 'div',
    zoomImg,
    zoomMargin = 0
  }: ControlledProps = $props();

  let _state: ControlledState = $state({
    id: '',
    is_zoom_img_loaded: false,
    img_el: null,
    loaded_img_el: undefined,
    modal_state: ModalState.UNLOADED
  });

  let ref_content = $state<HTMLDivElement | null>(null);
  let ref_dialog = $state<HTMLDialogElement | null>(null);
  let ref_modal_content = $state<HTMLDivElement | null>(null);
  let ref_modal_img = $state<HTMLImageElement | null>(null);

  let prev_body_attrs = $state(default_body_attrs);

  const id_modal = $derived(`smiz-modal-${_state.id}`);
  const id_modal_img = $derived(`smiz-modal-img-${_state.id}`);

  const has_zoom_img = $derived(!!zoomImg?.src);
  const is_modal_active = $derived(
    _state.modal_state === ModalState.LOADING || _state.modal_state === ModalState.LOADED
  );

  const data_content_state = $derived(has_image() ? 'found' : 'not-found');
  const data_overlay_state = $derived.by(() =>
    _state.modal_state === ModalState.UNLOADED ||
    _state.modal_state === ModalState.UNLOADING
      ? 'hidden'
      : 'visible'
  );

  const img_alt = $derived(get_img_alt(_state.img_el));
  const img_src = $derived(get_img_src(_state.img_el));
  const img_sizes = $derived(test_img(_state.img_el) ? _state.img_el.sizes : undefined);
  const img_srcset = $derived(test_img(_state.img_el) ? _state.img_el.srcset : undefined);

  const label_btn_zoom = $derived(
    img_alt ? `${a11yNameButtonZoom}: ${img_alt}` : a11yNameButtonZoom
  );
  const label_btn_unzoom = $derived(
    img_alt ? `${a11yNameButtonUnzoom}: ${img_alt}` : a11yNameButtonUnzoom
  );

  const style_content = $derived(
    `visibility: ${_state.modal_state === ModalState.UNLOADED ? 'visible' : 'hidden'}`
  );

  const style_modal_img_obj = $derived(
    has_image()
      ? get_style_modal_img({
          has_zoom_img,
          img_src,
          is_zoomed: isZoomed! && is_modal_active, // TODO: fix this later
          loaded_img_el: _state.loaded_img_el,
          offset: zoomMargin,
          target_el: _state.img_el as SupportedImage
        })
      : {}
  );
  const style_modal_img_string = $derived(style_obj_to_css_string(style_modal_img_obj));

  $inspect(style_modal_img_obj);

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
      _state.img_el &&
      _state.loaded_img_el &&
      window.getComputedStyle(_state.img_el).display !== 'none'
    );
  }

  /**
   * Find and set the image we're working with
   */
  async function set_and_track_img() {
    // wait for the DOM to update
    await tick();

    if (!ref_content) return;
    _state.img_el = ref_content.querySelector(IMAGE_QUERY) as SupportedImage | null;

    // track
  }

  /**
   * Ensure we always have the latest img src value loaded
   */
  function handle_img_load() {
    if (!_state.img_el) return;

    const img_src = get_img_src(_state.img_el);
    if (!img_src) return;

    const img = new Image();

    if (test_img(_state.img_el)) {
      img.sizes = _state.img_el.sizes;
      img.srcset = _state.img_el.srcset;
    }

    // img.src must be set after sizes and srcset
    // because of Firefox flickering on zoom
    img.src = img_src;

    const set_loaded = () => {
      _state.loaded_img_el = img;
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

  /**
   * Perform zooming actions
   */
  function zoom() {
    body_scroll_disable();
    ref_dialog?.showModal();
    ref_modal_img?.addEventListener('transitionend', handle_img_transition_end);
    _state.modal_state = ModalState.LOADING;
  }

  /**
   * Perform unzooming actions
   */
  function unzoom() {
    _state.modal_state = ModalState.UNLOADING;
  }

  /**
   * Handle img zoom/unzoom transitionend events and update states:
   *   - LOADING -> LOADED
   *   - UNLOADING -> UNLOADED
   */
  function handle_img_transition_end() {
    //
    if (_state.modal_state === ModalState.LOADING) {
      _state.modal_state = ModalState.LOADED;
    } else if (_state.modal_state === ModalState.UNLOADING) {
      _state.modal_state = ModalState.UNLOADED;
    }
  }

  /**
   * Disable body scrolling
   */
  function body_scroll_disable() {
    prev_body_attrs = {
      overflow: document.body.style.overflow,
      width: document.body.style.width
    };

    // get clientWidth before setting overflow: 'hidden'
    const client_width = document.body.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.width = `${client_width}px`;
  }

  /**
   * Enable body scrolling
   */
  function body_scroll_enable() {
    document.body.style.width = prev_body_attrs.width;
    document.body.style.overflow = prev_body_attrs.overflow;
    prev_body_attrs = default_body_attrs;
  }
</script>

<svelte:element this={wrapElement} aria-owns={id_modal} data-smiz="">
  <div data-smiz-content={data_content_state} bind:this={ref_content} style={style_content}>
    {@render children()}
  </div>
  {#if has_image()}
    <svelte:element this={wrapElement} data-smiz-ghost="">
      <button aria-label={label_btn_zoom} data-smiz-btn-zoom="" type="button">
        <IconZoom />
      </button>
    </svelte:element>
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
          alt={img_alt}
          src={img_src}
          srcset={img_srcset}
          sizes={img_sizes}
          data-smiz-modal-img=""
          id={id_modal_img}
          style={style_modal_img_string}
          width={style_modal_img_obj.width}
          height={style_modal_img_obj.height}
          bind:this={ref_modal_img}
        />
        <button aria-label={a11yNameButtonUnzoom} data-smiz-btn-unzoom="" type="button">
          <IconUnzoom />
        </button>
      </div>
    </dialog>
  {/if}
</svelte:element>
