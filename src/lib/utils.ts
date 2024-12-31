import type { SupportedImage } from './types.js';

/**
 * Generate random string id with given segments and length
 * @params
 * segments: string = 3
 * length: string = 4
 */
export const generate_id = (segments = 3, length = 4) =>
  Array.from({ length: segments }, () => Math.random().toString(16).slice(-length)).join(
    ''
  );

/**
 * Find or create a container for the dialog
 */
export const get_dialog_container = (): HTMLElement => {
  let el = document.querySelector('[data-smiz-portal]');

  if (el == null) {
    el = document.createElement('div');
    el.setAttribute('data-smiz-portal', '');
    document.body.appendChild(el);
  }

  return el as HTMLDivElement;
};

// ==================================================

interface TestElType {
  (type: string, e: unknown): boolean;
}

const test_el_type: TestElType = (type, el) => {
  return type === (el as Element)?.tagName?.toUpperCase();
};

export const test_img = (el: unknown): el is HTMLImageElement => test_el_type('IMG', el);
export const test_img_loaded = (el: HTMLImageElement) =>
  el.complete && el.naturalHeight !== 0;

// ==================================================

export interface GetImgSrc {
  (img_el: SupportedImage | null): string | undefined;
}

export const get_img_src: GetImgSrc = (img_el) => {
  if (img_el && test_img(img_el)) {
    return img_el.currentSrc;
  }
};

export interface GetImgAlt {
  (img_el: SupportedImage | null): string | undefined;
}

export const get_img_alt: GetImgAlt = (img_el) => {
  if (img_el) {
    if (test_img(img_el)) {
      return img_el.alt ?? undefined;
    } else {
      return img_el.getAttribute('aria-label') ?? undefined;
    }
  }
};

// ==================================================

export interface GetScaleToWindow {
  (data: {
    width: number,
    height: number,
    offset: number
  }): number
}

export const get_scale_to_window: GetScaleToWindow = ({ height, offset, width }) => {
  return Math.min(
    (window.innerWidth - offset * 2) / width, // scale X-axis
    (window.innerHeight - offset * 2) / height // scale Y-axis
  )
}

// ==================================================

export interface GetScaleToWindowMax {
  (data: {
    container_height: number,
    container_width: number,
    offset: number,
    target_height: number,
    target_width: number,
  }): number
}

export const get_scale_to_window_max: GetScaleToWindowMax = ({
  container_height,
  container_width,
  offset,
  target_height,
  target_width,
}) => {
  const scale = get_scale_to_window({
    height: target_height,
    offset,
    width: target_width,
  })

  const ratio = target_width > target_height
    ? target_width / container_width
    : target_height / container_height

  return scale > 1 ? ratio : scale * ratio
}

// ==================================================

export interface GetScale {
  (data: {
    container_height: number,
    container_width: number,
    offset: number,
    target_height: number,
    target_width: number,
  }): number
}

export const getScale: GetScale = ({
  container_height,
  container_width,
  offset,
  target_height,
  target_width,
}) => {
  if (!container_height || !container_width) {
    return 1
  }

  return target_height && target_width
    ? get_scale_to_window_max({
      container_height,
      container_width,
      offset,
      target_height,
      target_width,
    })
    : get_scale_to_window({
      height: container_height,
      offset,
      width: container_width,
    })
}

// ==================================================

export interface GetImgRegularStyle {
  (data: {
    container_height: number,
    container_left: number,
    container_top: number,
    container_width: number,
    offset: number,
    target_height: number,
    target_width: number,
  }): string
}

export const get_img_regular_style: GetImgRegularStyle = ({
  container_height,
  container_left,
  container_top,
  container_width,
  offset,
  target_height,
  target_width,
}) => {
  const scale = getScale({
    container_height: container_height,
    container_width: container_width,
    offset,
    target_height: target_height,
    target_width: target_width,
  })

  return `top: ${container_top}px;
          left: ${container_left}px;
          width: ${container_width * scale}px;
          height: ${container_height * scale}px;
          transform: translate(0,0) scale(${1 / scale});`;
}

// ==================================================

export interface GetStyleModalImg {
  (data: {
    has_zoom_img: boolean,
    img_src: string | undefined,
    is_zoomed: boolean,
    loaded_img_el: HTMLImageElement | undefined,
    offset: number,
    target_el: SupportedImage,
  }): string
}

export const get_style_modal_img: GetStyleModalImg = ({
  has_zoom_img,
  img_src,
  is_zoomed,
  loaded_img_el,
  offset,
  target_el
}) => {
  const img_rect = target_el.getBoundingClientRect()
  const target_el_computed_style = window.getComputedStyle(target_el)

  const style_img_regular = get_img_regular_style({
    container_height: img_rect.height,
    container_width: img_rect.width,
    container_top: img_rect.top,
    container_left: img_rect.left,
    offset,
    target_height: loaded_img_el?.naturalHeight || img_rect.height,
    target_width: loaded_img_el?.naturalWidth || img_rect.width,
  })

  const style = Object.assign({}, style_img_regular)

  return ''
}
