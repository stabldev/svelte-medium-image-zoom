/**
 * Generate random string id with given segments and length
 * @params
 * segments: string = 3
 * length: string = 4
*/
export const generate_id = (segments = 3, length = 4) =>
  Array.from({ length: segments }, () =>
    Math.random().toString(16).slice(-length)
  ).join('')

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
}

// ==================================================

interface TestElType {
  (type: string, e: unknown): boolean;
}

const test_el_type: TestElType = (type, el) => {
  return type === (el as Element).tagName.toUpperCase()
}

export const test_img = (el: unknown): el is HTMLImageElement => test_el_type('IMG', el)
export const test_img_loaded = (el: HTMLImageElement) => el.complete && el.naturalHeight !== 0
