<script lang="ts">
  import type { BodyAttrs, ControlledProps, Nullable, SupportedImage } from '$lib/types.js';
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
  import { onDestroy, onMount, tick, untrack } from 'svelte';
  import { portal } from 'svelte-portal';

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

  // ==================================================

  let {
    children,
    dialogClass: dialog_class,
    isZoomed: is_zoomed = false,
    onZoomChange: on_zoom_change,
    wrapElement: wrap_element = 'div',
    zoomMargin: zoom_margin = 0
  }: ControlledProps = $props();

  let _id = $state('');
  let img_el = $state<Nullable<SupportedImage>>(null);
  let loaded_img_el = $state<Nullable<HTMLImageElement>>(null);
  let modal_state = $state<IModalState>(ModalState.UNLOADED);

  let ref_content = $state<Nullable<HTMLDivElement>>(null);
  let ref_dialog = $state<Nullable<HTMLDialogElement>>(null);
  let ref_modal_content = $state<Nullable<HTMLDivElement>>(null);
  let ref_modal_img = $state<Nullable<HTMLImageElement>>(null);

  let prev_body_attrs = $state(default_body_attrs);
  let timeout_transition_end = $state<ReturnType<typeof setTimeout> | undefined>();

  const id_modal = $derived(`smiz-modal-${_id}`);
  const id_modal_img = $derived(`smiz-modal-img-${_id}`);

  const is_modal_active = $derived(
    modal_state === ModalState.LOADING || modal_state === ModalState.LOADED
  );

  const data_content_state = $derived(has_image() ? 'found' : 'not-found');
  const data_overlay_state = $derived.by(() =>
    modal_state === ModalState.UNLOADED || modal_state === ModalState.UNLOADING
      ? 'hidden'
      : 'visible'
  );

  const img_alt = $derived(get_img_alt(img_el));
  const img_src = $derived(get_img_src(img_el));
  const img_sizes = $derived(test_img(img_el) ? img_el.sizes : undefined);
  const img_srcset = $derived(test_img(img_el) ? img_el.srcset : undefined);

  const style_modal_img_obj = $derived(
    has_image()
      ? get_style_modal_img({
          is_zoomed: is_zoomed && is_modal_active,
          loaded_img_el,
          offset: zoom_margin,
          target_el: img_el as SupportedImage
        })
      : {}
  );
  const style_modal_img_string = $derived(style_obj_to_css_string(style_modal_img_obj));

  // ==================================================

  onMount(async () => {
    await set_and_track_img();
    handle_img_load();

    // because of SSR, set a unique ID after render
    _id = generate_id();
  });

  onDestroy(() => {
    img_el?.removeEventListener('load', handle_img_load);
    img_el?.removeEventListener('click', handle_zoom);
  });

  // handle modal_state changes
  $effect(() => {
    if (modal_state === ModalState.LOADING) {
      document.addEventListener('keydown', handle_key_down, true);
    } else if (modal_state === ModalState.LOADED) {
      window.addEventListener('wheel', handle_wheel, { passive: true });
    } else if (modal_state === ModalState.UNLOADING) {
      ensure_img_transition_end();
      window.removeEventListener('wheel', handle_wheel);
      document.removeEventListener('keydown', handle_key_down, true);
    } else if (modal_state === ModalState.UNLOADED) {
      untrack(() => body_scroll_enable());
      ref_modal_img?.removeEventListener('transitionend', handle_img_transition_end);
      ref_dialog?.close();
    }
  });

  // handle isZoomed changes
  $effect(() => {
    if (is_zoomed && modal_state === ModalState.UNLOADED) {
      untrack(() => zoom());
    } else if (!is_zoomed && modal_state === ModalState.LOADED) {
      untrack(() => unzoom());
    }
  });

  // ==================================================

  /**
   * Debounce modal_state updates, prevents re-triggering updates.
   */
  function set_modal_state(new_state: IModalState) {
    if (modal_state !== new_state) {
      modal_state = new_state;
    }
  }

  /**
   * Check if we have a loaded image to work with
   */
  function has_image() {
    return img_el && loaded_img_el && window.getComputedStyle(img_el).display !== 'none';
  }

  /**
   * Find and set the image we're working with
   */
  async function set_and_track_img() {
    // wait for the DOM to update
    await tick();

    if (!ref_content) return;
    img_el = ref_content.querySelector(IMAGE_QUERY) as SupportedImage | null;

    if (img_el) {
      img_el.addEventListener('load', handle_img_load);
      img_el.addEventListener('click', handle_zoom);

      if (!loaded_img_el) {
        handle_img_load();
      }
    }

    // track
  }

  /**
   * Ensure we always have the latest img src value loaded
   */
  function handle_img_load() {
    if (!img_el) return;

    const img_src = get_img_src(img_el);
    if (!img_src) return;

    const img = new Image();

    if (test_img(img_el)) {
      img.sizes = img_el.sizes;
      img.srcset = img_el.srcset;
    }

    // img.src must be set after sizes and srcset
    // because of Firefox flickering on zoom
    img.src = img_src;

    const set_loaded = () => {
      loaded_img_el = img;
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
   * Report that zooming should occur
   */
  function handle_zoom() {
    if (has_image()) {
      on_zoom_change?.(true);
    }
  }

  /**
   * Report that unzooming should occur
   */
  function handle_unzoom() {
    on_zoom_change?.(false);
  }

  /**
   * Capture click event when clicking unzoom button
   */
  function handle_unzoom_btn_click(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    handle_unzoom();
  }

  /**
   * Prevent the browser from removing the dialog on Escape
   */
  function handle_dialog_cancel(e: Event) {
    e.preventDefault();
  }

  /**
   *  have dialog.click() only close in certain situations
   */
  function handle_dialog_click(e: Event) {
    if (e.target === ref_modal_content || e.target === ref_modal_img) {
      e.stopPropagation();
      handle_unzoom();
    }
  }

  /**
   *  Prevent dialog's close event from closing a parent modal
   */
  function handle_dialog_close(e: Event) {
    e.stopPropagation();
    handle_unzoom();
  }

  /**
   * Intercept default dialog.close() and use ours so we can animate
   */
  function handle_key_down(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      handle_unzoom();
    }
  }

  /**
   * Unzoom on wheel event
   */
  function handle_wheel(e: WheelEvent) {
    // don't handle the event when the user is zooming with ctrl + wheel (or with pinch to zoom)
    if (e.ctrlKey) return;

    e.stopPropagation();
    queueMicrotask(() => {
      handle_unzoom();
    });
  }

  /**
   * Perform zooming actions
   */
  function zoom() {
    body_scroll_disable();
    ref_dialog?.showModal();
    ref_modal_img?.addEventListener('transitionend', handle_img_transition_end);
    set_modal_state(ModalState.LOADING);
  }

  /**
   * Perform unzooming actions
   */
  function unzoom() {
    set_modal_state(ModalState.UNLOADING);
  }

  /**
   * Handle img zoom/unzoom transitionend events and update states:
   *   - LOADING -> LOADED
   *   - UNLOADING -> UNLOADED
   */
  function handle_img_transition_end() {
    clearTimeout(timeout_transition_end);

    if (modal_state === ModalState.LOADING) {
      modal_state = ModalState.LOADED;
    } else if (modal_state === ModalState.UNLOADING) {
      modal_state = ModalState.UNLOADED;
    }
  }

  /**
   * Ensure handle_img_transition_end gets called. Safari can have significant
   * delays before firing the event.
   */
  function ensure_img_transition_end() {
    if (ref_modal_img) {
      const td = window.getComputedStyle(ref_modal_img).transitionDuration;
      const td_float = parseFloat(td);

      if (td_float) {
        const td_ms = td_float * (td.endsWith('ms') ? 1 : 1000) + 50;
        timeout_transition_end = setTimeout(handle_img_transition_end, td_ms);
      }
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

<svelte:element this={wrap_element} aria-owns={id_modal} data-smiz="">
  <div
    data-smiz-content={data_content_state}
    bind:this={ref_content}
    style="visibility: {modal_state === ModalState.UNLOADED ? 'visible' : 'hidden'};"
  >
    {@render children()}
  </div>
  {#if has_image()}
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
    <dialog
      aria-labelledby={id_modal_img}
      aria-modal="true"
      class={dialog_class}
      data-smiz-modal=""
      id={id_modal}
      bind:this={ref_dialog}
      use:portal={get_dialog_container()}
      onclick={handle_dialog_click}
      onclose={handle_dialog_close}
      oncancel={handle_dialog_cancel}
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
      </div>
    </dialog>
  {/if}
</svelte:element>
