import type { Nullable, SupportedImage } from './types.js';

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

interface ScaleToWindowParams {
  width: number;
  height: number;
  offset: number;
}

const get_scale_to_window = ({ height, offset, width }: ScaleToWindowParams): number => {
  return Math.min(
    (window.innerWidth - offset * 2) / width, // scale X-axis
    (window.innerHeight - offset * 2) / height // scale Y-axis
  );
};

// ==================================================

interface ScaleToWindowMaxParams extends ScaleToWindowParams {
  container_height: number;
  container_width: number;
}

const get_scale_to_window_max = ({
  container_height,
  container_width,
  height,
  width,
  offset
}: ScaleToWindowMaxParams): number => {
  const scale = get_scale_to_window({
    height,
    width,
    offset
  });

  // gets ratio to ensure scaling respects the container
  const ratio = Math.max(width / container_width, height / container_height);

  return scale > 1 ? ratio : scale * ratio;
};

// ==================================================

interface ScaleParams extends ScaleToWindowMaxParams { }

const get_scale = ({
  container_height,
  container_width,
  height,
  width,
  offset
}: ScaleParams): number => {
  if (!container_height || !container_width) {
    return 1;
  }

  return get_scale_to_window_max({
    container_height,
    container_width,
    height,
    width,
    offset
  });
};

// ==================================================

interface RegularStyleParams extends ScaleParams {
  container_left: number;
  container_top: number;
}

const get_img_regular_style = ({
  container_height,
  container_left,
  container_top,
  container_width,
  height,
  width,
  offset
}: RegularStyleParams): Record<string, string> => {
  const scale = get_scale({
    container_height: container_height,
    container_width: container_width,
    height,
    width,
    offset
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

interface ModalImgStyleParams {
  is_zoomed: boolean;
  loaded_img_el: HTMLImageElement | null;
  offset: number;
  target_el: SupportedImage;
  should_refresh: boolean;
}

export const get_style_modal_img = ({
  is_zoomed,
  loaded_img_el,
  offset,
  target_el,
  should_refresh
}: ModalImgStyleParams): Record<string, string> => {
  const img_rect = target_el.getBoundingClientRect();
  // const target_el_computed_style = window.getComputedStyle(target_el)

  const width = loaded_img_el?.naturalWidth || img_rect.width;
  const height = loaded_img_el?.naturalHeight || img_rect.height;

  const style_img_regular = get_img_regular_style({
    container_height: img_rect.height,
    container_width: img_rect.width,
    container_top: img_rect.top,
    container_left: img_rect.left,
    height,
    width,
    offset
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

    // for scenarios like resizing the browser window
    if (should_refresh) {
      style['transition-duration'] = '0.01ms';
    }

    style.transform = `translate(${translate_x}px,${translate_y}px) scale(1)`;
  }

  return style;
};

// ==================================================

interface GhostStyleParams {
  img_el: Nullable<SupportedImage>;
}

export const get_style_ghost = (
  img_el: GhostStyleParams['img_el']
): Record<string, string> => {
  if (!img_el) return {};

  return {
    height: `${img_el.offsetHeight}px`,
    width: `${img_el.offsetWidth}px`,
    top: `${img_el.offsetTop}px`,
    left: `${img_el.offsetLeft}px`
  };
};
