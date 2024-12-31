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
