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

export const test_div = (el: unknown): el is HTMLDivElement | HTMLSpanElement =>
  test_el_type('DIV', el) || test_el_type('SPAN', el);
export const test_img = (el: unknown): el is HTMLImageElement => test_el_type('IMG', el);
export const test_img_loaded = (el: HTMLImageElement) =>
  el.complete && el.naturalHeight !== 0;

// ==================================================

const URL_REGEX = /url(?:\(['"]?)(.*?)(?:['"]?\))/;

export interface GetImgSrc {
  (img_el: SupportedImage | null): string | undefined;
}

export const get_img_src: GetImgSrc = (img_el) => {
  if (img_el) {
    if (test_img(img_el)) {
      return img_el.currentSrc;
    } else if (test_div(img_el)) {
      const bg_img = window.getComputedStyle(img_el).backgroundImage;

      if (bg_img) {
        return URL_REGEX.exec(bg_img)?.[1];
      }
    }
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

export interface ParsePosition {
  (data: {
    position: string,
    relative_num: number
  }): number
}

export const parse_position: ParsePosition = ({ position, relative_num }) => {
  const position_num = parseFloat(position)

  return position.endsWith('%')
    ? relative_num * position_num / 100
    : position_num
}

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

export interface GetImgObjectFitStyle {
  (data: {
    container_height: number,
    container_left: number,
    container_top: number,
    container_width: number,
    object_fit: string,
    object_position: string,
    offset: number,
    target_height: number,
    target_width: number,
  }): string
}

export const get_img_object_fit_style: GetImgObjectFitStyle = ({
  container_height,
  container_left,
  container_top,
  container_width,
  object_fit,
  object_position,
  offset,
  target_height,
  target_width
}) => {
  if (object_fit === 'scale-down') {
    if (target_width <= container_width && target_height <= container_height) {
      object_fit = 'none'
    } else {
      object_fit = 'contain'
    }
  }

  if (object_fit === 'cover' || object_fit === 'contain') {
    const width_ratio = container_width / target_width;
    const height_ratio = container_height / target_height;

    const ratio = object_fit === 'cover'
      ? Math.max(width_ratio, height_ratio)
      : Math.min(width_ratio, height_ratio)

    const [pos_left = '50%', pos_top = '50%'] = object_position.split(' ')
    const pos_x = parse_position({ position: pos_left, relative_num: container_width - target_width * ratio })
    const pos_y = parse_position({ position: pos_top, relative_num: container_height - target_height * ratio })

    const scale = getScale({
      container_height: target_height * ratio,
      container_width: target_width * ratio,
      offset,
      target_height,
      target_width,
    })

    return `top: ${container_top}px;
          left: ${container_left}px;
          width: ${container_width * scale}px;
          height: ${container_height * scale}px;
          transform: translate(0,0) scale(${1 / scale});`;
  } else if (object_fit === 'none') {
    const [pos_left = '50%', pos_top = '50%'] = object_position.split(' ')
    const pos_x = parse_position({ position: pos_left, relative_num: container_width - target_width })
    const pos_y = parse_position({ position: pos_top, relative_num: container_height - target_height })

    const scale = getScale({
      container_height: target_height,
      container_width: target_width,
      offset,
      target_height,
      target_width,
    })

    return `top: ${container_top + pos_y}px;
          left: ${container_left + pos_x}px;
          width: ${container_width * scale}px;
          height: ${container_height * scale}px;
          transform: translate(0,0) scale(${1 / scale});`;
  } else if (object_fit === 'fill') {
    const width_ratio = container_width / target_width
    const height_ratio = container_height / target_height
    const ratio = Math.max(width_ratio, height_ratio)

    const scale = getScale({
      container_height: target_height * ratio,
      container_width: target_width * ratio,
      offset,
      target_height,
      target_width,
    })

    return `width: ${container_width * scale}px;
          height: ${container_height * scale}px;
          transform: translate(0,0) scale(${1 / scale});`;
  } else {
    return ''
  }
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

  const is_div_img = loaded_img_el != null && test_div(target_el)
  const is_img_object_fit = loaded_img_el != null && !is_div_img

  const style_img_regular = get_img_regular_style({
    container_height: img_rect.height,
    container_width: img_rect.width,
    container_top: img_rect.top,
    container_left: img_rect.left,
    offset,
    target_height: loaded_img_el?.naturalHeight || img_rect.height,
    target_width: loaded_img_el?.naturalWidth || img_rect.width,
  })

  return ''
}
