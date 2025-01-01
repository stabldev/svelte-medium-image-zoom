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

/**
 * Convert style object to css string
 * @params
 * style: string;
 * style = { top: 100px } => "top: 100px;"
 */
export const style_obj_to_css_string = (style: Record<string, string>) => {
  return Object.entries(style)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
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

interface GetImgSrc {
  (img_el: SupportedImage | null): string | undefined;
}

export const get_img_src: GetImgSrc = (img_el) => {
  if (img_el && test_img(img_el)) {
    return img_el.currentSrc;
  }
};

interface GetImgAlt {
  (img_el: SupportedImage | null): string | undefined;
}

export const get_img_alt: GetImgAlt = (img_el) => {
  if (img_el && test_img(img_el)) {
    return img_el.alt ?? undefined;
  }
};

// ==================================================

interface GetScaleToWindow {
  (data: { width: number; height: number; offset: number }): number;
}

const get_scale_to_window: GetScaleToWindow = ({ height, offset, width }) => {
  return Math.min(
    (window.innerWidth - offset * 2) / width, // scale X-axis
    (window.innerHeight - offset * 2) / height // scale Y-axis
  );
};

// ==================================================

interface GetScaleToWindowMax {
  (data: {
    container_height: number;
    container_width: number;
    offset: number;
    target_height: number;
    target_width: number;
  }): number;
}

const get_scale_to_window_max: GetScaleToWindowMax = ({
  container_height,
  container_width,
  offset,
  target_height,
  target_width
}) => {
  const scale = get_scale_to_window({
    height: target_height,
    offset,
    width: target_width
  });

  const ratio =
    target_width > target_height
      ? target_width / container_width
      : target_height / container_height;

  return scale > 1 ? ratio : scale * ratio;
};

// ==================================================

interface GetScale {
  (data: {
    container_height: number;
    container_width: number;
    offset: number;
    target_height: number;
    target_width: number;
  }): number;
}

const get_scale: GetScale = ({
  container_height,
  container_width,
  offset,
  target_height,
  target_width
}) => {
  if (!container_height || !container_width) {
    return 1;
  }

  return target_height && target_width
    ? get_scale_to_window_max({
        container_height,
        container_width,
        offset,
        target_height,
        target_width
      })
    : get_scale_to_window({
        height: container_height,
        offset,
        width: container_width
      });
};

// ==================================================

interface GetImgRegularStyle {
  (data: {
    container_height: number;
    container_left: number;
    container_top: number;
    container_width: number;
    offset: number;
    target_height: number;
    target_width: number;
  }): Record<string, string>;
}

const get_img_regular_style: GetImgRegularStyle = ({
  container_height,
  container_left,
  container_top,
  container_width,
  offset,
  target_height,
  target_width
}) => {
  const scale = get_scale({
    container_height: container_height,
    container_width: container_width,
    offset,
    target_height: target_height,
    target_width: target_width
  });

  return {
    top: `${container_top}px`,
    left: `${container_left}px`,
    width: `${container_width * scale}px`,
    height: `${container_height * scale}px`,
    transform: `translate(0, 0) scale(${1 / scale})`
  };
};

// ==================================================

interface GetStyleModalImg {
  (data: {
    is_zoomed: boolean;
    loaded_img_el: HTMLImageElement | null;
    offset: number;
    target_el: SupportedImage;
  }): Record<string, string>;
}

export const get_style_modal_img: GetStyleModalImg = ({
  is_zoomed,
  loaded_img_el,
  offset,
  target_el
}) => {
  const img_rect = target_el.getBoundingClientRect();
  // const target_el_computed_style = window.getComputedStyle(target_el)

  const style_img_regular = get_img_regular_style({
    container_height: img_rect.height,
    container_width: img_rect.width,
    container_top: img_rect.top,
    container_left: img_rect.left,
    offset,
    target_height: loaded_img_el?.naturalHeight || img_rect.height,
    target_width: loaded_img_el?.naturalWidth || img_rect.width
  });

  const style = Object.assign({}, style_img_regular);

  if (is_zoomed) {
    const viewport_x = window.innerWidth / 2;
    const viewport_y = window.innerHeight / 2;

    const child_center_x =
      parseFloat(String(style.left || 0)) + parseFloat(String(style.width || 0)) / 2;
    const child_center_y =
      parseFloat(String(style.top || 0)) + parseFloat(String(style.height || 0)) / 2;

    const translate_x = viewport_x - child_center_x;
    const translate_y = viewport_y - child_center_y;

    style.transform = `translate(${translate_x}px,${translate_y}px) scale(1)`;
  }

  return style;
};
